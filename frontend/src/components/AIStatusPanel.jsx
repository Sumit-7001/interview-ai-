import React, { useState, useEffect, useCallback } from 'react';
import { Brain, Mic, Hash, Eye, Camera, RefreshCw, ChevronDown, ChevronUp, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import API from '../services/api';

const STATUS_CONFIG = {
  available: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', label: 'Online', pulse: true },
  loading: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', label: 'Loading', pulse: true },
  mock: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.25)', label: 'Mock Mode', pulse: false },
  unavailable: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)', label: 'Offline', pulse: false },
  checking: { color: '#9ca3af', bg: 'rgba(156,163,175,0.1)', border: 'rgba(156,163,175,0.25)', label: 'Checking', pulse: true },
  unknown: { color: '#9ca3af', bg: 'rgba(156,163,175,0.1)', border: 'rgba(156,163,175,0.25)', label: 'Unknown', pulse: false },
};

const SERVICE_LABELS = [
  { key: 'llm', label: 'Interview LLM', shortLabel: 'LLM', sublabel: 'Qwen3-8B', Icon: Brain },
  { key: 'fallback_llm', label: 'Fallback LLM', shortLabel: 'Backup LLM', sublabel: 'Qwen3-4B', Icon: Brain },
  { key: 'whisper', label: 'Speech Recognition', shortLabel: 'Whisper STT', sublabel: 'Whisper-v3', Icon: Mic },
  { key: 'embedding', label: 'Semantic Engine', shortLabel: 'Embeddings', sublabel: 'BGE-small', Icon: Hash },
  { key: 'emotion_detection', label: 'Facial Expressions', shortLabel: 'Face Emotion', sublabel: 'DeepFace', Icon: Camera },
  { key: 'eye_contact', label: 'Eye Tracking', shortLabel: 'Eye Contact', sublabel: 'OpenCV Vision', Icon: Eye },
];

const StatusDot = ({ status, size = 6 }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.unknown;
  return (
    <span className="relative inline-flex items-center justify-center shrink-0">
      {cfg.pulse && (
        <span
          className="absolute rounded-full"
          style={{
            width: size * 2.2,
            height: size * 2.2,
            backgroundColor: cfg.color,
            opacity: 0.35,
            animation: 'aiPulse 2s cubic-bezier(0, 0, 0.2, 1) infinite',
          }}
        />
      )}
      <span
        className="rounded-full shrink-0"
        style={{
          width: size,
          height: size,
          backgroundColor: cfg.color,
        }}
      />
    </span>
  );
};

const AIStatusPanel = ({ compact = false }) => {
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState(null);
  const [mockMode, setMockMode] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get('/api/ai/health');
      const data = res.data;
      setMockMode(data.mock_mode || false);
      const { mock_mode, note, ...serviceStatuses } = data;
      setStatuses(serviceStatuses);
      setLastChecked(new Date());
    } catch (err) {
      const fallback = {};
      SERVICE_LABELS.forEach(s => { fallback[s.key] = 'unavailable'; });
      setStatuses(fallback);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-cream-border/60 text-xs">
        <Sparkles size={13} className="text-primary" />
        <span className="text-[11px] font-semibold text-gray-500">AI Services</span>
        <div className="flex items-center gap-1.5">
          {SERVICE_LABELS.slice(0, 4).map(({ key }) => (
            <StatusDot key={key} status={statuses[key] || 'checking'} size={6} />
          ))}
        </div>
      </div>
    );
  }

  const allOnline = Object.values(statuses).length > 0 && Object.values(statuses).every(s => s === 'available' || s === 'mock');
  const onlineCount = Object.values(statuses).filter(s => s === 'available' || s === 'mock').length;

  return (
    <div className="rounded-2xl border border-cream-border/80 bg-white/85 backdrop-blur-md shadow-sm transition-all duration-300">
      {/* Sleek Minimal Status Bar (Takes minimal vertical space: ~46px) */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left: AI Indicator & Summary */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-xs shrink-0">
            <Brain size={15} className="text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-midnight text-xs tracking-tight">AI Engines</span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-[11px] font-semibold text-emerald-700">
              <StatusDot status={loading ? 'checking' : allOnline ? 'available' : 'unavailable'} size={6} />
              <span>
                {loading ? 'Verifying...' : allOnline ? 'All Systems Live' : `${onlineCount}/6 Active`}
              </span>
            </div>
            {mockMode && (
              <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold">
                Mock Mode
              </span>
            )}
          </div>
        </div>

        {/* Center / Right: Compact service chips */}
        <div className="hidden sm:flex items-center gap-2 flex-wrap">
          {SERVICE_LABELS.slice(0, 4).map(({ key, shortLabel, Icon }) => {
            const status = loading ? 'checking' : (statuses[key] || 'unknown');
            const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.unknown;
            return (
              <div 
                key={key} 
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cream-darker/15 border border-cream-border/60 text-[11px] font-medium text-gray-600"
                title={`${shortLabel}: ${cfg.label}`}
              >
                <Icon size={12} className="text-primary/70" />
                <span>{shortLabel}</span>
                <StatusDot status={status} size={5} />
              </div>
            );
          })}
        </div>

        {/* Right Actions: Refresh & Expand Toggle */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={fetchStatus}
            disabled={loading}
            title="Refresh AI Service Status"
            className="p-1.5 rounded-lg hover:bg-cream-darker/20 text-gray-500 hover:text-midnight transition-colors disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin text-primary' : ''} />
          </button>

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-gray-500 hover:text-midnight hover:bg-cream-darker/20 transition-colors"
          >
            <span>{expanded ? 'Hide Details' : 'Details'}</span>
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {/* Expandable Details Drawer (Collapsible) */}
      {expanded && (
        <div className="border-t border-cream-border/60 px-4 py-3 bg-cream/30 rounded-b-2xl animate-fadeIn">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {SERVICE_LABELS.map(({ key, label, sublabel, Icon }) => {
              const status = loading ? 'checking' : (statuses[key] || 'unknown');
              const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.unknown;
              return (
                <div
                  key={key}
                  className="p-2.5 rounded-xl bg-white border border-cream-border/60 shadow-2xs flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Icon size={14} className="text-primary" />
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-midnight truncate">{label}</div>
                    <div className="text-[9px] text-gray-400 font-mono">{sublabel}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-2.5 pt-2 border-t border-cream-border/40 flex flex-wrap items-center justify-between gap-2 text-[10px] text-gray-400">
            <span>
              Facial expressions & eye contact are computer vision aids for mock interview posture.
            </span>
            {lastChecked && (
              <span>Last checked: {lastChecked.toLocaleTimeString()}</span>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes aiPulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default AIStatusPanel;
