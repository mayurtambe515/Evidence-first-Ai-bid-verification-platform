import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  UserCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  FileSpreadsheet,
  AlertCircle,
  ExternalLink,
  Cpu,
  Fingerprint,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEMO_USERS } from '../../data/authUsers';
import { AuthUser } from '../../types';
import { apiService } from '../../services/api';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useApp();

  const [activeTab, setActiveTab] = useState<'OFFICER' | 'BIDDER'>('OFFICER');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Officer Form State
  const [officerEmail, setOfficerEmail] = useState('procurement.officer@gem.gov.in');
  const [officerPassword, setOfficerPassword] = useState('••••••••••••');
  const [officerDepartment, setOfficerDepartment] = useState('Ministry of Commerce & Industry');
  const [officerOtp, setOfficerOtp] = useState('984122');

  // Bidder Form State
  const [bidderEmail, setBidderEmail] = useState('v.malhotra@shreetech.com');
  const [bidderPassword, setBidderPassword] = useState('••••••••••••');
  const [bidderGstin, setBidderGstin] = useState('27ABCDE1234F1Z5');
  const [bidderCaptchaInput, setBidderCaptchaInput] = useState('7G8K2');
  const [captchaCode, setCaptchaCode] = useState('7G8K2');

  const refreshCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setBidderCaptchaInput(code);
  };

  const handleLogin = async (user: AuthUser) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await apiService.login(user.email, 'password123');
      if (res && res.token) {
        localStorage.setItem('gem_auth_token', res.token);
      }
    } catch (e) {
      console.warn('Backend login notice:', e);
    }

    login(user);
    setIsLoading(false);
    navigate('/dashboard');
  };

  const handleSubmitOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerEmail.trim()) {
      setErrorMessage('Please enter your government email or Officer ID.');
      return;
    }
    handleLogin(DEMO_USERS.officer);
  };

  const handleSubmitBidder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidderEmail.trim()) {
      setErrorMessage('Please enter your registered bidder email or PAN/GSTIN.');
      return;
    }
    handleLogin(DEMO_USERS.bidder);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0c1938] to-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Tricolor Strip & National Gov Portal Bar */}
      <div className="w-full">
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600" />
        <div className="bg-slate-950/80 border-b border-slate-800/80 px-4 sm:px-8 py-2.5 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-slate-300">
              Government of India • Ministry of Commerce & Industry
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-400">
              Government e-Marketplace (GeM SPV)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded border border-blue-700/50 font-mono text-[10px]">
              SHA-256 SECURED
            </span>
            <span className="text-slate-400">English (India)</span>
          </div>
        </div>
      </div>

      {/* Main Login Card Section */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl shadow-blue-950/40 border border-slate-200/80 text-slate-900 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Brand & Mission Column (Desktop) */}
          <div className="lg:col-span-5 bg-[#0c1938] p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
            {/* Background Decorative Rings */}
            <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full border border-blue-500/10 pointer-events-none" />
            <div className="absolute -right-32 -bottom-32 w-88 h-88 rounded-full border border-blue-500/10 pointer-events-none" />

            <div>
              {/* GeM Emblem & Logo */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 p-1.5">
                  <svg viewBox="0 0 100 100" className="w-8 h-8" fill="none">
                    <path d="M50 12 L60 38 L50 48 L40 38 Z" fill="#38bdf8" />
                    <path d="M86 38 L68 56 L55 48 L65 35 Z" fill="#818cf8" />
                    <path d="M72 82 L50 64 L52 50 L66 54 Z" fill="#f43f5e" />
                    <path d="M28 82 L34 54 L48 50 L50 64 Z" fill="#fbbf24" />
                    <path d="M14 38 L35 35 L45 48 L32 56 Z" fill="#34d399" />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                    <span>GeM</span>
                    <span className="text-blue-400 font-semibold text-base">AI Compliance</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium tracking-tight">
                    Smart Verification. Faster Procurement.
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-[11px] font-semibold mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Deterministic Evidence & AI Verification</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
                Single Sign-On Authentication Gateway
              </h2>

              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Dedicated decision-support system for Tender Inviting Authorities (TIA) and transparent compliance verification for participating bidders.
              </p>

              {/* Statutory Principles List */}
              <div className="mt-6 space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Officer Holds Sole Authority:</strong> AI assists scrutiny; legal qualification remains strictly human-governed.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Live Portal Cross-Checks:</strong> Automated lookup across GSTN, Udyam, Income Tax, and debarment registers.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Immutable Audit Chain:</strong> Every action sealed with SHA-256 cryptographic signatures.
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Demo Role Switcher at Bottom of Left Panel */}
            <div className="mt-8 pt-6 border-t border-slate-800/80">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-3 flex items-center gap-1.5">
                <Fingerprint className="w-3.5 h-3.5 text-blue-400" />
                <span>One-Click Demo Personas:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2">
                {/* Officer Quick Login */}
                <button
                  type="button"
                  onClick={() => handleLogin(DEMO_USERS.officer)}
                  className="w-full p-2.5 rounded-xl bg-slate-800/80 hover:bg-blue-900/60 border border-slate-700/80 hover:border-blue-500/60 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                      PO
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate group-hover:text-blue-200">
                        {DEMO_USERS.officer.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        Procurement Officer (Full Evaluation)
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition" />
                </button>

                {/* Bidder Quick Login */}
                <button
                  type="button"
                  onClick={() => handleLogin(DEMO_USERS.bidder)}
                  className="w-full p-2.5 rounded-xl bg-slate-800/80 hover:bg-emerald-950/60 border border-slate-700/80 hover:border-emerald-500/60 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                      VM
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate group-hover:text-emerald-200">
                        {DEMO_USERS.bidder.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        Registered Bidder (Shree Tech Solutions)
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition" />
                </button>

                {/* Auditor Quick Login */}
                <button
                  type="button"
                  onClick={() => handleLogin(DEMO_USERS.auditor)}
                  className="w-full p-2.5 rounded-xl bg-slate-800/80 hover:bg-purple-950/60 border border-slate-700/80 hover:border-purple-500/60 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                      AS
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate group-hover:text-purple-200">
                        {DEMO_USERS.auditor.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        CAG Statutory Auditor (Audit Trail)
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Login Forms Column */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Role Toggle Tabs */}
              <div className="flex items-center p-1 bg-slate-100 rounded-2xl mb-6 border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('OFFICER');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'OFFICER'
                      ? 'bg-white text-blue-900 shadow-sm shadow-slate-300 font-extrabold border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className={`w-4 h-4 ${activeTab === 'OFFICER' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>Procurement Officer Login</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('BIDDER');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'BIDDER'
                      ? 'bg-white text-emerald-900 shadow-sm shadow-slate-300 font-extrabold border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserCheck className={`w-4 h-4 ${activeTab === 'BIDDER' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>User / Bidder Login</span>
                </button>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* OFFICER LOGIN FORM */}
              {activeTab === 'OFFICER' && (
                <form onSubmit={handleSubmitOfficer} className="space-y-4">
                  <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center gap-3 text-xs text-blue-900">
                    <ShieldCheck className="w-5 h-5 text-blue-700 flex-shrink-0" />
                    <div>
                      <div className="font-bold">Authorized Tender Inviting Authority (TIA) Gateway</div>
                      <div className="text-[11px] text-blue-700/90 mt-0.5">
                        Access official evaluation cockpit, deterministic scoring, and GTC Clause 8.4 decisions.
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Government Email / GeM Officer ID <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={officerEmail}
                        onChange={(e) => setOfficerEmail(e.target.value)}
                        placeholder="e.g. procurement.officer@gem.gov.in"
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Ministry / Department <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={officerDepartment}
                        onChange={(e) => setOfficerDepartment(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Password / Parichay Token <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          value={officerPassword}
                          onChange={(e) => setOfficerPassword(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        2FA Government Security Token (NIC-OTP)
                      </label>
                      <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ✓ Auto-Generated for Demo
                      </span>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={officerOtp}
                        onChange={(e) => setOfficerOtp(e.target.value)}
                        maxLength={6}
                        placeholder="6-digit OTP"
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs font-mono tracking-widest bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Verifying Officer Credentials...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Sign In as Procurement Officer</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* BIDDER / VENDOR LOGIN FORM */}
              {activeTab === 'BIDDER' && (
                <form onSubmit={handleSubmitBidder} className="space-y-4">
                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center gap-3 text-xs text-emerald-950">
                    <Building2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                    <div>
                      <div className="font-bold">Registered Seller / Supplier Procurement Portal</div>
                      <div className="text-[11px] text-emerald-800/90 mt-0.5">
                        Track bid compliance, pre-test document validity, and review statutory scrutiny status.
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Authorized Bidder Email / PAN / GeM Seller ID <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={bidderEmail}
                        onChange={(e) => setBidderEmail(e.target.value)}
                        placeholder="e.g. v.malhotra@shreetech.com"
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-800 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Enterprise GSTIN <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={bidderGstin}
                        onChange={(e) => setBidderGstin(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs font-mono uppercase bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-800 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Password / DSC Token <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          value={bidderPassword}
                          onChange={(e) => setBidderPassword(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-800 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Security Captcha */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Security Verification Captcha
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-100 border border-slate-300 px-4 py-2 rounded-xl font-mono text-sm tracking-widest font-black text-slate-700 select-none line-through decoration-slate-400">
                        {captchaCode}
                      </div>
                      <button
                        type="button"
                        onClick={refreshCaptcha}
                        className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                        title="Refresh Captcha"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <input
                        type="text"
                        value={bidderCaptchaInput}
                        onChange={(e) => setBidderCaptchaInput(e.target.value)}
                        placeholder="Enter code"
                        className="flex-1 px-3.5 py-2.5 text-xs font-mono uppercase bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Verifying Seller Account...</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4" />
                          <span>Sign In as Registered Bidder</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Direct Demo Bypass */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                >
                  <span>Skip to Dashboard (Continue as Guest)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>256-Bit SSL Secured</span>
                </div>
              </div>
            </div>

            {/* Bottom Help & Compliance Notes */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
              <span>GeM Helpdesk Toll-Free: 1800-419-3436</span>
              <div className="flex items-center gap-3">
                <a href="#privacy" onClick={(e) => { e.preventDefault(); alert("Privacy Policy: All mock evaluations comply with GFR 2017 & GeM STC standards."); }} className="hover:underline">Privacy Policy</a>
                <span>•</span>
                <a href="#terms" onClick={(e) => { e.preventDefault(); alert("Terms of Use: This is a government procurement hackathon prototype."); }} className="hover:underline">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer National Informatics Bar */}
      <footer className="bg-slate-950 px-4 sm:px-8 py-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          Designed for <strong>Government e-Marketplace (GeM)</strong> • Government of India Procurement Compliance Evaluation Engine
        </div>
        <div className="flex items-center gap-2">
          <span>Prototype Version 2.4.0</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-mono">SIMULATION_READY</span>
        </div>
      </footer>
    </div>
  );
};
