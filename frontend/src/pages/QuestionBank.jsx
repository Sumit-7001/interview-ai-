import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { 
  Search, 
  Bookmark, 
  SlidersHorizontal, 
  Eye, 
  ChevronRight, 
  Play, 
  Sparkles, 
  Copy, 
  Check, 
  X, 
  BarChart3, 
  Network, 
  Code2, 
  Atom, 
  Layers, 
  Brain, 
  Lightbulb, 
  LayoutGrid,
  FileText,
  ExternalLink,
  Download
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { 
  TCSLogo, 
  WiproLogo, 
  CognizantLogo, 
  CapgeminiLogo, 
  InfosysLogo, 
  AccentureLogo, 
  AmazonLogo, 
  TechMahindraLogo,
  PythonIcon 
} from '../components/CompanyDomainIcons';
import API from '../services/api';
import { useAlert } from '../context/AlertContext';
import CompanyPdfViewer from '../components/CompanyPdfViewer';
import { 
  DOMAINS, 
  COMPANIES, 
  DATA_ANALYST_COMPANIES,
  DEV_COMPANIES,
  DATA_ANALYST_68_QUESTIONS, 
  ALL_DATA_ANALYST_QUESTIONS,
  SWE_GENERAL_QUESTIONS,
  ALL_SWE_GENERAL_QUESTIONS,
  FULL_STACK_QUESTIONS,
  ALL_FULL_STACK_QUESTIONS,
  FRONTEND_DEVELOPER_QUESTIONS,
  ALL_FRONTEND_QUESTIONS
} from '../data/domainQuestionsData';

const QuestionBank = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useAlert();

  // View state: 'domains' = First Image | 'drilldown' = Second Image
  const domainParam = searchParams.get('domain');
  const [viewMode, setViewMode] = useState(domainParam ? 'drilldown' : 'domains');
  const [selectedDomainId, setSelectedDomainId] = useState(domainParam || 'data-analyst');
  const [selectedCompanyId, setSelectedCompanyId] = useState('tcs');
  const [activeCompanyTab, setActiveCompanyTab] = useState('questions'); // 'questions' | 'pdf'

  // Filter state
  const [selectedFilterCategory, setSelectedFilterCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Most Relevant');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [activeModalQuestion, setActiveModalQuestion] = useState(null);
  const [copiedCodeId, setCopiedCodeId] = useState(null);

  // Sync viewMode when URL or location changes
  useEffect(() => {
    const currentDomain = searchParams.get('domain');
    if (currentDomain) {
      setSelectedDomainId(currentDomain);
      setViewMode('drilldown');
    } else {
      setViewMode('domains');
    }
  }, [searchParams, location.pathname]);

  // Bookmarks (localStorage)
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('interview_ai_bookmarks') || '[]');
    } catch {
      return [];
    }
  });

  // AI Explainer State
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');

  // Active domain object
  const currentDomain = useMemo(() => {
    return DOMAINS.find(d => d.id === selectedDomainId) || DOMAINS[0];
  }, [selectedDomainId]);

  // Data Analyst domain check: only Data Analyst has the AmbitionBox/Topfolio questions & PDF view
  const isDataAnalyst = selectedDomainId === 'data-analyst';

  // Active companies list: Data Analyst has the 8 verified companies (with updated Amazon & Tech Mahindra), other domains use standard COMPANIES
  const activeCompanies = useMemo(() => {
    return isDataAnalyst ? DATA_ANALYST_COMPANIES : COMPANIES;
  }, [isDataAnalyst]);

  // Active company object
  const currentCompany = useMemo(() => {
    return activeCompanies.find(c => c.id === selectedCompanyId) || activeCompanies[0];
  }, [activeCompanies, selectedCompanyId]);

  // Enter Second Image when clicking on Data Analyst (or any domain)
  const handleSelectDomain = (domainId) => {
    setSelectedDomainId(domainId);
    setSelectedFilterCategory('All');
    setSelectedDifficulty('All');
    setSearchQuery('');
    setShowSavedOnly(false);
    setViewMode('drilldown');
    setSearchParams({ domain: domainId });
  };

  // Return to First Image
  const handleReturnToDomains = () => {
    setViewMode('domains');
    setSelectedFilterCategory('All');
    setSelectedDifficulty('All');
    setSearchQuery('');
    setShowSavedOnly(false);
    setSearchParams({});
  };

  // Toggle bookmark
  const toggleBookmark = (id, e) => {
    if (e) e.stopPropagation();
    setBookmarks(prev => {
      const isBookmarked = prev.includes(id);
      const next = isBookmarked ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('interview_ai_bookmarks', JSON.stringify(next));
      if (!isBookmarked) {
        toast.success("Question saved to your bookmarks!", "Bookmarked");
      } else {
        toast.info("Question removed from bookmarks.", "Removed");
      }
      return next;
    });
  };

  // Copy code snippet
  const handleCopyCode = (id, code, e) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    toast.info("Code copied to clipboard!", "Copied");
    setTimeout(() => setCopiedCodeId(null), 2500);
  };

  // Practice in Mock Interview
  const handleLaunchPractice = (question) => {
    const domainName = currentDomain?.name || 'Software Engineer (General)';
    const companyName = viewMode === 'drilldown' ? (currentCompany?.name || 'TCS') : 'TCS';
    
    let roleName = 'Software Engineer';
    if (selectedDomainId === 'data-analyst') roleName = 'Data Analyst';
    else if (selectedDomainId === 'full-stack') roleName = 'Full Stack Engineer';
    else if (selectedDomainId === 'frontend-react') roleName = 'React Developer';
    else if (selectedDomainId === 'data-scientist') roleName = 'Data Scientist';
    else if (selectedDomainId === 'backend-python') roleName = 'Python Developer';
    
    let compDomain = 'TCS NQT / Digital';
    if (companyName.toLowerCase().includes('wipro')) compDomain = 'Wipro Elite & Turbo';
    else if (companyName.toLowerCase().includes('infosys')) compDomain = 'Infosys DSE / Specialist';
    else if (companyName.toLowerCase().includes('capgemini')) compDomain = 'Capgemini Technical';
    else if (companyName.toLowerCase().includes('accenture')) compDomain = 'Accenture Cognitive & Technical';
    else if (companyName.toLowerCase().includes('cognizant')) compDomain = 'Cognizant GenC & GenC Next';
    else if (companyName.toLowerCase().includes('amazon')) compDomain = 'Top Tech / FAANG';

    navigate('/dashboard', { 
      state: { 
        autoSelectDomain: `${domainName} - ${companyName}`, 
        focusQuestion: question?.question || '',
        role: roleName,
        companyDomain: compDomain,
        autoLaunch: true,
      } 
    });
  };

  // AI Explain request
  const handleRequestAiExplanation = async (question) => {
    setExplanationLoading(true);
    setAiExplanation('');
    try {
      const res = await API.post('/api/question-bank/explain', {
        question_id: question.id,
        question_text: question.question,
        company: viewMode === 'drilldown' ? currentCompany.name : currentDomain.name,
        language_preference: 'Standard'
      });
      setAiExplanation(res.data?.explanation || question.answer);
    } catch {
      setAiExplanation(
        `### 💡 AI Deep Dive (${currentDomain.name})\n\n` +
        `**Key Architectural Principle:**\n${question.answer}\n\n` +
        `**🎯 What Interviewers Evaluate:**\n${question.interviewer_tip}\n\n` +
        `**⚠️ Pitfall to Avoid:**\n${question.common_mistakes}`
      );
    } finally {
      setExplanationLoading(false);
    }
  };

  // Source questions dynamically based on active domain & company:
  const sourceQuestions = useMemo(() => {
    if (viewMode === 'domains') {
      if (selectedDomainId === 'swe-general') return SWE_GENERAL_QUESTIONS;
      if (selectedDomainId === 'full-stack') return FULL_STACK_QUESTIONS;
      if (selectedDomainId === 'frontend-react') return FRONTEND_DEVELOPER_QUESTIONS;
      return DATA_ANALYST_68_QUESTIONS;
    }
    
    // Drilldown view:
    if (selectedDomainId === 'swe-general') {
      return ALL_SWE_GENERAL_QUESTIONS[selectedCompanyId] || SWE_GENERAL_QUESTIONS;
    }
    if (selectedDomainId === 'full-stack') {
      return ALL_FULL_STACK_QUESTIONS[selectedCompanyId] || FULL_STACK_QUESTIONS;
    }
    if (selectedDomainId === 'frontend-react') {
      return ALL_FRONTEND_QUESTIONS[selectedCompanyId] || FRONTEND_DEVELOPER_QUESTIONS;
    }
    return ALL_DATA_ANALYST_QUESTIONS[selectedCompanyId] || ALL_DATA_ANALYST_QUESTIONS.tcs;
  }, [viewMode, selectedDomainId, selectedCompanyId]);

  // Filtered & Sorted Questions
  const filteredQuestions = useMemo(() => {
    let result = [...sourceQuestions];

    // Search query
    if (searchQuery.trim()) {
      const qTerm = searchQuery.toLowerCase();
      result = result.filter(q => 
        q.question.toLowerCase().includes(qTerm) ||
        q.category.toLowerCase().includes(qTerm) ||
        (q.summary && q.summary.toLowerCase().includes(qTerm)) ||
        (q.answer && q.answer.toLowerCase().includes(qTerm))
      );
    }

    // Category / Topic filter
    if (selectedFilterCategory !== 'All') {
      result = result.filter(q => q.category.toLowerCase() === selectedFilterCategory.toLowerCase());
    }

    // Difficulty filter
    if (selectedDifficulty !== 'All') {
      result = result.filter(q => q.difficulty.toLowerCase() === selectedDifficulty.toLowerCase());
    }

    // Saved only filter
    if (showSavedOnly) {
      result = result.filter(q => bookmarks.includes(q.id));
    }

    // Sort
    if (sortBy === 'Difficulty: Easy to Hard') {
      const diffOrder = { Easy: 1, Medium: 2, Hard: 3 };
      result.sort((a, b) => (diffOrder[a.difficulty] || 2) - (diffOrder[b.difficulty] || 2));
    } else if (sortBy === 'Difficulty: Hard to Easy') {
      const diffOrder = { Easy: 1, Medium: 2, Hard: 3 };
      result.sort((a, b) => (diffOrder[b.difficulty] || 2) - (diffOrder[a.difficulty] || 2));
    } else if (sortBy === 'Alphabetical (A-Z)') {
      result.sort((a, b) => a.question.localeCompare(b.question));
    }

    return result;
  }, [sourceQuestions, selectedFilterCategory, selectedDifficulty, searchQuery, showSavedOnly, sortBy, bookmarks]);

  // Render Domain Icon
  const renderDomainIcon = (iconType) => {
    switch (iconType) {
      case 'chart':
        return <BarChart3 size={20} className="text-purple-600" />;
      case 'network':
        return <Network size={20} className="text-blue-600" />;
      case 'code':
        return <Code2 size={20} className="text-blue-600" />;
      case 'react':
        return <Atom size={20} className="text-cyan-600" />;
      case 'python':
        return <PythonIcon className="w-5 h-5" />;
      case 'stack':
        return <Layers size={20} className="text-orange-600" />;
      case 'brain':
        return <Brain size={20} className="text-purple-600" />;
      case 'lightbulb':
        return <Lightbulb size={20} className="text-amber-500" />;
      default:
        return <BarChart3 size={20} className="text-purple-600" />;
    }
  };

  // Render Company Logo
  const renderCompanyLogo = (logoType) => {
    switch (logoType) {
      case 'tcs':
        return <TCSLogo className="h-6 w-auto" />;
      case 'wipro':
        return <WiproLogo className="h-6 w-auto" />;
      case 'cognizant':
        return <CognizantLogo className="h-6 w-auto" />;
      case 'capgemini':
        return <CapgeminiLogo className="h-6 w-auto" />;
      case 'infosys':
        return <InfosysLogo className="h-6 w-auto" />;
      case 'accenture':
        return <AccentureLogo className="h-6 w-auto" />;
      case 'amazon':
        return <AmazonLogo className="h-6 w-auto" />;
      case 'tech-mahindra':
        return <TechMahindraLogo className="h-6 w-auto" />;
      default:
        return null;
    }
  };

  // Category pill styling
  const getCategoryBadgeClass = (cat) => {
    switch (cat) {
      case 'SQL & DBMS':
      case 'DBMS & SQL':
      case 'Databases':
        return 'bg-[#EDE9FE] text-[#6D28D9]';
      case 'Coding & DSA':
        return 'bg-[#EFF6FF] text-[#1D4ED8]';
      case 'OOPs':
        return 'bg-[#FAF5FF] text-[#7E22CE]';
      case 'OS & Networks':
        return 'bg-[#ECFDF5] text-[#047857]';
      case 'System Design':
      case 'System Design & DevOps':
        return 'bg-[#FEF3C7] text-[#B45309]';
      case 'React Core':
        return 'bg-[#ECFEFF] text-[#0E7490]';
      case 'JavaScript':
      case 'Python Core':
        return 'bg-[#FEFCE8] text-[#A16207]';
      case 'HTML & CSS':
      case 'UI/UX':
        return 'bg-[#FDF2F8] text-[#BE185D]';
      case 'State Management':
        return 'bg-[#F5F3FF] text-[#6D28D9]';
      case 'Web Performance':
        return 'bg-[#CCFBF1] text-[#0F766E]';
      case 'Frontend':
        return 'bg-[#E0F2FE] text-[#0369A1]';
      case 'Backend & APIs':
        return 'bg-[#FFF7ED] text-[#C2410C]';
      case 'Security & Auth':
        return 'bg-[#FEE2E2] text-[#991B1B]';
      case 'Python & Pandas':
        return 'bg-[#E0F2FE] text-[#0369A1]';
      case 'Excel':
        return 'bg-[#FCE7F3] text-[#BE185D]';
      case 'Power BI':
        return 'bg-[#E0F2FE] text-[#0284C7]';
      case 'Statistics':
        return 'bg-[#EDE9FE] text-[#6D28D9]';
      case 'Data Analysis':
        return 'bg-[#CCFBF1] text-[#0F766E]';
      case 'Case Studies':
        return 'bg-[#FEF3C7] text-[#B45309]';
      case 'Business Analytics':
        return 'bg-[#EDE9FE] text-[#6D28D9]';
      case 'HR':
        return 'bg-[#F1F5F9] text-[#475569]';
      default:
        return 'bg-[#EDE9FE] text-[#6D28D9]';
    }
  };

  // Difficulty pill styling
  const getDifficultyBadgeClass = (diff) => {
    switch (diff) {
      case 'Easy':
        return 'bg-[#DCFCE7] text-[#166534]';
      case 'Medium':
        return 'bg-[#FEF3C7] text-[#92400E]';
      case 'Hard':
        return 'bg-[#FEE2E2] text-[#991B1B]';
      default:
        return 'bg-[#F1F5F9] text-[#475569]';
    }
  };

  // Categories list dynamically based on active domain
  const activeCategoriesList = useMemo(() => {
    return currentDomain?.categories || ['All', 'Coding & DSA', 'OOPs', 'DBMS & SQL', 'System Design', 'OS & Networks', 'HR'];
  }, [currentDomain]);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans text-slate-900">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Container */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* ========================================================= */}
        {/* VIEW 1: DOMAIN SELECTION VIEW (SCREENSHOT 1)             */}
        {/* ========================================================= */}
        {viewMode === 'domains' ? (
          <div>
            {/* Top Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
                  Question Bank
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Choose a domain to explore topic-wise interview questions.
                </p>
              </div>

              <div>
                <button
                  onClick={() => handleLaunchPractice(null)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <Play size={15} className="fill-white" />
                  <span>Launch Mock Interview</span>
                </button>
              </div>
            </div>

            {/* SELECT DOMAIN SECTION */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-3.5">
                <LayoutGrid size={16} className="text-slate-600" />
                <span>SELECT DOMAIN</span>
              </div>

              {/* 4x2 Domain Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {DOMAINS.map((domain) => {
                  const isSelectedDomain = domain.id === selectedDomainId;

                  return (
                    <button
                      key={domain.id}
                      onClick={() => handleSelectDomain(domain.id)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all duration-200 relative group cursor-pointer ${
                        isSelectedDomain 
                          ? 'bg-purple-50/50 border-[#8B5CF6] ring-1 ring-[#8B5CF6]/50 shadow-xs' 
                          : 'bg-white hover:bg-slate-50/80 border-slate-200/90 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div className="w-11 h-11 rounded-xl bg-purple-100/80 flex items-center justify-center shrink-0">
                          {renderDomainIcon(domain.iconType)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-900 truncate">
                            {domain.name}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate mt-0.5 leading-snug">
                            {domain.subtitle}
                          </div>
                        </div>
                      </div>

                      <ChevronRight 
                        size={18} 
                        className={`shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 ${
                          isSelectedDomain ? 'text-[#8B5CF6]' : 'text-slate-400'
                        }`} 
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* VIEW 2: DRILL-DOWN COMPANY TRACK VIEW (SCREENSHOT 2)     */
          /* ========================================================= */
          <div>
            {/* Top Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-3">
              <button
                onClick={handleReturnToDomains}
                className="hover:text-primary transition-colors cursor-pointer"
              >
                Question Bank
              </button>
              <ChevronRight size={14} className="text-slate-400" />
              <span className="text-slate-900 font-bold">{currentDomain.name}</span>
            </div>

            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0 shadow-xs">
                  {renderDomainIcon(currentDomain.iconType)}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
                    {currentDomain.name}
                  </h1>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Select a company to explore interview questions for {currentDomain.name} role.
                  </p>
                </div>
              </div>

              <div>
                <button
                  onClick={() => handleLaunchPractice(null)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <Play size={15} className="fill-white" />
                  <span>Launch Mock Interview</span>
                </button>
              </div>
            </div>

            {/* 8 Company Cards Grid (4x2) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8">
              {activeCompanies.map((comp) => {
                const isSelected = selectedCompanyId === comp.id;

                return (
                  <button
                    key={comp.id}
                    onClick={() => {
                      setSelectedCompanyId(comp.id);
                      setSelectedFilterCategory('All');
                    }}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-200 relative group cursor-pointer ${
                      isSelected 
                        ? 'bg-purple-50/50 border-[#8B5CF6] ring-1 ring-[#8B5CF6]/50 shadow-xs' 
                        : 'bg-white hover:bg-slate-50/80 border-slate-200/90 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col gap-1.5 min-w-0 pr-2">
                      <div className="h-7 flex items-center">
                        {renderCompanyLogo(comp.logoType)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{comp.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {comp.sets}
                        </div>
                      </div>
                    </div>

                    <ChevronRight 
                      size={18} 
                      className={`shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 ${
                        isSelected ? 'text-[#8B5CF6]' : 'text-slate-400'
                      }`} 
                    />
                  </button>
                );
              })}
            </div>

            {/* View Mode Toggle: Only shown for Data Analyst */}
            {isDataAnalyst && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveCompanyTab('questions')}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeCompanyTab === 'questions'
                        ? 'bg-[#6366F1] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <SlidersHorizontal size={14} />
                    <span>Interview Questions & Answers ({filteredQuestions.length})</span>
                  </button>

                  {currentCompany.pdfUrl && (
                    <button
                      onClick={() => setActiveCompanyTab('pdf')}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeCompanyTab === 'pdf'
                          ? 'bg-[#6366F1] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <FileText size={14} />
                      <span>{currentCompany.id === 'amazon' ? 'Topfolio PDF' : 'AmbitionBox PDF'}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        activeCompanyTab === 'pdf' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700'
                      }`}>
                        2026
                      </span>
                    </button>
                  )}
                </div>

                {currentCompany.pdfUrl && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 pr-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>
                      Questions extracted directly from official <strong>{currentCompany.name} {currentCompany.id === 'amazon' ? 'Topfolio' : 'AmbitionBox'} PDF</strong>
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* View rendering:
            - If in Drilldown View, domain is Data Analyst, and PDF tab is active: display AmbitionBox / Topfolio PDF
            - Otherwise: display interactive question bank with search, categories, filters & cards
        */}
        {viewMode === 'drilldown' && isDataAnalyst && activeCompanyTab === 'pdf' ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0 shadow-xs">
                  <FileText size={22} />
                </div>
                <div>
                  <h2 className="text-base md:text-lg font-bold text-slate-900">
                    {currentCompany.pdfTitle || `${currentCompany.name} ${currentDomain.name} Interview Questions & Answers 2026`}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Official AmbitionBox & Recruiter PDF Document • Verified questions asked by real candidates
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a 
                  href={currentCompany.pdfUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:text-primary hover:border-primary transition-all cursor-pointer"
                >
                  <ExternalLink size={14} />
                  <span>Open Fullscreen</span>
                </a>
                <a 
                  href={currentCompany.pdfUrl} 
                  download
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-all cursor-pointer"
                >
                  <Download size={14} />
                  <span>Download PDF</span>
                </a>
              </div>
            </div>

            <div className="w-full h-[780px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
              <iframe 
                src={currentCompany.pdfUrl} 
                className="w-full h-full border-0" 
                title={`${currentCompany.name} Interview Questions PDF`} 
              />
            </div>
          </div>
        ) : (
          <>
            {/* ========================================================= */}
            {/* SEARCH & FILTER CONTROLS                                 */}
            {/* ========================================================= */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 mb-6">
          {/* Top Search & Actions Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  viewMode === 'domains'
                    ? "Search questions by topic (e.g. SQL, Pandas, Excel, Statistics...)"
                    : "Search questions (e.g. SQL, Pandas, Excel, Power BI, statistics...)"
                }
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Saved and Filter Buttons */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setShowSavedOnly(!showSavedOnly)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  showSavedOnly 
                    ? 'bg-primary text-white border-primary shadow-xs' 
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <Bookmark size={14} className={showSavedOnly ? 'fill-white' : ''} />
                <span>Saved ({bookmarks.length})</span>
              </button>

              <button
                onClick={() => {
                  setSelectedFilterCategory('All');
                  setSelectedDifficulty('All');
                  setSearchQuery('');
                  setShowSavedOnly(false);
                  toast.info("All search & topic filters reset.", "Filters Reset");
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition-all cursor-pointer"
              >
                <SlidersHorizontal size={14} />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Filter Pills Row (Category/Topic & Difficulty) */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-3 border-t border-slate-100">
            {/* Category / Topic Pills */}
            <div className="flex flex-wrap items-center gap-1.5 min-w-0">
              <span className="text-xs font-bold text-slate-700 mr-1.5">
                {viewMode === 'domains' ? 'Category:' : 'Topic:'}
              </span>
              {activeCategoriesList.map((cat) => {
                const isCatActive = selectedFilterCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedFilterCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer ${
                      isCatActive
                        ? 'bg-[#6366F1] text-white font-semibold shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 font-medium'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Difficulty Pills */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-bold text-slate-700 mr-1.5">Difficulty:</span>
              {['All', 'Easy', 'Medium', 'Hard'].map((diff) => {
                const isDiffActive = selectedDifficulty === diff;
                
                let btnStyle = '';
                if (diff === 'All') {
                  btnStyle = isDiffActive 
                    ? 'bg-[#6366F1] text-white font-semibold shadow-xs' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 font-medium';
                } else if (diff === 'Easy') {
                  btnStyle = isDiffActive
                    ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                    : 'bg-[#ECFDF5] text-[#059669] hover:bg-[#D1FAE5] font-semibold';
                } else if (diff === 'Medium') {
                  btnStyle = isDiffActive
                    ? 'bg-amber-600 text-white font-semibold shadow-xs'
                    : 'bg-[#FFFBEB] text-[#D97706] hover:bg-[#FEF3C7] font-semibold';
                } else if (diff === 'Hard') {
                  btnStyle = isDiffActive
                    ? 'bg-rose-600 text-white font-semibold shadow-xs'
                    : 'bg-[#FEF2F2] text-[#E11D48] hover:bg-[#FEE2E2] font-semibold';
                }

                return (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer ${btnStyle}`}
                  >
                    {diff}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* QUESTIONS LIST SECTION HEADER                            */}
        {/* ========================================================= */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="text-sm md:text-base font-bold text-slate-900">
            {viewMode === 'domains' ? (
              <span>Showing {filteredQuestions.length} Questions</span>
            ) : (
              <span>Showing {filteredQuestions.length} Questions ({currentCompany.name} – {currentDomain.name})</span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-medium text-slate-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 border-none focus:outline-none cursor-pointer pr-1"
            >
              <option value="Most Relevant">Most Relevant</option>
              <option value="Difficulty: Easy to Hard">Difficulty: Easy to Hard</option>
              <option value="Difficulty: Hard to Easy">Difficulty: Hard to Easy</option>
              <option value="Alphabetical (A-Z)">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* ========================================================= */}
        {/* QUESTIONS LIST ROWS                                      */}
        {/* ========================================================= */}
        <div className="space-y-3">
          {filteredQuestions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <Search size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">No matching questions found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                We couldn't find any questions matching your current filters or search keywords.
              </p>
              <button
                onClick={() => {
                  setSelectedFilterCategory('All');
                  setSelectedDifficulty('All');
                  setSearchQuery('');
                  setShowSavedOnly(false);
                }}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredQuestions.map((q, idx) => {
              const isBookmarked = bookmarks.includes(q.id);

              return (
                <div
                  key={q.id}
                  onClick={() => {
                    setActiveModalQuestion(q);
                    setAiExplanation('');
                  }}
                  className="bg-white rounded-xl border border-slate-200/80 p-3.5 md:p-4 hover:border-[#8B5CF6]/50 hover:shadow-xs transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-3 group cursor-pointer"
                >
                  {/* Left: Number + Question Text */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-semibold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <div className="text-sm md:text-[15px] font-semibold text-slate-900 group-hover:text-primary transition-colors leading-snug">
                      {q.question}
                    </div>
                  </div>

                  {/* Right: Badges & View Answer Action */}
                  <div className="flex items-center gap-3 shrink-0 pl-11 md:pl-0">
                    {/* Category Pill */}
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getCategoryBadgeClass(q.category)}`}>
                      {q.category}
                    </span>

                    {/* Difficulty Pill */}
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getDifficultyBadgeClass(q.difficulty)}`}>
                      {q.difficulty}
                    </span>

                    {/* Image 1 vs Image 2 Action Button Layout */}
                    {viewMode === 'domains' ? (
                      /* Image 1: 'View answer >' button with chevron right */
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModalQuestion(q);
                          setAiExplanation('');
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-primary hover:bg-purple-50 transition-all cursor-pointer group/btn"
                      >
                        <Eye size={15} className="text-slate-500 group-hover/btn:text-primary" />
                        <span>View answer</span>
                        <ChevronRight size={15} className="text-slate-400 group-hover/btn:text-primary" />
                      </button>
                    ) : (
                      /* Image 2: 'View Answer' button + separate Bookmark icon button */
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveModalQuestion(q);
                            setAiExplanation('');
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:text-primary hover:border-primary transition-all cursor-pointer group/btn"
                        >
                          <Eye size={15} className="text-slate-500 group-hover/btn:text-primary" />
                          <span>View Answer</span>
                        </button>

                        <button
                          onClick={(e) => toggleBookmark(q.id, e)}
                          title={isBookmarked ? "Remove Bookmark" : "Save Question"}
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            isBookmarked 
                              ? 'bg-primary/10 border-primary text-primary' 
                              : 'border-slate-200 text-slate-400 hover:text-primary hover:border-primary hover:bg-slate-50'
                          }`}
                        >
                          <Bookmark size={15} className={isBookmarked ? 'fill-primary' : ''} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
          </>
        )}

      </main>

      {/* ========================================================= */}
      {/* DETAIL ANSWER MODAL / DRAWER                             */}
      {/* ========================================================= */}
      {activeModalQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${getCategoryBadgeClass(activeModalQuestion.category)}`}>
                    {activeModalQuestion.category}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${getDifficultyBadgeClass(activeModalQuestion.difficulty)}`}>
                    {activeModalQuestion.difficulty}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    • {viewMode === 'drilldown' ? `${currentCompany.name} (${currentDomain.name})` : currentDomain.name}
                  </span>
                </div>
                <h2 className="text-lg md:text-xl font-display font-bold text-slate-900 leading-snug">
                  {activeModalQuestion.question}
                </h2>
              </div>

              <button
                onClick={() => setActiveModalQuestion(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-sm leading-relaxed">
              
              {/* Summary Callout */}
              {activeModalQuestion.summary && (
                <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 text-purple-950 font-medium">
                  <span className="font-bold text-primary block text-xs uppercase tracking-wider mb-1">
                    Quick Takeaway:
                  </span>
                  {activeModalQuestion.summary}
                </div>
              )}

              {/* Comprehensive Answer */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Detailed Explanation
                </h4>
                <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-line leading-relaxed">
                  {activeModalQuestion.answer}
                </div>
              </div>

              {/* Code Example (if available) */}
              {activeModalQuestion.code_example && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Code Demonstration ({activeModalQuestion.code_example.language.toUpperCase()})
                    </span>
                    <button
                      onClick={(e) => handleCopyCode(activeModalQuestion.id, activeModalQuestion.code_example.code, e)}
                      className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline cursor-pointer"
                    >
                      {copiedCodeId === activeModalQuestion.id ? (
                        <>
                          <Check size={14} className="text-emerald-600" />
                          <span className="text-emerald-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                    <code>{activeModalQuestion.code_example.code}</code>
                  </pre>
                </div>
              )}

              {/* Interviewer Tip */}
              {activeModalQuestion.interviewer_tip && (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60">
                  <span className="font-bold text-amber-900 text-xs uppercase tracking-wider block mb-1">
                    🎯 Recruiter & Interviewer Tip:
                  </span>
                  <p className="text-xs text-amber-800">
                    {activeModalQuestion.interviewer_tip}
                  </p>
                </div>
              )}

              {/* Common Mistakes */}
              {activeModalQuestion.common_mistakes && (
                <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/60">
                  <span className="font-bold text-rose-900 text-xs uppercase tracking-wider block mb-1">
                    ⚠️ Common Candidate Mistake:
                  </span>
                  <p className="text-xs text-rose-800">
                    {activeModalQuestion.common_mistakes}
                  </p>
                </div>
              )}

              {/* Follow-up Questions */}
              {activeModalQuestion.follow_ups?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Likely Follow-up Questions:
                  </span>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                    {activeModalQuestion.follow_ups.map((fu, idx) => (
                      <li key={idx}>{fu}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* AI Explanation Extension */}
              {aiExplanation && (
                <div className="p-4 rounded-2xl bg-violet-50/80 border border-violet-200 text-violet-950 text-xs leading-relaxed">
                  <div className="flex items-center gap-1.5 font-bold text-primary mb-2">
                    <Sparkles size={14} />
                    <span>AI Deep Dive Breakdown</span>
                  </div>
                  <div className="whitespace-pre-line text-slate-800">
                    {aiExplanation}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 md:p-5 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleBookmark(activeModalQuestion.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    bookmarks.includes(activeModalQuestion.id)
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <Bookmark size={14} className={bookmarks.includes(activeModalQuestion.id) ? 'fill-white' : ''} />
                  <span>{bookmarks.includes(activeModalQuestion.id) ? 'Saved' : 'Bookmark'}</span>
                </button>

                <button
                  onClick={() => handleRequestAiExplanation(activeModalQuestion)}
                  disabled={explanationLoading}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 border border-slate-200 text-purple-700 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles size={14} className="text-primary" />
                  <span>{explanationLoading ? 'AI Thinking...' : 'Ask AI Explainer'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLaunchPractice(activeModalQuestion)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <Play size={13} className="fill-white" />
                  <span>Practice in Mock Interview</span>
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
