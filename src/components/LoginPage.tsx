import React, { useState } from 'react';
import { AuthUser, UserRole } from '../types';
import { DEMO_USERS } from '../data/seedData';
import {
  ShieldCheck,
  Lock,
  User,
  CheckCircle2,
  AlertCircle,
  Building2,
  KeyRound,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [userId, setUserId] = useState('bidder@apextech.in');
  const [password, setPassword] = useState('demo123');
  const [role, setRole] = useState<UserRole>('BIDDER');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleQuickLogin = (demoUser: AuthUser, demoPass = 'demo123') => {
    setUserId(demoUser.email);
    setPassword(demoPass);
    setRole(demoUser.role);
    setErrorMessage('');
    onLogin(demoUser);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanId = userId.trim().toLowerCase();
    const cleanPass = password.trim();

    // Match credentials
    if (cleanPass !== 'demo123') {
      setErrorMessage('Invalid credentials. For this demo, use password: demo123');
      return;
    }

    let matchedUser = DEMO_USERS.find((u) => {
      if (role === 'BIDDER' && (cleanId.includes('bidder') || cleanId.includes('apex') || u.role === 'BIDDER')) return true;
      if (role === 'OFFICER' && (cleanId.includes('officer') || u.role === 'OFFICER')) return true;
      if (role === 'AUDITOR' && (cleanId.includes('auditor') || u.role === 'AUDITOR')) return true;
      return false;
    });

    if (!matchedUser) {
      matchedUser = DEMO_USERS.find((u) => u.role === role) || DEMO_USERS[0];
    }

    onLogin(matchedUser);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Top Emblem & Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-b from-blue-900/60 to-slate-900 border border-blue-500/40 shadow-xl shadow-blue-950/50 mb-3.5">
            <ShieldCheck className="w-9 h-9 text-teal-400" />
          </div>

          <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Government of India • Ministry of Commerce & Industry
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mt-1">
            Government e-Marketplace (GeM)
          </h1>
          <p className="text-xs font-medium text-teal-400 tracking-wide mt-0.5">
            Evidence-First AI Bid Verification Portal
          </p>
        </div>

        {/* Portal Login Card */}
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-md rounded-2xl p-6 sm:p-7 shadow-2xl shadow-slate-950/80">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Select Your Role & Sign In
              </h2>
              <p className="text-[11px] text-slate-400">
                Bidder Application & Procurement Decision Flow
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              SECURE
            </span>
          </div>

          {errorMessage && (
            <div className="mb-4 p-2.5 rounded-lg bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Role Selector */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Portal Access Role
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setRole('BIDDER');
                    setUserId('bidder@apextech.in');
                  }}
                  className={`py-2.5 px-3 rounded-xl text-left transition border flex flex-col justify-between ${
                    role === 'BIDDER'
                      ? 'bg-gradient-to-br from-blue-950/90 to-slate-900 border-blue-500 text-white ring-1 ring-blue-500 shadow-md shadow-blue-950/50'
                      : 'bg-slate-850/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-300">1. Bidder / Company</span>
                    {role === 'BIDDER' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 leading-snug">
                    Apply, upload certificates & view AI score
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole('OFFICER');
                    setUserId('officer1@gem.gov.in');
                  }}
                  className={`py-2.5 px-3 rounded-xl text-left transition border flex flex-col justify-between ${
                    role === 'OFFICER'
                      ? 'bg-gradient-to-br from-teal-950/90 to-slate-900 border-teal-500 text-white ring-1 ring-teal-500 shadow-md shadow-teal-950/50'
                      : 'bg-slate-850/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-300">2. Procurement Officer</span>
                    {role === 'OFFICER' && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 leading-snug">
                    Review AI evidence & make final decision
                  </div>
                </button>
              </div>
            </div>

            {/* Email / ID */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                {role === 'BIDDER' ? 'Company Signatory Email' : 'Official GeM Officer Email'}
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder={role === 'BIDDER' ? 'bidder@apextech.in' : 'officer1@gem.gov.in'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white font-mono text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <span className="text-[10px] text-slate-400">Demo PIN: demo123</span>
              </div>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-9 py-2 text-white font-mono text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 transition active:scale-[0.99]"
            >
              <span>{role === 'BIDDER' ? 'Enter Bidder Portal' : 'Enter Officer Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-Click Demo Profiles for Judges */}
          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 flex items-center justify-between">
              <span>Instant 1-Click Demo Sign-In</span>
              <span className="text-[9px] text-teal-400 font-mono">FOR JUDGES</span>
            </div>

            <div className="space-y-1.5">
              {DEMO_USERS.filter((u) => u.role === 'BIDDER' || u.role === 'OFFICER').map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleQuickLogin(user)}
                  className="w-full text-left p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs ${
                        user.role === 'BIDDER'
                          ? 'bg-blue-900/60 text-blue-300 border border-blue-700/50'
                          : 'bg-teal-900/60 text-teal-300 border border-teal-700/50'
                      }`}
                    >
                      {user.role === 'BIDDER' ? '🏢' : '⚖️'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-blue-300 transition flex items-center gap-1.5">
                        <span>{user.name}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                          {user.role}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {user.designation} • {user.department}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-4 text-[11px] text-slate-400">
          GeM AI Verification Portal • Automated Compliance Engine
        </div>
      </div>
    </div>
  );
};
