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
  CheckCircle2,
  Settings2,
  Play,
  Check,
  RotateCcw,
  Sliders,
  X
} from 'lucide-react';
import API from '../services/api';
import CameraPanel from '../components/CameraPanel';
import Sidebar from '../components/Sidebar';
import { useAlert } from '../context/AlertContext';

// ── Soft Gemini-Style Text-to-Speech Helper (Web Speech API) ─────────────────
let activeUtterance = null;

export const getSoftGeminiVoice = (overrideVoiceName = null, ignoreSaved = false) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. If user explicitly provided a voice
  if (overrideVoiceName) {
    const userChoice = voices.find(v => v.name === overrideVoiceName);
    if (userChoice) return userChoice;
  }

  // If saved voice exists and we are not ignoring it, check if it's not a known robotic voice
  if (!ignoreSaved) {
    const saved = localStorage.getItem('ai_selected_voice');
    const isRobotic = saved && (
      saved.toLowerCase().includes('daniel') ||
      saved.toLowerCase().includes('albert') ||
      saved.toLowerCase().includes('fred') ||
      saved.toLowerCase().includes('bad news') ||
      saved.toLowerCase().includes('whisper') ||
      saved.toLowerCase().includes('zarvox')
    );
    if (saved && !isRobotic) {
      const savedChoice = voices.find(v => v.name === saved);
      if (savedChoice) return savedChoice;
    }
  }

  // 2. High-priority soft, warm, natural voices (macOS & Browser neural voices)
  const softVoiceKeywords = [
    // Soft Google / Natural voices (Chrome / Edge)
    'Google UK English Female',
    'Google US English',
    'Microsoft Jenny Online (Natural)',
    'Microsoft Aria Online (Natural)',
    // macOS Softest, gentlest voices installed on Mac
    'Karen',      // Australian, warm, soft, natural conversational
    'Moira',      // Irish, very gentle, calm & soothing
    'Sandy',      // US, friendly & natural
    'Shelley',    // US, soft female
    'Tessa',      // South African, soft & melodic
    'Samantha',   // US Siri clear conversational
    'Siri',
    'Serena',
    'Ava',
    'Zoe',
    'Allison',
    'Susan',
  ];

  for (const keyword of softVoiceKeywords) {
    const match = voices.find(v => v.name.toLowerCase().includes(keyword.toLowerCase()));
    if (match) return match;
  }

  // 3. Any English voice that is NOT an old harsh robotic legacy voice
  const roboticBlacklist = [
    'daniel', 'alex', 'fred', 'albert', 'junior', 'bad news', 'bahh', 'bells',
    'boing', 'cellos', 'deranged', 'good news', 'hysterical', 'pipe organ',
    'trinoids', 'whisper', 'zarvox', 'ralph', 'wobble', 'jester'
  ];
  const fallbackEnglish = voices.find(v =>
    (v.lang.startsWith('en-US') || v.lang.startsWith('en-GB') || v.lang.startsWith('en')) &&
    !roboticBlacklist.some(bad => v.name.toLowerCase().includes(bad))
  );

  return fallbackEnglish || voices[0] || null;
};

export const cleanTextForSpeech = (text) => {
  if (!text) return '';
  return text
    .replace(/[*_#`~]/g, '')           // Strip markdown formatting symbols
    .replace(/https?:\/\/\S+/g, '')     // Strip links
    .replace(/\s+/g, ' ')              // Normalize spacing
    .trim();
};

export const speakText = (text, { voiceName = null, rate = null, pitch = null, volume = 0.95 } = {}) => {
  if (!window.speechSynthesis || !text) return null;

  // Fix Chrome/Safari suspension bug
  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.cancel();
  } catch (e) {
    console.warn("SpeechSynthesis resume/cancel warning:", e);
  }

  const clean = cleanTextForSpeech(text);
  const utter = new SpeechSynthesisUtterance(clean);

  // Rate & pitch from params, localStorage or soft defaults
  const userRate = rate !== null ? rate : (parseFloat(localStorage.getItem('ai_voice_rate')) || 0.92);
  const userPitch = pitch !== null ? pitch : (parseFloat(localStorage.getItem('ai_voice_pitch')) || 1.0);

  // Soft, warm, conversational Gemini-style pacing and pitch
  utter.rate = userRate;     // 0.92: calm, thoughtful, conversational cadence
  utter.pitch = userPitch;   // 1.0: warm, natural conversational pitch
  utter.volume = volume;     // 0.95: soft and gentle delivery
  utter.lang = 'en-US';

  const softVoice = getSoftGeminiVoice(voiceName);
  if (softVoice) {
    utter.voice = softVoice;
  }

  // Preserve global reference to prevent Chrome garbage-collection speech cutoff bug
  window._activeUtterance = utter;
  activeUtterance = utter;

  utter.onend = () => {
    window._activeUtterance = null;
    activeUtterance = null;
  };
  utter.onerror = () => {
    window._activeUtterance = null;
    activeUtterance = null;
  };

  window.speechSynthesis.speak(utter);
  return utter;
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
};

// Convert Web Audio API decoded AudioBuffer to standard 16kHz 16-bit Mono WAV Blob
const audioBufferToWav = (buffer, targetSampleRate = 16000) => {
  const numChannels = buffer.numberOfChannels;
  const originalSampleRate = buffer.sampleRate;
  const length = buffer.length;

  let mono = new Float32Array(length);
  if (numChannels === 1) {
    mono = buffer.getChannelData(0);
  } else {
    const ch0 = buffer.getChannelData(0);
    const ch1 = buffer.getChannelData(1);
    for (let i = 0; i < length; i++) {
      mono[i] = (ch0[i] + ch1[i]) / 2;
    }
  }

  let downsampled;
  if (originalSampleRate === targetSampleRate) {
    downsampled = mono;
  } else {
    const ratio = originalSampleRate / targetSampleRate;
    const newLength = Math.round(length / ratio);
    downsampled = new Float32Array(newLength);
    for (let i = 0; i < newLength; i++) {
      const srcIdx = Math.min(Math.round(i * ratio), length - 1);
      downsampled[i] = mono[srcIdx];
    }
  }

  const wavBuffer = new ArrayBuffer(44 + downsampled.length * 2);
  const view = new DataView(wavBuffer);

  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + downsampled.length * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, targetSampleRate, true);
  view.setUint32(28, targetSampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, downsampled.length * 2, true);

  let offset = 44;
  for (let i = 0; i < downsampled.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, downsampled[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return new Blob([view], { type: 'audio/wav' });
};

const InterviewRoom = () => {
  const { toast, confirm } = useAlert();
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
  const [speechBlocked, setSpeechBlocked] = useState(false);
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

  // TTS & Voice Customization
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState(() => localStorage.getItem('ai_selected_voice') || '');
  const [voiceRate, setVoiceRate] = useState(() => parseFloat(localStorage.getItem('ai_voice_rate')) || 0.92);
  const [voicePitch, setVoicePitch] = useState(() => parseFloat(localStorage.getItem('ai_voice_pitch')) || 1.0);
  const [testingVoice, setTestingVoice] = useState(false);

  // Load and cache voices from browser
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const vList = window.speechSynthesis.getVoices() || [];
        if (vList.length > 0) {
          setAvailableVoices(vList);
          const savedVoice = localStorage.getItem('ai_selected_voice');
          const isRobotic = !savedVoice ||
            savedVoice.toLowerCase().includes('daniel') ||
            savedVoice.toLowerCase().includes('albert') ||
            savedVoice.toLowerCase().includes('fred');

          if (isRobotic) {
            const best = getSoftGeminiVoice(null, true);
            if (best) {
              setSelectedVoiceName(best.name);
              localStorage.setItem('ai_selected_voice', best.name);
            }
          } else {
            setSelectedVoiceName(savedVoice);
          }
        }
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    const unlockSpeech = () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      }
    };
    window.addEventListener('click', unlockSpeech, { once: true });
    window.addEventListener('keydown', unlockSpeech, { once: true });

    return () => {
      window.removeEventListener('click', unlockSpeech);
      window.removeEventListener('keydown', unlockSpeech);
    };
  }, []);

  const handleTestVoice = (overrideName = null, overrideRate = null, overridePitch = null) => {
    const vName = overrideName || selectedVoiceName;
    const r = overrideRate !== null ? overrideRate : voiceRate;
    const p = overridePitch !== null ? overridePitch : voicePitch;
    stopSpeech();
    setTestingVoice(true);
    const utter = speakText(
      "Hello! I am your AI interviewer. I will ask you questions in this soft, conversational voice.",
      { voiceName: vName, rate: r, pitch: p }
    );
    if (utter) {
      utter.onend = () => setTestingVoice(false);
      utter.onerror = () => setTestingVoice(false);
    } else {
      setTestingVoice(false);
    }
  };

  const handleReplayQuestion = () => {
    const currentQText = wsMode ? dynamicQuestion?.question : interview?.questions?.[currentQIndex]?.question_text;
    if (!currentQText) return;
    setAiSpeaking(true);
    const utter = speakText(currentQText, { voiceName: selectedVoiceName, rate: voiceRate, pitch: voicePitch });
    if (utter) {
      utter.onend = () => setAiSpeaking(false);
      utter.onerror = () => setAiSpeaking(false);
    } else {
      setAiSpeaking(false);
    }
  };

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

  // Safety timeout: prevent UI freeze if server or network hangs
  useEffect(() => {
    if (!aiThinking) return;
    const t = setTimeout(() => {
      setAiThinking(false);
      setSubmittingAnswer(false);
      setAiError('AI evaluation took longer than expected. Please try submitting again or use typing mode.');
      setTimeout(() => setAiError(null), 6000);
    }, 25000);
    return () => clearTimeout(t);
  }, [aiThinking]);

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
      setAiThinking(false);
      setSubmittingAnswer(false);
      if (event.code !== 1000 && event.code !== 4001) {
        // Unexpected close — fall back to REST mode
        setAiError('Live connection interrupted. Please try submitting your answer again.');
        setTimeout(() => setAiError(null), 5000);
        setWsMode(false);
        fetchSession();
      }
    };

    ws.onerror = (err) => {
      console.error('WS error:', err);
      setWsConnecting(false);
      setAiThinking(false);
      setSubmittingAnswer(false);
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
        const utter = speakText(msg.tts_text || msg.question, {
          voiceName: selectedVoiceName,
          rate: voiceRate,
          pitch: voicePitch,
        });
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
      toast.success(msg.message || 'All interview questions completed! Preparing your performance diagnostic report...', 'Session Finished');
      if (msg.redirect_url) {
        setTimeout(() => navigate(msg.redirect_url), 1200);
      }
      return;
    }

    if (type === 'error') {
      setAiThinking(false);
      setAiError(msg.message || 'An error occurred.');
      setTimeout(() => setAiError(null), 6000);
      return;
    }
  }, [ttsEnabled, dynamicQuestion, navigate, selectedVoiceName, voiceRate, voicePitch]);

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

  // ── CameraPanel Callbacks ─────────────────────────────────────────────────
  // Called by CameraPanel every ~1.5s during recording with real backend values.
  const handleEmotionUpdate = useCallback((dominantLabel, probs) => {
    if (probs && typeof probs === 'object' && Object.keys(probs).length > 0) {
      setEmotionsHistory(prev => [...prev, probs]);
    }
  }, []);

  const handleEyeContactUpdate = useCallback((score) => {
    if (typeof score === 'number' && !isNaN(score)) {
      setEyeContactHistory(prev => [...prev, score]);
    }
  }, []);

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

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: options.mimeType });
        audioStream.getTracks().forEach(track => track.stop());
        const currentSpokenText = transcriptRef.current.trim();

        // Convert audio to 16kHz mono WAV for Whisper transcription & soundfile compatibility
        let finalWavBlob = audioBlob;
        try {
          const arrayBuffer = await audioBlob.arrayBuffer();
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass && arrayBuffer.byteLength > 0) {
            const audioCtx = new AudioContextClass();
            const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);
            finalWavBlob = audioBufferToWav(decodedBuffer, 16000);
            try { audioCtx.close(); } catch {}
          }
        } catch (convErr) {
          console.warn('WAV conversion fallback:', convErr);
        }

        uploadAndGradeAnswer(finalWavBlob, currentSpokenText);
      };

      // Browser Speech Recognition (with graceful handling for Brave / blocked network)
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
          rec.hasNetworkError = false;

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
            if (e.error === 'network' || e.error === 'not-allowed') {
              rec.hasNetworkError = true;
              setSpeechBlocked(true);
            }
          };

          rec.onend = () => {
            if (!rec.hasNetworkError && mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
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
      toast.warning('Microphone permission required. Please allow microphone access in your browser to speak.', 'Mic Access Denied');
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

  const answeredQuestionsCount = wsMode
    ? (conversationLog.length + (lastFeedback ? 1 : 0))
    : (interview?.questions?.filter(q => q.answer_text !== null).length || 0);

  const handleCompleteInterview = async () => {
    if (answeredQuestionsCount === 0) {
      toast.warning('Please answer at least one question before finishing the interview.', 'Interview in Progress');
      return;
    }

    const confirmed = await confirm({
      title: 'Finish Interview Session?',
      message: `You have completed ${answeredQuestionsCount} response${answeredQuestionsCount > 1 ? 's' : ''}. Are you ready to submit and generate your comprehensive AI diagnostics & performance report?`,
      confirmText: 'Yes, View Report',
      cancelText: 'Stay in Session',
      type: 'info'
    });
    if (!confirmed) return;

    if (wsMode) {
      endWsInterview();
      return;
    }
    setLoading(true);
    try {
      await API.post(`/api/interviews/${id}/complete`);
      toast.success('Compiling comprehensive score report...', 'Session Completed');
      navigate(`/reports/${id}`);
    } catch (err) {
      toast.error('Error completing session. Please try again.', 'Finalize Error');
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
      toast.success('AI Interviewer ready. Entering session...', 'Room Initialized');
      navigate(`/interview/${res.data.id}`);
    } catch {
      toast.error('Failed to start interview. Check connection or backend keys.', 'Launch Failed');
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
            {interview?.company_domain && (
              <span className="bg-primary/20 text-primary-light border border-primary/30 px-2.5 py-0.5 rounded-md font-extrabold text-[10px]">
                🏢 {interview.company_domain}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Finish & View Report Button */}
          {answeredQuestionsCount >= 1 && (
            <button
              onClick={handleCompleteInterview}
              className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-glow transition-all active:scale-95"
              title="Finish interview session and view detailed diagnostic report"
            >
              <Award size={13} />
              <span>Finish & View Report</span>
            </button>
          )}

          {/* WS Status */}
          <div className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${wsConnected ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-gray-500/10 border-gray-500/20 text-gray-500'}`}>
            {wsConnected ? <Wifi size={10} /> : <WifiOff size={10} />}
            {wsConnected ? 'Live AI' : 'Standard'}
          </div>

          {/* TTS Toggle */}
          <button
            onClick={() => { setTtsEnabled(!ttsEnabled); stopSpeech(); setAiSpeaking(false); }}
            className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${ttsEnabled ? 'bg-primary/10 border-primary/20 text-primary-light shadow-[0_0_12px_rgba(124,58,237,0.15)]' : 'bg-gray-700/50 border-gray-600/30 text-gray-500'}`}
            title="Toggle Soft Gemini-Style AI Voice"
          >
            {ttsEnabled ? <Volume2 size={10} /> : <VolumeX size={10} />}
            {ttsEnabled ? 'Gemini Voice' : 'Voice Off'}
          </button>

          {/* Voice Settings */}
          <button
            onClick={() => setShowVoiceModal(true)}
            className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border border-midnight-border bg-midnight hover:bg-midnight-light text-gray-300 hover:text-white transition-all shadow-sm"
            title="Configure AI Voice Settings"
          >
            <Sliders size={10} className="text-primary-light" />
            <span>Voice Settings</span>
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
            <span className={`text-xs font-mono px-2.5 py-1 rounded-full border ${
              dynamicQuestion.is_last 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold' 
                : 'bg-midnight border-midnight-border text-gray-400'
            }`}>
              Q#{dynamicQuestion.question_number}{dynamicQuestion.is_last ? ' (Final)' : '/10'}
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

                {/* Final Question indicator */}
                {dynamicQuestion?.is_last && (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 animate-pulse">
                    🏁 Final Question
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
                <div className="mt-3">
                  <h2 className="font-display font-extrabold text-lg md:text-xl text-white leading-relaxed">
                    "{wsMode ? dynamicQuestion?.question : currentQ?.question_text}"
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <button
                      onClick={handleReplayQuestion}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-light hover:text-white bg-primary/15 hover:bg-primary/25 border border-primary/30 px-3 py-1.5 rounded-xl transition-all active:scale-95 shadow-sm"
                      title="Replay this question aloud"
                    >
                      <Volume2 size={13} className={aiSpeaking ? 'animate-pulse text-primary-light' : ''} />
                      <span>{aiSpeaking ? 'Speaking...' : '🔊 Replay Question'}</span>
                    </button>
                    <button
                      onClick={() => setShowVoiceModal(true)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-400 hover:text-gray-200 transition-colors bg-midnight border border-midnight-border/70 hover:border-midnight-border px-2.5 py-1.5 rounded-xl"
                      title="Configure AI Voice"
                    >
                      <Sliders size={11} className="text-primary-light" />
                      <span>Voice: {selectedVoiceName ? selectedVoiceName.split(' ')[0] : 'Gemini Soft'}</span>
                    </button>
                  </div>
                </div>
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
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                        <span>Listening...</span>
                      </p>
                      <p className="text-gray-400">Speak clearly into your microphone.</p>
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

            {/* Session Progress & Finish Bar (always visible once at least 1 question is answered) */}
            {answeredQuestionsCount >= 1 && (
              <div className="mt-auto pt-3.5 border-t border-midnight-border/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-gray-400 font-mono">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{answeredQuestionsCount}/10 completed</span>
                </div>
                <button
                  onClick={handleCompleteInterview}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 transition-all active:scale-95 shadow-sm"
                  title="Finish interview and calculate final score"
                >
                  <Award size={13} />
                  <span>Finish & View Report</span>
                </button>
              </div>
            )}

            {/* REST Mode Next/Prev controls */}
            {!wsMode && hasAnsweredCurrent && !submittingAnswer && (
              <div className="mt-3 flex justify-between items-center">
                {!isLastQuestion && (
                  <button onClick={handleNextQuestion} className="text-xs text-gray-500 hover:text-white transition-colors">
                    ← Previous
                  </button>
                )}
                {isLastQuestion ? (
                  <button onClick={handleCompleteInterview} className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-glow ml-auto">
                    <Award size={14} />
                    <span>Complete & View Report</span>
                  </button>
                ) : (
                  <button onClick={handleNextQuestion} className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-glow ml-auto">
                    <span>Next Question</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Voice Settings Modal */}
      {showVoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-midnight-light border border-midnight-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-midnight-border/60">
              <div className="flex items-center gap-2">
                <Sliders size={18} className="text-primary-light" />
                <h3 className="text-base font-bold text-white">AI Voice Settings</h3>
              </div>
              <button
                onClick={() => { stopSpeech(); setTestingVoice(false); setShowVoiceModal(false); }}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-midnight transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 py-4">
              {/* Presets */}
              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                  Quick Presets (Click to Preview)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {/* Preset 1: Gemini Soft Karen */}
                  <button
                    onClick={() => {
                      const soft = availableVoices.find(v => v.name.toLowerCase().includes('karen')) ||
                                   availableVoices.find(v => v.name.toLowerCase().includes('google uk english female')) ||
                                   availableVoices.find(v => v.name.toLowerCase().includes('moira')) ||
                                   availableVoices[0];
                      if (soft) {
                        setSelectedVoiceName(soft.name);
                        localStorage.setItem('ai_selected_voice', soft.name);
                      }
                      setVoiceRate(0.92);
                      localStorage.setItem('ai_voice_rate', '0.92');
                      setVoicePitch(1.0);
                      localStorage.setItem('ai_voice_pitch', '1.0');
                      handleTestVoice(soft ? soft.name : null, 0.92, 1.0);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all group ${
                      selectedVoiceName.toLowerCase().includes('karen')
                        ? 'border-primary bg-primary/20 shadow-[0_0_15px_rgba(124,58,237,0.25)]'
                        : 'border-primary/40 bg-primary/10 hover:bg-primary/20'
                    }`}
                  >
                    <div className="text-xs font-bold text-primary-light group-hover:text-white flex items-center justify-between">
                      <span>✨ Gemini Soft (Karen)</span>
                      {selectedVoiceName.toLowerCase().includes('karen') && <Check size={12} className="text-primary-light" />}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">Warm, Gentle & Natural</div>
                  </button>

                  {/* Preset 2: Gentle Moira */}
                  <button
                    onClick={() => {
                      const moira = availableVoices.find(v => v.name.toLowerCase().includes('moira')) ||
                                    availableVoices.find(v => v.name.toLowerCase().includes('tessa')) ||
                                    availableVoices[0];
                      if (moira) {
                        setSelectedVoiceName(moira.name);
                        localStorage.setItem('ai_selected_voice', moira.name);
                      }
                      setVoiceRate(0.92);
                      localStorage.setItem('ai_voice_rate', '0.92');
                      setVoicePitch(1.0);
                      localStorage.setItem('ai_voice_pitch', '1.0');
                      handleTestVoice(moira ? moira.name : null, 0.92, 1.0);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all group ${
                      selectedVoiceName.toLowerCase().includes('moira')
                        ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                        : 'border-midnight-border bg-midnight hover:bg-midnight-light'
                    }`}
                  >
                    <div className="text-xs font-bold text-cyan-300 group-hover:text-white flex items-center justify-between">
                      <span>🌸 Melodic (Moira)</span>
                      {selectedVoiceName.toLowerCase().includes('moira') && <Check size={12} className="text-cyan-300" />}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">Soft, Calming & Polite</div>
                  </button>

                  {/* Preset 3: Clear Samantha */}
                  <button
                    onClick={() => {
                      const sam = availableVoices.find(v => v.name.toLowerCase().includes('samantha')) ||
                                  availableVoices.find(v => v.name.toLowerCase().includes('google us english')) ||
                                  availableVoices[0];
                      if (sam) {
                        setSelectedVoiceName(sam.name);
                        localStorage.setItem('ai_selected_voice', sam.name);
                      }
                      setVoiceRate(0.95);
                      localStorage.setItem('ai_voice_rate', '0.95');
                      setVoicePitch(1.0);
                      localStorage.setItem('ai_voice_pitch', '1.0');
                      handleTestVoice(sam ? sam.name : null, 0.95, 1.0);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all group ${
                      selectedVoiceName.toLowerCase().includes('samantha')
                        ? 'border-emerald-400 bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                        : 'border-midnight-border bg-midnight hover:bg-midnight-light'
                    }`}
                  >
                    <div className="text-xs font-bold text-emerald-300 group-hover:text-white flex items-center justify-between">
                      <span>🎙️ Conversational (Samantha)</span>
                      {selectedVoiceName.toLowerCase().includes('samantha') && <Check size={12} className="text-emerald-300" />}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">Clear US Conversational</div>
                  </button>

                  {/* Preset 4: Warm Sandy/Shelley */}
                  <button
                    onClick={() => {
                      const warm = availableVoices.find(v => v.name.toLowerCase().includes('sandy')) ||
                                   availableVoices.find(v => v.name.toLowerCase().includes('shelley')) ||
                                   availableVoices.find(v => v.name.toLowerCase().includes('tessa')) ||
                                   availableVoices[0];
                      if (warm) {
                        setSelectedVoiceName(warm.name);
                        localStorage.setItem('ai_selected_voice', warm.name);
                      }
                      setVoiceRate(0.92);
                      localStorage.setItem('ai_voice_rate', '0.92');
                      setVoicePitch(1.05);
                      localStorage.setItem('ai_voice_pitch', '1.05');
                      handleTestVoice(warm ? warm.name : null, 0.92, 1.05);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all group ${
                      selectedVoiceName.toLowerCase().includes('sandy') || selectedVoiceName.toLowerCase().includes('shelley')
                        ? 'border-amber-400 bg-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                        : 'border-midnight-border bg-midnight hover:bg-midnight-light'
                    }`}
                  >
                    <div className="text-xs font-bold text-amber-300 group-hover:text-white flex items-center justify-between">
                      <span>🌼 Warm (Sandy/Shelley)</span>
                      {(selectedVoiceName.toLowerCase().includes('sandy') || selectedVoiceName.toLowerCase().includes('shelley')) && <Check size={12} className="text-amber-300" />}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">Friendly & Engaging</div>
                  </button>
                </div>
              </div>

              {/* Categorized Voice Dropdown */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Select Voice (System Voices)
                  </label>
                  <span className="text-[10px] text-primary-light font-mono">
                    {availableVoices.filter(v => v.lang && v.lang.startsWith('en')).length} English voices
                  </span>
                </div>
                <select
                  value={selectedVoiceName}
                  onChange={(e) => {
                    const chosen = e.target.value;
                    setSelectedVoiceName(chosen);
                    localStorage.setItem('ai_selected_voice', chosen);
                    handleTestVoice(chosen);
                  }}
                  className="w-full bg-midnight border border-midnight-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-primary/60"
                >
                  <optgroup label="🌟 Recommended English Voices (Gemini Style)">
                    {availableVoices
                      .filter(v => v.lang && v.lang.startsWith('en'))
                      .map((v, idx) => (
                        <option key={`en-voice-${v.name}-${v.lang}-${idx}`} value={v.name}>
                          {v.name} ({v.lang}) {
                            v.name.includes('Karen') ? '★ Recommended: Gemini Soft' :
                            v.name.includes('Moira') ? '★ Recommended: Melodic Gentle' :
                            v.name.includes('Sandy') || v.name.includes('Shelley') ? '★ Natural Warm' :
                            v.name.includes('Samantha') ? '★ Clear Conversational' :
                            v.name.includes('Tessa') ? '★ Soft Melodic' : ''
                          }
                        </option>
                      ))}
                  </optgroup>
                  {availableVoices.some(v => !v.lang || !v.lang.startsWith('en')) && (
                    <optgroup label="🌐 Other Voices">
                      {availableVoices
                        .filter(v => !v.lang || !v.lang.startsWith('en'))
                        .map((v, idx) => (
                          <option key={`other-voice-${v.name}-${v.lang}-${idx}`} value={v.name}>
                            {v.name} ({v.lang})
                          </option>
                        ))}
                    </optgroup>
                  )}
                </select>
              </div>

              {/* Speed / Rate slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-gray-400">Speaking Speed:</span>
                  <span className="font-mono text-primary-light font-semibold">{voiceRate.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.25"
                  step="0.05"
                  value={voiceRate}
                  onChange={(e) => {
                    const r = parseFloat(e.target.value);
                    setVoiceRate(r);
                    localStorage.setItem('ai_voice_rate', r);
                  }}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
                  <span>Slow & Gentle (0.75x)</span>
                  <span>Conversational (0.92x)</span>
                  <span>Fast (1.25x)</span>
                </div>
              </div>

              {/* Pitch slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-gray-400">Voice Pitch:</span>
                  <span className="font-mono text-primary-light font-semibold">{voicePitch.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.80"
                  max="1.20"
                  step="0.05"
                  value={voicePitch}
                  onChange={(e) => {
                    const p = parseFloat(e.target.value);
                    setVoicePitch(p);
                    localStorage.setItem('ai_voice_pitch', p);
                  }}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
                  <span>Deeper Tone (0.80)</span>
                  <span>Natural (1.00)</span>
                  <span>Higher Tone (1.20)</span>
                </div>
              </div>
            </div>

            {/* Test & Action Buttons */}
            <div className="flex items-center gap-2.5 pt-3 border-t border-midnight-border/60">
              <button
                onClick={() => handleTestVoice()}
                disabled={testingVoice}
                className="flex-1 py-2.5 px-3 bg-midnight hover:bg-midnight-light border border-primary/40 text-primary-light hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <Play size={13} className={testingVoice ? 'animate-spin' : ''} />
                <span>{testingVoice ? 'Speaking...' : '▶ Test Voice'}</span>
              </button>

              <button
                onClick={() => {
                  stopSpeech();
                  setTestingVoice(false);
                  localStorage.setItem('ai_selected_voice', selectedVoiceName);
                  localStorage.setItem('ai_voice_rate', voiceRate);
                  localStorage.setItem('ai_voice_pitch', voicePitch);
                  setShowVoiceModal(false);
                }}
                className="flex-1 py-2.5 px-3 bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-glow transition-all"
              >
                <Check size={14} />
                <span>Save & Apply</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewRoom;
