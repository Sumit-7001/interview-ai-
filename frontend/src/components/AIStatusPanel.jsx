import React, { useState, useEffect, useCallback } from 'react';
import { Brain, Mic, Hash, Eye, Camera, RefreshCw } from 'lucide-react';
import API from '../services/api';

const STATUS_CONFIG = {
  available: { color: '#22c55e', label: 'Online', pulse: true },
  loading: { color: '#f59e0b', label: 'Loading', pulse: true },
  mock: { color: '#a855f7', label: 'Mock Mode', pulse: false },
  unavailable: { color: '#ef4444', label: 'Offline', pulse: false },
  checking: { color: '#6b7280', label: 'Checking...', pulse: true },
  unknown: { color: '#6b7280', label: 'Unknown', pulse: false },
};

const SERVICE_LABELS = [
  { key: 'llm', label: 'Interview LLM', sublabel: 'Qwen3-8B', Icon: Brain },
  { key: 'fallback_llm', label: 'Fallback LLM', sublabel: 'Qwen3-4B', Icon: Brain },
  { key: 'whisper', label: 'Speech Recognition', sublabel: 'Whisper-v3', Icon: Mic },
  { key: 'embedding', label: 'Semantic Engine', sublabel: 'BGE-small', Icon: Hash },
  { key: 'emotion_detection', label: 'Facial Expressions', sublabel: 'DeepFace', Icon: Camera },
  { key: 'eye_contact', label: 'Eye Contact', sublabel: 'OpenCV', Icon: Eye },
];

const StatusDot = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.unknown;
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      {cfg.pulse && (
        <span
          style={{
            position: 'absolute',
            inset: '-3px',
            borderRadius: '50%',
            backgroundColor: cfg.color,
            opacity: 0.3,
            animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
          }}
        />
      )}
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: cfg.color,
          display: 'inline-block',
          flexShrink: 0,
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

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get('/api/ai/health');
      const data = res.data;
      setMockMode(data.mock_mode || false);
      // Remove non-service keys
      const { mock_mode, note, ...serviceStatuses } = data;
      setStatuses(serviceStatuses);
      setLastChecked(new Date());
    } catch (err) {
      // If health check itself fails (e.g. server down), mark all as unavailable
      const fallback = {};
      SERVICE_LABELS.forEach(s => { fallback[s.key] = 'unavailable'; });
      setStatuses(fallback);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  if (compact) {
    // Compact row of dots for embedding in header/sidebar
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500, letterSpacing: '0.05em' }}>
          AI SERVICES
        </span>
        {SERVICE_LABELS.map(({ key }) => (
          <StatusDot key={key} status={statuses[key] || 'checking'} />
        ))}
      </div>
    );
  }

  const allOnline = Object.values(statuses).every(s => s === 'available' || s === 'mock');

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(13,13,17,0.95) 0%, rgba(20,15,35,0.95) 100%)',
        border: '1px solid rgba(124,58,237,0.25)',
        borderRadius: 16,
        padding: '20px 24px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Brain size={16} color="white" />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#f9fafb', margin: 0 }}>AI Services</p>
            {mockMode && (
              <p style={{ fontSize: 10, color: '#a855f7', margin: 0 }}>Mock Mode Active</p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Overall status badge */}
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: '3px 8px',
              borderRadius: 999,
              background: allOnline
                ? 'rgba(34,197,94,0.15)'
                : 'rgba(239,68,68,0.15)',
              color: allOnline ? '#22c55e' : '#ef4444',
              border: `1px solid ${allOnline ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
            }}
          >
            {loading ? 'Checking...' : allOnline ? 'All Systems Go' : 'Degraded'}
          </span>

          {/* Refresh button */}
          <button
            onClick={fetchStatus}
            disabled={loading}
            style={{
              background: 'rgba(124,58,237,0.15)',
              border: '1px solid rgba(124,58,237,0.3)',
              borderRadius: 8,
              padding: '4px 8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              color: '#a78bfa',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <RefreshCw
              size={12}
              style={{
                animation: loading ? 'spin 1s linear infinite' : 'none',
              }}
            />
          </button>
        </div>
      </div>

      {/* Service list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {SERVICE_LABELS.map(({ key, label, sublabel, Icon }) => {
          const status = loading ? 'checking' : (statuses[key] || 'unknown');
          const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.unknown;
          return (
            <div
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon size={14} color="#a78bfa" />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#f3f4f6', margin: 0 }}>{label}</p>
                  <p style={{ fontSize: 10, color: '#6b7280', margin: 0 }}>{sublabel}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <StatusDot status={status} />
                <span style={{ fontSize: 10, fontWeight: 600, color: cfg.color }}>{cfg.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Last checked */}
      {lastChecked && !loading && (
        <p style={{ fontSize: 10, color: '#4b5563', marginTop: 12, textAlign: 'right', margin: '12px 0 0 0' }}>
          Last checked: {lastChecked.toLocaleTimeString()}
        </p>
      )}

      {/* Disclaimer */}
      <p
        style={{
          fontSize: 9,
          color: '#374151',
          marginTop: 8,
          lineHeight: 1.4,
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: 8,
        }}
      >
        Facial expression signals are approximations for practice feedback only, not psychological assessments.
        Eye contact % is a computer-vision metric.
      </p>

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AIStatusPanel;
