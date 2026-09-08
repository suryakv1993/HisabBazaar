import React from 'react';
import { formatINR } from '../utils/formatters';

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  showPoints?: boolean;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  color = '#10B981',
  height = 36,
  showPoints = false,
}) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const width = 120;
  const padding = 4;
  const usableHeight = height - padding * 2;

  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((val - min) / range) * usableHeight;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${width - padding},${height} L ${padding},${height} Z`;

  return (
    <svg 
      viewBox={`0 0 ${width} ${height}`} 
      className="w-full overflow-visible" 
      style={{ height }}
    >
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#grad-${color.replace('#', '')})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {showPoints && (
        <circle
          cx={points[points.length - 1].split(',')[0]}
          cy={points[points.length - 1].split(',')[1]}
          r="3"
          fill={color}
        />
      )}
    </svg>
  );
};

interface AreaTrendChartProps {
  labels: string[];
  values: number[];
  currency?: boolean;
  color?: string;
  secondaryValues?: number[];
  secondaryColor?: string;
}

export const AreaTrendChart: React.FC<AreaTrendChartProps> = ({
  labels,
  values,
  currency = true,
  color = '#4F46E5',
}) => {
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);

  const min = 0;
  const max = Math.max(...values) * 1.15 || 100;
  const range = max - min || 1;

  const width = 340;
  const height = 140;
  const padLeft = 30;
  const padRight = 15;
  const padTop = 15;
  const padBottom = 25;

  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const points = values.map((val, idx) => {
    const x = padLeft + (idx / (values.length - 1)) * plotW;
    const y = padTop + plotH - ((val - min) / range) * plotH;
    return { x, y, val, label: labels[idx] };
  });

  const pathD = `M ${points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')}`;
  const areaD = `${pathD} L ${points[points.length - 1].x},${padTop + plotH} L ${points[0].x},${padTop + plotH} Z`;

  return (
    <div className="w-full relative select-none">
      {/* Tooltip */}
      {hoverIndex !== null && points[hoverIndex] && (
        <div 
          className="absolute -top-3 bg-slate-900 text-white text-[11px] font-semibold px-2 py-1 rounded shadow-md pointer-events-none transform -translate-x-1/2 z-10"
          style={{ left: `${(points[hoverIndex].x / width) * 100}%` }}
        >
          {currency ? formatINR(points[hoverIndex].val, false) : points[hoverIndex].val}
          <span className="text-slate-400 ml-1 text-[9px]">({points[hoverIndex].label})</span>
        </div>
      )}

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          <linearGradient id="areaTrendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.5, 1].map((ratio, i) => {
          const y = padTop + plotH * (1 - ratio);
          return (
            <g key={i}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="currentColor"
                strokeOpacity="0.08"
                strokeDasharray="3 3"
              />
              <text
                x={padLeft - 4}
                y={y + 3}
                textAnchor="end"
                className="fill-slate-400 dark:fill-slate-500 text-[8px] font-medium"
              >
                {currency ? `₹${Math.round((max * ratio) / 1000)}k` : Math.round(max * ratio)}
              </text>
            </g>
          );
        })}

        {/* Area & Line */}
        <path d={areaD} fill="url(#areaTrendGrad)" />
        <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Interactive points */}
        {points.map((p, idx) => (
          <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoverIndex(idx)} onMouseLeave={() => setHoverIndex(null)}>
            <circle
              cx={p.x}
              cy={p.y}
              r={hoverIndex === idx ? 5 : 3.5}
              fill={hoverIndex === idx ? '#ffffff' : color}
              stroke={color}
              strokeWidth={hoverIndex === idx ? 2.5 : 1.5}
              className="transition-all"
            />
            {/* X-axis labels */}
            <text
              x={p.x}
              y={height - 6}
              textAnchor="middle"
              className="fill-slate-500 dark:fill-slate-400 text-[9px] font-medium"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

export const DonutBreakdownChart: React.FC<{
  slices: DonutSlice[];
  centerLabel?: string;
  centerValue?: string;
}> = ({ slices, centerLabel = 'Total Costs', centerValue = '' }) => {
  const total = slices.reduce((acc, s) => acc + s.value, 0) || 1;
  const size = 160;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full transform -rotate-90">
          {slices.map((slice, idx) => {
            const percent = slice.value / total;
            const strokeDasharray = `${percent * circumference} ${circumference}`;
            const strokeDashoffset = -accumulatedPercent * circumference;
            accumulatedPercent += percent;

            return (
              <circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{centerLabel}</span>
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{centerValue}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 w-full text-xs">
        {slices.map((slice, idx) => {
          const pct = ((slice.value / total) * 100).toFixed(0);
          return (
            <div key={idx} className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
                <span className="truncate text-slate-600 dark:text-slate-300">{slice.label}</span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
