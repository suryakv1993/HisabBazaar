import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductItem } from '../types';
import { 
  Plus, 
  Search, 
  TrendingUp, 
  AlertTriangle, 
  TrendingDown, 
  ChevronRight,
  PackageOpen,
  Calculator
} from 'lucide-react';
import { formatINR } from '../utils/formatters';
import { MarketplaceBadge } from '../components/MarketplaceBadge';

export const ProductsScreen: React.FC = () => {
  const { products, navigateTo, setSelectedProduct, loadProductIntoCalculator } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'profitable' | 'low_margin' | 'loss'>('all');

  const filteredProducts = products.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'all') return true;
    return p.status === activeFilter;
  });

  const handleProductClick = (product: ProductItem) => {
    setSelectedProduct(product);
    navigateTo('product_details');
  };

  const getStatusBadge = (status: ProductItem['status'], profit: number, margin: number) => {
    switch (status) {
      case 'profitable':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            <TrendingUp className="w-3 h-3" />
            <span>+{formatINR(profit, false)} ({margin.toFixed(1)}%)</span>
          </span>
        );
      case 'low_margin':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
            <AlertTriangle className="w-3 h-3" />
            <span>+{formatINR(profit, false)} ({margin.toFixed(1)}%)</span>
          </span>
        );
      case 'loss':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
            <TrendingDown className="w-3 h-3" />
            <span>{formatINR(profit, false)} ({margin.toFixed(1)}%)</span>
          </span>
        );
    }
  };

  const profitableCount = products.filter(p => p.status === 'profitable').length;
  const lowMarginCount = products.filter(p => p.status === 'low_margin').length;
  const lossCount = products.filter(p => p.status === 'loss').length;

  return (
    <div id="screen-products-list" className="pb-28 pt-2 md:pt-4 select-none relative min-h-screen">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Product Inventory & Margin Portfolio
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
            Products Catalog
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track net margins, selling prices, platform commissions & costs for every SKU
          </p>
        </div>

        <button
          id="products-add-header-btn"
          onClick={() => navigateTo('add_product')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-bold shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New SKU</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs mb-6 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="products-search-input"
            type="text"
            placeholder="Search by product name, SKU code or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
              activeFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            All Products ({products.length})
          </button>

          <button
            onClick={() => setActiveFilter('profitable')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
              activeFilter === 'profitable'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
            }`}
          >
            Profitable ({profitableCount})
          </button>

          <button
            onClick={() => setActiveFilter('low_margin')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
              activeFilter === 'low_margin'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100'
            }`}
          >
            Low Margin &lt;15% ({lowMarginCount})
          </button>

          <button
            onClick={() => setActiveFilter('loss')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
              activeFilter === 'loss'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
            }`}
          >
            Loss Making ({lossCount})
          </button>
        </div>
      </div>

      {/* Responsive Products Grid (1 col mobile, 2 col tablet, 3 col desktop) */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-slate-200/80 dark:border-slate-800 text-center shadow-xs">
          <PackageOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            {searchQuery ? 'No matching products found' : 'No products in catalog'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
            {searchQuery
              ? `We couldn't find any products matching "${searchQuery}". Try a different keyword.`
              : 'Add your product catalog items to track real-time marketplace net earnings.'}
          </p>
          <button
            onClick={() => navigateTo('add_product')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            Add First SKU
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all shadow-xs flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <MarketplaceBadge marketplace={p.marketplace} size="sm" />
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    {p.sku}
                  </span>
                </div>

                <h3 
                  onClick={() => handleProductClick(p)}
                  className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 cursor-pointer line-clamp-1"
                >
                  {p.name}
                </h3>
                <span className="text-[11px] text-slate-400 block mt-0.5">{p.category}</span>

                {/* Price vs Cost */}
                <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Selling Price</span>
                    <span className="font-extrabold text-slate-900 dark:text-slate-100">
                      {formatINR(p.sellingPrice, false)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Product Cost</span>
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      {formatINR(p.productCost, false)}
                    </span>
                  </div>
                </div>

                {/* Net Profit & Margin */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Net Profit</span>
                    <div className="text-sm font-black">
                      {getStatusBadge(p.status, p.netProfit, p.profitMargin)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => loadProductIntoCalculator(p)}
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Recalculate</span>
                </button>

                <button
                  onClick={() => handleProductClick(p)}
                  className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
