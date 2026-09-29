import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Upload,
  Search,
  Filter,
  Eye,
  Building2,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  ArrowUpDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';

export const BidsTendersPage: React.FC = () => {
  const navigate = useNavigate();
  const { tenders } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Ongoing' | 'Completed'>('ALL');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Departments for filtering
  const departments = ['ALL', ...Array.from(new Set(tenders.map((t) => t.department)))];

  const filteredTenders = tenders.filter((tender) => {
    const matchesSearch =
      tender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = departmentFilter === 'ALL' || tender.department === departmentFilter;
    const matchesStatus = statusFilter === 'ALL' || tender.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800 rounded-full text-xs font-bold uppercase tracking-wider">
              GeM Procurement Tenders
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-400">• Active Cycle</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Bids / Tender
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage procurement tenders, configure compliance rules, and evaluate participating bidders.
          </p>
        </div>

        {/* Action Buttons: + Create Tender, Import Bidders */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 shadow-2xs transition flex items-center gap-2"
          >
            <Upload className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Import Bidders</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/bids/create')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/30 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Tender</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tender name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700">
            {(['ALL', 'Ongoing', 'Completed'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  statusFilter === st
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {st === 'ALL' ? 'All Tenders' : st}
              </button>
            ))}
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 font-medium focus:outline-none"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'ALL' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tenders Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                <th className="py-3.5 px-5">Tender ID</th>
                <th className="py-3.5 px-5">Tender Name</th>
                <th className="py-3.5 px-5">Department</th>
                <th className="py-3.5 px-5 text-center">Bidders</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Deadline</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredTenders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    No tenders match your current criteria.
                  </td>
                </tr>
              ) : (
                filteredTenders.map((tender) => (
                  <tr
                    key={tender.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition group"
                  >
                    <td className="py-4 px-5">
                      <span className="font-mono font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 border border-blue-200/60 dark:border-blue-800 px-2.5 py-1 rounded-md">
                        {tender.id}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                        {tender.name}
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">
                        Est. Value: <strong className="text-slate-700 dark:text-slate-300">{tender.estimatedValue}</strong>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{tender.department}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-0.5 rounded-full">
                        <Users className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                        <span>{tender.biddersCount}</span>
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <StatusBadge status={tender.status} />
                    </td>
                    <td className="py-4 px-5 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{tender.deadline}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => navigate(`/bids/${encodeURIComponent(tender.id)}`)}
                        className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-lg border border-blue-200 dark:border-blue-800 transition inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Import Bidders Modal Simulation */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Import Bidders Queue (CSV / GeM API)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bulk import bidder participation data, PAN/GSTIN IDs, and preliminary technical envelope attachments.
            </p>

            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer">
              <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-700 dark:text-slate-200">Drag & Drop Bidder CSV or XML</div>
              <div className="text-[11px] text-slate-400 dark:text-slate-400 mt-1">Supports GeM Standard XML Format & CSV Batch (Max 25MB)</div>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/70 rounded-xl text-xs text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <strong>Demo Integration: </strong>
              8 pre-loaded bidders are already synchronized with your local sandbox.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Demo bidder batch imported successfully!');
                  setIsImportModalOpen(false);
                }}
                className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl shadow-xs hover:bg-blue-700"
              >
                Simulate Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
