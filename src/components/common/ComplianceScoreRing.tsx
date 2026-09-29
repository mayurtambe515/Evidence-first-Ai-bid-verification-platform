import React from 'react';

export interface ComplianceScoreRingProps {
  score: number; // 0 - 100
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
}

export const ComplianceScoreRing: React.FC<ComplianceScoreRingProps> = ({
  score,
  size = 'md',
  showLabel = false,
}) => {
  const clamped = Math.max(0, Math.min(100, score));

  const dimension = {
    sm: 44,
    md: 64,
    lg: 88,
    xl: 110,
  }[size];

  const strokeWidth = {
    sm: 4,
    md: 5.5,
    lg: 7,
    xl: 9,
  }[size];

  const radius = (dimension - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  let strokeColor = '#10b981'; // emerald-500
  if (clamped < 50) {
    strokeColor = '#f43f5e'; // rose-500
  } else if (clamped < 80) {
    strokeColor = '#f59e0b'; // amber-500
  }

  const fontSize = {
    sm: 'text-xs font-black',
    md: 'text-sm font-black',
    lg: 'text-xl font-black',
    xl: 'text-2xl font-black',
  }[size];

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center" style={{ width: dimension, height: dimension }}>
        <svg width={dimension} height={dimension} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-900 leading-none">
          <span className={fontSize}>{clamped}%</span>
        </div>
      </div>

      {showLabel && (
        <span className="text-[11px] font-semibold text-slate-500 mt-1 uppercase tracking-wider">
          Compliance
        </span>
      )}
    </div>
  );
};
