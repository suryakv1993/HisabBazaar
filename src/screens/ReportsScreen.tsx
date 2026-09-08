import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Download, 
  TrendingUp, 
  ShoppingBag, 
  FileSpreadsheet, 
  FileText,
  PieChart,
  Percent,
  Receipt,
  Loader2
} from 'lucide-react';
import { formatINR } from '../utils/formatters';
import { AreaTrendChart, DonutBreakdownChart } from '../components/MicroCharts';
import { BottomSheet } from '../components/BottomSheet';
import { MarketplaceBadge } from '../components/MarketplaceBadge';

type DateFilter = 'all' | '30days' | '7days' | 'today';

export const ReportsScreen: React.FC = () => {
  const { calculationHistory, products, showSnackbar, settings } = useApp();

  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [activeChartTab, setActiveChartTab] = useState<'profit' | 'sales' | 'margin'>('profit');
  const [exportSheetOpen, setExportSheetOpen] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  // Filter calculation history records by selected timeframe
  const filteredRecords = useMemo(() => {
    const now = Date.now();
    const oneDay = 86400000;
    const sevenDays = 86400000 * 7;
    const thirtyDays = 86400000 * 30;

    if (calculationHistory.length > 0) {
      if (dateFilter === 'today') return calculationHistory.filter((c) => now - c.timestamp <= oneDay);
      if (dateFilter === '7days') return calculationHistory.filter((c) => now - c.timestamp <= sevenDays);
      if (dateFilter === '30days') return calculationHistory.filter((c) => now - c.timestamp <= thirtyDays);
      return calculationHistory;
    }
    return [];
  }, [calculationHistory, dateFilter]);

  // Dynamically compute real aggregates from actual user records (or products catalog)
  const report = useMemo(() => {
    // If we have filtered calculation records, use them
    if (filteredRecords.length > 0) {
      const totalSales = filteredRecords.reduce((s, r) => s + (r.grossRevenue || r.input.sellingPrice || 0), 0);
      const totalProfit = filteredRecords.reduce((s, r) => s + (r.netProfit || 0), 0);
      const totalFees = filteredRecords.reduce((s, r) => s + (r.totalMarketplaceFees || 0), 0);
      const totalGst = filteredRecords.reduce((s, r) => s + (r.gstAmount || 0), 0);
      const totalProductCost = filteredRecords.reduce((s, r) => s + (r.productCostTotal || r.input.productCost || 0), 0);
      const totalAds = filteredRecords.reduce((s, r) => s + (r.advertisingCostTotal || r.input.advertisingCost || 0), 0);
      const totalShipping = filteredRecords.reduce((s, r) => s + (r.shippingFee || r.input.shippingFee || 0), 0);
      const totalExpenses = totalProductCost + totalFees + totalGst + totalAds + totalShipping;
      const margin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;
      const orders = filteredRecords.length;
      const aov = orders > 0 ? totalSales / orders : 0;

      // Build real trend data points
      const labels = filteredRecords.slice(0, 7).map((r, i) => {
        const d = new Date(r.timestamp);
        return `${d.getDate()}/${d.getMonth() + 1}`;
      });
      const profitTrend = filteredRecords.slice(0, 7).map((r) => Math.round(r.netProfit));
      const salesTrend = filteredRecords.slice(0, 7).map((r) => Math.round(r.input.sellingPrice));
      const marginTrend = filteredRecords.slice(0, 7).map((r) => parseFloat(r.profitMarginPercent.toFixed(1)));

      return {
        totalSales,
        totalProfit,
        totalExpenses,
        totalFees,
        totalGst,
        totalProductCost,
        totalShipping,
        totalAds,
        orders,
        aov,
        margin,
        labels: labels.length > 1 ? labels : ['Day 1', 'Day 2', 'Day 3'],
        profitTrend: profitTrend.length > 1 ? profitTrend : [totalProfit * 0.7, totalProfit],
        salesTrend: salesTrend.length > 1 ? salesTrend : [totalSales * 0.7, totalSales],
        marginTrend: marginTrend.length > 1 ? marginTrend : [margin, margin],
      };
    }

    // Fallback: Compute real metrics from saved catalog products
    if (products.length > 0) {
      const totalSales = products.reduce((s, p) => s + p.sellingPrice, 0);
      const totalProfit = products.reduce((s, p) => s + p.netProfit, 0);
      const totalProductCost = products.reduce((s, p) => s + p.productCost, 0);
      const totalFees = products.reduce((s, p) => s + (p.commissionRate / 100 * p.sellingPrice + p.fixedFee), 0);
      const totalShipping = products.reduce((s, p) => s + p.shippingFee, 0);
      const totalAds = products.reduce((s, p) => s + p.advertisingCost, 0);
      const totalGst = products.reduce((s, p) => s + (p.sellingPrice * (p.gstRate / (100 + p.gstRate))), 0);
      const totalExpenses = totalProductCost + totalFees + totalShipping + totalAds + totalGst;
      const margin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;
      const orders = products.length;
      const aov = orders > 0 ? totalSales / orders : 0;

      const labels = products.slice(0, 6).map((p, i) => `SKU ${i + 1}`);
      const profitTrend = products.slice(0, 6).map((p) => Math.max(10, Math.round(p.netProfit)));
      const salesTrend = products.slice(0, 6).map((p) => Math.round(p.sellingPrice));
      const marginTrend = products.slice(0, 6).map((p) => parseFloat(p.profitMargin.toFixed(1)));

      return {
        totalSales,
        totalProfit,
        totalExpenses,
        totalFees,
        totalGst,
        totalProductCost,
        totalShipping,
        totalAds,
        orders,
        aov,
        margin,
        labels,
        profitTrend,
        salesTrend,
        marginTrend,
      };
    }

    // Clean Zero State if neither history nor products exist
    return {
      totalSales: 0,
      totalProfit: 0,
      totalExpenses: 0,
      totalFees: 0,
      totalGst: 0,
      totalProductCost: 0,
      totalShipping: 0,
      totalAds: 0,
      orders: 0,
      aov: 0,
      margin: 0,
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      profitTrend: [0, 0, 0, 0, 0],
      salesTrend: [0, 0, 0, 0, 0],
      marginTrend: [0, 0, 0, 0, 0],
    };
  }, [filteredRecords, products]);

  // Real Cost Slices for Donut Chart
  const expenseSlices = useMemo(() => {
    if (report.totalExpenses <= 0) {
      return [
        { label: 'Inventory Cost', value: 100, color: '#3B82F6' },
      ];
    }
    return [
      { label: 'Product Inventory', value: report.totalProductCost, color: '#3B82F6' },
      { label: 'Marketplace Fees', value: report.totalFees, color: '#F59E0B' },
      { label: 'GST Payable', value: report.totalGst, color: '#8B5CF6' },
      { label: 'Shipping & Ads', value: report.totalShipping + report.totalAds, color: '#10B981' },
    ].filter((s) => s.value > 0);
  }, [report]);

  // Real Marketplace Channel Performance Matrix
  const channelBreakdown = useMemo(() => {
    const channels: { [key: string]: { count: number; sales: number; profit: number; fees: number } } = {
      flipkart: { count: 0, sales: 0, profit: 0, fees: 0 },
      amazon: { count: 0, sales: 0, profit: 0, fees: 0 },
      meesho: { count: 0, sales: 0, profit: 0, fees: 0 },
      shopify: { count: 0, sales: 0, profit: 0, fees: 0 },
    };

    const sourceList = calculationHistory.length > 0 ? calculationHistory : products;

    sourceList.forEach((item: any) => {
      const channel = item.input ? item.input.marketplace : item.marketplace;
      const sp = item.input ? item.input.sellingPrice : item.sellingPrice;
      const profit = item.netProfit;
      const fee = item.totalMarketplaceFees || (sp * 0.12);

      if (channels[channel]) {
        channels[channel].count += 1;
        channels[channel].sales += sp;
        channels[channel].profit += profit;
        channels[channel].fees += fee;
      }
    });

    return channels;
  }, [calculationHistory, products]);

  // Real Dynamic CSV Export generated from actual user data
  const handleExportCSV = () => {
    const rows = [
      ['Date', 'Channel', 'Product Name', 'SKU', 'Selling Price (INR)', 'Product Cost (INR)', 'GST Amount (INR)', 'Platform Fees (INR)', 'Net Profit (INR)', 'Profit Margin (%)']
    ];

    if (calculationHistory.length > 0) {
      calculationHistory.forEach((item) => {
        rows.push([
          new Date(item.timestamp).toISOString().split('T')[0],
          item.input.marketplace.toUpperCase(),
          `"${(item.input.productName || 'Product').replace(/"/g, '""')}"`,
          item.input.sku || 'N/A',
          item.input.sellingPrice.toString(),
          item.input.productCost.toString(),
          item.gstAmount.toFixed(2),
          item.totalMarketplaceFees.toFixed(2),
          item.netProfit.toFixed(2),
          item.profitMarginPercent.toFixed(1) + '%'
        ]);
      });
    } else if (products.length > 0) {
      products.forEach((p) => {
        rows.push([
          new Date(p.createdAt).toISOString().split('T')[0],
          p.marketplace.toUpperCase(),
          `"${p.name.replace(/"/g, '""')}"`,
          p.sku,
          p.sellingPrice.toString(),
          p.productCost.toString(),
          (p.sellingPrice * (p.gstRate / (100 + p.gstRate))).toFixed(2),
          (p.commissionRate / 100 * p.sellingPrice + p.fixedFee + p.shippingFee).toFixed(2),
          p.netProfit.toFixed(2),
          p.profitMargin.toFixed(1) + '%'
        ]);
      });
    } else {
      showSnackbar('No data available to export', 'error');
      return;
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SellerProfit_RealReport_${dateFilter}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showSnackbar('Real CSV report downloaded successfully! 📊', 'success');
    setExportSheetOpen(false);
  };

  const dateFilterLabel =
    dateFilter === 'today' ? 'Today' : dateFilter === '7days' ? '7 Days' : dateFilter === '30days' ? '30 Days' : 'All Records';

  const handleExportPDF = async () => {
    if (isExportingPdf) return;
    setIsExportingPdf(true);
    try {
      const { generateReportPdf } = await import('../utils/pdfExport');
      generateReportPdf(report, calculationHistory, products, settings, dateFilterLabel);
      setExportSheetOpen(false);
      showSnackbar('PDF report downloaded successfully', 'success');
    } catch (err) {
      console.error('PDF export failed', err);
      showSnackbar('PDF export failed. Please try again.', 'error');
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div id="screen-business-reports" className="pb-28 pt-2 md:pt-4 select-none">
      
      {/* Header with Title & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Audit & Analytics
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {settings.businessName || 'Business Reports'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
            Business Financial Reports
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track net profitability, platform fee splits & GST input tax credit
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Date Filter Pills */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            {(['all', '30days', '7days', 'today'] as const).map((filterKey) => (
              <button
                key={filterKey}
                onClick={() => setDateFilter(filterKey)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  dateFilter === filterKey
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {filterKey === 'all' ? 'All Records' : filterKey === '30days' ? '30 Days' : filterKey === '7days' ? '7 Days' : 'Today'}
              </button>
            ))}
          </div>

          {/* Export Action Button */}
          <button
            id="reports-export-btn"
            onClick={() => setExportSheetOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* 4 Responsive Financial Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {/* Card 1: Gross Sales */}
        <div className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Gross Revenue</span>
            <ShoppingBag className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 mt-2 tracking-tight">
            {formatINR(report.totalSales, false)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {report.orders} tracked calculation{report.orders === 1 ? '' : 's'}
          </div>
        </div>

        {/* Card 2: Net Profit */}
        <div className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Net Profit</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className={`text-xl md:text-2xl font-black mt-2 tracking-tight ${report.totalProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {formatINR(report.totalProfit, false)}
          </div>
          <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
            {report.margin.toFixed(1)}% Net Margin
          </div>
        </div>

        {/* Card 3: Platform Fees */}
        <div className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Marketplace Fees</span>
            <Percent className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 mt-2 tracking-tight">
            {formatINR(report.totalFees, false)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Commissions, Fixed & Courier
          </div>
        </div>

        {/* Card 4: GST Liability */}
        <div className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>GST Liability (Output)</span>
            <Receipt className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 mt-2 tracking-tight">
            {formatINR(report.totalGst, false)}
          </div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
            ITC eligible on platform fee
          </div>
        </div>
      </div>

      {/* Analytics Charts Row: Left Trend Graph + Right Donut Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* Trend Graph (7 Columns on Desktop) */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-5 md:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-sm md:text-base font-bold text-slate-900 dark:text-slate-100">
                Performance Velocity
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Historical trend across {report.orders} items
              </p>
            </div>

            {/* Metric Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveChartTab('profit')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeChartTab === 'profit'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                Profit
              </button>
              <button
                onClick={() => setActiveChartTab('sales')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeChartTab === 'sales'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                Revenue
              </button>
              <button
                onClick={() => setActiveChartTab('margin')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeChartTab === 'margin'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                Margin %
              </button>
            </div>
          </div>

          <div className="w-full pt-2">
            <AreaTrendChart
              labels={report.labels}
              values={
                activeChartTab === 'profit'
                  ? report.profitTrend
                  : activeChartTab === 'sales'
                  ? report.salesTrend
                  : report.marginTrend
              }
              currency={activeChartTab !== 'margin'}
              color={
                activeChartTab === 'profit'
                  ? '#10B981'
                  : activeChartTab === 'sales'
                  ? '#4F46E5'
                  : '#2563EB'
              }
            />
          </div>
        </div>

        {/* Cost Deductions Donut Chart (5 Columns on Desktop) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-5 md:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm md:text-base font-bold text-slate-900 dark:text-slate-100">
                Cost & Fee Breakdown
              </h2>
              <PieChart className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Deductions relative to {formatINR(report.totalSales, false)} sales
            </p>

            <DonutBreakdownChart slices={expenseSlices} centerLabel="Expenses" />
          </div>

          {/* Breakdown percentage legend */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
            {expenseSlices.map((slice, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
                <span className="text-slate-600 dark:text-slate-300 truncate">{slice.label}</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 ml-auto">
                  {formatINR(slice.value, false)}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Channel Profitability Matrix (Responsive Table/Cards) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 md:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm md:text-base font-bold text-slate-900 dark:text-slate-100">
              Channel Margin Matrix
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Compare actual earnings across Amazon, Flipkart, Meesho & Shopify
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60">
            Real Data Comparison
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(['flipkart', 'amazon', 'meesho', 'shopify'] as const).map((channel) => {
            const data = channelBreakdown[channel];
            const marginPercent = data.sales > 0 ? (data.profit / data.sales) * 100 : 0;
            return (
              <div
                key={channel}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800"
              >
                <div className="flex items-center justify-between mb-3">
                  <MarketplaceBadge marketplace={channel} size="md" />
                  <span className="text-xs font-semibold text-slate-500">
                    {data.count} SKU{data.count === 1 ? '' : 's'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Sales:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{formatINR(data.sales, false)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Platform Fees:</span>
                    <span className="font-medium text-rose-600">-{formatINR(data.fees, false)}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-slate-200 dark:border-slate-700 font-bold">
                    <span className="text-slate-700 dark:text-slate-300">Net Profit:</span>
                    <span className={data.profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}>
                      {formatINR(data.profit, false)} ({marginPercent.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Export Options Bottom Sheet */}
      <BottomSheet
        isOpen={exportSheetOpen}
        onClose={() => setExportSheetOpen(false)}
        title="Export Financial Report"
        subtitle="Download records for accounting, CA audit & tax filings"
      >
        <div className="p-4 space-y-3">
          <button
            onClick={handleExportCSV}
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  Export to CSV / Excel
                </span>
                <span className="text-[10px] text-slate-500">
                  Full itemized SKU, fee breakdown & net profit table
                </span>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </button>

          <button
            onClick={handleExportPDF}
            disabled={isExportingPdf}
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between transition-colors group disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                {isExportingPdf ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <FileText className="w-5 h-5" />
                )}
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  {isExportingPdf ? 'Generating PDF...' : 'Download PDF Report'}
                </span>
                <span className="text-[10px] text-slate-500">
                  {isExportingPdf ? 'Preparing your report' : 'Full itemized report with summary & SKU table'}
                </span>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </button>
        </div>
      </BottomSheet>

    </div>
  );
};
