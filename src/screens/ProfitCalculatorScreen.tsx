import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MarketplaceType, 
  GSTRate, 
  ProfitCalculationInput 
} from '../types';
import { calculateProfit, MARKETPLACE_PRESETS } from '../utils/calculatorEngine';
import { 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  PackageCheck, 
  ArrowRight, 
  AlertCircle,
  RotateCcw,
  BookmarkPlus
} from 'lucide-react';
import { formatINR } from '../utils/formatters';
import { BottomSheet } from '../components/BottomSheet';
import { MarketplaceBadge } from '../components/MarketplaceBadge';

export const ProfitCalculatorScreen: React.FC = () => {
  const { 
    calculatorDraft, 
    setCalculatorDraft, 
    setCurrentResult, 
    navigateTo, 
    products, 
    loadProductIntoCalculator,
    addProduct,
    showSnackbar
  } = useApp();

  const [form, setForm] = useState<ProfitCalculationInput>(calculatorDraft);
  const [showOtherCosts, setShowOtherCosts] = useState<boolean>(true);
  const [savedProductsModalOpen, setSavedProductsModalOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const marketplaces: { id: MarketplaceType; name: string }[] = [
    { id: 'flipkart', name: 'Flipkart' },
    { id: 'amazon', name: 'Amazon' },
    { id: 'meesho', name: 'Meesho' },
    { id: 'shopify', name: 'Shopify / D2C' },
    { id: 'custom', name: 'Custom' },
  ];

  const gstRates: GSTRate[] = [0, 5, 12, 18, 28];

  const handleMarketplaceChange = (mp: MarketplaceType) => {
    const preset = MARKETPLACE_PRESETS[mp];
    setForm((prev) => ({
      ...prev,
      marketplace: mp,
      commissionRate: preset.commissionRate,
      fixedFee: preset.fixedFee,
      shippingFee: preset.shippingFee,
      paymentCollectionFeeRate: preset.paymentCollectionFeeRate,
      paymentCollectionFixedFee: preset.paymentCollectionFixedFee,
      gstRate: prev.gstRate || preset.defaultGstRate,
    }));
  };

  const handleInputChange = (field: keyof ProfitCalculationInput, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Validation
  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!form.sellingPrice || Number(form.sellingPrice) <= 0) {
      newErrors.sellingPrice = 'Enter a valid selling price greater than 0';
    }
    if (form.productCost === undefined || form.productCost < 0) {
      newErrors.productCost = 'Product cost cannot be negative';
    }
    if (Number(form.sellingPrice) < Number(form.productCost)) {
      newErrors.sellingPrice = 'Selling price is less than product cost (loss imminent)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) {
      showSnackbar('Please fix the highlighted fields', 'error');
      return;
    }

    const result = calculateProfit(form);
    setCurrentResult(result);
    setCalculatorDraft(form);
    navigateTo('result');
  };

  const handleSaveAsProduct = () => {
    if (!validate()) {
      showSnackbar('Please fill valid price and cost before saving', 'error');
      return;
    }

    const name = form.productName?.trim() || `SKU-${Date.now().toString().slice(-4)}`;
    const sku = form.sku?.trim() || `SKU-${Date.now().toString().slice(-4)}`;

    addProduct({
      name,
      sku,
      category: 'General',
      marketplace: form.marketplace,
      productCost: Number(form.productCost) || 0,
      sellingPrice: Number(form.sellingPrice) || 0,
      gstRate: form.gstRate,
      commissionRate: form.commissionRate,
      fixedFee: form.fixedFee,
      shippingFee: form.shippingFee,
      packagingCost: form.packagingCost,
      advertisingCost: form.advertisingCost,
      otherExpenses: form.otherExpenses,
      returnAllowanceRate: form.returnAllowanceRate,
    });
  };

  const handleReset = () => {
    const defaultPreset = MARKETPLACE_PRESETS.flipkart;
    setForm({
      productName: '',
      sku: '',
      productCost: 180,
      sellingPrice: 499,
      quantity: 1,
      gstRate: 18,
      marketplace: 'flipkart',
      commissionRate: defaultPreset.commissionRate,
      fixedFee: defaultPreset.fixedFee,
      shippingFee: defaultPreset.shippingFee,
      paymentCollectionFeeRate: defaultPreset.paymentCollectionFeeRate,
      paymentCollectionFixedFee: defaultPreset.paymentCollectionFixedFee,
      packagingCost: 10,
      advertisingCost: 20,
      discount: 0,
      otherExpenses: 5,
      returnAllowanceRate: 5,
      targetProfitForRecommendation: 100,
    });
    setErrors({});
    showSnackbar('Calculator values reset', 'info');
  };

  // Instant live calculation as user edits
  const livePreview = calculateProfit(form);

  return (
    <div id="screen-profit-calculator" className="pb-28 pt-2 md:pt-4 select-none">
      
      {/* Top Title & Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Indian Marketplace Margin Engine
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
            E-Commerce Profit Calculator
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time net earnings, commission deduction, shipping rates & GST liability
          </p>
        </div>

        <div className="flex items-center gap-2">
          {products.length > 0 && (
            <button
              id="calc-load-saved-btn"
              type="button"
              onClick={() => setSavedProductsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
            >
              <PackageCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Load SKU ({products.length})</span>
            </button>
          )}

          <button
            id="calc-reset-btn"
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset form"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Main Responsive Form Grid (Desktop 2-columns: Left inputs, Right sticky outcome) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ================= LEFT COLUMN: FORM INPUTS (7-8 cols on desktop) ================= */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-5">
          
          {/* Section 1: Marketplace Channel Selector */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
              1. Selling Channel
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {marketplaces.map((mp) => {
                const isSelected = form.marketplace === mp.id;
                return (
                  <button
                    key={mp.id}
                    type="button"
                    onClick={() => handleMarketplaceChange(mp.id)}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 dark:border-indigo-500 shadow-xs'
                        : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
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

          {/* Section 2: Product Name & SKU (Optional) */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Product / Item Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Wireless Bluetooth Earbuds"
                  value={form.productName || ''}
                  onChange={(e) => handleInputChange('productName', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Custom SKU Code
                </label>
                <input
                  type="text"
                  placeholder="e.g., EAR-BLK-01"
                  value={form.sku || ''}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 uppercase"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Core Pricing & Sourcing Cost */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
              2. Sourcing Cost & Selling Price
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* Selling Price */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Listing / Selling Price (₹) *
                  </label>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">Incl. Customer GST</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    value={form.sellingPrice || ''}
                    onChange={(e) => handleInputChange('sellingPrice', parseFloat(e.target.value) || 0)}
                    placeholder="499"
                    className={`w-full pl-8 pr-4 py-2.5 text-base font-extrabold rounded-xl bg-slate-50 dark:bg-slate-800 border ${
                      errors.sellingPrice ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-600'
                    } text-slate-900 dark:text-slate-100 focus:outline-none`}
                  />
                </div>
                {errors.sellingPrice && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.sellingPrice}
                  </p>
                )}

                {/* Quick Selling Price Preset Buttons */}
                <div className="flex items-center gap-1.5 mt-2">
                  {[299, 499, 799, 999, 1499].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleInputChange('sellingPrice', amt)}
                      className="px-2 py-1 text-[10px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Cost */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Product Sourcing / Purchase Cost (₹) *
                  </label>
                  <span className="text-[10px] text-slate-400">Manufacture / Buy</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    value={form.productCost || ''}
                    onChange={(e) => handleInputChange('productCost', parseFloat(e.target.value) || 0)}
                    placeholder="180"
                    className={`w-full pl-8 pr-4 py-2.5 text-base font-extrabold rounded-xl bg-slate-50 dark:bg-slate-800 border ${
                      errors.productCost ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-600'
                    } text-slate-900 dark:text-slate-100 focus:outline-none`}
                  />
                </div>
                {errors.productCost && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.productCost}
                  </p>
                )}
              </div>
            </div>

            {/* GST Rate Slab Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  GST Rate Slab for this Category
                </span>
                <span className="text-[11px] text-slate-500">Most electronics/apparel: 18%</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {gstRates.map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => handleInputChange('gstRate', rate)}
                    className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all ${
                      form.gstRate === rate
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Marketplace Fee Matrix (Auto-Preset with Custom Override) */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                3. Platform Fees & Logistics
              </label>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                Auto-preset for {form.marketplace}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Commission % */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Commission Rate (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={form.commissionRate}
                    onChange={(e) => handleInputChange('commissionRate', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">%</span>
                </div>
              </div>

              {/* Fixed Closing Fee */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Fixed Closing Fee (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                  <input
                    type="number"
                    value={form.fixedFee}
                    onChange={(e) => handleInputChange('fixedFee', parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              {/* Courier Shipping Fee */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Shipping / Easy Ship (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                  <input
                    type="number"
                    value={form.shippingFee}
                    onChange={(e) => handleInputChange('shippingFee', parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
              <span>ℹ️</span>
              <span>18% GST is automatically applied on top of platform commission, shipping, and fixed closing fees.</span>
            </p>
          </div>

          {/* Section 5: Other Operating Expenses & Return Allowance */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <button
              type="button"
              onClick={() => setShowOtherCosts(!showOtherCosts)}
              className="w-full flex items-center justify-between text-left"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  4. Packaging, Advertising & RTO Allowance
                </span>
                <span className="text-[11px] text-slate-500">Fine-tune actual seller overheads</span>
              </div>
              {showOtherCosts ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {showOtherCosts && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                {/* Packaging */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Packaging (₹)
                  </label>
                  <input
                    type="number"
                    value={form.packagingCost}
                    onChange={(e) => handleInputChange('packagingCost', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100"
                  />
                </div>

                {/* Ads / Marketing */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Ads / CAC (₹)
                  </label>
                  <input
                    type="number"
                    value={form.advertisingCost}
                    onChange={(e) => handleInputChange('advertisingCost', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100"
                  />
                </div>

                {/* Return / RTO Rate */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    RTO / Return Rate (%)
                  </label>
                  <input
                    type="number"
                    value={form.returnAllowanceRate}
                    onChange={(e) => handleInputChange('returnAllowanceRate', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100"
                  />
                </div>

                {/* Misc */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Other Costs (₹)
                  </label>
                  <input
                    type="number"
                    value={form.otherExpenses}
                    onChange={(e) => handleInputChange('otherExpenses', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ================= RIGHT COLUMN: STICKY REAL-TIME OUTCOME CARD (4-5 cols on desktop) ================= */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="lg:sticky lg:top-20 space-y-4">
            
            {/* Live Profit Snapshot Card */}
            <div className={`rounded-3xl p-5 md:p-6 border shadow-lg transition-all ${
              livePreview.isProfitable
                ? 'bg-gradient-to-br from-emerald-950/90 via-slate-900 to-slate-950 text-white border-emerald-800/60 shadow-emerald-950/20'
                : 'bg-gradient-to-br from-rose-950/90 via-slate-900 to-slate-950 text-white border-rose-800/60 shadow-rose-950/20'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Live Profit Estimation
                  </span>
                </div>
                <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  livePreview.isProfitable 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {livePreview.isProfitable ? 'PROFITABLE' : 'LOSS MAKING'}
                </span>
              </div>

              {/* Big Bold Net Earnings */}
              <div className="mt-4">
                <span className="text-xs text-slate-400">Net Profit in Hand</span>
                <div className="text-3xl md:text-4xl font-black tracking-tight mt-0.5 flex items-baseline gap-2">
                  <span className={livePreview.isProfitable ? 'text-emerald-400' : 'text-rose-400'}>
                    {livePreview.isProfitable ? `+${formatINR(livePreview.netProfit)}` : formatINR(livePreview.netProfit)}
                  </span>
                  <span className="text-xs font-medium text-slate-400">per order</span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10">
                <div>
                  <span className="text-[11px] text-slate-400 block">Profit Margin</span>
                  <span className={`text-base font-extrabold ${livePreview.isProfitable ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {livePreview.profitMarginPercent.toFixed(1)}%
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block">Return on Investment (ROI)</span>
                  <span className="text-base font-extrabold text-slate-200">
                    {livePreview.roiPercent.toFixed(1)}%
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block">Bank Settlement (Payout)</span>
                  <span className="text-sm font-bold text-white">
                    {formatINR(livePreview.moneyReceivedFromMarketplace)}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block">Break-even Selling Price</span>
                  <span className="text-sm font-bold text-amber-300">
                    {formatINR(livePreview.breakEvenSellingPrice, false)}
                  </span>
                </div>
              </div>

              {/* Mini Itemized Fee Deductions */}
              <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Listing Price:</span>
                  <span className="font-semibold">{formatINR(form.sellingPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Product Cost:</span>
                  <span className="text-rose-400 font-medium">-{formatINR(form.productCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Platform Fees + 18% GST:</span>
                  <span className="text-rose-400 font-medium">-{formatINR(livePreview.totalMarketplaceFees)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">GST Output Tax:</span>
                  <span className="text-rose-400 font-medium">-{formatINR(livePreview.gstAmount)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2.5">
                <button
                  id="calc-primary-calculate-btn"
                  type="button"
                  onClick={handleCalculate}
                  className="w-full min-h-[46px] py-3 px-5 rounded-2xl font-bold text-xs md:text-sm bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Full Financial Breakdown</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="calc-save-product-btn"
                  type="button"
                  onClick={handleSaveAsProduct}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center justify-center gap-1.5 transition-all"
                >
                  <BookmarkPlus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Save as SKU in Catalog</span>
                </button>
              </div>
            </div>

            {/* Recommended Target Pricing Helper */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Recommended Selling Prices</span>
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 block">Target +10% Margin:</span>
                  <span className="font-extrabold text-slate-900 dark:text-slate-100">
                    {formatINR(livePreview.recommendedSellingPriceFor10Percent, false)}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 block">Target +20% Margin:</span>
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                    {formatINR(livePreview.recommendedSellingPriceFor20Percent, false)}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Saved Products Bottom Sheet */}
      <BottomSheet
        isOpen={savedProductsModalOpen}
        onClose={() => setSavedProductsModalOpen(false)}
        title="Select Saved Catalog SKU"
        subtitle="Auto-fill pricing, marketplace fees & tax rates"
      >
        <div className="p-4 space-y-2.5 max-h-[60vh] overflow-y-auto">
          {products.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                loadProductIntoCalculator(p);
                setForm({
                  productName: p.name,
                  sku: p.sku,
                  productCost: p.productCost,
                  sellingPrice: p.sellingPrice,
                  quantity: 1,
                  gstRate: p.gstRate,
                  marketplace: p.marketplace,
                  commissionRate: p.commissionRate,
                  fixedFee: p.fixedFee,
                  shippingFee: p.shippingFee,
                  paymentCollectionFeeRate: p.marketplace === 'shopify' ? 2.36 : 2.0,
                  paymentCollectionFixedFee: 0,
                  packagingCost: p.packagingCost,
                  advertisingCost: p.advertisingCost,
                  discount: 0,
                  otherExpenses: p.otherExpenses,
                  returnAllowanceRate: p.returnAllowanceRate,
                  targetProfitForRecommendation: 100,
                });
                setSavedProductsModalOpen(false);
              }}
              className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-white dark:bg-slate-900 cursor-pointer flex items-center justify-between gap-3 shadow-xs transition-all"
            >
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <MarketplaceBadge marketplace={p.marketplace} size="sm" />
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{p.name}</span>
                </div>
                <span className="text-[11px] text-slate-500">
                  SKU: {p.sku} • SP: {formatINR(p.sellingPrice, false)} | Cost: {formatINR(p.productCost, false)}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                  +{formatINR(p.netProfit, false)}
                </span>
                <span className="text-[10px] text-slate-400">{p.profitMargin.toFixed(1)}% margin</span>
              </div>
            </div>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
};
