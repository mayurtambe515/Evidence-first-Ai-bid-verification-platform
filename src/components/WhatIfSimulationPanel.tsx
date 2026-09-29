import React from 'react';
import { Bidder, ComplianceEvidenceItem, RiskLevel } from '../types';
import {
  Sparkles,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';

export interface SimulationCorrection {
  ruleCode: string;
  docTitle: string;
  fixDescription: string;
  applied: boolean;
}

interface WhatIfSimulationPanelProps {
  bidder: Bidder;
  originalScore: number;
  originalRisk: RiskLevel;
  simulatedScore: number;
  simulatedRisk: RiskLevel;
  isSimulating: boolean;
  corrections: SimulationCorrection[];
  onToggleCorrection: (ruleCode: string) => void;
  onExitSimulation: () => void;
  onStartSimulation: () => void;
}

export const WhatIfSimulationPanel: React.FC<WhatIfSimulationPanelProps> = ({
  bidder,
  originalScore,
  originalRisk,
  simulatedScore,
  simulatedRisk,
  isSimulating,
  corrections,
  onToggleCorrection,
  onExitSimulation,
  onStartSimulation,
}) => {
  const scoreDelta = simulatedScore - originalScore;

  if (!isSimulating) {
    return (
      <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-800/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-900/60 border border-indigo-700/60 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-200 flex items-center gap-2">
              <span>Officer "What-If" Resubmission Simulator</span>
              <span className="text-[9px] bg-indigo-950 text-indigo-300 border border-indigo-700 px-1.5 py-0.2 rounded font-mono">
                NON-DESTRUCTIVE
              </span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Hypothetically correct failed or expired documents to project compliance scores if rectified under GeM Clause 8.4.
            </p>
          </div>
        </div>

        <button
          onClick={onStartSimulation}
          className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-950 transition flex-shrink-0"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Launch Simulation Mode</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-indigo-950/70 border-2 border-indigo-500/80 rounded-xl p-5 shadow-2xl shadow-indigo-950/80 space-y-4 animate-fadeIn">
      {/* Simulation Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-indigo-800/60">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-200">
                ACTIVE SIMULATION: Hypothetical Resubmission Model
              </span>
              <span className="text-[10px] font-mono bg-purple-900/80 text-purple-200 border border-purple-600 px-2 py-0.5 rounded">
                PREVIEW ONLY
              </span>
            </div>
            <p className="text-[11px] text-indigo-300/80 mt-0.5">
              Official evaluation record remains intact. Simulating committee query response for <strong className="text-white">{bidder.name}</strong>.
            </p>
          </div>
        </div>

        <button
          onClick={onExitSimulation}
          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
          <span>Exit Simulation</span>
        </button>
      </div>

      {/* Projected Score Impact Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/80 border border-indigo-900/60 rounded-xl p-4">
        {/* Baseline State */}
        <div className="space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">Baseline Actual Score</div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-300">{originalScore}%</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
              originalRisk === 'LOW' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
              originalRisk === 'MEDIUM' ? 'bg-amber-950 text-amber-400 border-amber-800' :
              'bg-rose-950 text-rose-400 border-rose-800'
            }`}>
              {originalRisk} RISK
            </span>
          </div>
          <div className="text-[10px] text-slate-400">Current official GeM submission</div>
        </div>

        {/* Projected State */}
        <div className="space-y-1 sm:border-l sm:border-slate-800 sm:pl-4">
          <div className="text-[10px] uppercase font-bold text-indigo-300">Projected Score If Resubmitted</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-teal-300">{simulatedScore}%</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
              simulatedRisk === 'LOW' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
              simulatedRisk === 'MEDIUM' ? 'bg-amber-950 text-amber-400 border-amber-800' :
              'bg-rose-950 text-rose-400 border-rose-800'
            }`}>
              {simulatedRisk} RISK
            </span>
          </div>
          <div className="text-[10px] text-teal-400/90 font-medium">
            {scoreDelta > 0 ? `+${scoreDelta}% Potential Improvement` : 'No change yet'}
          </div>
        </div>

        {/* Committee Recommendation */}
        <div className="space-y-1 sm:border-l sm:border-slate-800 sm:pl-4">
          <div className="text-[10px] uppercase font-bold text-slate-400">Clause 8.4 Guidance</div>
          <div className="text-xs font-semibold text-white">
            {simulatedScore >= 80 ? (
              <span className="text-emerald-400">Recommended for Committee Clarification Notice</span>
            ) : (
              <span className="text-amber-400">Substantial Non-Compliance Remains</span>
            )}
          </div>
          <div className="text-[10px] text-slate-400">
            Bidder would cross qualifying threshold upon verified submission
          </div>
        </div>
      </div>

      {/* Interactive Toggles for Defective Items */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-200">
          Hypothetical Resubmission Options (Click to Toggle):
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {corrections.map((item) => (
            <button
              key={item.ruleCode}
              type="button"
              onClick={() => onToggleCorrection(item.ruleCode)}
              className={`p-3 rounded-lg text-left transition border flex items-start justify-between gap-3 ${
                item.applied
                  ? 'bg-teal-950/70 border-teal-500 text-teal-100 ring-1 ring-teal-500'
                  : 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:bg-slate-850'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  {item.applied ? (
                    <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-500 flex-shrink-0" />
                  )}
                  <span>{item.docTitle}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal pl-5.5">
                  {item.fixDescription}
                </p>
              </div>

              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded flex-shrink-0 ${
                item.applied
                  ? 'bg-teal-900 text-teal-200 border border-teal-700'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {item.applied ? 'CORRECTED' : 'UNTOUCHED'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
