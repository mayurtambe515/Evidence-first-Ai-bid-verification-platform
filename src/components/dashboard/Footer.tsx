import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-4 px-4 sm:px-8 mt-10 transition-colors">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
        <div>
          <span>GeM AI Compliance Platform</span>
          <span className="mx-2 text-slate-300 dark:text-slate-700">|</span>
          <span className="text-slate-700 dark:text-slate-200 font-semibold">Government e-Marketplace</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-medium tracking-wide">
          <span>Transparent</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span>Compliant</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span>Efficient</span>
        </div>
      </div>
    </footer>
  );
};
