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
  Volume2
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import DashboardCard from '../components/DashboardCard';
import Modal from '../components/Modal';
import AIStatusPanel from '../components/AIStatusPanel';
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

const Dashboard = () => {
  const [interviews, setInterviews] = useState([]);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Start Interview Form States
  const [role, setRole] = useState('Software Engineer');
  const [customRole, setCustomRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Mid');
  const [interviewType, setInterviewType] = useState('Technical');
  const [creatingSession, setCreatingSession] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const interviewRes = await API.get('/api/interviews');
        setInterviews(interviewRes.data);
      } catch (err) {
        console.error("Failed to load interviews history:", err);
      }

      try {
        const resumeRes = await API.get('/api/resume');
        setResume(resumeRes.data);
      } catch (err) {
        // 404 is normal if no resume uploaded
        if (err.response?.status !== 404) {
          console.error("Failed to load resume details:", err);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Compute stats
  const completedInterviews = interviews.filter(i => i.status === 'completed');
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

  const stats = [
    { title: "Completed Sessions", value: numCompleted, icon: CheckCircle2, description: "All-time mock interviews" },
    { title: "Average Score", value: `${avgScore}/100`, icon: Award, description: "Aggregated rating score" },
    { title: "Technical Depth", value: `${getAvgMetric('technical')}%`, icon: Brain, description: "Subject knowledge average" },
    { title: "Communication", value: `${getAvgMetric('communication')}%`, icon: MessageSquare, description: "Grammar, logic & clarity" },
  ];

  // Recharts Chart Data (Latest 5 completed interviews)
  const chartData = completedInterviews
    .slice(0, 5)
    .reverse()
    .map(item => ({
      date: new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      score: item.overall_score,
      role: item.role
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
      <main className="flex-1 p-8 md:p-12 overflow-y-auto max-w-7xl">
        
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="font-display font-extrabold text-3xl text-midnight">Candidate Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Review your practice diagnostics and start new sessions.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary py-3 px-6 shadow-glow font-semibold text-sm flex items-center gap-2"
          >
            <Play size={16} fill="white" />
            <span>Practice Session</span>
          </button>
        </div>

        {/* Warning Alert if no Resume uploaded */}
        {!resume && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex gap-3 items-start">
              <FileWarning size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-950">No resume uploaded yet</h4>
                <p className="text-xs text-amber-800 mt-0.5">Upload your resume so the AI can generate custom questions targeting your skills and background.</p>
              </div>
            </div>
            <Link to="/resume" className="bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors shrink-0">
              Upload PDF Resume
            </Link>
          </div>
        )}

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <DashboardCard 
              key={idx}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              description={stat.description}
            />
          ))}
        </div>

        {/* AI Services Status Panel */}
        <div className="mb-8">
          <AIStatusPanel />
        </div>

        {/* Analytics Charts section */}
        {numCompleted > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            {/* Historical Progress Chart */}
            <div className="glass-card p-6 border border-cream-border/60 lg:col-span-2">
              <h3 className="font-display font-bold text-lg text-midnight mb-4 flex items-center gap-2">
                <BarChart2 size={18} className="text-primary" />
                <span>Interview Score Progress</span>
              </h3>
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
            <div className="glass-card p-6 border border-cream-border/60">
              <h3 className="font-display font-bold text-lg text-midnight mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-primary" />
                <span>Skill Performance Overview</span>
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
        )}

        {/* History Table */}
        <div className="glass-card p-6 border border-cream-border/60">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display font-bold text-lg text-midnight flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              <span>Recent Sessions</span>
            </h3>
            <Link to="/history" className="text-xs text-primary font-bold hover:underline flex items-center gap-0.5">
              <span>View All History</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {interviews.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-cream-border rounded-xl">
              <span className="text-sm text-gray-500">No mock interview sessions recorded yet.</span>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="btn-primary mt-4 py-2 text-xs mx-auto"
              >
                Start First Mock Interview
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-cream-border/60 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Job Role</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Completed On</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-border/40 text-sm">
                  {interviews.slice(0, 5).map((item) => (
                    <tr key={item.id} className="hover:bg-cream-darker/10 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-midnight">{item.role}</td>
                      <td className="py-3.5 px-4 text-gray-500">{item.interview_type}</td>
                      <td className="py-3.5 px-4 text-gray-400">
                        {new Date(item.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'completed' 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}>
                          {item.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-midnight">
                        {item.overall_score !== null ? `${item.overall_score}/100` : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {item.status === 'completed' ? (
                          <Link 
                            to={`/reports/${item.id}`} 
                            className="bg-primary/5 hover:bg-primary text-primary hover:text-white border border-primary/20 hover:border-primary px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                          >
                            View Report
                          </Link>
                        ) : (
                          <Link 
                            to={`/interview/${item.id}`} 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
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
              className="w-full px-4 py-3 rounded-xl border border-cream-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white"
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
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Custom Role Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Node.js Developer"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-cream-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white"
              />
            </div>
          )}

          {/* Experience level selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Experience Seniority</label>
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
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Interview Session Format</label>
            <select
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-cream-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white"
            >
              <option value="Technical">Technical (Coding, Systems, CS)</option>
              <option value="HR">HR & Teamwork (Company Culture)</option>
              <option value="Behavioral">Behavioral (STAR Method Situational)</option>
              {resume && <option value="Resume-Based">Resume-Based (Personalized Details)</option>}
              <option value="Mixed">Mixed (Technical + Behavioral + HR)</option>
            </select>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-cream/60 border border-cream-border text-[11px] text-gray-500 leading-relaxed">
            💡 <b>Note:</b> You will be prompted for webcam and microphone permissions. Audio and video frame analyses are computed dynamically to evaluate eye-contact alignment and speaking speed.
          </div>

          {/* Submit buttons */}
          <div className="flex gap-3 justify-end mt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary py-2.5 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creatingSession}
              className="btn-primary py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              <span>{creatingSession ? 'Building Panel...' : 'Launch Practice Room'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
