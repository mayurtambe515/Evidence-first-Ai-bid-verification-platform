import React from 'react';
import { Users, Check, AlertTriangle, AlertCircle } from 'lucide-react';
import { DASHBOARD_KPIS, KpiMetric } from '../../data/gemDashboardData';

interface KpiCardsProps {
  kpis?: KpiMetric[];
  onFilterStatus?: (status: string) => void;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  kpis = DASHBOARD_KPIS,
  onFilterStatus,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
      {kpis.map((kpi) => {
        if (kpi.type === 'total') {
          return (
            <div
              key={kpi.title}
              onClick={() => onFilterStatus && onFilterStatus('ALL')}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition cursor-pointer flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">{kpi.title}</div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                  {kpi.value}
                </div>
                {kpi.subtitle && (
                  <div className="text-xs text-slate-400 dark:text-slate-400 font-normal">{kpi.subtitle}</div>
                )}
              </div>
            </div>
          );
        }

        if (kpi.type === 'compliant') {
          return (
            <div
              key={kpi.title}
              onClick={() => onFilterStatus && onFilterStatus('Compliant')}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition cursor-pointer flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800 flex items-center justify-center flex-shrink-0">
                <Check className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">{kpi.title}</div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                  {kpi.value}
                </div>
                {kpi.percentage && (
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{kpi.percentage}</div>
                )}
              </div>
            </div>
          );
        }

        if (kpi.type === 'partial') {
          return (
            <div
              key={kpi.title}
              onClick={() => onFilterStatus && onFilterStatus('Partial')}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition cursor-pointer flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">{kpi.title}</div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                  {kpi.value}
                </div>
                {kpi.percentage && (
                  <div className="text-xs font-bold text-amber-600 dark:text-amber-400">{kpi.percentage}</div>
                )}
              </div>
            </div>
          );
        }

        // nonCompliant
        return (
          <div
            key={kpi.title}
            onClick={() => onFilterStatus && onFilterStatus('Non-Compliant')}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition cursor-pointer flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">{kpi.title}</div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                {kpi.value}
              </div>
              {kpi.percentage && (
                <div className="text-xs font-bold text-rose-600 dark:text-rose-400">{kpi.percentage}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
