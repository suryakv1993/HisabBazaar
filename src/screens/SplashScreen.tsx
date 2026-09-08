import React from 'react';
import { useApp } from '../context/AppContext';
import { Store, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { navigateTo, hasSeenOnboarding } = useApp();

  const handleSkip = () => {
    if (hasSeenOnboarding) {
      navigateTo('home');
    } else {
      navigateTo('onboarding');
    }
  };

  return (
    <div 
      id="screen-splash"
      onClick={handleSkip}
      className="min-h-screen bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-950 text-white flex flex-col items-center justify-between p-8 select-none cursor-pointer"
    >
      <div className="pt-8 text-center">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-800/60 border border-indigo-700/60 text-xs text-indigo-200 font-medium tracking-wide">
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>Made for Indian E-commerce Sellers</span>
        </span>
      </div>

      <div className="flex flex-col items-center text-center my-auto">
        {/* Animated Brand Mark */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-indigo-700 p-0.5 shadow-2xl shadow-indigo-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-indigo-900/90 rounded-[22px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute -right-3 -top-3 w-12 h-12 bg-indigo-400/20 rounded-full blur-sm" />
              <div className="flex items-center justify-center gap-1">
                <Store className="w-10 h-10 text-white stroke-[2.2]" />
                <TrendingUp className="w-6 h-6 text-emerald-400 absolute bottom-3 right-3 stroke-[2.5]" />
              </div>
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center font-bold text-xs shadow-md">
            ₹
          </div>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-1">
          <span>Hisab</span>
          <span className="text-indigo-400">Bazaar</span>
        </h1>

        <p className="mt-2.5 text-slate-300 text-sm font-medium tracking-wide">
          Know Your Profit Before You Sell
        </p>

        <div className="flex items-center gap-3 mt-6 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Accurate GST
          </span>
          <span>•</span>
          <span>Flipkart & Amazon Ready</span>
        </div>
      </div>

      <div className="pb-6 flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-400 tracking-wider">Loading HisabBazaar...</span>
      </div>
    </div>
  );
};
