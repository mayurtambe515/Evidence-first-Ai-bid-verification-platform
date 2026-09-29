import React from 'react';
import { RiskLevel } from '../types';
import { ShieldCheck, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';

export interface ComplianceRingProps {
  score: number;
  riskLevel: RiskLevel;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  className?: string;
}

export const ComplianceRing: React.FC<ComplianceRingProps> = ({
  score,
  riskLevel,
  size = 130,
  strokeWidth = 12,
  showLabel = true,
  className = '',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  let strokeColor = '#10b981'; // emerald-500

  if (riskLevel === 'HIGH') {
    strokeColor = '#f43f5e'; // rose-500
  } else if (riskLevel === 'MEDIUM') {
    strokeColor = '#f59e0b'; // amber-500
  }

  return (
    <div
      className={`relative flex items-center justify-center flex-shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
      id={`compliance-ring-gauge-${score}`}
    >
      <svg width={size} height={size} className="transform -rotate-90 block">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Filled progress track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
        />
      </svg>

      {/* Centered score text inside the SVG ring */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-1">
        <span className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-none">
          {score}%
        </span>
        {showLabel && (
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">
            Compliance
          </span>
        )}
      </div>
    </div>
  );
};

export interface ComplianceScoreCardProps {
  score: number;
  riskLevel: RiskLevel;
  passedCount: number;
  warningCount: number;
  failedCount: number;
  totalChecks: number;
  title?: string;
  subtitle?: string;
}

export const ComplianceScoreCard: React.FC<ComplianceScoreCardProps> = ({
  score,
  riskLevel,
  passedCount,
  warningCount,
  failedCount,
  totalChecks,
  title = 'Statutory Compliance Score',
  subtitle = 'Automated GeM Verification Index',
}) => {
  let badgeBg = 'bg-emerald-950/80 border-emerald-700 text-emerald-300';
  let riskTitle = 'LOW RISK';

  if (riskLevel === 'HIGH') {
    badgeBg = 'bg-rose-950/80 border-rose-700 text-rose-300';
    riskTitle = 'HIGH RISK';
  } else if (riskLevel === 'MEDIUM') {
    badgeBg = 'bg-amber-950/80 border-amber-700 text-amber-300';
    riskTitle = 'MEDIUM RISK';
  }

  return (
    <div
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-between text-center space-y-4"
      id="statutory-compliance-score-card"
    >
      <div className="w-full pb-3 border-b border-slate-800/80">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {subtitle}
        </div>
        <div className="text-sm font-bold text-white mt-0.5">
          {title}
        </div>
      </div>

      {/* Ring Gauge inside its own bounded area with explicit padding */}
      <div className="py-2 flex items-center justify-center">
        <ComplianceRing
          score={score}
          riskLevel={riskLevel}
          size={135}
          strokeWidth={12}
        />
      </div>

      {/* Risk Badge */}
      <div
        className={`px-3.5 py-1 rounded-full border text-xs font-bold tracking-wider inline-flex items-center gap-1.5 ${badgeBg}`}
      >
        {riskLevel === 'LOW' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
        {riskLevel === 'MEDIUM' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
        {riskLevel === 'HIGH' && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
        <span>{riskTitle}</span>
      </div>

      {/* Check Breakdown Stats */}
      <div className="grid grid-cols-3 gap-2 w-full pt-4 border-t border-slate-800/80 text-center text-xs">
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2">
          <div className="text-emerald-400 font-bold text-base">{passedCount}</div>
          <div className="text-[10px] text-slate-400 font-medium">Passed</div>
        </div>
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2">
          <div className="text-amber-400 font-bold text-base">{warningCount}</div>
          <div className="text-[10px] text-slate-400 font-medium">Warnings</div>
        </div>
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2">
          <div className="text-rose-400 font-bold text-base">{failedCount}</div>
          <div className="text-[10px] text-slate-400 font-medium">Failed</div>
        </div>
      </div>
    </div>
  );
};
