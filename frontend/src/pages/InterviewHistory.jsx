import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Search, SlidersHorizontal, ArrowLeft, Trash2, Award } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import API from '../services/api';

const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all | completed | active
  const [sortBy, setSortBy] = useState('date_desc'); // date_desc | date_asc | score_desc | score_asc

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get('/api/interviews');
        setInterviews(res.data);
      } catch (err) {
        console.error("Failed to load interview history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this session from history?")) return;
    try {
      await API.delete(`/api/interviews/${id}`);
      setInterviews(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error("Failed to delete interview session:", err);
      alert("Failed to delete interview session from database. Please try again.");
    }
  };

  // Filter & Sort logic
  const filteredInterviews = interviews
    .filter(item => {
      if (!item) return false;
      const roleStr = item.role || 'Interview';
      const matchRole = roleStr.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchRole && matchStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a?.created_at || 0).getTime();
      const dateB = new Date(b?.created_at || 0).getTime();
      if (sortBy === 'date_desc') {
        return dateB - dateA;
      } else if (sortBy === 'date_asc') {
        return dateA - dateB;
      } else if (sortBy === 'score_desc') {
        const scoreA = a?.overall_score !== null && a?.overall_score !== undefined ? a.overall_score : -1;
        const scoreB = b?.overall_score !== null && b?.overall_score !== undefined ? b.overall_score : -1;
        return scoreB - scoreA;
      } else if (sortBy === 'score_asc') {
        const scoreA = a?.overall_score !== null && a?.overall_score !== undefined ? a.overall_score : 101;
        const scoreB = b?.overall_score !== null && b?.overall_score !== undefined ? b.overall_score : 101;
        return scoreA - scoreB;
      }
      return 0;
    });


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-gray-500">Loading History Logs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-cream">
      <Sidebar />

      {/* Main Panel */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-4">
          <Link to="/dashboard" className="text-gray-400 hover:text-midnight md:hidden">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-display font-extrabold text-3xl text-midnight">Session History</h1>
            <p className="text-gray-500 text-sm mt-1">Review all your previous mock interviews and metrics.</p>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="glass-card p-5 mb-8 border border-cream-border/60 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search */}
          <div className="relative w-full md:w-72">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search by job role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-cream-border focus:outline-none focus:ring-2 focus:ring-primary/10 text-xs bg-white"
            />
          </div>

          {/* Selector options */}
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
              <SlidersHorizontal size={14} className="text-gray-400" />
              <span className="text-gray-500 font-semibold">Filter:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-cream-border text-xs bg-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Sessions</option>
                <option value="completed">Completed Only</option>
                <option value="active">In Progress Only</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
              <span className="text-gray-500 font-semibold">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-lg border border-cream-border text-xs bg-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="date_desc">Latest Date</option>
                <option value="date_asc">Oldest Date</option>
                <option value="score_desc">Highest Score</option>
                <option value="score_asc">Lowest Score</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results grid */}
        {filteredInterviews.length === 0 ? (
          <div className="glass-card p-12 text-center border border-dashed border-cream-border rounded-xl">
            <span className="text-sm text-gray-500">No mock interview sessions match your current filter.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredInterviews.map((item) => (
              <div 
                key={item.id} 
                className="glass-card p-6 border border-cream-border/60 flex flex-col justify-between hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] uppercase font-bold text-primary tracking-wider px-2 py-0.5 rounded bg-primary/5 border border-primary/10">
                      {item.interview_type}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      item.status === 'completed' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-xl text-midnight truncate">{item.role}</h3>
                  <span className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                    <Calendar size={12} />
                    {new Date(item.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </span>
                  
                  {item.status === 'completed' && item.overall_score !== null && (
                    <div className="mt-4 flex items-center gap-1.5 text-midnight">
                      <Award size={16} className="text-primary" />
                      <span className="text-sm">Overall Score: <b>{item.overall_score}/100</b></span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-cream-border/40 flex justify-between items-center gap-3">
                  <button 
                    onClick={(e) => handleDelete(item.id, e)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition-colors"
                    title="Delete session"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="flex gap-2">
                    {item.status === 'completed' ? (
                      <Link 
                        to={`/reports/${item.id}`} 
                        className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-glow transition-all"
                      >
                        View Performance Report
                      </Link>
                    ) : (
                      <Link 
                        to={`/interview/${item.id}`} 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
                      >
                        Resume Practice
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default InterviewHistory;
