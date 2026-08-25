import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Mic, 
  Square, 
  ArrowRight, 
  Video, 
  Volume2, 
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Award
} from 'lucide-react';
import API from '../services/api';
import CameraPanel from '../components/CameraPanel';
import Sidebar from '../components/Sidebar';

const InterviewRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Config form states for id === 'new'
  const [role, setRole] = useState('Software Engineer');
  const [customRole, setCustomRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Mid');
  const [interviewType, setInterviewType] = useState('Technical');
  const [creatingSession, setCreatingSession] = useState(false);
  const [hasResume, setHasResume] = useState(false);
  
  const [interview, setInterview] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Media permission screen state
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [checkingPermissions, setCheckingPermissions] = useState(true);
  
  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [currentGrading, setCurrentGrading] = useState(null);
  const [aiError, setAiError] = useState(null); // toast for AI service errors
  
  // Metrics accumulation during current question
  const [emotionsHistory, setEmotionsHistory] = useState([]);
  const [eyeContactHistory, setEyeContactHistory] = useState([]);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  
  // Browser Speech Recognition states & refs
  const [browserTranscript, setBrowserTranscript] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const recognitionRef = useRef(null);
  
  // Typing fallback mode states
  const [isTypingMode, setIsTypingMode] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState("");
  
  // Fetch Interview details
  const fetchSession = async () => {
    try {
      const res = await API.get(`/api/interviews/${id}`);
      if (res.data.status === 'completed') {
        navigate(`/reports/${id}`);
        return;
      }
      setInterview(res.data);
      
      // Determine index of first unanswered question
      const unansweredIdx = res.data.questions.findIndex(q => q.answer_text === null);
      if (unansweredIdx !== -1) {
        setCurrentQIndex(unansweredIdx);
      }
    } catch (err) {
      console.error("Failed to load interview room session:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id === 'new') {
      const checkResume = async () => {
        try {
          const resumeRes = await API.get('/api/resume');
          setHasResume(!!resumeRes.data);
        } catch (err) {
          setHasResume(false);
        } finally {
          setLoading(false);
        }
      };
      checkResume();
    } else {
      fetchSession();
    }
  }, [id]);

  // Request media permissions initially
  useEffect(() => {
    if (id === 'new') {
      setPermissionsGranted(true);
      setCheckingPermissions(false);
      return;
    }

    const checkPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        stream.getTracks().forEach(track => track.stop()); // close immediately
        setPermissionsGranted(true);
      } catch (err) {
        console.error("Permissions check failed:", err);
        setPermissionsGranted(false);
      } finally {
        setCheckingPermissions(false);
      }
    };
    checkPermissions();
  }, [id]);

  // Timer lifecycle during recording
  useEffect(() => {
    if (isRecording) {
      timerIntervalRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isRecording]);

  // Start Recording Audio
  const startAnswer = async () => {
    audioChunksRef.current = [];
    setTimer(0);
    setEmotionsHistory([]);
    setEyeContactHistory([90]); // Seed with a standard posture score
    setCurrentGrading(null);
    
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set recorder options
      let options = { mimeType: 'audio/webm' };
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        options = { mimeType: 'audio/mp4' };
      }
      
      const mediaRecorder = new MediaRecorder(audioStream, options);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: options.mimeType });
        // Stop audio tracks
        audioStream.getTracks().forEach(track => track.stop());
        
        // Post response to backend
        uploadAndGradeAnswer(audioBlob);
      };

      // Start Browser Speech Recognition in parallel
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';

        let finalTranscript = '';
        rec.onresult = (event) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          const fullTranscript = finalTranscript + interimTranscript;
          setBrowserTranscript(fullTranscript);
          setLiveTranscript(fullTranscript);
        };

        rec.onerror = (e) => {
          console.error("Speech recognition error:", e);
        };

        rec.onend = () => {
          console.log("Speech recognition ended");
        };

        recognitionRef.current = rec;
        rec.start();
      }
      
      mediaRecorder.start(1000); // chunk timeslice 1s
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone recording start failed:", err);
      alert("Microphone permission required to submit spoken answers.");
    }
  };

  const stopAnswer = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // Process and Upload recorded wav/webm to backend
  const uploadAndGradeAnswer = async (audioBlob, transcriptOverride = null) => {
    setSubmittingAnswer(true);
    
    // 1. Calculate Average emotions
    const emotionSummary = {
      neutral: 0.0, happy: 0.0, sad: 0.0, angry: 0.0, fear: 0.0, surprise: 0.0, disgust: 0.0
    };
    if (emotionsHistory.length > 0) {
      emotionsHistory.forEach(frameProbs => {
        Object.keys(frameProbs).forEach(key => {
          const lowerKey = key.toLowerCase();
          if (emotionSummary.hasOwnProperty(lowerKey)) {
            emotionSummary[lowerKey] += frameProbs[key];
          }
        });
      });
      // Normalize
      Object.keys(emotionSummary).forEach(key => {
        emotionSummary[key] = roundToTwo(emotionSummary[key] / emotionsHistory.length);
      });
    } else {
      emotionSummary["neutral"] = 100.0;
    }

    // 2. Calculate Average eye contact
    const avgEyeScore = eyeContactHistory.length > 0
      ? roundToTwo(eyeContactHistory.reduce((acc, curr) => acc + curr, 0) / eyeContactHistory.length)
      : 85.0;

    // 3. Assemble Multipart Form
    const currentQ = interview.questions[currentQIndex];
    const formData = new FormData();
    formData.append('question_id', currentQ.id);
    formData.append('eye_contact_score', avgEyeScore);
    formData.append('emotion_summary_json', JSON.stringify(emotionSummary));
    formData.append('audio', audioBlob, `q${currentQ.id}_response.webm`);
    
    const finalTranscript = transcriptOverride || browserTranscript;
    if (finalTranscript && finalTranscript.trim()) {
      formData.append('browser_transcript', finalTranscript);
    }

    try {
      const res = await API.post(`/api/interviews/${id}/answer`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setCurrentGrading(res.data);
      
      // Update local interview state
      const updatedQuestions = [...interview.questions];
      updatedQuestions[currentQIndex] = {
        ...updatedQuestions[currentQIndex],
        answer_text: res.data.answer_text,
        eye_contact_score: res.data.eye_contact_score,
        emotion_summary: res.data.emotion_summary,
        voice_metrics: res.data.voice_metrics,
        evaluation: res.data.evaluation
      };
      setInterview({ ...interview, questions: updatedQuestions });
      
    } catch (err) {
      console.error("Grading request failed:", err);
      const isServerError = err.response?.status >= 500;
      const isAiError = err.response?.status === 503;
      const msg = isAiError
        ? 'AI service temporarily unavailable. Please try again.'
        : isServerError
        ? 'Server error processing your answer. Please try again.'
        : 'Network error. Check your connection and retry.';
      setAiError(msg);
      setTimeout(() => setAiError(null), 6000);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const roundToTwo = (num) => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  };

  const handleEmotionUpdate = (dominant, probabilities) => {
    setEmotionsHistory(prev => [...prev, probabilities]);
  };

  const handleEyeContactUpdate = (score) => {
    setEyeContactHistory(prev => [...prev, score]);
  };

  const submitTypedAnswer = () => {
    if (!typedAnswer.trim()) return;
    // Create a mock tiny silent audio file for multipart payload compatibility
    const silentBlob = new Blob([new Uint8Array(100)], { type: 'audio/webm' });
    uploadAndGradeAnswer(silentBlob, typedAnswer);
  };

  const handleNextQuestion = () => {
    if (currentQIndex < interview.questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setCurrentGrading(null);
      setBrowserTranscript("");
      setLiveTranscript("");
      setTypedAnswer("");
      setIsTypingMode(false);
    }
  };

  const handleCompleteInterview = async () => {
    setLoading(true);
    try {
      await API.post(`/api/interviews/${id}/complete`);
      navigate(`/reports/${id}`);
    } catch (err) {
      console.error("Failed to complete interview session:", err);
      alert("Error completing session. Try again.");
      setLoading(false);
    }
  };

  const handleStartInterview = async (e) => {
    e.preventDefault();
    setCreatingSession(true);
    const selectedRole = role === 'Other' ? customRole : role;

    try {
      const res = await API.post('/api/interviews', {
        role: selectedRole,
        experience_level: experienceLevel,
        interview_type: interviewType
      });
      navigate(`/interview/${res.data.id}`);
    } catch (err) {
      alert("Failed to start interview. Check connection/keys.");
    } finally {
      setCreatingSession(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-gray-400">Syncing practice room session...</span>
        </div>
      </div>
    );
  }

  if (id === 'new') {
    return (
      <div className="min-h-screen flex bg-cream animate-fadeIn">
        <Sidebar />
        
        <main className="flex-1 p-8 md:p-12 overflow-y-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="font-display font-extrabold text-3xl text-midnight">Configure Mock Interview</h1>
            <p className="text-gray-500 text-sm mt-1">Set up your practice session parameters to start a tailored AI interview.</p>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-cream-border/60 shadow-premium">
            <form onSubmit={handleStartInterview} className="flex flex-col gap-6">
              {/* Target Role selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Target Job Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-cream-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white text-midnight font-medium"
                >
                  <option value="Software Engineer">Software Engineer (General)</option>
                  <option value="React Developer">React / Frontend Developer</option>
                  <option value="Python Developer">Python / Backend Developer</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="Other">Custom Role...</option>
                </select>
              </div>

              {/* Custom Role Field if selected other */}
              {role === 'Other' && (
                <div className="flex flex-col gap-1.5 animate-fadeIn">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Custom Role Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Node.js Developer"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-cream-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white text-midnight font-medium"
                  />
                </div>
              )}

              {/* Experience level selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Experience Seniority</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Entry', 'Mid', 'Senior'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setExperienceLevel(level)}
                      className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                        experienceLevel === level
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-cream-border bg-white text-gray-500 hover:bg-cream-darker/25'
                      }`}
                    >
                      {level} Level
                    </button>
                  ))}
                </div>
              </div>

              {/* Interview Type Selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Interview Session Format</label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-cream-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white text-midnight font-medium"
                >
                  <option value="Technical">Technical (Coding, Systems, CS)</option>
                  <option value="HR">HR & Teamwork (Company Culture)</option>
                  <option value="Behavioral">Behavioral (STAR Method Situational)</option>
                  {hasResume && <option value="Resume-Based">Resume-Based (Personalized Details)</option>}
                  <option value="Mixed">Mixed (Technical + Behavioral + HR)</option>
                </select>
              </div>

              <div className="p-4 rounded-xl bg-cream/40 border border-cream-border text-xs text-gray-500 leading-relaxed">
                💡 <b>System Requirements:</b> You will need to allow webcam and microphone permissions. AI video analysis evaluates eye contact and emotional cues in real-time, while audio analysis transcribes and assesses your speaking characteristics.
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={creatingSession}
                className="btn-primary w-full py-3.5 text-sm font-semibold shadow-glow disabled:opacity-50 mt-2"
              >
                <span>{creatingSession ? 'Creating Practice Session...' : 'Start Practice Session'}</span>
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-midnight text-white text-center">
        <div className="max-w-md glass-card-dark p-8 border border-midnight-border flex flex-col items-center gap-4">
          <AlertCircle size={48} className="text-red-400" />
          <h2 className="font-display font-extrabold text-2xl">Session Error</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Could not retrieve interview session details. The session may not exist or you may not have access to it.
          </p>
          <Link to="/dashboard" className="btn-primary py-2.5 px-6 mt-4 w-full">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (checkingPermissions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-gray-400">Checking Camera & Mic Permissions...</span>
        </div>
      </div>
    );
  }

  // Permissions Wall
  if (!permissionsGranted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-midnight text-white text-center">
        <div className="max-w-md glass-card-dark p-8 border border-midnight-border flex flex-col items-center gap-4">
          <AlertCircle size={48} className="text-primary-light" />
          <h2 className="font-display font-extrabold text-2xl">Hardware Access Required</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            InterviewAI requires camera and microphone permissions to perform facial alignment mesh scanning and speech transcription.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary py-2.5 px-6 mt-4 w-full"
          >
            Authorize Permissions
          </button>
          <Link to="/dashboard" className="text-xs text-gray-500 hover:text-white transition-colors underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentQ = interview.questions[currentQIndex];
  const hasAnsweredCurrent = currentQ.answer_text !== null;

  return (
    <div className="min-h-screen bg-midnight text-gray-300 flex flex-col mesh-bg-dark">
      
      {/* AI Error Toast */}
      {aiError && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            background: 'rgba(239,68,68,0.95)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 600,
            boxShadow: '0 8px 32px rgba(239,68,68,0.4)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            maxWidth: 420,
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <AlertCircle size={16} />
          {aiError}
        </div>
      )}
      
      {/* Header bar */}
      <header className="px-6 py-4 border-b border-midnight-border/50 flex justify-between items-center bg-midnight-light/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-xs font-semibold hover:text-white transition-colors bg-midnight border border-midnight-border px-3 py-1.5 rounded-xl">
            ← Exit Room
          </Link>
          <div className="hidden sm:block h-4 w-0.5 bg-midnight-border/50" />
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="font-bold text-white">{interview.role}</span>
            <span className="text-gray-500">({interview.interview_type})</span>
          </div>
        </div>

        {/* Progress Tracker dots */}
        <div className="flex gap-2">
          {interview.questions.map((q, idx) => (
            <div 
              key={q.id}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                idx === currentQIndex 
                  ? 'bg-primary scale-125 ring-2 ring-primary/20' 
                  : q.answer_text !== null 
                  ? 'bg-primary-light' 
                  : 'bg-midnight-border'
              }`}
            />
          ))}
        </div>
      </header>

      {/* Main Panel grid layout */}
      <div className="flex-1 flex flex-col md:flex-row p-6 md:p-8 gap-6 md:gap-8 max-w-7xl mx-auto w-full">
        
        {/* Left Side - Cam Feed */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-midnight-border shadow-premium relative">
            <CameraPanel 
              isRecording={isRecording} 
              onEmotionUpdate={handleEmotionUpdate}
              onEyeContactUpdate={handleEyeContactUpdate}
            />
          </div>
          
          {/* Hardware instructions */}
          <div className="glass-card-dark p-4 border border-midnight-border/40 text-xs text-gray-500 leading-relaxed flex items-start gap-2.5">
            <HelpCircle size={16} className="text-primary-light shrink-0 mt-0.5" />
            <div>
              <p>💡 <b>Practice guidelines:</b> Align your face inside the bounding box guidelines. Speak at a moderate speed and keep your eyes focused near the camera to establish consistent contact ratings.</p>
            </div>
          </div>
        </div>

        {/* Right Side - Question Content */}
        <div className="w-full md:w-[420px] flex flex-col gap-6">
          <div className="glass-card-dark p-6 md:p-8 border border-midnight-border/60 flex flex-col gap-6 flex-1 justify-between shadow-premium relative">
            
            {/* Header info */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-primary-light mb-3">
                <span>Question {currentQIndex + 1} of {interview.questions.length}</span>
                {isRecording && (
                  <span className="flex items-center gap-1 text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                    <Clock size={12} className="animate-spin" />
                    <span>{formatTimer(timer)}</span>
                  </span>
                )}
              </div>

              {/* Question Text */}
              <h2 className="font-display font-extrabold text-lg md:text-xl text-white leading-relaxed">
                "{currentQ.question_text}"
              </h2>
            </div>

            {/* Answer State Controls */}
            <div className="flex flex-col gap-4 my-6 flex-1 justify-center">
              {submittingAnswer ? (
                /* AI Analysis Loading Screen */
                <div className="flex flex-col items-center gap-3 py-10 text-center animate-fadeIn">
                  <div className="relative flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <Sparkles size={16} className="text-primary absolute animate-bounce" />
                  </div>
                  <h4 className="font-display font-bold text-white text-sm mt-2">AI is Grading Your Answer</h4>
                  <p className="text-[11px] text-gray-500 max-w-xs leading-relaxed">
                    Analyzing speech transcription semantic correctness, speaking rate speed, and face expression markers...
                  </p>
                </div>
              ) : isRecording ? (
                /* Recording indicator HUD */
                <div className="flex flex-col items-center gap-4 py-8 text-center bg-red-500/5 border border-red-500/15 rounded-2xl">
                  <Volume2 size={36} className="text-red-400 animate-bounce" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Voice Recording Live</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">Microphone active. Click submit when completed.</p>
                  </div>
                  {liveTranscript && (
                    <div className="w-full px-4 max-h-24 overflow-y-auto mt-2 text-left bg-midnight border border-midnight-border/50 rounded-lg p-2 text-xs">
                      <p className="text-[9px] text-primary-light font-bold uppercase tracking-wider mb-1">🔴 Live Transcription</p>
                      <p className="text-gray-300 italic leading-relaxed">"{liveTranscript}"</p>
                    </div>
                  )}
                  <button
                    onClick={stopAnswer}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-glow shadow-red-500/10"
                  >
                    <Square size={12} fill="white" />
                    <span>Submit Response</span>
                  </button>
                </div>
              ) : hasAnsweredCurrent ? (
                /* Post-answer feedback display — transcript + semantic score + AI evaluation */
                <div className="flex flex-col gap-3 p-4 rounded-xl bg-midnight border border-midnight-border text-xs leading-relaxed animate-fadeIn">
                  {/* Score row */}
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>AI Evaluation</span>
                    <div className="flex items-center gap-2">
                      {currentQ.evaluation?.semantic_score !== undefined && (
                        <span className="text-[10px] bg-purple-900/40 text-purple-300 border border-purple-700/30 px-2 py-0.5 rounded-full">
                          Semantic: {Math.round(currentQ.evaluation.semantic_score)}%
                        </span>
                      )}
                      <span className="text-primary-light font-display text-sm">
                        {currentQ.evaluation?.final_score ?? currentQ.evaluation?.score ?? 80}/100
                      </span>
                    </div>
                  </div>

                  {/* Whisper transcript */}
                  {currentQ.answer_text && (
                    <div className="bg-midnight-light/30 border border-midnight-border/40 rounded-lg p-3">
                      <p className="text-[10px] font-bold text-primary-light uppercase tracking-wider mb-1">📝 Transcript</p>
                      <p className="text-gray-300 italic leading-relaxed">
                        "{(currentQ.answer_text || "").slice(0, 200)}{currentQ.answer_text?.length > 200 ? '...' : ''}"
                      </p>
                    </div>
                  )}

                  {/* Strengths */}
                  {currentQ.evaluation?.strengths?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-green-400 uppercase tracking-wider mb-1">✅ Strengths</p>
                      {currentQ.evaluation.strengths.slice(0, 2).map((s, i) => (
                        <p key={i} className="text-gray-400 leading-snug">• {s}</p>
                      ))}
                    </div>
                  )}

                  {/* AI Feedback */}
                  <p className="text-gray-500 border-t border-midnight-border/60 pt-2">
                    💡 <b>AI Feedback:</b> {currentQ.evaluation?.feedback || 'Great answer. Click next to continue.'}
                  </p>
                </div>
              ) : (
                /* Initial state before recording / typing selection */
                isTypingMode ? (
                  <div className="w-full flex flex-col gap-3 animate-fadeIn">
                    <textarea
                      value={typedAnswer}
                      onChange={(e) => setTypedAnswer(e.target.value)}
                      placeholder="Type your response to the question here..."
                      className="w-full h-32 p-3 bg-midnight border border-midnight-border/60 rounded-xl text-xs text-white focus:outline-none focus:border-primary/60 resize-none leading-relaxed"
                    />
                    <button
                      onClick={submitTypedAnswer}
                      disabled={!typedAnswer.trim()}
                      className="btn-primary w-full py-3 text-xs font-semibold shadow-glow disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Submit Response
                    </button>
                    <button
                      onClick={() => setIsTypingMode(false)}
                      className="text-[10px] text-gray-500 hover:text-white transition-colors underline mt-1"
                    >
                      Switch back to voice recording
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 py-6 text-center">
                    <Mic size={36} className="text-primary-light" />
                    <div>
                      <h4 className="font-bold text-white text-sm">Ready to Answer?</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">Click the trigger below to open your microphone.</p>
                    </div>
                    <button
                      onClick={startAnswer}
                      className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-xs font-semibold pulse-record shadow-glow"
                    >
                      <Mic size={14} />
                      <span>Begin Speaking Response</span>
                    </button>
                    <button
                      onClick={() => setIsTypingMode(true)}
                      className="text-[11px] text-gray-500 hover:text-white transition-colors underline mt-2"
                    >
                      Type response instead
                    </button>
                  </div>
                )
              )}
            </div>

            {/* Navigation buttons at bottom */}
            {hasAnsweredCurrent && !submittingAnswer && (
              <div className="mt-auto pt-4 border-t border-midnight-border/40 flex justify-end">
                {currentQIndex < interview.questions.length - 1 ? (
                  <button
                    onClick={handleNextQuestion}
                    className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 shadow-glow"
                  >
                    <span>Next Question</span>
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={handleCompleteInterview}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 shadow-glow shadow-green-600/10"
                  >
                    <Award size={14} />
                    <span>Finish Interview & Grade Session</span>
                  </button>
                )}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default InterviewRoom;
