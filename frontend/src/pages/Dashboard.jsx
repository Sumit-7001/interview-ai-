import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Play, 
  FileWarning, 
  BarChart2, 
  Calendar, 
  Award, 
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Brain,
  MessageSquare,
  Sparkles,
  Code2,
  Users,
  FileText,
  Briefcase,
  ArrowRight,
  Target,
  Zap,
  Check,
  Compass,
  LayoutGrid,
  Activity,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import Sidebar from '../components/Sidebar';
import DashboardCard from '../components/DashboardCard';
import Modal from '../components/Modal';
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
    badge: 'Popular',
    accent: 'border-violet-200 hover:border-primary text-primary bg-gradient-to-br from-violet-50/70 to-white'
  },
  {
    id: 'behavioral',
    type: 'Behavioral',
    title: 'Behavioral & Leadership',
    desc: 'STAR-method situational responses & culture fit',
    icon: Users,
    badge: 'STAR Method',
    accent: 'border-emerald-200 hover:border-emerald-500 text-emerald-600 bg-gradient-to-br from-emerald-50/70 to-white'
  },
  {
    id: 'resume',
    type: 'Resume-Based',
    title: 'Resume Project Deep-Dive',
    desc: 'Personalized questions tailored to your skills & projects',
    icon: FileText,
    badge: 'Personalized',
    accent: 'border-amber-200 hover:border-amber-500 text-amber-600 bg-gradient-to-br from-amber-50/70 to-white',
    requiresResume: true
  },
  {
    id: 'hr',
    type: 'HR',
    title: 'HR & Cultural Screening',
    desc: 'Career trajectory, compensation & teamwork questions',
    icon: Briefcase,
    badge: 'Screening',
    accent: 'border-blue-200 hover:border-blue-500 text-blue-600 bg-gradient-to-br from-blue-50/70 to-white'
  }
];

const QUICK_PRESETS = [
  { label: '💻 Frontend (React)', role: 'React Developer', level: 'Mid', type: 'Technical' },
  { label: '🐍 Backend (Python)', role: 'Python Developer', level: 'Mid', type: 'Technical' },
  { label: '⚡ Full Stack', role: 'Full Stack Developer', level: 'Mid', type: 'Technical' },
  { label: '👥 Behavioral (STAR)', role: 'Software Engineer', level: 'Mid', type: 'Behavioral' },
  { label: '📄 Resume Deep-Dive', role: 'Software Engineer', level: 'Mid', type: 'Resume-Based', reqResume: true },
];

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useAlert();
  const [interviews, setInterviews] = useState([]);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'analytics'
  
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

  const atsScore = resume?.ats_score ?? null;
  const atsColor = atsScore >= 80 ? '#10b981' : atsScore >= 60 ? '#f59e0b' : atsScore >= 40 ? '#f97316' : '#ef4444';

  const stats = [
    { 
      title: "Completed", 
      value: numCompleted, 
      icon: Award, 
      description: "Total mock sessions",
      trend: numCompleted > 0 ? `${numCompleted} finished` : "Start today",
      trendType: numCompleted > 0 ? "up" : "neutral"
    },
    { 
      title: "Avg Score", 
      value: numCompleted ? `${avgScore}/100` : "—", 
      icon: TrendingUp, 
      description: "Overall evaluation",
      trend: avgScore >= 75 ? "Strong" : avgScore > 0 ? "In Progress" : "Target: 80+",
      trendType: avgScore >= 75 ? "up" : "neutral"
    },
    { 
      title: "Resume Match", 
      value: atsScore != null ? `${atsScore}%` : "Not Added", 
      icon: FileText, 
      description: resume ? `${resume.ats_matched_keywords?.length || 0} skills indexed` : "Upload PDF resume",
      trend: atsScore >= 75 ? "Optimized" : atsScore >= 50 ? "Competitive" : "Pending",
      trendType: atsScore >= 60 ? "up" : "neutral"
    },
    { 
      title: "AI Readiness", 
      value: "Ready", 
      icon: Zap, 
      description: "Speech & live scoring",
      trend: "Online",
      trendType: "up"
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

  const radarData = [
    { subject: 'Technical', A: getAvgMetric('technical'), fullMark: 100 },
    { subject: 'Communication', A: getAvgMetric('communication'), fullMark: 100 },
    { subject: 'Confidence', A: getAvgMetric('confidence'), fullMark: 100 },
    { subject: 'Eye Contact', A: getAvgMetric('eye_contact'), fullMark: 100 },
    { subject: 'Speech Clarity', A: getAvgMetric('speech_clarity'), fullMark: 100 },
    { subject: 'Answer Quality', A: getAvgMetric('answer_quality'), fullMark: 100 },
  ];

  const handleStartInterview = async (e) => {
    if (e) e.preventDefault();
    setCreatingSession(true);
    const selectedRole = role === 'Other' ? customRole : role;

    try {
      const res = await API.post('/api/interviews', {
        role: selectedRole,
        experience_level: experienceLevel,
        interview_type: interviewType
      });
      toast.success("Practice room configured. Entering session...", "Session Initialized");
      navigate(`/interview/${res.data.id}`);
    } catch (err) {
      toast.error("Failed to start interview. Check connection or AI engine status.", "Launch Failed");
    } finally {
      setCreatingSession(false);
      setIsModalOpen(false);
    }
  };

  const applyPreset = (preset) => {
    setRole(preset.role);
    setExperienceLevel(preset.level);
    setInterviewType(preset.type);
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

  const firstName = user?.first_name || 'Candidate';

  return (
    <div className="min-h-screen flex bg-cream">
      <Sidebar />

      {/* Main Dashboard Workspace */}
      <main className="flex-1 min-w-0 p-5 md:p-8 lg:p-10 overflow-y-auto max-w-7xl">
        
        {/* Top Header: Greeting & Quick Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display font-extrabold text-2xl md:text-3xl text-midnight tracking-tight">
              Welcome back, {firstName} 👋
            </h1>
            <p className="text-gray-500 text-xs md:text-sm mt-1">
              Select an interview track below to start your mock practice session.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setInterviewType('Technical');
                setIsModalOpen(true);
              }}
              className="btn-primary py-2.5 px-5 shadow-glow font-bold text-xs flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Play size={14} fill="white" />
              <span>+ Custom Interview</span>
            </button>
          </div>
        </div>

        {/* Alert if resume missing */}
        {!resume && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <FileWarning size={16} className="text-amber-600 shrink-0" />
              <span><b>Upload Resume:</b> Add your PDF resume so the AI can ask personalized questions targeting your tech stack.</span>
            </div>
            <Link 
              to="/resume" 
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors shrink-0"
            >
              Upload PDF
            </Link>
          </div>
        )}

        {/* Top Metrics Ribbon (Clean, Abstracted High-Level Stats) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

        {/* View Switcher: Tracks vs Analytics */}
        <div className="flex items-center justify-between border-b border-cream-border/70 pb-3 mb-5">
          <div className="flex items-center gap-1.5 p-1 bg-cream-darker/15 rounded-xl border border-cream-border/60">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'overview'
                  ? 'bg-white text-midnight shadow-xs'
                  : 'text-gray-500 hover:text-midnight'
              }`}
            >
              <LayoutGrid size={13} />
              <span>Practice Workspace</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-white text-midnight shadow-xs'
                  : 'text-gray-500 hover:text-midnight'
              }`}
            >
              <BarChart2 size={13} />
              <span>Performance Analytics</span>
              {numCompleted > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* TAB 1: PRACTICE WORKSPACE (Clean Full-Width Tracks + Balanced 2-Column History & Resume) */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-6">
            
            {/* 1. Interview Tracks (Direct clean cards without nested wrapper) */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <Target size={15} className="text-primary" />
                  <h2 className="font-display font-bold text-sm text-midnight">
                    Interview Tracks
                  </h2>
                </div>
                <span className="text-xs text-gray-400">1-click instant practice</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
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
                      className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-md hover:-translate-y-1 group bg-white/95 ${track.accent}`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="w-9 h-9 rounded-xl bg-white border border-cream-border/60 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                            <Icon size={16} />
                          </div>
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-white/90 border border-cream-border/50 shadow-2xs">
                            {track.badge}
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-xs text-midnight group-hover:text-primary transition-colors">
                          {track.title}
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                          {isResumeDisabled ? 'Upload resume first to enable.' : track.desc}
                        </p>
                      </div>

                      <div className="mt-3.5 pt-2.5 border-t border-cream-border/40 flex items-center justify-between text-xs font-bold">
                        <span className="group-hover:text-primary transition-colors">{isResumeDisabled ? 'Upload Resume →' : 'Start Track'}</span>
                        <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Balanced 2-Column: History Table (8 cols) & Resume ATS (4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Recent Sessions Table (8 cols) */}
              <div className="lg:col-span-8 glass-card p-6 border border-cream-border/70 rounded-2xl bg-white/90 shadow-xs flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-primary" />
                    <h3 className="font-display font-bold text-sm text-midnight">
                      Recent Interview History
                    </h3>
                  </div>
                  <Link to="/history" className="text-xs text-primary font-bold hover:underline flex items-center gap-0.5">
                    <span>View All ({interviews.length})</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>

                {interviews.length === 0 ? (
                  <div className="text-center py-10 px-4 border border-dashed border-cream-border rounded-xl bg-cream/20 flex-1 flex flex-col items-center justify-center">
                    <p className="text-xs text-gray-500 mb-3">No mock interview sessions recorded yet.</p>
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="btn-primary py-2 px-4 text-xs font-bold shadow-xs mx-auto"
                    >
                      Start First Interview
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-cream-border/60 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                          <th className="py-2.5 px-3">Role</th>
                          <th className="py-2.5 px-3">Format</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Score</th>
                          <th className="py-2.5 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-cream-border/40 text-xs">
                        {interviews.slice(0, 5).map((item) => (
                          <tr key={item.id} className="hover:bg-cream-darker/10 transition-colors">
                            <td className="py-3 px-3 font-semibold text-midnight truncate max-w-[140px]">{item.role}</td>
                            <td className="py-3 px-3 text-gray-500">{item.interview_type}</td>
                            <td className="py-3 px-3">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                item.status === 'completed' 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70' 
                                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200/70'
                              }`}>
                                {item.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-bold text-midnight">
                              {item.overall_score !== null ? `${item.overall_score}/100` : '—'}
                            </td>
                            <td className="py-3 px-3 text-right">
                              {item.status === 'completed' ? (
                                <Link 
                                  to={`/reports/${item.id}`} 
                                  className="text-primary hover:text-primary-dark font-bold hover:underline"
                                >
                                  Report →
                                </Link>
                              ) : (
                                <Link 
                                  to={`/interview/${item.id}`} 
                                  className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline"
                                >
                                  Resume →
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

              {/* Resume ATS Readiness (4 cols) */}
              <div className="lg:col-span-4 flex flex-col">
                {resume && atsScore != null ? (
                  <div className="glass-card p-6 border border-cream-border/70 rounded-2xl bg-white/95 shadow-xs flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-primary" />
                          <h3 className="font-display font-bold text-sm text-midnight">Resume ATS Readiness</h3>
                        </div>
                        <Link to="/resume" className="text-[11px] font-bold text-primary hover:underline">
                          Manage →
                        </Link>
                      </div>

                      <div className="flex items-center gap-4 p-3.5 rounded-xl bg-cream/30 border border-cream-border/60 mb-4">
                        <div className="relative w-14 h-14 shrink-0">
                          <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
                            <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(107,114,128,0.12)" strokeWidth="5" />
                            <circle
                              cx="28" cy="28" r="22"
                              fill="none"
                              stroke={atsColor}
                              strokeWidth="5"
                              strokeLinecap="round"
                              strokeDasharray={`${(atsScore / 100) * (2 * Math.PI * 22)} ${2 * Math.PI * 22}`}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="font-extrabold text-sm text-midnight">{atsScore}</span>
                            <span className="text-[6px] text-gray-400 font-bold uppercase">ATS</span>
                          </div>
                        </div>

                        <div className="min-w-0">
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-1"
                            style={{ background: `${atsColor}15`, color: atsColor, border: `1px solid ${atsColor}30` }}
                          >
                            {atsScore >= 80 ? 'Strong Match' : atsScore >= 60 ? 'Competitive' : 'Needs Optimization'}
                          </span>
                          <p className="text-[11px] text-gray-500 truncate">
                            {resume.ats_matched_keywords?.length || 0} skills indexed from PDF
                          </p>
                        </div>
                      </div>

                      {resume.ats_matched_keywords?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {resume.ats_matched_keywords.slice(0, 10).map((kw, i) => (
                            <span key={i} className="bg-primary/5 text-primary border border-primary/10 px-2 py-0.5 rounded text-[10px] font-medium">
                              {kw}
                            </span>
                          ))}
                          {resume.ats_matched_keywords.length > 10 && (
                            <Link to="/resume" className="text-[10px] text-gray-400 hover:text-primary mt-0.5">
                              +{resume.ats_matched_keywords.length - 10} more
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="glass-card p-6 border border-dashed border-amber-300 rounded-2xl bg-amber-50/50 flex-1 flex flex-col items-center justify-center text-center">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
                      <FileText size={18} />
                    </div>
                    <h4 className="font-display font-bold text-xs text-amber-950">Targeted Resume Questions</h4>
                    <p className="text-[11px] text-amber-800 mt-1 max-w-xs">
                      Upload your PDF resume to calibrate technical depth and generate personalized interview questions.
                    </p>
                    <Link to="/resume" className="btn-primary mt-3 py-1.5 px-4 text-xs font-bold">
                      Upload Resume PDF
                    </Link>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: PERFORMANCE ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fadeIn">
            {numCompleted > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Score Progress BarChart */}
                <div className="glass-card p-6 border border-cream-border/70 lg:col-span-2 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-bold text-base text-midnight flex items-center gap-2">
                      <BarChart2 size={17} className="text-primary" />
                      <span>Interview Score Trajectory</span>
                    </h3>
                    <span className="text-xs text-gray-400">Last 5 Rounds</span>
                  </div>
                  <div className="h-72">
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

                {/* Radar Chart */}
                <div className="glass-card p-6 border border-cream-border/70 shadow-xs">
                  <h3 className="font-display font-bold text-base text-midnight mb-4 flex items-center gap-2">
                    <TrendingUp size={17} className="text-primary" />
                    <span>Competency Radar</span>
                  </h3>
                  <div className="h-72 flex items-center justify-center">
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
              <div className="glass-card p-12 text-center border border-cream-border/70 rounded-2xl bg-white/90">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                  <BarChart2 size={24} />
                </div>
                <h3 className="font-display font-bold text-base text-midnight">No Interview Scores Yet</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                  Complete your first mock interview session to unlock your score trajectory, radar charts, and speech diagnostics.
                </p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="btn-primary mt-4 py-2 px-5 text-xs font-bold shadow-xs mx-auto"
                >
                  Start Your First Session
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Start Interview Modal Dialog (Enhanced with 1-click presets) */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Start Practice Interview">
        <form onSubmit={handleStartInterview} className="flex flex-col gap-4">
          
          {/* Quick 1-Click Presets */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
              Quick 1-Click Presets:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PRESETS.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                    role === preset.role && interviewType === preset.type
                      ? 'bg-primary text-white border-primary'
                      : 'bg-cream/40 border-cream-border text-gray-600 hover:bg-cream-darker/20'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-cream-border/60 pt-3 flex flex-col gap-3.5">
            {/* Target Role selection */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">Target Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs bg-white"
              >
                <option value="Software Engineer">Software Engineer (General)</option>
                <option value="React Developer">React / Frontend Developer</option>
                <option value="Python Developer">Python / Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Engineer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                <option value="Other">Custom Role...</option>
              </select>
            </div>

            {/* Custom Role Field if selected other */}
            {role === 'Other' && (
              <div className="flex flex-col gap-1 animate-fadeIn">
                <label className="text-xs font-semibold text-gray-600">Custom Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DevOps Engineer"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-cream-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs bg-white"
                />
              </div>
            )}

            {/* Experience level selection */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">Seniority</label>
              <div className="grid grid-cols-3 gap-2">
                {['Entry', 'Mid', 'Senior'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setExperienceLevel(level)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      experienceLevel === level
                        ? 'border-primary bg-primary/10 text-primary shadow-2xs'
                        : 'border-cream-border bg-white text-gray-500 hover:bg-cream-darker/20'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Interview Type Selection */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">Session Format</label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs bg-white"
              >
                <option value="Technical">Technical (Coding, Systems, Logic)</option>
                <option value="HR">HR & Culture (Communication & Fit)</option>
                <option value="Behavioral">Behavioral (STAR Method Scenarios)</option>
                {resume && <option value="Resume-Based">Resume-Based (Tailored to your PDF)</option>}
                <option value="Mixed">Mixed (Technical + Behavioral + HR)</option>
              </select>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-cream/60 border border-cream-border text-[11px] text-gray-500 leading-relaxed flex items-center gap-2">
            <Zap size={13} className="text-primary shrink-0" />
            <span>Voice & facial emotion detection will automatically activate in the room.</span>
          </div>

          {/* Submit buttons */}
          <div className="flex gap-2.5 justify-end mt-1">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary py-2 px-3.5 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creatingSession}
              className="btn-primary py-2 px-5 text-xs font-bold disabled:opacity-50 flex items-center gap-1.5"
            >
              {creatingSession ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Building Room...</span>
                </>
              ) : (
                <>
                  <Play size={12} fill="white" />
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
