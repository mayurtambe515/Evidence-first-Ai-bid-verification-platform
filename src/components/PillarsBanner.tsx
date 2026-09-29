import React from 'react';
import { ShieldCheck, SearchCheck, HelpCircle } from 'lucide-react';

export const PillarsBanner: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5 flex items-start space-x-3 shadow-sm">
        <div className="p-2 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Pillar 1: VERIFY</span>
          </div>
          <h4 className="text-sm font-semibold text-slate-100 mt-0.5">Authoritative Cross-Reference</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Auto-checks documents against simulated government registries (GSTN, Udyam MSME, NSDL PAN, OEM Partner port).
          </p>
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5 flex items-start space-x-3 shadow-sm">
        <div className="p-2 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 mt-0.5">
          <SearchCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Pillar 2: DETECT</span>
          </div>
          <h4 className="text-sm font-semibold text-slate-100 mt-0.5">Zero-Tolerance Flaw Hunting</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Uncovers missing forms, expired accreditations, subtle spelling typos ("Solutons"), and entity mismatches (LLP vs Ltd).
          </p>
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5 flex items-start space-x-3 shadow-sm">
        <div className="p-2 rounded-md bg-teal-500/10 border border-teal-500/20 text-teal-400 mt-0.5">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Pillar 3: EXPLAIN</span>
          </div>
          <h4 className="text-sm font-semibold text-slate-100 mt-0.5">100% Evidence-Backed Scoring</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Every conclusion cites exact document, extracted field, rule ID, and confidence score. Never a score without a "why".
          </p>
        </div>
      </div>
    </div>
  );
};
