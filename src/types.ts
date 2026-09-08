export type MarketplaceType = 'flipkart' | 'amazon' | 'meesho' | 'shopify' | 'custom';

export type GSTRate = 0 | 5 | 12 | 18 | 28;

export type NavigationTab = 'home' | 'calculator' | 'products' | 'reports' | 'settings';

export type ActiveScreen = 
  | 'splash'
  | 'onboarding'
  | 'home'
  | 'calculator'
  | 'result'
  | 'gst_calculator'
  | 'fee_calculator'
  | 'products'
  | 'add_product'
  | 'edit_product'
  | 'product_details'
  | 'reports'
  | 'history'
  | 'settings'
  | 'premium'
  | 'about'
  | 'privacy'
  | 'terms'
  | 'contact';

export interface ProfitCalculationInput {
  productName: string;
  sku?: string;
  productCost: number;
  sellingPrice: number;
  quantity: number;
  gstRate: GSTRate;
  marketplace: MarketplaceType;
  // Marketplace Costs
  commissionRate: number; // percentage e.g. 10 for 10%
  fixedFee: number;
  shippingFee: number;
  paymentCollectionFeeRate: number; // percentage or fixed
  paymentCollectionFixedFee: number;
  // Other Costs
  packagingCost: number;
  advertisingCost: number;
  discount: number;
  otherExpenses: number;
  // Returns/RTO
  returnAllowanceRate: number; // percentage
  targetProfitForRecommendation?: number;
}

export interface ProfitCalculationResult {
  id: string;
  timestamp: number;
  input: ProfitCalculationInput;
  // Revenue
  grossRevenue: number;
  netSellingPrice: number; // Selling price minus discount
  // Tax breakdown
  gstAmount: number; // GST on selling price
  baseSellingPriceExclGst: number;
  cgst: number;
  sgst: number;
  igst: number;
  // Deductions
  commissionAmount: number;
  marketplaceGst: number; // 18% GST on marketplace fees
  fixedFee: number;
  shippingFee: number;
  paymentGatewayFee: number;
  totalMarketplaceFees: number;
  // Operating costs
  productCostTotal: number;
  packagingCostTotal: number;
  advertisingCostTotal: number;
  otherExpensesTotal: number;
  returnRiskCost: number;
  totalOperatingCosts: number;
  // Totals
  totalCosts: number;
  moneyReceivedFromMarketplace: number; // Net payout from platform
  netProfit: number;
  profitMarginPercent: number; // Net Profit / Net Revenue * 100
  roiPercent: number; // Net Profit / Total Investment * 100
  isProfitable: boolean;
  // Recommendations
  recommendedSellingPriceFor10Percent: number;
  recommendedSellingPriceFor20Percent: number;
  recommendedSellingPriceForTarget: number;
  breakEvenSellingPrice: number;
}

export interface ProductItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  marketplace: MarketplaceType;
  productCost: number;
  sellingPrice: number;
  gstRate: GSTRate;
  commissionRate: number;
  fixedFee: number;
  shippingFee: number;
  packagingCost: number;
  advertisingCost: number;
  otherExpenses: number;
  returnAllowanceRate: number;
  // Computed values
  netProfit: number;
  profitMargin: number;
  status: 'profitable' | 'low_margin' | 'loss';
  createdAt: number;
  updatedAt: number;
}

export interface GSTCalculationResult {
  type: 'inclusive' | 'exclusive';
  amount: number;
  rate: GSTRate;
  baseAmount: number;
  gstAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
}

export interface MarketplaceFeeResult {
  marketplace: MarketplaceType;
  sellingPrice: number;
  commissionRate: number;
  commissionAmount: number;
  fixedFee: number;
  shippingFee: number;
  paymentFee: number;
  otherFee: number;
  feeGst: number; // 18% GST on fee
  totalFees: number;
  feePercentage: number;
  amountReceived: number;
}

export interface BusinessSettings {
  sellerName: string;
  businessName: string;
  gstin?: string;
  currency: string;
  defaultGstRate: GSTRate;
  defaultMarketplace: MarketplaceType;
  theme: 'light' | 'dark' | 'system';
  isPro: boolean;
  showAds: boolean;
  enableSoundAndHaptics: boolean;
  defaultTargetProfitMargin: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'alert' | 'tip' | 'update';
}
