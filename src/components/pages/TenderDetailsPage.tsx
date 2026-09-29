import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Calendar,
  IndianRupee,
  Users,
  ShieldCheck,
  Eye,
  FileCheck,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { RiskBadge } from '../common/RiskBadge';
import { ComplianceScoreRing } from '../common/ComplianceScoreRing';

export const TenderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tenders, bidders } = useApp();

  const decodedId = id ? decodeURIComponent(id) : '';
  const tender = tenders.find((t) => t.id === decodedId) || tenders[0];

  // Map bidders to this tender or show relevant list
  const participatingBidders = bidders.map((b) => ({
    ...b,
    tenderId: tender.id,
  }));

  return (
    <div className="space-y-6">
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button
          type="button"
          onClick={() => navigate('/bids')}
          className="inline-flex items-center gap-1 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Bids / Tender</span>
        </button>
        <span>/</span>
        <span className="text-slate-800 font-mono">{tender.id}</span>
      </div>

      {/* Tender Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700">
                {tender.id}
              </span>
              <StatusBadge status={tender.status} />
              <span className="text-xs text-slate-400">• {tender.category}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-2">
              {tender.name}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>{tender.department}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Estimated Value</div>
              <div className="font-bold text-slate-900 mt-0.5">{tender.estimatedValue}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Participating Bidders</div>
              <div className="font-bold text-blue-700 mt-0.5">{participatingBidders.length} Bidders</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Closing Date</div>
              <div className="font-bold text-slate-700 mt-0.5">{tender.deadline}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Requirements Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Mandatory & Eligibility Rules</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Criteria evaluated by deterministic rule verification and AI document parsing.
            </p>
          </div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
            {tender.requirements?.length || 5} Evaluated Rules
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {tender.requirements?.map((req) => (
            <div
              key={req.id}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">{req.name}</span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase ${
                    req.isMandatory ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {req.isMandatory ? 'Mandatory' : 'Optional'}
                </span>
              </div>
              <div className="text-[11px] text-slate-500">Source: {req.verificationSource}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Participating Bidders List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Participating Bidders & Compliance Status</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Click &quot;Verify Bidder&quot; to inspect document cross-checks or record official procurement determination.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-5">Bidder / Company Name</th>
                <th className="py-3.5 px-5">Registration IDs</th>
                <th className="py-3.5 px-5 text-center">Compliance Score</th>
                <th className="py-3.5 px-5">Risk Factor</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {participatingBidders.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-5">
                    <div className="font-bold text-slate-900">{b.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">Bid ID: {b.bidId}</div>
                  </td>
                  <td className="py-4 px-5 font-mono text-[11px] text-slate-600">
                    <div>PAN: <strong className="text-slate-800">{b.pan}</strong></div>
                    <div>GSTIN: <strong className="text-slate-800">{b.gstin}</strong></div>
                  </td>
                  <td className="py-4 px-5 text-center">
                    <div className="inline-flex items-center gap-2">
                      <ComplianceScoreRing score={b.complianceScore} size="sm" />
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <RiskBadge level={b.riskLevel} />
                  </td>
                  <td className="py-4 px-5">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="py-4 px-5 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/verification/bidder/${b.id}`)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-2xs transition inline-flex items-center gap-1"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verify Bidder</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/reports/${b.id}`)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg border border-slate-200 transition inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Report</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
