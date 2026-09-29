import React, { useState } from 'react';
import { TOP_COMPLIANCE_AREAS } from '../../data/gemDashboardData';

interface ComplianceOverviewChartProps {
  onSelectCategory?: (category: string) => void;
}

export const ComplianceOverviewChart: React.FC<ComplianceOverviewChartProps> = ({
  onSelectCategory,
}) => {
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  // Data
  const total = 128;
  const compliant = 72; // 56.3%
  const partial = 34; // 26.6%
  const nonCompliant = 22; // 17.2%

  // Donut SVG geometry calculation
  // Radius = 56, circumference = 2 * PI * 56 = 351.858
  const radius = 56;
  const circumference = 2 * Math.PI * radius;

  const compliantStroke = (compliant / total) * circumference;
  const partialStroke = (partial / total) * circumference;
  const nonCompliantStroke = (nonCompliant / total) * circumference;

  // Offsets
  // Start from top (-90 deg)
  const compliantOffset = 0;
  const partialOffset = -compliantStroke;
  const nonCompliantOffset = -(compliantStroke + partialStroke);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
      {/* Title */}
      <div className="mb-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Compliance Overview
        </h2>
      </div>

      {/* Donut Chart and Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        {/* SVG Donut */}
        <div className="relative w-40 h-40 flex-shrink-0 flex items-center justify-center">
          <svg className="w-40 h-40 -rotate-90 transform" viewBox="0 0 140 140">
            {/* Background track */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              strokeWidth="16"
              className="stroke-slate-100 dark:stroke-slate-800"
            />

            {/* Compliant Slice (Green) */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#10b981"
              strokeWidth="16"
              strokeDasharray={`${compliantStroke} ${circumference}`}
              strokeDashoffset={compliantOffset}
              className="cursor-pointer transition-all duration-300 hover:opacity-90"
              onMouseEnter={() => setHoveredSlice('Compliant')}
              onMouseLeave={() => setHoveredSlice(null)}
              onClick={() => onSelectCategory && onSelectCategory('Compliant')}
            />

            {/* Partial Slice (Orange) */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="16"
              strokeDasharray={`${partialStroke} ${circumference}`}
              strokeDashoffset={partialOffset}
              className="cursor-pointer transition-all duration-300 hover:opacity-90"
              onMouseEnter={() => setHoveredSlice('Partial')}
              onMouseLeave={() => setHoveredSlice(null)}
              onClick={() => onSelectCategory && onSelectCategory('Partial')}
            />

            {/* Non-Compliant Slice (Red) */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#ef4444"
              strokeWidth="16"
              strokeDasharray={`${nonCompliantStroke} ${circumference}`}
              strokeDashoffset={nonCompliantOffset}
              className="cursor-pointer transition-all duration-300 hover:opacity-90"
              onMouseEnter={() => setHoveredSlice('Non-Compliant')}
              onMouseLeave={() => setHoveredSlice(null)}
              onClick={() => onSelectCategory && onSelectCategory('Non-Compliant')}
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 leading-none">
              {hoveredSlice === 'Compliant'
                ? compliant
                : hoveredSlice === 'Partial'
                ? partial
                : hoveredSlice === 'Non-Compliant'
                ? nonCompliant
                : total}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-400 font-medium mt-1">
              {hoveredSlice ? hoveredSlice : 'Total Bidders'}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3 w-full sm:w-auto">
          {/* Compliant */}
          <div
            onClick={() => onSelectCategory && onSelectCategory('Compliant')}
            className="flex items-center justify-between text-xs sm:text-sm p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">Compliant</span>
            </div>
            <div className="font-mono text-xs text-slate-600 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-slate-100 font-bold">72</strong> (56.3%)
            </div>
          </div>

          {/* Partial */}
          <div
            onClick={() => onSelectCategory && onSelectCategory('Partial')}
            className="flex items-center justify-between text-xs sm:text-sm p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">Partial</span>
            </div>
            <div className="font-mono text-xs text-slate-600 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-slate-100 font-bold">34</strong> (26.6%)
            </div>
          </div>

          {/* Non-Compliant */}
          <div
            onClick={() => onSelectCategory && onSelectCategory('Non-Compliant')}
            className="flex items-center justify-between text-xs sm:text-sm p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 flex-shrink-0" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">Non-Compliant</span>
            </div>
            <div className="font-mono text-xs text-slate-600 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-slate-100 font-bold">22</strong> (17.2%)
            </div>
          </div>
        </div>
      </div>

      {/* Top Compliance Areas Section */}
      <div className="pt-5">
        <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-3.5">
          Top Compliance Areas
        </h3>

        <div className="space-y-3">
          {TOP_COMPLIANCE_AREAS.map((area) => (
            <div key={area.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 dark:text-slate-300">{area.name}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{area.percentage}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    area.color === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${area.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
