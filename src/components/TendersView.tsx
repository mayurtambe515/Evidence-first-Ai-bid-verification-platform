import React from 'react';
import { Tender } from '../types';
import { FileCheck2, Calendar, IndianRupee, Building, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface TendersViewProps {
  tenders: Tender[];
  selectedTender: Tender;
  onSelectTender: (tender: Tender) => void;
}

export const TendersView: React.FC<TendersViewProps> = ({
  tenders,
  selectedTender,
  onSelectTender,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-blue-400" />
            <span>Active GeM Tenders Registry</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Select a public procurement tender to review strict compliance rules, deadlines, and minimum qualification mandates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {tenders.map((tender) => {
          const isSelected = tender.id === selectedTender.id;
          return (
            <div
              key={tender.id}
              className={`rounded-xl border p-5 flex flex-col justify-between transition-all duration-200 ${
                isSelected
                  ? 'bg-slate-900 border-blue-500 ring-1 ring-blue-500/50 shadow-lg shadow-blue-950/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    {tender.refNumber}
                  </span>
                  {isSelected && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      Active Tender
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 mb-2">
                  {tender.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">{tender.authority}</span>
                </div>

                <div className="space-y-2 text-xs bg-slate-950/60 rounded-lg p-3 border border-slate-800/80 mb-4">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500 flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" />
                      Est. Value:
                    </span>
                    <span className="font-semibold text-white">{tender.estimatedValue}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Closing:
                    </span>
                    <span className="font-medium text-amber-300">{tender.deadline}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500">Min Turnover:</span>
                    <span className="font-semibold text-slate-200">
                      ₹ {tender.minAnnualTurnoverCr.toFixed(2)} Cr / yr
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500">OEM Authorization:</span>
                    <span className={`font-semibold ${tender.requiresOEMAuthorization ? 'text-amber-400' : 'text-slate-400'}`}>
                      {tender.requiresOEMAuthorization ? 'Mandatory (Direct MAF)' : 'Optional'}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Mandatory Documents Checklist
                  </div>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {tender.requiredDocuments.map((doc, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <span className="w-1 h-1 rounded-full bg-blue-400" />
                        <span className="truncate">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => onSelectTender(tender)}
                disabled={isSelected}
                className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition ${
                  isSelected
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 cursor-default'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                }`}
              >
                {isSelected ? 'Currently Selected' : 'Load Tender for Evaluation'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
