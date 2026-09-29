import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Printer,
  Download,
  Building2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Scale,
  Sparkles,
  MapPin,
  Calendar,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ComplianceScoreRing } from '../common/ComplianceScoreRing';
import { StatusBadge } from '../common/StatusBadge';
import { RiskBadge } from '../common/RiskBadge';

export const ReportDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { bidders, tenders } = useApp();

  const bidder = bidders.find((b) => b.id === id) || bidders[0];
  const tender = tenders[0];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    alert(`Downloading Official Statutory Dossier for ${bidder.name} (PDF with SHA-256 digital watermark).`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <button
          type="button"
          onClick={() => navigate('/reports')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Compliance Reports</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 shadow-2xs transition flex items-center gap-2"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Official PDF</span>
          </button>
        </div>
      </div>

      {/* Main Official Dossier Container */}
      <div className="bg-white rounded-2xl border border-slate-300 p-8 sm:p-10 shadow-sm space-y-8 font-sans">
        {/* Government Emblem / Dossier Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div>
            <div className="text-[11px] uppercase tracking-widest font-black text-slate-500">
              Government e-Marketplace (GeM) • Government of India
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Statutory Bidder Compliance Dossier
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Official Technical Envelope Scrutiny & Rule 144 Verification Certification
            </p>
          </div>

          <div className="text-right sm:text-right text-xs space-y-1">
            <div className="font-mono text-[11px] text-slate-400">Dossier Ref: <strong className="text-slate-800">GEM/VER/2025/{(bidder.complianceScore * 83).toFixed(0)}</strong></div>
            <div className="font-mono text-[11px] text-slate-400">Date Generated: <strong className="text-slate-800">2025-02-20 10:45 IST</strong></div>
            <div className="mt-2">
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-md font-bold text-[10px] uppercase">
                Tamper-Evident Record
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 1: Bidder Information */}
        <section className="space-y-3">
          <div className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-1.5">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px]">1</span>
            <span>Bidder Identification & Statutory Registrations</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Legal Entity Name</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{bidder.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">PAN</span>
              <span className="font-mono font-bold text-slate-800 mt-0.5 block">{bidder.pan}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">GSTIN</span>
              <span className="font-mono font-bold text-slate-800 mt-0.5 block">{bidder.gstin}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Udyam Registration</span>
              <span className="font-mono font-bold text-slate-800 mt-0.5 block">{bidder.udyam || 'UDYAM-MH-02-0045678'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Entity Classification</span>
              <span className="font-bold text-slate-800 mt-0.5 block">{bidder.companyType || 'Private Limited Company'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Registered Address</span>
              <span className="text-slate-700 mt-0.5 block truncate">{bidder.registeredAddress || 'MIDC Andheri East, Mumbai, MH'}</span>
            </div>
          </div>
        </section>

        {/* SECTION 2: Tender Information */}
        <section className="space-y-3">
          <div className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-1.5">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px]">2</span>
            <span>Tender Scope & Procurement Reference</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Tender Title</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{tender.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Tender / Bid ID</span>
              <span className="font-mono font-bold text-blue-700 mt-0.5 block">{tender.id}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Procuring Ministry</span>
              <span className="font-bold text-slate-800 mt-0.5 block">{tender.department}</span>
            </div>
          </div>
        </section>

        {/* SECTION 3: Document Verification */}
        <section className="space-y-3">
          <div className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-1.5">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px]">3</span>
            <span>Document Verification Results</span>
          </div>
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-[10px] uppercase text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Document Title</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">OCR Extraction Match</th>
                  <th className="p-3 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3 font-semibold">GST Registration Certificate.pdf</td>
                  <td className="p-3 text-slate-500">Statutory Tax</td>
                  <td className="p-3 font-mono text-[11px]">GSTIN and Name matched 100%</td>
                  <td className="p-3 text-right"><span className="text-emerald-700 font-bold">Verified</span></td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">PAN Card.pdf</td>
                  <td className="p-3 text-slate-500">Statutory PAN</td>
                  <td className="p-3 font-mono text-[11px]">PAN AABCS1234D Active in CBDT</td>
                  <td className="p-3 text-right"><span className="text-emerald-700 font-bold">Verified</span></td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">OEM Authorization Form.pdf</td>
                  <td className="p-3 text-slate-500">Technical Spec</td>
                  <td className="p-3 font-mono text-[11px]">Expires 31/03/2025 (30 Days Remaining)</td>
                  <td className="p-3 text-right"><span className="text-amber-700 font-bold">Review Required</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 4: Portal Verification */}
        <section className="space-y-3">
          <div className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-1.5">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px]">4</span>
            <span>Government Portal Reconciliation Gateways</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold block text-slate-800">GSTN Network</span>
              <span className="text-[10px] text-emerald-700 font-bold mt-1 block">Active (No Defaults)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold block text-slate-800">Income Tax (CBDT)</span>
              <span className="text-[10px] text-emerald-700 font-bold mt-1 block">AY 24-25 Filed</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold block text-slate-800">MCA21 Corporate</span>
              <span className="text-[10px] text-emerald-700 font-bold mt-1 block">Compliant / Active</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold block text-slate-800">MSME Udyam</span>
              <span className="text-[10px] text-emerald-700 font-bold mt-1 block">Small Enterprise</span>
            </div>
          </div>
        </section>

        {/* SECTION 5: Compliance Checklist */}
        <section className="space-y-3">
          <div className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-1.5">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px]">5</span>
            <span>Rule Evaluation Matrix & Score</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 gap-4">
            <div>
              <div className="text-base font-black text-slate-900">
                Calculated Compliance Score: {bidder.complianceScore}%
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Evaluated deterministically across 10 statutory and technical parameters.
              </div>
            </div>
            <StatusBadge status={bidder.status} size="md" />
          </div>
        </section>

        {/* SECTION 6 & 7: Detected Issues & Risk Indicators */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px]">6</span>
              <span>Detected Discrepancies</span>
            </div>
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
              <strong className="font-bold">MAF Validity Warning: </strong>
              OEM Authorization certificate expires within 30 calendar days.
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px]">7</span>
              <span>Risk Factor Exposure</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">Risk Score: 35 / 100</span>
                <div className="text-[11px] text-slate-500">Low Exposure Level</div>
              </div>
              <RiskBadge level={bidder.riskLevel} />
            </div>
          </div>
        </section>

        {/* SECTION 8: AI Observations (Advisory) */}
        <section className="space-y-2">
          <div className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-1.5">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px]">8</span>
            <span>AI Verification Observations (Advisory Assistance)</span>
          </div>
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 text-xs text-blue-950 space-y-1">
            <p className="leading-relaxed">
              &quot;The entity exhibits sound statutory registration integrity across CBDT, GSTN, and Ministry of Corporate Affairs. Turnovers satisfy tender prerequisites. Minor administrative concern on MAF expiry window recommended for procurement officer review.&quot;
            </p>
            <div className="text-[10px] text-blue-700 italic">
              Notice: AI analysis is algorithmic and non-binding under General Financial Rules.
            </div>
          </div>
        </section>

        {/* SECTION 9: Officer Remarks */}
        <section className="space-y-2">
          <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-1.5">
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-[10px]">9</span>
            <span>Procurement Officer Scrutiny Remarks</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800">
            <p className="leading-relaxed font-serif italic">
              &quot;{bidder.officerRemarks || 'Reviewed statutory records. Entity qualifies based on active filings. Conditional confirmation required for renewed MAF prior to award issuance.'}&quot;
            </p>
          </div>
        </section>

        {/* SECTION 10: Final Officer Decision */}
        <section className="space-y-3 pt-2">
          <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-1.5">
            <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-[10px]">10</span>
            <span>Official Determination & Statutory Certification</span>
          </div>

          <div className="p-5 rounded-2xl bg-purple-50 border-2 border-purple-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">Official Decision</span>
              <div className="text-xl font-black text-purple-950 mt-0.5">
                {bidder.officerDecision || 'QUALIFIED (Conditionally Accepted)'}
              </div>
              <div className="text-xs text-purple-800 mt-1">
                Recorded by Authorized Procurement Officer (PO-2024-8841)
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="font-mono text-[10px] text-purple-800">Sign: DIGITALLY SIGNED</div>
              <div className="font-mono text-[10px] text-purple-600">SHA-256: 7f83b1657ff1fc53b92dc181...</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
