import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, HelpCircle, X, AlertTriangle } from 'lucide-react';
import { OfficerDecision, OfficerOverride } from '../types';

interface OfficerOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  bidderName: string;
  tenderRef: string;
  currentOverride?: OfficerOverride;
  onSaveOverride: (override: OfficerOverride) => void;
  onClearOverride: () => void;
}

export const OfficerOverrideModal: React.FC<OfficerOverrideModalProps> = ({
  isOpen,
  onClose,
  bidderName,
  tenderRef,
  currentOverride,
  onSaveOverride,
  onClearOverride,
}) => {
  const [officerName, setOfficerName] = useState(
    currentOverride?.officerName || 'Rajeev Ramanathan'
  );
  const [officerDesignation, setOfficerDesignation] = useState(
    currentOverride?.officerDesignation || 'Chief Procurement Officer (Grade I)'
  );
  const [officerId, setOfficerId] = useState(
    currentOverride?.officerId || 'GEM-OFFICER-7741'
  );
  const [decision, setDecision] = useState<OfficerDecision>(
    currentOverride?.decision || 'REJECT'
  );
  const [justification, setJustification] = useState(
    currentOverride?.justification || ''
  );
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!justification.trim() || justification.trim().length < 15) {
      setError('A mandatory formal justification (minimum 15 characters) is legally required for human override.');
      return;
    }

    const override: OfficerOverride = {
      isOverridden: true,
      officerName: officerName.trim(),
      officerDesignation: officerDesignation.trim(),
      officerId: officerId.trim(),
      decision,
      justification: justification.trim(),
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
    };

    onSaveOverride(override);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 shadow-2xl relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Tender Officer Governance Override
            </h3>
            <p className="text-xs text-slate-400">
              Statutory Procurement Override under GeM Clause 8.4
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg flex flex-col gap-1">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">
              Subject of Override
            </div>
            <div className="font-medium text-slate-200 text-sm">{bidderName}</div>
            <div className="text-slate-400 text-[11px]">Tender: {tenderRef}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                Authorized Officer Name
              </label>
              <input
                type="text"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                Officer ID / Badge
              </label>
              <input
                type="text"
                value={officerId}
                onChange={(e) => setOfficerId(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
              Designation / Committee Role
            </label>
            <input
              type="text"
              value={officerDesignation}
              onChange={(e) => setOfficerDesignation(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Decision Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1.5">
              Official Determination Override
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDecision('APPROVE')}
                className={`py-2 px-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  decision === 'APPROVE'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>APPROVE</span>
              </button>

              <button
                type="button"
                onClick={() => setDecision('REJECT')}
                className={`py-2 px-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  decision === 'REJECT'
                    ? 'bg-rose-950 border-rose-500 text-rose-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>REJECT</span>
              </button>

              <button
                type="button"
                onClick={() => setDecision('REQUEST_CLARIFICATION')}
                className={`py-2 px-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1 transition ${
                  decision === 'REQUEST_CLARIFICATION'
                    ? 'bg-amber-950 border-amber-500 text-amber-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>CLARIFY</span>
              </button>
            </div>
          </div>

          {/* Mandatory Reason */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
              Mandatory Auditor Justification <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              value={justification}
              onChange={(e) => {
                setJustification(e.target.value);
                if (error) setError('');
              }}
              placeholder="State the legal, statutory, or tender clause basis for overriding the AI compliance recommendation (e.g. Bidder submitted an unendorsed amendment, discrepancy in corporate constitution, or emergency exemption under GFR 149)..."
              className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
            {error && (
              <p className="text-rose-400 text-[11px] mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>{error}</span>
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            {currentOverride?.isOverridden ? (
              <button
                type="button"
                onClick={() => {
                  onClearOverride();
                  onClose();
                }}
                className="text-rose-400 hover:text-rose-300 text-xs underline"
              >
                Remove Override (Revert to AI)
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-md transition"
              >
                Record Statutory Override
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
