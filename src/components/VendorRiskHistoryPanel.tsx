import React from 'react';
import { BidderRiskHistory } from '../types';
import {
  History,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  TrendingDown,
  TrendingUp,
  Minus,
  CheckCircle2,
  Calendar,
  Building,
} from 'lucide-react';

interface VendorRiskHistoryPanelProps {
  history?: BidderRiskHistory;
  compact?: boolean;
}

export const VendorRiskHistoryPanel: React.FC<VendorRiskHistoryPanelProps> = ({
  history,
  compact = false,
}) => {
  if (!history) {
    return (
      <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-lg text-xs text-slate-400">
        No past tender history on file for this vendor.
      </div>
    );
  }

  let trendBadge = null;
  if (history.riskTrend === 'STABLE_LOW') {
    trendBadge = (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
        <TrendingUp className="w-3 h-3" />
        STABLE & COMPLIANT
      </span>
    );
  } else if (history.riskTrend === 'PERSISTENT_DEFECTS') {
    trendBadge = (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800">
        <AlertTriangle className="w-3 h-3" />
        RECURRENT DEFECTS
      </span>
    );
  } else {
    trendBadge = (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800">
        <TrendingDown className="w-3 h-3" />
        HIGH RISK PROFILE
      </span>
    );
  }

  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-blue-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Cross-Tender Compliance History
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            Flagged in <strong className={history.flaggedTendersCount > 0 ? 'text-amber-400' : 'text-emerald-400'}>{history.repeatFlagRatio}</strong> past tenders
          </span>
          {trendBadge}
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        {history.summary}
      </p>

      {/* Mini Timeline of Past Tenders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
        {history.pastTenders.map((tender, index) => {
          let statusColor = 'text-emerald-400 bg-emerald-950/50 border-emerald-800';
          let StatusIcon = CheckCircle2;

          if (tender.status === 'WARNING') {
            statusColor = 'text-amber-400 bg-amber-950/50 border-amber-800';
            StatusIcon = AlertTriangle;
          } else if (tender.status === 'FAILED' || tender.status === 'DISQUALIFIED') {
            statusColor = 'text-rose-400 bg-rose-950/50 border-rose-800';
            StatusIcon = XCircle;
          }

          return (
            <div
              key={index}
              className="bg-slate-900 border border-slate-800/80 rounded-lg p-2.5 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>{tender.year}</span>
                  <span className={`px-1.5 py-0.2 rounded border font-semibold flex items-center gap-1 ${statusColor}`}>
                    <StatusIcon className="w-2.5 h-2.5" />
                    {tender.status} ({tender.complianceScore}%)
                  </span>
                </div>

                <div className="text-[11px] font-semibold text-white font-mono truncate">
                  {tender.tenderRef}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {tender.authority}
                </div>
              </div>

              {tender.flagSummary && (
                <div className="text-[10px] text-slate-300 mt-2 bg-slate-950/80 p-1.5 rounded border border-slate-850 line-clamp-2">
                  {tender.flagSummary}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
