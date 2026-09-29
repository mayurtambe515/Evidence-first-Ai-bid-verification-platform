import React from 'react';

export interface RiskBadgeProps {
  level: 'Low' | 'Medium' | 'High' | 'LOW' | 'MEDIUM' | 'HIGH';
  score?: number; // e.g. 35/100
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, score }) => {
  const norm = level.toLowerCase();

  let style = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700';
  let dotColor = 'bg-slate-400 dark:bg-slate-400';

  if (norm === 'low') {
    style = 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800';
    dotColor = 'bg-emerald-500 dark:bg-emerald-400';
  } else if (norm === 'medium') {
    style = 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800';
    dotColor = 'bg-amber-500 dark:bg-amber-400';
  } else if (norm === 'high') {
    style = 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800';
    dotColor = 'bg-rose-500 dark:bg-rose-400';
  }

  const label = norm.charAt(0).toUpperCase() + norm.slice(1) + ' Risk';

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${style}`}>
      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
      <span>{label}</span>
      {score !== undefined && (
        <span className="opacity-80 font-mono text-[10px]">({score}/100)</span>
      )}
    </span>
  );
};
