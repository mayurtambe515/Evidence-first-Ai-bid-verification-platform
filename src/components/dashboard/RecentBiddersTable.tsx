import React from 'react';
import { Building2, ArrowRight } from 'lucide-react';
import { RECENT_BIDDERS, RecentBidder } from '../../data/gemDashboardData';

interface RecentBiddersTableProps {
  bidders?: RecentBidder[];
  selectedBidderId?: string;
  onSelectBidder: (bidder: RecentBidder) => void;
  onViewAll?: () => void;
}

export const RecentBiddersTable: React.FC<RecentBiddersTableProps> = ({
  bidders = RECENT_BIDDERS,
  selectedBidderId,
  onSelectBidder,
  onViewAll,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
      {/* Table Header */}
      <div className="p-5 sm:px-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Recent Bidders
          </h2>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 group transition"
        >
          <span>View All</span>
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </button>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/60 text-[11px] font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
              <th className="py-3 px-4 sm:px-6 w-12">#</th>
              <th className="py-3 px-4">Bidder Name</th>
              <th className="py-3 px-4">GeM Bid ID</th>
              <th className="py-3 px-4">Compliance Score</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 sm:px-6 text-center w-20">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {bidders.map((bidder) => {
              const isSelected = selectedBidderId === bidder.id;
              return (
                <tr
                  key={bidder.id}
                  onClick={() => onSelectBidder(bidder)}
                  className={`hover:bg-blue-50/40 dark:hover:bg-slate-800/60 transition-colors cursor-pointer ${
                    isSelected ? 'bg-blue-50/70 dark:bg-blue-950/40' : ''
                  }`}
                >
                  {/* Number */}
                  <td className="py-4 px-4 sm:px-6 text-xs font-semibold text-slate-400 dark:text-slate-500">
                    {bidder.index}
                  </td>

                  {/* Bidder Name with Icon & PAN */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-300 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm leading-tight">
                          {bidder.name}
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-400 font-mono mt-0.5">
                          PAN: <span className="text-slate-600 dark:text-slate-300 font-medium">{bidder.pan}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* GeM Bid ID */}
                  <td className="py-4 px-4 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {bidder.bidId}
                  </td>

                  {/* Compliance Score with Gauge */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {/* Mini Ring Gauge */}
                      <div className="relative w-7 h-7 flex-shrink-0 flex items-center justify-center">
                        <svg className="w-7 h-7 -rotate-90" viewBox="0 0 36 36">
                          <circle
                            cx="18"
                            cy="18"
                            r="14"
                            fill="none"
                            className="stroke-slate-200 dark:stroke-slate-700"
                            strokeWidth="3.5"
                          />
                          <circle
                            cx="18"
                            cy="18"
                            r="14"
                            fill="none"
                            stroke={
                              bidder.complianceScore >= 80
                                ? '#10b981'
                                : bidder.complianceScore >= 60
                                ? '#f59e0b'
                                : '#ef4444'
                            }
                            strokeWidth="3.5"
                            strokeDasharray={`${(bidder.complianceScore * 88) / 100}, 100`}
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <span
                        className={`font-bold text-xs sm:text-sm ${
                          bidder.complianceScore >= 80
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : bidder.complianceScore >= 60
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {bidder.complianceScore}%
                      </span>
                    </div>
                  </td>

                  {/* Status Pill */}
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        bidder.status === 'Compliant'
                          ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : bidder.status === 'Partial'
                          ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          : 'bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      {bidder.status}
                    </span>
                  </td>

                  {/* Action Circular Button */}
                  <td className="py-4 px-4 sm:px-6 text-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectBidder(bidder);
                      }}
                      className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white hover:border-blue-600 transition flex items-center justify-center mx-auto"
                      aria-label={`View details for ${bidder.name}`}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
