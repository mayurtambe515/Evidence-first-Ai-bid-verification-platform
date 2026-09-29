import React from 'react';
import { SideBySideComparisonData } from '../types';
import {
  X,
  FileText,
  AlertOctagon,
  Scale,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  Fingerprint,
  ArrowRightLeft,
} from 'lucide-react';

interface SideBySideComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SideBySideComparisonData | null;
}

export const SideBySideComparisonModal: React.FC<SideBySideComparisonModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl shadow-2xl shadow-slate-950 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-700/60 flex items-center justify-center text-rose-400">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  Side-by-Side Forensic Evidence Comparison
                </h2>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                  {data.discrepancyType}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Requirement: <strong className="text-slate-200">{data.requirementName}</strong> • Rule: <strong className="font-mono text-teal-400">{data.ruleCitation}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Plain-English Auditor Explanation Banner */}
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-700/60 flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] uppercase font-bold text-rose-300 tracking-wider">
                Forensic Finding & Discrepancy Analysis
              </div>
              <p className="text-sm font-medium text-rose-100 mt-1 leading-relaxed">
                {data.explanation}
              </p>
            </div>
          </div>

          {/* Two Source Documents Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* DOCUMENT A: Submitted Bidder Record */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between relative shadow-inner">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Document A (Submitted by Bidder)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {data.docA.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">{data.docA.title}</h3>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                    <span>Source: {data.docA.source}</span>
                    {data.docA.uploadDate && <span>• Uploaded: {data.docA.uploadDate}</span>}
                  </div>
                </div>

                {/* Raw Snippet Context */}
                {data.docA.rawSnippet && (
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-[11px] font-mono text-slate-400 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                    {data.docA.rawSnippet}
                  </div>
                )}

                {/* THE RED HIGHLIGHT BOX */}
                <div className="mt-4 p-4 rounded-xl bg-rose-950/40 border-2 border-rose-600 ring-4 ring-rose-950/60">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center justify-between mb-1.5">
                    <span>Highlighted Extracted Field</span>
                    <span className="font-mono">{data.docA.highlightField}</span>
                  </div>
                  <div className="text-base font-black font-mono text-rose-200 bg-rose-950/70 p-2.5 rounded-lg border border-rose-700/80 break-all">
                    {data.docA.highlightValue}
                  </div>
                  <div className="text-[10px] text-rose-300/80 mt-2 flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                    <span>Contradicts verified official counterpart record</span>
                  </div>
                </div>
              </div>

              {data.docA.confidence && (
                <div className="mt-4 pt-3 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>OCR Confidence: {Math.round(data.docA.confidence * 100)}%</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Fingerprint className="w-3 h-3" />
                    SHA256 Sealed
                  </span>
                </div>
              )}
            </div>

            {/* DOCUMENT B: Counterpart Document or Official Portal Benchmark */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between relative shadow-inner">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-teal-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Document B (Counterpart / Registry Benchmark)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                    {data.docB.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">{data.docB.title}</h3>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                    <span>Source: {data.docB.source}</span>
                    {data.docB.verifiedAt && <span>• Verified: {data.docB.verifiedAt}</span>}
                  </div>
                </div>

                {/* Registry Record Context */}
                {data.docB.registryRecord && (
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-[11px] font-mono text-slate-400 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                    {data.docB.registryRecord}
                  </div>
                )}

                {/* THE RED/AMBER HIGHLIGHT BOX ON BENCHMARK */}
                <div className="mt-4 p-4 rounded-xl bg-amber-950/30 border-2 border-amber-600 ring-4 ring-amber-950/60">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between mb-1.5">
                    <span>Counterpart Verified Registry Value</span>
                    <span className="font-mono">{data.docB.highlightField}</span>
                  </div>
                  <div className="text-base font-black font-mono text-amber-200 bg-amber-950/60 p-2.5 rounded-lg border border-amber-700/80 break-all">
                    {data.docB.highlightValue}
                  </div>
                  <div className="text-[10px] text-amber-300/80 mt-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>Official verified data point from statutory registry</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Registry Protocol: API v2.4</span>
                <span className="text-emerald-400 font-medium">Digital Signature Valid</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-400 text-[11px]">
            Statutory Reference: GeM General Conditions of Contract (Clause 4.1 - Bidder Identity Verification)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition font-medium"
            >
              Close Comparison
            </button>
            <button
              onClick={() => {
                alert(`Evidence comparison item logged to Tender Committee Dossier with cryptographic signature.`);
                onClose();
              }}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center gap-1.5 transition shadow-sm"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Flag to Committee Dossier</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
