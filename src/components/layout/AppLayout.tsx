import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../dashboard/Sidebar';
import { Header } from '../dashboard/Header';
import { Footer } from '../dashboard/Footer';
import { QuickAccessModal } from '../dashboard/QuickAccessModal';

export const AppLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [quickAccessPortal, setQuickAccessPortal] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#f4f6fb] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased flex transition-colors duration-150">
      {/* 1. Dark Navy Sidebar Navigation */}
      <Sidebar
        isOpenOnMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header with title, demo mode tag, notifications, profile */}
        <Header onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)} />

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet context={{ openQuickAccess: (portal: string) => setQuickAccessPortal(portal) }} />
        </main>

        {/* 3. Footer */}
        <Footer />
      </div>

      {/* Quick Access Portal Integration Modal */}
      <QuickAccessModal
        portalName={quickAccessPortal}
        onClose={() => setQuickAccessPortal(null)}
      />
    </div>
  );
};
