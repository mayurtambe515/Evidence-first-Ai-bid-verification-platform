import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, AlertCircle, CheckCircle2 } from 'lucide-react';
import { KpiCards } from './KpiCards';
import { VerifyBidderCard } from './VerifyBidderCard';
import { AiEngineCard } from './AiEngineCard';
import { RecentBiddersTable } from './RecentBiddersTable';
import { ComplianceOverviewChart } from './ComplianceOverviewChart';
import { BidderComplianceDetailsCard } from './BidderComplianceDetailsCard';
import { AiRecommendationCard } from './AiRecommendationCard';
import { RECENT_BIDDERS, RecentBidder } from '../../data/gemDashboardData';
import { useApp } from '../../context/AppContext';

interface DashboardViewProps {
  onOpenDetailedReport?: (bidder: RecentBidder) => void;
  onOpenDecisionModal?: (bidder: RecentBidder) => void;
  onShowQuickAccess?: (portalName: string) => void;
  onNavigateTab?: (tab: string) => void;
  onSelectBidderForVerification?: (bidder: RecentBidder) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenDetailedReport,
  onOpenDecisionModal,
  onShowQuickAccess,
  onNavigateTab,
  onSelectBidderForVerification,
}) => {
  const navigate = useNavigate();
  const {
    bidders: appBidders,
    selectedBidder: appSelectedBidder,
    setSelectedBidder: setAppSelectedBidder,
    dbConnected,
    dbError,
    dbStatus,
  } = useApp();

  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('ALL');

  const currentBidders = appBidders && appBidders.length > 0 ? appBidders : RECENT_BIDDERS;
  const filteredBidders =
    activeStatusFilter === 'ALL'
      ? currentBidders
      : currentBidders.filter((b) => b.status === activeStatusFilter);

  const selectedBidder = appSelectedBidder || currentBidders[0];

  // Handle KPI click filtering
  const handleFilterStatus = (status: string) => {
    setActiveStatusFilter(status);
  };

  // Handle Verify search from the Verify Bidder card
  const handleVerifyQuery = (query: string) => {
    const found = currentBidders.find(
      (b) =>
        b.name.toLowerCase().includes(query.toLowerCase()) ||
        b.pan.toLowerCase().includes(query.toLowerCase()) ||
        b.gstin.toLowerCase().includes(query.toLowerCase()) ||
        b.bidId.toLowerCase().includes(query.toLowerCase())
    );

    if (found) {
      setAppSelectedBidder(found);
      if (onSelectBidderForVerification) {
        onSelectBidderForVerification(found);
      } else {
        navigate(`/verification/bidder/${found.id}`);
      }
    } else {
      navigate(`/verification?q=${encodeURIComponent(query)}`);
    }
  };

  const handleDetailedReport = (b: RecentBidder) => {
    if (onOpenDetailedReport) {
      onOpenDetailedReport(b);
    } else {
      navigate(`/reports/${b.id}`);
    }
  };

  const handleDecisionModal = (b: RecentBidder) => {
    if (onOpenDecisionModal) {
      onOpenDecisionModal(b);
    } else {
      navigate(`/verification/bidder/${b.id}/final-decision`);
    }
  };

  const handleNav = (tab: string) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
    } else {
      navigate(`/${tab}`);
    }
  };

  const handleSelectBidder = (b: RecentBidder) => {
    setAppSelectedBidder(b);
    if (onSelectBidderForVerification) {
      onSelectBidderForVerification(b);
    }
  };

  return (
    <div className="space-y-6">
      {/* DATABASE CONNECTION STATUS NOTIFICATION */}
      {dbError && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 rounded-2xl flex items-start gap-3 text-xs text-rose-900 dark:text-rose-200 shadow-2xs">
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-sm text-rose-800 dark:text-rose-300">
              PostgreSQL Database Connection Error
            </div>
            <p className="font-mono text-xs">{dbError}</p>
            <p className="text-[11px] text-rose-700 dark:text-rose-400">
              Please verify that <code className="bg-rose-100 dark:bg-rose-900 px-1 py-0.5 rounded">DATABASE_URL</code> is reachable and contains valid PostgreSQL credentials.
            </p>
          </div>
        </div>
      )}

      {dbConnected && (
        <div className="flex items-center justify-between px-4 py-2 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span className="font-semibold">
              PostgreSQL Database Connected: <strong>{dbStatus?.tablesCount ?? 9} tables active</strong> in Neon schema. Demo bidder <em>Shree Tech Solutions Pvt. Ltd.</em> live.
            </span>
          </div>
          <span className="hidden sm:inline-block font-mono text-[11px] text-emerald-700 dark:text-emerald-400">
            Hash Chained Audit Trail Active
          </span>
        </div>
      )}

      {/* SECTION 1: KPI CARDS */}
      <section aria-label="Key Performance Indicators">
        <KpiCards onFilterStatus={handleFilterStatus} />
      </section>

      {/* Filter status banner if active */}
      {activeStatusFilter !== 'ALL' && (
        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-900 dark:text-blue-200">
          <span>
            Filtering bidders by: <strong>{activeStatusFilter}</strong> ({filteredBidders.length} found)
          </span>
          <button
            type="button"
            onClick={() => handleFilterStatus('ALL')}
            className="font-bold underline hover:text-blue-700 dark:hover:text-blue-300"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* SECTION 2 & 3: VERIFY A BIDDER & AI VERIFICATION ENGINE */}
      <section
        aria-label="Bidder Verification & AI Engine"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
      >
        <div className="lg:col-span-7 xl:col-span-8">
          <VerifyBidderCard
            onVerifyQuery={handleVerifyQuery}
            onSelectBidder={handleSelectBidder}
            onShowQuickAccess={onShowQuickAccess || ((portal) => alert(`Quick access to ${portal}`))}
            bidders={currentBidders}
          />
        </div>

        <div className="lg:col-span-5 xl:col-span-4">
          <AiEngineCard />
        </div>
      </section>

      {/* SECTION 4, 5 & 6: RECENT BIDDERS TABLE & COMPLIANCE OVERVIEW */}
      <section
        aria-label="Recent Bidders and Compliance Overview"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
      >
        <div className="lg:col-span-7 xl:col-span-7">
          <RecentBiddersTable
            bidders={filteredBidders}
            selectedBidderId={selectedBidder.id}
            onSelectBidder={handleSelectBidder}
            onViewAll={() => handleNav('bids')}
          />
        </div>

        <div className="lg:col-span-5 xl:col-span-5">
          <ComplianceOverviewChart onSelectCategory={handleFilterStatus} />
        </div>
      </section>

      {/* SECTION 7 & 8: COMPLIANCE DETAILS & AI RECOMMENDATION */}
      <section
        aria-label="Sample Bidder Details and AI Recommendation"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
      >
        <div className="lg:col-span-7 xl:col-span-8">
          <BidderComplianceDetailsCard
            bidder={selectedBidder}
            onViewFullReport={() => handleDetailedReport(selectedBidder)}
            onNavigateTab={handleNav}
          />
        </div>

        <div className="lg:col-span-5 xl:col-span-4">
          <AiRecommendationCard
            onViewDetailedReport={() => handleDetailedReport(selectedBidder)}
            onOpenDecisionModal={() => handleDecisionModal(selectedBidder)}
          />
        </div>
      </section>
    </div>
  );
};
