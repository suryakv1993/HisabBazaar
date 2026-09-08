import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Snackbar: React.FC = () => {
  const { snackbar, hideSnackbar } = useApp();

  if (!snackbar) return null;

  const getIcon = () => {
    switch (snackbar.type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-400 shrink-0" />;
    }
  };

  return (
    <div 
      id="app-snackbar-toast"
      role="status"
      aria-live="polite"
      className="fixed bottom-20 left-4 right-4 max-w-[400px] mx-auto z-50 animate-bounce-subtle pointer-events-auto"
    >
      <div className="bg-slate-900/95 dark:bg-slate-800/95 text-white backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-slate-700/50 flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          {getIcon()}
          <span className="font-medium truncate">{snackbar.message}</span>
        </div>
        <button
          onClick={hideSnackbar}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
