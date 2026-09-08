import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calculator, Package, BarChart3, ArrowRight, Check } from 'lucide-react';

export const OnboardingScreen: React.FC = () => {
  const { completeOnboarding } = useApp();
  const [currentPage, setCurrentPage] = useState<number>(0);

  const pages = [
    {
      id: 1,
      title: 'Calculate Your Real Profit',
      subtitle: 'Know exactly how much you earn after every selling cost.',
      icon: Calculator,
      badge: 'Zero Surprises',
      bullets: [
        'Precise GST deduction & Input Tax Credit',
        'Marketplace commission, shipping & fixed fees',
        'Return / RTO loss calculations',
      ],
      color: 'from-indigo-600 to-blue-600',
    },
    {
      id: 2,
      title: 'Track Your Products',
      subtitle: 'Save products and compare your margins.',
      icon: Package,
      badge: 'Catalog Management',
      bullets: [
        'Manage catalog margins across all channels',
        'Identify low-margin and loss-making SKUs',
        'Auto-calculate break-even selling prices',
      ],
      color: 'from-blue-600 to-teal-600',
    },
    {
      id: 3,
      title: 'Grow Your Business',
      subtitle: 'Analyze sales, expenses and profit with simple reports.',
      icon: BarChart3,
      badge: 'Actionable Insights',
      bullets: [
        'Daily & monthly sales and profit summaries',
        'Detailed cost breakdown & marketplace analytics',
        'Export reports in PDF and CSV formats',
      ],
      color: 'from-indigo-600 to-violet-600',
    },
  ];

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage((prev) => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const activePage = pages[currentPage];
  const Icon = activePage.icon;

  return (
    <div 
      id="screen-onboarding"
      className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between p-6 select-none"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
            ₹
          </div>
          <span className="font-bold text-sm tracking-tight">HisabBazaar</span>
        </div>
        {currentPage < pages.length - 1 && (
          <button
            id="onboarding-skip-btn"
            onClick={completeOnboarding}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          >
            Skip
          </button>
        )}
      </div>

      {/* Main Illustration & Card */}
      <div className="my-auto py-6 flex flex-col items-center text-center">
        {/* Visual Badge / Icon */}
        <div className="relative mb-8">
          <div className={`w-28 h-28 rounded-3xl bg-gradient-to-tr ${activePage.color} p-1 shadow-xl shadow-indigo-500/20 flex items-center justify-center transform transition-transform duration-300`}>
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[22px] flex items-center justify-center">
              <Icon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 stroke-[2]" />
            </div>
          </div>
          <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 whitespace-nowrap px-3 py-0.5 rounded-full text-[11px] font-bold bg-indigo-600 text-white shadow-sm">
            {activePage.badge}
          </span>
        </div>

        {/* Text */}
        <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          {activePage.title}
        </h2>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-xs mt-1.5 leading-relaxed">
          {activePage.subtitle}
        </p>

        {/* Bullets */}
        <div className="w-full max-w-xs mt-6 space-y-2 text-left bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          {activePage.bullets.map((b, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span className="font-medium leading-tight">{b}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer & Navigation */}
      <div className="space-y-4 pb-2">
        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5">
          {pages.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentPage === idx ? 'w-6 bg-indigo-600' : 'w-1.5 bg-slate-300 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          id="onboarding-next-btn"
          onClick={handleNext}
          className="w-full min-h-[48px] py-3.5 px-6 rounded-2xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>{currentPage === pages.length - 1 ? 'Get Started' : 'Continue'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
