import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Shield,
  Info,
  Clock,
  Check,
  Building2,
  FileCheck,
  Eye,
  X,
  Loader2,
} from 'lucide-react';
import { BidderData } from '../../../types';
import { useApp } from '../../../context/AppContext';
import { apiService } from '../../../services/api';

interface PortalCardData {
  id: string;
  name: string;
  category: string;
  status: 'Verified' | 'Compliant' | 'Not Applicable' | 'Attention';
  lastChecked: string;
  keyInfo: { label: string; value: string }[];
  evidence: string;
}

export const BidderPortalVerificationTab: React.FC = () => {
  const { bidder } = useOutletContext<{ bidder: BidderData }>();
  const { refreshBidderPortals } = useApp();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [evidenceModal, setEvidenceModal] = useState<PortalCardData | null>(null);
  const [lastUpdatedTime, setLastUpdatedTime] = useState('2 minutes ago');

  const [portals, setPortals] = useState<PortalCardData[]>([
    {
      id: 'gstn',
      name: 'GSTN (Goods & Services Tax Network)',
      category: 'Statutory Taxation',
      status: 'Verified',
      lastChecked: 'Today at 09:30 AM',
      keyInfo: [
        { label: 'GSTIN', value: bidder.gstin },
        { label: 'Status', value: 'Active' },
        { label: 'GSTR-3B Filings', value: 'Up to date (Jan 2025)' },
        { label: 'Taxpayer Type', value: 'Regular' },
      ],
      evidence: 'GSTN Gateway API Response: Response code 200 OK. State jurisdiction: Maharashtra Ward 04. No return filing defaults in trailing 24 months.',
    },
    {
      id: 'udyam',
      name: 'Udyam / MSME Portal',
      category: 'Enterprise Classification',
      status: 'Verified',
      lastChecked: 'Today at 09:30 AM',
      keyInfo: [
        { label: 'Udyam Reg No', value: bidder.udyam || 'UDYAM-MH-02-0045678' },
        { label: 'Category', value: 'Small Enterprise (Mfg)' },
        { label: 'Major Activity', value: 'IT Hardware' },
        { label: 'Exemption Eligibility', value: 'Eligible for EMD & Tender Fee' },
      ],
      evidence: 'Ministry of MSME Enterprise Database: Validated against Aadhaar and PAN master record. Class verified under MSMED Act 2006.',
    },
    {
      id: 'pan_it',
      name: 'PAN & Income Tax (CBDT)',
      category: 'Direct Taxes',
      status: 'Verified',
      lastChecked: 'Today at 09:30 AM',
      keyInfo: [
        { label: 'PAN', value: bidder.pan },
        { label: 'PAN Status', value: 'Operative & Linked' },
        { label: 'ITR Acknowledgment', value: 'AY 2024-25 Filed' },
        { label: 'Section 206AB Flag', value: 'Compliant (Non-Specified)' },
      ],
      evidence: 'Income Tax Department API: PAN is active and operative. No TDS higher rate penalty flag under Section 206AB/206CCA.',
    },
    {
      id: 'mca21',
      name: 'MCA21 (Ministry of Corporate Affairs)',
      category: 'Corporate Registry',
      status: 'Verified',
      lastChecked: 'Today at 09:31 AM',
      keyInfo: [
        { label: 'CIN', value: 'U72200MH2015PTC264589' },
        { label: 'Company Status', value: 'Active' },
        { label: 'Authorized Capital', value: '₹ 5.00 Crore' },
        { label: 'Director Status', value: '3 Active DINs (Valid)' },
      ],
      evidence: 'MCA21 V3 Registry: Annual returns Form MGT-7 and AOC-4 filed for FY 2023-24. Company is not under liquidation or strike-off.',
    },
    {
      id: 'epfo_esic',
      name: 'EPFO / ESIC Registry',
      category: 'Social Security',
      status: 'Not Applicable',
      lastChecked: 'Today at 09:31 AM',
      keyInfo: [
        { label: 'EPF Establishment Code', value: 'Exempt (< 10 Employees)' },
        { label: 'ESIC Code', value: 'Not required' },
        { label: 'Compliance Status', value: 'Self-Certified Non-Applicability' },
      ],
      evidence: 'Labor Portal Cross-Check: Entity submitted valid self-declaration of headcount < 10. Statutory thresholds not breached.',
    },
    {
      id: 'startup',
      name: 'Startup India (DPIIT)',
      category: 'Innovation Registry',
      status: 'Compliant',
      lastChecked: 'Today at 09:31 AM',
      keyInfo: [
        { label: 'DPIIT Recognition', value: 'DIPP49281' },
        { label: 'Valid Period', value: 'Up to May 2025' },
        { label: 'Relaxation Eligibility', value: 'Prior Experience / Turnover Exemption' },
      ],
      evidence: 'Startup India Portal: Recognized DPIIT entity. Entitled to relaxations on prior experience & turnover per GeM GTC clause 11.',
    },
    {
      id: 'nsic',
      name: 'NSIC (National Small Industries Corp)',
      category: 'MSME Single Point Registration',
      status: 'Verified',
      lastChecked: 'Today at 09:32 AM',
      keyInfo: [
        { label: 'NSIC Certificate', value: 'NSIC/GP/MH/2023/10293' },
        { label: 'Store Item', value: 'Network & Server Equipments' },
        { label: 'Monetary Limit', value: '₹ 2.50 Crore' },
      ],
      evidence: 'NSIC SPRS Portal: Single Point Registration Scheme enlistment active until December 2025. Quality inspection verified.',
    },
    {
      id: 'make_in_india',
      name: 'Make in India (DPIIT PPO Order)',
      category: 'Public Procurement Preference',
      status: 'Compliant',
      lastChecked: 'Today at 09:32 AM',
      keyInfo: [
        { label: 'Class of Supplier', value: 'Class-I Local Supplier' },
        { label: 'Local Content %', value: '62.4% (Min req: 50%)' },
        { label: 'Auditor Certificate', value: 'Attached & Verified' },
      ],
      evidence: 'Public Procurement Division Verification: Meets Class-I local content criteria under DPIIT order P-45021/2/2017-PP (BE-II).',
    },
  ]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await apiService.runVerification(bidder.id);
      const vList = res.verificationResults || res.portalResults || [];
      if (res.success && vList.length > 0) {
        setPortals((prev) =>
          prev.map((p) => {
            const match = vList.find(
              (r: any) =>
                (r.serviceName && r.serviceName.toLowerCase().includes(p.id)) ||
                (r.service && r.service.toLowerCase().includes(p.id)) ||
                (p.id === 'gstn' && ((r.serviceName && r.serviceName.toLowerCase().includes('gst')) || (r.service && r.service.toLowerCase().includes('gst')))) ||
                (p.id === 'udyam' && ((r.serviceName && r.serviceName.toLowerCase().includes('udyam')) || (r.service && r.service.toLowerCase().includes('udyam')))) ||
                (p.id === 'pan_it' && ((r.serviceName && r.serviceName.toLowerCase().includes('pan')) || (r.service && r.service.toLowerCase().includes('pan')))) ||
                (p.id === 'mca21' && ((r.serviceName && r.serviceName.toLowerCase().includes('mca')) || (r.service && r.service.toLowerCase().includes('mca'))))
            );
            if (match) {
              const latency = match.data?.latencyMs || match.latencyMs || 120;
              const status = match.status || 'VERIFIED';
              const sName = match.serviceName || match.service || 'Government Gateway';
              return {
                ...p,
                status: status === 'VERIFIED' ? 'Verified' : 'Attention',
                lastChecked: `Just now (${latency}ms)`,
                evidence: `${sName}: ${status}. Verified & persisted to PostgreSQL database at ${new Date(
                  match.verifiedAt || Date.now()
                ).toLocaleTimeString()}`,
              };
            }
            return { ...p, lastChecked: 'Just now (Synchronized in DB)' };
          })
        );
      }
    } catch (e) {
      console.warn('Portal verification error:', e);
    } finally {
      setIsRefreshing(false);
      setLastUpdatedTime('Just now');
      refreshBidderPortals(bidder.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Prominent Demo Banner */}
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3 shadow-2xs">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">DEMO DATA — Government API integrations are not connected. </span>
          In production, this module queries live endpoints from GSTN, CBDT, MCA21, DigiLocker, and EPFO via API Setu / NIC National Gateway.
        </div>
      </div>

      {/* Header with Refresh Button */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Government Portal Cross-Verification Gateways</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time querying of statutory Central Government databases for tamper-evident validation.
          </p>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Last synchronized: <strong>{lastUpdatedTime}</strong></span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition flex items-center gap-2 self-start sm:self-auto"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Querying Portals...' : 'Refresh Verification'}</span>
        </button>
      </div>

      {/* Verification Pipeline Timeline */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Verification Pipeline Timeline
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
          {[
            { step: '1', title: 'Verification Started', desc: 'Tender Envelope opened' },
            { step: '2', title: 'Data Retrieved', desc: '8 Registry endpoints queried' },
            { step: '3', title: 'Information Extracted', desc: 'Entities parsed via OCR' },
            { step: '4', title: 'Cross-check Completed', desc: '0 Discrepancies on PAN/GST' },
            { step: '5', title: 'Compliance Rules Applied', desc: 'Score calculated: 92%' },
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-700 font-mono">Step {item.step}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="font-bold text-slate-800 text-[11px]">{item.title}</div>
              <div className="text-[10px] text-slate-400">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 8 Portal Verification Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {portals.map((portal) => (
          <div
            key={portal.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {portal.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {portal.name}
                  </h4>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    portal.status === 'Verified' || portal.status === 'Compliant'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {portal.status}
                </span>
              </div>

              <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                {portal.keyInfo.map((info, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-slate-500">{info.label}:</span>
                    <strong className="text-slate-800 font-mono text-[11px]">{info.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">{portal.lastChecked}</span>
              <button
                type="button"
                onClick={() => setEvidenceModal(portal)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Evidence</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Evidence Modal */}
      {evidenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-sm text-slate-900">{evidenceModal.name}</h4>
                <span className="text-[11px] text-slate-400">Statutory API Verification Certificate</span>
              </div>
              <button
                type="button"
                onClick={() => setEvidenceModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 space-y-2">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Raw Verification Evidence</div>
              <p className="leading-relaxed text-[11px]">{evidenceModal.evidence}</p>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Cryptographic hash validated against central registry keystore.</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setEvidenceModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Close Evidence
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
