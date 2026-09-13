import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  Award,
  Video,
  Mic,
  Eye,
  Activity,
  Smile
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAlert } from '../context/AlertContext';
import API from '../services/api';
import { 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const ReportPage = () => {
  const { id } = useParams();
  const { toast } = useAlert();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await API.get(`/api/interviews/${id}`);
        setReport(res.data);
      } catch (err) {
        console.error("Failed to load interview report:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    toast.info("Preparing your PDF interview report export...", "Exporting PDF");
    try {
      const response = await API.get(`/api/reports/${id}/pdf`, {
        responseType: 'blob'
      });
      // Create local URL and trigger link download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `InterviewAI_Report_${id.slice(0, 8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Interview report PDF downloaded successfully!", "Download Complete");
    } catch (err) {
      console.error("Failed to download PDF report:", err);
      toast.error("Error exporting PDF report. Please try again.", "Export Failed");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-gray-500">Compiling performance report...</span>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream p-6">
        <div className="text-center max-w-sm glass-card p-8 border">
          <AlertTriangle size={32} className="text-red-500 mx-auto" />
          <h3 className="font-display font-bold text-lg text-midnight mt-3">Report not found</h3>
          <p className="text-xs text-gray-500 mt-1">This session may not be graded or does not exist.</p>
          <Link to="/dashboard" className="btn-primary mt-6 text-xs w-full">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  // Prep Chart Data
  const breakdown = report.scores_breakdown || {};
  
  const radarData = [
    { subject: 'Technical', score: breakdown.technical || 80 },
    { subject: 'Communication', score: breakdown.communication || 80 },
    { subject: 'Answer Quality', score: breakdown.answer_quality || 80 },
    { subject: 'Confidence', score: breakdown.confidence || 80 },
    { subject: 'Eye Contact', score: breakdown.eye_contact || 80 },
    { subject: 'Speech Clarity', score: breakdown.speech_clarity || 80 },
  ];

  const barData = Object.keys(breakdown).map(key => ({
    name: key.replace("_", " ").title ? key.replace("_", " ").toUpperCase() : key.replace("_", " ").toUpperCase(),
    score: breakdown[key]
  }));

  const feedback = report.feedback || {};

  return (
    <div className="min-h-screen flex bg-cream">
      <Sidebar />

      {/* Main Panel */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-cream-border/60">
          <div className="flex items-center gap-3">
            <Link to="/history" className="text-gray-400 hover:text-midnight">
              <ArrowLeft size={22} />
            </Link>
            <div>
              <h1 className="font-display font-extrabold text-3xl text-midnight">Interview Evaluation</h1>
              <p className="text-gray-500 text-sm mt-0.5">
                Practice diagnostics for <b>{report.role}</b> ({report.experience_level} Level)
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="btn-primary py-3 px-6 shadow-glow font-semibold text-xs flex items-center gap-2"
          >
            <Download size={14} />
            <span>{downloading ? 'Exporting...' : 'Download PDF Report'}</span>
          </button>
        </div>

        {/* Dashboard Grid Row 1: Ring rating & Radar Plot */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* Ring Score Rating Card */}
          <div className="glass-card p-8 border border-cream-border/60 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Overall Rating Score</span>
            
            {/* Circular score display ring */}
            <div className="relative w-44 h-44 mt-6 flex items-center justify-center">
              {/* Outer SVG Circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="88" cy="88" r="74" 
                  stroke="#F3F4F6" strokeWidth="12" fill="transparent"
                />
                <circle 
                  cx="88" cy="88" r="74" 
                  stroke="#7C3AED" strokeWidth="12" fill="transparent"
                  strokeDasharray={2 * Math.PI * 74}
                  strokeDashoffset={2 * Math.PI * 74 * (1 - (report.overall_score || 0) / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-display font-black text-4xl text-midnight">{report.overall_score}</span>
                <span className="text-xs font-semibold text-gray-500 mt-0.5">/ 100</span>
              </div>
            </div>
            
            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
              <Award size={14} />
              <span>Practice Session Graded</span>
            </div>
          </div>

          {/* Skill Performance Matrix Radar */}
          <div className="glass-card p-6 border border-cream-border/60 lg:col-span-2">
            <h3 className="font-display font-bold text-lg text-midnight mb-4 flex items-center gap-1.5">
              <Activity size={18} className="text-primary" />
              <span>Skill Matrix Performance</span>
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" radius="70%" data={radarData}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis dataKey="subject" style={{ fontSize: 11, fill: '#4B5563', fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} style={{ fontSize: 9 }} />
                  <Radar name="Candidate" dataKey="score" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.18} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Dashboard Grid Row 2: Executive analysis lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* What went well */}
          <div className="glass-card p-6 md:p-8 border border-cream-border/60 bg-green-50/10">
            <h3 className="font-display font-extrabold text-lg text-green-950 mb-4 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-green-600" />
              <span>What You Did Well</span>
            </h3>
            <ul className="flex flex-col gap-3.5 text-sm text-gray-600">
              {feedback.what_went_well && feedback.what_went_well.map((item, idx) => (
                <li key={idx} className="flex gap-2.5 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 mt-2" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas to focus */}
          <div className="glass-card p-6 md:p-8 border border-cream-border/60 bg-amber-50/10">
            <h3 className="font-display font-extrabold text-lg text-amber-950 mb-4 flex items-center gap-2">
              <AlertTriangle size={20} className="text-amber-600" />
              <span>Areas to Focus On</span>
            </h3>
            <ul className="flex flex-col gap-3.5 text-sm text-gray-600">
              {feedback.areas_to_improve && feedback.areas_to_improve.map((item, idx) => (
                <li key={idx} className="flex gap-2.5 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* STUDY PLAN RECOMMENDATIONS */}
        <div className="glass-card p-6 md:p-8 border border-cream-border/60 mb-10 bg-primary/5">
          <h3 className="font-display font-extrabold text-lg text-midnight mb-3 flex items-center gap-2">
            <Sparkles size={20} className="text-primary animate-pulse" />
            <span>AI Mentorship Recommendations</span>
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {feedback.recommendations}
          </p>
        </div>

        {/* Detailed Question lists */}
        <div className="flex flex-col gap-6">
          <h2 className="font-display font-extrabold text-xl text-midnight mb-2">Detailed Question Review</h2>
          
          {report.questions && report.questions.map((q, idx) => {
            const ev = q.evaluation || {};
            const voice = q.voice_metrics || {};
            const emo = q.emotion_summary || {};
            const domEmo = Object.keys(emo).length > 0 
              ? Object.keys(emo).reduce((a, b) => emo[a] > emo[b] ? a : b)
              : 'Neutral';

            return (
              <div key={q.id || idx} className="glass-card p-6 md:p-8 border border-cream-border/60 flex flex-col gap-4">
                {/* Question title & score */}
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-display font-extrabold text-base md:text-lg text-midnight">
                    Q{idx+1}: {q.question_text}
                  </h3>
                  <span className="font-display font-black text-lg text-primary bg-primary/5 border border-primary/10 px-3 py-1 rounded-xl shrink-0">
                    {ev.score || 0} / 100
                  </span>
                </div>

                {/* Response transcript */}
                <div className="bg-cream/40 p-4 rounded-xl border border-cream-border/40 text-xs text-gray-600 leading-relaxed italic">
                  " {q.answer_text || "*No voice answer submitted*"} "
                </div>

                {/* Diagnostic metrics HUD */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-1 border-y border-cream-border/30 py-3.5 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Eye size={16} className="text-primary" />
                    <span>Eye Contact: <b>{q.eye_contact_score != null ? Math.round(q.eye_contact_score) : 85}%</b></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Smile size={16} className="text-accent-pink" />
                    <span>Dominant Emotion: <b className="capitalize">{domEmo}</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mic size={16} className="text-indigo-600" />
                    <span>Speaking Speed: <b>{voice.speaking_speed || 135} wpm</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-green-600" />
                    <span>Filler Words: <b>{voice.filler_words_count || 0} counts</b></span>
                  </div>
                </div>

                {/* Detailed AI evaluation */}
                <div className="flex flex-col gap-2.5 mt-1 text-xs md:text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider">Correctness & Accuracy</span>
                      <p className="text-midnight mt-0.5">{ev.correctness || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider">Completeness</span>
                      <p className="text-midnight mt-0.5">{ev.completeness || "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="mt-2 pt-3 border-t border-cream-border/20">
                    <span className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider">AI Evaluation Summary</span>
                    <p className="text-midnight leading-relaxed mt-0.5">{ev.feedback || "Feedback not calculated."}</p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
};

export default ReportPage;
