import React from 'react';
import { ShieldCheck, Cpu, RefreshCw, Landmark, FileText, User, LogOut, Sparkles } from 'lucide-react';
import { Tender, Bidder, AuthUser } from '../types';

interface HeaderProps {
  tenders: Tender[];
  selectedTender: Tender;
  onSelectTender: (t: Tender) => void;
  bidders: Bidder[];
  selectedBidder: Bidder;
  onSelectBidder: (b: Bidder) => void;
  onResetDemo: () => void;
  onOpenReport: () => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  onToggleAiAssistant?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  tenders,
  selectedTender,
  onSelectTender,
  bidders,
  selectedBidder,
  onSelectBidder,
  onResetDemo,
  onOpenReport,
  currentUser,
  onLogout,
  onToggleAiAssistant,
}) => {
  let roleBadgeColor = 'bg-blue-950/80 text-blue-300 border-blue-800';
  if (currentUser?.role === 'OFFICER') {
    roleBadgeColor = 'bg-teal-950/80 text-teal-300 border-teal-800';
  } else if (currentUser?.role === 'AUDITOR') {
    roleBadgeColor = 'bg-amber-950/80 text-amber-300 border-amber-800';
  }

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      {/* Top tier banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 text-xs">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center gap-1.5 font-semibold text-teal-400 bg-teal-950/60 border border-teal-800/60 px-2 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            LIVE VERIFICATION
          </span>
          <span className="text-slate-400 hidden sm:inline">
            Government e-Marketplace (GeM) Procurement Compliance Engine
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 px-2.5 py-1 rounded text-slate-300">
            <Landmark className="w-3.5 h-3.5 text-blue-400" />
            <span>Simulated Portals:</span>
            <span className="text-emerald-400 font-medium">GSTN • Udyam • NSDL</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 px-2.5 py-1 rounded text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Model:</span>
            <span className="text-indigo-300 font-medium">Gemini 2.5 Pro</span>
          </div>

          {/* User Session Pill */}
          {currentUser && (
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg">
              <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-[10px] font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-[11px] font-bold text-slate-200 leading-none">
                  {currentUser.name}
                </div>
                <div className="text-[9px] text-slate-400 font-mono leading-tight mt-0.5">
                  {currentUser.roleLabel}
                </div>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border font-mono ${roleBadgeColor}`}>
                {currentUser.role}
              </span>

              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Sign out of portal"
                  className="ml-1 p-1 text-slate-400 hover:text-rose-300 transition"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          <button
            onClick={onResetDemo}
            title="Reset to default demo scenario"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Main navigation & quick switchers */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-900/30 border border-blue-400/30">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">
                GeM Compliance Intelligence
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Evidence-First
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Deterministic Rules + Multimodal AI Verification for Public Procurement
            </p>
          </div>
        </div>

        {/* Quick Selectors for Tender & Bidder */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-medium mb-0.5">
              Tender Ref
            </label>
            <select
              value={selectedTender.id}
              onChange={(e) => {
                const found = tenders?.find((t) => t.id === e.target.value);
                if (found) onSelectTender(found);
              }}
              className="bg-slate-800 text-slate-100 text-xs rounded-md border border-slate-700 px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none min-w-[170px]"
            >
              {tenders?.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.refNumber} — {t.authority.split('/')[0]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-medium mb-0.5">
              Bidder Under Evaluation
            </label>
            <select
              value={selectedBidder.id}
              onChange={(e) => {
                const found = bidders?.find((b) => b.id === e.target.value);
                if (found) onSelectBidder(found);
              }}
              className="bg-slate-800 text-slate-100 text-xs rounded-md border border-slate-700 px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none min-w-[210px]"
            >
              {bidders?.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.scenarioTag === 'CLEAN_COMPLIANT' ? 'Clean Demo' : b.scenarioTag === 'MISSING_EXPIRED' ? 'Missing/Expired' : 'Contradiction Demo'})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 self-end">
            {onToggleAiAssistant && (
              <button
                id="tour-header-ai-btn"
                type="button"
                onClick={onToggleAiAssistant}
                className="px-3 py-1.5 rounded-md bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-indigo-900/40 border border-blue-400/30 transition active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-300 animate-spin-slow" />
                <span>AI Help</span>
              </button>
            )}

            <button
              onClick={onOpenReport}
              className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Formal Report</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
