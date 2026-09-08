import React from 'react';
import { MarketplaceType } from '../types';

interface Props {
  marketplace: MarketplaceType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const MarketplaceBadge: React.FC<Props> = ({ 
  marketplace, 
  size = 'md', 
  showLabel = true 
}) => {
  const getDetails = () => {
    switch (marketplace) {
      case 'flipkart':
        return {
          name: 'Flipkart',
          short: 'FK',
          bg: 'bg-blue-50 dark:bg-blue-950/40',
          text: 'text-blue-700 dark:text-blue-400',
          border: 'border-blue-200 dark:border-blue-800/60',
          dot: 'bg-blue-600',
          accent: 'from-blue-600 to-indigo-600',
        };
      case 'amazon':
        return {
          name: 'Amazon',
          short: 'AMZ',
          bg: 'bg-amber-50 dark:bg-amber-950/40',
          text: 'text-amber-800 dark:text-amber-300',
          border: 'border-amber-200 dark:border-amber-800/60',
          dot: 'bg-amber-500',
          accent: 'from-amber-600 to-orange-600',
        };
      case 'meesho':
        return {
          name: 'Meesho',
          short: 'MSH',
          bg: 'bg-pink-50 dark:bg-pink-950/40',
          text: 'text-pink-700 dark:text-pink-300',
          border: 'border-pink-200 dark:border-pink-800/60',
          dot: 'bg-pink-500',
          accent: 'from-pink-600 to-rose-600',
        };
      case 'shopify':
        return {
          name: 'Shopify / D2C',
          short: 'D2C',
          bg: 'bg-emerald-50 dark:bg-emerald-950/40',
          text: 'text-emerald-700 dark:text-emerald-300',
          border: 'border-emerald-200 dark:border-emerald-800/60',
          dot: 'bg-emerald-500',
          accent: 'from-emerald-600 to-teal-600',
        };
      default:
        return {
          name: 'Custom',
          short: 'CUS',
          bg: 'bg-slate-50 dark:bg-slate-800/40',
          text: 'text-slate-700 dark:text-slate-300',
          border: 'border-slate-200 dark:border-slate-700',
          dot: 'bg-slate-500',
          accent: 'from-slate-600 to-gray-700',
        };
    }
  };

  const details = getDetails();

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium gap-1.5 rounded-md',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5 rounded-lg',
    lg: 'px-3 py-1.5 text-sm font-semibold gap-2 rounded-xl',
  };

  return (
    <span 
      id={`badge-marketplace-${marketplace}`}
      className={`inline-flex items-center border ${details.bg} ${details.text} ${details.border} ${sizeClasses[size]} transition-colors`}
    >
      <span className={`w-2 h-2 rounded-full ${details.dot} shrink-0`} />
      <span>{showLabel ? details.name : details.short}</span>
    </span>
  );
};
