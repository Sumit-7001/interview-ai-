import React, { useRef, useEffect, useState } from 'react';
import { Camera, CameraOff, AlertCircle } from 'lucide-react';
import API from '../services/api';

const CameraPanel = ({ isRecording, onEmotionUpdate, onEyeContactUpdate }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [permissionError, setPermissionError] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('Neutral');
  const [eyeContactScore, setEyeContactScore] = useState(90);
  const [lookingAway, setLookingAway] = useState(false);
  const [eyesOpen, setEyesOpen] = useState(true);

  const isRecordingRef = useRef(isRecording);
  const eyesOpenRef = useRef(eyesOpen);
  const eyeContactScoreRef = useRef(eyeContactScore);
  const onEyeContactUpdateRef = useRef(onEyeContactUpdate);
  const lastNotifiedScoreRef = useRef(null);

  const [faceDetected, setFaceDetected] = useState(true);
  const faceDetectedRef = useRef(faceDetected);
  const lookingAwayRef = useRef(lookingAway);

  // Keep refs up-to-date
  useEffect(() => {
    isRecordingRef.current = isRecording;
    eyesOpenRef.current = eyesOpen;
    faceDetectedRef.current = faceDetected;
    lookingAwayRef.current = lookingAway;
    onEyeContactUpdateRef.current = onEyeContactUpdate;
  }, [isRecording, eyesOpen, faceDetected, lookingAway, onEyeContactUpdate]);

  // Start Webcam
  const streamRef = useRef(null);
  useEffect(() => {
    const startWebcam = async () => {
      try {
        setPermissionError(false);
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 },
          audio: false 
        });
        streamRef.current = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Webcam access error:", err);
        setPermissionError(true);
      }
    };
    startWebcam();

    return () => {
      // Cleanup: stop all camera tracks on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Canvas Scanlines & Tracking Visualizer
  useEffect(() => {
    let animationId;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video) return;
    const ctx = canvas.getContext('2d');
    
    const drawFaceOutline = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dynamic colors based on real detection
        let primaryColor = 'rgba(124, 58, 237, 0.4)';  // Primary purple
        let cornerColor = 'rgba(124, 58, 237, 0.85)';
        
        if (!faceDetectedRef.current) {
          primaryColor = 'rgba(239, 68, 68, 0.4)';     // Red - no face
          cornerColor = 'rgba(239, 68, 68, 0.9)';
        } else if (lookingAwayRef.current) {
          primaryColor = 'rgba(245, 158, 11, 0.4)';    // Amber - look away
          cornerColor = 'rgba(245, 158, 11, 0.9)';
        } else if (isRecordingRef.current) {
          primaryColor = 'rgba(34, 197, 94, 0.4)';     // Green - good eye contact
          cornerColor = 'rgba(34, 197, 94, 0.9)';
        }
        
        // Center Target box
        const boxWidth = 240;
        const boxHeight = 280;
        const boxX = (canvas.width - boxWidth) / 2;
        const boxY = (canvas.height - boxHeight) / 2;
        
        // Draw target bounding box
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
        
        // Draw corners highlight
        ctx.strokeStyle = cornerColor;
        ctx.lineWidth = 3.5;
        
        // Top Left corner
        ctx.beginPath();
        ctx.moveTo(boxX, boxY + 25);
        ctx.lineTo(boxX, boxY);
        ctx.lineTo(boxX + 25, boxY);
        ctx.stroke();
        
        // Top Right corner
        ctx.beginPath();
        ctx.moveTo(boxX + boxWidth, boxY + 25);
        ctx.lineTo(boxX + boxWidth, boxY);
        ctx.lineTo(boxX + boxWidth - 25, boxY);
        ctx.stroke();
        
        // Bottom Left corner
        ctx.beginPath();
        ctx.moveTo(boxX, boxY + boxHeight - 25);
        ctx.lineTo(boxX, boxY + boxHeight);
        ctx.lineTo(boxX + 25, boxY + boxHeight);
        ctx.stroke();
        
        // Bottom Right corner
        ctx.beginPath();
        ctx.moveTo(boxX + boxWidth, boxY + boxHeight - 25);
        ctx.lineTo(boxX + boxWidth, boxY + boxHeight);
        ctx.lineTo(boxX + boxWidth - 25, boxY + boxHeight);
        ctx.stroke();
        
        // Draw vertical scanning line (slow vertical cycle)
        const scanlineY = boxY + (Math.sin(Date.now() / 500) + 1) * (boxHeight / 2);
        ctx.strokeStyle = isRecordingRef.current ? 'rgba(236, 72, 153, 0.5)' : 'rgba(124, 58, 237, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(boxX + 5, scanlineY);
        ctx.lineTo(boxX + boxWidth - 5, scanlineY);
        ctx.stroke();
      }
      animationId = requestAnimationFrame(drawFaceOutline);
    };
    
    drawFaceOutline();
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [videoRef, canvasRef]);

  // Periodic Real-Time Computer Vision Analysis (Every 1.5 seconds during recording)
  useEffect(() => {
    let intervalId;
    let isAnalyzing = false;

    if (isRecording && stream) {
      intervalId = setInterval(async () => {
        if (isAnalyzing || !videoRef.current) return;
        isAnalyzing = true;

        try {
          const canvas = document.createElement('canvas');
          canvas.width = 320;
          canvas.height = 240;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(videoRef.current, 0, 0, 320, 240);
          const frameBase64 = canvas.toDataURL('image/jpeg', 0.75);

          const res = await API.post('/api/emotion/analyze', { frame: frameBase64 });
          const dominant = res.data.dominant_emotion;
          const probs = res.data.emotion_probabilities || {};
          const eyesDetected = res.data.eyes_detected !== false;
          const isFaceDetected = res.data.face_detected !== false;
          const backendEyeScore = typeof res.data.eye_contact_score === 'number' 
            ? res.data.eye_contact_score 
            : (eyesDetected ? 88.0 : 40.0);

          setFaceDetected(isFaceDetected);
          setEyesOpen(eyesDetected);

          if (!isFaceDetected) {
            setCurrentEmotion('No Face');
            setLookingAway(true);
            const score = Math.max(10, Math.round(eyeContactScoreRef.current * 0.7));
            eyeContactScoreRef.current = score;
            setEyeContactScore(score);
            if (score !== lastNotifiedScoreRef.current) {
              lastNotifiedScoreRef.current = score;
              onEyeContactUpdateRef.current(score);
            }
            return;
          }

          const isAway = !eyesDetected || backendEyeScore < 65;
          setLookingAway(isAway);

          // Smoothly animate towards genuine backend eye score
          const prevScore = eyeContactScoreRef.current;
          const smoothedScore = Math.round(prevScore * 0.35 + backendEyeScore * 0.65);
          eyeContactScoreRef.current = smoothedScore;
          setEyeContactScore(smoothedScore);

          if (smoothedScore !== lastNotifiedScoreRef.current) {
            lastNotifiedScoreRef.current = smoothedScore;
            onEyeContactUpdateRef.current(smoothedScore);
          }

          // Format clean capitalized emotion label
          const capDom = dominant === 'no_face'
            ? 'No Face'
            : (dominant.charAt(0).toUpperCase() + dominant.slice(1));
          setCurrentEmotion(capDom);
          onEmotionUpdate(capDom, probs);

        } catch (err) {
          console.error("Emotion analysis request failed:", err);
        } finally {
          isAnalyzing = false;
        }
      }, 1500);
    } else {
      setCurrentEmotion('Neutral');
      setEyesOpen(true);
      setFaceDetected(true);
      setLookingAway(false);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRecording, stream, onEmotionUpdate]);


  return (
    <div className="w-full h-full relative rounded-2xl bg-midnight overflow-hidden border border-midnight-border flex items-center justify-center">
      {permissionError ? (
        <div className="flex flex-col items-center gap-3 p-6 text-center text-gray-500">
          <AlertCircle size={40} className="text-red-500" />
          <h4 className="font-bold text-white text-sm">Webcam Access Blocked</h4>
          <p className="text-[11px] text-gray-400 max-w-xs">
            InterviewAI requires camera access to analyze facial alignment and expressions. Please allow permissions in your browser.
          </p>
        </div>
      ) : !stream ? (
        <div className="flex flex-col items-center gap-2 text-gray-500 animate-pulse">
          <CameraOff size={32} />
          <span className="text-xs">Initializing Webcam Stream...</span>
        </div>
      ) : (
        <>
          {/* Webcam stream */}
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover transform -scale-x-100" 
          />
          {/* Target scan overlay */}
          <canvas 
            ref={canvasRef} 
            width={640} 
            height={480} 
            className="absolute inset-0 w-full h-full pointer-events-none" 
          />
          
          {/* HUD Indicators */}
          <div className="absolute top-4 left-4 bg-midnight/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-midnight-border text-[11px] text-white flex items-center gap-1.5 shadow-premium">
            <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-ping' : 'bg-green-500'}`}></span>
            <span>{isRecording ? 'Session Live' : 'Camera Ready'}</span>
          </div>

          {/* Real-time Tracking Status Badge (Top Right) */}
          <div className="absolute top-4 right-4 bg-midnight/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-midnight-border text-[11px] font-medium flex items-center gap-1.5 shadow-premium">
            {!faceDetected ? (
              <span className="text-red-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Face Not Detected
              </span>
            ) : lookingAway ? (
              <span className="text-amber-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Looking Away
              </span>
            ) : (
              <span className="text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Face Aligned & Focused
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 text-[11px] font-semibold text-white">
            <div className="bg-midnight/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-midnight-border/60">
              Emotion: <span className="text-primary-light">{currentEmotion}</span>
            </div>
            <div className="bg-midnight/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-midnight-border/60">
              Eye Contact: <span className={!faceDetected ? "text-red-400" : lookingAway ? "text-amber-400" : "text-green-400"}>
                {!faceDetected ? "No Face (0%)" : lookingAway ? `Needs Improvement (${eyeContactScore}%)` : `Optimal (${eyeContactScore}%)`}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CameraPanel;
