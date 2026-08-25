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
  HelpCircle
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

        {/* Badges bar */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-12 text-xs font-medium text-gray-500">
          <span className="bg-white/80 border border-cream-border px-3 py-1.5 rounded-xl shadow-glass">🤖 AI Powered</span>
          <span className="bg-white/80 border border-cream-border px-3 py-1.5 rounded-xl shadow-glass">🎙️ Voice Analytics</span>
          <span className="bg-white/80 border border-cream-border px-3 py-1.5 rounded-xl shadow-glass">👁️ Eye Contact Tracker</span>
          <span className="bg-white/80 border border-cream-border px-3 py-1.5 rounded-xl shadow-glass">📄 Resume Customization</span>
        </div>

        {/* Mock Interface Dashboard Preview */}
        <div className="mt-16 w-full max-w-4xl border border-cream-border/60 rounded-2xl shadow-premium overflow-hidden bg-midnight p-1.5">
          <div className="bg-midnight-light rounded-xl overflow-hidden aspect-video relative flex flex-col md:flex-row border border-midnight-border">
            {/* Camera feed mockup */}
            <div className="flex-1 bg-midnight relative flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-midnight-border">
              <div className="w-full h-full rounded-lg bg-gray-900 border border-midnight-border/50 flex flex-col items-center justify-center relative overflow-hidden">
                <Video size={48} className="text-primary/40 animate-pulse" />
                <div className="absolute top-4 left-4 bg-midnight/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-midnight-border text-[11px] text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                  <span>Camera Active</span>
                </div>
                <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 text-[11px]">
                  <span className="bg-primary/90 text-white px-2.5 py-1 rounded-lg">Eye Contact: 89% (Good)</span>
                  <span className="bg-accent-pink/90 text-white px-2.5 py-1 rounded-lg">Emotion: Neutral</span>
                </div>
              </div>
            </div>
            {/* Panel mockup */}
            <div className="w-full md:w-80 p-6 flex flex-col gap-4 text-left text-gray-300">
              <div className="flex items-center justify-between text-xs">
                <span className="text-primary font-bold">Question 02 of 05</span>
                <span className="text-gray-500">Timer: 00:45</span>
              </div>
              <p className="text-sm font-semibold text-white leading-relaxed">
                "What is the difference between a process and a thread, and how do they share resource allocations?"
              </p>
              <div className="mt-auto flex flex-col gap-2">
                <div className="bg-midnight text-[11px] p-3 rounded-lg border border-midnight-border flex flex-col gap-1">
                  <span className="text-gray-500">Live Transcription:</span>
                  <span className="text-gray-300 italic">"A process is an executing instance..."</span>
                </div>
                <button className="bg-primary/20 text-primary border border-primary/30 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                  <span>Recording Answer...</span>
                </button>
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
