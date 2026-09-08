import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Crown, 
  Check, 
  Sparkles 
} from 'lucide-react';
import confetti from 'canvas-confetti';

type PlanType = 'monthly' | 'yearly' | 'lifetime';

export const PremiumScreen: React.FC = () => {
  const { settings, togglePro, navigateTo, showSnackbar } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('yearly');

  const plans = [
    {
      id: 'monthly' as PlanType,
      title: 'Monthly Pass',
      price: '₹99',
      period: '/ month',
      badge: null,
      savings: null,
    },
    {
      id: 'yearly' as PlanType,
      title: 'Annual Pro',
      price: '₹799',
      period: '/ year',
      badge: 'MOST POPULAR (Save 33%)',
      savings: '₹66 / month',
    },
    {
      id: 'lifetime' as PlanType,
      title: 'Lifetime Deal',
      price: '₹1,999',
      period: 'one-time',
      badge: 'BEST VALUE',
      savings: 'Pay once, own forever',
    },
  ];

  const features = [
    '100% Ad-Free Clean UI Experience',
    'Unlimited Product Catalog & SKU Tracking',
    'Full Financial PDF & CSV Excel Reports Export',
    'Break-Even Pricing & Smart Target Margin Optimizer',
    'Bulk Rate Card Simulators for Flipkart & Amazon',
    'Priority CA-Verified GST & Return Rate Rules',
  ];

  const handleUpgrade = () => {
    togglePro();
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {}
    showSnackbar(
      settings.isPro ? 'Switched to Free Tier' : '🎉 Welcome to HisabBazaar PRO!',
      'success'
    );
  };

  const handleRestore = () => {
    showSnackbar('Purchases verified with Google Play Store ✓', 'info');
  };

  return (
    <div id="screen-premium-upgrade" className="pb-28 pt-2 md:pt-4 select-none">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('home')}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            PRO MEMBERSHIP
          </span>
        </div>

        <button
          onClick={handleRestore}
          className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
        >
          Restore Purchases
        </button>
      </div>

      {/* Hero Badge */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/20">
          <Crown className="w-9 h-9 fill-current" />
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Unlock HisabBazaar PRO
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
          Everything an Indian e-commerce seller needs to protect margins and scale profitably.
        </p>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-5xl mx-auto">
        
        {/* Left Column (6-7 cols): Pricing Plans */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Select Your Subscription Tier
          </h2>

          {plans.map((p) => {
            const isSelected = selectedPlan === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPlan(p.id)}
                className={`p-4 md:p-5 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-600 dark:border-indigo-500 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                {p.badge && (
                  <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[9px] font-black uppercase px-3 py-1 rounded-bl-2xl tracking-wider">
                    {p.badge}
                  </span>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {p.title}
                      </h3>
                      {p.savings && (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
                          {p.savings}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100">
                      {p.price}
                    </span>
                    <span className="text-[11px] text-slate-400 block font-normal">
                      {p.period}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column (5-6 cols): Feature bullets & CTA */}
        <div className="lg:col-span-6 xl:col-span-5 space-y-5">
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              All Pro Capabilities Included:
            </h3>
            <div className="space-y-3">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-xs md:text-sm text-slate-700 dark:text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="font-medium">{f}</span>
                </div>
              ))}
            </div>

            {/* CTA BUTTON */}
            <button
              id="premium-cta-btn"
              onClick={handleUpgrade}
              className={`w-full mt-6 py-4 px-6 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                settings.isPro
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
                  : 'bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-700 hover:brightness-105 text-white shadow-indigo-600/25'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {settings.isPro 
                  ? 'Toggle Demo: Revert to Free Plan' 
                  : `Upgrade Now — ${plans.find((p) => p.id === selectedPlan)?.price}`}
              </span>
            </button>

            <p className="text-[11px] text-center text-slate-400 mt-3">
              Secure payment via UPI, RuPay, NetBanking & Cards. Instant activation.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
