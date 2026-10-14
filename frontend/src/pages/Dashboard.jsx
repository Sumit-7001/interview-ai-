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
  ChevronDown,
  Building2,
  Database,
  Layers,
  Search,
  X,
  BookOpen
} from 'lucide-react';
import { 
  TCSLogo, 
  WiproLogo, 
  InfosysLogo, 
  CapgeminiLogo, 
  AccentureLogo, 
  CognizantLogo,
  AmazonLogo,
  MicrosoftLogo,
  GoogleLogo,
  DeloitteLogo,
  HCLLogo,
  TechMahindraLogo,
  PythonIcon,
  JavaIcon,
  DSAIcon,
  DBMSIcon,
  OSIcon,
  OOPIcon,
  WebDevIcon,
  MLIcon,
  HRIcon,
  CloudIcon,
  SystemDesignIcon,
  NetworksIcon
} from '../components/CompanyDomainIcons';
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
    id: 'tcs',
    type: 'Technical',
    company_domain: 'TCS NQT / Digital',
    title: 'TCS NQT / Digital Track',
    desc: 'Core CS, Pseudocode, Memory Stack/Heap, DBMS, OOPs & HR round prep',
    icon: Code2,
    badge: 'TCS Special',
    accent: 'border-blue-200 hover:border-blue-500 text-blue-600 bg-gradient-to-br from-blue-50/70 to-white'
  },
  {
    id: 'capgemini',
    type: 'Technical',
    company_domain: 'Capgemini Technical',
    title: 'Capgemini Technical Track',
    desc: 'Pseudocode, Data Structures, OOPs 4 Pillars, Exception handling & Logic',
    icon: Brain,
    badge: 'Capgemini',
    accent: 'border-indigo-200 hover:border-indigo-500 text-indigo-600 bg-gradient-to-br from-indigo-50/70 to-white'
  },
  {
    id: 'fintech',
    type: 'Technical',
    company_domain: 'Banking & FinTech',
    title: 'Banking & FinTech Systems',
    desc: 'ACID transactions, Security, Microservices, Payment Gateways & Scalability',
    icon: Zap,
    badge: 'Banking/FinTech',
    accent: 'border-emerald-200 hover:border-emerald-500 text-emerald-600 bg-gradient-to-br from-emerald-50/70 to-white'
  },
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

const COMPANIES = [
  {
    id: 'tcs',
    name: 'TCS',
    fullName: 'Tata Consultancy Services',
    count: '300+ Q&A',
    Logo: TCSLogo,
    domain: 'TCS NQT / Digital',
    defaultRole: 'Software Engineer',
    category: 'Service-Based',
    tag: 'NQT & Digital',
    gradient: 'from-rose-500/[0.09] via-purple-500/[0.04] to-blue-500/[0.08]',
    hoverGradient: 'group-hover:from-rose-500/[0.15] group-hover:to-blue-500/[0.15]',
    border: 'border-rose-200/80 hover:border-rose-400',
    badgeBg: 'bg-rose-100 text-rose-700 border-rose-200/70',
    topBar: 'from-rose-500 via-pink-500 to-blue-600',
    glow: 'hover:shadow-rose-500/15',
    btnGradient: 'from-rose-500 to-blue-600'
  },
  {
    id: 'wipro',
    name: 'Wipro',
    fullName: 'Wipro Technologies',
    count: '250+ Q&A',
    Logo: WiproLogo,
    domain: 'Wipro Elite & Turbo',
    defaultRole: 'Software Engineer',
    category: 'Service-Based',
    tag: 'Elite & Turbo',
    gradient: 'from-emerald-500/[0.09] via-amber-500/[0.04] to-cyan-500/[0.08]',
    hoverGradient: 'group-hover:from-emerald-500/[0.15] group-hover:to-cyan-500/[0.15]',
    border: 'border-emerald-200/80 hover:border-emerald-400',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200/70',
    topBar: 'from-emerald-500 via-amber-500 to-cyan-500',
    glow: 'hover:shadow-emerald-500/15',
    btnGradient: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'infosys',
    name: 'Infosys',
    fullName: 'Infosys Limited',
    count: '250+ Q&A',
    Logo: InfosysLogo,
    domain: 'Infosys DSE / Specialist',
    defaultRole: 'Software Engineer',
    category: 'Service-Based',
    tag: 'DSE & Specialist',
    gradient: 'from-sky-500/[0.09] via-blue-500/[0.04] to-indigo-500/[0.08]',
    hoverGradient: 'group-hover:from-sky-500/[0.15] group-hover:to-indigo-500/[0.15]',
    border: 'border-sky-200/80 hover:border-sky-400',
    badgeBg: 'bg-sky-100 text-sky-800 border-sky-200/70',
    topBar: 'from-sky-400 via-blue-500 to-indigo-600',
    glow: 'hover:shadow-sky-500/15',
    btnGradient: 'from-sky-500 to-blue-600'
  },
  {
    id: 'capgemini',
    name: 'Capgemini',
    fullName: 'Capgemini Technology Services',
    count: '200+ Q&A',
    Logo: CapgeminiLogo,
    domain: 'Capgemini Technical',
    defaultRole: 'Software Engineer',
    category: 'Service-Based',
    tag: 'Technical Track',
    gradient: 'from-cyan-500/[0.09] via-blue-500/[0.04] to-slate-500/[0.08]',
    hoverGradient: 'group-hover:from-cyan-500/[0.15] group-hover:to-blue-500/[0.15]',
    border: 'border-cyan-200/80 hover:border-cyan-400',
    badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-200/70',
    topBar: 'from-cyan-400 via-teal-500 to-blue-600',
    glow: 'hover:shadow-cyan-500/15',
    btnGradient: 'from-cyan-500 to-teal-600'
  },
  {
    id: 'accenture',
    name: 'Accenture',
    fullName: 'Accenture Solutions',
    count: '250+ Q&A',
    Logo: AccentureLogo,
    domain: 'Accenture Cognitive & Technical',
    defaultRole: 'Software Engineer',
    category: 'Consulting',
    tag: 'Cognitive & Tech',
    gradient: 'from-purple-500/[0.09] via-violet-500/[0.04] to-fuchsia-500/[0.08]',
    hoverGradient: 'group-hover:from-purple-500/[0.15] group-hover:to-fuchsia-500/[0.15]',
    border: 'border-purple-200/80 hover:border-purple-400',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200/70',
    topBar: 'from-purple-500 via-violet-500 to-fuchsia-500',
    glow: 'hover:shadow-purple-500/15',
    btnGradient: 'from-purple-600 to-fuchsia-600'
  },
  {
    id: 'cognizant',
    name: 'Cognizant',
    fullName: 'Cognizant Technology Solutions',
    count: '250+ Q&A',
    Logo: CognizantLogo,
    domain: 'Cognizant GenC & GenC Next',
    defaultRole: 'Software Engineer',
    category: 'Service-Based',
    tag: 'GenC Next Track',
    gradient: 'from-blue-500/[0.09] via-indigo-500/[0.04] to-teal-500/[0.08]',
    hoverGradient: 'group-hover:from-blue-500/[0.15] group-hover:to-teal-500/[0.15]',
    border: 'border-blue-200/80 hover:border-blue-400',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-200/70',
    topBar: 'from-blue-600 via-indigo-600 to-teal-500',
    glow: 'hover:shadow-blue-500/15',
    btnGradient: 'from-blue-600 to-indigo-600'
  },
];

const ALL_COMPANIES = [
  ...COMPANIES,
  {
    id: 'amazon',
    name: 'Amazon',
    fullName: 'Amazon Web Services / Retail',
    count: '450+ Q&A',
    Logo: AmazonLogo,
    domain: 'Amazon SDE Track',
    defaultRole: 'Software Engineer',
    category: 'Product-Based',
    tag: 'Leadership & SDE',
    gradient: 'from-amber-500/[0.09] via-orange-500/[0.04] to-slate-500/[0.08]',
    hoverGradient: 'group-hover:from-amber-500/[0.15] group-hover:to-orange-500/[0.15]',
    border: 'border-amber-200/80 hover:border-amber-400',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-200/70',
    topBar: 'from-amber-500 to-orange-500',
    glow: 'hover:shadow-amber-500/15',
    btnGradient: 'from-amber-500 to-orange-600'
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    fullName: 'Microsoft Corporation',
    count: '400+ Q&A',
    Logo: MicrosoftLogo,
    domain: 'Microsoft Software Engineer',
    defaultRole: 'Software Engineer',
    category: 'Product-Based',
    tag: 'Systems & SWE',
    gradient: 'from-blue-500/[0.09] via-emerald-500/[0.04] to-rose-500/[0.08]',
    hoverGradient: 'group-hover:from-blue-500/[0.15] group-hover:to-rose-500/[0.15]',
    border: 'border-blue-200/80 hover:border-blue-400',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-200/70',
    topBar: 'from-blue-500 via-emerald-500 to-rose-500',
    glow: 'hover:shadow-blue-500/15',
    btnGradient: 'from-blue-500 to-emerald-600'
  },
  {
    id: 'google',
    name: 'Google',
    fullName: 'Google / Alphabet',
    count: '450+ Q&A',
    Logo: GoogleLogo,
    domain: 'Google SWE Track',
    defaultRole: 'Software Engineer',
    category: 'Product-Based',
    tag: 'DSA & Scalability',
    gradient: 'from-red-500/[0.09] via-amber-500/[0.04] to-emerald-500/[0.08]',
    hoverGradient: 'group-hover:from-red-500/[0.15] group-hover:to-blue-500/[0.15]',
    border: 'border-red-200/80 hover:border-red-400',
    badgeBg: 'bg-red-100 text-red-800 border-red-200/70',
    topBar: 'from-blue-500 via-red-500 to-amber-500',
    glow: 'hover:shadow-red-500/15',
    btnGradient: 'from-blue-500 to-emerald-500'
  },
  {
    id: 'deloitte',
    name: 'Deloitte',
    fullName: 'Deloitte USI / Consulting',
    count: '220+ Q&A',
    Logo: DeloitteLogo,
    domain: 'Deloitte Tech Analyst',
    defaultRole: 'Software Engineer',
    category: 'Consulting',
    tag: 'Tech Advisory',
    gradient: 'from-lime-500/[0.09] via-emerald-500/[0.04] to-slate-500/[0.08]',
    hoverGradient: 'group-hover:from-lime-500/[0.15] group-hover:to-emerald-500/[0.15]',
    border: 'border-lime-200/80 hover:border-lime-400',
    badgeBg: 'bg-lime-100 text-lime-800 border-lime-200/70',
    topBar: 'from-lime-500 to-emerald-600',
    glow: 'hover:shadow-lime-500/15',
    btnGradient: 'from-lime-600 to-emerald-600'
  },
  {
    id: 'hcl',
    name: 'HCLTech',
    fullName: 'HCL Technologies',
    count: '200+ Q&A',
    Logo: HCLLogo,
    domain: 'HCL Software Engineer',
    defaultRole: 'Software Engineer',
    category: 'Service-Based',
    tag: 'Engineering Track',
    gradient: 'from-cyan-500/[0.09] via-blue-500/[0.04] to-indigo-500/[0.08]',
    hoverGradient: 'group-hover:from-cyan-500/[0.15] group-hover:to-indigo-500/[0.15]',
    border: 'border-cyan-200/80 hover:border-cyan-400',
    badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-200/70',
    topBar: 'from-cyan-500 to-blue-600',
    glow: 'hover:shadow-cyan-500/15',
    btnGradient: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'techm',
    name: 'Tech Mahindra',
    fullName: 'Tech Mahindra Ltd',
    count: '200+ Q&A',
    Logo: TechMahindraLogo,
    domain: 'Tech Mahindra Tech Track',
    defaultRole: 'Software Engineer',
    category: 'Service-Based',
    tag: 'Digital Core',
    gradient: 'from-rose-500/[0.09] via-red-500/[0.04] to-slate-500/[0.08]',
    hoverGradient: 'group-hover:from-rose-500/[0.15] group-hover:to-red-500/[0.15]',
    border: 'border-rose-200/80 hover:border-rose-400',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-200/70',
    topBar: 'from-rose-500 to-red-600',
    glow: 'hover:shadow-rose-500/15',
    btnGradient: 'from-rose-500 to-red-600'
  },
];

const DOMAINS = [
  {
    id: 'python',
    name: 'Python',
    subtitle: 'Core & Scripts',
    count: '400+ Q&A',
    Icon: PythonIcon,
    domain: 'Python',
    defaultRole: 'Python Developer',
    interviewType: 'Technical',
    gradient: 'from-blue-500/[0.09] via-sky-500/[0.04] to-amber-500/[0.08]',
    hoverGradient: 'group-hover:from-blue-500/[0.15] group-hover:to-amber-500/[0.15]',
    border: 'border-blue-200/80 hover:border-blue-400',
    topBar: 'from-blue-500 via-sky-400 to-amber-400',
    glow: 'hover:shadow-blue-500/15',
    badgeBg: 'bg-blue-100 text-blue-700 border-blue-200/70',
    iconBorder: 'border-blue-100',
    btnGradient: 'from-blue-500 to-amber-500'
  },
  {
    id: 'java',
    name: 'Java',
    subtitle: 'OOP & JVM Arch',
    count: '350+ Q&A',
    Icon: JavaIcon,
    domain: 'Java',
    defaultRole: 'Software Engineer',
    interviewType: 'Technical',
    gradient: 'from-red-500/[0.09] via-orange-500/[0.04] to-rose-500/[0.08]',
    hoverGradient: 'group-hover:from-red-500/[0.15] group-hover:to-rose-500/[0.15]',
    border: 'border-red-200/80 hover:border-red-400',
    topBar: 'from-red-500 via-orange-400 to-rose-500',
    glow: 'hover:shadow-red-500/15',
    badgeBg: 'bg-red-100 text-red-700 border-red-200/70',
    iconBorder: 'border-red-100',
    btnGradient: 'from-red-500 to-orange-500'
  },
  {
    id: 'dsa',
    name: 'DSA',
    subtitle: 'Algorithms & Tree',
    count: '500+ Q&A',
    Icon: DSAIcon,
    domain: 'DSA',
    defaultRole: 'Software Engineer',
    interviewType: 'Technical',
    gradient: 'from-emerald-500/[0.09] via-teal-500/[0.04] to-green-500/[0.08]',
    hoverGradient: 'group-hover:from-emerald-500/[0.15] group-hover:to-green-500/[0.15]',
    border: 'border-emerald-200/80 hover:border-emerald-400',
    topBar: 'from-emerald-400 via-teal-500 to-green-600',
    glow: 'hover:shadow-emerald-500/15',
    badgeBg: 'bg-emerald-100 text-emerald-700 border-emerald-200/70',
    iconBorder: 'border-emerald-100',
    btnGradient: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'dbms',
    name: 'DBMS',
    subtitle: 'SQL & Indexing',
    count: '300+ Q&A',
    Icon: DBMSIcon,
    domain: 'DBMS',
    defaultRole: 'Software Engineer',
    interviewType: 'Technical',
    gradient: 'from-pink-500/[0.09] via-rose-500/[0.04] to-purple-500/[0.08]',
    hoverGradient: 'group-hover:from-pink-500/[0.15] group-hover:to-purple-500/[0.15]',
    border: 'border-pink-200/80 hover:border-pink-400',
    topBar: 'from-pink-500 via-rose-400 to-purple-500',
    glow: 'hover:shadow-pink-500/15',
    badgeBg: 'bg-pink-100 text-pink-700 border-pink-200/70',
    iconBorder: 'border-pink-100',
    btnGradient: 'from-pink-500 to-rose-600'
  },
  {
    id: 'os',
    name: 'Operating Systems',
    subtitle: 'Threads & Memory',
    count: '300+ Q&A',
    Icon: OSIcon,
    domain: 'Operating Systems',
    defaultRole: 'Software Engineer',
    interviewType: 'Technical',
    gradient: 'from-purple-500/[0.09] via-violet-500/[0.04] to-indigo-500/[0.08]',
    hoverGradient: 'group-hover:from-purple-500/[0.15] group-hover:to-indigo-500/[0.15]',
    border: 'border-purple-200/80 hover:border-purple-400',
    topBar: 'from-purple-500 via-violet-400 to-indigo-600',
    glow: 'hover:shadow-purple-500/15',
    badgeBg: 'bg-purple-100 text-purple-700 border-purple-200/70',
    iconBorder: 'border-purple-100',
    btnGradient: 'from-purple-500 to-violet-600'
  },
  {
    id: 'oop',
    name: 'OOP',
    subtitle: '4 Pillars & SOLID',
    count: '250+ Q&A',
    Icon: OOPIcon,
    domain: 'OOP',
    defaultRole: 'Software Engineer',
    interviewType: 'Technical',
    gradient: 'from-amber-500/[0.09] via-yellow-500/[0.04] to-orange-500/[0.08]',
    hoverGradient: 'group-hover:from-amber-500/[0.15] group-hover:to-orange-500/[0.15]',
    border: 'border-amber-200/80 hover:border-amber-400',
    topBar: 'from-amber-400 via-yellow-500 to-orange-500',
    glow: 'hover:shadow-amber-500/15',
    badgeBg: 'bg-amber-100 text-amber-700 border-amber-200/70',
    iconBorder: 'border-amber-100',
    btnGradient: 'from-amber-500 to-orange-600'
  },
  {
    id: 'web',
    name: 'Web Development',
    subtitle: 'React, Node & API',
    count: '300+ Q&A',
    Icon: WebDevIcon,
    domain: 'Web Development',
    defaultRole: 'Full Stack Developer',
    interviewType: 'Technical',
    gradient: 'from-cyan-500/[0.09] via-sky-500/[0.04] to-blue-500/[0.08]',
    hoverGradient: 'group-hover:from-cyan-500/[0.15] group-hover:to-blue-500/[0.15]',
    border: 'border-cyan-200/80 hover:border-cyan-400',
    topBar: 'from-cyan-400 via-sky-500 to-blue-600',
    glow: 'hover:shadow-cyan-500/15',
    badgeBg: 'bg-cyan-100 text-cyan-700 border-cyan-200/70',
    iconBorder: 'border-cyan-100',
    btnGradient: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'ml',
    name: 'Machine Learning',
    subtitle: 'Neural Nets & AI',
    count: '300+ Q&A',
    Icon: MLIcon,
    domain: 'Machine Learning',
    defaultRole: 'Machine Learning Engineer',
    interviewType: 'Technical',
    gradient: 'from-fuchsia-500/[0.09] via-pink-500/[0.04] to-purple-500/[0.08]',
    hoverGradient: 'group-hover:from-fuchsia-500/[0.15] group-hover:to-purple-500/[0.15]',
    border: 'border-fuchsia-200/80 hover:border-fuchsia-400',
    topBar: 'from-fuchsia-500 via-pink-400 to-purple-600',
    glow: 'hover:shadow-fuchsia-500/15',
    badgeBg: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200/70',
    iconBorder: 'border-fuchsia-100',
    btnGradient: 'from-fuchsia-500 to-purple-600'
  },
  {
    id: 'hr',
    name: 'HR & Behavioral',
    subtitle: 'STAR Leadership',
    count: '250+ Q&A',
    Icon: HRIcon,
    domain: 'HR & Behavioral',
    defaultRole: 'Software Engineer',
    interviewType: 'Behavioral',
    gradient: 'from-indigo-500/[0.09] via-violet-500/[0.04] to-blue-500/[0.08]',
    hoverGradient: 'group-hover:from-indigo-500/[0.15] group-hover:to-blue-500/[0.15]',
    border: 'border-indigo-200/80 hover:border-indigo-400',
    topBar: 'from-indigo-500 via-violet-400 to-blue-600',
    glow: 'hover:shadow-indigo-500/15',
    badgeBg: 'bg-indigo-100 text-indigo-700 border-indigo-200/70',
    iconBorder: 'border-indigo-100',
    btnGradient: 'from-indigo-500 to-violet-600'
  },
];

const ALL_DOMAINS = [
  ...DOMAINS,
  {
    id: 'cloud',
    name: 'Cloud & DevOps',
    subtitle: 'Docker, CI/CD & AWS',
    count: '320+ Q&A',
    Icon: CloudIcon,
    domain: 'Cloud & DevOps',
    defaultRole: 'DevOps Engineer',
    interviewType: 'Technical',
    gradient: 'from-sky-500/[0.09] via-cyan-500/[0.04] to-blue-500/[0.08]',
    hoverGradient: 'group-hover:from-sky-500/[0.15] group-hover:to-blue-500/[0.15]',
    border: 'border-sky-200/80 hover:border-sky-400',
    topBar: 'from-sky-400 via-cyan-500 to-blue-600',
    glow: 'hover:shadow-sky-500/15',
    badgeBg: 'bg-sky-100 text-sky-700 border-sky-200/70',
    iconBorder: 'border-sky-100',
    btnGradient: 'from-sky-500 to-cyan-600'
  },
  {
    id: 'systemdesign',
    name: 'System Design',
    subtitle: 'Scalability & Microservices',
    count: '350+ Q&A',
    Icon: SystemDesignIcon,
    domain: 'System Design',
    defaultRole: 'Software Engineer',
    interviewType: 'Technical',
    gradient: 'from-violet-500/[0.09] via-purple-500/[0.04] to-indigo-500/[0.08]',
    hoverGradient: 'group-hover:from-violet-500/[0.15] group-hover:to-indigo-500/[0.15]',
    border: 'border-violet-200/80 hover:border-violet-400',
    topBar: 'from-violet-500 via-purple-400 to-indigo-600',
    glow: 'hover:shadow-violet-500/15',
    badgeBg: 'bg-violet-100 text-violet-700 border-violet-200/70',
    iconBorder: 'border-violet-100',
    btnGradient: 'from-violet-500 to-indigo-600'
  },
  {
    id: 'networks',
    name: 'Computer Networks',
    subtitle: 'TCP/IP, HTTP & Sockets',
    count: '250+ Q&A',
    Icon: NetworksIcon,
    domain: 'Computer Networks',
    defaultRole: 'Software Engineer',
    interviewType: 'Technical',
    gradient: 'from-teal-500/[0.09] via-emerald-500/[0.04] to-cyan-500/[0.08]',
    hoverGradient: 'group-hover:from-teal-500/[0.15] group-hover:to-cyan-500/[0.15]',
    border: 'border-teal-200/80 hover:border-teal-400',
    topBar: 'from-teal-400 via-emerald-500 to-cyan-600',
    glow: 'hover:shadow-teal-500/15',
    badgeBg: 'bg-teal-100 text-teal-700 border-teal-200/70',
    iconBorder: 'border-teal-100',
    btnGradient: 'from-teal-500 to-emerald-600'
  },
];

const QUICK_PRESETS = [
  { label: '🏢 TCS (NQT/Digital)', role: 'Software Engineer', level: 'Entry', type: 'Technical', domain: 'TCS NQT / Digital' },
  { label: '🌈 Wipro (Elite/Turbo)', role: 'Software Engineer', level: 'Entry', type: 'Technical', domain: 'Wipro Elite & Turbo' },
  { label: '🔷 Infosys (DSE)', role: 'Software Engineer', level: 'Entry', type: 'Technical', domain: 'Infosys DSE / Specialist' },
  { label: '♠️ Capgemini Technical', role: 'Software Engineer', level: 'Entry', type: 'Technical', domain: 'Capgemini Technical' },
  { label: '⚡ Accenture Assessment', role: 'Software Engineer', level: 'Entry', type: 'Technical', domain: 'Accenture Cognitive & Technical' },
  { label: '🌐 Cognizant (GenC)', role: 'Software Engineer', level: 'Entry', type: 'Technical', domain: 'Cognizant GenC & GenC Next' },
  { label: '🌳 DSA Mastery', role: 'Software Engineer', level: 'Entry', type: 'Technical', domain: 'DSA' },
  { label: '🐍 Python Specialist', role: 'Python Developer', level: 'Entry', type: 'Technical', domain: 'Python' },
  { label: '☕ Java Architecture', role: 'Software Engineer', level: 'Entry', type: 'Technical', domain: 'Java' },
  { label: '👥 Behavioral (STAR)', role: 'Software Engineer', level: 'Mid', type: 'Behavioral', domain: 'HR & Behavioral' },
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
  const [companyDomain, setCompanyDomain] = useState('');
  const [creatingSession, setCreatingSession] = useState(false);

  // Explorer Modals State
  const [isAllCompaniesOpen, setIsAllCompaniesOpen] = useState(false);
  const [isAllDomainsOpen, setIsAllDomainsOpen] = useState(false);
  const [companySearch, setCompanySearch] = useState('');
  const [domainSearch, setDomainSearch] = useState('');

  const navigate = useNavigate();

  const handleLaunchCompany = (comp) => {
    setRole(comp.defaultRole || 'Software Engineer');
    setExperienceLevel('Entry');
    setInterviewType('Technical');
    setCompanyDomain(comp.domain);
    setIsModalOpen(true);
    if (isAllCompaniesOpen) setIsAllCompaniesOpen(false);
  };

  const handleLaunchDomain = (dom) => {
    setRole(dom.defaultRole || 'Software Engineer');
    setExperienceLevel('Entry');
    setInterviewType(dom.interviewType || 'Technical');
    setCompanyDomain(dom.domain);
    setIsModalOpen(true);
    if (isAllDomainsOpen) setIsAllDomainsOpen(false);
  };

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
        interview_type: interviewType,
        company_domain: companyDomain || undefined
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
    setCompanyDomain(preset.domain || '');
  };

  const handleQuickLaunch = (type, domain = '') => {
    setInterviewType(type);
    setCompanyDomain(domain);
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
                {QUICK_TRACKS.slice(0, 4).map((track) => {
                  const Icon = track.icon;
                  const isResumeDisabled = track.requiresResume && !resume;
                  return (
                    <div
                      key={track.id}
                      onClick={() => {
                        if (isResumeDisabled) {
                          navigate('/resume');
                        } else {
                          handleQuickLaunch(track.type, track.company_domain);
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

            {/* 2. Practice by Company Section */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Building2 size={13} />
                  </div>
                  <div>
                    <h2 className="font-display font-extrabold text-sm text-midnight flex items-center gap-2">
                      <span>Practice by Company</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100/90 text-purple-700 border border-purple-200/70 hidden sm:inline-block">
                        Campus & Off-Campus Hiring
                      </span>
                    </h2>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link 
                    to="/question-bank"
                    className="text-xs text-indigo-700 font-extrabold hover:text-indigo-900 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/70 transition-all group shadow-2xs"
                  >
                    <BookOpen size={12} className="text-indigo-600" />
                    <span>Question Bank</span>
                    <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <button 
                    onClick={() => setIsAllCompaniesOpen(true)}
                    className="text-xs text-primary font-extrabold hover:text-primary-dark flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-primary/5 transition-all group"
                  >
                    <span>View all companies</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                {COMPANIES.map((company) => {
                  const Logo = company.Logo;
                  return (
                    <div
                      key={company.id}
                      onClick={() => handleLaunchCompany(company)}
                      className={`relative overflow-hidden p-3.5 rounded-2xl border ${company.border} bg-gradient-to-br ${company.gradient} ${company.hoverGradient} bg-white shadow-2xs hover:shadow-xl ${company.glow} hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between group`}
                    >
                      {/* Top luminous brand gradient accent line */}
                      <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${company.topBar}`} />

                      <div>
                        {/* Header: Tag + Category */}
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border shadow-2xs leading-none ${company.badgeBg}`}>
                            {company.tag}
                          </span>
                          <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">
                            {company.category === 'Service-Based' ? 'Service' : company.category}
                          </span>
                        </div>

                        {/* Elevated Glossy Logo Dock */}
                        <div className="h-11 w-full bg-white/95 rounded-xl border border-white/80 shadow-xs flex items-center justify-center p-2 mb-2.5 group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                          <Logo className="max-h-7 max-w-[95px] w-auto" />
                        </div>

                        <h3 className="font-display font-extrabold text-xs md:text-sm text-midnight group-hover:text-primary transition-colors leading-tight">
                          {company.name}
                        </h3>
                        <p className="text-[10.5px] text-gray-500 mt-0.5 line-clamp-1 leading-snug">
                          {company.fullName}
                        </p>
                      </div>

                      {/* Footer: Q&A Count Pill + Interactive Action Button */}
                      <div className="mt-3 pt-2 border-t border-black/[0.06] flex items-center justify-between">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${company.badgeBg}`}>
                          {company.count}
                        </span>
                        <div className={`w-6 h-6 rounded-lg bg-white/90 text-gray-500 group-hover:bg-gradient-to-r ${company.btnGradient} group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:scale-110 group-hover:shadow-sm`}>
                          <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Practice by Domain Section */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <Database size={13} />
                  </div>
                  <div>
                    <h2 className="font-display font-extrabold text-sm text-midnight flex items-center gap-2">
                      <span>Practice by Domain</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100/90 text-cyan-700 border border-cyan-200/70 hidden sm:inline-block">
                        Core CS & Tech Stacks
                      </span>
                    </h2>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAllDomainsOpen(true)}
                  className="text-xs text-primary font-extrabold hover:text-primary-dark flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-primary/5 transition-all group"
                >
                  <span>View all domains</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-9 gap-2.5">
                {DOMAINS.map((dom) => {
                  const Icon = dom.Icon;
                  return (
                    <div
                      key={dom.id}
                      onClick={() => handleLaunchDomain(dom)}
                      className={`relative overflow-hidden p-3 rounded-2xl border ${dom.border} bg-gradient-to-br ${dom.gradient} ${dom.hoverGradient} bg-white shadow-2xs hover:shadow-xl ${dom.glow} hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between group`}
                    >
                      {/* Top luminous accent line */}
                      <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${dom.topBar}`} />

                      <div>
                        {/* Elevated Icon pedestal with soft rotation on hover */}
                        <div className={`w-9 h-9 rounded-xl bg-white shadow-xs border ${dom.iconBorder} flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-md transition-all duration-300`}>
                          <Icon className="w-5 h-5" />
                        </div>

                        <h3 className="font-display font-extrabold text-[12px] text-midnight group-hover:text-primary transition-colors leading-tight line-clamp-1">
                          {dom.name}
                        </h3>
                        <p className="text-[9.5px] text-gray-500 mt-0.5 line-clamp-1 font-medium leading-snug">
                          {dom.subtitle}
                        </p>
                      </div>

                      {/* Footer: Q&A count pill + arrow button */}
                      <div className="mt-2.5 pt-2 border-t border-black/[0.06] flex items-center justify-between">
                        <span className={`text-[9.5px] font-extrabold px-1.5 py-0.5 rounded ${dom.badgeBg}`}>
                          {dom.count}
                        </span>
                        <div className={`w-5 h-5 rounded-full bg-white/90 text-gray-400 group-hover:bg-gradient-to-r ${dom.btnGradient} group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:scale-110`}>
                          <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Balanced 2-Column: History Table (8 cols) & Resume ATS (4 cols) */}
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

            {/* Company / Industry Domain Track */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">Company / Industry Domain</label>
              <select
                value={companyDomain}
                onChange={(e) => setCompanyDomain(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs bg-white font-medium text-midnight"
              >
                <option value="">General / Standard Technical</option>
                <optgroup label="🏢 Practice by Company">
                  <option value="TCS NQT / Digital">TCS (NQT & Digital Technical Track)</option>
                  <option value="Wipro Elite & Turbo">Wipro (Elite & Turbo NLTH Round)</option>
                  <option value="Infosys DSE / Specialist">Infosys (DSE & Specialist Programmer)</option>
                  <option value="Capgemini Technical">Capgemini (Technical & Pseudo-code Round)</option>
                  <option value="Accenture Cognitive & Technical">Accenture (Cognitive & Technical Assessment)</option>
                  <option value="Cognizant GenC & GenC Next">Cognizant (GenC & GenC Next Technical)</option>
                </optgroup>
                <optgroup label="🗄️ Practice by Domain">
                  <option value="Python">Python Core & Frameworks</option>
                  <option value="Java">Java & JVM Architecture</option>
                  <option value="DSA">Data Structures & Algorithms (DSA)</option>
                  <option value="DBMS">Database Management Systems (DBMS & SQL)</option>
                  <option value="Operating Systems">Operating Systems & Concurrency</option>
                  <option value="OOP">Object-Oriented Programming (OOPs Principles)</option>
                  <option value="Web Development">Web Development & Full Stack</option>
                  <option value="Machine Learning">Machine Learning & AI Engineering</option>
                  <option value="HR & Behavioral">HR & Behavioral Leadership (STAR Method)</option>
                  <option value="Banking & FinTech">Banking & FinTech Systems (ACID, Microservices)</option>
                  <option value="Cloud & DevOps">Cloud & DevOps (Kubernetes, IaC, CI/CD)</option>
                </optgroup>
              </select>
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

      {/* Explorer Modal: All Companies */}
      <Modal isOpen={isAllCompaniesOpen} onClose={() => setIsAllCompaniesOpen(false)} title="Explore All Companies">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search company (e.g. TCS, Amazon, Infosys)..."
              value={companySearch}
              onChange={(e) => setCompanySearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-cream-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto p-1">
            {ALL_COMPANIES.filter(c => 
              c.name.toLowerCase().includes(companySearch.toLowerCase()) || 
              c.fullName.toLowerCase().includes(companySearch.toLowerCase())
            ).map((comp) => {
              const CompLogo = comp.Logo;
              return (
                <div 
                  key={comp.id} 
                  onClick={() => handleLaunchCompany(comp)}
                  className={`relative overflow-hidden p-3.5 rounded-2xl border ${comp.border || 'border-cream-border'} bg-gradient-to-br ${comp.gradient || 'from-cream/40 to-white'} bg-white shadow-2xs hover:shadow-lg ${comp.glow || ''} hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group`}
                >
                  {comp.topBar && <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${comp.topBar}`} />}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md border shadow-2xs ${comp.badgeBg || 'bg-cream text-gray-700'}`}>
                        {comp.tag || comp.name}
                      </span>
                      <span className="text-[9px] font-semibold text-gray-400 uppercase">
                        {comp.category || 'Tech'}
                      </span>
                    </div>
                    {CompLogo && (
                      <div className="h-10 w-full bg-white/95 rounded-xl border border-white/80 shadow-xs flex items-center justify-center p-1.5 mb-2 group-hover:scale-105 transition-transform">
                        <CompLogo className="max-h-6 max-w-[90px] w-auto" />
                      </div>
                    )}
                    <h4 className="font-display font-extrabold text-xs text-midnight group-hover:text-primary transition-colors">
                      {comp.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{comp.fullName}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-black/[0.06] flex items-center justify-between text-[11px] font-medium">
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${comp.badgeBg || 'bg-cream text-gray-700'}`}>
                      {comp.count}
                    </span>
                    <span className="text-primary font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1 text-[11px]">
                      <span>Practice</span>
                      <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>

      {/* Explorer Modal: All Domains */}
      <Modal isOpen={isAllDomainsOpen} onClose={() => setIsAllDomainsOpen(false)} title="Explore All Technical Domains">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search domain (e.g. Python, DSA, Machine Learning)..."
              value={domainSearch}
              onChange={(e) => setDomainSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-cream-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto p-1">
            {ALL_DOMAINS.filter(d => 
              d.name.toLowerCase().includes(domainSearch.toLowerCase())
            ).map((dom) => {
              const DomIcon = dom.Icon;
              return (
                <div 
                  key={dom.id} 
                  onClick={() => handleLaunchDomain(dom)}
                  className={`relative overflow-hidden p-3.5 rounded-2xl border ${dom.border || 'border-cream-border'} bg-gradient-to-br ${dom.gradient || 'from-cream/40 to-white'} bg-white shadow-2xs hover:shadow-lg ${dom.glow || ''} hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group`}
                >
                  {dom.topBar && <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${dom.topBar}`} />}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md border shadow-2xs ${dom.badgeBg || 'bg-cream text-gray-700'}`}>
                        {dom.subtitle || dom.name}
                      </span>
                      <span className="text-[9px] font-semibold text-gray-400">
                        {dom.interviewType || 'Technical'}
                      </span>
                    </div>
                    {DomIcon && (
                      <div className={`w-8 h-8 rounded-xl bg-white shadow-xs border ${dom.iconBorder || 'border-cream-border'} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                        <DomIcon className="w-4.5 h-4.5" />
                      </div>
                    )}
                    <h4 className="font-display font-extrabold text-xs text-midnight group-hover:text-primary transition-colors">
                      {dom.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">Mock interview questions & live AI coding</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-black/[0.06] flex items-center justify-between text-[11px] font-medium">
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${dom.badgeBg || 'bg-cream text-gray-700'}`}>
                      {dom.count}
                    </span>
                    <span className="text-primary font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1 text-[11px]">
                      <span>Practice</span>
                      <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
