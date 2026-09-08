import React from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NativeAdBanner: React.FC = () => {
  const { settings, navigateTo } = useApp();

  if (settings.isPro || !settings.showAds) {
    return null;
  }

  return (
    <div 
      id="native-ad-banner"
      className="my-3 mx-4 p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-blue-50/50 to-slate-50 dark:from-indigo-950/30 dark:via-slate-900/40 dark:to-slate-900 border border-indigo-100/80 dark:border-indigo-900/40 text-xs flex items-center justify-between gap-3 shadow-xs"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-7 h-7 rounded-xl bg-indigo-600/10 dark:bg-indigo-400/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-indigo-200/60 dark:bg-indigo-900/70 text-indigo-800 dark:text-indigo-300 rounded">
              Sponsor
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
              Instant E-com Working Capital
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
            Get up to ₹25 Lakhs inventory financing at 1.1% ROI.
          </p>
        </div>
      </div>

      <button
        onClick={() => navigateTo('premium')}
        className="shrink-0 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
      >
        <span>Go Pro</span>
        <ArrowUpRight className="w-3 h-3" />
      </button>
    </div>
  );
};
