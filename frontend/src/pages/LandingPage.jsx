import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Video, 
  Mic, 
  Smile, 
  Eye, 
  Cpu, 
  FileText, 
  Activity, 
  LineChart, 
  ShieldCheck, 
  CheckCircle, 
  HelpCircle, 
  Bot, 
  AudioLines, 
  ScanFace, 
  Sparkles,
  Wifi,
  Volume2,
  Rocket,
  Lock,
  Download,
  Zap,
  BarChart3,
  Award,
  UploadCloud,
  Sliders,
  ChevronRight,
  Terminal,
  Users,
  Target,
  Layers,
  Clock,
  MessageSquare
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FAQItem from '../components/FAQItem';

const LandingPage = () => {
  const [activeFaqCategory, setActiveFaqCategory] = useState('All');
  
  const features = [
    {
      title: "AI Interviewer",
      desc: "Get role-specific, dynamic questions that adapt to your experience level and flow of conversation.",
      icon: Cpu
    },
    {
      title: "Voice Interview",
      desc: "Speak naturally using your microphone. Our interface works like a live virtual panel.",
      icon: Mic
    },
    {
      title: "Emotion Detection",
      desc: "Analyze facial expression queues in real time to evaluate presentation confidence.",
      icon: Smile
    },
    {
      title: "Eye Contact Detection",
      desc: "Track attention metrics to ensure stable engagement postures throughout key questions.",
      icon: Eye
    },
    {
      title: "AI Answer Evaluation",
      desc: "Get deep, semantic scoring for relevance, clarity, technical accuracy, and completeness.",
      icon: ShieldCheck
    },
    {
      title: "Resume-Based Questions",
      desc: "Upload your resume to receive highly customized questions matching your job history.",
      icon: FileText
    },
    {
      title: "Speaking Behavior Analysis",
      desc: "Track speech velocity (wpm), pauses, fillers, and tone variation dynamically.",
      icon: Activity
    },
    {
      title: "Detailed Reports",
      desc: "Receive scores, breakdowns, and expert feedback recommendations instantly.",
      icon: LineChart
    }
  ];

  const steps = [
    {
      num: "01",
      badge: "Step 01 • PDF Ingestion",
      title: "Smart Resume Upload",
      subtitle: "Instant profile extraction",
      desc: "Drag and drop your PDF resume. Our parsing pipeline extracts your projects, core tech stack, and experience level in seconds.",
      icon: UploadCloud,
      color: "from-blue-600 to-indigo-600",
      accentBg: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      borderHover: "hover:border-blue-400/50 hover:shadow-blue-500/10",
      previewType: "resume"
    },
    {
      num: "02",
      badge: "Step 02 • Role Config",
      title: "Tailor Persona & Protocol",
      subtitle: "Custom challenge parameters",
      desc: "Select your target engineering role, seniority level, and interview format (Technical Deep-Dive, HR, or STAR Behavioral).",
      icon: Sliders,
      color: "from-purple-600 to-pink-600",
      accentBg: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      borderHover: "hover:border-purple-400/50 hover:shadow-purple-500/10",
      previewType: "config"
    },
    {
      num: "03",
      badge: "Step 03 • Live AI Panel",
      title: "AI Panel Face-Off",
      subtitle: "Real-time speech & vision",
      desc: "Speak naturally into your mic while computer vision tracks gaze stability and facial confidence with live adaptive follow-up questions.",
      icon: Video,
      color: "from-amber-500 to-orange-600",
      accentBg: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      borderHover: "hover:border-amber-400/50 hover:shadow-amber-500/10",
      previewType: "interview"
    },
    {
      num: "04",
      badge: "Step 04 • Diagnostic Report",
      title: "Executive Scorecard & PDF",
      subtitle: "Benchmark rubric & growth",
      desc: "Receive semantic scoring across technical depth, clarity, and body language, complete with an official downloadable PDF report.",
      icon: Award,
      color: "from-emerald-600 to-teal-600",
      accentBg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      borderHover: "hover:border-emerald-400/50 hover:shadow-emerald-500/10",
      previewType: "report"
    }
  ];

  const formats = [
    {
      id: "technical",
      title: "Technical & System Architecture",
      category: "ENGINEERING • ARCHITECTURE • CODING",
      icon: Terminal,
      accent: "from-blue-600 to-indigo-600",
      accentBg: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      borderHover: "hover:border-blue-400/50 hover:shadow-blue-500/10",
      duration: "15–25 Mins",
      difficulty: "Adaptive Hard",
      desc: "Simulate rigorous engineering panels covering distributed systems, database indexing, concurrency bottlenecks, and API protocol design.",
      topics: ["System Design", "Database Schemas", "Concurrency", "API Architecture"],
      sampleQuestion: "How would you ensure idempotent message processing in a payment queue during high retry spikes?",
      evalCriteria: ["System Tradeoffs", "Scale Architecture", "Edge-Case Resilience"]
    },
    {
      id: "hr",
      title: "HR & Leadership Behavioral",
      category: "CULTURE FIT • LEADERSHIP • EQ",
      icon: Users,
      accent: "from-purple-600 to-pink-600",
      accentBg: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      borderHover: "hover:border-purple-400/50 hover:shadow-purple-500/10",
      duration: "10–20 Mins",
      difficulty: "Medium",
      desc: "Evaluate essential interpersonal competencies, cross-team conflict resolution, core motivations, and high-impact workplace communication.",
      topics: ["Conflict Resolution", "Stakeholder Sync", "Career Trajectory", "Values Fit"],
      sampleQuestion: "Can you describe a time you pushed back against unrealistic roadmap deadlines? How did you align the team?",
      evalCriteria: ["Communication Poise", "Conflict De-escalation", "Executive Presence"]
    },
    {
      id: "star",
      title: "Behavioral STAR Methodology",
      category: "STRUCTURED COMPETENCY FRAMEWORK",
      icon: Target,
      accent: "from-emerald-600 to-teal-600",
      accentBg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      borderHover: "hover:border-emerald-400/50 hover:shadow-emerald-500/10",
      duration: "15–25 Mins",
      difficulty: "Structured",
      desc: "Structured scenario questioning enforcing precise Situation, Task, Action, and Quantified Result frameworks utilized by Tier-1 tech giants.",
      topics: ["High-Stakes Crisis", "Project Ownership", "Measurable ROI", "Learning from Failure"],
      sampleQuestion: "Walk through a critical production outage you triaged. Break down the Situation, Task, your Action, and final Result.",
      evalCriteria: ["STAR Completeness", "Quantifiable Impact", "Personal Accountability"]
    },
    {
      id: "resume",
      title: "Resume-Personalized Deep Dive",
      category: "AI CV INGESTION • TECH STACK PROBING",
      icon: FileText,
      accent: "from-amber-500 to-orange-600",
      accentBg: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      borderHover: "hover:border-amber-400/50 hover:shadow-amber-500/10",
      duration: "20–30 Mins",
      difficulty: "Personalized",
      desc: "Our LLM parses your uploaded resume line-by-line, probing into real project implementations, claims, libraries, and architectural decisions.",
      topics: ["Claimed Tech Stack", "Past Project Architecture", "Individual Contribution", "Scale Metrics"],
      sampleQuestion: "I see you built a rate limiter with Redis on your recent project. Why Redis over memory tokens, and how did you prevent race conditions?",
      evalCriteria: ["Resume Authenticity", "Technical Depth", "Implementation Defense"]
    }
  ];

  const pricing = [
    {
      name: "Starter",
      price: "$0",
      period: "forever",
      desc: "Great for testing the waters and practicing core definitions.",
      features: [
        "3 full interviews per month",
        "Standard speech transcription",
        "Basic visual indicators",
        "Web browser panel access"
      ],
      cta: "Start Practice",
      isPopular: false
    },
    {
      name: "Professional",
      price: "$19",
      period: "month",
      desc: "Designed for active job hunters aiming for mid-senior roles.",
      features: [
        "Unlimited practice sessions",
        "Resume custom questions",
        "DeepFace emotion parsing",
        "Speaking rate & filler diagnostics",
        "PDF evaluation downloads"
      ],
      cta: "Upgrade to Pro",
      isPopular: true
    },
    {
      name: "Premium",
      price: "$39",
      period: "month",
      desc: "Complete coaching suites with semantic analysis overlays.",
      features: [
        "Everything in Professional",
        "Priority AI queue processing",
        "Deep CV landmark tracking",
        "Studying path planning engine",
        "1-on-1 performance sharing links"
      ],
      cta: "Go Premium",
      isPopular: false
    }
  ];

  const faqCategories = [
    'All',
    'AI & Intelligence',
    'Computer Vision & Audio',
    'Privacy & Data Security',
    'Reports & Scoring'
  ];

  const faqs = [
    {
      category: "AI & Intelligence",
      icon: Bot,
      q: "What makes InterviewAI fundamentally different from standard mock platforms?",
      a: "Traditional mock interview platforms either require scheduling expensive human coaches or rely on static multiple-choice flashcards. InterviewAI deploys an autonomous AI panel that ingests your real resume, dynamically generates adaptive follow-up counter-questions based on your live speech, and monitors gaze stability and composure via computer vision — delivering actionable diagnostic scorecards in under 5 minutes."
    },
    {
      category: "AI & Intelligence",
      icon: Cpu,
      q: "How does the AI generate realistic, role-tailored questions?",
      a: "We employ a LangChain multi-prompt pipeline backed by high-reasoning LLMs (OpenAI GPT-4o / GPT-4o-mini). The engine parses your uploaded PDF resume to extract projects, claimed tech stack, and seniority tier, dynamically crafting targeted system design, technical, or STAR behavioral challenges. If your answer is incomplete, the AI probes deeper with real-time counter-questions just like a Principal Engineer or Senior Hiring Manager."
    },
    {
      category: "Computer Vision & Audio",
      icon: ScanFace,
      q: "How does the real-time emotion and eye contact tracking work?",
      a: "Our computer vision pipeline runs an ONNX Emotion-FERPlus deep convolutional neural network coupled with OpenCV Haar Cascades for facial landmark centering and gaze alignment. It deterministically analyzes facial expressions (Neutral, Confident/Happy, Attentive) and verifies direct eye engagement with the camera in real-time (~13ms per frame on CPU), with zero random simulation."
    },
    {
      category: "Computer Vision & Audio",
      icon: AudioLines,
      q: "Does it analyze speaking velocity, pauses, and filler words?",
      a: "Yes! Speech is transcribed via OpenAI Whisper with near-zero word error rate. The system computes your speaking rate (optimal is 130–150 words per minute), tracks filler words ('um', 'uh', 'like', 'you know'), detects unnaturally long pauses, and provides feedback on communication conciseness."
    },
    {
      category: "Computer Vision & Audio",
      icon: Video,
      q: "What if I don't want to use my webcam or have poor lighting?",
      a: "Webcam analysis is completely optional. You can practice in Voice-Only mode or even toggle Text mode if you prefer typing your answers. When webcam is enabled, our adaptive contrast normalization ensures reliable tracking even in low-light home office environments."
    },
    {
      category: "Privacy & Data Security",
      icon: ShieldCheck,
      q: "Is my webcam video or microphone audio recorded or sold?",
      a: "Never. Your privacy is paramount. Video frames are analyzed transiently in-memory for facial telemetry and immediately discarded — video streams are never stored on our servers, nor are they used to train third-party public models. Audio recordings are encrypted in transit and can be permanently purged by you at any time."
    },
    {
      category: "Privacy & Data Security",
      icon: Lock,
      q: "Who has access to my uploaded resume and interview performance data?",
      a: "Only you. Your resume text is parsed in an isolated sandbox session strictly to generate session-specific questions. Your interview records, telemetry logs, and diagnostic scorecards are tied exclusively to your authenticated account and are never shared publicly."
    },
    {
      category: "Reports & Scoring",
      icon: FileText,
      q: "What insights are included in the downloadable PDF report?",
      a: "The executive diagnostic report contains a comprehensive breakdown: overall Hire Readiness score (0–100), metric radars for Technical Depth, Communication, and Body Language, a question-by-question transcript with actionable improvement suggestions, and recommended study resources."
    },
    {
      category: "Reports & Scoring",
      icon: Award,
      q: "Can I share my score with recruiters or hiring managers?",
      a: "Yes! Every completed session generates an official downloadable PDF rating sheet with verified timestamps and rubric breakdowns that you can attach to job applications, portfolios, or LinkedIn profiles."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col mesh-bg">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center relative overflow-hidden">
        {/* Animated badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
          <Cpu size={12} />
          <span>AI-Powered Interview Practice</span>
        </div>

        {/* Hero Headline */}
        <h1 className="font-display font-extrabold text-4xl md:text-6xl text-midnight leading-tight max-w-4xl">
          Ace Your Next Career Step with <span className="bg-gradient-to-r from-primary to-accent-pink bg-clip-text text-transparent">InterviewAI</span>
        </h1>

        {/* Hero description */}
        <p className="text-gray-500 text-lg md:text-xl max-w-2xl mt-6 leading-relaxed">
          Practice smarter. Speak confidently. Receive detailed, real-time AI evaluations on your technical answers, eye contact, and speaking patterns.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
          <Link to="/register" className="btn-primary py-3 px-8 text-base">
            <span>Start Free Interview</span>
            <ArrowRight size={18} />
          </Link>
          <a href="#features" className="btn-secondary py-3 px-8 text-base">
            Explore Features
          </a>
        </div>

        {/* Core Intelligence Capabilities Ribbon */}
        <div className="mt-14 w-full max-w-5xl animate-fadeIn">
          {/* Subtle separator label */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-cream-border"></span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
              <Sparkles size={12} className="text-primary" />
              Real-Time Evaluation Engine
            </span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-cream-border"></span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            
            {/* 1. Dynamic AI Engine */}
            <div className="group relative bg-white/85 hover:bg-white backdrop-blur-xl border border-cream-border/80 hover:border-primary/50 rounded-2xl p-3.5 px-4 shadow-glass hover:shadow-premium hover:-translate-y-1 transition-all duration-300 flex items-center gap-3.5 text-left">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500/15 via-purple-500/10 to-transparent text-primary border border-primary/20 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:shadow-glow transition-all">
                <Bot size={22} className="text-primary" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-xs text-midnight tracking-tight group-hover:text-primary transition-colors">
                    AI Dynamic Panel
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <span className="text-[11px] text-gray-500 font-medium truncate">
                  Adaptive Counter-Qs
                </span>
              </div>
            </div>

            {/* 2. Voice Analytics */}
            <div className="group relative bg-white/85 hover:bg-white backdrop-blur-xl border border-cream-border/80 hover:border-accent-pink/50 rounded-2xl p-3.5 px-4 shadow-glass hover:shadow-premium hover:-translate-y-1 transition-all duration-300 flex items-center gap-3.5 text-left">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500/15 via-rose-500/10 to-transparent text-accent-pink border border-accent-pink/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-all">
                <AudioLines size={22} className="text-accent-pink" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-xs text-midnight tracking-tight group-hover:text-accent-pink transition-colors">
                    Voice & Speech AI
                  </span>
                  <span className="text-[9px] font-semibold bg-accent-pink/10 text-accent-pink px-1.5 py-0.5 rounded-md">
                    Whisper
                  </span>
                </div>
                <span className="text-[11px] text-gray-500 font-medium truncate">
                  Pace, Tone & Clarity
                </span>
              </div>
            </div>

            {/* 3. Eye & Gaze Tracker */}
            <div className="group relative bg-white/85 hover:bg-white backdrop-blur-xl border border-cream-border/80 hover:border-emerald-500/50 rounded-2xl p-3.5 px-4 shadow-glass hover:shadow-premium hover:-translate-y-1 transition-all duration-300 flex items-center gap-3.5 text-left">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent text-emerald-600 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-all">
                <ScanFace size={22} className="text-emerald-600" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-xs text-midnight tracking-tight group-hover:text-emerald-600 transition-colors">
                    Face & Eye Tracker
                  </span>
                  <span className="text-[9px] font-semibold bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded-md">
                    FERPlus
                  </span>
                </div>
                <span className="text-[11px] text-gray-500 font-medium truncate">
                  100% Real-Time CV
                </span>
              </div>
            </div>

            {/* 4. Resume Customization */}
            <div className="group relative bg-white/85 hover:bg-white backdrop-blur-xl border border-cream-border/80 hover:border-amber-500/50 rounded-2xl p-3.5 px-4 shadow-glass hover:shadow-premium hover:-translate-y-1 transition-all duration-300 flex items-center gap-3.5 text-left">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent text-amber-600 border border-amber-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-all">
                <FileText size={22} className="text-amber-600" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-xs text-midnight tracking-tight group-hover:text-amber-600 transition-colors">
                    Resume Intelligence
                  </span>
                  <span className="text-[9px] font-semibold bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded-md">
                    Tailored
                  </span>
                </div>
                <span className="text-[11px] text-gray-500 font-medium truncate">
                  Personalized Projects
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Real Live Interview Interface Showcase Preview */}
        <div className="mt-16 w-full max-w-5xl rounded-3xl p-2 md:p-3 bg-midnight/95 border border-midnight-border shadow-2xl relative group">
          {/* Subtle Outer Ambient Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent-pink/15 to-emerald-500/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition duration-1000 -z-10" />

          {/* Browser / App Header Titlebar */}
          <div className="px-4 py-2.5 bg-midnight-light/80 border-b border-midnight-border/70 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50" />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-midnight border border-midnight-border text-[11px] text-gray-400 font-mono">
              <Lock size={10} className="text-primary-light" />
              <span>interviewai.app/interview/live-session</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline font-mono">Live Session 120 FPS</span>
            </div>
          </div>

          {/* Real Interview Room Header */}
          <div className="px-5 py-3.5 border-b border-midnight-border/50 flex flex-wrap justify-between items-center bg-midnight/60 backdrop-blur-md gap-3">
            <div className="flex items-center gap-3">
              <div className="text-xs font-semibold text-gray-300 bg-midnight border border-midnight-border px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                <span>← Exit Room</span>
              </div>
              <div className="h-4 w-px bg-midnight-border/80" />
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-bold text-white">Software Engineer</span>
                <span className="text-gray-500">(Technical)</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border bg-green-500/10 border-green-500/20 text-green-400">
                <Wifi size={10} />
                <span>Live AI</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border bg-primary/10 border-primary/20 text-primary-light">
                <Volume2 size={10} />
                <span>Voice On</span>
              </div>
              <span className="text-xs text-gray-400 font-mono font-semibold">Q#2</span>
            </div>
          </div>

          {/* Main Interview Body (Two Columns: Camera on Left, Question Panel on Right) */}
          <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 bg-midnight rounded-b-2xl">
            
            {/* LEFT: Camera Feed Panel + Tip */}
            <div className="lg:col-span-7 flex flex-col gap-3.5">
              {/* Webcam Container */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-midnight-border relative shadow-premium flex items-center justify-center">
                {/* Real Candidate Webcam Photo */}
                <img 
                  src="/mock_webcam_feed.jpg" 
                  alt="Candidate webcam feed"
                  className="w-full h-full object-cover transform -scale-x-100"
                />
                
                {/* Crosshair Target Scan Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-52 h-60 border border-primary/40 rounded-lg relative">
                    {/* Corners */}
                    <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-primary-light" />
                    <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-primary-light" />
                    <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-primary-light" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-primary-light" />
                    
                    {/* Animated vertical scan line */}
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-accent-pink to-transparent animate-pulse absolute top-1/2 -translate-y-1/2 opacity-70" />
                  </div>
                </div>

                {/* Top Left HUD */}
                <div className="absolute top-3.5 left-3.5 bg-midnight/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-midnight-border text-[11px] text-white flex items-center gap-1.5 shadow-premium">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                  <span className="font-medium">Camera Ready</span>
                </div>

                {/* Top Right HUD */}
                <div className="absolute top-3.5 right-3.5 bg-midnight/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-midnight-border text-[11px] text-emerald-400 font-medium flex items-center gap-1.5 shadow-premium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Face Aligned & Focused</span>
                </div>

                {/* Bottom Left HUD */}
                <div className="absolute bottom-3.5 left-3.5 flex flex-col gap-1.5 text-[11px] font-semibold text-white">
                  <div className="bg-midnight/80 backdrop-blur-md px-3 py-1 rounded-lg border border-midnight-border/70">
                    Emotion: <span className="text-primary-light">Neutral</span>
                  </div>
                  <div className="bg-midnight/80 backdrop-blur-md px-3 py-1 rounded-lg border border-midnight-border/70">
                    Eye Contact: <span className="text-green-400">Optimal (90%)</span>
                  </div>
                </div>
              </div>

              {/* Bottom Tip Banner */}
              <div className="glass-card-dark p-3.5 px-4 border border-midnight-border/60 text-xs text-gray-400 leading-relaxed flex items-start gap-2.5 rounded-xl text-left">
                <HelpCircle size={16} className="text-primary-light shrink-0 mt-0.5" />
                <span>
                  <strong className="text-gray-300">💡 Tip:</strong> Keep your face aligned in the frame. The AI adapts follow-up questions based on your answers — the better you answer, the more challenging it gets!
                </span>
              </div>
            </div>

            {/* RIGHT: Dynamic Question Card & Audio Answer Panel */}
            <div className="lg:col-span-5 glass-card-dark p-5 md:p-6 border border-midnight-border rounded-2xl flex flex-col justify-between text-left relative overflow-hidden">
              {/* Question Header & Tags */}
              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary-light">
                  QUESTION 2
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-primary/15 text-primary-light border border-primary/25">
                    <FileText size={11} />
                    Resume Project
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-midnight border border-midnight-border text-gray-300">
                    <Rocket size={11} className="text-accent-pink" />
                    AI Chatbot using LangChain
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    EASY
                  </span>
                </div>

                {/* Question Statement */}
                <p className="font-display font-bold text-base md:text-lg text-white leading-relaxed mt-1">
                  "I noticed on your resume that you built an AI Chatbot using LangChain. In simple words, can you explain what this project does and what specific parts you personally developed?"
                </p>
              </div>

              {/* Action / Recording Section */}
              <div className="mt-8 pt-6 border-t border-midnight-border/50 flex flex-col items-center text-center gap-3">
                {/* Glowing Mic Icon */}
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-12 h-12 rounded-full bg-primary/20 animate-ping opacity-60" />
                  <div className="w-12 h-12 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary-light shadow-glow">
                    <Mic size={22} className="text-primary-light" />
                  </div>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-white">Ready to Answer?</span>
                  <span className="text-[11px] text-gray-400">Click below to start your microphone.</span>
                </div>

                {/* Primary CTA */}
                <Link 
                  to="/register"
                  className="btn-primary w-full py-3 text-xs md:text-sm font-semibold shadow-glow flex items-center justify-center gap-2 rounded-xl mt-1"
                >
                  <Mic size={15} />
                  <span>Begin Speaking Response</span>
                </Link>

                <Link 
                  to="/register"
                  className="text-[11px] text-gray-500 hover:text-gray-300 transition-colors underline"
                >
                  Type response instead
                </Link>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* Features Section - World-Class Bento Grid */}
      <section id="features" className="bg-midnight text-white py-28 border-y border-midnight-border relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-accent-pink/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary-light border border-primary/25 text-xs font-semibold uppercase tracking-wider animate-pulse">
              <Sparkles size={13} className="text-primary-light" />
              <span>Next-Gen Intelligence Suite</span>
            </div>
            
            <h2 className="font-display font-extrabold text-3xl md:text-5xl text-white tracking-tight leading-tight">
              Everything You Need to <span className="bg-gradient-to-r from-primary via-primary-light to-accent-pink bg-clip-text text-transparent">Ace Your Interview</span>
            </h2>
            
            <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl">
              Engineered with adaptive LLMs, real-time computer vision, and speech acoustic models to simulate an authentic, rigorous hiring panel.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-16">

            {/* BENTO 1: Large Card - Dynamic Resume Brain & Adaptive Interviewer (7 Cols) */}
            <div className="md:col-span-7 group relative rounded-3xl bg-midnight-card/85 backdrop-blur-xl border border-midnight-border hover:border-primary/50 transition-all duration-300 p-6 md:p-8 flex flex-col justify-between overflow-hidden shadow-premium hover:shadow-glow">
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary/10 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/20 transition-all duration-500" />
              
              <div>
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-primary/30 flex items-center justify-center text-primary-light shadow-glow">
                    <Bot size={24} className="text-primary-light" />
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-primary/15 text-primary-light border border-primary/25">
                    Adaptive Resume LLM
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-xl md:text-2xl text-white tracking-tight">
                  Dynamic Adaptive Counter-Questioning
                </h3>
                <p className="text-gray-400 text-xs md:text-sm leading-relaxed mt-2.5 max-w-xl">
                  Unlike traditional mock bots with fixed scripts, our engine parses your actual resume projects and adapts in real time. It evaluates your answer and dynamically crafts technical follow-up questions to test your real depth.
                </p>
              </div>

              {/* Interactive Mini-Conversation Preview */}
              <div className="mt-6 pt-5 border-t border-midnight-border/60 flex flex-col gap-2.5">
                <div className="bg-midnight/90 border border-midnight-border/70 rounded-2xl p-3.5 flex flex-col gap-2 text-xs">
                  <div className="flex items-center gap-2 text-[11px] text-primary-light font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    AI Interviewer (Adaptive Probing)
                  </div>
                  <p className="text-gray-300 italic text-[11px] leading-relaxed">
                    "I noticed you built an AI Chatbot using LangChain on your resume. How did you handle token limits and vector search latency under load?"
                  </p>
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-xl p-2.5 px-3.5 flex items-center justify-between text-[11px]">
                  <span className="text-gray-300 flex items-center gap-1.5">
                    <Zap size={13} className="text-accent-pink" />
                    Generates deeper counter-questions on strong answers
                  </span>
                  <span className="text-primary-light font-semibold">Real-Time</span>
                </div>
              </div>
            </div>

            {/* BENTO 2: Computer Vision & Eye Contact (5 Cols) */}
            <div className="md:col-span-5 group relative rounded-3xl bg-midnight-card/85 backdrop-blur-xl border border-midnight-border hover:border-emerald-500/50 transition-all duration-300 p-6 md:p-8 flex flex-col justify-between overflow-hidden shadow-premium hover:shadow-glow">
              <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-500" />
              
              <div>
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <ScanFace size={24} className="text-emerald-400" />
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                    ONNX FERPlus Deep CNN
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-xl md:text-2xl text-white tracking-tight">
                  Deterministic Face & Eye Tracking
                </h3>
                <p className="text-gray-400 text-xs md:text-sm leading-relaxed mt-2.5">
                  Powered by OpenCV Haar cascades and deep learning neural models. Zero mock simulations or random jitter. Computes genuine eye contact, smile activations, and poise in sub-15ms.
                </p>
              </div>

              {/* Vision Telemetry Preview Widget */}
              <div className="mt-6 pt-5 border-t border-midnight-border/60 flex flex-col gap-2">
                <div className="bg-midnight/90 border border-midnight-border/70 rounded-2xl p-3.5 flex flex-col gap-2 text-xs">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-gray-400">Gaze & Eye Contact</span>
                    <span className="text-green-400 font-bold">92% Optimal</span>
                  </div>
                  <div className="w-full h-1.5 bg-midnight-border rounded-full overflow-hidden">
                    <div className="w-[92%] h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full" />
                  </div>

                  <div className="flex justify-between items-center text-[11px] mt-1">
                    <span className="text-gray-400">Dominant Emotion</span>
                    <span className="text-primary-light font-bold">Neutral / Attentive (84%)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-500 px-1">
                  <span>Latency: ~13ms/frame</span>
                  <span className="text-emerald-400 font-medium">100% Deterministic</span>
                </div>
              </div>
            </div>

            {/* BENTO 3: Voice & Speech Analytics (4 Cols) */}
            <div className="md:col-span-4 group relative rounded-3xl bg-midnight-card/85 backdrop-blur-xl border border-midnight-border hover:border-accent-pink/50 transition-all duration-300 p-6 flex flex-col justify-between overflow-hidden shadow-premium">
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/10 border border-accent-pink/30 flex items-center justify-center text-accent-pink">
                    <AudioLines size={22} className="text-accent-pink" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-accent-pink/15 text-accent-pink border border-accent-pink/25">
                    Whisper AI
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-white tracking-tight">
                  Voice & Cadence Analytics
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed mt-2">
                  Transcribes in real time and analyzes speech rate (WPM), filler words ('um', 'uh'), hesitation pauses, and delivery confidence.
                </p>
              </div>

              {/* Audio Wave Widget */}
              <div className="mt-6 pt-4 border-t border-midnight-border/60 bg-midnight/80 rounded-2xl p-3 border border-midnight-border/70 flex flex-col gap-2">
                <div className="flex items-center justify-center gap-1 h-8">
                  {[40, 75, 55, 90, 60, 85, 45, 95, 70, 50, 80, 65, 40].map((h, i) => (
                    <div 
                      key={i} 
                      className="w-1 bg-gradient-to-t from-primary to-accent-pink rounded-full animate-pulse" 
                      style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }} 
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center text-[11px] text-gray-300 pt-1">
                  <span>Pace: <strong className="text-white">135 WPM</strong></span>
                  <span className="text-emerald-400 font-medium">Optimal Speed</span>
                </div>
              </div>
            </div>

            {/* BENTO 4: Semantic Multi-Criteria Grading (4 Cols) */}
            <div className="md:col-span-4 group relative rounded-3xl bg-midnight-card/85 backdrop-blur-xl border border-midnight-border hover:border-indigo-500/50 transition-all duration-300 p-6 flex flex-col justify-between overflow-hidden shadow-premium">
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <ShieldCheck size={22} className="text-indigo-400" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
                    STAR Methodology
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-white tracking-tight">
                  Semantic Answer Scoring
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed mt-2">
                  Graded on a calibrated 0-100 rubric: technical depth, STAR structure, completeness, and clarity with immediate actionable tips.
                </p>
              </div>

              {/* Rubric Breakdown Widget */}
              <div className="mt-6 pt-4 border-t border-midnight-border/60 bg-midnight/80 rounded-2xl p-3 border border-midnight-border/70 flex flex-col gap-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-gray-400">Technical Correctness</span>
                  <span className="text-primary-light font-bold">94%</span>
                </div>
                <div className="w-full h-1 bg-midnight-border rounded-full overflow-hidden">
                  <div className="w-[94%] h-full bg-primary rounded-full" />
                </div>

                <div className="flex justify-between items-center text-[11px] mt-0.5">
                  <span className="text-gray-400">Clarity & Brevity</span>
                  <span className="text-indigo-400 font-bold">88%</span>
                </div>
                <div className="w-full h-1 bg-midnight-border rounded-full overflow-hidden">
                  <div className="w-[88%] h-full bg-indigo-500 rounded-full" />
                </div>
              </div>
            </div>

            {/* BENTO 5: Detailed PDF Reports (4 Cols) */}
            <div className="md:col-span-4 group relative rounded-3xl bg-midnight-card/85 backdrop-blur-xl border border-midnight-border hover:border-amber-500/50 transition-all duration-300 p-6 flex flex-col justify-between overflow-hidden shadow-premium">
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <FileText size={22} className="text-amber-400" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/25">
                    Instant PDF
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-white tracking-tight">
                  Executive PDF Reports
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed mt-2">
                  Download an executive PDF report containing comprehensive question breakdowns, emotional stability curves, and study roadmaps.
                </p>
              </div>

              {/* PDF Preview Chip */}
              <div className="mt-6 pt-4 border-t border-midnight-border/60 bg-midnight/80 rounded-2xl p-3 border border-midnight-border/70 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-red-500/15 text-red-400 flex items-center justify-center shrink-0">
                    <FileText size={16} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-semibold text-white truncate">InterviewAI_Report.pdf</span>
                    <span className="text-[9px] text-gray-500">Multi-page diagnostic</span>
                  </div>
                </div>
                <div className="p-1.5 rounded-lg bg-primary/20 text-primary-light border border-primary/30">
                  <Download size={14} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-6 md:px-12 w-full">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wider uppercase">
            <Rocket size={14} className="text-primary" />
            <span>Interactive 4-Step Blueprint</span>
          </div>
          
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-midnight tracking-tight">
            How It <span className="bg-gradient-to-r from-primary via-indigo-600 to-accent-pink bg-clip-text text-transparent">Works</span>
          </h2>
          
          <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-xl">
            From dropping your resume to receiving executive AI diagnostic scorecards — practice real-world scenarios, sharpen your poise, and master every question.
          </p>
        </div>

        {/* Process Flow Cards */}
        <div className="mt-16 relative">
          {/* Subtle connected line on desktop */}
          <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-400/40 via-purple-400/40 via-amber-400/40 to-emerald-400/40 z-0 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {steps.map((step, idx) => (
              <div 
                key={idx} 
                className={`glass-card p-6 rounded-2xl border border-white/80 bg-white/75 backdrop-blur-md shadow-glass hover:shadow-premium hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group ${step.borderHover}`}
              >
                <div>
                  {/* Top Bar: Icon + Step Number */}
                  <div className="flex items-center justify-between w-full mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-md flex items-center justify-center font-display font-black text-lg group-hover:scale-110 transition-transform duration-300`}>
                      <step.icon size={22} className="text-white" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-gray-400 group-hover:text-primary transition-colors">STEP</span>
                      <span className="font-mono text-2xl font-black text-midnight/20 group-hover:text-primary transition-colors">
                        {step.num}
                      </span>
                    </div>
                  </div>

                  {/* Badge & Title */}
                  <div className="flex flex-col gap-1.5">
                    <span className={`inline-block self-start text-[10px] font-bold px-2 py-0.5 rounded-full border ${step.accentBg}`}>
                      {step.badge}
                    </span>
                    <h3 className="font-display font-bold text-lg text-midnight mt-1 group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed mt-1">
                      {step.desc}
                    </p>
                  </div>
                </div>

                {/* Micro Widget Preview */}
                <div className="mt-5 pt-4 border-t border-cream-border/60">
                  {step.previewType === 'resume' && (
                    <div className="bg-cream-darker/60 rounded-xl p-3 border border-cream-border/70 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center font-bold text-[10px] shrink-0">
                            PDF
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[11px] font-bold text-midnight truncate">Senior_Dev.pdf</span>
                            <span className="text-[9px] text-gray-400">124 KB • Uploaded</span>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">
                          Parsed ✓
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {['React', 'FastAPI', 'System Design'].map((s, i) => (
                          <span key={i} className="text-[9px] px-1.5 py-0.5 rounded-md bg-white border border-cream-border text-gray-600 font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                      <div className="w-full bg-cream-border/60 h-1 rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-blue-500 rounded-full w-full"></div>
                      </div>
                    </div>
                  )}

                  {step.previewType === 'config' && (
                    <div className="bg-cream-darker/60 rounded-xl p-3 border border-cream-border/70 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-midnight">Target: Full-Stack L5</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 border border-purple-500/20">
                          Senior
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 text-[9px] font-semibold text-center">
                        <span className="py-1 rounded bg-purple-600 text-white shadow-xs">Technical</span>
                        <span className="py-1 rounded bg-white text-gray-500 border border-cream-border">STAR</span>
                        <span className="py-1 rounded bg-white text-gray-500 border border-cream-border">HR</span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-gray-500 pt-0.5">
                        <span>Adaptive Rubric</span>
                        <span className="text-purple-600 font-bold">Enabled ●</span>
                      </div>
                    </div>
                  )}

                  {step.previewType === 'interview' && (
                    <div className="bg-cream-darker/60 rounded-xl p-3 border border-cream-border/70 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                          <span className="text-[10px] font-bold text-midnight">CV HUD Active</span>
                        </div>
                        <span className="text-[9px] font-mono text-gray-500">30 FPS</span>
                      </div>
                      <div className="flex items-center justify-between bg-white rounded-lg p-1.5 border border-cream-border text-[9px]">
                        <span className="text-gray-500">Eye Engagement</span>
                        <span className="font-bold text-emerald-600 font-mono">96% High</span>
                      </div>
                      <div className="flex items-center gap-1 h-3 justify-center">
                        {[40, 75, 55, 90, 65, 80, 45, 85].map((h, i) => (
                          <div key={i} className="w-1 bg-amber-500/70 rounded-full" style={{ height: `${h}%` }}></div>
                        ))}
                      </div>
                    </div>
                  )}

                  {step.previewType === 'report' && (
                    <div className="bg-cream-darker/60 rounded-xl p-3 border border-cream-border/70 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-midnight">Hire Readiness</span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          88 / 100
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] text-gray-500">
                          <span>Technical Depth</span>
                          <span className="font-semibold text-midnight">92%</span>
                        </div>
                        <div className="w-full bg-cream-border/60 h-1 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full w-[92%]"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-500/10 py-1 rounded-md border border-emerald-500/20">
                        <Download size={10} />
                        <span>Official PDF Report Ready</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Launch CTA Banner */}
        <div className="mt-14 glass-card p-6 md:p-8 rounded-3xl border border-white/80 bg-gradient-to-r from-primary/5 via-cream-light/80 to-accent-pink/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-glass relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Sparkles size={24} />
            </div>
            <div>
              <h4 className="font-display font-bold text-lg md:text-xl text-midnight">
                Ready to experience the end-to-end workflow?
              </h4>
              <p className="text-gray-500 text-xs md:text-sm mt-0.5">
                Zero setup needed. Select your tech stack or drop a resume to start practicing in seconds.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 relative z-10 w-full md:w-auto justify-end">
            <Link
              to="/interview"
              className="btn-primary py-3 px-6 shadow-glow hover:shadow-primary text-sm flex items-center justify-center gap-2 w-full md:w-auto group shrink-0"
            >
              <span>Start Free Practice</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Interview Formats Section */}
      <section id="formats" className="bg-cream-darker/35 py-16 md:py-20 border-t border-cream-border/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wider uppercase">
              <Layers size={13} className="text-primary" />
              <span>Specialized Practice Tracks</span>
            </div>
            
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-midnight tracking-tight">
              Tailored Interview <span className="bg-gradient-to-r from-primary via-indigo-600 to-accent-pink bg-clip-text text-transparent">Formats</span>
            </h2>
            
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-xl">
              Target your exact preparation goals with specialized simulation modes tuned for real-world hiring bars.
            </p>
          </div>

          {/* Formats Grid: 4 columns on desktop to fit in a single screen */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10 items-stretch">
            {formats.map((fmt, idx) => (
              <div 
                key={idx} 
                className={`glass-card p-5 rounded-2xl border border-white/80 bg-white/80 backdrop-blur-md shadow-glass hover:shadow-premium hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${fmt.borderHover}`}
              >
                {/* Ambient glow in card corner */}
                <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${fmt.accent} opacity-5 group-hover:opacity-15 rounded-full blur-2xl transition-opacity duration-500 pointer-events-none`} />

                <div>
                  {/* Top Bar: Icon + Duration + Difficulty */}
                  <div className="flex items-center justify-between gap-2">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${fmt.accent} text-white shadow-md flex items-center justify-center font-bold group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                      <fmt.icon size={19} className="text-white" />
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cream-darker border border-cream-border text-[9px] font-semibold text-gray-500">
                        <Clock size={10} className="text-gray-400" />
                        <span>{fmt.duration}</span>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${fmt.accentBg}`}>
                        {fmt.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Category & Title */}
                  <div className="mt-3.5">
                    <span className="text-[9px] font-bold tracking-widest text-primary uppercase block truncate">
                      {fmt.category.split('•')[0].trim()}
                    </span>
                    <h3 className="font-display font-bold text-base md:text-lg text-midnight mt-0.5 group-hover:text-primary transition-colors leading-snug">
                      {fmt.title}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed mt-1 line-clamp-2">
                      {fmt.desc}
                    </p>
                  </div>

                  {/* Focus Topic Pills */}
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {fmt.topics.slice(0, 3).map((t, tIdx) => (
                      <span 
                        key={tIdx} 
                        className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-cream-darker/80 border border-cream-border text-gray-600 group-hover:border-primary/20 transition-colors"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Sample AI Question Box */}
                  <div className="mt-3 p-2.5 rounded-xl bg-cream-darker/60 border border-cream-border/70 flex flex-col gap-1 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[9px] font-bold text-primary uppercase tracking-wider">
                        <MessageSquare size={10} className="text-primary" />
                        <span>Prompt Sample</span>
                      </div>
                      <span className="text-[8px] font-mono text-gray-400">AI</span>
                    </div>
                    <p className="text-[11px] font-medium text-midnight/80 italic leading-snug line-clamp-2">
                      "{fmt.sampleQuestion}"
                    </p>
                  </div>
                </div>

                {/* Card Footer: Rubric Criteria & Action */}
                <div className="mt-3.5 pt-3 border-t border-cream-border/60">
                  <div className="flex flex-col gap-1 mb-2.5">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Rubric Focus</span>
                    <div className="flex flex-col gap-0.5 text-xs text-gray-600">
                      {fmt.evalCriteria.slice(0, 2).map((crit, cIdx) => (
                        <div key={cIdx} className="flex items-center gap-1.5">
                          <CheckCircle size={11} className="text-primary shrink-0" />
                          <span className="text-[10px] font-medium truncate">{crit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-cream-border/40">
                    <Link
                      to="/interview"
                      className="w-full py-2 px-3 rounded-xl bg-primary/5 hover:bg-primary text-primary hover:text-white border border-primary/20 flex items-center justify-center gap-1.5 text-xs font-bold transition-all duration-200 group-hover:shadow-glow"
                    >
                      <span>Launch {fmt.id === 'resume' ? 'Resume' : fmt.title.split(' ')[0]} Track</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-4 mb-16">
          <span className="text-primary text-xs font-bold uppercase tracking-wider">Pricing Plans</span>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl">
            Flexible Plans for Job Seekers
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Choose the practice tier that fits your preparation needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {pricing.map((tier, idx) => (
            <div 
              key={idx} 
              className={`glass-card p-8 flex flex-col relative border ${
                tier.isPopular 
                  ? 'border-primary shadow-glow shadow-primary/5' 
                  : 'border-cream-border/60 hover:shadow-premium'
              } transition-all duration-300`}
            >
              {tier.isPopular && (
                <span className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-primary text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full tracking-wider">
                  Most Popular
                </span>
              )}
              
              <div className="flex flex-col gap-2">
                <h3 className="font-display font-bold text-xl text-midnight">{tier.name}</h3>
                <p className="text-xs text-gray-500 min-h-[32px]">{tier.desc}</p>
              </div>

              <div className="flex items-baseline gap-1 my-6">
                <span className="font-display font-extrabold text-4xl text-midnight">{tier.price}</span>
                <span className="text-xs text-gray-500">/ {tier.period}</span>
              </div>

              <ul className="flex flex-col gap-3 text-sm text-gray-600 mb-8 flex-1">
                {tier.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-primary shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <Link 
                to="/register" 
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 text-center ${
                  tier.isPopular 
                    ? 'bg-primary hover:bg-primary-dark text-white shadow-glow' 
                    : 'bg-cream-darker hover:bg-gray-200 text-midnight border border-cream-border/60'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-cream-darker/20 py-28 border-t border-cream-border/40 relative overflow-hidden">
        {/* Ambient background glow orbs */}
        <div className="absolute top-1/4 -left-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-accent-pink/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-4 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wider uppercase">
              <HelpCircle size={14} className="text-primary" />
              <span>Clear Answers & Architecture</span>
            </div>

            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-midnight tracking-tight">
              Frequently Asked <span className="bg-gradient-to-r from-primary via-indigo-600 to-accent-pink bg-clip-text text-transparent">Questions</span>
            </h2>

            <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-xl">
              Everything you need to know about our autonomous AI interview engine, real-time computer vision telemetry, privacy guarantees, and diagnostic scorecards.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {faqCategories.map((cat, idx) => {
              const count = cat === 'All' 
                ? faqs.length 
                : faqs.filter(f => f.category === cat).length;
              const isActive = activeFaqCategory === cat;

              return (
                <button
                  key={idx}
                  onClick={() => setActiveFaqCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-primary text-white shadow-glow'
                      : 'bg-white/80 hover:bg-white text-gray-600 hover:text-midnight border border-white/80 shadow-xs'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-cream-darker text-gray-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-4">
            {faqs
              .filter(faq => activeFaqCategory === 'All' || faq.category === activeFaqCategory)
              .map((faq, idx) => (
                <FAQItem
                  key={idx}
                  question={faq.q}
                  answer={faq.a}
                  category={faq.category}
                  icon={faq.icon}
                  defaultOpen={idx === 0}
                />
              ))}
          </div>

          {/* Still Have Questions CTA Card */}
          <div className="mt-14 glass-card p-6 md:p-8 rounded-3xl border border-white/80 bg-gradient-to-r from-primary/5 via-white/80 to-accent-pink/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-glass relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <MessageSquare size={22} />
              </div>
              <div>
                <h4 className="font-display font-bold text-lg md:text-xl text-midnight">
                  Still have questions about our interview platform?
                </h4>
                <p className="text-gray-500 text-xs md:text-sm mt-0.5">
                  Launch a zero-friction practice session right now or explore the live technical room.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto justify-end shrink-0">
              <a
                href="#features"
                className="py-2.5 px-4 text-xs font-bold rounded-xl bg-white border border-cream-border text-midnight hover:bg-cream-darker transition-colors text-center w-full md:w-auto"
              >
                Explore Features
              </a>
              <Link
                to="/interview"
                className="btn-primary py-2.5 px-5 shadow-glow hover:shadow-primary text-xs font-bold flex items-center justify-center gap-2 w-full md:w-auto shrink-0 group"
              >
                <span>Start Free Interview</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
