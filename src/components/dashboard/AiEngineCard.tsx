import React from 'react';
import { Check, Sparkles, Cpu, ShieldCheck } from 'lucide-react';

export const AiEngineCard: React.FC = () => {
  const capabilities = [
    'Multi-portal integration',
    'AI document verification',
    'Compliance & eligibility checks',
    'Risk scoring & recommendations',
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between h-full transition-colors">
      <div>
        {/* Top Visual Emblem & Title */}
        <div className="flex items-start gap-4 mb-3">
          {/* AI Document & Processor Graphic */}
          <div className="relative w-16 h-16 rounded-2xl bg-blue-50/80 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-10 h-10 text-blue-600 dark:text-blue-400"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Document Base */}
              <rect x="10" y="6" width="28" height="36" rx="4" className="fill-blue-50 dark:fill-slate-800 stroke-blue-500" strokeWidth="2" />
              <line x1="16" y1="14" x2="32" y2="14" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
              <line x1="16" y1="20" x2="28" y2="20" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
              <line x1="16" y1="26" x2="24" y2="26" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
              {/* AI Badge Circle */}
              <circle cx="34" cy="34" r="10" fill="#2563EB" />
              <text
                x="34"
                y="37.5"
                textAnchor="middle"
                fill="white"
                fontSize="8.5"
                fontFamily="sans-serif"
                fontWeight="900"
              >
                AI
              </text>
            </svg>

            {/* Processor Pin Badge */}
            <div className="absolute -bottom-1 -left-1 w-6 h-6 rounded-lg bg-blue-700 dark:bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Cpu className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                AI Verification Engine
              </h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
                <Sparkles className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" />
                AI Powered
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Automatically fetches data from government portals, verifies documents, checks compliance and provides risk scores with recommendations.
            </p>
          </div>
        </div>

        {/* Capabilities Checklist */}
        <div className="mt-4 space-y-2.5">
          {capabilities.map((cap) => (
            <div key={cap} className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                {cap}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Decision Support Note */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
        <span>Decision-support system for authorized procurement officers</span>
      </div>
    </div>
  );
};
