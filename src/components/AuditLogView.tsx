import React, { useState } from 'react';
import { AuditLogEntry } from '../types';
import { verifyAuditChain, buildChainedAuditLogs, VerificationResult } from '../utils/auditChain';
import {
  History,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  KeyRound,
  FileText,
  UserCheck,
  Link as LinkIcon,
  ShieldAlert,
  RotateCcw,
  Bug,
} from 'lucide-react';

interface AuditLogViewProps {
  logs: AuditLogEntry[];
  onUpdateLogs?: (newLogs: AuditLogEntry[]) => void;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs: initialLogs, onUpdateLogs }) => {
  const [currentLogs, setCurrentLogs] = useState<AuditLogEntry[]>(initialLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(() =>
    verifyAuditChain(initialLogs)
  );
  const [isTampered, setIsTampered] = useState(false);

  const handleVerifyChain = () => {
    const res = verifyAuditChain(currentLogs);
    setVerificationResult(res);
  };

  const handleSimulateTampering = () => {
    // Modify block 2 (Bharat Logistics) score and passed checks without updating the hash signature
    const tampered = currentLogs.map((log) => {
      if (log.id === 'audit-002') {
        return {
          ...log,
          score: 95, // Illegitimately inflated score
          riskLevel: 'LOW' as const,
          passedChecks: 6,
          failedChecks: 0,
        };
      }
      return log;
    });

    setCurrentLogs(tampered);
    setIsTampered(true);
    // Immediately verify to show the tamper alert
    const res = verifyAuditChain(tampered);
    setVerificationResult(res);

    if (onUpdateLogs) {
      onUpdateLogs(tampered);
    }
  };

  const handleRestoreChain = () => {
    const restored = buildChainedAuditLogs(initialLogs);
    setCurrentLogs(restored);
    setIsTampered(false);
    const res = verifyAuditChain(restored);
    setVerificationResult(res);

    if (onUpdateLogs) {
      onUpdateLogs(restored);
    }
  };

  const filteredLogs = currentLogs.filter((log) => {
    const matchesSearch =
      log.bidderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.tenderRef.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk = filterRisk === 'ALL' || log.riskLevel === filterRisk;
    return matchesSearch && matchesRisk;
  });

  return (
    <div id="tour-audit-view" className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-blue-400" />
              <span>Chained Cryptographic Audit Trail</span>
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800 font-mono">
              SHA-256 HASH CHAIN
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Tamper-evident audit ledger where every compliance decision and officer override is cryptographically linked to its predecessor.
          </p>
        </div>

        {/* Chain Integrity Actions */}
        <div id="tour-audit-actions" className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleVerifyChain}
            className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition active:scale-95"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verify Chain Integrity</span>
          </button>

          {!isTampered ? (
            <button
              onClick={handleSimulateTampering}
              title="Demonstrates tamper detection by silently modifying Block #2 record data"
              className="px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-700/80 text-rose-200 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Bug className="w-3.5 h-3.5 text-rose-400" />
              <span>Simulate Tamper</span>
            </button>
          ) : (
            <button
              onClick={handleRestoreChain}
              className="px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-teal-400" />
              <span>Restore Valid Chain</span>
            </button>
          )}
        </div>
      </div>

      {/* Cryptographic Verification Status Card */}
      {verificationResult && (
        <div
          className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md ${
            verificationResult.isValid
              ? 'bg-emerald-950/40 border-emerald-700 text-emerald-200'
              : 'bg-rose-950/60 border-rose-600 text-rose-100 animate-pulse'
          }`}
        >
          <div className="flex items-start gap-3">
            {verificationResult.isValid ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-6 h-6 text-rose-400 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider">
                  {verificationResult.isValid
                    ? 'Cryptographic Hash Chain Verified'
                    : 'INTEGRITY BREACH DETECTED: Tampering Found'}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900/80 border border-slate-700">
                  {verificationResult.totalBlocks} Blocks Evaluated
                </span>
              </div>
              <p className="text-xs mt-1 leading-relaxed">{verificationResult.message}</p>
              {!verificationResult.isValid && verificationResult.brokenBlockNumber && (
                <div className="mt-2 text-[11px] font-mono bg-rose-950/90 p-2 rounded border border-rose-800 space-y-0.5">
                  <div>Compromised Block: #{verificationResult.brokenBlockNumber}</div>
                  <div className="truncate">Expected Hash: {verificationResult.expectedHash}</div>
                  <div className="truncate">Recorded Hash: {verificationResult.actualHash}</div>
                </div>
              )}
            </div>
          </div>

          <div className="text-right flex-shrink-0 font-mono text-[11px] text-slate-400">
            <div>Algorithm: SHA-256</div>
            <div>Status: {verificationResult.isValid ? 'UNBROKEN' : 'CORRUPTED'}</div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/50 p-3 rounded-xl border border-slate-850">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search bidder, tender, or hash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:ring-1 focus:ring-blue-500 focus:outline-none w-56"
            />
          </div>

          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="LOW">Low Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="HIGH">High Risk</option>
          </select>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Showing {filteredLogs.length} of {currentLogs.length} Blocks
        </div>
      </div>

      {/* Chained Blocks List */}
      <div className="space-y-4">
        {filteredLogs.map((log, index) => {
          let riskBadge = null;
          if (log.riskLevel === 'LOW') {
            riskBadge = (
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                LOW RISK ({log.score}%)
              </span>
            );
          } else if (log.riskLevel === 'MEDIUM') {
            riskBadge = (
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800">
                MEDIUM RISK ({log.score}%)
              </span>
            );
          } else {
            riskBadge = (
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-950/80 text-rose-300 border border-rose-800">
                HIGH RISK ({log.score}%)
              </span>
            );
          }

          const isGenesis = index === 0;

          return (
            <div
              key={log.id}
              className={`bg-slate-900 border rounded-xl p-5 shadow-sm space-y-3.5 transition ${
                isTampered && log.id === 'audit-002'
                  ? 'border-rose-500 ring-2 ring-rose-500/50 bg-rose-950/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 flex items-center gap-1">
                    <LinkIcon className="w-3 h-3" />
                    Block #{log.blockNumber || index + 1}
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {log.tenderRef}
                  </span>
                  <h3 className="text-sm font-bold text-white">{log.bidderName}</h3>
                </div>

                <div className="flex items-center gap-2.5">
                  {riskBadge}
                  <span className="text-xs text-slate-400 font-mono">{log.timestamp}</span>
                </div>
              </div>

              {/* Cryptographic Chain Data Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-950/80 rounded-lg p-3 border border-slate-850 font-mono text-[11px]">
                {/* Previous Block Hash Pointer */}
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                    <span>Previous Block Hash (Parent Link)</span>
                    {isGenesis && (
                      <span className="text-[9px] text-teal-400 font-normal">[GENESIS ROOT]</span>
                    )}
                  </div>
                  <div className="text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800 truncate select-all">
                    {log.previousHash || '0000000000000000000000000000000000000000000000000000000000000000'}
                  </div>
                </div>

                {/* Current Block Hash Signature */}
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-bold text-teal-400 flex items-center justify-between">
                    <span>Block Cryptographic Signature</span>
                    <span className="text-[9px] text-slate-400">SHA-256 SEAL</span>
                  </div>
                  <div className="text-teal-300 bg-slate-900 px-2 py-1 rounded border border-slate-800 truncate select-all font-semibold">
                    {log.hashSignature}
                  </div>
                </div>
              </div>

              {/* Checks summary breakdown */}
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-300 gap-3 pt-1">
                <div className="flex items-center gap-4">
                  <span>
                    Passed: <strong className="text-emerald-400">{log.passedChecks}</strong>
                  </span>
                  <span>
                    Warnings: <strong className="text-amber-400">{log.warningChecks}</strong>
                  </span>
                  <span>
                    Failed: <strong className="text-rose-400">{log.failedChecks}</strong>
                  </span>
                  <span>
                    Total Checks: <strong className="text-slate-200">{log.totalChecks}</strong>
                  </span>
                </div>

                <div className="text-[11px] text-slate-400">
                  Block Payload Verified by Portal Core Engine
                </div>
              </div>

              {/* Officer Override Record if exists */}
              {log.officerOverride?.isOverridden && (
                <div className="mt-3 p-3 rounded-lg border border-amber-500/40 bg-amber-950/30 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-amber-300">
                      <UserCheck className="w-4 h-4 text-amber-400" />
                      <span>OFFICER STATUTORY OVERRIDE EXECUTED:</span>
                      <span className="underline uppercase tracking-wide">
                        {log.officerOverride.decision}
                      </span>
                    </div>
                    <span className="text-[11px] text-amber-400/80 font-mono">
                      {log.officerOverride.timestamp}
                    </span>
                  </div>

                  <div className="text-slate-300 mt-1">
                    <span className="text-slate-400">Officer: </span>
                    <strong>{log.officerOverride.officerName}</strong> ({log.officerOverride.officerDesignation}) — ID: {log.officerOverride.officerId}
                  </div>

                  <div className="text-amber-200/90 pt-1 leading-relaxed bg-amber-950/40 p-2 rounded border border-amber-800/40">
                    <strong className="text-amber-400">Mandatory Statutory Justification: </strong>
                    {log.officerOverride.justification}
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
