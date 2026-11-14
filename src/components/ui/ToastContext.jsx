import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast Container */}
      <div 
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const typeClasses = {
            success: "bg-surface border-success/40 text-text",
            danger: "bg-surface border-danger/40 text-text",
            info: "bg-surface border-info/40 text-text"
          }[toast.type] || "bg-surface border-border text-text";

          const IconComp = {
            success: CheckCircle2,
            danger: AlertCircle,
            info: Info
          }[toast.type] || CheckCircle2;

          const iconColor = {
            success: "text-success",
            danger: "text-danger",
            info: "text-info"
          }[toast.type] || "text-primary";

          return (
            <div
              key={toast.id}
              className={`p-3.5 rounded-xl border shadow-lg flex items-center justify-between gap-3 pointer-events-auto transition-all animate-in fade-in slide-in-from-bottom-2 duration-200 ${typeClasses}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <IconComp className={`w-4 h-4 shrink-0 ${iconColor}`} aria-hidden="true" />
                <span className="text-xs sm:text-sm font-medium leading-snug">{toast.message}</span>
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                aria-label="বার্তাটি বন্ধ করুন"
                className="w-6 h-6 rounded flex items-center justify-center text-muted hover:text-text cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

