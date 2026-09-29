import React, { useState } from 'react';
import {
  X,
  FileCheck,
  Building2,
  Check,
  AlertTriangle,
  Clock,
  Printer,
  Download,
  ShieldCheck,
  Shield,
  FileText,
} from 'lucide-react';
import {
  RecentBidder,
  SAMPLE_BIDDER_CHECKLIST,
  SAMPLE_PORTAL_CHECKS,
  SAMPLE_BIDDER_DOCUMENTS,
  OFFICER_PROFILE,
} from '../../data/gemDashboardData';

interface DetailedReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  bidder: RecentBidder;
  onOpenDecision?: () => void;
}

export const DetailedReportModal: React.FC<DetailedReportModalProps> = ({
  isOpen,
  onClose,
  bidder,
  onOpenDecision,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#0c1938] text-white p-5 sm:px-8 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-300">
                  Government e-Marketplace
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-300">Official Evaluation Dossier</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Bid Compliance Verification Report
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Print Report"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6 text-slate-800 text-sm">
          {/* Top Banner: Bidder Summary */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Bidder Entity
              </div>
              <div className="text-base font-black text-slate-900 mt-1">
                {bidder.name}
              </div>
              <div className="text-xs text-slate-600 mt-0.5 font-mono">
                PAN: {bidder.pan} | GSTIN: {bidder.gstin}
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Tender Context
              </div>
              <div className="text-xs font-bold text-slate-800 mt-1 font-mono">
                {bidder.bidId}
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                {bidder.tenderTitle}
              </div>
            </div>

            <div className="flex items-center md:justify-end gap-3">
              <div className="text-right">
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  AI Compliance Index
                </div>
                <div className="text-2xl font-black text-emerald-600">
                  {bidder.complianceScore}%
                </div>
                <div className="text-[11px] font-bold text-slate-600">
                  Risk Level: <span className="text-emerald-700">{bidder.riskLevel}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Statutory Authority Disclaimer */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <strong className="text-blue-900 font-bold">Official Decision-Support Notice: </strong>
              The GeM AI Compliance Platform provides heuristic document validation and external API cross-checks. In accordance with Rule 144 of the General Financial Rules (GFR), the final qualification or disqualification decision rests exclusively with the authorized Procurement Officer.
            </div>
          </div>

          {/* Statutory Verification Breakdown */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              1. Statutory & Regulatory Eligibility Matrix
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              {SAMPLE_BIDDER_CHECKLIST.map((item) => (
                <div key={item.id} className="p-3 sm:px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{item.title}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{item.remarks}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] text-slate-400 font-medium">Source: {item.portalSource}</span>
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold text-[11px]">
                      {item.statusText}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* External Government Portal Synchronizations */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              2. Government Portal Registry Telemetry
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SAMPLE_PORTAL_CHECKS.map((portal) => (
                <div key={portal.portalCode} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{portal.portalName}</span>
                    <span className="text-emerald-700 font-mono text-[11px]">{portal.status}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Verified: {portal.verifiedAt} (Latency: {portal.latencyMs}ms)
                  </div>
                  <div className="pt-1.5 border-t border-slate-200/60 space-y-0.5 text-[11px] text-slate-600">
                    {Object.entries(portal.details).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-slate-400">{k}:</span>
                        <span className="font-medium text-slate-800">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Uploaded Documents Evidence */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              3. Document Extractions & OCR Integrity
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
              {SAMPLE_BIDDER_DOCUMENTS.map((doc) => (
                <div key={doc.id} className="p-3.5 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>{doc.title}</span>
                      <span className="text-slate-400 font-normal">({doc.fileName})</span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-mono bg-slate-50 p-1.5 rounded border border-slate-200/80">
                      Snippet: &quot;{doc.extractedSnippet}&quot;
                    </div>
                    <div className="text-[11px] text-slate-500">{doc.matchDetails}</div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-full text-[11px]">
                      {doc.status} ({doc.confidence}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-8 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Generated for: <strong className="text-slate-800">{OFFICER_PROFILE.name}</strong> ({OFFICER_PROFILE.department})
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition"
            >
              Close
            </button>

            {onOpenDecision && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenDecision();
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition"
              >
                Record Statutory Decision
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
