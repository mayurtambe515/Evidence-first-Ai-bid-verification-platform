import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  FileText,
  Search,
  Check,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  History,
  Scale,
  Send,
  Building2,
  FileCheck2,
  Lock,
} from 'lucide-react';
import {
  Tender,
  Bidder,
  ComplianceRule,
  OfficerDecision,
  CheckStatus,
  RiskLevel,
  SideBySideComparisonData,
} from '../types';
import { evaluateBidderCompliance, EvaluationResult } from '../utils/rulesEngine';
import { ComplianceRing } from './ComplianceRing';

interface OfficerFlowProps {
  tender: Tender;
  bidders: Bidder[];
  rules: ComplianceRule[];
  onRecordDecision: (
    bidderId: string,
    decision: OfficerDecision,
    reason: string,
    ruleId?: string
  ) => void;
  onOpenAuditLog: () => void;
  onOpenSideBySide: (data: SideBySideComparisonData) => void;
  onOpenAiAssistant?: () => void;
  initialSelectedBidderId?: string;
}

export const OfficerFlow: React.FC<OfficerFlowProps> = ({
  tender,
  bidders,
  rules,
  onRecordDecision,
  onOpenAuditLog,
  onOpenSideBySide,
  onOpenAiAssistant,
  initialSelectedBidderId,
}) => {
  // Navigation State: 'LIST' or 'DETAIL'
  const [activeBidderId, setActiveBidderId] = useState<string | null>(
    initialSelectedBidderId || null
  );

  // Filter State in List View
  const [riskFilter, setRiskFilter] = useState<'ALL' | RiskLevel>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Decision Form State in Detail View
  const [selectedDecision, setSelectedDecision] = useState<OfficerDecision>('APPROVE');
  const [decisionReason, setDecisionReason] = useState('');
  const [decisionSuccessToast, setDecisionSuccessToast] = useState(false);
  const [decisionError, setDecisionError] = useState('');

  // Currently inspected bidder
  const currentBidder = bidders.find((b) => b.id === activeBidderId);

  // Evaluate compliance
  const evaluation: EvaluationResult | null = currentBidder
    ? evaluateBidderCompliance(currentBidder, tender, rules)
    : null;

  // Filter and sort bidders (High Risk first by default for officer triage!)
  const riskWeight: Record<RiskLevel, number> = {
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
  };

  const sortedBidders = [...bidders].sort((a, b) => {
    const aEval = evaluateBidderCompliance(a, tender, rules);
    const bEval = evaluateBidderCompliance(b, tender, rules);
    return riskWeight[bEval.riskLevel] - riskWeight[aEval.riskLevel];
  });

  const filteredBidders = sortedBidders.filter((b) => {
    const bEval = evaluateBidderCompliance(b, tender, rules);
    if (riskFilter !== 'ALL' && bEval.riskLevel !== riskFilter) return false;
    if (
      searchQuery &&
      !b.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !b.registeredLegalName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !b.gstin.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Handle Recording Official Statutory Decision
  const handleDecisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDecisionError('');

    if (!activeBidderId) return;

    if (selectedDecision === 'REJECT' && !decisionReason.trim()) {
      setDecisionError('Statutory compliance requires a mandatory reason when rejecting a bid.');
      return;
    }

    onRecordDecision(
      activeBidderId,
      selectedDecision,
      decisionReason.trim() ||
        (selectedDecision === 'APPROVE'
          ? 'Meets all mandatory criteria with verified simulated portal cross-checks.'
          : 'Clarification requested on pending documents.')
    );

    setDecisionSuccessToast(true);
    setTimeout(() => {
      setDecisionSuccessToast(false);
    }, 3500);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Top Banner / Officer Control Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                Procurement Officer Mode
              </span>
              <span className="text-xs text-slate-400">
                Tender: <strong className="text-slate-300 font-mono">{tender.refNumber}</strong>
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white">
              Tender Evaluation & Compliance Decision Hub
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Review AI-generated compliance scores, inspect verified registry evidence, and record statutory award decisions.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
            <button
              type="button"
              onClick={onOpenAuditLog}
              className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <History className="w-3.5 h-3.5 text-teal-400" />
              <span>View Audit Log</span>
            </button>

            {onOpenAiAssistant && (
              <button
                type="button"
                onClick={onOpenAiAssistant}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>AI Assistant</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* VIEW 1: APPLICATIONS QUEUE / LIST VIEW */}
      {!activeBidderId && (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                Risk Filter:
              </span>
              {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setRiskFilter(lvl)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    riskFilter === lvl
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {lvl === 'ALL' ? 'All Applications' : `${lvl} Risk`}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search company or GSTIN..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* List of Applications */}
          <div className="space-y-3">
            {filteredBidders.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
                No tender applications match the selected filter.
              </div>
            ) : (
              filteredBidders.map((bidder) => {
                const bEval = evaluateBidderCompliance(bidder, tender, rules);
                const hasDecision = !!bidder.officerOverride;

                return (
                  <div
                    key={bidder.id}
                    onClick={() => setActiveBidderId(bidder.id)}
                    className="bg-slate-900 hover:bg-slate-850/80 border border-slate-800 hover:border-slate-700 rounded-xl p-4 sm:p-5 transition shadow-md cursor-pointer group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left: Info */}
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 border ${
                            bEval.riskLevel === 'LOW'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                              : bEval.riskLevel === 'MEDIUM'
                              ? 'bg-amber-950 text-amber-300 border-amber-800'
                              : 'bg-rose-950 text-rose-300 border-rose-800'
                          }`}
                        >
                          {bEval.score}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition">
                              {bidder.name}
                            </h3>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                bEval.riskLevel === 'LOW'
                                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                                  : bEval.riskLevel === 'MEDIUM'
                                  ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                                  : 'bg-rose-950/80 text-rose-300 border-rose-800'
                              }`}
                            >
                              {bEval.riskLevel} RISK
                            </span>

                            {hasDecision && (
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                  bidder.officerOverride?.decision === 'APPROVE'
                                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                                    : bidder.officerOverride?.decision === 'REJECT'
                                    ? 'bg-rose-950 text-rose-300 border-rose-700'
                                    : 'bg-amber-950 text-amber-300 border-amber-700'
                                }`}
                              >
                                {bidder.officerOverride?.decision}
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-slate-400 mt-0.5 truncate">
                            Legal: <span className="text-slate-300">{bidder.registeredLegalName}</span> • GSTIN:{' '}
                            <span className="font-mono text-slate-300">{bidder.gstin}</span>
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 flex-wrap">
                            <span>
                              Turnover: <strong className="text-slate-300">₹ {bidder.turnoverCr} Cr</strong>
                            </span>
                            <span>•</span>
                            <span>
                              Passed: <strong className="text-emerald-400">{bEval.passedCount}</strong> /{' '}
                              {bEval.totalChecks} checks
                            </span>
                            {bEval.failedCount > 0 && (
                              <>
                                <span>•</span>
                                <span className="text-rose-400 font-semibold">
                                  {bEval.failedCount} Failed
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Action */}
                      <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                        <button
                          type="button"
                          className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                        >
                          <span>Review Evidence</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: EVIDENCE-BACKED DETAIL VIEW (SINGLE COLUMN) */}
      {activeBidderId && currentBidder && evaluation && (
        <div className="space-y-6">
          {/* Back Button */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveBidderId(null)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Submitted Bids Queue</span>
            </button>

            <span className="text-xs text-slate-400">
              Application ID: <span className="font-mono text-slate-300">{currentBidder.id}</span>
            </span>
          </div>

          {/* TOP SECTION: Two-Column Layout (Score Ring in Column 1, Bidder Details in Column 2) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Column 1: Clearly bounded Compliance Score Ring Container */}
            <div className="md:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-between text-center">
              <div className="w-full pb-3 border-b border-slate-800/80">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Automated GeM Verification Index
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Statutory Compliance Score
                </div>
              </div>

              {/* Bounded Score Ring Gauge */}
              <div className="my-3 flex items-center justify-center">
                <ComplianceRing
                  score={evaluation.score}
                  riskLevel={evaluation.riskLevel}
                  size={135}
                  strokeWidth={12}
                />
              </div>

              {/* Risk Level Badge */}
              <div
                className={`px-3.5 py-1 rounded-full border text-xs font-bold tracking-wider inline-flex items-center gap-1.5 ${
                  evaluation.riskLevel === 'LOW'
                    ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                    : evaluation.riskLevel === 'MEDIUM'
                    ? 'bg-amber-950/80 border-amber-700 text-amber-300'
                    : 'bg-rose-950/80 border-rose-700 text-rose-300'
                }`}
              >
                {evaluation.riskLevel === 'LOW' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                {evaluation.riskLevel === 'MEDIUM' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                {evaluation.riskLevel === 'HIGH' && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                <span>{evaluation.riskLevel} RISK</span>
              </div>

              {/* Metric check counts */}
              <div className="grid grid-cols-3 gap-2 w-full mt-4 pt-4 border-t border-slate-800/80 text-center text-xs">
                <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2">
                  <div className="text-emerald-400 font-bold text-base">{evaluation.passedCount}</div>
                  <div className="text-[10px] text-slate-400 font-medium">Passed</div>
                </div>
                <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2">
                  <div className="text-amber-400 font-bold text-base">{evaluation.warningCount}</div>
                  <div className="text-[10px] text-slate-400 font-medium">Warnings</div>
                </div>
                <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2">
                  <div className="text-rose-400 font-bold text-base">{evaluation.failedCount}</div>
                  <div className="text-[10px] text-slate-400 font-medium">Failed</div>
                </div>
              </div>
            </div>

            {/* Column 2: Bidder Profile & Statutory Information Container */}
            <div className="md:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Applicant Dossier
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Ref: {tender.refNumber}
                  </span>
                </div>

                <div className="mt-4">
                  <h2 className="text-xl font-bold text-white tracking-tight">{currentBidder.name}</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Registered Legal Entity: <strong className="text-slate-200">{currentBidder.registeredLegalName}</strong>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Corporate PAN</div>
                    <div className="font-mono text-xs font-bold text-slate-200 mt-1">{currentBidder.pan}</div>
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">GSTIN</div>
                    <div className="font-mono text-xs font-bold text-slate-200 mt-1 truncate" title={currentBidder.gstin}>
                      {currentBidder.gstin}
                    </div>
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Annual Turnover</div>
                    <div className="text-xs font-bold text-emerald-400 mt-1">₹ {currentBidder.turnoverCr} Cr</div>
                  </div>
                </div>

                <div className="bg-slate-950/50 border border-slate-800/60 rounded-xl p-3 mt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Udyam Registration:</span>
                  <span className="font-mono font-bold text-teal-300">{currentBidder.udyamNumber || 'N/A'}</span>
                </div>
              </div>

              {/* Recorded Statutory Decision if already made */}
              {currentBidder.officerOverride ? (
                <div className="mt-4 pt-3 border-t border-slate-800/80 bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Recorded Officer Decision
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {currentBidder.officerOverride.timestamp.split('T')[0]}
                    </span>
                  </div>
                  <div
                    className={`text-sm font-bold ${
                      currentBidder.officerOverride.decision === 'APPROVE'
                        ? 'text-emerald-400'
                        : currentBidder.officerOverride.decision === 'REJECT'
                        ? 'text-rose-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {currentBidder.officerOverride.decision}
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {currentBidder.officerOverride.reason}
                  </p>
                </div>
              ) : (
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Statutory Evaluation Status:</span>
                  <span className="text-amber-300 font-semibold bg-amber-950/50 border border-amber-800/60 px-2.5 py-0.5 rounded-full">
                    Awaiting Officer Award Determination
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* FULL-WIDTH SECTION: EVIDENCE & EXPLAINABILITY BREAKDOWN */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Documentary Evidence & Cross-Check Results
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Detailed statutory findings with document sources, simulated registry records, and cross-checks.
                </p>
              </div>

              <span className="text-[11px] text-teal-400 bg-teal-950/60 border border-teal-900 px-2.5 py-1 rounded font-mono self-start sm:self-auto">
                Deterministic Verification Engine
              </span>
            </div>

            {/* List of Evidence Items */}
            <div className="space-y-3">
              {evaluation.evidenceItems.map((item) => {
                const isPass = item.status === 'PASS';
                const isWarning = item.status === 'WARNING';
                const isFail = item.status === 'FAIL';

                // Check if this item represents a contradiction that can be compared side-by-side
                const hasSideBySide = item.ruleId === 'RULE-PAN-01' || item.ruleId === 'RULE-OEM-01';

                return (
                  <div
                    key={item.ruleId}
                    className={`p-4 rounded-xl border transition ${
                      isPass
                        ? 'bg-slate-950/50 border-slate-800/90'
                        : isWarning
                        ? 'bg-amber-950/15 border-amber-900/60'
                        : 'bg-rose-950/15 border-rose-900/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="mt-1 flex-shrink-0">
                          {isPass && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          {isWarning && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                          {isFail && <XCircle className="w-4 h-4 text-rose-400" />}
                        </div>

                        <div className="space-y-2 min-w-0">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-white">{item.ruleTitle}</span>
                              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                                {item.ruleCode}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 mt-1">{item.explanation}</p>
                          </div>

                          {/* Evidence Citation Details */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-950/70 border border-slate-850 p-2.5 rounded-lg text-[11px]">
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                                Document Source
                              </span>
                              <span className="text-slate-200 font-medium truncate block">
                                {item.documentSource}
                              </span>
                            </div>

                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                                Extracted Value
                              </span>
                              <span className="text-slate-200 font-mono font-medium truncate block">
                                {item.extractedValue}
                              </span>
                            </div>

                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                                Simulated Portal Match
                              </span>
                              <span className="text-teal-300 font-medium truncate block">
                                {item.matchedPortal} (Simulated)
                              </span>
                            </div>
                          </div>

                          {/* Side-by-Side Comparison Trigger for discrepancies */}
                          {hasSideBySide && (isFail || isWarning) && (
                            <div className="pt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  onOpenSideBySide({
                                    ruleTitle: item.ruleTitle,
                                    tenderClause: 'GeM GTC Clause 4.12 — Entity & Authorization Validation',
                                    bidderDocument: {
                                      title: item.documentSource,
                                      extractedField: 'Declared Entity Name / Validity Date',
                                      extractedValue: item.extractedValue,
                                      ocrConfidence: 99.4,
                                      page: 1,
                                    },
                                    portalRecord: {
                                      portalName: item.matchedPortal,
                                      canonicalField: 'Registered Legal Master Record',
                                      canonicalValue:
                                        item.ruleId === 'RULE-PAN-01'
                                          ? 'Vertex Infotech Services LLP'
                                          : 'Authorization Expired on 2025-11-30',
                                      timestamp: '2026-03-01T08:30:00Z',
                                    },
                                    discrepancySummary: item.explanation,
                                    flagSeverity: item.status,
                                    suggestedAction:
                                      'Officer verification required. Reject if entity type or expiration violates tender criteria.',
                                  });
                                }}
                                className="px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition"
                              >
                                <Scale className="w-3.5 h-3.5" />
                                <span>Inspect Side-by-Side Document Comparison</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            isPass
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                              : isWarning
                              ? 'bg-amber-950 text-amber-300 border-amber-800'
                              : 'bg-rose-950 text-rose-300 border-rose-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STATUTORY OFFICER DECISION CARD */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Statutory Procurement Decision</span>
                <span className="text-[10px] px-2 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  OFFICIAL ACTION
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Record your final qualification decision for {currentBidder.name}. Every decision is committed with timestamp and designation.
              </p>
            </div>

            {decisionSuccessToast && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  Official decision successfully recorded and appended to the cryptographic audit trail!
                </span>
              </div>
            )}

            {decisionError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-700 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{decisionError}</span>
              </div>
            )}

            <form onSubmit={handleDecisionSubmit} className="space-y-4 text-xs">
              {/* Decision Choice Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedDecision('APPROVE')}
                  className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                    selectedDecision === 'APPROVE'
                      ? 'bg-emerald-950/80 border-emerald-500 text-white ring-1 ring-emerald-500'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <div className="font-bold text-emerald-400 text-xs">Approve Bid</div>
                    <div className="text-[10px] text-slate-400">Award qualification</div>
                  </div>
                  {selectedDecision === 'APPROVE' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDecision('REJECT')}
                  className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                    selectedDecision === 'REJECT'
                      ? 'bg-rose-950/80 border-rose-500 text-white ring-1 ring-rose-500'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <div className="font-bold text-rose-400 text-xs">Reject Bid</div>
                    <div className="text-[10px] text-slate-400">Requires mandatory reason</div>
                  </div>
                  {selectedDecision === 'REJECT' && <XCircle className="w-4 h-4 text-rose-400" />}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDecision('REQUEST_CLARIFICATION')}
                  className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                    selectedDecision === 'REQUEST_CLARIFICATION'
                      ? 'bg-amber-950/80 border-amber-500 text-white ring-1 ring-amber-500'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <div className="font-bold text-amber-400 text-xs">Request More Docs</div>
                    <div className="text-[10px] text-slate-400">Seek clarification</div>
                  </div>
                  {selectedDecision === 'REQUEST_CLARIFICATION' && (
                    <Clock className="w-4 h-4 text-amber-400" />
                  )}
                </button>
              </div>

              {/* Reason Input */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Decision Notes & Statutory Justification{' '}
                  {selectedDecision === 'REJECT' && (
                    <span className="text-rose-400 normal-case">(Mandatory for Rejection)</span>
                  )}
                </label>
                <textarea
                  rows={2}
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  placeholder={
                    selectedDecision === 'REJECT'
                      ? 'Specify the exact statutory rule, missing document, or legal entity mismatch (e.g. OEM Authorization expired)...'
                      : 'Enter any remarks or conditions...'
                  }
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl p-3 text-white text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={onOpenAuditLog}
                  className="text-xs text-slate-400 hover:text-teal-300 flex items-center gap-1.5 transition underline"
                >
                  <Lock className="w-3.5 h-3.5 text-teal-400" />
                  <span>View Chained Cryptographic Audit Record</span>
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-950/50 transition active:scale-98"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Record Official Decision</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
