import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ShieldCheck,
  FileText,
  FileCheck,
  Check,
  Minus,
} from 'lucide-react';
import {
  SAMPLE_BIDDER_CHECKLIST,
  SAMPLE_PORTAL_CHECKS,
  SAMPLE_BIDDER_DOCUMENTS,
  RecentBidder,
  ChecklistItem,
} from '../../data/gemDashboardData';

interface BidderComplianceDetailsCardProps {
  bidder?: RecentBidder;
  onViewFullReport: () => void;
  onNavigateTab?: (tab: string) => void;
}

type TabType =
  | 'statutory'
  | 'portal'
  | 'documents'
  | 'risk'
  | 'audit';

export const BidderComplianceDetailsCard: React.FC<BidderComplianceDetailsCardProps> = ({
  bidder = {
    id: 'bidder-1',
    index: 1,
    name: 'Shree Tech Solutions Pvt. Ltd.',
    pan: 'AABCS1234D',
    gstin: '33AABCS1234D1ZP',
    bidId: 'GEM/2025/0167',
    complianceScore: 92,
    status: 'Compliant',
    riskLevel: 'Low',
    tenderId: 'GEM-TND-2025-881',
    tenderTitle: 'Supply & 3-Year Enterprise Cloud Infrastructure Maintenance',
    turnoverCr: 6.8,
    udyamNumber: 'UDYAM-TN-02-0045129',
    oemStatus: 'Pending',
    gstStatus: 'Verified',
    localContentPercent: 62,
  },
  onViewFullReport,
  onNavigateTab,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('statutory');

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
      {/* Top Header Row */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
        <div className="flex items-baseline gap-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Compliance Details
          </h2>
          <span className="text-xs text-slate-400 dark:text-slate-400 font-medium">(Sample Bidder)</span>
        </div>

        <button
          type="button"
          onClick={onViewFullReport}
          className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 group transition"
        >
          <span>View Full Report</span>
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </button>
      </div>

      {/* Bidder Identification Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg leading-tight">
              {bidder.name}
            </h3>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex flex-wrap items-center gap-2 mt-0.5">
              <span>GeM Bid ID: <strong className="font-mono text-slate-700 dark:text-slate-300">{bidder.bidId}</strong></span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span>PAN: <strong className="font-mono text-slate-700 dark:text-slate-300">{bidder.pan}</strong></span>
            </div>
          </div>
        </div>

        {/* Score Ring / Pill */}
        <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-slate-700">
          <div className="relative w-7 h-7 flex-shrink-0 flex items-center justify-center">
            <svg className="w-7 h-7 -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                strokeWidth="3.5"
                className="stroke-slate-200 dark:stroke-slate-700"
              />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke={bidder.complianceScore >= 80 ? '#10b981' : '#f59e0b'}
                strokeWidth="3.5"
                strokeDasharray={`${(bidder.complianceScore * 88) / 100}, 100`}
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <span className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100">
              {bidder.complianceScore}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-1.5">Compliance Score</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 sm:gap-6 border-b border-slate-200 dark:border-slate-800 mb-6 overflow-x-auto text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('statutory')}
          className={`pb-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'statutory'
              ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Statutory & Regulatory
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('portal')}
          className={`pb-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'portal'
              ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Portal Verification
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('documents')}
          className={`pb-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'documents'
              ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Documents
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('risk')}
          className={`pb-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'risk'
              ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Risk & Remarks
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`pb-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'audit'
              ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Audit Trail
        </button>
      </div>

      {/* Tab Content 1: Statutory & Regulatory (Overview matching screenshot) */}
      {activeTab === 'statutory' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Checklist Items Column (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            {SAMPLE_BIDDER_CHECKLIST.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-xs sm:text-sm py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0"
              >
                <div className="flex items-center gap-2.5">
                  {/* Subtle document/category icon */}
                  <span className="w-4 h-4 rounded-sm bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    §
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{item.title}</span>
                </div>

                <div className="flex items-center gap-1.5 font-semibold text-xs">
                  {item.statusType === 'verified' && (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Verified</span>
                    </span>
                  )}
                  {item.statusType === 'compliant' && (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Compliant</span>
                    </span>
                  )}
                  {item.statusType === 'neutral' && (
                    <span className="text-slate-400 dark:text-slate-400 flex items-center gap-1">
                      <Minus className="w-3.5 h-3.5" />
                      <span>Not Applicable</span>
                    </span>
                  )}
                  {item.statusType === 'warning' && (
                    <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Pending</span>
                    </span>
                  )}
                  {item.statusType === 'danger' && (
                    <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Failed</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Overall Status Box on Right (5 cols) */}
          <div className="lg:col-span-5 bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs flex-shrink-0">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-bold text-emerald-800 dark:text-emerald-300">
                    Overall Status
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 leading-tight">
                    {bidder.status}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                No major issues found. Ready for further tender evaluation.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/80 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Risk Level</span>
              <span className="text-xs font-bold px-3 py-1 bg-emerald-600 dark:bg-emerald-700 text-white rounded-full">
                {bidder.riskLevel}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Portal Verification */}
      {activeTab === 'portal' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            Real-time simulated gateway status across national registries:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SAMPLE_PORTAL_CHECKS.map((portal) => (
              <div
                key={portal.portalCode}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/50 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{portal.portalName}</span>
                  <span className="font-mono text-[10px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full font-bold">
                    {portal.status} • {portal.latencyMs}ms
                  </span>
                </div>
                <div className="space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
                  {Object.entries(portal.details).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2">
                      <span className="text-slate-400 dark:text-slate-400">{k}:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200 text-right">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 3: Documents */}
      {activeTab === 'documents' && (
        <div className="space-y-2.5">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            Uploaded Bid Documents & AI OCR Snippet Extractions:
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {SAMPLE_BIDDER_DOCUMENTS.map((doc) => (
              <div key={doc.id} className="py-2.5 flex items-start justify-between gap-4 text-xs">
                <div className="flex items-start gap-2.5">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">{doc.title}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {doc.fileName} • {doc.fileSize} • Uploaded {doc.uploadDate}
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 italic bg-slate-50 dark:bg-slate-800/80 p-1.5 rounded-md border border-slate-200/60 dark:border-slate-700 font-mono">
                      &quot;{doc.extractedSnippet}&quot;
                    </div>
                  </div>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap border ${
                    doc.status === 'Verified'
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                  }`}
                >
                  {doc.status} ({doc.confidence}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 4: Risk & Remarks */}
      {activeTab === 'risk' && (
        <div className="space-y-3 text-xs">
          <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/40 rounded-xl border border-blue-200/80 dark:border-blue-800">
            <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-1">AI Discrepancy & Consistency Analysis</h4>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
              • OEM Manufacturer Authorization Form validity: Extracted expiration date is 30-Nov-2026. Because tender requires 3-year post-deployment support, the Procurement Officer should confirm OEM extended warranty commitment.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px] mt-1">
              • Turnover meets threshold: ₹ 6.80 Cr average turnover exceeds required ₹ 4.00 Cr. UDIN verified.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px] mt-1">
              • Clean Debarment: No negative notices or blacklisting orders recorded on GeM or Central Public Procurement Portal.
            </p>
          </div>
        </div>
      )}

      {/* Tab Content 5: Audit Trail */}
      {activeTab === 'audit' && (
        <div className="space-y-2 text-xs">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Logged verification actions for Bid ID {bidder.bidId}:
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 font-mono text-[11px] text-slate-700 dark:text-slate-300 space-y-1.5">
            <div>[2026-09-18 09:42:20 IST] AI Engine: Verification pipeline score computed at 92/100 (LOW RISK).</div>
            <div>[2026-09-18 09:42:18 IST] GSTN Gateway: Form REG-06 verified against Active state registry.</div>
            <div>[2026-09-18 09:42:16 IST] Udyam Registry: UDYAM-TN-02-0045129 valid medium enterprise.</div>
            <div>[2026-09-14 15:20:10 IST] Bidder Ingestion: Application submitted via GeM Portal.</div>
          </div>
        </div>
      )}
    </div>
  );
};
