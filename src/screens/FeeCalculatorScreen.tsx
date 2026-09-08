import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MarketplaceType } from '../types';
import { calculateMarketplaceFees, MARKETPLACE_PRESETS } from '../utils/calculatorEngine';
import { formatINR } from '../utils/formatters';
import { ArrowLeft, RotateCcw, ShieldAlert, Sparkles, Building2, CheckCircle2, TrendingUp } from 'lucide-react';
import { MarketplaceBadge } from '../components/MarketplaceBadge';

export const FeeCalculatorScreen: React.FC = () => {
  const { navigateTo } = useApp();

  const [marketplace, setMarketplace] = useState<MarketplaceType>('flipkart');
  const [sellingPrice, setSellingPrice] = useState<number>(499);
  const [commissionRate, setCommissionRate] = useState<number>(10.5);
  const [fixedFee, setFixedFee] = useState<number>(18);
  const [shippingFee, setShippingFee] = useState<number>(49);
  const [paymentFeeRate, setPaymentFeeRate] = useState<number>(2.0);
  const [otherFee, setOtherFee] = useState<number>(0);

  const marketplaces: { id: MarketplaceType; name: string }[] = [
    { id: 'flipkart', name: 'Flipkart' },
    { id: 'amazon', name: 'Amazon' },
    { id: 'meesho', name: 'Meesho' },
    { id: 'shopify', name: 'Shopify / D2C' },
    { id: 'custom', name: 'Custom' },
  ];

  const handleMarketplaceSelect = (mp: MarketplaceType) => {
    setMarketplace(mp);
    const preset = MARKETPLACE_PRESETS[mp];
    setCommissionRate(preset.commissionRate);
    setFixedFee(preset.fixedFee);
    setShippingFee(preset.shippingFee);
    setPaymentFeeRate(preset.paymentCollectionFeeRate);
  };

  const result = calculateMarketplaceFees(
    marketplace,
    sellingPrice,
    commissionRate,
    fixedFee,
    shippingFee,
    paymentFeeRate,
    otherFee
  );

  // Side-by-side payout comparison across all marketplaces for this price
  const comparisonList = (['flipkart', 'amazon', 'meesho', 'shopify'] as const).map((mKey) => {
    const p = MARKETPLACE_PRESETS[mKey];
    const res = calculateMarketplaceFees(mKey, sellingPrice, p.commissionRate, p.fixedFee, p.shippingFee, p.paymentCollectionFeeRate, 0);
    return {
      id: mKey,
      name: mKey === 'shopify' ? 'Shopify (D2C)' : mKey.toUpperCase(),
      fee: res.totalFees,
      payout: res.amountReceived,
      feePercent: res.feePercentage,
    };
  });

  return (
    <div id="screen-fee-calculator" className="pb-28 pt-2 md:pt-4 select-none">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <button
            id="fee-back-btn"
            onClick={() => navigateTo('home')}
            className="md:hidden p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Marketplace Deductions & Logistics
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
              Platform Fee & Payout Matrix
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Analyze commissions, fixed closing fees, courier shipping & bank payouts
            </p>
          </div>
        </div>

        <button
          id="fee-reset-btn"
          onClick={() => handleMarketplaceSelect(marketplace)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors shadow-xs text-xs font-bold shrink-0"
          title="Reset Preset"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Preset</span>
        </button>
      </div>

      {/* 2-Column Responsive Layout on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Marketplace, Price & Fee Sliders (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Marketplace Channel Selector */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 block">
              1. Selected Marketplace
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {marketplaces.map((mp) => {
                const isSelected = marketplace === mp.id;
                return (
                  <button
                    key={mp.id}
                    type="button"
                    onClick={() => handleMarketplaceSelect(mp.id)}
                    className={`p-3 rounded-2xl border transition-all text-center flex flex-col items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-600 dark:border-indigo-500 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <MarketplaceBadge marketplace={mp.id} size="sm" />
                    <span className={`text-xs font-bold ${isSelected ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-700 dark:text-slate-300'}`}>
                      {mp.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selling Price Input */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              2. Selling Price (₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
                ₹
              </span>
              <input
                id="fee-input-sp"
                type="number"
                inputMode="decimal"
                value={sellingPrice || ''}
                onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl text-xl font-extrabold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
              {[299, 499, 799, 999, 1499, 2999].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setSellingPrice(chip)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-700 shrink-0 transition-colors"
                >
                  ₹{chip}
                </button>
              ))}
            </div>
          </div>

          {/* Fee Components */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              3. Platform Deductions & Charges
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Commission % */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Marketplace Commission %
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={commissionRate ?? ''}
                    onChange={(e) => setCommissionRate(parseFloat(e.target.value) || 0)}
                    className="w-full pl-3 pr-8 py-2.5 rounded-xl text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
                </div>
              </div>

              {/* Fixed Fee */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Fixed Closing Fee (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    value={fixedFee ?? ''}
                    onChange={(e) => setFixedFee(parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              {/* Shipping */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Courier Shipping (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    value={shippingFee ?? ''}
                    onChange={(e) => setShippingFee(parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              {/* Payment Fee */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Payment Collection %
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={paymentFeeRate ?? ''}
                    onChange={(e) => setPaymentFeeRate(parseFloat(e.target.value) || 0)}
                    className="w-full pl-3 pr-8 py-2.5 rounded-xl text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Bank Settlement Card & Multi-Platform Comparison (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Hero Payout Card */}
          <div className="rounded-3xl p-5 md:p-6 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white shadow-xl border border-indigo-800/50">
            <div className="flex items-center justify-between pb-3 border-b border-indigo-800/50">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-300 block">
                  Total Marketplace Cut
                </span>
                <div className="text-2xl md:text-3xl font-black text-rose-400 mt-0.5">
                  -{formatINR(result.totalFees)}
                </div>
              </div>
              <div className="px-3 py-1 bg-rose-500/20 text-rose-300 rounded-full text-xs font-bold border border-rose-500/30">
                {result.feePercentage.toFixed(1)}% of price
              </div>
            </div>

            {/* Payout to Bank */}
            <div className="mt-4 pt-1 flex items-center justify-between">
              <div>
                <span className="text-xs text-indigo-200 block">Bank Settlement Amount:</span>
                <span className="text-3xl font-black text-emerald-400 block mt-0.5">
                  {formatINR(result.amountReceived)}
                </span>
              </div>
              <Building2 className="w-10 h-10 text-indigo-400/40 shrink-0" />
            </div>

            <div className="mt-4 pt-3 border-t border-indigo-800/40 text-xs text-indigo-200 space-y-1.5">
              <div className="flex justify-between">
                <span>Commission + Closing:</span>
                <span className="font-semibold text-white">
                  {formatINR((sellingPrice * commissionRate) / 100 + fixedFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping + Gateway:</span>
                <span className="font-semibold text-white">
                  {formatINR(shippingFee + (sellingPrice * paymentFeeRate) / 100)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>18% GST on Platform Services:</span>
                <span className="font-semibold text-white">+{formatINR(result.feeGst)}</span>
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison Matrix */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Payout Comparison for ₹{sellingPrice}
              </h3>
              <span className="text-[10px] text-emerald-600 font-bold">Side-by-Side</span>
            </div>

            <div className="space-y-2.5">
              {comparisonList.map((c) => {
                const isCurrent = c.id === marketplace;
                return (
                  <div
                    key={c.id}
                    onClick={() => handleMarketplaceSelect(c.id as any)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MarketplaceBadge marketplace={c.id as any} size="sm" />
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                          {c.name}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Fee: -{formatINR(c.fee, false)} ({c.feePercent.toFixed(1)}%)
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 block">
                        {formatINR(c.payout, false)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">Bank Payout</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
