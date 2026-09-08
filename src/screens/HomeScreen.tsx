import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calculator, 
  PlusCircle, 
  Receipt, 
  Percent, 
  TrendingUp, 
  ShoppingBag, 
  ArrowUpRight, 
  ChevronRight,
  Sparkles,
  Zap,
  Package,
  ArrowRight
} from 'lucide-react';
import { formatINR, formatPercent } from '../utils/formatters';
import { Sparkline } from '../components/MicroCharts';
import { MarketplaceBadge } from '../components/MarketplaceBadge';
import { calculateProfit, MARKETPLACE_PRESETS } from '../utils/calculatorEngine';

export const HomeScreen: React.FC = () => {
  const { 
    navigateTo, 
    calculationHistory, 
    products, 
    settings, 
    loadProductIntoCalculator,
    setCalculatorDraft,
    setCurrentResult,
    showSnackbar
  } = useApp();

  // Quick live widget calculation state
  const [quickSp, setQuickSp] = useState<number>(599);
  const [quickCost, setQuickCost] = useState<number>(220);
  const [quickChannel, setQuickChannel] = useState<'flipkart' | 'amazon' | 'meesho' | 'shopify'>('flipkart');

  // Real calculations computed dynamically from user products catalog and history
  const metrics = useMemo(() => {
    if (!products || products.length === 0) {
      // If no catalog products, check if calculation history exists
      if (calculationHistory && calculationHistory.length > 0) {
        const totalSales = calculationHistory.reduce((sum, c) => sum + (c.input.sellingPrice || 0), 0);
        const totalProfit = calculationHistory.reduce((sum, c) => sum + (c.netProfit || 0), 0);
        const avgMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;
        const trend = calculationHistory.slice(0, 7).reverse().map(c => Math.max(0, c.netProfit));
        return {
          totalSales,
          totalProfit,
          avgMargin,
          totalItems: calculationHistory.length,
          profitableCount: calculationHistory.filter(c => c.netProfit > 0).length,
          lowMarginCount: calculationHistory.filter(c => c.netProfit > 0 && c.profitMarginPercent < 15).length,
          lossCount: calculationHistory.filter(c => c.netProfit <= 0).length,
          trend: trend.length > 1 ? trend : [totalProfit * 0.7, totalProfit * 0.85, totalProfit],
        };
      }

      return {
        totalSales: 0,
        totalProfit: 0,
        avgMargin: 0,
        totalItems: 0,
        profitableCount: 0,
        lowMarginCount: 0,
        lossCount: 0,
        trend: [0, 0],
      };
    }

    const totalSales = products.reduce((sum, p) => sum + (p.sellingPrice || 0), 0);
    const totalProfit = products.reduce((sum, p) => sum + (p.netProfit || 0), 0);
    const avgMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;
    
    // Build real profit trend array from actual catalog products
    const trend = products.map((p) => Math.max(10, Math.round(p.netProfit)));
    if (trend.length < 3) {
      trend.unshift(Math.round(totalProfit * 0.6), Math.round(totalProfit * 0.8));
    }

    return {
      totalSales,
      totalProfit,
      avgMargin,
      totalItems: products.length,
      profitableCount: products.filter(p => p.status === 'profitable').length,
      lowMarginCount: products.filter(p => p.status === 'low_margin').length,
      lossCount: products.filter(p => p.status === 'loss').length,
      trend,
    };
  }, [products, calculationHistory]);

  // Dynamic Marketplace distribution from actual products
  const marketplaceDistribution = useMemo(() => {
    const counts: { [key: string]: { count: number; totalProfit: number; totalSales: number } } = {
      flipkart: { count: 0, totalProfit: 0, totalSales: 0 },
      amazon: { count: 0, totalProfit: 0, totalSales: 0 },
      meesho: { count: 0, totalProfit: 0, totalSales: 0 },
      shopify: { count: 0, totalProfit: 0, totalSales: 0 },
    };

    products.forEach((p) => {
      if (counts[p.marketplace]) {
        counts[p.marketplace].count += 1;
        counts[p.marketplace].totalProfit += p.netProfit;
        counts[p.marketplace].totalSales += p.sellingPrice;
      }
    });

    return counts;
  }, [products]);

  // Quick calculator result computed dynamically
  const quickCalcResult = useMemo(() => {
    const preset = MARKETPLACE_PRESETS[quickChannel];
    return calculateProfit({
      productName: 'Quick Estimate',
      productCost: quickCost || 0,
      sellingPrice: quickSp || 0,
      quantity: 1,
      gstRate: 18,
      marketplace: quickChannel,
      commissionRate: preset.commissionRate,
      fixedFee: preset.fixedFee,
      shippingFee: preset.shippingFee,
      paymentCollectionFeeRate: preset.paymentCollectionFeeRate,
      paymentCollectionFixedFee: preset.paymentCollectionFixedFee,
      packagingCost: 10,
      advertisingCost: 20,
      discount: 0,
      otherExpenses: 5,
      returnAllowanceRate: 5,
    });
  }, [quickSp, quickCost, quickChannel]);

  const handleLaunchFullCalc = () => {
    setCalculatorDraft({
      productName: '',
      productCost: quickCost,
      sellingPrice: quickSp,
      quantity: 1,
      gstRate: 18,
      marketplace: quickChannel,
      commissionRate: MARKETPLACE_PRESETS[quickChannel].commissionRate,
      fixedFee: MARKETPLACE_PRESETS[quickChannel].fixedFee,
      shippingFee: MARKETPLACE_PRESETS[quickChannel].shippingFee,
      paymentCollectionFeeRate: MARKETPLACE_PRESETS[quickChannel].paymentCollectionFeeRate,
      paymentCollectionFixedFee: MARKETPLACE_PRESETS[quickChannel].paymentCollectionFixedFee,
      packagingCost: 10,
      advertisingCost: 20,
      discount: 0,
      otherExpenses: 5,
      returnAllowanceRate: 5,
    });
    navigateTo('calculator');
  };

  const recentItems = calculationHistory.slice(0, 4);
  const topProducts = [...products].sort((a, b) => b.netProfit - a.netProfit).slice(0, 3);

  return (
    <div id="screen-home-dashboard" className="pb-24 pt-2 md:pt-4 select-none">
      
      {/* Top Welcome & Business Title (Desktop & Mobile Unified) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Namaste</span>
            <span>🙏</span>
            <span>•</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
              {settings.businessName || 'Seller Dashboard'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
            Seller Profitability Overview
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time margins, fee deductions & tax liabilities across Indian marketplaces
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="home-new-calc-cta"
            onClick={() => navigateTo('calculator')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs md:text-sm font-bold shadow-md shadow-indigo-600/20 transition-all"
          >
            <Calculator className="w-4 h-4" />
            <span>New Calculation</span>
          </button>

          <button
            id="home-add-sku-cta"
            onClick={() => navigateTo('add_product')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-xs md:text-sm font-bold shadow-xs transition-all"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>Add SKU</span>
          </button>
        </div>
      </div>

      {/* 4 Responsive KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {/* Card 1: Estimated Catalog Sales */}
        <div className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden group hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Catalog Value
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 mt-2 tracking-tight">
            {formatINR(metrics.totalSales, false)}
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <span>{metrics.totalItems} Active SKU{metrics.totalItems === 1 ? '' : 's'}</span>
          </div>
        </div>

        {/* Card 2: Estimated Net Profit */}
        <div className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden group hover:border-emerald-300 dark:hover:border-emerald-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Estimated Net Profit
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-xl md:text-2xl font-black mt-2 tracking-tight ${metrics.totalProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {formatINR(metrics.totalProfit, false)}
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="w-3 h-3" />
            <span>After GST & platform fees</span>
          </div>
        </div>

        {/* Card 3: Average Profit Margin */}
        <div className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden group hover:border-blue-300 dark:hover:border-blue-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Avg Profit Margin
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 mt-2 tracking-tight">
            {metrics.avgMargin.toFixed(1)}%
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            <span className={`w-2 h-2 rounded-full ${metrics.avgMargin >= 18 ? 'bg-emerald-500' : metrics.avgMargin >= 10 ? 'bg-amber-500' : 'bg-rose-500'}`} />
            <span>{metrics.avgMargin >= 18 ? 'Healthy Margins' : metrics.avgMargin >= 10 ? 'Moderate Margins' : 'Requires Review'}</span>
          </div>
        </div>

        {/* Card 4: Product Health Summary */}
        <div className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden group hover:border-amber-300 dark:hover:border-amber-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Catalog Health
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 mt-2 tracking-tight">
            {metrics.profitableCount} / {metrics.totalItems || 0}
          </div>
          <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold">
            <span className="text-emerald-600 dark:text-emerald-400">{metrics.profitableCount} Profitable</span>
            {metrics.lossCount > 0 && (
              <span className="text-rose-600 dark:text-rose-400">• {metrics.lossCount} Loss</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Responsive Grid Layout (Desktop 12-column layout, Tablet 2-col, Mobile single col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* Left Section (8 Columns on Desktop): Real Profit Hero + Marketplace Performance + Top SKUs */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          
          {/* Hero Card with Profit Velocity Sparkline */}
          <div 
            id="hero-profit-card"
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white p-5 md:p-6 shadow-xl shadow-indigo-950/20 border border-indigo-800/50"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                    Net Payout & Margin Velocity
                  </span>
                  <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <ArrowUpRight className="w-3 h-3" /> Real Data Calculation
                  </span>
                </div>
                <div className="mt-2 text-3xl md:text-4xl font-black tracking-tight text-white flex items-baseline gap-2">
                  <span>{formatINR(metrics.totalProfit, false)}</span>
                  <span className="text-xs md:text-sm font-normal text-indigo-300">Total Net Retained</span>
                </div>
                <p className="text-xs text-indigo-200/80 mt-1 max-w-md">
                  Calculated by applying accurate Indian marketplace commission matrices, fixed closing fees, weight-based courier charges, and 18% GST on services.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => navigateTo('reports')}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all"
                >
                  View Reports
                </button>
              </div>
            </div>

            {/* Micro Sparkline Chart */}
            <div className="mt-6 pt-4 border-t border-indigo-800/40">
              <div className="flex items-center justify-between text-xs text-indigo-300 mb-2">
                <span>SKU Profit Distribution Trend</span>
                <span className="font-semibold text-emerald-400">Peak {formatINR(Math.max(...metrics.trend), false)}</span>
              </div>
              <div className="w-full h-12">
                <Sparkline data={metrics.trend} color="#34D399" height={48} showPoints />
              </div>
            </div>
          </div>

          {/* Quick Actions Grid (Clean, High-Craftsmanship Buttons) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Quick Seller Tools
              </h2>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                Instant Calculators
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Tool 1: Profit Calculator */}
              <button
                id="quick-action-calc-profit"
                onClick={() => navigateTo('calculator')}
                className="flex flex-col p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 text-left hover:bg-indigo-100/70 dark:hover:bg-indigo-900/50 transition-all group shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform mb-2.5">
                  <Calculator className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                  Profit Calculator
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Commission, Shipping & GST
                </span>
              </button>

              {/* Tool 2: Add SKU */}
              <button
                id="quick-action-add-product"
                onClick={() => navigateTo('add_product')}
                className="flex flex-col p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all group shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform mb-2.5">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Add Catalog SKU
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Save & track margin status
                </span>
              </button>

              {/* Tool 3: GST Calculator */}
              <button
                id="quick-action-gst-calc"
                onClick={() => navigateTo('gst_calculator')}
                className="flex flex-col p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all group shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform mb-2.5">
                  <Receipt className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  GST Calculator
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Reverse GST & Slabs
                </span>
              </button>

              {/* Tool 4: Fee Matrix */}
              <button
                id="quick-action-fee-calc"
                onClick={() => navigateTo('fee_calculator')}
                className="flex flex-col p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all group shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform mb-2.5">
                  <Percent className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Fee Matrix
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Platform side-by-side
                </span>
              </button>
            </div>
          </div>

          {/* Top Products Margin Performance Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Top Margin SKUs in Catalog
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ranked by net cash earnings per unit
                </p>
              </div>
              <button
                onClick={() => navigateTo('products')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>View Catalog ({products.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No products saved yet</p>
                <p className="text-xs text-slate-500 mt-1 mb-3">Add your first product to see real catalog performance.</p>
                <button
                  onClick={() => navigateTo('add_product')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                >
                  Add First Product
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {topProducts.map((p) => {
                  const isProfit = p.netProfit > 0;
                  return (
                    <div
                      key={p.id}
                      onClick={() => loadProductIntoCalculator(p)}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <MarketplaceBadge marketplace={p.marketplace} size="sm" />
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                            {p.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                          <span>SKU: {p.sku}</span>
                          <span>•</span>
                          <span>Price: <strong className="text-slate-800 dark:text-slate-200">{formatINR(p.sellingPrice, false)}</strong></span>
                          <span>•</span>
                          <span>Cost: {formatINR(p.productCost, false)}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className={`text-sm font-bold ${isProfit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {isProfit ? `+${formatINR(p.netProfit, false)}` : formatINR(p.netProfit, false)}
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-block mt-0.5 ${
                          isProfit ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                        }`}>
                          {p.profitMargin.toFixed(1)}% margin
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Section (4 Columns on Desktop): Instant Live Calc Widget + Recent Calculations */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          
          {/* Quick Live Profit Estimator Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                    Live Quick Estimator
                  </h3>
                  <span className="text-[10px] text-slate-500">Instant on-dashboard math</span>
                </div>
              </div>
            </div>

            {/* Marketplace Pills */}
            <div className="grid grid-cols-4 gap-1.5 mb-3">
              {(['flipkart', 'amazon', 'meesho', 'shopify'] as const).map((mp) => (
                <button
                  key={mp}
                  type="button"
                  onClick={() => setQuickChannel(mp)}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold capitalize transition-all border ${
                    quickChannel === mp
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {mp === 'shopify' ? 'Shopify' : mp}
                </button>
              ))}
            </div>

            {/* Inputs: SP & Cost */}
            <div className="grid grid-cols-2 gap-2.5 mb-3">
              <div>
                <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  Selling Price (₹)
                </label>
                <input
                  type="number"
                  value={quickSp || ''}
                  onChange={(e) => setQuickSp(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  Product Cost (₹)
                </label>
                <input
                  type="number"
                  value={quickCost || ''}
                  onChange={(e) => setQuickCost(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            {/* Computed Mini Outcome */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 mb-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Estimated Net Profit</span>
                <span className={`font-black text-sm ${quickCalcResult.netProfit > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {formatINR(quickCalcResult.netProfit)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                <span>Profit Margin %</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {quickCalcResult.profitMarginPercent.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                <span>Platform Deductions</span>
                <span className="font-semibold text-rose-600">
                  -{formatINR(quickCalcResult.totalMarketplaceFees)}
                </span>
              </div>
            </div>

            <button
              onClick={handleLaunchFullCalc}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Open Detailed Breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Recent Calculations Feed */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Recent Calculations
              </h3>
              <button
                onClick={() => navigateTo('history')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
              >
                <span>View All</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {recentItems.length === 0 ? (
              <div className="text-center py-6">
                <Calculator className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No calculations recorded</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Use the calculator to audit selling fees.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentItems.map((item) => {
                  const isProfit = item.netProfit > 0;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setCurrentResult(item);
                        navigateTo('result');
                      }}
                      className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <MarketplaceBadge marketplace={item.input.marketplace} size="sm" />
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {item.input.productName || 'Product Calculation'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500">
                          SP: {formatINR(item.input.sellingPrice, false)} • Cost: {formatINR(item.input.productCost, false)}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-xs font-bold block ${isProfit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {isProfit ? `+${formatINR(item.netProfit, false)}` : formatINR(item.netProfit, false)}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {item.profitMarginPercent.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Seller Tip & GST Notice Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/60">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                  GST Input Tax Credit (ITC) Rule
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                  Marketplace platforms charge 18% GST on all commissions, logistics and fixed closing fees. You can claim full ITC against this in your GSTR-3B filings.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
