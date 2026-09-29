import React from 'react';
import {
  Sparkles,
  Lightbulb,
  ShieldAlert,
  ArrowRight,
  Shield,
  FileCheck2,
} from 'lucide-react';

interface AiRecommendationCardProps {
  onViewDetailedReport: () => void;
  onOpenDecisionModal?: () => void;
}

export const AiRecommendationCard: React.FC<AiRecommendationCardProps> = ({
  onViewDetailedReport,
  onOpenDecisionModal,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between h-full transition-colors">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-bold text-base">✦</span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              AI Recommendation
            </h2>
          </div>

          <button
            type="button"
            onClick={onViewDetailedReport}
            className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 group transition"
          >
            <span>View Details</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </button>
        </div>

        {/* Light Blue Tinted Callout Box */}
        <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/80 rounded-2xl p-5 mb-5">
          <div className="flex items-start gap-3.5 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
              Based on the available verification data, most mandatory requirements appear compliant. The following items should be reviewed by the Procurement Officer.
            </p>
          </div>

          {/* Recommended Actions */}
          <div className="mt-3 pl-11">
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-2">
              Recommended Actions:
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 list-disc pl-4 leading-relaxed">
              <li>Verify latest GST return filing information (if available)</li>
              <li>Confirm local content value for Make in India (if applicable)</li>
              <li>Review OEM authorization validity period if required</li>
            </ul>
          </div>
        </div>

        {/* Essential Decision Support Notice */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-xl mb-4 flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong className="text-slate-800 dark:text-slate-100 font-semibold">Statutory Authority: </strong>
            This is an AI decision-support evaluation. The AI does not make the final qualification or disqualification determination; the final decision remains exclusively with the Procurement Officer.
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-2">
        <button
          type="button"
          onClick={onViewDetailedReport}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs transition"
        >
          <FileCheck2 className="w-4 h-4" />
          <span>View Detailed Report</span>
        </button>

        {onOpenDecisionModal && (
          <button
            type="button"
            onClick={onOpenDecisionModal}
            className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition"
          >
            <span>Record Procurement Officer Decision</span>
          </button>
        )}
      </div>
    </div>
  );
};
