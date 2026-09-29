import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Save,
  FileEdit,
  ArrowRight,
} from 'lucide-react';
import { BidderData } from '../../../types';
import { useApp } from '../../../context/AppContext';
import { apiService } from '../../../services/api';

export const BidderRiskTab: React.FC = () => {
  const { bidder } = useOutletContext<{ bidder: BidderData }>();
  const { updateBidderRemarks } = useApp();
  const navigate = useNavigate();

  const [remarks, setRemarks] = useState(
    bidder.officerRemarks ||
      'Reviewed statutory filings against GSTN and CBDT. OEM authorization expires in 30 days; vendor notified to provide extension letter prior to contract award.'
  );
  const [isSaved, setIsSaved] = useState(false);

  const riskFactors = [
    {
      title: 'OEM Authorization Validity Window',
      severity: 'Medium' as const,
      reason: 'Manufacturer Authorization Form (MAF) expires in 30 days.',
      evidence: 'OEM Form date: Valid until 31/03/2025. Tender delivery cycle extends 12 months.',
      recommendedAction: 'Procurement Officer should request vendor to provide renewed MAF prior to financial envelope opening.',
    },
    {
      title: 'Make in India Local Content Declaration Verification',
      severity: 'Low' as const,
      reason: 'Self-certification requires verification of Statutory Auditor UDIN.',
      evidence: 'Local content declared at 62.4%. Auditor UDIN present on declaration.',
      recommendedAction: 'Verify CA UDIN on ICAI portal to confirm audit authenticity.',
    },
    {
      title: 'Turnover Ratio vs. Tender Value',
      severity: 'Low' as const,
      reason: 'Average annual turnover meets minimum 3x threshold but is borderline for high-capacity surge requirements.',
      evidence: 'AY 2024-25 turnover ₹ 14.82 Crore against estimated tender value ₹ 4.50 Crore.',
      recommendedAction: 'Confirm performance bank guarantee (PBG) terms in SLA.',
    },
  ];

  const handleSaveRemarks = async () => {
    updateBidderRemarks(bidder.id, remarks);
    try {
      await apiService.saveRemarks(bidder.id, remarks, 'Rajeev Ramanathan', 'OFF-8841');
    } catch (e) {
      console.warn('Backend remarks error:', e);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Risk Overview Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-bold uppercase tracking-wider">
              Algorithmic Risk Index
            </span>
            <span className="text-xs text-slate-400">• Low-to-Moderate Exposure</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Vendor Risk Analysis & Vulnerability Score
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Automated anomaly detection across debarment lists, tax compliance, and document timestamps.
          </p>
        </div>

        {/* Risk Score Pill */}
        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 self-start sm:self-auto">
          <div className="text-center">
            <div className="text-2xl font-black text-amber-600">35 / 100</div>
            <div className="text-[11px] font-bold text-slate-500 mt-0.5 uppercase tracking-wide">
              Risk Score
            </div>
          </div>
          <div className="w-px h-10 bg-slate-200" />
          <div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Low Exposure
            </span>
            <div className="text-[10px] text-slate-400 mt-1">Safe for Qualification</div>
          </div>
        </div>
      </div>

      {/* Risk Factors Breakdown Cards */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Identified Risk Indicators & Recommendations
        </h4>

        {riskFactors.map((factor, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3 hover:border-slate-300 transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle
                  className={`w-4 h-4 ${
                    factor.severity === 'Medium' ? 'text-amber-500' : 'text-blue-500'
                  }`}
                />
                <span className="text-sm font-bold text-slate-900">{factor.title}</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase self-start sm:self-auto ${
                  factor.severity === 'Medium'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                Severity: {factor.severity}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-700 block mb-1">Observation Cause:</span>
                <span className="text-slate-600">{factor.reason}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-700 block mb-1">Document Evidence:</span>
                <span className="text-slate-600 font-mono text-[11px]">{factor.evidence}</span>
              </div>
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                <span className="font-bold text-blue-900 block mb-1">Recommended Officer Action:</span>
                <span className="text-blue-800">{factor.recommendedAction}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Officer Remarks & Notes Form */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileEdit className="w-4 h-4 text-blue-600" />
              <span>Procurement Officer Scrutiny Remarks</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter official observations to be archived into the permanent tender evaluation dossier.
            </p>
          </div>
          {isSaved && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Remarks Saved & Logged</span>
            </span>
          )}
        </div>

        <textarea
          rows={4}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Enter official officer observations regarding this bidder's compliance status..."
          className="w-full text-xs p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50 leading-relaxed text-slate-800"
        />

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-400">
            Recorded under Officer ID: PO-2024-8841 • Ministry of Electronics & IT
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveRemarks}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Remarks</span>
            </button>

            <button
              type="button"
              onClick={() => navigate(`/verification/bidder/${bidder.id}/final-decision`)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <span>Proceed to Decision</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
