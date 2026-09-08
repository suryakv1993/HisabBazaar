import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MarketplaceType, GSTRate, ProductItem } from '../types';
import { calculateProfit, MARKETPLACE_PRESETS } from '../utils/calculatorEngine';
import { formatINR } from '../utils/formatters';
import { ArrowLeft, Save } from 'lucide-react';
import { MarketplaceBadge } from '../components/MarketplaceBadge';

interface Props {
  initialProduct?: ProductItem | null;
}

export const AddEditProductScreen: React.FC<Props> = ({ initialProduct }) => {
  const { addProduct, updateProduct, navigateTo, showSnackbar, setSelectedProduct } = useApp();

  const isEditing = !!initialProduct;

  const [name, setName] = useState<string>(initialProduct?.name || '');
  const [sku, setSku] = useState<string>(initialProduct?.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`);
  const [category, setCategory] = useState<string>(initialProduct?.category || 'Fashion & Apparel');
  const [marketplace, setMarketplace] = useState<MarketplaceType>(initialProduct?.marketplace || 'flipkart');
  const [productCost, setProductCost] = useState<number>(initialProduct?.productCost || 180);
  const [sellingPrice, setSellingPrice] = useState<number>(initialProduct?.sellingPrice || 499);
  const [gstRate, setGstRate] = useState<GSTRate>(initialProduct?.gstRate || 18);
  const [commissionRate, setCommissionRate] = useState<number>(
    initialProduct?.commissionRate ?? MARKETPLACE_PRESETS['flipkart'].commissionRate
  );
  const [fixedFee, setFixedFee] = useState<number>(
    initialProduct?.fixedFee ?? MARKETPLACE_PRESETS['flipkart'].fixedFee
  );
  const [shippingFee, setShippingFee] = useState<number>(
    initialProduct?.shippingFee ?? MARKETPLACE_PRESETS['flipkart'].shippingFee
  );
  const [packagingCost, setPackagingCost] = useState<number>(initialProduct?.packagingCost ?? 10);
  const [advertisingCost, setAdvertisingCost] = useState<number>(initialProduct?.advertisingCost ?? 25);
  const [otherExpenses, setOtherExpenses] = useState<number>(initialProduct?.otherExpenses ?? 5);
  const [returnAllowanceRate, setReturnAllowanceRate] = useState<number>(initialProduct?.returnAllowanceRate ?? 6);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const categories = [
    'Fashion & Apparel',
    'Electronics & Audio',
    'Home & Kitchen',
    'Beauty & Personal Care',
    'Gourmet Food & Snacks',
    'Accessories & Bags',
    'Jewelry & Watches',
    'Other / General',
  ];

  const gstRates: GSTRate[] = [0, 5, 12, 18, 28];

  const handleMarketplaceChange = (mp: MarketplaceType) => {
    setMarketplace(mp);
    const preset = MARKETPLACE_PRESETS[mp];
    setCommissionRate(preset.commissionRate);
    setFixedFee(preset.fixedFee);
    setShippingFee(preset.shippingFee);
  };

  // Live calculation preview
  const liveCalc = calculateProfit({
    productName: name,
    sku,
    productCost,
    sellingPrice,
    quantity: 1,
    gstRate,
    marketplace,
    commissionRate,
    fixedFee,
    shippingFee,
    paymentCollectionFeeRate: marketplace === 'shopify' ? 2.36 : 2.0,
    paymentCollectionFixedFee: 0,
    packagingCost,
    advertisingCost,
    discount: 0,
    otherExpenses,
    returnAllowanceRate,
  });

  const validate = (): boolean => {
    const err: { [key: string]: string } = {};
    if (!name.trim()) err.name = 'Product title is required';
    if (!sku.trim()) err.sku = 'SKU is required';
    if (!sellingPrice || sellingPrice <= 0) err.sellingPrice = 'Enter a valid selling price';
    if (productCost < 0) err.productCost = 'Cost cannot be negative';

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      showSnackbar('Please fix the required fields', 'error');
      return;
    }

    if (isEditing && initialProduct) {
      updateProduct(initialProduct.id, {
        name,
        sku,
        category,
        marketplace,
        productCost,
        sellingPrice,
        gstRate,
        commissionRate,
        fixedFee,
        shippingFee,
        packagingCost,
        advertisingCost,
        otherExpenses,
        returnAllowanceRate,
      });
      navigateTo('products');
    } else {
      addProduct({
        name,
        sku,
        category,
        marketplace,
        productCost,
        sellingPrice,
        gstRate,
        commissionRate,
        fixedFee,
        shippingFee,
        packagingCost,
        advertisingCost,
        otherExpenses,
        returnAllowanceRate,
      });
      navigateTo('products');
    }
  };

  return (
    <div id="screen-add-edit-product" className="pb-28 pt-2 md:pt-4 select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <button
            id="add-product-back-btn"
            onClick={() => navigateTo('products')}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {isEditing ? 'Edit Catalog SKU' : 'Add New SKU to Catalog'}
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Set product costs, selling channel rates & track net unit margins
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-bold shadow-md shadow-indigo-600/20 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{isEditing ? 'Update SKU' : 'Save SKU'}</span>
        </button>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Details (7-8 cols on desktop) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-5">
          
          {/* Section 1: Basic Info */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              1. Basic SKU Information
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                Product Title / Name *
              </label>
              <input
                id="product-input-name"
                type="text"
                placeholder="e.g., Pure Cotton Slim Fit Shirt"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
                className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-50 dark:bg-slate-800 border ${
                  errors.name ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                } text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600`}
              />
              {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                  SKU Identifier *
                </label>
                <input
                  id="product-input-sku"
                  type="text"
                  placeholder="e.g., SHT-COT-BLU-M"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-bold uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Marketplace & Pricing */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              2. Channel & Pricing
            </h2>

            {/* Marketplace Chips */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Primary Selling Marketplace
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['flipkart', 'amazon', 'meesho', 'shopify'] as const).map((mp) => {
                  const isSelected = marketplace === mp;
                  return (
                    <button
                      key={mp}
                      type="button"
                      onClick={() => handleMarketplaceChange(mp)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 text-indigo-900 dark:text-indigo-200 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <MarketplaceBadge marketplace={mp} size="sm" />
                      <span className="capitalize">{mp === 'shopify' ? 'Shopify' : mp}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                  Selling Price (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    value={sellingPrice || ''}
                    onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl text-base font-extrabold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                  Product Sourcing Cost (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    value={productCost || ''}
                    onChange={(e) => setProductCost(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl text-base font-extrabold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* GST Rate */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                GST Rate Slab
              </label>
              <div className="grid grid-cols-5 gap-2">
                {gstRates.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setGstRate(r)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      gstRate === r
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {r}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Marketplace Rates */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              3. Channel Fees & Operations
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Commission %</label>
                <input
                  type="number"
                  value={commissionRate ?? ''}
                  onChange={(e) => setCommissionRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Closing Fee (₹)</label>
                <input
                  type="number"
                  value={fixedFee ?? ''}
                  onChange={(e) => setFixedFee(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Shipping (₹)</label>
                <input
                  type="number"
                  value={shippingFee ?? ''}
                  onChange={(e) => setShippingFee(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Packaging (₹)</label>
                <input
                  type="number"
                  value={packagingCost ?? ''}
                  onChange={(e) => setPackagingCost(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Live Profit Outcome & Action (4-5 cols on desktop) */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="lg:sticky lg:top-20 space-y-4">
            
            {/* Live Card */}
            <div className={`rounded-3xl p-5 md:p-6 border shadow-lg ${
              liveCalc.isProfitable
                ? 'bg-gradient-to-br from-emerald-950/90 via-slate-900 to-slate-950 text-white border-emerald-800/60 shadow-emerald-950/20'
                : 'bg-gradient-to-br from-rose-950/90 via-slate-900 to-slate-950 text-white border-rose-800/60 shadow-rose-950/20'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Calculated SKU Margin
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  liveCalc.isProfitable ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {liveCalc.isProfitable ? 'PROFITABLE' : 'LOSS'}
                </span>
              </div>

              <div className="mt-3">
                <span className="text-xs text-slate-400">Net Profit per unit:</span>
                <div className="text-3xl font-black mt-0.5">
                  <span className={liveCalc.isProfitable ? 'text-emerald-400' : 'text-rose-400'}>
                    {liveCalc.isProfitable ? `+${formatINR(liveCalc.netProfit)}` : formatINR(liveCalc.netProfit)}
                  </span>
                </div>
                <div className="text-xs font-bold mt-1 text-slate-300">
                  {liveCalc.profitMarginPercent.toFixed(1)}% Profit Margin
                </div>
              </div>

              <div className="space-y-1.5 mt-4 pt-4 border-t border-white/10 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Marketplace Fees:</span>
                  <span className="text-rose-400">-{formatINR(liveCalc.totalMarketplaceFees)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">GST Output:</span>
                  <span className="text-rose-400">-{formatINR(liveCalc.gstAmount)}</span>
                </div>
                <div className="flex justify-between font-bold pt-1.5 border-t border-white/10">
                  <span className="text-white">Bank Settlement:</span>
                  <span className="text-emerald-400">{formatINR(liveCalc.moneyReceivedFromMarketplace)}</span>
                </div>
              </div>

              <button
                id="add-product-submit-btn"
                onClick={handleSave}
                className="w-full mt-6 py-3.5 px-6 rounded-2xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Update SKU in Catalog' : 'Save SKU to Catalog'}</span>
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
