import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Bookmark, 
  Share2, 
  CheckCircle2, 
  AlertCircle,
  RotateCcw,
  Target,
  FileText,
  Copy,
  Loader2
} from 'lucide-react';
import { formatINR, formatPercentRaw } from '../utils/formatters';
import { MarketplaceBadge } from '../components/MarketplaceBadge';
import { DonutBreakdownChart } from '../components/MicroCharts';
import confetti from 'canvas-confetti';
import { BottomSheet } from '../components/BottomSheet';

export const CalculationResultScreen: React.FC = () => {
  const { 
    currentResult, 
    navigateTo, 
    saveCalculationToHistory, 
    showSnackbar,
    setCalculatorDraft,
    settings
  } = useApp();

  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState<boolean>(true);
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
  const [targetMarginInput, setTargetMarginInput] = useState<number>(100);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  useEffect(() => {
    if (currentResult && currentResult.profitMarginPercent >= 20) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {}
    }
  }, [currentResult]);

  if (!currentResult) {
    return (
      <div className="p-8 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <AlertCircle className="w-12 h-12 text-slate-400 mb-3" />
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">No Calculation Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">Please calculate a product first.</p>
        <button
          onClick={() => navigateTo('calculator')}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-xs"
        >
          Go to Calculator
        </button>
      </div>
    );
  }

  const {
    input,
    netProfit,
    profitMarginPercent,
    roiPercent,
    isProfitable,
    grossRevenue,
    gstAmount,
    totalMarketplaceFees,
    productCostTotal,
    packagingCostTotal,
    advertisingCostTotal,
    otherExpensesTotal,
    returnRiskCost,
    totalCosts,
    moneyReceivedFromMarketplace,
    breakEvenSellingPrice,
    recommendedSellingPriceForTarget,
  } = currentResult;

  // Breakdown chart slices
  const chartSlices = [
    { label: 'Product Cost', value: productCostTotal, color: '#3B82F6' },
    { label: 'Marketplace Fees', value: totalMarketplaceFees, color: '#F59E0B' },
    { label: 'GST Payable', value: gstAmount, color: '#8B5CF6' },
    { label: 'Operating & Ads', value: packagingCostTotal + advertisingCostTotal + otherExpensesTotal + returnRiskCost, color: '#EC4899' },
  ].filter((s) => s.value > 0);

  const handleShare = () => {
    const text = `📊 *SellerProfit Calculation: ${input.productName || 'Product'}*
🛒 Channel: ${input.marketplace.toUpperCase()}
💰 Selling Price: ${formatINR(input.sellingPrice)}
📦 Product Cost: ${formatINR(input.productCost)}
🏛️ GST Payable: ${formatINR(gstAmount)}
🏷️ Platform Fees: ${formatINR(totalMarketplaceFees)}
📈 *Net Profit: ${formatINR(netProfit)} (${profitMarginPercent.toFixed(1)}% margin)*
🎯 Break-even Price: ${formatINR(breakEvenSellingPrice)}
_Calculated via SellerProfit App_`;

    navigator.clipboard?.writeText(text);
    showSnackbar('Formatted summary copied to clipboard! 📋', 'success');
    setShareModalOpen(false);
  };

  const handleDownloadPDF = async () => {
    if (isExportingPdf) return;
    setIsExportingPdf(true);
    try {
      const { generateCalculationPdf } = await import('../utils/pdfExport');
      generateCalculationPdf(currentResult, settings);
      showSnackbar('PDF downloaded successfully', 'success');
    } catch (err) {
      console.error('PDF export failed', err);
      showSnackbar('PDF export failed. Please try again.', 'error');
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div id="screen-calculation-result" className="pb-28 pt-2 md:pt-4 select-none">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <button
            id="result-back-btn"
            onClick={() => navigateTo('calculator')}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
            aria-label="Back to Calculator"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <MarketplaceBadge marketplace={input.marketplace} size="sm" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Unit Economics Audit
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
              Profit & Loss Analysis
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="result-save-btn"
            onClick={() => saveCalculationToHistory(currentResult)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors text-xs font-bold shadow-xs"
            title="Save Calculation"
          >
            <Bookmark className="w-4 h-4" />
            <span className="hidden sm:inline">Save</span>
          </button>
          <button
            id="result-share-btn"
            onClick={() => setShareModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors text-xs font-bold shadow-xs"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isExportingPdf}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white transition-colors text-xs font-bold shadow-xs"
            title={isExportingPdf ? 'Generating PDF...' : 'Download PDF'}
          >
            {isExportingPdf ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{isExportingPdf ? 'Generating...' : 'PDF'}</span>
          </button>
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): Main Result Banner, Donut Chart & Exec Summary */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Main Big Result Card */}
          <div 
            id="profit-hero-banner"
            className={`rounded-3xl p-6 border text-white shadow-xl relative overflow-hidden ${
              isProfitable 
                ? 'bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-950 border-emerald-700/60 shadow-emerald-950/25' 
                : 'bg-gradient-to-br from-rose-800 via-rose-950 to-slate-950 border-rose-700/60 shadow-rose-950/25'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/90 truncate max-w-[200px]">
                {input.productName || 'Custom Product'}
              </span>

              <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                isProfitable ? 'bg-white/20 text-emerald-100' : 'bg-white/20 text-rose-100'
              }`}>
                {isProfitable ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Profitable Unit</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Loss Making</span>
                  </>
                )}
              </div>
            </div>

            <div className="mt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-white/80 block">
                Net In-Pocket Profit (Per Unit)
              </span>
              <div className="text-4xl md:text-5xl font-black tracking-tight mt-1">
                {isProfitable ? `+${formatINR(netProfit)}` : formatINR(netProfit)}
              </div>
            </div>

            {/* 3 Metric Pills: Margin, ROI, Bank Payout */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-white/15 text-center">
              <div className="bg-black/25 backdrop-blur-xs rounded-2xl p-2.5">
                <span className="text-[10px] text-white/75 block">Profit Margin</span>
                <span className="text-base font-extrabold text-white block mt-0.5">
                  {profitMarginPercent.toFixed(1)}%
                </span>
              </div>

              <div className="bg-black/25 backdrop-blur-xs rounded-2xl p-2.5">
                <span className="text-[10px] text-white/75 block">Return on Cost (ROI)</span>
                <span className="text-base font-extrabold text-white block mt-0.5">
                  {roiPercent.toFixed(1)}%
                </span>
              </div>

              <div className="bg-black/25 backdrop-blur-xs rounded-2xl p-2.5">
                <span className="text-[10px] text-white/75 block">Bank Settlement</span>
                <span className="text-base font-extrabold text-white block mt-0.5">
                  {formatINR(moneyReceivedFromMarketplace, false)}
                </span>
              </div>
            </div>
          </div>

          {/* Donut Chart Visual Breakdown */}
          {chartSlices.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Cost Allocation Matrix
              </h2>
              <DonutBreakdownChart slices={chartSlices} />
            </div>
          )}

          {/* Executive Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Executive Financial Statement
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Customer Selling Price (Gross Revenue)</span>
                <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">{formatINR(grossRevenue)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                <span>Product Sourcing Cost</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">-{formatINR(productCostTotal)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                <span>GST Tax on Product ({input.gstRate}%)</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">-{formatINR(gstAmount)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                <span>Marketplace Commissions & Shipping</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">-{formatINR(totalMarketplaceFees)}</span>
              </div>
              {(packagingCostTotal + advertisingCostTotal + otherExpensesTotal + returnRiskCost) > 0 && (
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                  <span>Operating, Ads & Return Risk</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    -{formatINR(packagingCostTotal + advertisingCostTotal + otherExpensesTotal + returnRiskCost)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 font-black text-base">
                <span className="text-slate-900 dark:text-slate-100">Net Profit in Bank:</span>
                <span className={isProfitable ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                  {formatINR(netProfit)}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (5 cols): Recommended Selling Price, Detailed Fee Breakdown & Actions */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Target Recommended Selling Price */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50/60 dark:from-indigo-950/40 dark:to-slate-900 rounded-3xl p-5 border border-indigo-100 dark:border-indigo-900/60 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-950 dark:text-indigo-200">
                Recommended Price Targets
              </h2>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                    Target ₹{targetMarginInput} Profit
                  </span>
                  <span className="text-[10px] text-slate-500">Sell at this price to make ₹{targetMarginInput}</span>
                </div>
                <span className="text-base font-black text-indigo-600 dark:text-indigo-400">
                  {formatINR(recommendedSellingPriceForTarget, false)}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                    Break-Even Price (Zero Profit)
                  </span>
                  <span className="text-[10px] text-slate-500">Do not sell below this threshold</span>
                </div>
                <span className="text-base font-bold text-slate-700 dark:text-slate-300">
                  {formatINR(breakEvenSellingPrice, false)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Center */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Next Steps
            </h3>

            <button
              onClick={() => {
                setCalculatorDraft(input);
                navigateTo('calculator');
              }}
              className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Modify in Calculator</span>
            </button>

            <button
              onClick={() => saveCalculationToHistory(currentResult)}
              className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Bookmark className="w-4 h-4" />
              <span>Save to History Logs</span>
            </button>
          </div>

        </div>

      </div>

      {/* Share Modal */}
      {shareModalOpen && (
        <BottomSheet isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} title="Share Calculation">
          <div className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Share a clean text summary of this calculation with your partners or supplier:
            </p>
            <button
              onClick={handleShare}
              className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Formatted WhatsApp Message</span>
            </button>
          </div>
        </BottomSheet>
      )}

    </div>
  );
};
