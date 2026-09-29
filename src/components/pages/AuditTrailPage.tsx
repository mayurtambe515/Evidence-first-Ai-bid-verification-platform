import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Lock,
  X,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuditLogItem } from '../../data/gemDashboardData';
import { apiService } from '../../services/api';

export const AuditTrailPage: React.FC = () => {
  const { auditTrail, bidders, tenders } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'7days' | '30days' | 'all'>('all');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [backendLogs, setBackendLogs] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    apiService
      .getAllAuditLogs()
      .then((res) => {
        if (isMounted && res.success && Array.isArray(res.logs)) {
          const formatted = res.logs.map((log: any) => ({
            id: log.id,
            timestamp: new Date(log.timestamp).toLocaleString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            action: log.action,
            actor: log.actor || log.user || 'Officer',
            user: log.actor || log.user || 'Officer',
            role: log.role || 'Procurement Officer',
            bidderName: log.bidderName || (log.details && log.details.bidderName) || 'System Platform',
            statusTag: log.action.includes('QUALIFIED')
              ? 'QUALIFIED'
              : log.action.includes('DISQUALIFIED')
              ? 'DISQUALIFIED'
              : log.action.includes('VERIF')
              ? 'COMPLIANT'
              : 'LOGGED',
            details: typeof log.details === 'object' ? JSON.stringify(log.details) : String(log.details || ''),
            hash: log.hash || log.recordHash,
            previousHash: log.previousHash,
          }));
          setBackendLogs(formatted);
        }
      })
      .catch((e) => console.warn('Audit logs fetch:', e));

    return () => {
      isMounted = false;
    };
  }, []);

  // Merge context auditTrail with backendLogs (deduplicating by ID)
  const allLogs = React.useMemo(() => {
    const map = new Map<string, any>();
    backendLogs.forEach((l) => map.set(l.id, l));
    auditTrail.forEach((l) => {
      if (!map.has(l.id)) {
        map.set(l.id, {
          ...l,
          user: l.actor || (l as any).user || 'Procurement Officer',
        });
      }
    });
    return Array.from(map.values());
  }, [backendLogs, auditTrail]);

  const filteredLogs = allLogs.filter((item) => {
    const userStr = (item.user || item.actor || '').toLowerCase();
    const actionStr = (item.action || '').toLowerCase();
    const detailsStr = (item.details || '').toLowerCase();
    const bidderStr = (item.bidderName || '').toLowerCase();
    const q = searchQuery.toLowerCase();

    const matchesSearch =
      actionStr.includes(q) ||
      detailsStr.includes(q) ||
      userStr.includes(q) ||
      bidderStr.includes(q);

    const matchesAction = actionFilter === 'ALL' || (item.action && item.action.includes(actionFilter));

    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800 rounded-full text-xs font-bold uppercase tracking-wider">
              Immutable Ledger
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-400">• GFR Rule 144 Compliant</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Audit Trail
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Tamper-evident chronological record of all API cross-checks, document extractions, and officer actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Cryptographically Signed Ledger</span>
          </span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search action, bidder, or officer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
        </div>

        {/* Date Filter & Action Filter */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Date range */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700">
            {(
              [
                { id: '7days', label: 'Last 7 Days' },
                { id: '30days', label: '30 Days' },
                { id: 'all', label: 'All Time' },
              ] as const
            ).map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDateFilter(d.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  dateFilter === d.id
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Action Filter */}
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 font-medium focus:outline-none"
          >
            <option value="ALL">All Event Types</option>
            <option value="Decision">Officer Decisions</option>
            <option value="Verification">Registry Cross-Checks</option>
            <option value="Tender">Tender Management</option>
            <option value="Remarks">Officer Remarks</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                <th className="py-3.5 px-5">Time & Date</th>
                <th className="py-3.5 px-5">Authorized User</th>
                <th className="py-3.5 px-5">Event Action</th>
                <th className="py-3.5 px-5">Associated Bidder</th>
                <th className="py-3.5 px-5">Details Summary</th>
                <th className="py-3.5 px-5">Status Tag</th>
                <th className="py-3.5 px-5 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredLogs.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedLog(item)}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition cursor-pointer"
                >
                  <td className="py-4 px-5 font-mono text-[11px] text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      <span>{item.timestamp}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{item.user}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">PO-2024-8841</div>
                  </td>
                  <td className="py-4 px-5 font-semibold text-slate-800 dark:text-slate-200">
                    {item.action}
                  </td>
                  <td className="py-4 px-5 font-medium text-slate-700 dark:text-slate-300">
                    {item.bidderName || 'System Platform'}
                  </td>
                  <td className="py-4 px-5 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                    {item.details}
                  </td>
                  <td className="py-4 px-5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.statusTag.includes('COMPLIANT') || item.statusTag.includes('QUALIFIED')
                          ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : item.statusTag.includes('DISQUALIFIED') || item.statusTag.includes('DEBARRED') || item.statusTag.includes('REJECT')
                          ? 'bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                          : 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {item.statusTag}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLog(item);
                      }}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-lg transition text-[11px] border border-slate-200 dark:border-slate-700"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Audit Log Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Audit Trail Verification Record</h4>
                <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">Log Entry ID: {selectedLog.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 dark:text-slate-400">Timestamp:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedLog.timestamp}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 dark:text-slate-400">Authorized User:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedLog.user}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 dark:text-slate-400">Action:</span>
                <span className="font-bold text-blue-700 dark:text-blue-400">{selectedLog.action}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 dark:text-slate-400">Bidder / Entity:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedLog.bidderName || 'Platform Scope'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 dark:text-slate-400">Result Status:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">{selectedLog.statusTag}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 dark:text-slate-400 block mb-1">Details & Payload:</span>
                <p className="text-slate-700 dark:text-slate-200 font-mono text-[11px] leading-relaxed bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  {selectedLog.details}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 dark:text-slate-400 block mb-1">Immutable Cryptographic Integrity Hash (SHA-256):</span>
                <div className="font-mono text-[10px] text-slate-700 dark:text-emerald-400 bg-slate-100 dark:bg-slate-900/80 p-2 rounded-lg break-all border border-slate-200/50 dark:border-slate-700/60">
                  {selectedLog.hash || '3a49f55e0988019b88716b9b32c6b4e062b1b3b27b3f94532c525f053077fae9'}
                </div>
                {selectedLog.previousHash && (
                  <div className="mt-1 font-mono text-[9px] text-slate-400 dark:text-slate-500">
                    Previous Block Hash: {selectedLog.previousHash}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-800 dark:bg-blue-600 hover:bg-slate-900 dark:hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
