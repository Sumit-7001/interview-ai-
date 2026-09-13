import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Trash2,
  CheckCircle,
  AlertCircle,
  Award,
  BookOpen,
  Briefcase,
  Target,
  TrendingUp,
  XCircle,
  Lightbulb,
  BarChart3
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import API from '../services/api';

// ATS Score Ring Component
const ATSRing = ({ score }) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (score / 100) * circumference;
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : score >= 40 ? '#f97316' : '#ef4444';
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs Work';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90">
          {/* Background track */}
          <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(107,114,128,0.15)" strokeWidth="10" />
          {/* Progress arc */}
          <circle
            cx="64" cy="64" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={`${strokeDash} ${circumference}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1s ease', filter: `drop-shadow(0 0 6px ${color}66)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display font-extrabold text-2xl text-midnight">{score}</span>
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">ATS</span>
        </div>
      </div>
      <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: `${color}18`, color }}>
        {label}
      </span>
    </div>
  );
};

const ResumePage = () => {
  const [resume, setResume] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchResume = async () => {
    try {
      const res = await API.get('/api/resume');
      setResume(res.data);
    } catch (err) {
      if (err.response?.status !== 404) {
        setMessage({ text: 'Failed to retrieve resume details.', type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const ext = selectedFile.name.split('.').pop().toLowerCase();
      if (!['pdf', 'docx', 'txt'].includes(ext)) {
        setMessage({ text: 'Unsupported format. Please select PDF, DOCX, or TXT.', type: 'error' });
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setMessage({ text: '', type: '' });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setMessage({ text: 'Analyzing resume — extracting skills, scoring ATS compatibility...', type: '' });

    try {
      const res = await API.post('/api/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResume(res.data);
      setFile(null);
      setMessage({ text: 'Resume uploaded and ATS analysis complete!', type: 'success' });
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Failed to upload and parse resume.';
      setMessage({ text: errMsg, type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      await API.delete('/api/resume');
      setResume(null);
      setMessage({ text: 'Resume deleted successfully. Upload a new one when ready.', type: 'success' });
    } catch (err) {
      console.error('Failed to delete resume:', err);
      setMessage({ text: 'Failed to delete resume from server. Please try again.', type: 'error' });
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-gray-500">Loading Resume Profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-cream">
      <Sidebar />

      <main className="flex-1 p-8 md:p-12 overflow-y-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="font-display font-extrabold text-3xl text-midnight">Resume & ATS Analysis</h1>
          <p className="text-gray-500 text-sm mt-1">Upload your resume to get an ATS score and personalized interview questions.</p>
        </div>

        {/* Status Messages */}
        {message.text && (
          <div className={`mb-8 p-4 rounded-xl border flex gap-3 items-start text-sm ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : message.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-indigo-50 border-indigo-200 text-indigo-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle size={18} className="shrink-0 mt-0.5" />
            ) : message.type === 'error' ? (
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
            ) : (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mt-0.5 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Upload Form */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="glass-card p-6 border border-cream-border/60">
              <h3 className="font-display font-bold text-lg text-midnight mb-4 flex items-center gap-2">
                <Upload size={18} className="text-primary" />
                <span>Upload Resume</span>
              </h3>

              <form onSubmit={handleUpload} className="flex flex-col gap-4">
                <div className="border-2 border-dashed border-cream-border/80 rounded-xl p-8 text-center bg-cream/10 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer relative">
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    id="resume-file-input"
                  />
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <FileText size={32} className="text-primary/30" />
                    <span className="text-xs font-semibold text-midnight">
                      {file ? file.name : 'Select Resume File'}
                    </span>
                    <span className="text-[10px] text-gray-400">PDF, DOCX, TXT up to 5MB</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!file || uploading}
                  className="btn-primary w-full py-2.5 text-xs font-semibold disabled:opacity-50"
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analyzing Resume...
                    </span>
                  ) : 'Parse & Upload Resume'}
                </button>
              </form>
            </div>

            <div className="glass-card p-5 border border-cream-border/60 text-xs text-gray-500 leading-relaxed bg-cream/40">
              🔒 <b>Privacy:</b> We extract text to personalize interview questions. Files are stored securely and can be deleted anytime.
            </div>
          </div>

          {/* Right - Analysis Display */}
          <div className="lg:col-span-2">
            {resume ? (
              <div className="flex flex-col gap-6">
                {/* File header */}
                <div className="glass-card p-6 border border-cream-border/60">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 text-primary rounded-xl border border-primary/20">
                        <FileText size={22} />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-lg text-midnight">{resume.filename}</h3>
                        <span className="text-xs text-gray-400">
                          Uploaded {new Date(resume.uploaded_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleDelete}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-xl border border-transparent hover:border-red-100 transition-colors"
                      title="Delete resume"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* ATS Score Card */}
                {resume.ats_score != null && (
                  <div className="glass-card p-6 border border-cream-border/60">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-6 flex items-center gap-1.5">
                      <Target size={14} className="text-primary" />
                      <span>ATS Compatibility Score</span>
                    </h4>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      {/* Ring */}
                      <div className="shrink-0 flex justify-center md:block w-full md:w-auto">
                        <ATSRing score={resume.ats_score} />
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col gap-4">
                        {/* Sub-scores */}
                        {resume.ats_section_scores && Object.keys(resume.ats_section_scores).length > 0 && (
                          <div className="flex flex-col gap-2">
                            {Object.entries(resume.ats_section_scores).map(([key, val]) => (
                              <div key={key}>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-500 capitalize">{key.replace(/_/g, ' ')}</span>
                                  <span className="font-bold text-midnight">{val}/100</span>
                                </div>
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{
                                      width: `${val}%`,
                                      background: val >= 70 ? '#22c55e' : val >= 50 ? '#f59e0b' : '#ef4444'
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Summary */}
                        {resume.ats_summary && (
                          <p className="text-xs text-gray-500 leading-relaxed border-t border-cream-border/40 pt-3">
                            {resume.ats_summary}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Matched & Missing Keywords */}
                {(resume.ats_matched_keywords?.length > 0 || resume.ats_missing_keywords?.length > 0) && (
                  <div className="glass-card p-6 border border-cream-border/60">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-1.5">
                      <BarChart3 size={14} className="text-primary" />
                      <span>Keyword Analysis</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Matched */}
                      {resume.ats_matched_keywords?.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <CheckCircle size={12} /> Found in Resume ({resume.ats_matched_keywords.length})
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {resume.ats_matched_keywords.map((kw, i) => (
                              <span key={i} className="bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-md text-[11px] font-medium">
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Missing */}
                      {resume.ats_missing_keywords?.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <XCircle size={12} /> Missing Keywords ({resume.ats_missing_keywords.length})
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {resume.ats_missing_keywords.slice(0, 12).map((kw, i) => (
                              <span key={i} className="bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-md text-[11px] font-medium">
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {resume.ats_suggestions?.length > 0 && (
                  <div className="glass-card p-6 border border-cream-border/60">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-1.5">
                      <Lightbulb size={14} className="text-primary" />
                      <span>Improvement Suggestions</span>
                    </h4>
                    <div className="flex flex-col gap-3">
                      {resume.ats_suggestions.map((s, i) => (
                        <div key={i} className="flex items-start gap-2.5 bg-amber-50/60 border border-amber-100 rounded-xl p-3">
                          <TrendingUp size={14} className="text-amber-500 shrink-0 mt-0.5" />
                          <p className="text-xs text-amber-800 leading-relaxed">{s}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extracted Skills */}
                <div className="glass-card p-6 border border-cream-border/60">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                    <Award size={14} className="text-primary" />
                    <span>Extracted Tech Skills</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills && resume.skills.map((skill, idx) => (
                      <span key={idx} className="bg-primary/5 text-primary border border-primary/10 px-2.5 py-1 rounded-lg text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience & Education */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card p-6 border border-cream-border/60">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                      <Briefcase size={14} className="text-primary" />
                      <span>Parsed Experience</span>
                    </h4>
                    <div className="flex flex-col gap-2">
                      {resume.experience && resume.experience.map((exp, idx) => (
                        <div key={idx} className="bg-cream/40 p-3 rounded-xl border border-cream-border/50 text-xs text-midnight">
                          {exp.description}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-6 border border-cream-border/60">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                      <BookOpen size={14} className="text-primary" />
                      <span>Academic Background</span>
                    </h4>
                    <div className="flex flex-col gap-2">
                      {resume.education && resume.education.map((edu, idx) => (
                        <div key={idx} className="bg-cream/40 p-3 rounded-xl border border-cream-border/50 text-xs text-midnight">
                          {edu.description}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card p-12 border border-cream-border/60 text-center flex flex-col items-center justify-center gap-4 h-full min-h-64">
                <FileText size={48} className="text-gray-300" />
                <div>
                  <h3 className="font-display font-bold text-lg text-midnight">No resume uploaded yet</h3>
                  <p className="text-sm text-gray-400 max-w-sm mt-1 mx-auto">
                    Upload your PDF or DOCX to get an ATS score and personalized interview questions based on your actual experience.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResumePage;
