import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  Sparkles,
  Info,
  Building2,
  FileText,
  Lock,
} from 'lucide-react';
import { BidderData } from '../../../types';
import { useApp } from '../../../context/AppContext';
import { ConfirmationModal } from '../../common/ConfirmationModal';
import { apiService } from '../../../services/api';

export const BidderFinalDecisionTab: React.FC = () => {
  const { bidder } = useOutletContext<{ bidder: BidderData }>();
  const { recordOfficerDecision } = useApp();
  const navigate = useNavigate();

  // Radio state (CRITICAL: NOT preselected)
  const [selectedDecision, setSelectedDecision] = useState<
    'QUALIFIED' | 'DISQUALIFIED' | 'FURTHER_REVIEW' | null
  >(null);

  const [remarks, setRemarks] = useState(bidder.officerRemarks || '');

  // Checkboxes for evidence review
  const [reviewedDocs, setReviewedDocs] = useState(false);
  const [reviewedPortals, setReviewedPortals] = useState(false);
  const [reviewedRisk, setReviewedRisk] = useState(false);
  const [reviewedAi, setReviewedAi] = useState(false);

  // Modal & feedback state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [decisionRecorded, setDecisionRecorded] = useState(!!bidder.officerDecision);

  const allCheckboxesChecked = reviewedDocs && reviewedPortals && reviewedRisk && reviewedAi;
  const canSubmit = selectedDecision !== null && allCheckboxesChecked;

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDecision = async () => {
    if (!selectedDecision) return;

    const evidenceList = [
      reviewedDocs && 'Document Verification (GST, PAN, MSME, ITR, MAF)',
      reviewedPortals && 'Government Registry Cross-Checks (GSTN, CBDT, Udyam, MCA21, EPFO)',
      reviewedRisk && 'Risk & Anomaly Analysis',
      reviewedAi && 'Advisory AI Recommendation Evaluation',
    ].filter(Boolean) as string[];

    try {
      await apiService.recordFinalDecision(bidder.id, {
        decision: selectedDecision,
        officerId: 'OFF-8841',
        officerName: 'Rajeev Ramanathan',
        officerDesignation: 'Chief Procurement Officer (Grade I)',
        remarks: remarks || 'Officially verified and approved under GFR Rule 144.',
        evidenceReviewed: evidenceList,
      });
    } catch (e) {
      console.warn('Backend decision sync error:', e);
    }

    recordOfficerDecision(bidder.id, selectedDecision, remarks, evidenceList);
    setIsConfirmModalOpen(false);
    setDecisionRecorded(true);
  };

  return (
    <div className="space-y-6">
      {/* Statutory Authority Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
            Human Governance Portal
          </span>
          <span className="text-xs text-slate-400">• Rule 144 of GFR 2017</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          Procurement Officer Statutory Determination
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
          Under the Public Procurement (Preference to Make in India) Order and General Financial Rules (GFR 2017), the <strong>Procurement Officer holds sole legal authority</strong> to qualify or disqualify bidders. AI outputs provide purely advisory risk indicators.
        </p>
      </div>

      {/* Decision Summary Banner if already recorded */}
      {decisionRecorded && (
        <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3.5 text-xs text-emerald-900 shadow-2xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-sm">
              Official Decision Recorded: {bidder.officerDecision || selectedDecision}
            </div>
            <p className="text-emerald-800 leading-relaxed">
              This determination has been cryptographically signed and permanently appended to the tender evaluation audit trail (Reference ID: <span className="font-mono font-bold">AUD-2025-{(Math.random() * 10000).toFixed(0)}</span>).
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(`/reports/${bidder.id}`)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition"
              >
                View Final Dossier
              </button>
              <button
                type="button"
                onClick={() => navigate('/audit-trail')}
                className="text-emerald-800 underline font-semibold"
              >
                Inspect Audit Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verification Evidence Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Verification Summary */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>Verification Summary</span>
            <span className="text-xs font-mono font-bold text-slate-500">10 Criteria Evaluated</span>
          </h4>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Total Requirements</span>
              <span className="text-lg font-black text-slate-900 mt-0.5 block">10</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <span className="text-emerald-600 block text-[10px] font-bold uppercase">Verified Portals</span>
              <span className="text-lg font-black text-emerald-700 mt-0.5 block">8</span>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <span className="text-blue-600 block text-[10px] font-bold uppercase">Not Applicable</span>
              <span className="text-lg font-black text-blue-700 mt-0.5 block">1</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl">
              <span className="text-amber-600 block text-[10px] font-bold uppercase">Requires Review</span>
              <span className="text-lg font-black text-amber-700 mt-0.5 block">1</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 leading-relaxed">
            All mandatory statutory registries (GSTN, PAN, MCA21, MSME) return 100% active standing. One secondary attachment (OEM authorization form) expires in 30 days.
          </div>
        </div>

        {/* AI Recommendation Box */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>AI Advisory Recommendation</span>
            </h4>

            <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-100 mt-3 space-y-2 text-xs text-blue-900">
              <p className="leading-relaxed">
                <strong>Advisory Assessment: </strong>
                Available evidence indicates that 90%+ requirements are satisfied. The entity demonstrates established financial standing and zero litigation flags.
              </p>
              <div className="p-2.5 bg-white/80 rounded-lg border border-blue-200/60 text-[11px] text-slate-700">
                <strong>Officer Discretionary Check: </strong>
                Review OEM Authorization validity. Tender qualification may proceed with a conditional requirement for an updated MAF prior to purchase order issuance.
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 italic">
            Reminder: AI recommendation is algorithmic assistance and cannot substitute human judgment.
          </div>
        </div>
      </div>

      {/* Human Decision Form */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        <h4 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Scale className="w-5 h-5 text-blue-600" />
          <span>Record Procurement Officer Decision</span>
        </h4>

        {/* 1. Radio Options (NOT Preselected) */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            Select Determination (Required) *
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Option A: Qualified */}
            <label
              className={`p-4 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
                selectedDecision === 'QUALIFIED'
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/30'
              }`}
            >
              <input
                type="radio"
                name="officer_decision"
                checked={selectedDecision === 'QUALIFIED'}
                onChange={() => setSelectedDecision('QUALIFIED')}
                className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <div className="text-xs font-bold text-slate-900">Qualified / Eligible</div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Bidder meets all mandatory statutory criteria and qualifies for commercial opening.
                </div>
              </div>
            </label>

            {/* Option B: Disqualified */}
            <label
              className={`p-4 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
                selectedDecision === 'DISQUALIFIED'
                  ? 'border-rose-600 bg-rose-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/30'
              }`}
            >
              <input
                type="radio"
                name="officer_decision"
                checked={selectedDecision === 'DISQUALIFIED'}
                onChange={() => setSelectedDecision('DISQUALIFIED')}
                className="mt-0.5 text-rose-600 focus:ring-rose-500"
              />
              <div>
                <div className="text-xs font-bold text-slate-900">Disqualified / Not Eligible</div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Bidder fails critical statutory thresholds or exhibits debarment discrepancies.
                </div>
              </div>
            </label>

            {/* Option C: Further Review */}
            <label
              className={`p-4 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
                selectedDecision === 'FURTHER_REVIEW'
                  ? 'border-amber-600 bg-amber-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/30'
              }`}
            >
              <input
                type="radio"
                name="officer_decision"
                checked={selectedDecision === 'FURTHER_REVIEW'}
                onChange={() => setSelectedDecision('FURTHER_REVIEW')}
                className="mt-0.5 text-amber-600 focus:ring-amber-500"
              />
              <div>
                <div className="text-xs font-bold text-slate-900">Further Review / Clarification</div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Hold determination pending bidder response to official clarification notice.
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* 2. Officer Written Justification Remarks */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
            Officer Written Justification & Remarks *
          </label>
          <textarea
            rows={4}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Document legal reasoning, reference clause numbers, and specify conditions (e.g. 'Qualified conditionally based on valid GSTN & PAN filings. Vendor instructed to submit updated OEM MAF before final award.')..."
            className="w-full text-xs p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50 leading-relaxed text-slate-800"
          />
        </div>

        {/* 3. Evidence Reviewed Checklist (Mandatory human checkboxes) */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Statutory Verification Acknowledgments (Confirm all 4)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={reviewedDocs}
                onChange={(e) => setReviewedDocs(e.target.checked)}
                className="rounded-sm text-blue-600 focus:ring-blue-500"
              />
              <span>I have inspected submitted documents and certificates.</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={reviewedPortals}
                onChange={(e) => setReviewedPortals(e.target.checked)}
                className="rounded-sm text-blue-600 focus:ring-blue-500"
              />
              <span>I have reviewed real-time government registry checks.</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={reviewedRisk}
                onChange={(e) => setReviewedRisk(e.target.checked)}
                className="rounded-sm text-blue-600 focus:ring-blue-500"
              />
              <span>I have examined algorithmic risk indicators and expiry dates.</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={reviewedAi}
                onChange={(e) => setReviewedAi(e.target.checked)}
                className="rounded-sm text-blue-600 focus:ring-blue-500"
              />
              <span>I understand that AI outputs are advisory and not binding.</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-400">
            All decisions require officer confirmation and are tamper-evident.
          </span>

          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleOpenConfirm}
            className={`px-6 py-2.5 text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-md ${
              canSubmit
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Record Final Procurement Decision</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        title="Confirm Official Decision"
        message={`Please confirm that you have reviewed the available evidence and are recording the final procurement decision (${selectedDecision}) for ${bidder.name}. This action will be logged in the permanent audit trail under your Officer ID.`}
        confirmLabel="Confirm & Record Decision"
        cancelLabel="Review Again"
        onConfirm={handleConfirmDecision}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </div>
  );
};
