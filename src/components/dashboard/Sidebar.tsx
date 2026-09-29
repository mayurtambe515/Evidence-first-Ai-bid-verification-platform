import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  ShieldCheck,
  FileSpreadsheet,
  History,
  Settings,
  X,
  LogIn,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  matchPrefix?: string;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard', matchPrefix: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/bids', matchPrefix: '/bids', label: 'Bids / Tender', icon: FileText, badge: '5' },
  { path: '/verification', matchPrefix: '/verification', label: 'Verification', icon: ShieldCheck },
  { path: '/reports', matchPrefix: '/reports', label: 'Compliance Reports', icon: FileSpreadsheet },
  { path: '/audit-trail', matchPrefix: '/audit-trail', label: 'Audit Trail', icon: History },
  { path: '/settings', matchPrefix: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpenOnMobile = false,
  onCloseMobile,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useApp();

  const handleNavigate = (path: string) => {
    navigate(path);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpenOnMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0c1938] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-slate-800/80 ${
          isOpenOnMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        id="gem-sidebar-navigation"
      >
        {/* Top Header / Logo Section */}
        <div>
          <div className="p-5 pb-6 border-b border-slate-800/60 flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer select-none"
              onClick={() => handleNavigate('/dashboard')}
            >
              {/* GeM Multi-Color Five-Point Star Emblem */}
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
                <svg
                  viewBox="0 0 100 100"
                  className="w-9 h-9 drop-shadow-md"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M50 12 L60 38 L50 48 L40 38 Z" fill="url(#gem-grad-top)" />
                  <path d="M86 38 L68 56 L55 48 L65 35 Z" fill="url(#gem-grad-right)" />
                  <path d="M72 82 L50 64 L52 50 L66 54 Z" fill="url(#gem-grad-bottom-r)" />
                  <path d="M28 82 L34 54 L48 50 L50 64 Z" fill="url(#gem-grad-bottom-l)" />
                  <path d="M14 38 L35 35 L45 48 L32 56 Z" fill="url(#gem-grad-left)" />

                  <defs>
                    <linearGradient id="gem-grad-top" x1="50" y1="12" x2="50" y2="48" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#38bdf8" />
                      <stop offset="1" stopColor="#0284c7" />
                    </linearGradient>
                    <linearGradient id="gem-grad-right" x1="86" y1="38" x2="55" y2="48" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#818cf8" />
                      <stop offset="1" stopColor="#4f46e5" />
                    </linearGradient>
                    <linearGradient id="gem-grad-bottom-r" x1="72" y1="82" x2="52" y2="50" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#f43f5e" />
                      <stop offset="1" stopColor="#e11d48" />
                    </linearGradient>
                    <linearGradient id="gem-grad-bottom-l" x1="28" y1="82" x2="48" y2="50" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#fbbf24" />
                      <stop offset="1" stopColor="#f59e0b" />
                    </linearGradient>
                    <linearGradient id="gem-grad-left" x1="14" y1="38" x2="45" y2="48" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#34d399" />
                      <stop offset="1" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div>
                <div className="flex items-baseline gap-1.5 leading-none">
                  <span className="text-xl font-black tracking-tight text-white">GeM</span>
                  <span className="text-sm font-semibold text-slate-200">AI Compliance</span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium tracking-tight mt-1">
                  Smart Verification. Faster Procurement.
                </div>
              </div>
            </div>

            {/* Mobile Close Button */}
            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 mt-2" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/dashboard'
                  ? location.pathname === '/' || location.pathname === '/dashboard'
                  : location.pathname.startsWith(item.matchPrefix || item.path);

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleNavigate(item.path)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-900/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-blue-800 text-blue-100'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Active Persona Card */}
        <div className="p-3 m-3 mb-1 bg-slate-900/90 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-2.5 mb-2">
            <div
              className={`w-7 h-7 rounded-lg text-white font-bold text-xs flex items-center justify-center flex-shrink-0 ${
                currentUser.role === 'OFFICER'
                  ? 'bg-blue-600'
                  : currentUser.role === 'BIDDER'
                  ? 'bg-emerald-600'
                  : 'bg-purple-600'
              }`}
            >
              {currentUser.avatarInitials || (currentUser.role === 'OFFICER' ? 'PO' : 'US')}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400 truncate">{currentUser.roleLabel}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleNavigate('/login')}
            className="w-full py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-[11px] font-semibold transition flex items-center justify-center gap-1.5"
          >
            <LogIn className="w-3 h-3 text-blue-400" />
            <span>Switch User / Login</span>
          </button>
        </div>

        {/* Bottom Platform Feature Card */}
        <div className="p-3.5 m-3 mt-1 bg-[#081229] border border-slate-800/80 rounded-2xl text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-blue-950/90 border border-blue-600/40 flex items-center justify-center mb-3 shadow-lg shadow-blue-950">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-xs font-bold text-white leading-snug">
            AI-Powered Bid Compliance Verification Platform
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
            Integrating Government Portals and Databases for a transparent, compliant and efficient procurement ecosystem.
          </p>
        </div>
      </aside>
    </>
  );
};
