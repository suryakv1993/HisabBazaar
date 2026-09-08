import { 
  ProfitCalculationInput, 
  ProfitCalculationResult, 
  MarketplaceType, 
  GSTRate,
  GSTCalculationResult,
  MarketplaceFeeResult
} from '../types';

export interface MarketplacePreset {
  name: string;
  commissionRate: number;
  fixedFee: number;
  shippingFee: number;
  paymentCollectionFeeRate: number;
  paymentCollectionFixedFee: number;
  defaultGstRate: GSTRate;
  description: string;
}

export const MARKETPLACE_PRESETS: Record<MarketplaceType, MarketplacePreset> = {
  flipkart: {
    name: 'Flipkart',
    commissionRate: 10.5,
    fixedFee: 18,
    shippingFee: 49,
    paymentCollectionFeeRate: 2.0,
    paymentCollectionFixedFee: 0,
    defaultGstRate: 18,
    description: 'Standard Tier (10.5% Commission + ₹18 Fixed + ₹49 National Ship)',
  },
  amazon: {
    name: 'Amazon.in',
    commissionRate: 12.0,
    fixedFee: 25,
    shippingFee: 58,
    paymentCollectionFeeRate: 2.0,
    paymentCollectionFixedFee: 0,
    defaultGstRate: 18,
    description: 'EasyShip National (12% Referral + ₹25 Closing + ₹58 Shipping)',
  },
  meesho: {
    name: 'Meesho',
    commissionRate: 0,
    fixedFee: 0,
    shippingFee: 49,
    paymentCollectionFeeRate: 0,
    paymentCollectionFixedFee: 0,
    defaultGstRate: 5,
    description: '0% Commission Platform + Low Shipping Logistics',
  },
  shopify: {
    name: 'Shopify / D2C',
    commissionRate: 0,
    fixedFee: 0,
    shippingFee: 60,
    paymentCollectionFeeRate: 2.36, // standard Razorpay/Cashfree 2% + 18% GST
    paymentCollectionFixedFee: 0,
    defaultGstRate: 18,
    description: 'Direct to Consumer (0% Platform Fee, 2.36% PG + 3PL Courier)',
  },
  custom: {
    name: 'Custom Marketplace',
    commissionRate: 8.0,
    fixedFee: 10,
    shippingFee: 50,
    paymentCollectionFeeRate: 2.0,
    paymentCollectionFixedFee: 0,
    defaultGstRate: 18,
    description: 'Fully customizable fee & shipping model',
  },
};

/**
 * Perform Indian E-commerce Profit Calculation
 */
export function calculateProfit(input: ProfitCalculationInput): ProfitCalculationResult {
  const qty = Math.max(1, input.quantity || 1);
  const sellingPricePerUnit = Number(input.sellingPrice) || 0;
  const productCostPerUnit = Number(input.productCost) || 0;
  const discountPerUnit = Number(input.discount) || 0;

  const netSellingPrice = Math.max(0, sellingPricePerUnit - discountPerUnit);
  const grossRevenue = netSellingPrice * qty;

  // Tax Calculations
  // In Indian e-commerce, the listed selling price is inclusive of GST.
  // Base Price = Selling Price / (1 + GST_Rate / 100)
  const gstRateFraction = (input.gstRate || 0) / 100;
  const baseSellingPriceExclGst = grossRevenue / (1 + gstRateFraction);
  const gstAmount = grossRevenue - baseSellingPriceExclGst;

  // Split into CGST + SGST (for intra-state) and IGST (for inter-state)
  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;
  const igst = gstAmount;

  // Marketplace Fees (calculated on gross selling price)
  const commissionAmount = (grossRevenue * (Number(input.commissionRate) || 0)) / 100;
  const fixedFee = (Number(input.fixedFee) || 0) * qty;
  const shippingFee = (Number(input.shippingFee) || 0) * qty;
  const paymentGatewayFee = 
    (grossRevenue * (Number(input.paymentCollectionFeeRate) || 0)) / 100 + 
    (Number(input.paymentCollectionFixedFee) || 0) * qty;

  // 18% GST applicable on Marketplace services (Commission, Fixed Fee, Shipping, PG)
  const rawMarketplaceServices = commissionAmount + fixedFee + shippingFee + paymentGatewayFee;
  const marketplaceGst = rawMarketplaceServices * 0.18;
  const totalMarketplaceFees = rawMarketplaceServices + marketplaceGst;

  // Operating Costs
  const productCostTotal = productCostPerUnit * qty;
  const packagingCostTotal = (Number(input.packagingCost) || 0) * qty;
  const advertisingCostTotal = (Number(input.advertisingCost) || 0) * qty;
  const otherExpensesTotal = (Number(input.otherExpenses) || 0) * qty;

  // Return / RTO allowance cost calculation
  // (Return rate % * Forward+Reverse shipping loss per return)
  const returnAllowanceRate = Number(input.returnAllowanceRate) || 0;
  const avgRtoLossPerItem = shippingFee * 1.6 + packagingCostTotal * 0.5;
  const returnRiskCost = (grossRevenue * (returnAllowanceRate / 100)) > 0 
    ? (returnAllowanceRate / 100) * avgRtoLossPerItem 
    : 0;

  const totalOperatingCosts = 
    productCostTotal + 
    packagingCostTotal + 
    advertisingCostTotal + 
    otherExpensesTotal + 
    returnRiskCost;

  // Total Costs (GST payable to govt + marketplace deductions + all operating expenses)
  const totalCosts = gstAmount + totalMarketplaceFees + totalOperatingCosts;

  // Money Received from Marketplace (Gross Revenue - Marketplace Fees - TDS/TCS approx 1%)
  const moneyReceivedFromMarketplace = Math.max(0, grossRevenue - totalMarketplaceFees);

  // Net Profit
  const netProfit = grossRevenue - totalCosts;
  const profitMarginPercent = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;
  const totalInvestment = totalOperatingCosts + totalMarketplaceFees;
  const roiPercent = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;

  // Break-even and recommendations
  const breakEvenSellingPrice = calculateRecommendedSellingPrice(input, 0);
  const recommendedSellingPriceFor10Percent = calculateRecommendedSellingPrice(input, 10);
  const recommendedSellingPriceFor20Percent = calculateRecommendedSellingPrice(input, 20);
  const targetProfit = input.targetProfitForRecommendation ?? 100;
  const recommendedSellingPriceForTarget = calculateRecommendedSellingPriceForFixedProfit(input, targetProfit);

  return {
    id: `calc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
    input,
    grossRevenue,
    netSellingPrice,
    gstAmount,
    baseSellingPriceExclGst,
    cgst,
    sgst,
    igst,
    commissionAmount,
    marketplaceGst,
    fixedFee,
    shippingFee,
    paymentGatewayFee,
    totalMarketplaceFees,
    productCostTotal,
    packagingCostTotal,
    advertisingCostTotal,
    otherExpensesTotal,
    returnRiskCost,
    totalOperatingCosts,
    totalCosts,
    moneyReceivedFromMarketplace,
    netProfit,
    profitMarginPercent,
    roiPercent,
    isProfitable: netProfit > 0,
    recommendedSellingPriceFor10Percent,
    recommendedSellingPriceFor20Percent,
    recommendedSellingPriceForTarget,
    breakEvenSellingPrice,
  };
}

/**
 * Solve for Selling Price given a target Profit Margin %
 */
export function calculateRecommendedSellingPrice(
  input: ProfitCalculationInput,
  targetMarginPercent: number
): number {
  const qty = Math.max(1, input.quantity || 1);
  const fixedOperating = 
    (Number(input.productCost) || 0) * qty +
    (Number(input.packagingCost) || 0) * qty +
    (Number(input.advertisingCost) || 0) * qty +
    (Number(input.otherExpenses) || 0) * qty +
    (Number(input.fixedFee) || 0) * qty * 1.18 +
    (Number(input.shippingFee) || 0) * qty * 1.18;

  const gstRate = (input.gstRate || 0) / 100;
  const commissionRate = (Number(input.commissionRate) || 0) / 100;
  const pgRate = (Number(input.paymentCollectionFeeRate) || 0) / 100;
  const variableRateMarketplaceGst = (commissionRate + pgRate) * 0.18;

  // Total variable deduction rate per rupee of Selling Price:
  // Tax rate component + Commission + PG + Service GST + Target Margin
  const gstDeductionRate = 1 - 1 / (1 + gstRate);
  const variableFeeRate = commissionRate + pgRate + variableRateMarketplaceGst;
  const targetMarginRate = targetMarginPercent / 100;

  const denominator = 1 - (gstDeductionRate + variableFeeRate + targetMarginRate);

  if (denominator <= 0.05) {
    return Math.round((fixedOperating * 1.5) / qty);
  }

  const requiredGrossRevenue = fixedOperating / denominator;
  return Math.max(1, Math.round(requiredGrossRevenue / qty));
}

/**
 * Solve for Selling Price to earn a target fixed rupee profit (e.g. ₹100 profit)
 */
export function calculateRecommendedSellingPriceForFixedProfit(
  input: ProfitCalculationInput,
  targetRupeeProfit: number
): number {
  const qty = Math.max(1, input.quantity || 1);
  const fixedTotal = 
    (Number(input.productCost) || 0) * qty +
    (Number(input.packagingCost) || 0) * qty +
    (Number(input.advertisingCost) || 0) * qty +
    (Number(input.otherExpenses) || 0) * qty +
    (Number(input.fixedFee) || 0) * qty * 1.18 +
    (Number(input.shippingFee) || 0) * qty * 1.18 +
    targetRupeeProfit;

  const gstRate = (input.gstRate || 0) / 100;
  const commissionRate = (Number(input.commissionRate) || 0) / 100;
  const pgRate = (Number(input.paymentCollectionFeeRate) || 0) / 100;
  const variableRateMarketplaceGst = (commissionRate + pgRate) * 0.18;

  const gstDeductionRate = 1 - 1 / (1 + gstRate);
  const variableFeeRate = commissionRate + pgRate + variableRateMarketplaceGst;

  const denominator = 1 - (gstDeductionRate + variableFeeRate);

  if (denominator <= 0.05) {
    return Math.round((fixedTotal * 1.25) / qty);
  }

  const requiredGrossRevenue = fixedTotal / denominator;
  return Math.max(1, Math.round(requiredGrossRevenue / qty));
}

/**
 * Standalone GST Calculator (Inclusive vs Exclusive)
 */
export function calculateGST(
  amount: number,
  rate: GSTRate,
  type: 'inclusive' | 'exclusive'
): GSTCalculationResult {
  const cleanAmount = Math.max(0, Number(amount) || 0);
  const rateVal = Number(rate) || 0;
  const rateFraction = rateVal / 100;

  if (type === 'inclusive') {
    const baseAmount = cleanAmount / (1 + rateFraction);
    const gstAmount = cleanAmount - baseAmount;
    return {
      type: 'inclusive',
      amount: cleanAmount,
      rate,
      baseAmount,
      gstAmount,
      cgst: gstAmount / 2,
      sgst: gstAmount / 2,
      igst: gstAmount,
      totalAmount: cleanAmount,
    };
  } else {
    const gstAmount = cleanAmount * rateFraction;
    const totalAmount = cleanAmount + gstAmount;
    return {
      type: 'exclusive',
      amount: cleanAmount,
      rate,
      baseAmount: cleanAmount,
      gstAmount,
      cgst: gstAmount / 2,
      sgst: gstAmount / 2,
      igst: gstAmount,
      totalAmount,
    };
  }
}

/**
 * Standalone Marketplace Fee Calculator
 */
export function calculateMarketplaceFees(
  marketplace: MarketplaceType,
  sellingPrice: number,
  commissionRate: number,
  fixedFee: number,
  shippingFee: number,
  paymentFeeRate: number,
  otherFee: number = 0
): MarketplaceFeeResult {
  const sp = Math.max(0, Number(sellingPrice) || 0);
  const commissionAmount = (sp * (Number(commissionRate) || 0)) / 100;
  const paymentFee = (sp * (Number(paymentFeeRate) || 0)) / 100;
  const ff = Number(fixedFee) || 0;
  const sf = Number(shippingFee) || 0;
  const of = Number(otherFee) || 0;

  const rawFees = commissionAmount + ff + sf + paymentFee + of;
  const feeGst = rawFees * 0.18; // 18% GST on all marketplace service charges
  const totalFees = rawFees + feeGst;
  const feePercentage = sp > 0 ? (totalFees / sp) * 100 : 0;
  const amountReceived = Math.max(0, sp - totalFees);

  return {
    marketplace,
    sellingPrice: sp,
    commissionRate,
    commissionAmount,
    fixedFee: ff,
    shippingFee: sf,
    paymentFee,
    otherFee: of,
    feeGst,
    totalFees,
    feePercentage,
    amountReceived,
  };
}
