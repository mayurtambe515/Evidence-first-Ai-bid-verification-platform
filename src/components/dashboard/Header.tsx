import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  Menu,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Info,
  LogOut,
  User,
  Building2,
  ExternalLink,
  UserCheck,
  ArrowRightLeft,
  LogIn,
  Sun,
  Moon,
} from 'lucide-react';
import { OFFICER_PROFILE } from '../../data/gemDashboardData';
import { useApp } from '../../context/AppContext';
import { DemoModeBadge } from '../common/DemoModeBadge';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    currentUser,
    logout,
    switchRole,
    theme,
    toggleTheme,
    isDarkMode,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine dynamic title based on path
  let title = 'Good Morning, Procurement Officer';
  let subtitle = "Here's the latest compliance overview for GeM bids.";

  if (location.pathname.startsWith('/bids/create')) {
    title = 'Create Tender & Set Requirements';
    subtitle = '5-step procurement wizard with AI requirement extraction.';
  } else if (location.pathname.startsWith('/bids/')) {
    title = 'Tender Evaluation & Participating Bidders';
    subtitle = 'Comprehensive review of tender requirements and submitted bids.';
  } else if (location.pathname === '/bids') {
    title = 'Bids / Tender Management';
    subtitle = 'Active tenders, procurement schedules, and bidder participations.';
  } else if (location.pathname.includes('/verification/bidder/')) {
    title = 'Bidder Compliance Scrutiny';
    subtitle = 'Statutory document evaluation, portal cross-checks, and officer determination.';
  } else if (location.pathname === '/verification') {
    title = 'Verify a Bidder';
    subtitle = 'Real-time multi-portal registry cross-checks and AI document scrutiny.';
  } else if (location.pathname.startsWith('/reports/')) {
    title = 'Bidder Compliance Dossier';
    subtitle = 'Audited compliance certification and officer determination report.';
  } else if (location.pathname === '/reports') {
    title = 'Compliance Reports';
    subtitle = 'Official evaluation dossiers and comparative bidder matrices.';
  } else if (location.pathname === '/audit-trail') {
    title = 'Verification & Decision Audit Trail';
    subtitle = 'Immutable chronological record under GFR 144 compliance regulations.';
  } else if (location.pathname === '/settings') {
    title = 'Platform & Portal Configuration';
    subtitle = 'Government API gateway parameters and rule engine controls.';
  }

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 sticky top-0 z-30 shadow-2xs transition-colors">
      <div className="px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Title & Subtitle + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                {title}
              </h1>
            </div>
            <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 font-normal mt-0.5 hidden sm:block">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right: Demo Mode Badge, Theme Toggle, Notifications & Officer Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Demo Mode Indicator & Role Switch Quick Button */}
          <div className="flex items-center gap-2">
            <DemoModeBadge />
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 transition"
              title="Open User & Officer Login Page"
            >
              <LogIn className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Login / Switch</span>
            </button>
          </div>

          {/* Quick Header Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100/70 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 transition flex items-center gap-1.5 text-xs font-semibold focus:outline-none"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline text-[11px] font-bold text-slate-200">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-600" />
                <span className="hidden md:inline text-[11px] font-bold text-slate-700">Dark</span>
              </>
            )}
          </button>

          {/* Notification Bell Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setIsNotifOpen((prev) => !prev)}
              className="relative p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition focus:outline-none"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 pb-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200/50 dark:border-blue-800">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={clearAllNotifications}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                      No notifications at this time.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer flex items-start gap-3 ${
                          notif.unread ? 'bg-blue-50/40 dark:bg-blue-950/30' : ''
                        }`}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          setIsNotifOpen(false);
                          if (notif.route) {
                            navigate(notif.route);
                          }
                        }}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          {notif.type === 'warning' && (
                            <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </div>
                          )}
                          {notif.type === 'success' && (
                            <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                          )}
                          {notif.type === 'info' && (
                            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                              <Info className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                              {notif.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                              {notif.time}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed line-clamp-2">
                            {notif.description}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="px-4 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      navigate('/audit-trail');
                      setIsNotifOpen(false);
                    }}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    View All Activity Logs →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User / Officer Avatar & Details */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="flex items-center gap-2.5 p-1 sm:px-2.5 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition focus:outline-none"
              aria-label="User Profile"
            >
              <div
                className={`w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0 ${
                  currentUser.role === 'OFFICER'
                    ? 'bg-blue-700 ring-2 ring-blue-100 dark:ring-blue-900'
                    : currentUser.role === 'BIDDER'
                    ? 'bg-emerald-700 ring-2 ring-emerald-100 dark:ring-emerald-900'
                    : 'bg-purple-700 ring-2 ring-purple-100 dark:ring-purple-900'
                }`}
              >
                {currentUser.avatarInitials || (currentUser.role === 'OFFICER' ? 'PO' : 'US')}
              </div>

              <div className="text-left hidden md:block leading-tight">
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <span className="truncate max-w-[140px]">{currentUser.name}</span>
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase tracking-wider ${
                      currentUser.role === 'OFFICER'
                        ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300'
                        : currentUser.role === 'BIDDER'
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                        : 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300'
                    }`}
                  >
                    {currentUser.role}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[170px]">
                  {currentUser.organization || currentUser.department}
                </div>
              </div>

              <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            </button>

            {/* Profile Dropdown Panel */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm ${
                        currentUser.role === 'OFFICER'
                          ? 'bg-blue-700'
                          : currentUser.role === 'BIDDER'
                          ? 'bg-emerald-700'
                          : 'bg-purple-700'
                      }`}
                    >
                      {currentUser.avatarInitials || (currentUser.role === 'OFFICER' ? 'PO' : 'US')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {currentUser.email}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                    <div>
                      <span className="text-slate-400">Role: </span>
                      <strong className="text-slate-800 dark:text-slate-200">{currentUser.roleLabel}</strong>
                    </div>
                    {currentUser.idNumber && (
                      <div>
                        <span className="text-slate-400">Identifier: </span>
                        <strong className="font-mono text-slate-800 dark:text-slate-200">{currentUser.idNumber}</strong>
                      </div>
                    )}
                  </div>
                </div>

                {/* Role Switcher Section */}
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5 flex items-center gap-1">
                    <ArrowRightLeft className="w-3 h-3 text-slate-400" />
                    <span>Quick Switch Active Persona:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        switchRole('OFFICER');
                        setIsProfileOpen(false);
                      }}
                      className={`px-2 py-1.5 rounded-lg text-xs font-semibold text-left transition flex items-center gap-1.5 ${
                        currentUser.role === 'OFFICER'
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">Procurement Officer</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        switchRole('BIDDER');
                        setIsProfileOpen(false);
                      }}
                      className={`px-2 py-1.5 rounded-lg text-xs font-semibold text-left transition flex items-center gap-1.5 ${
                        currentUser.role === 'BIDDER'
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">Bidder (Seller)</span>
                    </button>
                  </div>
                </div>

                <div className="p-2 space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      navigate('/settings');
                      setIsProfileOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2.5"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Profile & Security Credentials</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      navigate('/login');
                      setIsProfileOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg flex items-center gap-2.5"
                  >
                    <LogIn className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Open Full Login Portal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                      navigate('/login');
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg flex items-center gap-2.5"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>

                <div className="px-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 text-[10px] text-slate-600 dark:text-slate-400">
                    <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <Shield className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>Decision Support Engine Active</span>
                    </div>
                    <p className="mt-0.5 text-slate-500 dark:text-slate-400">
                      Officer holds sole statutory authority for bid qualification.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
