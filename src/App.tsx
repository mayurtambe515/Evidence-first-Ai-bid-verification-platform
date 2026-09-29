import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardView } from './components/dashboard/DashboardView';
import { BidsTendersPage } from './components/pages/BidsTendersPage';
import { CreateTenderPage } from './components/pages/CreateTenderPage';
import { TenderDetailsPage } from './components/pages/TenderDetailsPage';
import { VerificationPage } from './components/pages/VerificationPage';
import { BidderLayout } from './components/pages/bidder/BidderLayout';
import { BidderOverviewTab } from './components/pages/bidder/BidderOverviewTab';
import { BidderDocumentsTab } from './components/pages/bidder/BidderDocumentsTab';
import { BidderPortalVerificationTab } from './components/pages/bidder/BidderPortalVerificationTab';
import { BidderRiskTab } from './components/pages/bidder/BidderRiskTab';
import { BidderFinalDecisionTab } from './components/pages/bidder/BidderFinalDecisionTab';
import { ComplianceReportsPage } from './components/pages/ComplianceReportsPage';
import { ReportDetailsPage } from './components/pages/ReportDetailsPage';
import { AuditTrailPage } from './components/pages/AuditTrailPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { LoginPage } from './components/pages/LoginPage';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Standalone User & Officer Login Page */}
          <Route path="/login" element={<LoginPage />} />

          <Route element={<AppLayout />}>
            {/* Dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardView />} />

            {/* Tenders & Bids */}
            <Route path="/bids" element={<BidsTendersPage />} />
            <Route path="/bids/create" element={<CreateTenderPage />} />
            <Route path="/bids/:id" element={<TenderDetailsPage />} />

            {/* Verification Queue & Workspace */}
            <Route path="/verification" element={<VerificationPage />} />

            {/* Bidder Detailed Scrutiny with 5 Sub-Tabs */}
            <Route path="/verification/bidder/:id" element={<BidderLayout />}>
              <Route index element={<BidderOverviewTab />} />
              <Route path="documents" element={<BidderDocumentsTab />} />
              <Route path="portal-verification" element={<BidderPortalVerificationTab />} />
              <Route path="risk" element={<BidderRiskTab />} />
              <Route path="final-decision" element={<BidderFinalDecisionTab />} />
            </Route>

            {/* Compliance Reports & Statutory Dossiers */}
            <Route path="/reports" element={<ComplianceReportsPage />} />
            <Route path="/reports/:id" element={<ReportDetailsPage />} />

            {/* Immutable Audit Trail */}
            <Route path="/audit-trail" element={<AuditTrailPage />} />

            {/* Settings & Compliance Rules */}
            <Route path="/settings" element={<SettingsPage />} />

            {/* Fallback Catch-All */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
