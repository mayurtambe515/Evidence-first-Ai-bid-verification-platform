import React from 'react';
import { useParams, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  ArrowLeft,
  FileCheck,
  Building2,
  ExternalLink,
  ShieldAlert,
  Scale,
  FileText,
  History,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { ComplianceScoreRing } from '../../common/ComplianceScoreRing';
import { StatusBadge } from '../../common/StatusBadge';
import { RiskBadge } from '../../common/RiskBadge';

export const BidderLayout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { bidders } = useApp();

  const bidder = bidders.find((b) => b.id === id) || bidders[0];

  const basePath = `/verification/bidder/${bidder.id}`;

  const tabs = [
    { label: 'Overview', path: basePath, icon: Building2 },
    { label: 'Documents', path: `${basePath}/documents`, icon: FileCheck },
    { label: 'Portal Verification', path: `${basePath}/portal-verification`, icon: ExternalLink },
    { label: 'Risk & Remarks', path: `${basePath}/risk`, icon: ShieldAlert },
    { label: 'Final Decision', path: `${basePath}/final-decision`, icon: Scale },
  ];

  return (
    <div className="space-y-6">
      {/* Back to verification link */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/verification')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Verification Queue</span>
        </button>

        <button
          type="button"
          onClick={() => navigate(`/reports/${bidder.id}`)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Generate Full Dossier</span>
        </button>
      </div>

      {/* Bidder Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                {bidder.bidId}
              </span>
              <StatusBadge status={bidder.status} />
              <RiskBadge level={bidder.riskLevel} />
              {bidder.officerDecision && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                  Officer: {bidder.officerDecision}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {bidder.name}
            </h2>

            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>PAN: <strong className="font-mono text-slate-800">{bidder.pan}</strong></span>
              <span>GSTIN: <strong className="font-mono text-slate-800">{bidder.gstin}</strong></span>
              {bidder.udyam && (
                <span>Udyam: <strong className="font-mono text-slate-800">{bidder.udyam}</strong></span>
              )}
            </div>
          </div>

          {/* Compliance Score Box */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 self-start md:self-auto">
            <ComplianceScoreRing score={bidder.complianceScore} size="lg" />
            <div>
              <div className="text-xs font-bold text-slate-900">Compliance Index</div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                {bidder.complianceScore >= 80 ? 'Statutory Criteria Met' : 'Requires Scrutiny'}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Rule Engine v3.2</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="flex overflow-x-auto gap-2 border-t border-slate-100 mt-6 pt-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive =
              tab.path === basePath
                ? location.pathname === basePath
                : location.pathname === tab.path;

            return (
              <button
                key={tab.path}
                type="button"
                onClick={() => navigate(tab.path)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Rendered via Outlet */}
      <Outlet context={{ bidder }} />
    </div>
  );
};
