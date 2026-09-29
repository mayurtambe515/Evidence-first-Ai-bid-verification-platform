import React from 'react';
import { X, Server, CheckCircle2, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';

interface QuickAccessModalProps {
  portalName: string | null;
  onClose: () => void;
}

export const QuickAccessModal: React.FC<QuickAccessModalProps> = ({
  portalName,
  onClose,
}) => {
  if (!portalName) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-blue-300 font-bold">
                Government API Gateway
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {portalName} Integration
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto ring-8 ring-blue-50/50">
            <Sparkles className="w-7 h-7" />
          </div>

          <div>
            <span className="inline-block text-xs font-bold px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full mb-2">
              Integration module coming soon.
            </span>
            <h4 className="text-base font-bold text-slate-900">
              Direct Gateway Connection
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              The direct automated lookup module for <strong className="text-slate-800">{portalName}</strong> is scheduled for Phase 2 integration. For current evaluation, the AI verification engine runs via simulated government registry endpoints with deterministic rules.
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-left text-xs space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
              <span>Sandbox API Status:</span>
              <span className="text-emerald-600 font-mono font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Active (Demo Seed)
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Latency:</span>
              <span className="font-mono text-slate-700">120ms (Simulated)</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Security:</span>
              <span className="font-mono text-slate-700">TLS 1.3 / OAuth2.0 GFR</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
