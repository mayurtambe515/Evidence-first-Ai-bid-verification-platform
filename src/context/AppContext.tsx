import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { RecentBidder, AuditLogItem } from '../data/gemDashboardData';
import { AuthUser, UserRole, ThemeMode } from '../types';
import { DEMO_USERS } from '../data/authUsers';
import { apiService } from '../services/api';

export interface TenderRecord {
  id: string;
  name: string;
  department: string;
  category: string;
  biddersCount: number;
  status: 'Ongoing' | 'Completed';
  deadline: string;
  publishDate: string;
  estimatedValue: string;
  requirements: string[];
}

export interface OfficerDecisionRecord {
  bidderId: string;
  bidderName: string;
  decision: 'Qualified' | 'Disqualified' | 'Further Review';
  remarks: string;
  evidenceChecklist: string[];
  timestamp: string;
  officerName: string;
  officerDesignation: string;
  tokenSignature: string;
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  tag: string;
  type: 'info' | 'warning' | 'success';
  route?: string;
  bidderId?: string;
}

export interface AppContextType {
  bidders: RecentBidder[];
  tenders: TenderRecord[];
  auditLogs: AuditLogItem[];
  notifications: AppNotification[];
  officerDecisions: Record<string, OfficerDecisionRecord>;
  officerRemarks: Record<string, string>;
  selectedBidder: RecentBidder;
  setSelectedBidder: (bidder: RecentBidder) => void;
  recordOfficerDecision: (
    bidderId: string,
    decision: 'Qualified' | 'Disqualified' | 'Further Review' | 'QUALIFIED' | 'DISQUALIFIED' | 'FURTHER_REVIEW',
    remarks: string,
    evidenceChecklist: string[]
  ) => Promise<void>;
  saveOfficerRemarks: (bidderId: string, remarks: string) => Promise<void>;
  addTender: (tender: Omit<TenderRecord, 'biddersCount'> & { biddersCount?: number }) => Promise<void>;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  runMockVerificationRefresh: (bidderId: string) => Promise<void>;
  auditTrail: AuditLogItem[];
  updateBidderRemarks: (bidderId: string, remarks: string) => void;
  refreshBidderPortals: (bidderId: string) => Promise<void>;
  currentUser: AuthUser;
  setCurrentUser: (user: AuthUser) => void;
  login: (user: AuthUser) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
  dbConnected: boolean;
  dbStatus: any;
  dbLoading: boolean;
  dbError: string | null;
  refreshFromBackend: () => Promise<void>;
}

const INITIAL_BIDDERS: RecentBidder[] = [
  {
    id: 'bidder-1',
    index: 1,
    name: 'Shree Tech Solutions Pvt. Ltd.',
    pan: 'AABCS1234D',
    gstin: '27ABCDE1234F1Z5',
    bidId: 'GEM/2025/0167',
    complianceScore: 92,
    status: 'Compliant',
    riskLevel: 'Low',
    tenderId: 'GEM/2025/0012',
    tenderTitle: 'Supply of IT Equipment',
    turnoverCr: 6.8,
    udyamNumber: 'UDYAM-TN-02-0045129',
    oemStatus: 'Pending',
    gstStatus: 'Verified',
    localContentPercent: 62,
  },
  {
    id: 'bidder-2',
    index: 2,
    name: 'Global Traders Ltd.',
    pan: 'AATPG5678F',
    gstin: '27AATPG5678F1ZK',
    bidId: 'GEM/2025/0143',
    complianceScore: 68,
    status: 'Partial',
    riskLevel: 'Medium',
    tenderId: 'GEM/2025/0012',
    tenderTitle: 'Supply of IT Equipment',
    turnoverCr: 4.2,
    udyamNumber: 'UDYAM-MH-01-0089234',
    oemStatus: 'Pending',
    gstStatus: 'Delayed',
    localContentPercent: 48,
  },
  {
    id: 'bidder-3',
    index: 3,
    name: 'Bright Future Enterprises',
    pan: 'AAKPB9012L',
    gstin: '07AAKPB9012L1Z2',
    bidId: 'GEM/2025/0139',
    complianceScore: 45,
    status: 'Non-Compliant',
    riskLevel: 'High',
    tenderId: 'GEM/2025/0018',
    tenderTitle: 'Office Furniture',
    turnoverCr: 1.8,
    udyamNumber: 'UDYAM-DL-03-0011982',
    oemStatus: 'Failed',
    gstStatus: 'Delayed',
    localContentPercent: 32,
  },
  {
    id: 'bidder-4',
    index: 4,
    name: 'MSME Infra Pvt. Ltd.',
    pan: 'AAGCM3456Q',
    gstin: '24AAGCM3456Q1ZN',
    bidId: 'GEM/2025/0128',
    complianceScore: 85,
    status: 'Compliant',
    riskLevel: 'Low',
    tenderId: 'GEM/2025/0020',
    tenderTitle: 'Medical Equipment',
    turnoverCr: 5.4,
    udyamNumber: 'UDYAM-GJ-04-0029381',
    oemStatus: 'Verified',
    gstStatus: 'Verified',
    localContentPercent: 74,
  },
  {
    id: 'bidder-5',
    index: 5,
    name: 'Rising Star Technologies',
    pan: 'AAWCS7890K',
    gstin: '29AAWCS7890K1ZV',
    bidId: 'GEM/2025/0117',
    complianceScore: 73,
    status: 'Partial',
    riskLevel: 'Medium',
    tenderId: 'GEM/2025/0025',
    tenderTitle: 'Software Solutions',
    turnoverCr: 3.1,
    udyamNumber: 'UDYAM-KR-08-0099182',
    oemStatus: 'Pending',
    gstStatus: 'Verified',
    localContentPercent: 55,
  },
  {
    id: 'bidder-6',
    index: 6,
    name: 'Apex Telecommunications India Ltd.',
    pan: 'AAACA1122C',
    gstin: '06AAACA1122C1Z4',
    bidId: 'GEM/2025/0105',
    complianceScore: 89,
    status: 'Compliant',
    riskLevel: 'Low',
    tenderId: 'GEM/2025/0012',
    tenderTitle: 'Supply of IT Equipment',
    turnoverCr: 12.4,
    udyamNumber: 'UDYAM-HR-03-0071234',
    oemStatus: 'Verified',
    gstStatus: 'Verified',
    localContentPercent: 68,
  },
  {
    id: 'bidder-7',
    index: 7,
    name: 'Bharat Dynamic Equipments Pvt. Ltd.',
    pan: 'AABCB9988D',
    gstin: '19AABCB9988D1ZR',
    bidId: 'GEM/2025/0094',
    complianceScore: 58,
    status: 'Partial',
    riskLevel: 'Medium',
    tenderId: 'GEM/2025/0020',
    tenderTitle: 'Medical Equipment',
    turnoverCr: 2.8,
    udyamNumber: 'UDYAM-WB-05-0012398',
    oemStatus: 'Pending',
    gstStatus: 'Verified',
    localContentPercent: 42,
  },
  {
    id: 'bidder-8',
    index: 8,
    name: 'Zenith Heavy Engineering Corp.',
    pan: 'AACCZ4433E',
    gstin: '36AACCZ4433E1ZM',
    bidId: 'GEM/2025/0082',
    complianceScore: 38,
    status: 'Non-Compliant',
    riskLevel: 'High',
    tenderId: 'GEM/2025/0024',
    tenderTitle: 'Furniture',
    turnoverCr: 1.4,
    udyamNumber: 'UDYAM-TS-09-0098712',
    oemStatus: 'Failed',
    gstStatus: 'Delayed',
    localContentPercent: 24,
  },
];

const INITIAL_TENDERS: TenderRecord[] = [
  {
    id: 'GEM/2025/0012',
    name: 'Supply of IT Equipment',
    department: 'Ministry of Electronics & IT',
    category: 'Computer & Hardware',
    biddersCount: 50,
    status: 'Ongoing',
    deadline: '30-04-2026',
    publishDate: '15-02-2026',
    estimatedValue: '₹ 4,50,00,000',
    requirements: ['GST Registration', 'Udyam / MSME', 'PAN', 'OEM Authorization', 'Make in India (50%)'],
  },
  {
    id: 'GEM/2025/0018',
    name: 'Office Furniture',
    department: 'Government Department',
    category: 'Furniture & Fixtures',
    biddersCount: 45,
    status: 'Completed',
    deadline: '15-03-2026',
    publishDate: '01-01-2026',
    estimatedValue: '₹ 1,20,00,000',
    requirements: ['GST Registration', 'PAN', 'Turnover ₹ 1.5 Cr', 'BIFMA Certification'],
  },
  {
    id: 'GEM/2025/0020',
    name: 'Medical Equipment',
    department: 'Health Department',
    category: 'Healthcare & Diagnostics',
    biddersCount: 28,
    status: 'Ongoing',
    deadline: '25-04-2026',
    publishDate: '10-02-2026',
    estimatedValue: '₹ 8,75,00,000',
    requirements: ['GST Registration', 'PAN', 'Drug License', 'CE/FDA Approval', 'OEM Authorization'],
  },
  {
    id: 'GEM/2025/0024',
    name: 'Furniture',
    department: 'Government Department',
    category: 'Furniture & Fixtures',
    biddersCount: 45,
    status: 'Completed',
    deadline: '10-02-2026',
    publishDate: '05-12-2025',
    estimatedValue: '₹ 2,10,00,000',
    requirements: ['GST Registration', 'Udyam / MSME', 'PAN', 'Make in India'],
  },
  {
    id: 'GEM/2025/0025',
    name: 'Software Solutions',
    department: 'IT Department',
    category: 'Software & Cloud Services',
    biddersCount: 36,
    status: 'Ongoing',
    deadline: '05-05-2026',
    publishDate: '20-02-2026',
    estimatedValue: '₹ 6,30,00,000',
    requirements: ['GST Registration', 'CMMI Level 3', 'PAN', 'ISO 27001', 'Startup India / MSME'],
  },
];

const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'aud-1',
    timestamp: '2026-09-18 10:45 AM',
    action: 'Logged In',
    actor: 'Priya Sharma',
    role: 'Procurement Officer',
    bidderName: 'All Bidders',
    statusTag: 'AUTHENTICATED',
    details: 'Procurement Officer session initiated with MFA digital verification.',
  },
  {
    id: 'aud-2',
    timestamp: '2026-09-18 10:42 AM',
    action: 'Verified GST',
    actor: 'System (AI Engine)',
    role: 'Automated Service',
    bidderName: 'Shree Tech Solutions Pvt. Ltd.',
    statusTag: 'COMPLIANT',
    details: 'GSTIN 27ABCDE1234F1Z5 active on GSTN registry with timely return filing.',
  },
  {
    id: 'aud-3',
    timestamp: '2026-09-18 10:38 AM',
    action: 'Verified Udyam',
    actor: 'System (AI Engine)',
    role: 'Automated Service',
    bidderName: 'Shree Tech Solutions Pvt. Ltd.',
    statusTag: 'COMPLIANT',
    details: 'Udyam Certificate UDYAM-TN-02-0045129 active on MSME registry.',
  },
  {
    id: 'aud-4',
    timestamp: '2026-09-18 10:32 AM',
    action: 'Extracted Document',
    actor: 'System (AI OCR Engine)',
    role: 'Automated Service',
    bidderName: 'Bright Future Enterprises',
    statusTag: 'EXTRACTED',
    details: 'Extracted GST Certificate.pdf and flagged potential turnover discrepancy.',
  },
  {
    id: 'aud-5',
    timestamp: '2026-09-18 10:29 AM',
    action: 'Flagged Issue',
    actor: 'System (AI Engine)',
    role: 'Automated Service',
    bidderName: 'Shree Tech Solutions Pvt. Ltd.',
    statusTag: 'REQUIRES_REVIEW',
    details: 'OEM Authorization Form validity buffer ends 30 days prior to contract period.',
  },
  {
    id: 'aud-6',
    timestamp: '2026-09-18 10:20 AM',
    action: 'Added Remark',
    actor: 'Rohan Patil',
    role: 'Procurement Officer',
    bidderName: 'Global Traders Ltd.',
    statusTag: 'NEEDS_MANUAL_REVIEW',
    details: 'Requested certified clarification on latest GSTR-3B payment ledger.',
  },
  {
    id: 'aud-7',
    timestamp: '2026-09-18 10:15 AM',
    action: 'Completed Verification',
    actor: 'System (AI Engine)',
    role: 'Automated Service',
    bidderName: 'Shree Tech Solutions Pvt. Ltd.',
    statusTag: 'COMPLIANT (92%)',
    details: 'Compliance Score: 92% calculated across 8 statutory and technical criteria.',
  },
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'OEM Authorization Review',
    description: 'OEM authorization requires review for Shree Tech Solutions.',
    time: '12 mins ago',
    unread: true,
    tag: 'Pending Review',
    type: 'warning',
    bidderId: 'bidder-1',
    route: '/verification/bidder/bidder-1/risk',
  },
  {
    id: 'notif-2',
    title: 'Pending Compliance Checks',
    description: '3 bidders have pending compliance requirements.',
    time: '45 mins ago',
    unread: true,
    tag: 'Tender Evaluation',
    type: 'info',
    route: '/verification',
  },
  {
    id: 'notif-3',
    title: 'Verification Completed',
    description: 'Verification completed for Global Traders Ltd.',
    time: '2 hours ago',
    unread: false,
    tag: 'Verification',
    type: 'success',
    bidderId: 'bidder-2',
    route: '/verification/bidder/bidder-2',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bidders, setBidders] = useState<RecentBidder[]>(() => {
    const saved = localStorage.getItem('gem_bidders_v2');
    return saved ? JSON.parse(saved) : INITIAL_BIDDERS;
  });

  const [tenders, setTenders] = useState<TenderRecord[]>(() => {
    const saved = localStorage.getItem('gem_tenders_v2');
    return saved ? JSON.parse(saved) : INITIAL_TENDERS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem('gem_audit_logs_v2');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('gem_notifications_v2');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [officerDecisions, setOfficerDecisions] = useState<Record<string, OfficerDecisionRecord>>(() => {
    const saved = localStorage.getItem('gem_officer_decisions_v2');
    return saved ? JSON.parse(saved) : {};
  });

  const [officerRemarks, setOfficerRemarks] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('gem_officer_remarks_v2');
    return saved ? JSON.parse(saved) : {
      'bidder-1': 'Reviewed all portal cross-checks. OEM authorization buffer is acceptable as manufacturer email confirming 6-month extension has been received.',
    };
  });

  const [selectedBidder, setSelectedBidder] = useState<RecentBidder>(() => {
    return bidders[0] || INITIAL_BIDDERS[0];
  });

  // Database Connection and Synchronization States
  const [dbConnected, setDbConnected] = useState<boolean>(false);
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [dbLoading, setDbLoading] = useState<boolean>(true);
  const [dbError, setDbError] = useState<string | null>(null);

  const refreshFromBackend = useCallback(async () => {
    setDbLoading(true);
    try {
      // 1. Check PostgreSQL connection status
      const statusRes = await apiService.getDbStatus();
      if (statusRes.success || statusRes.connected) {
        setDbConnected(true);
        setDbStatus(statusRes);
        setDbError(null);
      } else {
        setDbConnected(false);
        setDbError(statusRes.error || 'Failed to connect to PostgreSQL database');
      }

      // 2. Fetch Bidders from backend database
      const biddersRes = await apiService.getBidders();
      if (biddersRes.success && Array.isArray(biddersRes.bidders) && biddersRes.bidders.length > 0) {
        const mappedBidders: RecentBidder[] = biddersRes.bidders.map((b: any, index: number) => {
          const score = Number(b.complianceScore) || 0;
          const status: 'Compliant' | 'Partial' | 'Non-Compliant' =
            score >= 80 ? 'Compliant' : score >= 50 ? 'Partial' : 'Non-Compliant';
          const riskLevel: 'Low' | 'Medium' | 'High' =
            b.riskLevel === 'Low' || b.riskLevel === 'LOW'
              ? 'Low'
              : b.riskLevel === 'High' || b.riskLevel === 'HIGH'
              ? 'High'
              : 'Medium';

          return {
            id: b.id,
            index: index + 1,
            name: b.name,
            pan: b.pan,
            gstin: b.gstin,
            bidId: b.bidId,
            complianceScore: score,
            status,
            riskLevel,
            tenderId: b.tenderId || 'GEM/2025/0012',
            tenderTitle: b.tenderTitle || 'Supply of IT Equipment',
            turnoverCr: Number(b.turnoverCr) || 5.0,
            udyamNumber: b.udyamNumber || '',
            oemStatus: b.oemStatus || 'Verified',
            gstStatus: b.gstStatus || 'Verified',
            localContentPercent: Number(b.localContentPercent) || 50,
            officerDecision: b.finalDecision
              ? {
                  decision:
                    b.finalDecision.decision === 'QUALIFIED'
                      ? 'APPROVE'
                      : b.finalDecision.decision === 'DISQUALIFIED'
                      ? 'REJECT'
                      : 'REQUEST_CLARIFICATION',
                  notes: b.finalDecision.remarks || '',
                  officerName: b.finalDecision.officerName || 'Procurement Officer',
                  timestamp: b.finalDecision.timestamp || '',
                }
              : undefined,
          };
        });

        setBidders(mappedBidders);
        setSelectedBidder((current) => {
          const matched = mappedBidders.find((m) => m.id === current.id);
          return matched || mappedBidders[0];
        });
      }

      // 3. Fetch Tenders from backend database
      const tendersRes = await apiService.getTenders();
      if (tendersRes.success && Array.isArray(tendersRes.tenders) && tendersRes.tenders.length > 0) {
        const mappedTenders: TenderRecord[] = tendersRes.tenders.map((t: any) => ({
          id: t.id,
          name: t.title || t.name,
          department: t.department || 'Ministry of Electronics & IT',
          category: t.category || 'Computer & Hardware',
          biddersCount: Number(t.biddersCount) || 1,
          status: t.status === 'ACTIVE' || t.status === 'Ongoing' ? 'Ongoing' : 'Completed',
          deadline: t.deadline || '30-04-2026',
          publishDate: t.publishDate || '15-02-2026',
          estimatedValue: t.estimatedValue ? `₹ ${t.estimatedValue}` : '₹ 4,50,00,000',
          requirements: Array.isArray(t.requirements)
            ? t.requirements.map((r: any) => (typeof r === 'string' ? r : r.title || r.category))
            : ['GST Registration', 'Udyam / MSME', 'PAN', 'OEM Authorization', 'Make in India (50%)'],
        }));
        setTenders(mappedTenders);
      }

      // 4. Fetch Audit Logs from backend database (with cryptographic hashes)
      const auditRes = await apiService.getAllAuditLogs();
      if (auditRes.success && Array.isArray(auditRes.logs) && auditRes.logs.length > 0) {
        const mappedAuditLogs: AuditLogItem[] = auditRes.logs.map((l: any) => {
          const d = new Date(l.timestamp || Date.now());
          const timeString =
            d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
            ' ' +
            (d.getHours() >= 12 ? 'PM' : 'AM');
          return {
            id: l.id,
            timestamp: timeString,
            action: l.action,
            actor: l.user,
            role: l.userRole === 'OFFICER' ? 'Procurement Officer' : l.userRole === 'SYSTEM' ? 'Automated Service' : l.userRole,
            bidderName: l.entityId || 'Shree Tech Solutions Pvt. Ltd.',
            statusTag: l.action.includes('DECISION') ? 'DECISION' : 'VERIFIED',
            details: `${l.entity} [${l.action}] - Hash: ${l.hash ? l.hash.substring(0, 12) : 'SHA256'}... Details: ${
              typeof l.details === 'object' ? JSON.stringify(l.details) : l.details || ''
            }`,
          };
        });
        setAuditLogs(mappedAuditLogs);
      }
    } catch (err: any) {
      console.error('Failed to sync state from backend database:', err);
      setDbError(err.message || 'Database connection error');
      setDbConnected(false);
    } finally {
      setDbLoading(false);
    }
  }, []);

  // Sync on initial component mount
  useEffect(() => {
    refreshFromBackend();
  }, [refreshFromBackend]);

  const [currentUser, setCurrentUser] = useState<AuthUser>(() => {
    try {
      const saved = localStorage.getItem('gem_auth_user_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEMO_USERS.officer;
  });

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('gem_theme_mode');
      if (saved === 'dark' || saved === 'light' || saved === 'system') return saved;
    } catch {
      // ignore
    }
    return 'light';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('gem_theme_mode');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const applyTheme = () => {
      let dark = false;
      if (theme === 'dark') {
        dark = true;
      } else if (theme === 'light') {
        dark = false;
      } else {
        dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      setIsDarkMode(dark);
      if (dark) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    };

    applyTheme();
    try {
      localStorage.setItem('gem_theme_mode', theme);
    } catch {
      // ignore
    }

    if (theme === 'system' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => {
      if (prev === 'dark') return 'light';
      if (prev === 'light') return 'dark';
      // if system, toggle opposite of current isDarkMode
      return isDarkMode ? 'light' : 'dark';
    });
  };

  useEffect(() => {
    localStorage.setItem('gem_auth_user_v2', JSON.stringify(currentUser));
  }, [currentUser]);

  const login = (user: AuthUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('gem_auth_user_v2', JSON.stringify(user));
    } catch {
      // ignore
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + (now.getHours() >= 12 ? 'PM' : 'AM');
    const newAuditItem: AuditLogItem = {
      id: 'aud-' + Date.now(),
      timestamp: timeString,
      action: 'User Authentication',
      actor: user.name,
      role: user.roleLabel,
      bidderName: user.organization || user.department,
      statusTag: 'AUTH_SUCCESS',
      details: `Session initiated for ${user.roleLabel} (${user.email}). Credentials verified via Simulated National SSO.`,
    };

    setAuditLogs((prev) => [newAuditItem, ...prev]);
  };

  const logout = () => {
    try {
      localStorage.removeItem('gem_auth_user_v2');
    } catch {
      // ignore
    }
    // Return to officer default for convenience
    setCurrentUser(DEMO_USERS.officer);
  };

  const switchRole = (role: UserRole) => {
    if (role === 'OFFICER') login(DEMO_USERS.officer);
    else if (role === 'BIDDER') login(DEMO_USERS.bidder);
    else if (role === 'AUDITOR') login(DEMO_USERS.auditor);
  };

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('gem_bidders_v2', JSON.stringify(bidders));
  }, [bidders]);

  useEffect(() => {
    localStorage.setItem('gem_tenders_v2', JSON.stringify(tenders));
  }, [tenders]);

  useEffect(() => {
    localStorage.setItem('gem_audit_logs_v2', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('gem_notifications_v2', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('gem_officer_decisions_v2', JSON.stringify(officerDecisions));
  }, [officerDecisions]);

  useEffect(() => {
    localStorage.setItem('gem_officer_remarks_v2', JSON.stringify(officerRemarks));
  }, [officerRemarks]);

  const recordOfficerDecision = async (
    bidderId: string,
    decision: 'Qualified' | 'Disqualified' | 'Further Review' | 'QUALIFIED' | 'DISQUALIFIED' | 'FURTHER_REVIEW',
    remarks: string,
    evidenceChecklist: string[]
  ) => {
    const bidder = bidders.find((b) => b.id === bidderId) || selectedBidder;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + (now.getHours() >= 12 ? 'PM' : 'AM');
    const token = 'SIG-' + Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Date.now().toString(36).toUpperCase();

    const normalizedDecision: 'QUALIFIED' | 'DISQUALIFIED' | 'FURTHER_REVIEW' =
      decision === 'Qualified' || decision === 'QUALIFIED'
        ? 'QUALIFIED'
        : decision === 'Disqualified' || decision === 'DISQUALIFIED'
        ? 'DISQUALIFIED'
        : 'FURTHER_REVIEW';

    const displayDecision: 'Qualified' | 'Disqualified' | 'Further Review' =
      normalizedDecision === 'QUALIFIED'
        ? 'Qualified'
        : normalizedDecision === 'DISQUALIFIED'
        ? 'Disqualified'
        : 'Further Review';

    const decisionRecord: OfficerDecisionRecord = {
      bidderId,
      bidderName: bidder.name,
      decision: displayDecision,
      remarks,
      evidenceChecklist,
      timestamp: now.toISOString(),
      officerName: 'Procurement Officer',
      officerDesignation: 'Senior Procurement Officer',
      tokenSignature: token,
    };

    setOfficerDecisions((prev) => ({ ...prev, [bidderId]: decisionRecord }));

    // Update bidder status if appropriate
    setBidders((prev) =>
      prev.map((b) =>
        b.id === bidderId
          ? {
              ...b,
              officerDecision: {
                decision: normalizedDecision === 'QUALIFIED' ? 'APPROVE' : normalizedDecision === 'DISQUALIFIED' ? 'REJECT' : 'REQUEST_CLARIFICATION',
                notes: remarks,
                officerName: 'Procurement Officer',
                timestamp: now.toISOString(),
              },
            }
          : b
      )
    );

    // Call backend API to persist to PostgreSQL with cryptographic audit trail
    try {
      await apiService.recordFinalDecision(bidderId, {
        decision: normalizedDecision,
        officerId: 'OFF-8841',
        officerName: 'Procurement Officer (Senior Grade)',
        officerDesignation: 'Senior Procurement Officer',
        remarks,
        evidenceReviewed: evidenceChecklist,
      });
      // Re-sync audit logs from backend database
      const freshAudit = await apiService.getAllAuditLogs();
      if (freshAudit.success && Array.isArray(freshAudit.logs)) {
        const mappedAuditLogs: AuditLogItem[] = freshAudit.logs.map((l: any) => {
          const d = new Date(l.timestamp || Date.now());
          return {
            id: l.id,
            timestamp: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + (d.getHours() >= 12 ? 'PM' : 'AM'),
            action: l.action,
            actor: l.user,
            role: l.userRole === 'OFFICER' ? 'Procurement Officer' : l.userRole,
            bidderName: bidder.name,
            statusTag: l.action.includes('DECISION') ? normalizedDecision : 'VERIFIED',
            details: `${l.entity} [${l.action}] - Hash: ${l.hash ? l.hash.substring(0, 12) : 'SHA256'}... Details: ${
              typeof l.details === 'object' ? JSON.stringify(l.details) : l.details || ''
            }`,
          };
        });
        setAuditLogs(mappedAuditLogs);
      }
    } catch (err: any) {
      console.warn('Backend final decision persistence note:', err.message);
    }

    // Add immutable audit log entry
    const newAuditItem: AuditLogItem = {
      id: 'aud-' + Date.now(),
      timestamp: timeString,
      action: 'Recorded Final Decision',
      actor: 'Procurement Officer',
      role: 'Statutory Officer (GFR 144)',
      bidderName: bidder.name,
      statusTag: normalizedDecision,
      details: `Procurement Officer marked bidder as [${displayDecision}]. Token: ${token}. Remarks: "${remarks.slice(0, 80)}..."`,
    };

    setAuditLogs((prev) => [newAuditItem, ...prev]);

    // Add notification
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      title: 'Officer Decision Recorded',
      description: `Final decision recorded for ${bidder.name}: ${displayDecision}.`,
      time: 'Just now',
      unread: true,
      tag: 'Statutory Decision',
      type: normalizedDecision === 'QUALIFIED' ? 'success' : normalizedDecision === 'DISQUALIFIED' ? 'warning' : 'info',
      bidderId,
      route: `/verification/bidder/${bidderId}/final-decision`,
    };

    setNotifications((prev) => [newNotif, ...prev]);
  };

  const saveOfficerRemarks = async (bidderId: string, remarks: string) => {
    setOfficerRemarks((prev) => ({ ...prev, [bidderId]: remarks }));
    const bidder = bidders.find((b) => b.id === bidderId) || selectedBidder;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + (now.getHours() >= 12 ? 'PM' : 'AM');

    try {
      await apiService.saveRemarks(bidderId, remarks, 'Procurement Officer', 'OFF-8841');
    } catch (e: any) {
      console.warn('Remarks sync note:', e.message);
    }

    const newAuditItem: AuditLogItem = {
      id: 'aud-' + Date.now(),
      timestamp: timeString,
      action: 'Added Remark',
      actor: 'Procurement Officer',
      role: 'Procurement Officer',
      bidderName: bidder.name,
      statusTag: 'REMARKS_UPDATED',
      details: `Officer added remarks: "${remarks.slice(0, 90)}..."`,
    };

    setAuditLogs((prev) => [newAuditItem, ...prev]);
  };

  const addTender = async (tenderData: Omit<TenderRecord, 'biddersCount'> & { biddersCount?: number }) => {
    const newTender: TenderRecord = {
      ...tenderData,
      biddersCount: tenderData.biddersCount || 0,
    };
    setTenders((prev) => [newTender, ...prev]);

    try {
      await apiService.createTender({
        id: newTender.id,
        tenderNumber: newTender.id,
        title: newTender.name,
        department: newTender.department,
        category: newTender.category,
        estimatedValue: newTender.estimatedValue,
        closingDate: newTender.deadline,
        requirements: newTender.requirements,
      });
    } catch (e: any) {
      console.warn('Tender create backend note:', e.message);
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + (now.getHours() >= 12 ? 'PM' : 'AM');

    const newAuditItem: AuditLogItem = {
      id: 'aud-' + Date.now(),
      timestamp: timeString,
      action: 'Published Tender',
      actor: 'Procurement Officer',
      role: 'Procurement Officer',
      bidderName: 'All Bidders',
      statusTag: 'TENDER_PUBLISHED',
      details: `Created new tender [${newTender.id}] ${newTender.name} under ${newTender.department}.`,
    };

    setAuditLogs((prev) => [newAuditItem, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const runMockVerificationRefresh = async (bidderId: string) => {
    const bidder = bidders.find((b) => b.id === bidderId) || selectedBidder;

    // Run backend verification & compliance engine
    try {
      const res = await apiService.runVerification(bidderId);
      if (res.success && res.complianceReport) {
        setBidders((prev) =>
          prev.map((b) =>
            b.id === bidderId
              ? {
                  ...b,
                  complianceScore: res.complianceReport.complianceScore,
                  riskLevel:
                    res.complianceReport.riskLevel === 'HIGH'
                      ? 'High'
                      : res.complianceReport.riskLevel === 'LOW'
                      ? 'Low'
                      : 'Medium',
                }
              : b
          )
        );
      }
    } catch (e: any) {
      console.warn('Verification run note:', e.message);
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + (now.getHours() >= 12 ? 'PM' : 'AM');

    const newAuditItem: AuditLogItem = {
      id: 'aud-' + Date.now(),
      timestamp: timeString,
      action: 'Refreshed Portal Cross-Checks',
      actor: 'System (AI Engine)',
      role: 'Automated Service',
      bidderName: bidder.name,
      statusTag: 'PORTAL_SYNCED',
      details: `Re-queried GSTN, Udyam, Income Tax, and Debarment databases. Persisted results to PostgreSQL.`,
    };

    setAuditLogs((prev) => [newAuditItem, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        bidders,
        tenders,
        auditLogs,
        notifications,
        officerDecisions,
        officerRemarks,
        selectedBidder,
        setSelectedBidder,
        recordOfficerDecision,
        saveOfficerRemarks,
        addTender,
        markNotificationAsRead,
        clearAllNotifications,
        runMockVerificationRefresh,
        auditTrail: auditLogs,
        updateBidderRemarks: saveOfficerRemarks,
        refreshBidderPortals: runMockVerificationRefresh,
        currentUser,
        setCurrentUser,
        login,
        logout,
        switchRole,
        theme,
        setTheme,
        toggleTheme,
        isDarkMode,
        dbConnected,
        dbStatus,
        dbLoading,
        dbError,
        refreshFromBackend,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
