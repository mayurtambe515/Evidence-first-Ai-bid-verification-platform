import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Filter,
  CheckCircle2,
  FileText,
  Search,
  Eye,
  ArrowRight,
  Shield,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ComplianceScoreRing } from '../common/ComplianceScoreRing';
import { StatusBadge } from '../common/StatusBadge';
import { RiskBadge } from '../common/RiskBadge';

export const ComplianceReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const { bidders, tenders } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [tenderFilter, setTenderFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');

  const filteredBidders = bidders.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bidId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.pan.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchesRisk = riskFilter === 'ALL' || b.riskLevel.toUpperCase() === riskFilter.toUpperCase();

    return matchesSearch && matchesStatus && matchesRisk;
  });

  const handleDownloadAll = () => {
    alert('Exporting GeM Comprehensive Compliance Dossier Package (ZIP containing 8 audited PDF reports and CSV summary).');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800 rounded-full text-xs font-bold uppercase tracking-wider">
              Procurement Audit & Reporting
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-400">• GFR 2017 Regulatory Archives</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Compliance Reports
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Official evaluation dossiers, registry cross-checks, and officer determinations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadAll}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download All Reports</span>
          </button>
        </div>
      </div>

      {/* Quick Selector Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
          <FileCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Quick Dossier Access:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {bidders.slice(0, 4).map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => navigate(`/reports/${b.id}`)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-300 text-slate-700 dark:text-slate-200 text-xs font-semibold transition border border-slate-200 dark:border-slate-700"
            >
              {b.name.split(' ')[0]} ({b.complianceScore}%)
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search bidder name, PAN, or Bid ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 font-medium focus:outline-none"
          >
            <option value="ALL">All Compliance Statuses</option>
            <option value="Compliant">Compliant</option>
            <option value="Partial">Partial</option>
            <option value="Non-Compliant">Non-Compliant</option>
          </select>

          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 font-medium focus:outline-none"
          >
            <option value="ALL">All Risk Ratings</option>
            <option value="LOW">Low Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="HIGH">High Risk</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                <th className="py-3.5 px-5">Bidder</th>
                <th className="py-3.5 px-5">Tender ID</th>
                <th className="py-3.5 px-5 text-center">Score</th>
                <th className="py-3.5 px-5">Risk Factor</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Last Verified</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredBidders.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition">
                  <td className="py-4 px-5">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{b.name}</div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-400 font-mono mt-0.5">PAN: {b.pan}</div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="font-mono text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 border border-blue-200/60 dark:border-blue-800 px-2 py-0.5 rounded-md font-bold text-[11px]">
                      {b.bidId}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-center">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{b.complianceScore}%</span>
                  </td>
                  <td className="py-4 px-5">
                    <RiskBadge level={b.riskLevel} />
                  </td>
                  <td className="py-4 px-5">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="py-4 px-5 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    2025-02-20
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button
                      type="button"
                      onClick={() => navigate(`/reports/${b.id}`)}
                      className="px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-lg border border-blue-200 dark:border-blue-800 transition inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
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
