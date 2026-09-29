import React, { useState } from 'react';
import { Bidder, Tender } from '../types';
import { VendorRiskHistoryPanel } from './VendorRiskHistoryPanel';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Building,
  Plus,
  ArrowRight,
  FileText,
} from 'lucide-react';

interface BiddersViewProps {
  bidders: Bidder[];
  selectedBidder: Bidder;
  selectedTender: Tender;
  onSelectBidder: (bidder: Bidder) => void;
  onAddCustomBidder: (bidder: Bidder) => void;
}

export const BiddersView: React.FC<BiddersViewProps> = ({
  bidders,
  selectedBidder,
  selectedTender,
  onSelectBidder,
  onAddCustomBidder,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newGstin, setNewGstin] = useState('');
  const [newPan, setNewPan] = useState('');
  const [newTurnover, setNewTurnover] = useState('4.5');

  const handleCreateBidder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim()) return;

    const customBidder: Bidder = {
      id: `bidder-custom-${Date.now()}`,
      tenderId: selectedTender.id,
      name: newCompany.trim(),
      registeredLegalName: newCompany.trim() + ' Private Limited',
      gstin: newGstin.trim() || '07TEST1234A1Z9',
      pan: newPan.trim() || 'TEST1234A',
      udyamNumber: 'UDYAM-DL-01-0099999',
      oemCertNumber: 'OEM-CUSTOM-2026',
      turnoverCr: parseFloat(newTurnover) || 4.5,
      submissionDate: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      scenarioTag: 'CUSTOM',
      scenarioDescription: 'Custom user-created evaluation scenario.',
      documents: [
        {
          id: `doc-cst-1`,
          type: 'gst',
          title: 'Form GST REG-06 Certificate',
          fileName: `${newCompany.replace(/\s+/g, '_')}_GST.pdf`,
          uploadDate: '2026-09-09',
          fileSize: '350 KB',
          status: 'EXTRACTED',
          confidence: 0.95,
          extractedFields: {
            'Legal Name': newCompany.trim() + ' Private Limited',
            'GSTIN': newGstin.trim() || '07TEST1234A1Z9',
            'Status': 'Active (Regular Taxpayer)',
          },
        },
        {
          id: `doc-cst-2`,
          type: 'pan',
          title: 'Permanent Account Number Card',
          fileName: `${newCompany.replace(/\s+/g, '_')}_PAN.pdf`,
          uploadDate: '2026-09-09',
          fileSize: '290 KB',
          status: 'EXTRACTED',
          confidence: 0.98,
          extractedFields: {
            'PAN Number': newPan.trim() || 'TEST1234A',
            'Name on Card': newCompany.trim() + ' Private Limited',
          },
        },
        {
          id: `doc-cst-3`,
          type: 'udyam',
          title: 'Udyam MSME Certificate',
          fileName: 'Udyam_Registration.pdf',
          uploadDate: '2026-09-09',
          fileSize: '310 KB',
          status: 'EXTRACTED',
          confidence: 0.96,
          extractedFields: {
            'Udyam Reg Number': 'UDYAM-DL-01-0099999',
            'Enterprise Name': newCompany.trim() + ' Private Limited',
          },
        },
        {
          id: `doc-cst-4`,
          type: 'oem_auth',
          title: 'Direct OEM Authorization (MAF)',
          fileName: 'OEM_Direct_MAF.pdf',
          uploadDate: '2026-09-09',
          fileSize: '420 KB',
          status: 'EXTRACTED',
          confidence: 0.96,
          extractedFields: {
            'Authorization Number': 'OEM-CUSTOM-2026',
            'Validity': '2026-01-01 to 2027-12-31',
          },
        },
        {
          id: `doc-cst-5`,
          type: 'turnover_cert',
          title: 'CA Certified Turnover Statement',
          fileName: 'CA_Turnover_Statement.pdf',
          uploadDate: '2026-09-09',
          fileSize: '320 KB',
          status: 'EXTRACTED',
          confidence: 0.94,
          extractedFields: {
            'Certified Average Turnover': `₹ ${newTurnover} Crores`,
          },
        },
      ],
      portals: {
        gstn: {
          portalName: 'GSTN Authorized Public API',
          portalType: 'GSTN',
          status: 'Active',
          isSimulated: true,
          verifiedAt: new Date().toISOString(),
          fields: {
            'Legal Name': newCompany.trim() + ' Private Limited',
            'GSTIN': newGstin.trim() || '07TEST1234A1Z9',
            'GSTR-1 Filing': 'Filed (Current)',
            'GSTR-3B Filing': 'Filed (Current)',
          },
        },
        udyam: {
          portalName: 'Ministry of MSME - Udyam Registry',
          portalType: 'UDYAM',
          status: 'Active',
          isSimulated: true,
          verifiedAt: new Date().toISOString(),
          fields: {
            'Udyam Reg Number': 'UDYAM-DL-01-0099999',
            'Status': 'Active',
          },
        },
        pan: {
          portalName: 'Income Tax Department / NSDL PAN Registry',
          portalType: 'PAN_NSDL',
          status: 'Valid & Operative',
          isSimulated: true,
          verifiedAt: new Date().toISOString(),
          fields: {
            'PAN Number': newPan.trim() || 'TEST1234A',
            'Registered Name': newCompany.trim() + ' Private Limited',
          },
        },
        oem: {
          portalName: 'OEM Partner Verification Registry',
          portalType: 'OEM_REGISTRY',
          status: 'Active & Verified',
          isSimulated: true,
          verifiedAt: new Date().toISOString(),
          fields: {
            'Auth Code': 'OEM-CUSTOM-2026',
            'Valid Till': '2027-12-31',
          },
        },
      },
    };

    onAddCustomBidder(customBidder);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span>Participating Bidders Evaluated</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare bidder submissions for tender{' '}
            <strong className="text-slate-200">{selectedTender.refNumber}</strong>. Switch to any bidder to inspect live extraction and evidence.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Upload / Add New Bidder</span>
        </button>
      </div>

      {/* Grid of Bidders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bidders.map((bidder) => {
          const isSelected = bidder.id === selectedBidder.id;

          let tagBadge = null;
          let borderAccent = 'border-slate-800';

          if (bidder.scenarioTag === 'CLEAN_COMPLIANT') {
            borderAccent = isSelected ? 'border-emerald-500 ring-1 ring-emerald-500/50' : 'border-slate-800';
            tagBadge = (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                SCENARIO A: CLEAN DEMO
              </span>
            );
          } else if (bidder.scenarioTag === 'MISSING_EXPIRED') {
            borderAccent = isSelected ? 'border-amber-500 ring-1 ring-amber-500/50' : 'border-slate-800';
            tagBadge = (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800">
                SCENARIO B: MISSING & EXPIRED
              </span>
            );
          } else if (bidder.scenarioTag === 'SUBTLE_CONTRADICTION') {
            borderAccent = isSelected ? 'border-rose-500 ring-1 ring-rose-500/50' : 'border-slate-800';
            tagBadge = (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800">
                SCENARIO C: BAD BIDDER SHOWCASE
              </span>
            );
          } else {
            tagBadge = (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                CUSTOM BIDDER
              </span>
            );
          }

          return (
            <div
              key={bidder.id}
              className={`rounded-xl border p-5 flex flex-col justify-between transition-all duration-200 bg-slate-900 ${borderAccent} ${
                isSelected ? 'shadow-xl shadow-slate-950/80 bg-slate-900/90' : 'hover:bg-slate-850'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  {tagBadge}
                  {isSelected && (
                    <span className="text-[11px] font-semibold text-blue-400 bg-blue-950/60 border border-blue-800 px-2 py-0.5 rounded-full">
                      Selected
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white mb-1">{bidder.name}</h3>
                <p className="text-xs text-slate-400 font-mono mb-3 truncate">
                  GSTIN: {bidder.gstin} | PAN: {bidder.pan}
                </p>

                <p className="text-xs text-slate-300 bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 mb-4 leading-relaxed">
                  {bidder.scenarioDescription}
                </p>

                <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Documents Submitted:</span>
                    <span className="font-semibold text-slate-200">
                      {bidder.documents.filter((d) => d.status !== 'MISSING').length} of {bidder.documents.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Declared Turnover:</span>
                    <span className="font-semibold text-slate-200">₹ {bidder.turnoverCr.toFixed(2)} Cr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Submission Timestamp:</span>
                    <span className="font-mono text-[11px] text-slate-400">{bidder.submissionDate}</span>
                  </div>
                  {bidder.officerOverride?.isOverridden && (
                    <div className="flex justify-between text-amber-400 font-semibold pt-1 border-t border-slate-800">
                      <span>Officer Override:</span>
                      <span>{bidder.officerOverride.decision}</span>
                    </div>
                  )}
                </div>

                {/* Cross-Tender Vendor Risk History */}
                {bidder.riskHistory && (
                  <div className="mb-4">
                    <VendorRiskHistoryPanel history={bidder.riskHistory} compact={true} />
                  </div>
                )}
              </div>

              <button
                onClick={() => onSelectBidder(bidder)}
                className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  isSelected
                    ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40 cursor-default'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700'
                }`}
              >
                <span>{isSelected ? 'Active in Cockpit' : 'Inspect Compliance Evidence'}</span>
                {!isSelected && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Custom Bidder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 text-slate-100 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Add Custom Bidder for Evaluation</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter enterprise credentials to simulate document bundle extraction and cross-check against portals.
            </p>

            <form onSubmit={handleCreateBidder} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                  Enterprise Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zenith Tech Systems Pvt Ltd"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                  GSTIN (15 Digits)
                </label>
                <input
                  type="text"
                  placeholder="07AAAAA0000A1Z5"
                  value={newGstin}
                  onChange={(e) => setNewGstin(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                  PAN Number (10 Digits)
                </label>
                <input
                  type="text"
                  placeholder="AAAAA0000A"
                  value={newPan}
                  onChange={(e) => setNewPan(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                  Average Annual Turnover (₹ Crores)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newTurnover}
                  onChange={(e) => setNewTurnover(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md"
                >
                  Create & Run Extraction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
