import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Building2,
  Scale,
  Cpu,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { ComplianceEvidenceItem, CheckStatus, SideBySideComparisonData } from '../types';
import { ArrowRightLeft } from 'lucide-react';

interface EvidenceChecklistProps {
  items: ComplianceEvidenceItem[];
  filter: 'ALL' | CheckStatus;
  onFilterChange: (f: 'ALL' | CheckStatus) => void;
  onOpenComparison?: (data: SideBySideComparisonData) => void;
}

export const EvidenceChecklist: React.FC<EvidenceChecklistProps> = ({
  items,
  filter,
  onFilterChange,
  onOpenComparison,
}) => {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    // By default expand failed or warning items for high visibility in demo
    'RULE-PAN-01': true,
    'RULE-OEM-01': true,
    'RULE-GST-02': true,
  });

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const next: Record<string, boolean> = {};
    items.forEach((i) => {
      next[i.ruleId] = true;
    });
    setExpandedIds(next);
  };

  const collapseAll = () => {
    setExpandedIds({});
  };

  const filteredItems = items.filter((item) => {
    if (filter === 'ALL') return true;
    return item.status === filter;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
      {/* Header and Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Evidence-Backed Compliance Requirements</span>
            <span className="text-xs font-normal text-slate-400">
              ({items.length} deterministic criteria)
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any requirement to audit the supporting document, extracted field, and verified registry value.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter Buttons */}
          <div className="flex items-center bg-slate-950/70 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => onFilterChange('ALL')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                filter === 'ALL'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({items.length})
            </button>
            <button
              onClick={() => onFilterChange('FAIL')}
              className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1 transition ${
                filter === 'FAIL'
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              <XCircle className="w-3 h-3 text-rose-400" />
              <span>Failed ({items.filter((i) => i.status === 'FAIL').length})</span>
            </button>
            <button
              onClick={() => onFilterChange('WARNING')}
              className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1 transition ${
                filter === 'WARNING'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>Warnings ({items.filter((i) => i.status === 'WARNING').length})</span>
            </button>
            <button
              onClick={() => onFilterChange('PASS')}
              className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1 transition ${
                filter === 'PASS'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Passed ({items.filter((i) => i.status === 'PASS').length})</span>
            </button>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-400">
            <button
              onClick={expandAll}
              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-slate-200 transition"
            >
              Expand All
            </button>
            <span>•</span>
            <button
              onClick={collapseAll}
              className="px-2 py-1 rounded hover:bg-slate-800 hover:text-slate-200 transition"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="mt-4 space-y-3">
        {filteredItems.map((item) => {
          const isExpanded = !!expandedIds[item.ruleId];

          let icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />;
          let borderClass = 'border-slate-800 hover:border-slate-700 bg-slate-950/40';
          let statusBadge = (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-950/70 text-emerald-300 border border-emerald-800/60">
              <CheckCircle2 className="w-3 h-3" />
              VERIFIED / PASSED
            </span>
          );

          if (item.status === 'FAIL') {
            icon = <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />;
            borderClass = 'border-rose-900/60 hover:border-rose-700 bg-rose-950/10';
            statusBadge = (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-950/90 text-rose-300 border border-rose-800/80">
                <XCircle className="w-3 h-3" />
                FAILED / VIOLATION
              </span>
            );
          } else if (item.status === 'WARNING') {
            icon = <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />;
            borderClass = 'border-amber-900/60 hover:border-amber-700 bg-amber-950/10';
            statusBadge = (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-950/90 text-amber-300 border border-amber-800/80">
                <AlertTriangle className="w-3 h-3" />
                WARNING / AUDIT REQUIRED
              </span>
            );
          }

          return (
            <div
              key={item.ruleId}
              className={`border rounded-lg transition-all duration-200 ${borderClass}`}
            >
              {/* Card Summary Row (Clickable) */}
              <button
                onClick={() => toggleExpand(item.ruleId)}
                className="w-full text-left p-4 flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {icon}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-blue-400 bg-blue-950/60 border border-blue-800/60 px-1.5 py-0.5 rounded">
                        {item.ruleCode}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-100">{item.ruleTitle}</h4>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="flex items-center gap-1 text-slate-400">
                        <FileText className="w-3 h-3 text-slate-500" />
                        <span>Source: <strong className="text-slate-300 font-normal">{item.documentSource}</strong></span>
                      </span>
                      <span>•</span>
                      <span>Field: <strong className="text-slate-300 font-normal">{item.documentField}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {statusBadge}
                  <div className="text-slate-400 hover:text-white">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </button>

              {/* Expanded Evidence Detail View */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 bg-slate-950/60">
                  {/* Evidence Deep-Dive Box */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3 text-xs">
                    {/* Extracted Document Value */}
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-blue-400" />
                          <span>Extracted from Bidder Document</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {item.documentSource}
                        </span>
                      </div>
                      <div className="font-mono text-xs text-slate-200 bg-slate-950 border border-slate-800/80 rounded p-2.5 mt-1 overflow-x-auto break-all">
                        {item.extractedValue}
                      </div>
                    </div>

                    {/* Government Portal Expected Value */}
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-teal-400" />
                          <span>Official Registry Benchmark</span>
                        </span>
                        <span className="text-[10px] text-teal-400/80 font-mono">
                          {item.matchedPortal}
                        </span>
                      </div>
                      <div className="font-mono text-xs text-slate-200 bg-slate-950 border border-slate-800/80 rounded p-2.5 mt-1 overflow-x-auto break-all">
                        {item.expectedPortalValue}
                      </div>
                    </div>
                  </div>

                  {/* SIDE-BY-SIDE CONTRADICTION VIEW (Bad Bidder Showcase scenario - e.g. Bidder C) */}
                  {item.contradiction && (
                    <div className="my-3 p-3.5 rounded-lg border border-rose-600/60 bg-rose-950/40 text-xs">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                        <span className="font-bold text-rose-300 uppercase tracking-wider text-[11px]">
                          Forensic Contradiction Detected (Gemini AI + Rules Engine)
                        </span>
                        <span className="ml-auto text-[10px] bg-rose-900/60 border border-rose-700 text-rose-200 px-2 py-0.5 rounded font-mono">
                          {item.contradiction.discrepancyType}
                        </span>
                      </div>

                      {/* Side-by-side mismatch comparison */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2">
                        <div className="bg-slate-950 border border-rose-900/50 p-2.5 rounded">
                          <div className="text-[10px] text-slate-400 font-semibold mb-1">
                            Source Document A: {item.contradiction.doc1Label}
                          </div>
                          <div className="font-mono text-xs font-bold text-rose-300 bg-rose-950/50 px-2 py-1.5 rounded border border-rose-800/50">
                            {item.contradiction.doc1Value}
                          </div>
                        </div>

                        <div className="bg-slate-950 border border-rose-900/50 p-2.5 rounded">
                          <div className="text-[10px] text-slate-400 font-semibold mb-1">
                            Source Document B: {item.contradiction.doc2Label}
                          </div>
                          <div className="font-mono text-xs font-bold text-amber-300 bg-amber-950/50 px-2 py-1.5 rounded border border-amber-800/50">
                            {item.contradiction.doc2Value}
                          </div>
                        </div>
                      </div>

                      <p className="text-rose-200 leading-relaxed mt-2 bg-rose-950/30 p-2 rounded border border-rose-900/40">
                        <strong>Auditor Finding:</strong> {item.contradiction.explanation}
                      </p>

                      {onOpenComparison && (
                        <div className="mt-2.5 pt-2 border-t border-rose-900/50 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              onOpenComparison({
                                discrepancyType: item.contradiction?.discrepancyType || 'CONTRADICTION',
                                requirementName: item.ruleTitle,
                                ruleCitation: item.ruleCitation,
                                explanation: item.contradiction?.explanation || item.explanation,
                                docA: {
                                  title: item.contradiction?.doc1Label || 'Submitted Tender Document',
                                  source: 'Bidder Submission Bundle',
                                  status: 'SUBMITTED',
                                  rawSnippet: item.documentSnippet,
                                  highlightField: item.contradiction?.discrepancyType === 'EXPIRATION_MISMATCH' ? 'Validity Period' : 'Legal Constitution',
                                  highlightValue: item.contradiction?.doc1Value || item.extractedFieldValue,
                                  confidence: item.aiConfidence,
                                },
                                docB: {
                                  title: item.contradiction?.doc2Label || 'Government Registry / Counterpart',
                                  source: 'Statutory Registry Benchmark',
                                  status: 'PORTAL_VERIFIED',
                                  registryRecord: `Registry: ${item.sourcePortal || 'Official Government Portal'}\nVerified Value: ${item.verifiedPortalValue || item.contradiction?.doc2Value}\nDiscrepancy Status: UNRESOLVED CONTRADICTION`,
                                  highlightField: item.contradiction?.discrepancyType === 'EXPIRATION_MISMATCH' ? 'Active Expiry Date' : 'Registered Constitution',
                                  highlightValue: item.contradiction?.doc2Value || item.verifiedPortalValue,
                                  verifiedAt: '2026-09-09 10:15 IST',
                                },
                              });
                            }}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow transition active:scale-95"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                            <span>Inspect Side-by-Side Forensic Evidence →</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Rule Citation and AI Confidence Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Scale className="w-3.5 h-3.5 text-slate-500" />
                      <span>Rule Citation: <strong className="text-slate-300 font-normal">{item.ruleCitation}</strong></span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-slate-400">
                        <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                        <span>AI Extraction Confidence:</span>
                        <span className="text-indigo-300 font-semibold font-mono">
                          {Math.round(item.aiConfidence * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Plain Language Explanation */}
                  <div className="mt-2 text-xs text-slate-300 bg-slate-900/80 border border-slate-800/80 rounded p-2.5 leading-relaxed">
                    <span className="font-semibold text-slate-400 mr-1.5">Compliance Finding:</span>
                    {item.explanation}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
