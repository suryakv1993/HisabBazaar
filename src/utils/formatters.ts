/**
 * Indian Rupee and number formatting utilities according to Indian numbering system
 */

export function formatINR(val: number | undefined | null, showDecimals: boolean = true): string {
  if (val === undefined || val === null || isNaN(val)) {
    return showDecimals ? '₹0.00' : '₹0';
  }

  const isNegative = val < 0;
  const absVal = Math.abs(val);

  // Split into integer and fraction
  const fixedStr = absVal.toFixed(showDecimals ? 2 : 0);
  const parts = fixedStr.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];

  // Indian Number Format (last 3 digits, then groups of 2 digits)
  let result = '';
  if (integerPart.length <= 3) {
    result = integerPart;
  } else {
    const last3 = integerPart.substring(integerPart.length - 3);
    const rest = integerPart.substring(0, integerPart.length - 3);
    
    // Group remaining into 2s from right to left
    const restGrouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    result = restGrouped + ',' + last3;
  }

  const prefix = isNegative ? '-₹' : '₹';
  return showDecimals && decimalPart !== undefined
    ? `${prefix}${result}.${decimalPart}`
    : `${prefix}${result}`;
}

export function formatNumberIndian(val: number | undefined | null): string {
  if (val === undefined || val === null || isNaN(val)) return '0';
  const parts = Math.abs(val).toString().split('.');
  const integerPart = parts[0];
  
  let result = '';
  if (integerPart.length <= 3) {
    result = integerPart;
  } else {
    const last3 = integerPart.substring(integerPart.length - 3);
    const rest = integerPart.substring(0, integerPart.length - 3);
    const restGrouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    result = restGrouped + ',' + last3;
  }
  return (val < 0 ? '-' : '') + result;
}

export function formatPercent(val: number | undefined | null, decimals: number = 1): string {
  if (val === undefined || val === null || isNaN(val)) return '0.0%';
  const sign = val > 0 ? '+' : '';
  return `${sign}${val.toFixed(decimals)}%`;
}

export function formatPercentRaw(val: number | undefined | null, decimals: number = 1): string {
  if (val === undefined || val === null || isNaN(val)) return '0.0%';
  return `${val.toFixed(decimals)}%`;
}

export function formatDateRelative(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;

  const date = new Date(timestamp);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}

export function formatDateFull(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
