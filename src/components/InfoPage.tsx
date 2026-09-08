import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Section {
  heading?: string;
  paragraphs: string[];
}

interface InfoPageProps {
  eyebrow: string;
  title: string;
  description?: string;
  sections: Section[];
  lastUpdated?: string;
}

export const InfoPage: React.FC<InfoPageProps> = ({
  eyebrow,
  title,
  description,
  sections,
  lastUpdated,
}) => {
  const { navigateTo } = useApp();

  return (
    <div id="screen-info-page" className="pb-28 md:pb-8 pt-2 md:pt-4 select-none">
      <div className="max-w-3xl mx-auto">
        {/* Back + Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigateTo('home')}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {eyebrow}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {title}
            </h1>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 md:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          {description && (
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {description}
            </p>
          )}

          <div className="space-y-6">
            {sections.map((section, idx) => (
              <section key={idx}>
                {section.heading && (
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {section.heading}
                  </h2>
                )}
                {section.paragraphs.map((para, pIdx) => (
                  <p
                    key={pIdx}
                    className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-2"
                  >
                    {para}
                  </p>
                ))}
              </section>
            ))}
          </div>

          {lastUpdated && (
            <p className="text-[11px] text-slate-400 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
              Last updated: {lastUpdated}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
