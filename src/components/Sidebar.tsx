import React from 'react';
import {
  LayoutDashboard,
  FileCheck2,
  Users,
  FolderOpen,
  Globe2,
  Sliders,
  History,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { Bidder } from '../types';

export type TabType =
  | 'dashboard'
  | 'tenders'
  | 'bidders'
  | 'documents'
  | 'portals'
  | 'rules'
  | 'audit'
  | 'report';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  selectedBidder: Bidder;
  onQuickLoadScenario: (tag: 'CLEAN_COMPLIANT' | 'MISSING_EXPIRED' | 'SUBTLE_CONTRADICTION') => void;
  onOpenAiAssistant?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  selectedBidder,
  onQuickLoadScenario,
  onOpenAiAssistant,
}) => {
  const navItems = [
    { id: 'dashboard' as TabType, label: 'Dashboard Cockpit', icon: LayoutDashboard, badge: null },
    { id: 'tenders' as TabType, label: 'Tenders & Criteria', icon: FileCheck2, badge: null },
    { id: 'bidders' as TabType, label: 'Bidders Evaluated', icon: Users, badge: '3 Demo' },
    { id: 'documents' as TabType, label: 'Documents & AI Parsing', icon: FolderOpen, badge: '5 Files' },
    { id: 'portals' as TabType, label: 'Govt Portals Cross-Check', icon: Globe2, badge: 'Simulated' },
    { id: 'rules' as TabType, label: 'Rules Configuration', icon: Sliders, badge: 'JSON' },
    { id: 'audit' as TabType, label: 'Audit Trail Logs', icon: History, badge: null },
    { id: 'report' as TabType, label: 'Formal Audit Report', icon: FileText, badge: 'Official' },
  ];

  return (
    <aside
      id="tour-sidebar"
      className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 min-h-[calc(100vh-105px)]"
    >
      {/* Navigation links */}
      <div className="p-4 space-y-1">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={item.id === 'audit' ? 'tour-sidebar-audit-tab' : undefined}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                  item.badge === 'Simulated'
                    ? 'bg-teal-900/50 text-teal-300 border border-teal-800'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Scenario Switcher (Procurement Scenarios) */}
      <div id="tour-sidebar-scenarios" className="mt-auto p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
          <span>Evaluation Scenarios</span>
          <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">PRESETS</span>
        </div>
        <div className="space-y-1.5">
          <button
            onClick={() => onQuickLoadScenario('CLEAN_COMPLIANT')}
            className={`w-full text-left p-2 rounded text-xs transition border ${
              selectedBidder.scenarioTag === 'CLEAN_COMPLIANT'
                ? 'bg-emerald-950/40 border-emerald-600 text-emerald-300'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-1.5 font-semibold text-emerald-400 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Bidder A: Clean Success</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">All checks green, valid OEM</p>
          </button>

          <button
            onClick={() => onQuickLoadScenario('MISSING_EXPIRED')}
            className={`w-full text-left p-2 rounded text-xs transition border ${
              selectedBidder.scenarioTag === 'MISSING_EXPIRED'
                ? 'bg-amber-950/40 border-amber-600 text-amber-300'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-1.5 font-semibold text-amber-400 text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Bidder B: Missing & Expired</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">No OEM auth + overdue GST</p>
          </button>

          <button
            onClick={() => onQuickLoadScenario('SUBTLE_CONTRADICTION')}
            className={`w-full text-left p-2 rounded text-xs transition border ${
              selectedBidder.scenarioTag === 'SUBTLE_CONTRADICTION'
                ? 'bg-rose-950/40 border-rose-600 text-rose-300'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-1.5 font-semibold text-rose-400 text-[11px]">
              <XCircle className="w-3.5 h-3.5" />
              <span>Bidder C: Bad Bidder Showcase</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Spelling discrepancy & LLP vs Ltd</p>
          </button>
        </div>

        {/* AI Assistant Help Launcher */}
        {onOpenAiAssistant && (
          <div className="mt-3 pt-3 border-t border-slate-800">
            <button
              onClick={onOpenAiAssistant}
              className="w-full p-2.5 rounded-lg bg-gradient-to-r from-blue-950/90 via-indigo-950/80 to-slate-900 border border-blue-600/40 hover:border-blue-400 text-left transition group shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-blue-300 group-hover:text-white transition">
                  <Sparkles className="w-3.5 h-3.5 text-teal-300 animate-spin-slow" />
                  <span>GeM AI Assistant</span>
                </span>
                <span className="text-[9px] font-mono bg-blue-900/60 text-blue-200 px-1 py-0.2 rounded border border-blue-700/50">
                  HELP
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                Ask about app features, rules, or how to add documents
              </p>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
