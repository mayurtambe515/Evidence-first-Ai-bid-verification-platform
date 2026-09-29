import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  Building2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  RotateCcw,
  Sparkles,
  Scale,
  Check,
  ArrowRight,
  ExternalLink,
  Loader2,
  FileCheck,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ComplianceScoreRing } from '../common/ComplianceScoreRing';
import { StatusBadge } from '../common/StatusBadge';
import { RiskBadge } from '../common/RiskBadge';

export const VerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const { bidders } = useApp();
  const outletContext = useOutletContext<{ openQuickAccess?: (p: string) => void }>();

  const [searchQuery, setSearchQuery] = useState('Shree Tech Solutions');
  const [activeBidder, setActiveBidder] = useState(bidders[0] || {
    id: 'bidder_shree_tech',
    name: 'Shree Tech Solutions Pvt. Ltd.',
    bidId: 'GEM/2025/0167',
    pan: 'AABCS1234D',
    gstin: '27ABCDE1234F1Z5',
    complianceScore: 92,
    status: 'Compliant' as const,
    riskLevel: 'Low' as const,
    companyType: 'Private Limited',
    registeredAddress: 'Unit 402, Technology Park, MIDC, Andheri East, Mumbai, Maharashtra - 400093',
  });

  // Verification simulation state
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);

  const verificationSteps = [
    'Fetching bidder information from GeM database...',
    'Analyzing submitted documents with AI engine...',
    'Cross-checking verification data across government portals...',
    'Running compliance rules and calculating score...',
  ];

  const handleStartVerification = (bidderToVerify = activeBidder) => {
    setIsVerifying(true);
    setVerificationStep(0);

    const stepInterval = setInterval(() => {
      setVerificationStep((prev) => {
        if (prev >= 3) {
          clearInterval(stepInterval);
          setIsVerifying(false);
          setActiveBidder(bidderToVerify);
          return 3;
        }
        return prev + 1;
      });
    }, 450);
  };

  const handleSearchAndVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase().trim();
    const matched = bidders.find(
      (b) =>
        b.name.toLowerCase().includes(query) ||
        b.pan.toLowerCase().includes(query) ||
        b.gstin.toLowerCase().includes(query) ||
        b.bidId.toLowerCase().includes(query)
    );

    if (matched) {
      handleStartVerification(matched);
    } else {
      handleStartVerification(bidders[0]);
    }
  };

  const quickPortals = [
    'Udyam / MSME',
    'GSTN',
    'Income Tax',
    'DigiLocker',
    'EPFO / ESIC',
    'More',
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
              Verification Engine
            </span>
            <span className="text-xs text-slate-400">• Multi-Registry Gateway</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Verify a Bidder
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Automated document analysis, government registry cross-checks, and deterministic compliance calculation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/verification/bidder/${activeBidder.id}/final-decision`)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-blue-600/30 transition self-start sm:self-auto"
        >
          <Scale className="w-4 h-4" />
          <span>Record Officer Decision</span>
        </button>
      </div>

      {/* Search Bar & Quick Access Gateways */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <form onSubmit={handleSearchAndVerify} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by PAN, GSTIN, GeM Bid ID, or Company Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50"
            />
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Bidder</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Access Portal Buttons */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-1">Quick Access:</span>
          {quickPortals.map((portal) => (
            <button
              key={portal}
              type="button"
              onClick={() => outletContext?.openQuickAccess?.(portal)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold transition border border-slate-200/70 inline-flex items-center gap-1.5"
            >
              <span>{portal}</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Verification Simulation Loading State */}
      {isVerifying && (
        <div className="bg-white rounded-2xl p-8 border border-blue-200 shadow-md animate-in fade-in space-y-5 text-center">
          <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin mx-auto" />
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Running GeM AI Scrutiny Pipeline
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Deterministic verification against Central Government registries
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-2 text-left">
            {verificationSteps.map((step, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl text-xs flex items-center gap-2.5 transition ${
                  verificationStep === idx
                    ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200'
                    : verificationStep > idx
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'bg-slate-50 text-slate-400'
                }`}
              >
                {verificationStep > idx ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : verificationStep === idx ? (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-300 flex-shrink-0" />
                )}
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bidder Results Card (When not verifying) */}
      {!isVerifying && (
        <div className="space-y-6">
          {/* Main Results Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            {/* Header info row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                    {activeBidder.bidId}
                  </span>
                  <StatusBadge status={activeBidder.status} />
                  <RiskBadge level={activeBidder.riskLevel} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
                  {activeBidder.name}
                </h3>
                <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                  <span>PAN: <strong className="font-mono text-slate-800">{activeBidder.pan}</strong></span>
                  <span>GSTIN: <strong className="font-mono text-slate-800">{activeBidder.gstin}</strong></span>
                </div>
              </div>

              {/* Compliance score card */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 self-start md:self-auto">
                <ComplianceScoreRing score={activeBidder.complianceScore} size="lg" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Verification Index</div>
                  <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">High Compliance Level</div>
                  <div className="text-[10px] text-slate-400 mt-1">Evaluated under GFR 2017</div>
                </div>
              </div>
            </div>

            {/* Verification Pipeline Progress */}
            <div>
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Verification Progress
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { title: 'Documents', status: 'Completed', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
                  { title: 'Government Sources', status: 'Completed', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
                  { title: 'AI Analysis', status: 'Completed', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
                  { title: 'Compliance Report', status: 'Ready', color: 'bg-blue-50 text-blue-800 border-blue-200' },
                ].map((item, idx) => (
                  <div key={idx} className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between ${item.color}`}>
                    <span>{item.title}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Summary Checklist */}
            <div>
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Statutory Verification Summary
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {[
                  { name: 'Udyam Registration', status: 'Verified', source: 'Ministry of MSME', ok: true },
                  { name: 'GST Registration', status: 'Verified', source: 'GSTN Portal', ok: true },
                  { name: 'GST Return Filing (GSTR-3B)', status: 'Verified', source: 'GSTN Portal', ok: true },
                  { name: 'PAN Verification', status: 'Verified', source: 'Income Tax CBDT', ok: true },
                  { name: 'Income Tax Return (AY 2024-25)', status: 'Verified', source: 'Income Tax CBDT', ok: true },
                  { name: 'MCA21 Filing', status: 'Verified', source: 'Ministry of Corporate Affairs', ok: true },
                  { name: 'EPFO / ESIC Registration', status: 'Not Applicable', source: 'EPFO Gateway (<10 emp)', ok: true },
                  { name: 'Make in India Declaration', status: 'Compliant (>50%)', source: 'Class-I Local Supplier', ok: true },
                  { name: 'OEM Authorization Form', status: 'Pending Review', source: 'Expiry within 30 days', ok: false },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50/70 rounded-xl border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-800">{item.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{item.source}</div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.ok
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detected Issues Alert */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Detected Observation: </span>
                OEM Authorization document has an expiry date in 30 days. Recommend Procurement Officer review and request updated validity letter if tender timeline exceeds one month.
              </div>
            </div>

            {/* AI Analysis Box */}
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200/80 space-y-1.5 text-xs text-slate-700">
              <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>AI Recommendation & Observations</span>
              </div>
              <p className="leading-relaxed">
                The bidder demonstrates strong statutory compliance across major government registries. All primary registrations are active and verified. One minor observation regarding OEM authorization validity period. Final procurement determination remains with the Procurement Officer.
              </p>
            </div>

            {/* Action Buttons Section */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(`/reports/${activeBidder.id}`)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>View Full Report</span>
              </button>

              <button
                type="button"
                onClick={() => navigate(`/verification/bidder/${activeBidder.id}/documents`)}
                className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition flex items-center gap-1.5"
              >
                <FileCheck className="w-4 h-4 text-slate-500" />
                <span>View Documents</span>
              </button>

              <button
                type="button"
                onClick={() => navigate(`/verification/bidder/${activeBidder.id}/portal-verification`)}
                className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition flex items-center gap-1.5"
              >
                <ExternalLink className="w-4 h-4 text-slate-500" />
                <span>View Portal Verification</span>
              </button>

              <button
                type="button"
                onClick={() => navigate(`/verification/bidder/${activeBidder.id}/final-decision`)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 ml-auto"
              >
                <Scale className="w-4 h-4" />
                <span>Proceed to Officer Review</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
