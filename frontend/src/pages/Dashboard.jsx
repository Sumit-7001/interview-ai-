import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Play, 
  FileWarning, 
  BarChart2, 
  Calendar, 
  Award, 
  Clock, 
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Brain,
  MessageSquare,
  Eye,
  Sparkles,
  Code2,
  Users,
  FileText,
  Briefcase,
  ArrowRight,
  Target,
  Zap,
  Check,
  Compass
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import DashboardCard from '../components/DashboardCard';
import Modal from '../components/Modal';
import AIStatusPanel from '../components/AIStatusPanel';
import DailyChallengeCard from '../components/DailyChallengeCard';
import HardwareCalibrator from '../components/HardwareCalibrator';
import API from '../services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

const QUICK_TRACKS = [
  {
    id: 'technical',
    type: 'Technical',
    title: 'Technical & System Design',
    desc: 'Algorithms, data structures & software architecture challenges',
    icon: Code2,
    badge: 'Most Popular',
    color: 'from-violet-500/10 to-indigo-500/10 text-primary border-primary/20 hover:border-primary/40'
  },
  {
    id: 'behavioral',
    type: 'Behavioral',
    title: 'Behavioral & Leadership',
    desc: 'STAR-method situational responses, team dynamics & conflict resolution',
    icon: Users,
    badge: 'STAR Method',
    color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-500/20 hover:border-emerald-500/40'
  },
  {
    id: 'resume',
    type: 'Resume-Based',
    title: 'Resume Project Deep-Dive',
    desc: 'Personalized questions tailored to your actual skills and projects',
    icon: FileText,
    badge: 'Personalized',
    color: 'from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-500/20 hover:border-amber-500/40',
    requiresResume: true
  },
  {
    id: 'hr',
    type: 'HR',
    title: 'HR & Cultural Screening',
    desc: 'Career goals, workplace culture fit, salary expectations & teamwork',
    icon: Briefcase,
    badge: 'Foundational',
    color: 'from-blue-500/10 to-cyan-500/10 text-blue-600 border-blue-500/20 hover:border-blue-500/40'
  }
];

const Dashboard = () => {
  const [interviews, setInterviews] = useState([]);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Start Interview Form States
  const [role, setRole] = useState('Software Engineer');
  const [customRole, setCustomRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Entry');
  const [interviewType, setInterviewType] = useState('Technical');
  const [creatingSession, setCreatingSession] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const [interviewRes, resumeRes] = await Promise.allSettled([
          API.get('/api/interviews', { timeout: 10000 }),
          API.get('/api/resume', { timeout: 10000 })
        ]);
        if (mounted) {
          if (interviewRes.status === 'fulfilled' && Array.isArray(interviewRes.value.data)) {
            setInterviews(interviewRes.value.data);
          } else {
            setInterviews([]);
          }
          if (resumeRes.status === 'fulfilled') {
            setResume(resumeRes.value.data);
          }
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, []);

  // Compute stats safely
  const interviewList = Array.isArray(interviews) ? interviews : [];
  const completedInterviews = interviewList.filter(i => i && i.status === 'completed');
  const numCompleted = completedInterviews.length;
  
  const avgScore = numCompleted 
    ? Math.round(completedInterviews.reduce((acc, curr) => acc + (curr.overall_score || 0), 0) / numCompleted)
    : 0;

  const getAvgMetric = (key) => {
    if (!numCompleted) return 0;
    const sum = completedInterviews.reduce((acc, curr) => {
      const breakdown = curr.scores_breakdown || {};
      return acc + (breakdown[key] || 0);
    }, 0);
    return Math.round(sum / numCompleted);
  };

  // ATS score from resume
  const atsScore = resume?.ats_score ?? null;
  const atsColor = atsScore >= 80 ? '#10b981' : atsScore >= 60 ? '#f59e0b' : atsScore >= 40 ? '#f97316' : '#ef4444';

  const stats = [
    { 
      title: "Completed Sessions", 
      value: numCompleted, 
      icon: CheckCircle2, 
      description: numCompleted > 0 ? "Total rounds evaluated" : "Ready for first session",
      trend: numCompleted > 0 ? `${numCompleted} total` : "Start today",
      trendType: numCompleted > 0 ? "up" : "neutral"
    },
    { 
      title: "Average Score", 
      value: numCompleted ? `${avgScore}/100` : "—", 
      icon: Award, 
      description: numCompleted ? "Overall practice average" : "Benchmark target: 80+",
      trend: avgScore >= 75 ? "Strong" : avgScore > 0 ? "Developing" : "Target: 80+",
      trendType: avgScore >= 75 ? "up" : "neutral"
    },
    { 
      title: "Technical Depth", 
      value: numCompleted ? `${getAvgMetric('technical')}%` : "—", 
      icon: Brain, 
      description: numCompleted ? "Coding & architecture rating" : "Algorithms & system logic",
      trend: numCompleted ? "Verified" : "Pending round",
      trendType: numCompleted ? "up" : "neutral"
    },
    { 
      title: "Communication", 
      value: numCompleted ? `${getAvgMetric('communication')}%` : "—", 
      icon: MessageSquare, 
      description: numCompleted ? "Clarity, pacing & tone" : "STAR method structure",
      trend: numCompleted ? "Verified" : "Pending round",
      trendType: numCompleted ? "up" : "neutral"
    },
  ];

  // Recharts Chart Data (Latest 5 completed interviews)
  const chartData = completedInterviews
    .slice(0, 5)
    .reverse()
    .map(item => ({
      date: item.created_at ? new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recent',
      score: item.overall_score || 0,
      role: item.role || 'Interview'
    }));

  // Radar chart data based on average metric scores
  const radarData = [
    { subject: 'Technical', A: getAvgMetric('technical'), fullMark: 100 },
    { subject: 'Communication', A: getAvgMetric('communication'), fullMark: 100 },
    { subject: 'Confidence', A: getAvgMetric('confidence'), fullMark: 100 },
    { subject: 'Eye Contact', A: getAvgMetric('eye_contact'), fullMark: 100 },
    { subject: 'Speech Clarity', A: getAvgMetric('speech_clarity'), fullMark: 100 },
    { subject: 'Answer Quality', A: getAvgMetric('answer_quality'), fullMark: 100 },
  ];

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
      setIsModalOpen(false);
    }
  };

  const handleQuickLaunch = (type) => {
    setInterviewType(type);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-gray-500">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-cream">
      <Sidebar />

      {/* Main Dashboard Panel */}
      <main className="flex-1 min-w-0 p-6 md:p-10 lg:p-12 overflow-y-auto max-w-7xl">
        
        {/* Welcome Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-2">
              <Sparkles size={13} />
              <span>AI-Powered Interview Practice</span>
            </div>
            <h1 className="font-display font-extrabold text-3xl md:text-4xl text-midnight tracking-tight">
              Candidate Command Center
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Real-time speech analysis, facial sentiment calibration, and AI-driven technical debriefs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/resume"
              className="px-4 py-2.5 rounded-xl border border-cream-border bg-white text-gray-700 hover:text-midnight hover:border-primary/40 text-xs font-bold transition-all flex items-center gap-2 shadow-2xs"
            >
              <FileText size={15} className="text-gray-400" />
              <span>{resume ? 'Resume Ready' : 'Upload Resume'}</span>
            </Link>

            <button 
              onClick={() => {
                setInterviewType('Technical');
                setIsModalOpen(true);
              }}
              className="btn-primary py-2.5 px-5 shadow-glow font-bold text-xs flex items-center gap-2"
            >
              <Play size={14} fill="white" />
              <span>Start Practice Session</span>
            </button>
          </div>
        </div>

        {/* AI System Status Strip (Compact, single-row, non-intrusive) */}
        <div className="mb-6">
          <AIStatusPanel />
        </div>

        {/* Warning Alert if no Resume uploaded */}
        {!resume && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-2xs">
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-xl bg-amber-100/70 text-amber-700 shrink-0">
                <FileWarning size={18} />
              </div>
              <div>
                <h4 className="font-bold text-amber-950 text-sm">Upload your resume for customized questions</h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  The AI references your genuine skills, projects, and work history to simulate realistic hiring manager questions.
                </p>
              </div>
            </div>
            <Link 
              to="/resume" 
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shrink-0 shadow-xs"
            >
              Upload Resume PDF
            </Link>
          </div>
        )}

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6">
          {stats.map((stat, idx) => (
            <DashboardCard
              key={idx}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              description={stat.description}
              trend={stat.trend}
              trendType={stat.trendType}
            />
          ))}
        </div>

        {/* ATS Score Banner (shown only if resume with ATS data exists) */}
        {resume && atsScore != null && (
          <div className="mb-6 p-5 md:p-6 rounded-2xl border border-cream-border/80 bg-white/90 shadow-sm flex flex-col md:flex-row gap-5 items-center justify-between">
            <div className="flex flex-col sm:flex-row items-center gap-5 w-full md:w-auto">
              {/* Ring Mini Gauge */}
              <div className="relative w-18 h-18 shrink-0">
                <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
                  <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(107,114,128,0.12)" strokeWidth="6" />
                  <circle
                    cx="36" cy="36" r="28"
                    fill="none"
                    stroke={atsColor}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${(atsScore / 100) * (2 * Math.PI * 28)} ${2 * Math.PI * 28}`}
                    style={{ filter: `drop-shadow(0 0 3px ${atsColor}44)` }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-extrabold text-base text-midnight">{atsScore}</span>
                  <span className="text-[7px] text-gray-400 font-bold uppercase tracking-wider">ATS</span>
                </div>
              </div>

              {/* Info & Keywords */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display font-bold text-midnight text-sm">Resume ATS Compatibility</span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${atsColor}15`, color: atsColor, border: `1px solid ${atsColor}30` }}
                  >
                    {atsScore >= 80 ? 'Excellent Match' : atsScore >= 60 ? 'Competitive' : atsScore >= 40 ? 'Fair' : 'Needs Optimization'}
                  </span>
                </div>
                {resume.ats_summary && (
                  <p className="text-xs text-gray-500 mb-2.5 max-w-2xl">{resume.ats_summary}</p>
                )}
                {/* Matched keywords */}
                {resume.ats_matched_keywords?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mr-1">Skills:</span>
                    {resume.ats_matched_keywords.slice(0, 8).map((kw, i) => (
                      <span key={i} className="bg-primary/5 text-primary border border-primary/10 px-2 py-0.5 rounded-md text-[10px] font-medium">
                        {kw}
                      </span>
                    ))}
                    {resume.ats_matched_keywords.length > 8 && (
                      <span className="text-[10px] text-gray-400">
                        +{resume.ats_matched_keywords.length - 8} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Link
              to="/resume"
              className="shrink-0 text-xs font-bold text-primary hover:text-primary-dark flex items-center gap-1 hover:underline"
            >
              <span>Full ATS Diagnostics</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        )}

        {/* Quick Launch Practice Tracks (Actionable 1-Click Starts) */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-lg text-midnight flex items-center gap-2">
                <Target size={18} className="text-primary" />
                <span>Recommended Practice Formats</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Select a specialized track to start your next mock session</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {QUICK_TRACKS.map((track) => {
              const Icon = track.icon;
              const isResumeDisabled = track.requiresResume && !resume;
              return (
                <div
                  key={track.id}
                  onClick={() => {
                    if (isResumeDisabled) {
                      navigate('/resume');
                    } else {
                      handleQuickLaunch(track.type);
                    }
                  }}
                  className={`p-5 rounded-2xl border bg-white/90 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between group hover:-translate-y-0.5 ${track.color}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-current/10 flex items-center justify-center">
                        <Icon size={20} className="text-current" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-current/10 text-current">
                        {track.badge}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-sm text-midnight group-hover:text-primary transition-colors">
                      {track.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                      {isResumeDisabled ? 'Upload resume first to unlock personalized questions.' : track.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-cream-border/50 flex items-center justify-between text-xs font-bold text-current">
                    <span>{isResumeDisabled ? 'Upload Resume →' : 'Start Session'}</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Unique Feature Hub: Daily Rapid Drill & Pre-Flight Hardware Calibration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <DailyChallengeCard 
            onStartPractice={(formatType) => {
              setInterviewType(formatType);
              setIsModalOpen(true);
            }} 
          />
          <HardwareCalibrator />
        </div>

        {/* Analytics Charts or Getting Started Roadmap */}
        {numCompleted > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Historical Progress Chart */}
            <div className="glass-card p-6 border border-cream-border/70 lg:col-span-2 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-base text-midnight flex items-center gap-2">
                  <BarChart2 size={17} className="text-primary" />
                  <span>Interview Score Trajectory</span>
                </h3>
                <span className="text-xs text-gray-400">Last 5 Rounds</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} style={{ fontSize: 11, fill: '#9CA3AF' }} />
                    <YAxis domain={[0, 100]} tickLine={false} axisLine={false} style={{ fontSize: 11, fill: '#9CA3AF' }} />
                    <Tooltip 
                      contentStyle={{ background: '#0D0D11', borderRadius: '12px', border: 'none', color: '#fff', fontSize: 12 }}
                      itemStyle={{ color: '#A78BFA' }}
                    />
                    <Bar dataKey="score" fill="#7C3AED" radius={[6, 6, 0, 0]} maxBarSize={45} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Metric Radar Chart */}
            <div className="glass-card p-6 border border-cream-border/70 shadow-xs">
              <h3 className="font-display font-bold text-base text-midnight mb-4 flex items-center gap-2">
                <TrendingUp size={17} className="text-primary" />
                <span>Skill Competency Radar</span>
              </h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" radius="70%" data={radarData}>
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis dataKey="subject" style={{ fontSize: 10, fill: '#4B5563', fontWeight: 500 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} style={{ fontSize: 8 }} />
                    <Radar name="Candidate" dataKey="A" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.15} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          /* Readiness Blueprint for New Candidates */
          <div className="mb-8 p-6 rounded-2xl border border-cream-border/80 bg-white/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-bold text-base text-midnight flex items-center gap-2">
                  <Compass size={18} className="text-primary" />
                  <span>Interview Readiness Roadmap</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Complete these milestones to reach peak interview readiness</p>
              </div>
              <span className="text-xs font-bold text-primary px-2.5 py-1 rounded-full bg-primary/10">
                {resume ? '1 of 3 Completed' : '0 of 3 Completed'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* Step 1 */}
              <div className={`p-4 rounded-xl border transition-all ${
                resume ? 'bg-emerald-50/50 border-emerald-200' : 'bg-cream/40 border-cream-border'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-400">STAGE 01</span>
                  {resume ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <Check size={13} /> Completed
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-amber-600">In Progress</span>
                  )}
                </div>
                <h4 className="font-display font-bold text-sm text-midnight">Resume ATS Parsing</h4>
                <p className="text-xs text-gray-500 mt-1">
                  {resume ? `Resume indexed with ${atsScore || 58}/100 score.` : 'Upload your PDF resume to calibrate questions.'}
                </p>
                <Link to="/resume" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                  <span>{resume ? 'View ATS details' : 'Upload resume now'}</span>
                  <ArrowRight size={12} />
                </Link>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl border bg-cream/40 border-cream-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-400">STAGE 02</span>
                  <span className="text-[11px] font-bold text-primary">Next Action</span>
                </div>
                <h4 className="font-display font-bold text-sm text-midnight">First Diagnostic Round</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Complete your first 15-minute simulated interview to set your performance baseline.
                </p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  <span>Launch practice room</span>
                  <ArrowRight size={12} />
                </button>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl border bg-cream/20 border-cream-border/60 opacity-80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-400">STAGE 03</span>
                  <span className="text-[11px] font-medium text-gray-400">Upcoming</span>
                </div>
                <h4 className="font-display font-bold text-sm text-midnight">Speech & Facial Review</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Receive personalized feedback on pacing, fillers, eye contact, and emotional poise.
                </p>
                <span className="mt-3 inline-block text-xs font-medium text-gray-400">
                  Unlocks after Round 1
                </span>
              </div>
            </div>
          </div>
        )}

        {/* History Table */}
        <div className="glass-card p-6 border border-cream-border/70 shadow-xs">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="font-display font-bold text-base text-midnight flex items-center gap-2">
                <Calendar size={17} className="text-primary" />
                <span>Recent Mock Sessions</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Your recorded interview practices and performance reports</p>
            </div>
            <Link to="/history" className="text-xs text-primary font-bold hover:underline flex items-center gap-0.5">
              <span>View All History</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {interviews.length === 0 ? (
            <div className="text-center py-10 px-4 border border-dashed border-cream-border rounded-xl bg-cream/20">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                <Play size={20} className="translate-x-0.5" />
              </div>
              <h4 className="font-display font-bold text-sm text-midnight">No interview sessions recorded yet</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                Start your first interactive session with the AI interviewer to test technical depth and delivery.
              </p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="btn-primary mt-4 py-2 px-5 text-xs font-bold mx-auto shadow-sm"
              >
                Start First Mock Interview
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-cream-border/60 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Job Role</th>
                    <th className="py-3 px-4">Format</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Overall Score</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-border/40 text-sm">
                  {interviews.slice(0, 5).map((item) => (
                    <tr key={item.id} className="hover:bg-cream-darker/10 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-midnight text-xs">{item.role}</td>
                      <td className="py-3.5 px-4 text-gray-500 text-xs">{item.interview_type}</td>
                      <td className="py-3.5 px-4 text-gray-400 text-xs">
                        {new Date(item.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'completed' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70' 
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200/70'
                        }`}>
                          {item.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-midnight text-xs">
                        {item.overall_score !== null ? (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="font-extrabold">{item.overall_score}</span>
                            <span className="text-[10px] text-gray-400 font-normal">/ 100</span>
                          </span>
                        ) : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {item.status === 'completed' ? (
                          <Link 
                            to={`/reports/${item.id}`} 
                            className="bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 hover:border-primary px-3 py-1.5 rounded-lg text-xs font-bold transition-all inline-block"
                          >
                            View Report
                          </Link>
                        ) : (
                          <Link 
                            to={`/interview/${item.id}`} 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors inline-block"
                          >
                            Resume
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      {/* Start Interview Modal Dialog */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Configure Mock Interview">
        <form onSubmit={handleStartInterview} className="flex flex-col gap-5">
          {/* Target Role selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Target Job Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white"
            >
              <option value="Software Engineer">Software Engineer (General)</option>
              <option value="React Developer">React / Frontend Developer</option>
              <option value="Python Developer">Python / Backend Developer</option>
              <option value="Full Stack Developer">Full Stack Engineer</option>
              <option value="Product Manager">Product Manager</option>
              <option value="Machine Learning Engineer">Machine Learning / AI Engineer</option>
              <option value="Other">Custom Role...</option>
            </select>
          </div>

          {/* Custom Role Field if selected other */}
          {role === 'Other' && (
            <div className="flex flex-col gap-1.5 animate-fadeIn">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Custom Role Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Node.js Developer"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-cream-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white"
              />
            </div>
          )}

          {/* Experience level selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Seniority Level</label>
            <div className="grid grid-cols-3 gap-3">
              {['Entry', 'Mid', 'Senior'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setExperienceLevel(level)}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    experienceLevel === level
                      ? 'border-primary bg-primary/10 text-primary shadow-2xs'
                      : 'border-cream-border bg-white text-gray-500 hover:bg-cream-darker/20'
                  }`}
                >
                  {level} Level
                </button>
              ))}
            </div>
          </div>

          {/* Interview Type Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Interview Session Format</label>
            <select
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white"
            >
              <option value="Technical">Technical (Coding, Systems, CS Fundamentals)</option>
              <option value="HR">HR & Culture (Communication, Teamwork, Fit)</option>
              <option value="Behavioral">Behavioral (STAR Method Situations)</option>
              {resume && <option value="Resume-Based">Resume-Based (Personalized Project Questions)</option>}
              <option value="Mixed">Mixed (Technical + Behavioral + HR)</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-cream/60 border border-cream-border text-[11px] text-gray-500 leading-relaxed flex items-start gap-2">
            <Zap size={14} className="text-primary shrink-0 mt-0.5" />
            <span>
              Real-time voice recognition and computer vision facial tracking will activate during the interview to evaluate cadence, confidence, and posture.
            </span>
          </div>

          {/* Submit buttons */}
          <div className="flex gap-3 justify-end mt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary py-2 px-4 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creatingSession}
              className="btn-primary py-2 px-5 text-xs font-bold disabled:opacity-50 flex items-center gap-2"
            >
              {creatingSession ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Building Room...</span>
                </>
              ) : (
                <>
                  <Play size={13} fill="white" />
                  <span>Launch Practice Room</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
