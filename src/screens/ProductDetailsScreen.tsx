import React from 'react';
import { useApp } from '../context/AppContext';
import { calculateProfit } from '../utils/calculatorEngine';
import { formatINR } from '../utils/formatters';
import { 
  ArrowLeft, 
  Edit3, 
  Copy, 
  Trash2, 
  Calculator, 
  Package, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Building2,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { MarketplaceBadge } from '../components/MarketplaceBadge';

export const ProductDetailsScreen: React.FC = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    navigateTo, 
    deleteProduct, 
    addProduct, 
    showConfirmDialog, 
    loadProductIntoCalculator 
  } = useApp();

  if (!selectedProduct) {
    return (
      <div className="p-8 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <Package className="w-12 h-12 text-slate-400 mb-3" />
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">No Product Selected</h2>
        <button
          onClick={() => navigateTo('products')}
          className="mt-4 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-xs"
        >
          View All Products
        </button>
      </div>
    );
  }

  // Live breakdown calculation
  const calc = calculateProfit({
    productName: selectedProduct.name,
    sku: selectedProduct.sku,
    productCost: selectedProduct.productCost,
    sellingPrice: selectedProduct.sellingPrice,
    quantity: 1,
    gstRate: selectedProduct.gstRate,
    marketplace: selectedProduct.marketplace,
    commissionRate: selectedProduct.commissionRate,
    fixedFee: selectedProduct.fixedFee,
    shippingFee: selectedProduct.shippingFee,
    paymentCollectionFeeRate: selectedProduct.marketplace === 'shopify' ? 2.36 : 2.0,
    paymentCollectionFixedFee: 0,
    packagingCost: selectedProduct.packagingCost,
    advertisingCost: selectedProduct.advertisingCost,
    discount: 0,
    otherExpenses: selectedProduct.otherExpenses,
    returnAllowanceRate: selectedProduct.returnAllowanceRate,
  });

  const isProfitable = calc.netProfit > 0;

  const handleDuplicate = () => {
    const duplicated = addProduct({
      name: `${selectedProduct.name} (Copy)`,
      sku: `${selectedProduct.sku}-DUP`,
      category: selectedProduct.category,
      marketplace: selectedProduct.marketplace,
      productCost: selectedProduct.productCost,
      sellingPrice: selectedProduct.sellingPrice,
      gstRate: selectedProduct.gstRate,
      commissionRate: selectedProduct.commissionRate,
      fixedFee: selectedProduct.fixedFee,
      shippingFee: selectedProduct.shippingFee,
      packagingCost: selectedProduct.packagingCost,
      advertisingCost: selectedProduct.advertisingCost,
      otherExpenses: selectedProduct.otherExpenses,
      returnAllowanceRate: selectedProduct.returnAllowanceRate,
    });
    setSelectedProduct(duplicated);
  };

  const handleDelete = () => {
    showConfirmDialog(
      'Delete Product',
      `Are you sure you want to delete "${selectedProduct.name}"? This action cannot be undone.`,
      () => {
        deleteProduct(selectedProduct.id);
        navigateTo('products');
      },
      'Delete Product'
    );
  };

  return (
    <div id="screen-product-details" className="pb-28 pt-2 md:pt-4 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <button
            id="details-back-btn"
            onClick={() => navigateTo('products')}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Product Margin Breakdown
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Complete unit economics, taxes, marketplace cuts & net returns
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="details-edit-btn"
            onClick={() => navigateTo('edit_product')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors text-xs font-bold"
            title="Edit"
          >
            <Edit3 className="w-4 h-4" />
            <span className="hidden sm:inline">Edit SKU</span>
          </button>
          <button
            id="details-delete-btn"
            onClick={handleDelete}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): SKU Profile & Breakdown */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Hero Header Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                <Package className="w-8 h-8" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <MarketplaceBadge marketplace={selectedProduct.marketplace} size="sm" />
                  <span className="text-xs text-slate-500 font-mono font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    {selectedProduct.sku}
                  </span>
                </div>
                <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {selectedProduct.name}
                </h2>
                <span className="text-xs text-slate-400 mt-0.5 block">{selectedProduct.category}</span>
              </div>
            </div>
          </div>

          {/* Pricing & Unit Economics */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              1. Revenue & Pricing
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Customer Selling Price (MRP)</span>
                <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">{formatINR(selectedProduct.sellingPrice)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">GST Rate Applied</span>
                <span className="font-bold text-indigo-600">{selectedProduct.gstRate}%</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Sourcing / Manufacturing Cost</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{formatINR(selectedProduct.productCost)}</span>
              </div>
            </div>
          </div>

          {/* Marketplace Fees Breakdown */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              2. Marketplace Channel Deductions
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Commission ({selectedProduct.commissionRate}%)</span>
                <span className="font-semibold text-rose-500">-{formatINR(calc.commissionAmount)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Fixed Closing Fee</span>
                <span className="font-semibold text-rose-500">-{formatINR(selectedProduct.fixedFee)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Shipping / Fulfillment</span>
                <span className="font-semibold text-rose-500">-{formatINR(selectedProduct.shippingFee)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-t border-slate-200 dark:border-slate-700 font-bold">
                <span className="text-slate-800 dark:text-slate-200">Total Deductions</span>
                <span className="text-rose-600">-{formatINR(calc.totalMarketplaceFees)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (5 cols): Margins, Bank Settlement & Quick Actions */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Net Profit Card */}
          <div className={`p-6 rounded-3xl border shadow-lg ${
            isProfitable 
              ? 'bg-gradient-to-br from-emerald-950/90 via-slate-900 to-slate-950 text-white border-emerald-800/60 shadow-emerald-950/20' 
              : 'bg-gradient-to-br from-rose-950/90 via-slate-900 to-slate-950 text-white border-rose-800/60 shadow-rose-950/20'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Net Profit Per Sale
              </span>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                isProfitable ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {isProfitable ? 'PROFITABLE' : 'LOSS'}
              </span>
            </div>

            <div className="mt-4">
              <div className="text-3xl md:text-4xl font-black">
                <span className={isProfitable ? 'text-emerald-400' : 'text-rose-400'}>
                  {isProfitable ? `+${formatINR(calc.netProfit)}` : formatINR(calc.netProfit)}
                </span>
              </div>
              <div className="text-sm font-bold text-slate-300 mt-1">
                {calc.profitMarginPercent.toFixed(1)}% Net Margin
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Bank Settlement:</span>
                <span className="text-xl font-extrabold text-emerald-400 mt-0.5 block">
                  {formatINR(calc.moneyReceivedFromMarketplace)}
                </span>
              </div>
              <Building2 className="w-8 h-8 text-indigo-400/50" />
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              SKU Actions
            </h3>

            <button
              onClick={() => loadProductIntoCalculator(selectedProduct)}
              className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>Simulate in Live Profit Calculator</span>
            </button>

            <button
              onClick={handleDuplicate}
              className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Copy className="w-4 h-4" />
              <span>Duplicate SKU</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
