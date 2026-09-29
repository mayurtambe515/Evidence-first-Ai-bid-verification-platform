import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Sliders,
  Bell,
  Database,
  Check,
  Building2,
  Lock,
  Layers,
  Users,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertTriangle,
  Play,
  UserPlus,
  X,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface RuleConfig {
  id: string;
  name: string;
  weight: number;
  critical: boolean;
  active: boolean;
}

const DEFAULT_RULES: RuleConfig[] = [
  { id: 'gst', name: 'GST Compliance & Filing Regularity', weight: 20, critical: true, active: true },
  { id: 'pan', name: 'PAN Verification & CBDT Linkage', weight: 15, critical: true, active: true },
  { id: 'msme', name: 'MSME / Udyam Enterprise Validation', weight: 10, critical: false, active: true },
  { id: 'fin', name: 'Financial Standing & Turnover Threshold', weight: 20, critical: true, active: true },
  { id: 'deb', name: 'Debarment & Blacklist Registry Check', weight: 20, critical: true, active: true },
  { id: 'tech', name: 'Technical Capacity & OEM Authorization', weight: 15, critical: false, active: true },
];

export const SettingsPage: React.FC = () => {
  const { theme, setTheme, isDarkMode } = useApp();
  const [activeTab, setActiveTab] = useState<'general' | 'rules' | 'integrations' | 'users' | 'notifications'>('general');
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  // General Settings State
  const [orgName, setOrgName] = useState('Ministry of Electronics & Information Technology');
  const [department, setDepartment] = useState('Procurement Division');
  const [evalPeriod, setEvalPeriod] = useState('30 days');
  const [autoFlagThreshold, setAutoFlagThreshold] = useState('70%');

  // Rules State
  const [rules, setRules] = useState<RuleConfig[]>(DEFAULT_RULES);

  // Integrations State
  const [testedApi, setTestedApi] = useState<string | null>(null);

  // User Management State
  const [usersList, setUsersList] = useState([
    { name: 'Dr. Rajesh Sharma', role: 'Lead Procurement Officer (Admin)', email: 'r.sharma@gov.in', status: 'Active' },
    { name: 'Priya Sundaram', role: 'Technical Evaluator (Reviewer)', email: 'p.sundaram@gov.in', status: 'Active' },
    { name: 'Amitabh Sen', role: 'Financial Officer (Reviewer)', email: 'a.sen@gov.in', status: 'Active' },
    { name: 'Kavita Menon', role: 'Compliance Auditor (Viewer)', email: 'k.menon@gov.in', status: 'Active' },
  ]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Technical Evaluator (Reviewer)');

  // Notification toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [inAppAlerts, setInAppAlerts] = useState(true);
  const [dailySummary, setDailySummary] = useState(true);

  const triggerSaveMessage = (msg: string) => {
    setSavedMessage(msg);
    setTimeout(() => setSavedMessage(null), 3500);
  };

  const handleTestApi = (apiName: string) => {
    setTestedApi(apiName);
    setTimeout(() => {
      setTestedApi(null);
      triggerSaveMessage(`${apiName} pinged successfully. Response: 200 OK (Latency: 42ms)`);
    }, 1000);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;
    setUsersList((prev) => [
      ...prev,
      { name: newUserName, email: newUserEmail, role: newUserRole, status: 'Active' },
    ]);
    setIsAddUserOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    triggerSaveMessage(`User ${newUserName} added with ${newUserRole} permissions.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800 rounded-full text-xs font-bold uppercase tracking-wider">
              Administration & Policy
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-400">• Platform Settings</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Platform Settings & Verification Rules
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure compliance tolerance thresholds, gateway integrations, user roles, appearance themes, and alert preferences.
          </p>
        </div>

        {savedMessage && (
          <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{savedMessage}</span>
          </div>
        )}
      </div>

      {/* Tabs Bar */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: 'general', label: 'General & Appearance', icon: Building2 },
          { id: 'rules', label: 'Compliance Rules', icon: Sliders },
          { id: 'integrations', label: 'Integrations & Gateways', icon: Database },
          { id: 'users', label: 'User Management', icon: Users },
          { id: 'notifications', label: 'Notifications & Alerts', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6 max-w-3xl">
          {/* Theme & Display Mode Preference */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Appearance & Theme
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Select your preferred interface display mode. Dark mode incorporates WCAG AAA/AA compliant contrast for data tables and verification badges.
                </p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                isDarkMode 
                  ? 'bg-slate-800 text-blue-300 border-blue-800/80' 
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {isDarkMode ? 'Dark Mode Active' : 'Light Mode Active'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Light Mode Card */}
              <button
                type="button"
                onClick={() => {
                  setTheme('light');
                  triggerSaveMessage('Theme set to Light mode.');
                }}
                className={`p-4 rounded-xl border-2 text-left transition relative flex flex-col justify-between h-36 ${
                  theme === 'light'
                    ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Sun className="w-4 h-4" />
                    </div>
                    {theme === 'light' && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Light Mode</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Standard high-clarity daylight palette for desktop daylight procurement evaluation.
                  </p>
                </div>
              </button>

              {/* Dark Mode Card */}
              <button
                type="button"
                onClick={() => {
                  setTheme('dark');
                  triggerSaveMessage('Theme set to Dark mode (WCAG Contrast Compliant).');
                }}
                className={`p-4 rounded-xl border-2 text-left transition relative flex flex-col justify-between h-36 ${
                  theme === 'dark'
                    ? 'border-blue-600 bg-slate-800/80 dark:bg-blue-950/30'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 text-blue-400 flex items-center justify-center border border-slate-700">
                      <Moon className="w-4 h-4" />
                    </div>
                    {theme === 'dark' && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Dark Mode</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Eye-safe slate-900 canvas with contrast-boosted enterprise tables and status tags.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Org & Tender Defaults Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
              Organization & Tender Defaults
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Organization / Ministry</label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Default Evaluation Period</label>
                  <select
                    value={evalPeriod}
                    onChange={(e) => setEvalPeriod(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="15 days">15 Days</option>
                    <option value="30 days">30 Days</option>
                    <option value="45 days">45 Days</option>
                    <option value="60 days">60 Days</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Auto-flag Scrutiny Threshold</label>
                  <select
                    value={autoFlagThreshold}
                    onChange={(e) => setAutoFlagThreshold(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="60%">Score Below 60%</option>
                    <option value="70%">Score Below 70%</option>
                    <option value="80%">Score Below 80%</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => triggerSaveMessage('General preferences updated.')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                Save General Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Compliance Rules */}
      {activeTab === 'rules' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Rule Weights & Scoring Engine Configuration
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Adjust relative weighting for statutory compliance calculation. Critical rules mandate 100% satisfaction.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setRules(DEFAULT_RULES);
                  triggerSaveMessage('Rules reset to default standard.');
                }}
                className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Defaults</span>
              </button>

              <button
                type="button"
                onClick={() => triggerSaveMessage('Compliance rule weights saved.')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {rules.map((r, idx) => (
              <div
                key={r.id}
                className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{r.name}</span>
                    {r.critical ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                        Critical Rule
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-805">
                        Advisory Rule
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Calculates compliance contribution based on registry cross-check.
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Weight Slider */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 w-12 text-right">
                      {r.weight}%
                    </span>
                    <input
                      type="range"
                      min={5}
                      max={40}
                      step={5}
                      value={r.weight}
                      onChange={(e) => {
                        const newWeight = parseInt(e.target.value, 10);
                        setRules((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, weight: newWeight } : item))
                        );
                      }}
                      className="w-28 accent-blue-600"
                    />
                  </div>

                  {/* Active Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={r.active}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setRules((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, active: isChecked } : item))
                        );
                      }}
                      className="rounded-sm text-blue-600"
                    />
                    <span>Active</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Integrations & Gateways */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Government Registry Integration Status
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Centralized gateway connectors verifying corporate, tax, and procurement eligibility.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 dark:text-slate-400 italic">
                Environment: <strong>MOCK DEMO MODE</strong>
              </span>
              <button
                type="button"
                title="Requires government production credentials"
                className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs font-bold rounded-xl cursor-not-allowed border border-slate-200 dark:border-slate-700"
              >
                Switch to Live Gateways
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { id: 'gstn', name: 'GSTN Gateway API', status: 'Connected (Mock)', env: 'Sandbox' },
              { id: 'cbdt', name: 'CBDT Income Tax', status: 'Connected (Mock)', env: 'Sandbox' },
              { id: 'mca21', name: 'MCA21 V3 Registry', status: 'Connected (Mock)', env: 'Sandbox' },
              { id: 'udyam', name: 'Ministry of MSME Udyam', status: 'Connected (Mock)', env: 'Sandbox' },
              { id: 'digilocker', name: 'DigiLocker Verification', status: 'Connected (Mock)', env: 'Sandbox' },
              { id: 'gem_core', name: 'GeM Core Buyer API', status: 'Connected (Mock)', env: 'Sandbox' },
            ].map((api) => (
              <div
                key={api.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{api.name}</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {api.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-400 mt-1">
                    Environment: {api.env} • Protocol: REST / JSON / TLS 1.3
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleTestApi(api.name)}
                    disabled={testedApi === api.name}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 transition"
                  >
                    <Play className="w-3 h-3" />
                    <span>{testedApi === api.name ? 'Pinging...' : 'Test Ping'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => alert(`Endpoint configuration modal for ${api.name}`)}
                    className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    Configure
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: User Management */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Procurement Committee & Officer Roles</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Role-based access control (RBAC) ensuring human officers hold exclusive determination rights.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddUserOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Officer</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">
                <tr>
                  <th className="py-3 px-4">Officer Name</th>
                  <th className="py-3 px-4">Official Email</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {usersList.map((u, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">{u.name}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 border border-blue-200/60 dark:border-blue-800 px-2 py-0.5 rounded-md">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/60 dark:border-emerald-800 px-2 py-0.5 rounded-full font-bold text-[11px]">
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add User Modal */}
          {isAddUserOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Add Procurement Officer</h4>
                  <button onClick={() => setIsAddUserOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddUser} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anand Varma"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">NIC / Gov Email</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. anand.varma@gov.in"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Role & Authority</label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    >
                      <option value="Lead Procurement Officer (Admin)">Lead Procurement Officer (Admin)</option>
                      <option value="Technical Evaluator (Reviewer)">Technical Evaluator (Reviewer)</option>
                      <option value="Financial Officer (Reviewer)">Financial Officer (Reviewer)</option>
                      <option value="Compliance Auditor (Viewer)">Compliance Auditor (Viewer)</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddUserOpen(false)}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs transition"
                    >
                      Add Officer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Notifications & Alerts */}
      {activeTab === 'notifications' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 max-w-2xl transition-colors">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
            Alerts & Notification Subscriptions
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100 block">Email Alerts for Critical Discrepancies</span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Receive immediate alerts when debarment matches or tax irregularities are flagged.
                </span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded-sm"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100 block">In-App Toast Alerts</span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Real-time visual notifications as background API verification batches complete.
                </span>
              </div>
              <input
                type="checkbox"
                checked={inAppAlerts}
                onChange={(e) => setInAppAlerts(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded-sm"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100 block">Daily Digest Summary</span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  08:00 AM daily briefing on pending officer determinations and expiring authorisations.
                </span>
              </div>
              <input
                type="checkbox"
                checked={dailySummary}
                onChange={(e) => setDailySummary(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded-sm"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={() => triggerSaveMessage('Notification preferences saved.')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              Save Notification Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
