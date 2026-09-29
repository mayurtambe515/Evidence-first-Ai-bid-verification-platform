import React, { useState } from 'react';
import {
  X,
  Scale,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldCheck,
  Building2,
  AlertCircle,
} from 'lucide-react';
import { RecentBidder, OFFICER_PROFILE } from '../../data/gemDashboardData';

interface OfficerDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  bidder: RecentBidder;
  onRecordDecision: (
    bidderId: string,
    decision: 'APPROVE' | 'REJECT' | 'REQUEST_CLARIFICATION',
    notes: string
  ) => void;
}

export const OfficerDecisionModal: React.FC<OfficerDecisionModalProps> = ({
  isOpen,
  onClose,
  bidder,
  onRecordDecision,
}) => {
  const [decision, setDecision] = useState<'APPROVE' | 'REJECT' | 'REQUEST_CLARIFICATION'>('APPROVE');
  const [justification, setJustification] = useState(
    'All statutory documents verified against central registries. OEM authorization confirmed valid for project lifecycle.'
  );
  const [signedDeclaration, setSignedDeclaration] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!justification.trim()) {
      setErrorMsg('Mandatory justification remarks are required by GeM procurement guidelines.');
      return;
    }
    if (!signedDeclaration) {
      setErrorMsg('You must certify statutory authority before submitting your determination.');
      return;
    }

    onRecordDecision(bidder.id, decision, justification);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#0c1938] text-white p-5 sm:px-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center">
              <Scale className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase text-blue-300 font-bold">
                General Financial Rules (GFR) Rule 144
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Record Procurement Officer Statutory Decision
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Target Bidder Context */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">Bidder Entity</div>
              <div className="text-sm font-bold text-slate-900">{bidder.name}</div>
              <div className="text-xs text-slate-500 font-mono">
                Bid ID: {bidder.bidId} • Score: {bidder.complianceScore}%
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                bidder.status === 'Compliant'
                  ? 'bg-emerald-100 text-emerald-800'
                  : bidder.status === 'Partial'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {bidder.status}
            </span>
          </div>

          {/* Decision Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Statutory Determination
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: Qualify */}
              <button
                type="button"
                onClick={() => {
                  setDecision('APPROVE');
                  setJustification(
                    'All statutory documents verified against central registries. OEM authorization confirmed valid for project lifecycle.'
                  );
                }}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                  decision === 'APPROVE'
                    ? 'bg-emerald-50/80 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      decision === 'APPROVE' ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  />
                  <span className="text-xs font-bold">Qualify Bidder</span>
                </div>
                <span className="text-[10px] text-slate-500 leading-tight">
                  Eligible for financial opening
                </span>
              </button>

              {/* Option 2: Request Clarification */}
              <button
                type="button"
                onClick={() => {
                  setDecision('REQUEST_CLARIFICATION');
                  setJustification(
                    'Clarification requested regarding OEM authorization validity buffer and certified local content self-declaration breakdown.'
                  );
                }}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                  decision === 'REQUEST_CLARIFICATION'
                    ? 'bg-amber-50/80 border-amber-500 text-amber-950 ring-2 ring-amber-500/20'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <HelpCircle
                    className={`w-4 h-4 ${
                      decision === 'REQUEST_CLARIFICATION' ? 'text-amber-600' : 'text-slate-400'
                    }`}
                  />
                  <span className="text-xs font-bold">Clarification</span>
                </div>
                <span className="text-[10px] text-slate-500 leading-tight">
                  Notice under Clause 7
                </span>
              </button>

              {/* Option 3: Disqualify */}
              <button
                type="button"
                onClick={() => {
                  setDecision('REJECT');
                  setJustification(
                    'Disqualified due to non-compliance with mandatory technical eligibility parameters or document deficiency.'
                  );
                }}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                  decision === 'REJECT'
                    ? 'bg-rose-50/80 border-rose-500 text-rose-950 ring-2 ring-rose-500/20'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <XCircle
                    className={`w-4 h-4 ${
                      decision === 'REJECT' ? 'text-rose-600' : 'text-slate-400'
                    }`}
                  />
                  <span className="text-xs font-bold">Disqualify</span>
                </div>
                <span className="text-[10px] text-slate-500 leading-tight">
                  Non-compliant rejected
                </span>
              </button>
            </div>
          </div>

          {/* Mandatory Justification Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Officer Statutory Remarks (Audit-Logged)
            </label>
            <textarea
              rows={3}
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Detail reasons, references to specific tender clauses, or portal findings..."
              className="w-full p-3 text-xs text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Declaration Checkbox */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={signedDeclaration}
                onChange={(e) => setSignedDeclaration(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-700 leading-relaxed">
                I, <strong className="text-slate-900 font-bold">{OFFICER_PROFILE.name}</strong>, certify that I have exercised independent administrative discretion in accordance with GeM Procurement Rules.
              </span>
            </label>
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition"
            >
              Commit Statutory Award
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
