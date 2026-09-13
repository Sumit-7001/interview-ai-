import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Mic,
  Square,
  ArrowRight,
  Volume2,
  VolumeX,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Award,
  MessageSquare,
  Wifi,
  WifiOff,
  ChevronDown,
  ChevronUp,
  Brain,
  CheckCircle2
} from 'lucide-react';
import API from '../services/api';
import CameraPanel from '../components/CameraPanel';
import Sidebar from '../components/Sidebar';

// ── Text-to-Speech helper using Web Speech API ──────────────────────────────
const speakText = (text, { rate = 0.95, pitch = 1.0, volume = 1.0 } = {}) => {
  if (!window.speechSynthesis || !text) return;
  window.speechSynthesis.cancel(); // Stop any ongoing speech
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = rate;
  utter.pitch = pitch;
  utter.volume = volume;
  utter.lang = 'en-US';
  // Prefer a natural voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v =>
    v.name.includes('Google US English') ||
    v.name.includes('Samantha') ||
    v.name.includes('Alex') ||
    (v.lang === 'en-US' && !v.name.includes('Google'))
  );
  if (preferred) utter.voice = preferred;
  window.speechSynthesis.speak(utter);
  return utter;
};

const stopSpeech = () => {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
};

const InterviewRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Config form states for id === 'new'
  const [role, setRole] = useState('Software Engineer');
  const [customRole, setCustomRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Entry');
  const [interviewType, setInterviewType] = useState('Technical');
  const [creatingSession, setCreatingSession] = useState(false);
  const [hasResume, setHasResume] = useState(false);

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  // Media permission screen state
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [checkingPermissions, setCheckingPermissions] = useState(true);

  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [currentGrading, setCurrentGrading] = useState(null);
  const [aiError, setAiError] = useState(null);

  // Metrics accumulation
  const [emotionsHistory, setEmotionsHistory] = useState([]);
  const [eyeContactHistory, setEyeContactHistory] = useState([]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);

  // Browser Speech Recognition
  const [browserTranscript, setBrowserTranscript] = useState('');
  const [liveTranscript, setLiveTranscript] = useState('');
  const transcriptRef = useRef('');
  const recognitionRef = useRef(null);

  // Typing fallback
  const [isTypingMode, setIsTypingMode] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState('');

  // ── Dynamic Interview (WebSocket) Mode ────────────────────────────────────
  const [wsMode, setWsMode] = useState(false); // true = using WebSocket
  const [wsConnected, setWsConnected] = useState(false);
  const [wsConnecting, setWsConnecting] = useState(false);
  const wsRef = useRef(null);
  const wsAttemptedRef = useRef(false);

  // Dynamic interview state
  const [dynamicQuestion, setDynamicQuestion] = useState(null); // {question, question_number, stage, difficulty}
  const [lastFeedback, setLastFeedback] = useState(null); // Retain previous answer analysis
  const [aiThinking, setAiThinking] = useState(false);
  const [conversationLog, setConversationLog] = useState([]);
  const [showLog, setShowLog] = useState(false);

  // TTS
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [aiSpeaking, setAiSpeaking] = useState(false);

  // REST mode (fallback)
  const [currentQIndex, setCurrentQIndex] = useState(0);

  // ── Load initial data ────────────────────────────────────────────────────
  const fetchSession = async () => {
    try {
      const res = await API.get(`/api/interviews/${id}`);
      if (res.data.status === 'completed') {
        navigate(`/reports/${id}`);
        return;
      }
      setInterview(res.data);
      const unansweredIdx = res.data.questions.findIndex(q => q.answer_text === null);
      if (unansweredIdx !== -1) setCurrentQIndex(unansweredIdx);
      else if (res.data.questions.length === 0) setCurrentQIndex(0);
    } catch (err) {
      console.error('Failed to load interview room session:', err);
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
        } catch {
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

  // Permissions check
  useEffect(() => {
    if (id === 'new') {
      setPermissionsGranted(true);
      setCheckingPermissions(false);
      return;
    }
    const checkPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        stream.getTracks().forEach(track => track.stop());
        setPermissionsGranted(true);
      } catch {
        setPermissionsGranted(false);
      } finally {
        setCheckingPermissions(false);
      }
    };
    checkPermissions();
  }, [id]);

  // Timer
  useEffect(() => {
    if (isRecording) {
      timerIntervalRef.current = setInterval(() => setTimer(prev => prev + 1), 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); };
  }, [isRecording]);

  // Cleanup WS on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) wsRef.current.close();
      stopSpeech();
    };
  }, []);

  // ── WebSocket Connection ──────────────────────────────────────────────────
  const connectWebSocket = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token || !id) return;

    setWsConnecting(true);
    const wsBase = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/^http/, 'ws');
    const wsUrl = `${wsBase}/ws/interview/${id}?token=${token}`;
    console.log('Connecting WebSocket:', wsUrl);

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WS connected');
      setWsConnected(true);
      setWsConnecting(false);
      setWsMode(true);
      // Request first question
      ws.send(JSON.stringify({ type: 'start' }));
      setAiThinking(true);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        handleWsMessage(msg);
      } catch (e) {
        console.error('WS message parse error:', e);
      }
    };

    ws.onclose = (event) => {
      console.log('WS closed:', event.code, event.reason);
      setWsConnected(false);
      setWsConnecting(false);
      if (event.code !== 1000 && event.code !== 4001) {
        // Unexpected close — fall back to REST mode
        setAiError('Live connection lost. Switched to standard mode.');
        setTimeout(() => setAiError(null), 5000);
        setWsMode(false);
        fetchSession();
      }
    };

    ws.onerror = (err) => {
      console.error('WS error:', err);
      setWsConnecting(false);
      setAiError('WebSocket connection failed. Using standard mode.');
      setTimeout(() => setAiError(null), 5000);
      setWsMode(false);
      fetchSession();
    };
  }, [id]);

  const handleWsMessage = useCallback((msg) => {
    const type = msg.type;

    if (type === 'thinking') {
      setAiThinking(true);
      return;
    }

    if (type === 'question') {
      setAiThinking(false);
      setCurrentGrading(null);
      transcriptRef.current = '';
      setBrowserTranscript('');
      setLiveTranscript('');
      setTypedAnswer('');
      setIsTypingMode(false);

      const qData = {
        question: msg.question,
        question_number: msg.question_number,
        stage: msg.stage,
        difficulty: msg.difficulty,
        question_type: msg.question_type || 'counter_question',
        current_topic: msg.current_topic || '',
        is_last: msg.is_last || false,
      };
      setDynamicQuestion(qData);

      // TTS — AI speaks the question
      if (ttsEnabled) {
        setAiSpeaking(true);
        const utter = speakText(msg.tts_text || msg.question);
        if (utter) {
          utter.onend = () => setAiSpeaking(false);
          utter.onerror = () => setAiSpeaking(false);
        } else {
          setAiSpeaking(false);
        }
      }
      return;
    }

    if (type === 'feedback') {
      setAiThinking(false);
      const fbData = {
        score: msg.score,
        feedback: msg.feedback,
        strengths: msg.strengths,
        improvements: msg.improvements,
        answer_text: msg.answer_text,
        evaluation: msg.evaluation,
        candidate_behavior: msg.candidate_behavior,
      };
      setCurrentGrading(fbData);
      setLastFeedback(fbData);
      // Add to conversation log
      setConversationLog(prev => [...prev, {
        question: dynamicQuestion?.question || '',
        answer: msg.answer_text || '',
        score: msg.score,
        feedback: msg.feedback,
        strengths: msg.strengths,
        improvements: msg.improvements,
        q_number: msg.question_number,
      }]);
      return;
    }

    if (type === 'complete') {
      setAiThinking(false);
      stopSpeech();
      if (msg.redirect_url) {
        setTimeout(() => navigate(msg.redirect_url), 1500);
      }
      return;
    }

    if (type === 'error') {
      setAiThinking(false);
      setAiError(msg.message || 'An error occurred.');
      setTimeout(() => setAiError(null), 6000);
      return;
    }
  }, [ttsEnabled, dynamicQuestion, navigate]);

  // Update ws message handler when ttsEnabled or dynamicQuestion changes
  useEffect(() => {
    if (wsRef.current) {
      wsRef.current.onmessage = (event) => {
        try { handleWsMessage(JSON.parse(event.data)); }
        catch (e) { console.error('WS parse err:', e); }
      };
    }
  }, [handleWsMessage]);

  const sendWsAnswer = useCallback((answerText, emotionSummary, eyeContactScore, audioB64 = '') => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setAiError('Connection lost. Please refresh.');
      return;
    }
    wsRef.current.send(JSON.stringify({
      type: 'answer',
      text: answerText || '',
      emotion: emotionSummary,
      eye_contact: eyeContactScore,
      audio_b64: audioB64,
    }));
    setAiThinking(true);
    setCurrentGrading(null);
  }, []);

  const endWsInterview = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'end' }));
      setAiThinking(true);
    }
  }, []);

  // Auto-connect WebSocket once when session is loaded and ready
  useEffect(() => {
    if (id && id !== 'new' && !loading && interview && !wsAttemptedRef.current) {
      wsAttemptedRef.current = true;
      connectWebSocket();
    }
  }, [id, loading, interview, connectWebSocket]);

  // ── Recording ────────────────────────────────────────────────────────────
  const startAnswer = async () => {
    audioChunksRef.current = [];
    transcriptRef.current = '';
    setBrowserTranscript('');
    setLiveTranscript('');
    setTimer(0);
    setEmotionsHistory([]);
    setEyeContactHistory([90]);
    setCurrentGrading(null);
    stopSpeech();
    setAiSpeaking(false);

    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let options = { mimeType: 'audio/webm' };
      if (!MediaRecorder.isTypeSupported('audio/webm')) options = { mimeType: 'audio/mp4' };

      const mediaRecorder = new MediaRecorder(audioStream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: options.mimeType });
        audioStream.getTracks().forEach(track => track.stop());
        const currentSpokenText = transcriptRef.current.trim();
        uploadAndGradeAnswer(audioBlob, currentSpokenText);
      };

      // Browser Speech Recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          if (recognitionRef.current) {
            try { recognitionRef.current.abort(); } catch {}
          }
          const rec = new SpeechRecognition();
          rec.continuous = true;
          rec.interimResults = true;
          rec.lang = navigator.language || 'en-IN';

          rec.onresult = (event) => {
            let fullText = '';
            for (let i = 0; i < event.results.length; ++i) {
              fullText += event.results[i][0].transcript + ' ';
            }
            const cleanText = fullText.trim();
            transcriptRef.current = cleanText;
            setBrowserTranscript(cleanText);
            setLiveTranscript(cleanText);
          };

          rec.onerror = (e) => {
            console.warn('SpeechRecognition error:', e.error);
          };

          rec.onend = () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
              try { rec.start(); } catch {}
            }
          };

          recognitionRef.current = rec;
          rec.start();
        } catch (e) {
          console.warn('SpeechRecognition init failed:', e);
        }
      }

      mediaRecorder.start(500);
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone start failed:', err);
      alert('Microphone permission required. Please allow microphone access in your browser to speak.');
    }
  };

  const stopAnswer = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const roundToTwo = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

  const uploadAndGradeAnswer = async (audioBlob, transcriptOverride = null) => {
    setSubmittingAnswer(true);

    // Calculate average emotions
    const emotionSummary = { neutral: 0.0, happy: 0.0, sad: 0.0, angry: 0.0, fear: 0.0, surprise: 0.0, disgust: 0.0 };
    if (emotionsHistory.length > 0) {
      emotionsHistory.forEach(frameProbs => {
        Object.keys(frameProbs).forEach(key => {
          const lk = key.toLowerCase();
          if (lk in emotionSummary) emotionSummary[lk] += frameProbs[key];
        });
      });
      Object.keys(emotionSummary).forEach(key => {
        emotionSummary[key] = roundToTwo(emotionSummary[key] / emotionsHistory.length);
      });
    } else {
      emotionSummary.neutral = 100.0;
    }
    const avgEyeScore = eyeContactHistory.length > 0
      ? roundToTwo(eyeContactHistory.reduce((a, c) => a + c, 0) / eyeContactHistory.length)
      : 85.0;

    const finalTranscript = (transcriptOverride !== null ? transcriptOverride : (transcriptRef.current || browserTranscript)).trim();

    // Convert audioBlob to base64
    let audioB64 = '';
    try {
      const buffer = await audioBlob.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      audioB64 = window.btoa(binary);
    } catch (e) {
      console.warn('Audio base64 error:', e);
    }

    // WebSocket mode — send answer via WS
    if (wsMode && wsRef.current?.readyState === WebSocket.OPEN) {
      sendWsAnswer(finalTranscript, emotionSummary, avgEyeScore, audioB64);
      setSubmittingAnswer(false);
      return;
    }

    // REST mode fallback
    const currentQ = interview?.questions?.[currentQIndex];
    if (!currentQ) { setSubmittingAnswer(false); return; }

    const formData = new FormData();
    formData.append('question_id', currentQ.id);
    formData.append('eye_contact_score', avgEyeScore);
    formData.append('emotion_summary_json', JSON.stringify(emotionSummary));
    formData.append('audio', audioBlob, `q${currentQ.id}_response.webm`);
    if (finalTranscript?.trim()) formData.append('browser_transcript', finalTranscript);

    try {
      const res = await API.post(`/api/interviews/${id}/answer`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCurrentGrading(res.data);
      setLastFeedback(res.data);
      const updatedQuestions = [...interview.questions];
      updatedQuestions[currentQIndex] = {
        ...updatedQuestions[currentQIndex],
        answer_text: res.data.answer_text,
        eye_contact_score: res.data.eye_contact_score,
        emotion_summary: res.data.emotion_summary,
        voice_metrics: res.data.voice_metrics,
        evaluation: res.data.evaluation,
      };
      if (res.data.next_question && !updatedQuestions.some(q => q.id === currentQ.id + 1)) {
        updatedQuestions.push({
          id: currentQ.id + 1,
          question_text: res.data.next_question,
          answer_text: null,
          emotion_summary: null,
          eye_contact_score: null,
          voice_metrics: null,
          evaluation: null,
        });
      }
      setInterview({ ...interview, questions: updatedQuestions });
    } catch (err) {
      const msg = err.response?.status === 503
        ? 'AI service temporarily unavailable. Please try again.'
        : err.response?.status >= 500
        ? 'Server error. Please try again.'
        : 'Network error. Check your connection.';
      setAiError(msg);
      setTimeout(() => setAiError(null), 6000);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleEmotionUpdate = (dominant, probabilities) => setEmotionsHistory(prev => [...prev, probabilities]);
  const handleEyeContactUpdate = (score) => setEyeContactHistory(prev => [...prev, score]);

  const submitTypedAnswer = () => {
    if (!typedAnswer.trim()) return;
    if (wsMode && wsRef.current?.readyState === WebSocket.OPEN) {
      const emotionSummary = { neutral: 100.0 };
      sendWsAnswer(typedAnswer, emotionSummary, 85.0);
      setSubmittingAnswer(true);
      setTypedAnswer('');
      return;
    }
    const silentBlob = new Blob([new Uint8Array(100)], { type: 'audio/webm' });
    uploadAndGradeAnswer(silentBlob, typedAnswer);
  };

  // REST mode navigation
  const handleNextQuestion = () => {
    if (interview && currentQIndex < interview.questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setCurrentGrading(null);
      setBrowserTranscript('');
      setLiveTranscript('');
      setTypedAnswer('');
      setIsTypingMode(false);
    }
  };

  const handleCompleteInterview = async () => {
    if (wsMode) {
      endWsInterview();
      return;
    }
    setLoading(true);
    try {
      await API.post(`/api/interviews/${id}/complete`);
      navigate(`/reports/${id}`);
    } catch (err) {
      alert('Error completing session. Try again.');
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
        interview_type: interviewType,
      });
      navigate(`/interview/${res.data.id}`);
    } catch {
      alert('Failed to start interview. Check connection/keys.');
    } finally {
      setCreatingSession(false);
    }
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ── Render: Loading ──────────────────────────────────────────────────────
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

  // ── Render: New Interview Config ────────────────────────────────────────
  if (id === 'new') {
    return (
      <div className="min-h-screen flex bg-cream animate-fadeIn">
        <Sidebar />
        <main className="flex-1 p-8 md:p-12 overflow-y-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="font-display font-extrabold text-3xl text-midnight">Configure Mock Interview</h1>
            <p className="text-gray-500 text-sm mt-1">Set up your practice session. The AI will adapt questions based on your answers.</p>
          </div>
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-cream-border/60 shadow-premium">
            <form onSubmit={handleStartInterview} className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Target Job Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-cream-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white text-midnight font-medium">
                  <option value="Software Engineer">Software Engineer (General)</option>
                  <option value="React Developer">React / Frontend Developer</option>
                  <option value="Python Developer">Python / Backend Developer</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="Other">Custom Role...</option>
                </select>
              </div>
              {role === 'Other' && (
                <div className="flex flex-col gap-1.5 animate-fadeIn">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Custom Role Title</label>
                  <input type="text" required placeholder="e.g. Node.js Developer" value={customRole} onChange={(e) => setCustomRole(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-cream-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white text-midnight font-medium" />
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Experience Seniority</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Entry', 'Mid', 'Senior'].map((level) => (
                    <button key={level} type="button" onClick={() => setExperienceLevel(level)} className={`py-3 rounded-xl text-xs font-bold border transition-all ${experienceLevel === level ? 'border-primary bg-primary/5 text-primary' : 'border-cream-border bg-white text-gray-500 hover:bg-cream-darker/25'}`}>
                      {level} Level
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Interview Session Format</label>
                <select value={interviewType} onChange={(e) => setInterviewType(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-cream-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white text-midnight font-medium">
                  <option value="Technical">Technical (Coding, Systems, CS)</option>
                  <option value="HR">HR & Teamwork (Company Culture)</option>
                  <option value="Behavioral">Behavioral (STAR Method Situational)</option>
                  {hasResume && <option value="Resume-Based">Resume-Based (Personalized Details)</option>}
                  <option value="Mixed">Mixed (Technical + Behavioral + HR)</option>
                </select>
              </div>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-xs text-gray-600 leading-relaxed">
                ✨ <b>Dynamic AI Mode:</b> The AI will adapt questions based on your answers in real-time, asking deeper follow-ups when you do well and clarifying questions when needed. It also speaks the questions aloud.
              </div>
              <button type="submit" disabled={creatingSession} className="btn-primary w-full py-3.5 text-sm font-semibold shadow-glow disabled:opacity-50 mt-2">
                <span>{creatingSession ? 'Creating Practice Session...' : 'Start Practice Session'}</span>
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  if (!interview && !wsMode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-midnight text-white text-center">
        <div className="max-w-md glass-card-dark p-8 border border-midnight-border flex flex-col items-center gap-4">
          <AlertCircle size={48} className="text-red-400" />
          <h2 className="font-display font-extrabold text-2xl">Session Error</h2>
          <p className="text-sm text-gray-400">Could not retrieve interview session details.</p>
          <Link to="/dashboard" className="btn-primary py-2.5 px-6 mt-4 w-full">Return to Dashboard</Link>
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

  if (!permissionsGranted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-midnight text-white text-center">
        <div className="max-w-md glass-card-dark p-8 border border-midnight-border flex flex-col items-center gap-4">
          <AlertCircle size={48} className="text-primary-light" />
          <h2 className="font-display font-extrabold text-2xl">Hardware Access Required</h2>
          <p className="text-sm text-gray-400">InterviewAI requires camera and microphone access for facial and speech analysis.</p>
          <button onClick={() => window.location.reload()} className="btn-primary py-2.5 px-6 mt-4 w-full">Authorize Permissions</button>
          <Link to="/dashboard" className="text-xs text-gray-500 hover:text-white transition-colors underline">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  // Determine current question for display
  const currentQ = wsMode ? dynamicQuestion : (interview?.questions?.[currentQIndex]);
  const hasAnsweredCurrent = wsMode ? !!currentGrading : (currentQ?.answer_text !== null);
  const isLastQuestion = wsMode
    ? (dynamicQuestion?.is_last || false)
    : (interview && currentQIndex >= interview.questions.length - 1);

  return (
    <div className="min-h-screen bg-midnight text-gray-300 flex flex-col mesh-bg-dark">

      {/* AI Error Toast */}
      {aiError && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, background: 'rgba(239,68,68,0.95)', color: 'white',
          padding: '12px 20px', borderRadius: 12, fontSize: 13, fontWeight: 600,
          boxShadow: '0 8px 32px rgba(239,68,68,0.4)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', gap: 8, maxWidth: 420,
        }}>
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
            <span className="font-bold text-white">{interview?.role || 'Interview'}</span>
            <span className="text-gray-500">({interview?.interview_type || 'Dynamic'})</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* WS Status */}
          <div className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${wsConnected ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-gray-500/10 border-gray-500/20 text-gray-500'}`}>
            {wsConnected ? <Wifi size={10} /> : <WifiOff size={10} />}
            {wsConnected ? 'Live AI' : 'Standard'}
          </div>

          {/* TTS Toggle */}
          <button
            onClick={() => { setTtsEnabled(!ttsEnabled); stopSpeech(); setAiSpeaking(false); }}
            className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${ttsEnabled ? 'bg-primary/10 border-primary/20 text-primary-light' : 'bg-gray-700/50 border-gray-600/30 text-gray-500'}`}
            title="Toggle AI voice"
          >
            {ttsEnabled ? <Volume2 size={10} /> : <VolumeX size={10} />}
            {ttsEnabled ? 'Voice On' : 'Voice Off'}
          </button>

          {/* Question progress (REST mode) */}
          {!wsMode && interview && (
            <div className="flex gap-1.5">
              {interview.questions.map((q, idx) => (
                <div key={q.id} className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentQIndex ? 'bg-primary scale-125 ring-2 ring-primary/20' : q.answer_text !== null ? 'bg-primary-light' : 'bg-midnight-border'}`} />
              ))}
            </div>
          )}

          {/* Dynamic question counter */}
          {wsMode && dynamicQuestion && (
            <span className="text-xs text-gray-400 font-mono">
              Q#{dynamicQuestion.question_number}
            </span>
          )}
        </div>
      </header>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col md:flex-row p-6 md:p-8 gap-6 md:gap-8 max-w-7xl mx-auto w-full">

        {/* Left - Camera Feed */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-midnight-border shadow-premium relative">
            {!loading ? (
              <CameraPanel
                isRecording={isRecording}
                onEmotionUpdate={handleEmotionUpdate}
                onEyeContactUpdate={handleEyeContactUpdate}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-midnight">
                <p className="text-gray-500 text-sm">Camera loading...</p>
              </div>
            )}
          </div>

          {/* AI Speaking indicator */}
          {aiSpeaking && (
            <div className="glass-card-dark p-3 border border-primary/30 rounded-xl flex items-center gap-2 text-xs animate-fadeIn">
              <div className="flex gap-0.5">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="w-1 bg-primary rounded-full animate-bounce" style={{ height: 12 + (i % 2) * 4, animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
              <span className="text-primary-light font-semibold">AI Interviewer is speaking...</span>
            </div>
          )}

          {/* Guidelines */}
          <div className="glass-card-dark p-4 border border-midnight-border/40 text-xs text-gray-500 leading-relaxed flex items-start gap-2.5">
            <HelpCircle size={16} className="text-primary-light shrink-0 mt-0.5" />
            <p>💡 <b>Tip:</b> Keep your face aligned in the frame. The AI adapts follow-up questions based on your answers — the better you answer, the more challenging it gets!</p>
          </div>

          {/* Conversation Log (collapsible) */}
          {wsMode && conversationLog.length > 0 && (
            <div className="glass-card-dark border border-midnight-border/40 rounded-2xl overflow-hidden">
              <button
                onClick={() => setShowLog(!showLog)}
                className="w-full p-3 flex items-center justify-between text-xs font-bold text-gray-400 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <MessageSquare size={12} className="text-primary-light" />
                  Conversation History ({conversationLog.length} answered)
                </span>
                {showLog ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {showLog && (
                <div className="border-t border-midnight-border/30 max-h-48 overflow-y-auto p-3 flex flex-col gap-3">
                  {conversationLog.map((entry, i) => (
                    <div key={i} className="text-[11px] border-b border-midnight-border/20 pb-2">
                      <p className="text-primary-light font-bold mb-0.5">Q{entry.q_number}: {entry.question.slice(0, 80)}...</p>
                      <p className="text-gray-400 italic">{entry.answer?.slice(0, 100)}...</p>
                      <p className="text-gray-500 mt-0.5">Score: <span className="text-white font-bold">{entry.score}/100</span></p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right - Question Panel */}
        <div className="w-full md:w-[420px] flex flex-col gap-6">
          <div className="glass-card-dark p-6 md:p-8 border border-midnight-border/60 flex flex-col gap-6 flex-1 justify-between shadow-premium relative">

            {/* Header info */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-primary-light mb-3">
                <span>
                  {wsMode
                    ? (dynamicQuestion ? `Question ${dynamicQuestion.question_number}` : 'Connecting...')
                    : `Question ${(currentQIndex || 0) + 1} of ${interview?.questions?.length || '?'}`
                  }
                </span>
                {isRecording && (
                  <span className="flex items-center gap-1 text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                    <Clock size={12} className="animate-spin" />
                    <span>{formatTimer(timer)}</span>
                  </span>
                )}
              </div>

              {/* Badges: Question Type, Topic, Difficulty */}
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                {/* Question Type Badge */}
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  (dynamicQuestion?.question_type === 'project_opening' || (!wsMode && currentQIndex === 0))
                    ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                    : (dynamicQuestion?.question_type === 'counter_question' || dynamicQuestion?.stage === 'counter_question')
                    ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                    : (dynamicQuestion?.question_type === 'clarification')
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                    : (dynamicQuestion?.question_type === 'scenario')
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                    : 'bg-primary/15 border-primary/30 text-primary-light'
                }`}>
                  {dynamicQuestion?.question_type === 'project_opening' ? '📄 Resume Project' :
                   dynamicQuestion?.question_type === 'counter_question' ? '🎯 Counter Question' :
                   dynamicQuestion?.question_type === 'clarification' ? '💡 Clarification' :
                   dynamicQuestion?.question_type === 'scenario' ? '🚀 Scenario & Scale' :
                   dynamicQuestion?.question_type === 'follow_up' ? '🔍 Deep-Dive' :
                   (!wsMode && currentQIndex === 0) ? '📄 Resume Project' : '🎯 Counter Question'}
                </span>

                {/* Topic badge */}
                {(dynamicQuestion?.current_topic || interview?.current_topic) && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-midnight border border-midnight-border text-gray-300 truncate max-w-[210px]" title={dynamicQuestion?.current_topic || interview?.current_topic}>
                    📌 {dynamicQuestion?.current_topic || interview?.current_topic}
                  </span>
                )}

                {/* Difficulty badge */}
                {(dynamicQuestion?.difficulty || interview?.difficulty) && dynamicQuestion?.difficulty !== 'opening' && dynamicQuestion?.difficulty !== 'closing' && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    (dynamicQuestion?.difficulty || interview?.difficulty) === 'advanced' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                    (dynamicQuestion?.difficulty || interview?.difficulty) === 'intermediate' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                    'bg-green-500/10 border-green-500/20 text-green-400'
                  }`}>
                    {(dynamicQuestion?.difficulty || interview?.difficulty || 'MEDIUM').toUpperCase()}
                  </span>
                )}
              </div>

              {/* Question Text */}
              {aiThinking ? (
                <div className="flex items-center gap-2 mt-4">
                  <Brain size={18} className="text-primary-light animate-pulse" />
                  <span className="text-sm text-gray-400 animate-pulse">AI is analyzing answer & formulating counter-question...</span>
                </div>
              ) : currentQ ? (
                <h2 className="font-display font-extrabold text-lg md:text-xl text-white leading-relaxed">
                  "{wsMode ? dynamicQuestion?.question : currentQ?.question_text}"
                </h2>
              ) : (
                <div className="text-sm text-gray-500 mt-4">Waiting for AI to connect...</div>
              )}
            </div>

            {/* Answer State Controls */}
            <div className="flex flex-col gap-4 my-4 flex-1 justify-center">
              {/* Previous Answer Context Banner (when counter-question is ready) */}
              {lastFeedback && !hasAnsweredCurrent && !isRecording && !submittingAnswer && (
                <div className="p-3 bg-midnight/80 border border-midnight-border/70 rounded-xl text-xs flex flex-col gap-1.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-green-400" />
                      <span>Previous Answer Analysis</span>
                    </span>
                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                      lastFeedback.score >= 80 ? 'bg-green-500/15 text-green-400' :
                      lastFeedback.score >= 60 ? 'bg-yellow-500/15 text-yellow-400' :
                      'bg-red-500/15 text-red-400'
                    }`}>
                      {lastFeedback.score}/100
                    </span>
                  </div>
                  {lastFeedback.feedback && (
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      💡 {lastFeedback.feedback}
                    </p>
                  )}
                  {lastFeedback.improvements?.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 mt-0.5">
                      <span className="text-[9px] text-yellow-400 font-semibold uppercase">Explored in next Q:</span>
                      {lastFeedback.improvements.slice(0, 3).map((imp, idx) => (
                        <span key={idx} className="text-[9px] bg-yellow-500/10 text-yellow-300 px-1.5 py-0.5 rounded border border-yellow-500/20">{imp}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {(submittingAnswer || aiThinking && !currentGrading && !isRecording) ? (
                <div className="flex flex-col items-center gap-3 py-10 text-center animate-fadeIn">
                  <div className="relative flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <Sparkles size={16} className="text-primary absolute animate-bounce" />
                  </div>
                  <h4 className="font-display font-bold text-white text-sm mt-2">AI is Analyzing Your Answer</h4>
                  <p className="text-[11px] text-gray-500 max-w-xs leading-relaxed">
                    Evaluating content depth, technical accuracy, and generating your counter-question...
                  </p>
                </div>
              ) : isRecording ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center bg-red-500/5 border border-red-500/15 rounded-2xl">
                  <Volume2 size={36} className="text-red-400 animate-bounce" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Recording Live</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">Click submit when done.</p>
                  </div>
                  {liveTranscript ? (
                    <div className="w-full px-4 max-h-28 overflow-y-auto mt-2 text-left bg-midnight border border-green-500/30 rounded-lg p-3 text-xs animate-fadeIn">
                      <p className="text-[10px] text-green-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span>Recognized Speech</span>
                      </p>
                      <p className="text-white font-medium italic leading-relaxed">"{liveTranscript}"</p>
                    </div>
                  ) : (
                    <div className="w-full px-4 mt-2 text-left bg-midnight border border-midnight-border/50 rounded-lg p-3 text-xs">
                      <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                        <span>Listening...</span>
                      </p>
                      <p className="text-gray-300">Speak clearly into your microphone. Your spoken words will appear here live.</p>
                    </div>
                  )}
                  <button onClick={stopAnswer} className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-glow shadow-red-500/10">
                    <Square size={12} fill="white" />
                    <span>Submit Response</span>
                  </button>
                </div>
              ) : hasAnsweredCurrent && currentGrading ? (
                <div className="flex flex-col gap-3 p-4 rounded-xl bg-midnight border border-midnight-border text-xs leading-relaxed animate-fadeIn">
                  {/* Score row */}
                  <div className="flex items-center justify-between font-bold text-white">
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={14} className="text-primary-light" />
                      <span>AI Evaluation</span>
                    </span>
                    <span className={`font-display text-sm font-bold px-2 py-0.5 rounded ${
                      currentGrading.score >= 80 ? 'text-green-400 bg-green-500/10' :
                      currentGrading.score >= 60 ? 'text-yellow-400 bg-yellow-500/10' :
                      'text-red-400 bg-red-500/10'
                    }`}>
                      {currentGrading.score}/100
                    </span>
                  </div>
                  {/* Transcript */}
                  {currentGrading.answer_text && (
                    <div className="bg-midnight-light/30 border border-midnight-border/40 rounded-lg p-3">
                      <p className="text-[10px] font-bold text-primary-light uppercase tracking-wider mb-1">📝 Your Answer</p>
                      <p className="text-gray-300 italic leading-relaxed">"{currentGrading.answer_text}"</p>
                    </div>
                  )}
                  {/* Strengths / Detected Topics */}
                  {currentGrading.strengths?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-green-400 uppercase tracking-wider mb-1">✅ Concepts Detected</p>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {currentGrading.strengths.map((s, i) => (
                          <span key={i} className="text-[10px] bg-green-500/10 text-green-300 border border-green-500/20 px-2 py-0.5 rounded-full">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Improvements / Missing Concepts */}
                  {currentGrading.improvements?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider mb-1">⚠️ Missing / To Explore</p>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {currentGrading.improvements.map((imp, i) => (
                          <span key={i} className="text-[10px] bg-yellow-500/10 text-yellow-300 border border-yellow-500/20 px-2 py-0.5 rounded-full">{imp}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Feedback */}
                  <p className="text-gray-300 border-t border-midnight-border/60 pt-2 text-[11px] leading-relaxed">
                    💡 <b>Interviewer Feedback:</b> {currentGrading.feedback || 'Good answer.'}
                  </p>
                </div>
              ) : !wsMode && !currentQ ? (
                <div className="text-center text-sm text-gray-500 py-8">Waiting for session to load...</div>
              ) : (
                isTypingMode ? (
                  <div className="w-full flex flex-col gap-3 animate-fadeIn">
                    <textarea
                      value={typedAnswer}
                      onChange={(e) => setTypedAnswer(e.target.value)}
                      placeholder="Type your response here..."
                      className="w-full h-32 p-3 bg-midnight border border-midnight-border/60 rounded-xl text-xs text-white focus:outline-none focus:border-primary/60 resize-none leading-relaxed"
                    />
                    <button onClick={submitTypedAnswer} disabled={!typedAnswer.trim()} className="btn-primary w-full py-3 text-xs font-semibold shadow-glow disabled:opacity-40 disabled:cursor-not-allowed">
                      Submit Response
                    </button>
                    <button onClick={() => setIsTypingMode(false)} className="text-[10px] text-gray-500 hover:text-white transition-colors underline mt-1">
                      Switch to voice
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 py-6 text-center">
                    <Mic size={36} className="text-primary-light" />
                    <div>
                      <h4 className="font-bold text-white text-sm">Ready to Answer?</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">Click below to start your microphone.</p>
                    </div>
                    <button onClick={startAnswer} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-xs font-semibold pulse-record shadow-glow">
                      <Mic size={14} />
                      <span>Begin Speaking Response</span>
                    </button>
                    <button onClick={() => setIsTypingMode(true)} className="text-[11px] text-gray-500 hover:text-white transition-colors underline mt-2">
                      Type response instead
                    </button>
                  </div>
                )
              )}
            </div>

            {/* Navigation buttons */}
            {hasAnsweredCurrent && !submittingAnswer && !aiThinking && currentGrading && (
              <div className="mt-auto pt-4 border-t border-midnight-border/40 flex justify-between items-center">
                {wsMode ? (
                  <button
                    onClick={endWsInterview}
                    className="text-xs text-gray-500 hover:text-red-400 transition-colors underline"
                  >
                    End Interview
                  </button>
                ) : (
                  isLastQuestion ? (
                    <span />
                  ) : (
                    <button onClick={handleNextQuestion} className="text-xs text-gray-500 hover:text-white transition-colors">
                      ← Previous
                    </button>
                  )
                )}

                {!wsMode && (
                  isLastQuestion ? (
                    <button onClick={handleCompleteInterview} className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 shadow-glow">
                      <Award size={14} />
                      <span>Complete & View Report</span>
                    </button>
                  ) : (
                    <button onClick={handleNextQuestion} className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 shadow-glow">
                      <span>Next Question</span>
                      <ArrowRight size={14} />
                    </button>
                  )
                )}

                {wsMode && (
                  <span className="text-[10px] text-gray-500">Answer submitted — AI generating next question...</span>
                )}
              </div>
            )}

            {/* WS mode: Complete button shown after last question */}
            {wsMode && dynamicQuestion?.is_last && hasAnsweredCurrent && !submittingAnswer && !aiThinking && (
              <div className="mt-4 pt-4 border-t border-midnight-border/40">
                <button onClick={endWsInterview} className="bg-primary hover:bg-primary-dark text-white font-bold w-full px-6 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-glow">
                  <Award size={14} />
                  <span>Complete Interview & View Report</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewRoom;
