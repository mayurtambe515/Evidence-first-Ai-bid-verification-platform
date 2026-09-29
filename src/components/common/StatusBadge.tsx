import React from 'react';

export interface StatusBadgeProps {
  status: 'Compliant' | 'Partial' | 'Non-Compliant' | 'Verified' | 'Pending' | 'Failed' | 'Ongoing' | 'Completed' | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const norm = status.toLowerCase();

  let style = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700';
  let dotColor = 'bg-slate-400 dark:bg-slate-400';

  if (norm.includes('compliant') && !norm.includes('non') && !norm.includes('partial')) {
    style = 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800';
    dotColor = 'bg-emerald-500 dark:bg-emerald-400';
  } else if (norm.includes('partial') || norm.includes('pending') || norm.includes('review') || norm.includes('ongoing')) {
    style = 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800';
    dotColor = 'bg-amber-500 dark:bg-amber-400';
  } else if (norm.includes('non') || norm.includes('failed') || norm.includes('disqualified') || norm.includes('reject') || norm.includes('debar')) {
    style = 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800';
    dotColor = 'bg-rose-500 dark:bg-rose-400';
  } else if (norm.includes('verified') || norm.includes('completed') || norm.includes('qualified')) {
    style = 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800';
    dotColor = 'bg-emerald-500 dark:bg-emerald-400';
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-0.5',
    md: 'text-xs px-3 py-1',
    lg: 'text-sm px-3.5 py-1.5 font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold rounded-full border whitespace-nowrap transition-colors ${style} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{status}</span>
    </span>
  );
};
