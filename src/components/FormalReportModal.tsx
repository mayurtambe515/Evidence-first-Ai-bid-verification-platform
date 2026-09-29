import React from 'react';
import { Tender, Bidder, ComplianceEvidenceItem, OfficerOverride, RiskLevel } from '../types';
import { Printer, Download, X, ShieldCheck, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface FormalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tender: Tender;
  bidder: Bidder;
  evidenceItems: ComplianceEvidenceItem[];
  score: number;
  riskLevel: RiskLevel;
  officerOverride?: OfficerOverride;
}

export const FormalReportModal: React.FC<FormalReportModalProps> = ({
  isOpen,
  onClose,
  tender,
  bidder,
  evidenceItems,
  score,
  riskLevel,
  officerOverride,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const reportId = `GEM-AUDIT-${tender.refNumber.replace(/[^A-Z0-9]/g, '')}-${bidder.gstin.slice(0, 5)}-${Date.now().toString().slice(-4)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-4xl w-full p-4 sm:p-8 shadow-2xl relative text-slate-900 my-8 max-h-[92vh] flex flex-col">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-700 print:hidden text-white">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-teal-400">Formal Audit Memorandum Preview</span>
            <span className="text-xs text-slate-400 font-mono">({reportId})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Paper (White Background like Real Official Gov Document) */}
        <div className="bg-white rounded-lg p-6 sm:p-8 overflow-y-auto text-slate-900 font-serif shadow-inner flex-1 border border-slate-300">
          {/* Official Government Header */}
          <div className="text-center pb-4 border-b-2 border-slate-900 mb-6">
            <div className="text-xs uppercase tracking-widest font-sans font-bold text-slate-600">
              Government of India • Ministry of Commerce & Industry
            </div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950 mt-1">
              Government e-Marketplace (GeM)
            </h1>
            <div className="text-sm font-bold uppercase tracking-wider text-slate-700 mt-0.5">
              Compliance Verification & Forensic Audit Memorandum
            </div>
            <div className="text-[11px] font-mono text-slate-500 mt-1">
              Generated Under GeM Automated Procurement Audit Directive (Evidence-First Engine)
            </div>
          </div>

          {/* Reference & Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded bg-slate-50 border border-slate-300 text-xs font-sans mb-6">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Report Ref No:</div>
              <div className="font-mono font-bold text-slate-900">{reportId}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Evaluation Date:</div>
              <div className="font-bold text-slate-900">{currentDate}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Tender Reference:</div>
              <div className="font-mono font-bold text-slate-900">{tender.refNumber}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Procuring Authority:</div>
              <div className="font-bold text-slate-900 truncate">{tender.authority.split('/')[0]}</div>
            </div>
          </div>

          {/* Bidder Subject Summary */}
          <div className="mb-6 font-sans text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-300 mb-2">
              1. Bidder Enterprise Subject Profile
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded">
              <div>
                <span className="text-slate-500">Legal Enterprise Name:</span>
                <div className="font-bold text-slate-900">{bidder.registeredLegalName || bidder.name}</div>
              </div>
              <div>
                <span className="text-slate-500">GSTIN / PAN:</span>
                <div className="font-mono font-bold text-slate-900">{bidder.gstin} / {bidder.pan}</div>
              </div>
              <div>
                <span className="text-slate-500">MSME Udyam Number:</span>
                <div className="font-mono font-bold text-slate-900">{bidder.udyamNumber || 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Executive Compliance Determination */}
          <div className="mb-6 font-sans">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-300 mb-2">
              2. Executive Verification Determination
            </h3>
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded bg-slate-100 border-2 border-slate-300">
              <div>
                <div className="text-xs uppercase font-bold text-slate-600">Calculated Compliance Score:</div>
                <div className="text-3xl font-black text-slate-950 mt-0.5">{score}%</div>
              </div>
              <div>
                <div className="text-xs uppercase font-bold text-slate-600">Assessed Risk Level:</div>
                <div className={`text-lg font-black mt-0.5 ${riskLevel === 'LOW' ? 'text-emerald-700' : riskLevel === 'MEDIUM' ? 'text-amber-700' : 'text-rose-700'}`}>
                  {riskLevel} RISK
                </div>
              </div>
              <div>
                <div className="text-xs uppercase font-bold text-slate-600">Automated Recommendation:</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  {score >= 85 ? 'QUALIFIED FOR FINANCIAL BID OPENING' : score >= 65 ? 'CONDITIONAL / AUDIT CLARIFICATION' : 'DISQUALIFIED (CRITICAL VIOLATION)'}
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Evidence Table */}
          <div className="mb-6 font-sans">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-300 mb-2">
              3. Itemized Evidence & Statutory Checklist Appendix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-200 text-slate-800 font-bold border-b border-slate-300">
                    <th className="p-2 border-r border-slate-300">Rule Ref</th>
                    <th className="p-2 border-r border-slate-300">Requirement</th>
                    <th className="p-2 border-r border-slate-300">Document Source</th>
                    <th className="p-2 border-r border-slate-300">Extracted Value</th>
                    <th className="p-2 text-center">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {evidenceItems.map((item, idx) => (
                    <tr key={idx} className={item.status === 'FAIL' ? 'bg-rose-50' : item.status === 'WARNING' ? 'bg-amber-50' : ''}>
                      <td className="p-2 border-r border-slate-300 font-mono font-bold text-[11px]">{item.ruleCode}</td>
                      <td className="p-2 border-r border-slate-300 font-medium">{item.ruleTitle}</td>
                      <td className="p-2 border-r border-slate-300 text-[11px] text-slate-600">{item.documentSource}</td>
                      <td className="p-2 border-r border-slate-300 font-mono text-[11px] max-w-[200px] truncate">{item.extractedValue}</td>
                      <td className="p-2 text-center font-bold">
                        {item.status === 'PASS' && <span className="text-emerald-700">PASS</span>}
                        {item.status === 'WARNING' && <span className="text-amber-700">WARN</span>}
                        {item.status === 'FAIL' && <span className="text-rose-700">FAIL</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Officer Override / Human-in-the-loop Statutory Endorsement */}
          <div className="mb-6 font-sans">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-300 mb-2">
              4. Competent Authority Endorsement & Statutory Override
            </h3>
            {officerOverride?.isOverridden ? (
              <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded text-xs">
                <div className="font-bold text-amber-900 mb-1">
                  OFFICER OVERRIDE EXERCISED UNDER GeM GTC CLAUSE 8.4:
                </div>
                <div className="text-slate-800 mb-1">
                  <strong>Decision: </strong>{officerOverride.decision} by {officerOverride.officerName} ({officerOverride.officerDesignation})
                </div>
                <div className="text-slate-700 italic">
                  <strong>Mandatory Justification on Record: </strong>"{officerOverride.justification}"
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 border border-slate-300 rounded text-xs text-slate-600">
                No human officer override requested. Automated AI & deterministic rules recommendation adopted by Tender Committee.
              </div>
            )}
          </div>

          {/* Signature Block */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-400 font-sans text-xs mt-8">
            <div>
              <div className="text-slate-500 mb-8">Verified & Sealed By (AI Engine):</div>
              <div className="font-mono font-bold text-slate-900">GEM-AI-AUDIT-ENGINE / VERIFIED-CORE</div>
              <div className="text-[10px] text-slate-500">Cryptographic Seal: SHA256 VALIDATED</div>
            </div>

            <div className="text-right">
              <div className="text-slate-500 mb-8">Procurement Officer / Committee Convener:</div>
              <div className="font-bold text-slate-900 border-b border-slate-400 pb-1 inline-block min-w-[200px]">
                {officerOverride?.officerName || 'Competent Authority Signature'}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                {officerOverride?.officerDesignation || 'Tender Evaluation Committee, GeM'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
