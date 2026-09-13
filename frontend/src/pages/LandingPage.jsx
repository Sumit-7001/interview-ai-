import React from 'react';
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
  Lock
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FAQItem from '../components/FAQItem';

const LandingPage = () => {
  
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
      title: "Upload Resume",
      desc: "Drag and drop your PDF resume. Our parsing utility extracts your core skills and roles."
    },
    {
      num: "02",
      title: "Choose Profile",
      desc: "Select a technical role, difficulty level, and session format (HR, Technical, STAR)."
    },
    {
      num: "03",
      title: "Face the AI Panel",
      desc: "Conduct the interview with video analysis and respond using natural speech."
    },
    {
      num: "04",
      title: "Review Metrics",
      desc: "Download your PDF performance rating containing semantic scores and 공부 plans."
    }
  ];

  const formats = [
    {
      title: "Technical Interview",
      desc: "Tests engineering systems, algorithms, database query patterns, OS boundaries, and networking paradigms.",
      accent: "from-blue-500 to-indigo-600"
    },
    {
      title: "HR Panel",
      desc: "Evaluates standard soft skills, corporate collaboration, career motivations, strengths, and alignment.",
      accent: "from-purple-500 to-pink-600"
    },
    {
      title: "Behavioral Star Method",
      desc: "Walks through situational challenges utilizing standard Situation, Task, Action, and Result formats.",
      accent: "from-emerald-500 to-teal-600"
    },
    {
      title: "Resume Personalized",
      desc: "Deep-dives into actual skills, dates, and project summaries parsed from your custom profile upload.",
      accent: "from-orange-500 to-red-600"
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

  const faqs = [
    {
      q: "What is InterviewAI?",
      a: "InterviewAI is an AI-powered SaaS tool created to help candidates prepare for interviews by using real-time webcam and speech analysis to grade answers, body language, and speaking patterns."
    },
    {
      q: "How does the AI generate questions?",
      a: "Our system combines your selected job title with details from your uploaded resume. We use OpenAI models to output realistic technical or behavioral questions appropriate for your seniority."
    },
    {
      q: "How does the emotion detection work?",
      a: "By reading periodic webcam snapshots, the backend applies computer vision models (DeepFace) to evaluate expressions like Neutral, Happy, or Surprise. These are used strictly as a confidence indicator and contain no psychological assumptions."
    },
    {
      q: "Is my webcam or recording data secure?",
      a: "Yes. All video frame processing is handled locally in the browser or via transient backend requests. Audio files are stored securely and can be removed by the user at any point. We do not sell or share video assets."
    },
    {
      q: "Does it support voice interviews?",
      a: "Absolutely! You answer questions using your computer microphone. We use OpenAI Whisper models to transcribe your speech and evaluate the completeness of your answer text."
    },
    {
      q: "Can I download my report?",
      a: "Yes, once an interview session is completed, you receive a detailed breakdown dashboard and a download button that exports the data as a clean PDF document."
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

      {/* Features Section */}
      <section id="features" className="bg-midnight text-white py-24 border-y border-midnight-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
            <span className="text-primary text-xs font-bold uppercase tracking-wider">Features Suite</span>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl text-white">
              Everything You Need to Ace Your Interview
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              We analyze verbal structure, physical expression, and semantic content to create a comprehensive report of your performance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {features.map((feat, idx) => (
              <div key={idx} className="glass-card-dark p-6 hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3">
                <div className="p-3 bg-primary/10 text-primary rounded-xl border border-primary/20 w-fit">
                  <feat.icon size={20} />
                </div>
                <h3 className="text-white font-bold text-lg mt-2">{feat.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
          <span className="text-primary text-xs font-bold uppercase tracking-wider">Process Flow</span>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl">
            How It Works
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Get interview-ready in four simple steps.
          </p>
        </div>

        {/* Timeline representation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16 relative">
          {/* Horizontal line for desktop */}
          <div className="hidden md:block absolute top-8 left-16 right-16 h-0.5 bg-cream-border/60 z-0" />
          
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center md:items-start text-center md:text-left gap-4 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white border border-cream-border shadow-glass flex items-center justify-center font-display font-black text-xl text-primary">
                {step.num}
              </div>
              <h3 className="font-display font-bold text-lg text-midnight mt-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interview Formats Section */}
      <section className="bg-cream-darker/35 py-24 border-t border-cream-border/40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
            <span className="text-primary text-xs font-bold uppercase tracking-wider">Formats</span>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl">
              Tailored Interview Formats
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Match your exact practice targets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            {formats.map((fmt, idx) => (
              <div key={idx} className="glass-card p-8 flex flex-col gap-4 border border-white hover:shadow-premium transition-all duration-300">
                <div className={`w-12 h-2 rounded-full bg-gradient-to-r ${fmt.accent}`} />
                <h3 className="font-display font-bold text-xl text-midnight">{fmt.title}</h3>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed">{fmt.desc}</p>
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
      <section id="faq" className="bg-cream-darker/20 py-24 border-t border-cream-border/40">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center flex flex-col gap-4 mb-12">
            <span className="text-primary text-xs font-bold uppercase tracking-wider">FAQ</span>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="glass-card p-6 md:p-8 border border-white">
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
