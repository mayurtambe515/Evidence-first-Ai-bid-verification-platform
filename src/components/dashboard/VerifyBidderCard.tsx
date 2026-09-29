import React, { useState } from 'react';
import {
  Search,
  Building,
  FileText,
  CreditCard,
  Cloud,
  Users,
  MoreHorizontal,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { RECENT_BIDDERS, RecentBidder } from '../../data/gemDashboardData';
import { useApp } from '../../context/AppContext';

interface VerifyBidderCardProps {
  onVerifyQuery: (query: string) => void;
  onSelectBidder: (bidder: RecentBidder) => void;
  onShowQuickAccessDemo?: (portalName: string) => void;
  onShowQuickAccess?: (portalName: string) => void;
  bidders?: RecentBidder[];
}

export const VerifyBidderCard: React.FC<VerifyBidderCardProps> = ({
  onVerifyQuery,
  onSelectBidder,
  onShowQuickAccessDemo,
  onShowQuickAccess,
  bidders: propBidders,
}) => {
  const { bidders: appBidders } = useApp();
  const biddersList = propBidders || (appBidders && appBidders.length > 0 ? appBidders : RECENT_BIDDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Filter recommendations based on live database bidders
  const suggestions = searchQuery.trim()
    ? biddersList.filter(
        (b) =>
          b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.pan.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.gstin.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.bidId.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onVerifyQuery(searchQuery.trim());
    }
  };

  const QUICK_ACCESS_ITEMS = [
    { id: 'udyam', label: 'Udyam / MSME', icon: Building, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/80 border border-blue-200/50 dark:border-blue-800' },
    { id: 'gstn', label: 'GSTN', icon: FileText, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/80 border border-blue-200/50 dark:border-blue-800' },
    { id: 'incometax', label: 'Income Tax', icon: CreditCard, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/80 border border-blue-200/50 dark:border-blue-800' },
    { id: 'digilocker', label: 'DigiLocker', icon: Cloud, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/80 border border-purple-200/50 dark:border-purple-800' },
    { id: 'epfo', label: 'EPFO / ESIC', icon: Users, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/80 border border-blue-200/50 dark:border-blue-800' },
    { id: 'more', label: 'More', icon: MoreHorizontal, color: 'text-slate-600 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
      {/* Title & Description */}
      <div className="mb-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Verify a Bidder
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Enter bidder details (PAN / GSTIN / GeM Bid ID / Company Name) to fetch and verify compliance.
        </p>
      </div>

      {/* Input Search Form */}
      <form onSubmit={handleSearchSubmit} className="relative mb-5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder="Enter PAN / GSTIN / GeM Bid ID / Company Name"
              className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl flex items-center gap-2 shadow-xs transition flex-shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>Verify</span>
          </button>
        </div>

        {/* Live Search Auto-complete Suggestions Dropdown */}
        {isFocused && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl z-30 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
            <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Matching Bidders ({suggestions.length})
            </div>
            {suggestions.map((bidder) => (
              <div
                key={bidder.id}
                onMouseDown={() => onSelectBidder(bidder)}
                className="p-3 hover:bg-blue-50/60 dark:hover:bg-slate-800 transition cursor-pointer flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{bidder.name}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>PAN: <strong className="font-mono text-slate-700 dark:text-slate-300">{bidder.pan}</strong></span>
                    <span>•</span>
                    <span>Bid ID: <strong className="font-mono text-slate-700 dark:text-slate-300">{bidder.bidId}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      bidder.status === 'Compliant'
                        ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        : bidder.status === 'Partial'
                        ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                        : 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                    }`}
                  >
                    {bidder.complianceScore}% {bidder.status}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </form>

      {/* Quick Access Section */}
      <div>
        <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-3">Quick Access</div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-3">
          {QUICK_ACCESS_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (onShowQuickAccessDemo) onShowQuickAccessDemo(item.label);
                  else if (onShowQuickAccess) onShowQuickAccess(item.label);
                }}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/30 dark:hover:bg-slate-800/60 transition group text-center"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-2 group-hover:scale-105 transition`}
                >
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 leading-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
