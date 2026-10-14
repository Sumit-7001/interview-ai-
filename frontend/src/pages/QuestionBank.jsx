import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  BookOpen, 
  Bookmark, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  Play, 
  Filter, 
  ArrowRight, 
  Code2, 
  Cpu, 
  Database, 
  Users, 
  Layers, 
  Zap, 
  Award, 
  ExternalLink,
  RotateCcw,
  Lightbulb,
  X,
  Building2,
  FileCode2
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { 
  TCSLogo, 
  CapgeminiLogo, 
  WiproLogo, 
  InfosysLogo, 
  AccentureLogo, 
  CognizantLogo, 
  AmazonLogo,
  TechMahindraLogo
} from '../components/CompanyDomainIcons';
import API from '../services/api';
import { useAlert } from '../context/AlertContext';

import QUESTIONS_DATA from "../data/questionsData";

// Company Card Configurations
const COMPANY_FILTERS = [
  { id: 'all', name: 'All Companies', count: 'All', Logo: null },
  { id: 'tcs', name: 'TCS', count: '18+ Q&A', Logo: TCSLogo, domain: 'TCS NQT / Digital', badge: 'NQT & Digital' },
  { id: 'capgemini', name: 'Capgemini', count: '16+ Q&A', Logo: CapgeminiLogo, domain: 'Capgemini Technical', badge: 'Tech & Pseudo' },
  { id: 'infosys', name: 'Infosys', count: '8+ Q&A', Logo: InfosysLogo, domain: 'Infosys DSE / Specialist', badge: 'DSE & SE' },
  { id: 'wipro', name: 'Wipro', count: '8+ Q&A', Logo: WiproLogo, domain: 'Wipro Elite & Turbo', badge: 'Elite & Turbo' },
  { id: 'accenture', name: 'Accenture', count: '8+ Q&A', Logo: AccentureLogo, domain: 'Accenture Cognitive & Technical', badge: 'Tech Round' },
  { id: 'cognizant', name: 'Cognizant', count: '6+ Q&A', Logo: CognizantLogo, domain: 'Cognizant GenC & GenC Next', badge: 'GenC Next' },
  { id: 'amazon', name: 'Amazon', count: '5+ Q&A', Logo: AmazonLogo, domain: 'Amazon SDE Track', badge: 'FAANG / SDE' },
  { id: 'tech-mahindra', name: 'Tech Mahindra', count: 'Core CS', Logo: TechMahindraLogo, domain: 'Tech Mahindra Track', badge: 'Tech Track' },
];

const CATEGORY_TABS = [
  'All',
  'Core CS',
  'OOPs',
  'DBMS & SQL',
  'Coding & DSA',
  'Pseudocode',
  'HR'
];

const DIFFICULTY_TABS = ['All', 'Easy', 'Medium', 'Hard'];

const QuestionBank = () => {
  const navigate = useNavigate();
  const { toast } = useAlert();

  // State
  const [questions, setQuestions] = useState(QUESTIONS_DATA);
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState('tcs-01'); // default expand first item
  const [copiedCodeId, setCopiedCodeId] = useState(null);

  // Bookmarks & Mastered (stored in localStorage)
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('interview_ai_bookmarks') || '[]');
    } catch {
      return [];
    }
  });

  const [mastered, setMastered] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('interview_ai_mastered') || '[]');
    } catch {
      return [];
    }
  });

  const [filterBookmarkedOnly, setFilterBookmarkedOnly] = useState(false);
  const [filterMasteredOnly, setFilterMasteredOnly] = useState(false);

  // AI Explainer Modal
  const [explainingQuestion, setExplainingQuestion] = useState(null);
  const [explainingLang, setExplainingLang] = useState('Java');
  const [explanationText, setExplanationText] = useState('');
  const [explanationLoading, setExplanationLoading] = useState(false);

  // Fetch from backend API on mount if available
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await API.get('/api/question-bank');
        if (res.data?.questions?.length) {
          setQuestions(res.data.questions);
        }
      } catch (err) {
        // Fallback to static questions cleanly without user disruption
        console.log("Using cached question bank data.");
      }
    };
    fetchQuestions();
  }, []);

  // Save bookmarks & mastered to localStorage
  const toggleBookmark = (id, e) => {
    e.stopPropagation();
    setBookmarks(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('interview_ai_bookmarks', JSON.stringify(next));
      if (!prev.includes(id)) {
        toast.success("Question saved to your bookmarks!", "Bookmarked");
      }
      return next;
    });
  };

  const toggleMastered = (id, e) => {
    e.stopPropagation();
    setMastered(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('interview_ai_mastered', JSON.stringify(next));
      if (!prev.includes(id)) {
        toast.success("Great job! Marked question as mastered.", "Progress Updated");
      }
      return next;
    });
  };

  const handleCopyCode = (id, code, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    toast.info("Code copied to clipboard!", "Copied");
    setTimeout(() => setCopiedCodeId(null), 2500);
  };

  const handlePracticeInInterview = (q) => {
    // Navigate to interview setup or dashboard with company preset
    const targetDomain = q.company === 'TCS' ? 'TCS NQT / Digital' 
      : q.company === 'Capgemini' ? 'Capgemini Technical'
      : q.company === 'Infosys' ? 'Infosys DSE / Specialist'
      : q.company === 'Wipro' ? 'Wipro Elite & Turbo'
      : q.company === 'Accenture' ? 'Accenture Cognitive & Technical'
      : q.company === 'Cognizant' ? 'Cognizant GenC & GenC Next'
      : 'Technical';
    
    navigate('/dashboard', { state: { autoSelectDomain: targetDomain, focusQuestion: q.question } });
  };

  // Open AI Explainer
  const handleOpenAiExplainer = async (q, e) => {
    e.stopPropagation();
    setExplainingQuestion(q);
    setExplanationLoading(true);
    setExplanationText('');

    try {
      const res = await API.post('/api/question-bank/explain', {
        question_id: q.id,
        question_text: q.question,
        company: q.company,
        language_preference: explainingLang
      });
      setExplanationText(res.data?.explanation || q.answer);
    } catch {
      // Use question's detailed answer + tips as fallback
      setExplanationText(
        `### 💡 AI Comprehensive Explanation (${q.company} Focus)\n\n` +
        `**Core Breakdown:**\n${q.answer}\n\n` +
        `**🎯 What ${q.company} Interviewers Evaluate:**\n${q.interviewer_tip}\n\n` +
        `**⚠️ Pitfall to Avoid:**\n${q.common_mistakes}`
      );
    } finally {
      setExplanationLoading(false);
    }
  };

  // Re-run explainer when language changes
  const handleLanguageChange = async (newLang) => {
    setExplainingLang(newLang);
    if (!explainingQuestion) return;
    setExplanationLoading(true);
    try {
      const res = await API.post('/api/question-bank/explain', {
        question_id: explainingQuestion.id,
        question_text: explainingQuestion.question,
        company: explainingQuestion.company,
        language_preference: newLang
      });
      setExplanationText(res.data?.explanation || explainingQuestion.answer);
    } catch {
      // Fallback
    } finally {
      setExplanationLoading(false);
    }
  };

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      // Company match
      if (selectedCompany !== 'all') {
        const cLow = selectedCompany.toLowerCase();
        const matchCompany = q.company.toLowerCase().includes(cLow) || 
                             q.company_tag.toLowerCase().includes(cLow);
        if (!matchCompany) return false;
      }

      // Category match
      if (selectedCategory !== 'All') {
        if (!q.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
          return false;
        }
      }

      // Difficulty match
      if (selectedDifficulty !== 'All') {
        if (q.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()) {
          return false;
        }
      }

      // Bookmarked filter
      if (filterBookmarkedOnly && !bookmarks.includes(q.id)) {
        return false;
      }

      // Mastered filter
      if (filterMasteredOnly && !mastered.includes(q.id)) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const qTerm = searchQuery.toLowerCase();
        const match = q.question.toLowerCase().includes(qTerm) ||
                      q.summary.toLowerCase().includes(qTerm) ||
                      q.company.toLowerCase().includes(qTerm) ||
                      q.category.toLowerCase().includes(qTerm) ||
                      q.round.toLowerCase().includes(qTerm);
        if (!match) return false;
      }

      return true;
    });
  }, [questions, selectedCompany, selectedCategory, selectedDifficulty, searchQuery, bookmarks, mastered, filterBookmarkedOnly, filterMasteredOnly]);

  // Statistics
  const totalCount = questions.length;
  const tcsCount = questions.filter(q => q.company === 'TCS').length;
  const capgCount = questions.filter(q => q.company === 'Capgemini').length;
  const masteredCount = mastered.length;
  const bookmarkedCount = bookmarks.length;
  const progressPercent = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen flex bg-cream font-sans">
      <Sidebar />

      {/* Main Container */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl">
        
        {/* Header Breadcrumb & Title */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
              <BookOpen size={14} />
              <span>Interview Preparation Hub</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500">Recruiter Question Bank</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-midnight tracking-tight">
              Company Question Bank
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Curated, frequently asked interview questions from <strong className="text-midnight">TCS</strong>, <strong className="text-midnight">Capgemini</strong>, <strong className="text-midnight">Infosys</strong>, <strong className="text-midnight">Wipro</strong>, and top tech firms.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-midnight text-white text-xs font-semibold hover:bg-midnight-light transition-all shadow-sm"
            >
              <Play size={14} className="text-primary-light" />
              <span>Launch Mock Interview</span>
            </Link>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-white border border-cream-border shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-violet-50 text-primary flex items-center justify-center shrink-0">
              <Database size={20} />
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">Total Questions</div>
              <div className="text-xl font-display font-bold text-midnight">{totalCount} Questions</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-cream-border shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Building2 size={20} />
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">TCS Questions</div>
              <div className="text-xl font-display font-bold text-rose-700">{tcsCount} Sets</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-cream-border shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
              <Cpu size={20} />
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">Capgemini Sets</div>
              <div className="text-xl font-display font-bold text-cyan-700">{capgCount} Sets</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-cream-border shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Award size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-400 font-medium flex items-center justify-between">
                <span>Mastered</span>
                <span className="font-bold text-emerald-600">{progressPercent}%</span>
              </div>
              <div className="text-xl font-display font-bold text-emerald-700">{masteredCount} / {totalCount}</div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-1">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, progressPercent)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Company Carousel / Selector Tabs */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Building2 size={14} />
              <span>Select Recruiter Track</span>
            </h2>
            <span className="text-xs text-gray-400 font-medium">Click to filter company-specific question sets</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {COMPANY_FILTERS.map((item) => {
              const isActive = selectedCompany === item.id;
              const isTCS = item.id === 'tcs';
              const isCapg = item.id === 'capgemini';

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedCompany(item.id);
                    // Reset page scroll position if needed
                  }}
                  className={`flex flex-col items-start p-3.5 rounded-2xl border transition-all text-left relative overflow-hidden group ${
                    isActive 
                      ? 'bg-white border-primary shadow-md ring-2 ring-primary/20' 
                      : 'bg-white/80 hover:bg-white border-cream-border hover:border-gray-300 shadow-xs'
                  }`}
                >
                  {/* Top highlight bar */}
                  {isActive && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent-pink" />
                  )}

                  <div className="w-full flex items-center justify-between gap-2 mb-2">
                    <div className="h-7 flex items-center">
                      {item.Logo ? (
                        <item.Logo className="h-6 w-auto object-contain" />
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                          <Layers size={16} className="text-primary" />
                          <span>All Sets</span>
                        </div>
                      )}
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isTCS 
                          ? 'bg-rose-50 text-rose-700 border-rose-200' 
                          : isCapg 
                          ? 'bg-cyan-50 text-cyan-700 border-cyan-200' 
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <div className="text-sm font-bold text-midnight font-display flex items-center justify-between w-full">
                    <span>{item.name}</span>
                    <span className="text-xs font-normal text-gray-400">{item.count}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Company Spotlight Banner (Dynamic context for TCS & Capgemini) */}
        {selectedCompany === 'tcs' && (
          <div className="mb-8 p-5 md:p-6 rounded-2xl bg-gradient-to-r from-rose-900 via-indigo-950 to-midnight text-white shadow-lg border border-rose-900/40 relative overflow-hidden">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                  <TCSLogo className="h-4 w-auto brightness-200" />
                  <span>TCS NQT, Digital & Ninja Drive Masterclass</span>
                </div>
                <h3 className="text-xl md:text-2xl font-display font-bold text-white">
                  TCS Hiring Pattern & Evaluation Insights
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  TCS focuses extensively on <strong>Core CS fundamentals</strong>: Stack vs Heap Memory, Call by Value/Reference, ACID in DBMS, SQL <code className="text-rose-300 bg-rose-950/60 px-1 py-0.5 rounded">DENSE_RANK()</code> salary queries, and willingness for rotational shifts & relocation.
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-300 pt-1">
                  <span className="bg-white/10 px-2.5 py-1 rounded-lg">Round 1: NQT Foundation (60m)</span>
                  <span className="bg-white/10 px-2.5 py-1 rounded-lg">Round 2: Advanced Coding (40m)</span>
                  <span className="bg-white/10 px-2.5 py-1 rounded-lg">Round 3: Tech & HR Interview (30m)</span>
                </div>
              </div>

              <button
                onClick={() => handlePracticeInInterview({ company: 'TCS' })}
                className="shrink-0 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs md:text-sm flex items-center justify-center gap-2 shadow-glow transition-all"
              >
                <Play size={16} />
                <span>Practice TCS Mock Interview</span>
              </button>
            </div>
          </div>
        )}

        {selectedCompany === 'capgemini' && (
          <div className="mb-8 p-5 md:p-6 rounded-2xl bg-gradient-to-r from-cyan-950 via-blue-950 to-midnight text-white shadow-lg border border-cyan-800/40 relative overflow-hidden">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
                  <CapgeminiLogo className="h-4 w-auto brightness-200" />
                  <span>Capgemini Technical & Pseudo-code Elimination Guide</span>
                </div>
                <h3 className="text-xl md:text-2xl font-display font-bold text-white">
                  Capgemini Technical Track & Pseudocode Pattern
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Capgemini's defining round is the <strong>30-Question Pseudo-code Round</strong> (bitwise XOR, AND, left/right shifts, loops), followed by deep technical questions on the <strong>4 Pillars of OOPs</strong>, <strong>Exception Handling</strong> (<code className="text-cyan-300 bg-cyan-950/60 px-1 py-0.5 rounded">finally</code> vs <code className="text-cyan-300 bg-cyan-950/60 px-1 py-0.5 rounded">finalize</code>), and Capgemini's Seven Values.
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-300 pt-1">
                  <span className="bg-white/10 px-2.5 py-1 rounded-lg">Round 1: Pseudo-code (30 Qs)</span>
                  <span className="bg-white/10 px-2.5 py-1 rounded-lg">Round 2: Spoken English Communication</span>
                  <span className="bg-white/10 px-2.5 py-1 rounded-lg">Round 3: Technical & HR (45m)</span>
                </div>
              </div>

              <button
                onClick={() => handlePracticeInInterview({ company: 'Capgemini' })}
                className="shrink-0 px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs md:text-sm flex items-center justify-center gap-2 shadow-glow transition-all"
              >
                <Play size={16} />
                <span>Practice Capgemini Mock Interview</span>
              </button>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-cream-border shadow-xs mb-6 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by topic (e.g. stack, bitwise, ACID, OOPs, salary, exception)..."
                className="w-full pl-10 pr-4 py-2.5 bg-cream-darker/60 border border-cream-border rounded-xl text-sm focus:outline-none focus:border-primary text-midnight placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-semibold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Filter Toggles */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setFilterBookmarkedOnly(!filterBookmarkedOnly)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  filterBookmarkedOnly
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : 'bg-white text-gray-600 border-cream-border hover:bg-cream-darker'
                }`}
              >
                <Bookmark size={14} className={filterBookmarkedOnly ? 'fill-white' : ''} />
                <span>Saved ({bookmarkedCount})</span>
              </button>

              <button
                onClick={() => setFilterMasteredOnly(!filterMasteredOnly)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  filterMasteredOnly
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                    : 'bg-white text-gray-600 border-cream-border hover:bg-cream-darker'
                }`}
              >
                <CheckCircle2 size={14} className={filterMasteredOnly ? 'fill-white' : ''} />
                <span>Mastered ({masteredCount})</span>
              </button>

              {(selectedCompany !== 'all' || selectedCategory !== 'All' || selectedDifficulty !== 'All' || searchQuery || filterBookmarkedOnly || filterMasteredOnly) && (
                <button
                  onClick={() => {
                    setSelectedCompany('all');
                    setSelectedCategory('All');
                    setSelectedDifficulty('All');
                    setSearchQuery('');
                    setFilterBookmarkedOnly(false);
                    setFilterMasteredOnly(false);
                  }}
                  className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs text-rose-500 hover:bg-rose-50 transition-colors font-semibold"
                  title="Reset all filters"
                >
                  <RotateCcw size={13} />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Sub-Filters: Categories & Difficulty */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-cream-border/60 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-gray-400 font-semibold mr-1 shrink-0">Category:</span>
              {CATEGORY_TABS.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-midnight text-white shadow-xs'
                      : 'bg-cream-darker text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-gray-400 font-semibold mr-1">Difficulty:</span>
              {DIFFICULTY_TABS.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-cream-darker text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Questions List Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <span>Showing {filteredQuestions.length} Questions</span>
            {selectedCompany !== 'all' && (
              <span className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium">
                {selectedCompany.toUpperCase()} Track
              </span>
            )}
          </div>
          <span className="text-xs text-gray-400">Click any question to view detailed answer & code</span>
        </div>

        {/* Questions Accordion Cards */}
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-cream-border space-y-3">
            <HelpCircle size={40} className="mx-auto text-gray-300" />
            <h3 className="text-base font-bold text-gray-700">No questions found matching your criteria</h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              Try adjusting your search keyword, category, or clear company filters to see all available question sets.
            </p>
            <button
              onClick={() => {
                setSelectedCompany('all');
                setSelectedCategory('All');
                setSelectedDifficulty('All');
                setSearchQuery('');
                setFilterBookmarkedOnly(false);
                setFilterMasteredOnly(false);
              }}
              className="px-4 py-2 rounded-xl bg-midnight text-white text-xs font-semibold hover:bg-midnight-light transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((q) => {
              const isExpanded = expandedId === q.id;
              const isBookmarked = bookmarks.includes(q.id);
              const isMastered = mastered.includes(q.id);
              const isTCS = q.company === 'TCS';
              const isCapg = q.company === 'Capgemini';

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs ${
                    isExpanded 
                      ? 'border-primary ring-1 ring-primary/20 shadow-md' 
                      : 'border-cream-border hover:border-gray-300'
                  }`}
                >
                  {/* Card Header */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : q.id)}
                    className="p-5 cursor-pointer flex items-start justify-between gap-4 select-none"
                  >
                    <div className="space-y-2 flex-1">
                      {/* Meta Tags Row */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {/* Company Badge */}
                        <span className={`font-bold px-2.5 py-0.5 rounded-full border ${
                          isTCS 
                            ? 'bg-rose-50 text-rose-700 border-rose-200' 
                            : isCapg 
                            ? 'bg-cyan-50 text-cyan-700 border-cyan-200' 
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}>
                          {q.company}
                        </span>

                        {/* Round Badge */}
                        <span className="font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200">
                          {q.round}
                        </span>

                        {/* Category */}
                        <span className="font-medium px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 border border-violet-100">
                          {q.category}
                        </span>

                        {/* Difficulty */}
                        <span className={`font-bold px-2 py-0.5 rounded-md ${
                          q.difficulty === 'Easy' 
                            ? 'text-emerald-700 bg-emerald-50' 
                            : q.difficulty === 'Medium' 
                            ? 'text-amber-700 bg-amber-50' 
                            : 'text-rose-700 bg-rose-50'
                        }`}>
                          {q.difficulty}
                        </span>

                        {/* Frequency Tag */}
                        {q.frequency && (
                          <span className="text-[11px] text-gray-500 font-medium">
                            {q.frequency}
                          </span>
                        )}
                      </div>

                      {/* Question Text */}
                      <h3 className="text-base md:text-lg font-bold text-midnight font-display tracking-tight hover:text-primary transition-colors">
                        {q.question}
                      </h3>

                      {/* Brief Summary (Visible when collapsed) */}
                      {!isExpanded && (
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {q.summary}
                        </p>
                      )}
                    </div>

                    {/* Quick Action Icons & Expand Chevron */}
                    <div className="flex items-center gap-1.5 shrink-0 pt-1">
                      <button
                        onClick={(e) => toggleBookmark(q.id, e)}
                        className={`p-2 rounded-xl transition-colors ${
                          isBookmarked 
                            ? 'text-amber-500 hover:bg-amber-50' 
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                        }`}
                        title={isBookmarked ? "Remove Bookmark" : "Save Question"}
                      >
                        <Bookmark size={16} className={isBookmarked ? 'fill-amber-500' : ''} />
                      </button>

                      <button
                        onClick={(e) => toggleMastered(q.id, e)}
                        className={`p-2 rounded-xl transition-colors ${
                          isMastered 
                            ? 'text-emerald-600 hover:bg-emerald-50' 
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                        }`}
                        title={isMastered ? "Marked as Mastered" : "Mark as Mastered"}
                      >
                        <CheckCircle2 size={16} className={isMastered ? 'fill-emerald-600 text-white' : ''} />
                      </button>

                      <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content Section */}
                  {isExpanded && (
                    <div className="px-5 pb-6 pt-2 border-t border-cream-border/60 bg-cream/30 space-y-5">
                      
                      {/* Comprehensive Answer */}
                      <div className="space-y-2">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                          <BookOpen size={14} className="text-primary" />
                          <span>Detailed Model Answer & Technical Breakdown</span>
                        </div>
                        <div className="prose prose-sm max-w-none text-gray-700 bg-white p-4 rounded-xl border border-cream-border whitespace-pre-line text-sm leading-relaxed">
                          {q.answer}
                        </div>
                      </div>

                      {/* Code Example (if available) */}
                      {q.code_example && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                              <Code2 size={14} className="text-indigo-600" />
                              <span>Code Implementation ({q.code_example.language.toUpperCase()})</span>
                            </span>
                            <button
                              onClick={(e) => handleCopyCode(q.id, q.code_example.code, e)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
                            >
                              {copiedCodeId === q.id ? (
                                <>
                                  <Check size={12} className="text-emerald-600" />
                                  <span className="text-emerald-600">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={12} />
                                  <span>Copy Code</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="rounded-xl overflow-hidden border border-midnight-border bg-midnight text-gray-200 p-4 font-mono text-xs overflow-x-auto shadow-inner leading-relaxed">
                            <pre>{q.code_example.code}</pre>
                          </div>
                        </div>
                      )}

                      {/* Interviewer Tip & Pitfall Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        {q.interviewer_tip && (
                          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                              <Lightbulb size={14} />
                              <span>{q.company} Interviewer Secret Tip</span>
                            </div>
                            <p className="text-xs text-amber-800/90 leading-relaxed">
                              {q.interviewer_tip}
                            </p>
                          </div>
                        )}

                        {q.common_mistakes && (
                          <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200/80 text-rose-900 space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                              <X size={14} />
                              <span>Common Pitfall Candidates Fail On</span>
                            </div>
                            <p className="text-xs text-rose-800/90 leading-relaxed">
                              {q.common_mistakes}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Follow-up Questions */}
                      {q.follow_ups && q.follow_ups.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-violet-50/60 border border-violet-100 text-gray-700 space-y-1.5">
                          <div className="text-xs font-bold text-primary flex items-center gap-1.5">
                            <HelpCircle size={14} />
                            <span>Expected Follow-up Questions from Panel:</span>
                          </div>
                          <ul className="list-disc list-inside text-xs space-y-1 text-gray-600 pl-1">
                            {q.follow_ups.map((f, idx) => (
                              <li key={idx}>{f}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Card Bottom Action Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-cream-border">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleOpenAiExplainer(q, e)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-100 hover:bg-violet-200 text-primary text-xs font-semibold transition-colors"
                          >
                            <Sparkles size={14} />
                            <span>Ask AI to Explain Concept</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePracticeInInterview(q)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-midnight hover:bg-midnight-light text-white text-xs font-semibold shadow-xs transition-all"
                          >
                            <Play size={13} className="text-primary-light" />
                            <span>Test This in AI Mock Interview</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* AI Concept Explainer Modal */}
      {explainingQuestion && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-cream-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-cream-border flex items-center justify-between bg-cream/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-midnight">
                    AI Concept Explainer & Coach
                  </h3>
                  <p className="text-xs text-gray-500">
                    {explainingQuestion.company} Interview Track • Personalized Deep Dive
                  </p>
                </div>
              </div>
              <button
                onClick={() => setExplainingQuestion(null)}
                className="w-8 h-8 rounded-lg hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Language Selection & Question summary */}
            <div className="p-4 bg-gray-50 border-b border-cream-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="font-medium text-gray-800 line-clamp-1 max-w-md">
                Q: <span className="font-bold text-midnight">{explainingQuestion.question}</span>
              </div>
              
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-gray-500 font-medium">Code Language:</span>
                {['Java', 'Python', 'C++', 'SQL'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                      explainingLang === lang
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Body / Explanation text */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {explanationLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-semibold text-gray-500">
                    AI is preparing an intuitive explanation & custom code for {explainingQuestion.company}...
                  </span>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line text-sm leading-relaxed">
                  {explanationText}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-cream-border bg-gray-50 flex items-center justify-between">
              <button
                onClick={() => handleLanguageChange(explainingLang)}
                disabled={explanationLoading}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-midnight transition-colors"
              >
                <RotateCcw size={13} />
                <span>Regenerate AI Insight</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setExplainingQuestion(null)}
                  className="px-4 py-2 rounded-xl border border-cream-border bg-white text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const q = explainingQuestion;
                    setExplainingQuestion(null);
                    handlePracticeInInterview(q);
                  }}
                  className="px-4 py-2 rounded-xl bg-midnight hover:bg-midnight-light text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Play size={13} className="text-primary-light" />
                  <span>Start Mock Interview</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default QuestionBank;
