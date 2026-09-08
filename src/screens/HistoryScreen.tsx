import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProfitCalculationResult } from '../types';
import { formatINR, formatDateRelative, formatDateFull } from '../utils/formatters';
import { 
  History, 
  Trash2, 
  Calculator, 
  Copy, 
  Eye, 
  Search
} from 'lucide-react';
import { MarketplaceBadge } from '../components/MarketplaceBadge';

export const HistoryScreen: React.FC = () => {
  const { 
    calculationHistory, 
    deleteCalculationFromHistory, 
    clearAllHistory, 
    navigateTo, 
    setCurrentResult, 
    setCalculatorDraft, 
    showConfirmDialog,
    showSnackbar,
    saveCalculationToHistory 
  } = useApp();

  const [filterPeriod, setFilterPeriod] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const now = Date.now();
  const oneDay = 86400000;
  const oneWeek = 86400000 * 7;
  const oneMonth = 86400000 * 30;

  const filteredHistory = calculationHistory.filter((item) => {
    // Search
    const matchesSearch = 
      item.input.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.input.marketplace.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    // Time filter
    if (filterPeriod === 'today') return now - item.timestamp <= oneDay;
    if (filterPeriod === 'week') return now - item.timestamp <= oneWeek;
    if (filterPeriod === 'month') return now - item.timestamp <= oneMonth;
    return true;
  });

  const handleView = (item: ProfitCalculationResult) => {
    setCurrentResult(item);
    navigateTo('result');
  };

  const handleDuplicate = (item: ProfitCalculationResult) => {
    const duplicated: ProfitCalculationResult = {
      ...item,
      id: `calc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      input: {
        ...item.input,
        productName: `${item.input.productName || 'Calculation'} (Copy)`,
      },
    };
    saveCalculationToHistory(duplicated);
  };

  const handleDelete = (item: ProfitCalculationResult) => {
    showConfirmDialog(
      'Delete Calculation',
      `Delete calculation record for "${item.input.productName || 'Product'}"?`,
      () => deleteCalculationFromHistory(item.id),
      'Delete'
    );
  };

  const handleClearAll = () => {
    showConfirmDialog(
      'Clear All History',
      'Are you sure you want to delete all previous calculation records? This cannot be undone.',
      clearAllHistory,
      'Clear All'
    );
  };

  return (
    <div id="screen-calculation-history" className="pb-28 pt-2 md:pt-4 select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Audits & Financial Logs
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
            Calculation History
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {calculationHistory.length} saved profit calculation{calculationHistory.length === 1 ? '' : 's'} across e-commerce channels
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {calculationHistory.length > 0 && (
            <button
              id="history-clear-all-btn"
              onClick={handleClearAll}
              className="text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 px-3 py-2 rounded-xl transition-colors border border-rose-200/80 dark:border-rose-900"
            >
              Clear All Logs
            </button>
          )}

          <button
            onClick={() => navigateTo('calculator')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>New Calculation</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs mb-6 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name, SKU or marketplace channel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600"
          />
        </div>

        {/* Period Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: 'all', label: 'All Time' },
            { id: 'today', label: 'Today' },
            { id: 'week', label: 'Past 7 Days' },
            { id: 'month', label: 'Past 30 Days' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterPeriod(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                filterPeriod === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* History Cards Grid (1 col mobile, 2 col tablet, 3 col desktop) */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-slate-200/80 dark:border-slate-800 text-center shadow-xs">
          <History className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {searchQuery ? 'No matching calculations found' : 'No calculations yet'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            {searchQuery
              ? `No calculation logs matched "${searchQuery}".`
              : 'Calculate your product net margins and saved simulations will appear here.'}
          </p>
          <button
            onClick={() => navigateTo('calculator')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 inline-flex items-center gap-2 transition-colors"
          >
            <Calculator className="w-4 h-4" />
            <span>Open Profit Calculator</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHistory.map((item) => {
            const isProfitable = item.netProfit > 0;
            return (
              <div
                key={item.id}
                id={`history-row-${item.id}`}
                className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <MarketplaceBadge marketplace={item.input.marketplace} size="sm" />
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isProfitable 
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' 
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}>
                      {item.profitMarginPercent.toFixed(1)}% Margin
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    {item.input.productName || 'Untitled Item'}
                  </h3>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {formatDateRelative(item.timestamp)} ({formatDateFull(item.timestamp)})
                  </span>

                  {/* Net Profit Big Display */}
                  <div className="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Net Profit</span>
                      <div className={`text-base font-black ${
                        isProfitable ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {isProfitable ? `+${formatINR(item.netProfit, false)}` : formatINR(item.netProfit, false)}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Bank Settlement</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {formatINR(item.moneyReceivedFromMarketplace, false)}
                      </span>
                    </div>
                  </div>

                  {/* Metrics Summary */}
                  <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <span className="text-[10px] text-slate-400 block">Selling Price</span>
                      <span className="font-extrabold text-slate-900 dark:text-slate-100">{formatINR(item.input.sellingPrice, false)}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <span className="text-[10px] text-slate-400 block">Product Cost</span>
                      <span className="font-semibold text-slate-600 dark:text-slate-300">{formatINR(item.input.productCost, false)}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <span className="text-[10px] text-slate-400 block">Fees + GST</span>
                      <span className="font-semibold text-rose-500">-{formatINR(item.gstAmount + item.totalMarketplaceFees, false)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions: View, Duplicate, Delete */}
                <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleView(item)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Breakdown</span>
                  </button>

                  <button
                    onClick={() => handleDuplicate(item)}
                    className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Duplicate"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(item)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
