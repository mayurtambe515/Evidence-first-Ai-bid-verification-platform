import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Building2,
  MapPin,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Scale,
  ShieldCheck,
} from 'lucide-react';
import { BidderData } from '../../../types';
import { SAMPLE_BIDDER_CHECKLIST } from '../../../data/gemDashboardData';

export const BidderOverviewTab: React.FC = () => {
  const { bidder } = useOutletContext<{ bidder: BidderData }>();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* 2-Column Grid: Basic Info & Overall Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Basic Information Card */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Basic Information & Registration</h3>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
              Primary Entity
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-slate-400 font-medium">Company Legal Name</div>
              <div className="font-bold text-slate-900 mt-0.5">{bidder.name}</div>
            </div>

            <div>
              <div className="text-slate-400 font-medium">Company Entity Type</div>
              <div className="font-bold text-slate-900 mt-0.5">{bidder.companyType || 'Private Limited Company'}</div>
            </div>

            <div>
              <div className="text-slate-400 font-medium">Permanent Account Number (PAN)</div>
              <div className="font-mono font-bold text-slate-800 mt-0.5">{bidder.pan}</div>
            </div>

            <div>
              <div className="text-slate-400 font-medium">GST Identification Number (GSTIN)</div>
              <div className="font-mono font-bold text-slate-800 mt-0.5">{bidder.gstin}</div>
            </div>

            <div>
              <div className="text-slate-400 font-medium">Udyam / MSME Registration</div>
              <div className="font-mono font-bold text-slate-800 mt-0.5">{bidder.udyam || 'UDYAM-MH-02-0045678'}</div>
            </div>

            <div>
              <div className="text-slate-400 font-medium">GeM Bid Identification Number</div>
              <div className="font-mono font-bold text-blue-700 mt-0.5">{bidder.bidId}</div>
            </div>

            <div className="sm:col-span-2">
              <div className="text-slate-400 font-medium">Registered Statutory Address</div>
              <div className="font-medium text-slate-700 mt-0.5 leading-relaxed flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                <span>{bidder.registeredAddress || 'Unit 402, Technology Park, MIDC, Andheri East, Mumbai, Maharashtra - 400093'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Observations Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-blue-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>AI Verification Findings</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                98.4% Confidence
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mt-3">
              Automated document parsing verified primary statutory registrations against CBDT, GSTN, and Ministry of MSME. Entity is in good standing with zero active debarment flags under Rule 151 of GFR 2017.
            </p>

            <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Item For Officer Discretion: </strong>
                OEM authorization form expires in 30 days. Recommend requesting extension letter before awarding contract.
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(`/reports/${bidder.id}`)}
              className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition text-center"
            >
              Detailed Report
            </button>
            <button
              type="button"
              onClick={() => navigate(`/verification/bidder/${bidder.id}/final-decision`)}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition text-center flex items-center justify-center gap-1"
            >
              <span>Officer Review</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Statutory Compliance Checklist */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Verification Checklist Breakdown</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Individual verification criteria evaluated through document OCR and portal reconciliation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {SAMPLE_BIDDER_CHECKLIST.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.statusType === 'verified' || item.statusType === 'compliant'
                      ? 'bg-emerald-100 text-emerald-700'
                      : item.statusType === 'warning'
                      ? 'bg-amber-100 text-amber-700'
                      : item.statusType === 'danger'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {item.statusType === 'verified' || item.statusType === 'compliant' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : item.statusType === 'warning' ? (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  ) : (
                    <span className="text-[10px] font-bold">N/A</span>
                  )}
                </div>

                <div>
                  <div className="font-bold text-slate-800">{item.title}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{item.remarks || item.portalSource}</div>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.statusType === 'verified' || item.statusType === 'compliant'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : item.statusType === 'warning'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : item.statusType === 'danger'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {item.statusText}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
