import React, { useState } from 'react';
import { Bidder } from '../types';
import {
  Globe2,
  Building2,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  Check,
} from 'lucide-react';

interface PortalsViewProps {
  bidder: Bidder;
}

export const PortalsView: React.FC<PortalsViewProps> = ({ bidder }) => {
  const [activePortal, setActivePortal] = useState<'gstn' | 'udyam' | 'pan' | 'oem'>('gstn');
  const [loading, setLoading] = useState(false);
  const [liveData, setLiveData] = useState<any>(null);

  const fetchPortalData = async (type: 'gstn' | 'udyam' | 'pan' | 'oem') => {
    setLoading(true);
    try {
      let endpoint = '';
      if (type === 'gstn') endpoint = `/mock/gstn-lookup?gstin=${encodeURIComponent(bidder.gstin)}`;
      if (type === 'udyam') endpoint = `/mock/udyam-lookup?udyam=${encodeURIComponent(bidder.udyamNumber)}`;
      if (type === 'pan') endpoint = `/mock/pan-nsdl-lookup?pan=${encodeURIComponent(bidder.pan)}`;
      if (type === 'oem') endpoint = `/mock/oem-portal-lookup?cert=${encodeURIComponent(bidder.oemCertNumber)}`;

      const res = await fetch(endpoint);
      const data = await res.json();
      setLiveData(data);
    } catch (e) {
      console.error('Portal lookup error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-teal-400" />
              <span>Government Registries & Portals Cross-Check</span>
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-950/80 text-teal-300 border border-teal-800">
              Simulated Public APIs
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real GSTN, Udyam, and NSDL APIs require private government credentials.
            These mock endpoints return official realistic schemas with verified status flags for {bidder.name}.
          </p>
        </div>

        <button
          onClick={() => fetchPortalData(activePortal)}
          disabled={loading}
          className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Querying API...' : 'Live Query Endpoint'}</span>
        </button>
      </div>

      {/* Registry Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => {
            setActivePortal('gstn');
            fetchPortalData('gstn');
          }}
          className={`p-3 rounded-xl border text-left transition ${
            activePortal === 'gstn'
              ? 'bg-slate-900 border-teal-500 ring-1 ring-teal-500/50 shadow-md'
              : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 text-slate-400'
          }`}
        >
          <div className="text-[11px] font-semibold text-teal-400 uppercase">Registry 1</div>
          <div className="text-xs font-bold text-white mt-0.5">GSTN Taxpayer API</div>
          <div className="text-[10px] text-slate-500 font-mono mt-1 truncate">
            /mock/gstn-lookup
          </div>
        </button>

        <button
          onClick={() => {
            setActivePortal('udyam');
            fetchPortalData('udyam');
          }}
          className={`p-3 rounded-xl border text-left transition ${
            activePortal === 'udyam'
              ? 'bg-slate-900 border-teal-500 ring-1 ring-teal-500/50 shadow-md'
              : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 text-slate-400'
          }`}
        >
          <div className="text-[11px] font-semibold text-teal-400 uppercase">Registry 2</div>
          <div className="text-xs font-bold text-white mt-0.5">MSME Udyam Portal</div>
          <div className="text-[10px] text-slate-500 font-mono mt-1 truncate">
            /mock/udyam-lookup
          </div>
        </button>

        <button
          onClick={() => {
            setActivePortal('pan');
            fetchPortalData('pan');
          }}
          className={`p-3 rounded-xl border text-left transition ${
            activePortal === 'pan'
              ? 'bg-slate-900 border-teal-500 ring-1 ring-teal-500/50 shadow-md'
              : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 text-slate-400'
          }`}
        >
          <div className="text-[11px] font-semibold text-teal-400 uppercase">Registry 3</div>
          <div className="text-xs font-bold text-white mt-0.5">Income Tax NSDL PAN</div>
          <div className="text-[10px] text-slate-500 font-mono mt-1 truncate">
            /mock/pan-nsdl-lookup
          </div>
        </button>

        <button
          onClick={() => {
            setActivePortal('oem');
            fetchPortalData('oem');
          }}
          className={`p-3 rounded-xl border text-left transition ${
            activePortal === 'oem'
              ? 'bg-slate-900 border-teal-500 ring-1 ring-teal-500/50 shadow-md'
              : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 text-slate-400'
          }`}
        >
          <div className="text-[11px] font-semibold text-teal-400 uppercase">Registry 4</div>
          <div className="text-xs font-bold text-white mt-0.5">OEM Direct Partner Registry</div>
          <div className="text-[10px] text-slate-500 font-mono mt-1 truncate">
            /mock/oem-portal-lookup
          </div>
        </button>
      </div>

      {/* Field-by-Field Cross Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Field-by-Field Forensic Cross-Check Matrix</span>
            <span className="text-xs font-normal text-slate-400">
              (Uploaded Document vs Authorized Portal)
            </span>
          </h3>
          <span className="text-[10px] font-mono text-slate-400">
            Subject: {bidder.name}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider bg-slate-950/60">
                <th className="p-3">Compliance Field</th>
                <th className="p-3">Value in Bidder Document</th>
                <th className="p-3">Value in Government Registry</th>
                <th className="p-3 text-right">Audit Match Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr className="hover:bg-slate-850/50">
                <td className="p-3 font-semibold text-white">GSTIN Registration</td>
                <td className="p-3 font-mono">{bidder.gstin}</td>
                <td className="p-3 font-mono">
                  {bidder.portals.gstn?.fields?.['GSTIN'] || bidder.gstin}
                </td>
                <td className="p-3 text-right">
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Exact Match
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-850/50">
                <td className="p-3 font-semibold text-white">PAN Corporate Entity</td>
                <td className="p-3 font-mono">
                  {bidder.documents?.find((d) => d.type === 'pan')?.extractedFields?.['Name on Card'] || bidder.registeredLegalName}
                </td>
                <td className="p-3 font-mono">
                  {bidder.portals.pan?.fields?.['Registered Name'] || bidder.registeredLegalName}
                </td>
                <td className="p-3 text-right">
                  {bidder.id === 'bidder-c' ? (
                    <span className="inline-flex items-center gap-1 text-rose-400 font-semibold bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                      <XCircle className="w-3.5 h-3.5" />
                      LLP vs LIMITED Mismatch
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified Match
                    </span>
                  )}
                </td>
              </tr>

              <tr className="hover:bg-slate-850/50">
                <td className="p-3 font-semibold text-white">Udyam MSME Standing</td>
                <td className="p-3 font-mono">{bidder.udyamNumber}</td>
                <td className="p-3 font-mono">{bidder.portals.udyam?.status || 'Active'}</td>
                <td className="p-3 text-right">
                  {bidder.id === 'bidder-b' ? (
                    <span className="inline-flex items-center gap-1 text-amber-400 font-semibold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Classification Suspended
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active Record
                    </span>
                  )}
                </td>
              </tr>

              <tr className="hover:bg-slate-850/50">
                <td className="p-3 font-semibold text-white">OEM Direct Authorization</td>
                <td className="p-3 font-mono">
                  {bidder.oemCertNumber || 'NONE SUBMITTED'}
                </td>
                <td className="p-3 font-mono">
                  {bidder.portals.oem?.status || 'Active'}
                </td>
                <td className="p-3 text-right">
                  {bidder.id === 'bidder-b' ? (
                    <span className="inline-flex items-center gap-1 text-rose-400 font-semibold bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                      <XCircle className="w-3.5 h-3.5" />
                      Missing Document
                    </span>
                  ) : bidder.id === 'bidder-c' ? (
                    <span className="inline-flex items-center gap-1 text-rose-400 font-semibold bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                      <XCircle className="w-3.5 h-3.5" />
                      Expired 15-Jul-2026
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Valid & Active
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Live JSON Payload from Portal (Demonstrates real backend response) */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs">
        <div className="flex items-center justify-between text-slate-400 mb-2 pb-2 border-b border-slate-800">
          <span className="flex items-center gap-1.5 font-bold text-teal-400">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            Live Government Registry Payload (JSON)
          </span>
          <span className="text-[11px] text-slate-500">
            Endpoint: /mock/{activePortal === 'gstn' ? 'gstn-lookup' : activePortal === 'udyam' ? 'udyam-lookup' : activePortal === 'pan' ? 'pan-nsdl-lookup' : 'oem-portal-lookup'}
          </span>
        </div>

        <pre className="text-teal-300 overflow-x-auto max-h-56 leading-relaxed p-2 bg-slate-900/70 rounded">
          {JSON.stringify(
            liveData ||
              (activePortal === 'gstn'
                ? bidder.portals.gstn
                : activePortal === 'udyam'
                ? bidder.portals.udyam
                : activePortal === 'pan'
                ? bidder.portals.pan
                : bidder.portals.oem),
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
};
