import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X, 
  Trash2, 
  ShieldAlert, 
  Sparkles 
} from 'lucide-react';

const AlertContext = createContext(null);

const TOAST_ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Sparkles,
};

const TOAST_STYLES = {
  success: {
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    bar: 'bg-emerald-500',
    border: 'border-emerald-200/80',
    iconColor: 'text-emerald-600',
    glow: 'shadow-[0_10px_30px_rgba(16,185,129,0.15)]'
  },
  error: {
    badge: 'bg-red-100 text-red-700 border-red-200',
    bar: 'bg-red-500',
    border: 'border-red-200/80',
    iconColor: 'text-red-600',
    glow: 'shadow-[0_10px_30px_rgba(239,68,68,0.15)]'
  },
  warning: {
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    bar: 'bg-amber-500',
    border: 'border-amber-200/80',
    iconColor: 'text-amber-600',
    glow: 'shadow-[0_10px_30px_rgba(245,158,11,0.15)]'
  },
  info: {
    badge: 'bg-primary/10 text-primary border-primary/20',
    bar: 'bg-primary',
    border: 'border-primary/20',
    iconColor: 'text-primary',
    glow: 'shadow-[0_10px_30px_rgba(124,58,237,0.15)]'
  }
};

export const AlertProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const confirmResolveRef = useRef(null);

  // ── Toast System ──────────────────────────────────────────────
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((options) => {
    const id = Date.now() + Math.random();
    const type = options.type || 'info';
    const duration = options.duration !== undefined ? options.duration : 4500;
    const title = options.title || (
      type === 'success' ? 'Success' :
      type === 'error' ? 'Notice' :
      type === 'warning' ? 'Attention' : 'Update'
    );
    const message = typeof options === 'string' ? options : options.message;

    const newToast = {
      id,
      type,
      title,
      message,
      duration,
    };

    setToasts((prev) => [...prev.slice(-4), newToast]); // Keep at most 5 toasts stacked

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  const toast = {
    success: (message, title) => showToast({ type: 'success', message, title }),
    error: (message, title) => showToast({ type: 'error', message, title }),
    warning: (message, title) => showToast({ type: 'warning', message, title }),
    info: (message, title) => showToast({ type: 'info', message, title }),
  };

  // ── Confirm System ────────────────────────────────────────────
  const confirm = useCallback(({
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger' // 'danger' | 'warning' | 'info'
  }) => {
    return new Promise((resolve) => {
      confirmResolveRef.current = resolve;
      setConfirmDialog({
        title,
        message,
        confirmText,
        cancelText,
        type,
      });
    });
  }, []);

  const handleConfirmClose = (result) => {
    if (confirmResolveRef.current) {
      confirmResolveRef.current(result);
      confirmResolveRef.current = null;
    }
    setConfirmDialog(null);
  };

  return (
    <AlertContext.Provider value={{ showToast, toast, confirm }}>
      {children}

      {/* Floating Toasts Container (Top-Right) */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((item) => {
          const Icon = TOAST_ICONS[item.type] || Info;
          const style = TOAST_STYLES[item.type] || TOAST_STYLES.info;

          return (
            <div
              key={item.id}
              className={`pointer-events-auto w-full bg-white/95 backdrop-blur-md rounded-2xl border ${style.border} ${style.glow} p-3.5 shadow-xl transition-all duration-300 transform translate-y-0 opacity-100 animate-slideIn`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl shrink-0 ${style.badge}`}>
                  <Icon size={18} className={style.iconColor} />
                </div>

                <div className="flex-1 min-w-0 pr-1">
                  <h4 className="font-display font-bold text-xs text-midnight tracking-tight">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed break-words">
                    {item.message}
                  </p>
                </div>

                <button
                  onClick={() => removeToast(item.id)}
                  className="text-gray-400 hover:text-midnight p-1 rounded-lg hover:bg-cream-darker/20 transition-colors shrink-0 -mr-1 -mt-1"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Countdown Progress Bar */}
              {item.duration > 0 && (
                <div className="w-full h-1 bg-cream/80 rounded-full overflow-hidden mt-3">
                  <div
                    className={`h-full ${style.bar} opacity-70`}
                    style={{
                      animation: `shrinkWidth ${item.duration}ms linear forwards`,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Modal Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-cream-border/80 shadow-2xl relative animate-scaleUp">
            
            {/* Header with Icon */}
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                confirmDialog.type === 'danger'
                  ? 'bg-red-50 text-red-600 border border-red-100'
                  : confirmDialog.type === 'warning'
                  ? 'bg-amber-50 text-amber-600 border border-amber-100'
                  : 'bg-primary/10 text-primary border border-primary/20'
              }`}>
                {confirmDialog.type === 'danger' ? (
                  <Trash2 size={22} />
                ) : confirmDialog.type === 'warning' ? (
                  <AlertTriangle size={22} />
                ) : (
                  <ShieldAlert size={22} />
                )}
              </div>

              <div>
                <h3 className="font-display font-extrabold text-base text-midnight">
                  {confirmDialog.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {confirmDialog.message}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-cream-border/60">
              <button
                type="button"
                onClick={() => handleConfirmClose(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-cream-darker/20 transition-colors"
              >
                {confirmDialog.cancelText}
              </button>

              <button
                type="button"
                onClick={() => handleConfirmClose(true)}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-sm ${
                  confirmDialog.type === 'danger'
                    ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20'
                    : confirmDialog.type === 'warning'
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
                    : 'bg-primary hover:bg-primary-dark shadow-primary/20'
                }`}
              >
                {confirmDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return ctx;
};

export default AlertContext;
