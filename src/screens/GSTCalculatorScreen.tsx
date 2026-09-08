import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GSTRate } from '../types';
import { calculateGST } from '../utils/calculatorEngine';
import { formatINR } from '../utils/formatters';
import { ArrowLeft, Copy, Check, Info, ShieldCheck, Zap, Receipt, Sparkles } from 'lucide-react';

export const GSTCalculatorScreen: React.FC = () => {
  const { navigateTo, showSnackbar } = useApp();

  const [type, setType] = useState<'inclusive' | 'exclusive'>('inclusive');
  const [amount, setAmount] = useState<number>(499);
  const [rate, setRate] = useState<GSTRate>(18);
  const [copied, setCopied] = useState<boolean>(false);

  const gstRates: GSTRate[] = [0, 5, 12, 18, 28];

  const result = calculateGST(amount, rate, type);

  const handleCopyResult = () => {
    const text = `🧾 GST Calculation (${type.toUpperCase()})
Base Amount: ${formatINR(result.baseAmount)}
GST Rate: ${rate}%
Total GST: ${formatINR(result.gstAmount)} (CGST: ${formatINR(result.cgst)}, SGST: ${formatINR(result.sgst)}, IGST: ${formatINR(result.igst)})
Final Total: ${formatINR(result.totalAmount)}`;

    navigator.clipboard?.writeText(text);
    setCopied(true);
    showSnackbar('GST breakdown copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="screen-gst-calculator" className="pb-28 pt-2 md:pt-4 select-none">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <button
            id="gst-back-btn"
            onClick={() => navigateTo('home')}
            className="md:hidden p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Goods & Services Tax (India)
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
              GST Tax Calculator
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Calculate reverse GST from MRP, add GST, and split CGST, SGST & IGST
            </p>
          </div>
        </div>

        <button
          id="gst-copy-btn"
          onClick={handleCopyResult}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-600 hover:text-indigo-600 transition-colors shadow-xs text-xs font-bold shrink-0"
          title="Copy Result"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied' : 'Copy Breakdown'}</span>
        </button>
      </div>

      {/* Responsive 2-Column Grid on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Inputs (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Mode Switcher */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
              1. Calculation Mode
            </label>
            <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl flex items-center gap-1">
              <button
                id="gst-toggle-inclusive"
                type="button"
                onClick={() => setType('inclusive')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                  type === 'inclusive'
                    ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                GST Inclusive (Reverse from MRP)
              </button>
              <button
                id="gst-toggle-exclusive"
                type="button"
                onClick={() => setType('exclusive')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                  type === 'exclusive'
                    ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                GST Exclusive (+ Add Tax on Base)
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-2.5">
              {type === 'inclusive' 
                ? '💡 When selling on Amazon/Flipkart at ₹499, the ₹499 includes GST. Use this mode to know the real net price.' 
                : '💡 When procuring raw materials or invoicing B2B clients with tax added on top.'}
            </p>
          </div>

          {/* Amount Input */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              {type === 'inclusive' ? '2. Selling Price / MRP (₹)' : '2. Base Amount Before Tax (₹)'}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
                ₹
              </span>
              <input
                id="gst-input-amount"
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={amount || ''}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl text-xl font-extrabold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            {/* Quick Amount Chips */}
            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
              {[299, 499, 799, 999, 1499, 2999, 4999].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setAmount(chip)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-700 shrink-0 transition-colors"
                >
                  ₹{chip}
                </button>
              ))}
            </div>
          </div>

          {/* GST Slabs */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 block">
              3. Select GST Slab Rate
            </label>
            <div className="grid grid-cols-5 gap-2">
              {gstRates.map((r) => {
                const isSelected = rate === r;
                return (
                  <button
                    key={r}
                    id={`gst-slab-${r}`}
                    type="button"
                    onClick={() => setRate(r)}
                    className={`py-3 rounded-2xl text-xs font-bold border transition-all min-h-[48px] flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-sm font-extrabold">{r}%</span>
                    <span className="text-[10px] opacity-80">{r === 0 ? 'Exempt' : r === 18 ? 'Standard' : 'Slab'}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Computed Outcome & Tax Split Cards (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Main GST Result Card */}
          <div className="rounded-3xl p-5 md:p-6 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white shadow-xl border border-indigo-800/50">
            <div className="flex items-center justify-between pb-3 border-b border-indigo-800/50">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-300 block">
                  Total GST Payable
                </span>
                <div className="text-3xl font-black text-white mt-0.5">
                  {formatINR(result.gstAmount)}
                </div>
              </div>
              <div className="px-3 py-1 bg-indigo-800/60 rounded-full text-xs font-bold text-indigo-200 border border-indigo-700/60">
                {rate}% Slab
              </div>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div className="flex justify-between text-indigo-200">
                <span>Base Net Value (Before Tax)</span>
                <span className="font-bold text-white text-sm">{formatINR(result.baseAmount)}</span>
              </div>

              <div className="flex justify-between text-indigo-200">
                <span>GST Added ({rate}%)</span>
                <span className="font-bold text-emerald-400 text-sm">+{formatINR(result.gstAmount)}</span>
              </div>

              <div className="pt-2.5 border-t border-indigo-800/40 flex justify-between font-bold text-sm text-white">
                <span>Total Invoice Value (MRP)</span>
                <span className="text-lg text-indigo-300">{formatINR(result.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Tax Split: Intra-State vs Inter-State */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Tax Split & GST Invoicing Heads
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              {/* Intra State */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block">
                  Intra-State (Same State)
                </span>
                <div className="mt-2 space-y-1 text-xs font-semibold">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">CGST ({(rate / 2).toFixed(1)}%):</span>
                    <span className="text-slate-900 dark:text-slate-100 font-bold">{formatINR(result.cgst)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">SGST ({(rate / 2).toFixed(1)}%):</span>
                    <span className="text-slate-900 dark:text-slate-100 font-bold">{formatINR(result.sgst)}</span>
                  </div>
                </div>
              </div>

              {/* Inter State */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block">
                  Inter-State (Other State)
                </span>
                <div className="mt-2 space-y-1 text-xs font-semibold">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">IGST ({rate}%):</span>
                    <span className="text-slate-900 dark:text-slate-100 font-bold">{formatINR(result.igst)}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Standard for out-of-state marketplace orders
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>Input Tax Credit (ITC) reminder: You can offset the GST paid on purchases against your output GST liability when filing monthly GSTR-3B.</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
