export interface KpiMetric {
  title: string;
  value: number;
  subtitle?: string;
  percentage?: string;
  status?: 'Compliant' | 'Partial' | 'Non-Compliant' | 'Total';
  type: 'total' | 'compliant' | 'partial' | 'nonCompliant';
}

export interface RecentBidder {
  id: string;
  index: number;
  name: string;
  pan: string;
  gstin: string;
  bidId: string;
  complianceScore: number;
  status: 'Compliant' | 'Partial' | 'Non-Compliant';
  riskLevel: 'Low' | 'Medium' | 'High';
  tenderId: string;
  tenderTitle: string;
  turnoverCr: number;
  udyamNumber?: string;
  oemStatus: 'Verified' | 'Pending' | 'Failed' | 'Not Required';
  gstStatus: 'Verified' | 'Pending' | 'Delayed';
  localContentPercent: number;
  officerDecision?: {
    decision: 'APPROVE' | 'REJECT' | 'REQUEST_CLARIFICATION';
    notes: string;
    officerName: string;
    timestamp: string;
  };
}

export interface ComplianceArea {
  name: string;
  percentage: number;
  color: 'emerald' | 'amber';
}

export interface ChecklistItem {
  id: string;
  title: string;
  statusText: 'Verified' | 'Compliant' | 'Not Applicable' | 'Pending' | 'Failed';
  statusType: 'verified' | 'compliant' | 'neutral' | 'warning' | 'danger';
  remarks?: string;
  portalSource?: string;
}

export interface PortalCheckRecord {
  portalName: string;
  portalCode: string;
  verifiedAt: string;
  status: 'VERIFIED' | 'MATCH' | 'PARTIAL' | 'DISCREPANCY';
  latencyMs: number;
  details: Record<string, string>;
}

export interface BidderDocumentItem {
  id: string;
  title: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  status: 'Verified' | 'Pending Review' | 'Flagged';
  confidence: number;
  extractedSnippet: string;
  matchDetails: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  role: string;
  bidderName: string;
  statusTag: string;
  details: string;
}

export interface OfficerProfile {
  name: string;
  role: string;
  department: string;
  ministry: string;
  designation: string;
  email: string;
  idNumber: string;
  avatarInitials: string;
}

export const OFFICER_PROFILE: OfficerProfile = {
  name: 'Procurement Officer',
  role: 'Senior Procurement Officer',
  department: 'Ministry / Department',
  ministry: 'Ministry of Commerce & Industry / GeM SPV',
  designation: 'Directorate of Public Procurement',
  email: 'procurement.officer@gem.gov.in',
  idNumber: 'GEM-PO-2025-0891',
  avatarInitials: 'PO',
};

export const DASHBOARD_KPIS: KpiMetric[] = [
  {
    title: 'Total Bidders',
    value: 128,
    subtitle: 'in current cycle',
    type: 'total',
  },
  {
    title: 'Fully Compliant',
    value: 72,
    percentage: '56.3%',
    status: 'Compliant',
    type: 'compliant',
  },
  {
    title: 'Partial Compliance',
    value: 34,
    percentage: '26.6%',
    status: 'Partial',
    type: 'partial',
  },
  {
    title: 'Non Compliant',
    value: 22,
    percentage: '17.2%',
    status: 'Non-Compliant',
    type: 'nonCompliant',
  },
];

export const RECENT_BIDDERS: RecentBidder[] = [
  {
    id: 'bidder-1',
    index: 1,
    name: 'Shree Tech Solutions Pvt. Ltd.',
    pan: 'AABCS1234D',
    gstin: '33AABCS1234D1ZP',
    bidId: 'GEM/2025/0167',
    complianceScore: 92,
    status: 'Compliant',
    riskLevel: 'Low',
    tenderId: 'GEM-TND-2025-881',
    tenderTitle: 'Supply & 3-Year Enterprise Cloud Infrastructure Maintenance',
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
    tenderId: 'GEM-TND-2025-881',
    tenderTitle: 'Supply & 3-Year Enterprise Cloud Infrastructure Maintenance',
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
    tenderId: 'GEM-TND-2025-790',
    tenderTitle: 'Unified Communication & Ruggedized Hardware Fleet',
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
    tenderId: 'GEM-TND-2025-790',
    tenderTitle: 'Unified Communication & Ruggedized Hardware Fleet',
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
    tenderId: 'GEM-TND-2025-654',
    tenderTitle: 'Optical Fiber & Edge Routing Network Modernization',
    turnoverCr: 3.1,
    udyamNumber: 'UDYAM-KR-08-0099182',
    oemStatus: 'Pending',
    gstStatus: 'Verified',
    localContentPercent: 55,
  },
];

export const TOP_COMPLIANCE_AREAS: ComplianceArea[] = [
  { name: 'GST & Return Filing', percentage: 92, color: 'emerald' },
  { name: 'Udyam / MSME', percentage: 88, color: 'emerald' },
  { name: 'PAN & Income Tax', percentage: 84, color: 'emerald' },
  { name: 'EPFO / ESIC', percentage: 76, color: 'amber' },
  { name: 'Make in India / Local Content', percentage: 68, color: 'amber' },
];

export const SAMPLE_BIDDER_CHECKLIST: ChecklistItem[] = [
  {
    id: 'chk-1',
    title: 'Udyam / MSME Registration',
    statusText: 'Verified',
    statusType: 'verified',
    remarks: 'UDYAM-TN-02-0045129 active on MSME registry. Medium enterprise classification.',
    portalSource: 'Udyam Portal (Ministry of MSME)',
  },
  {
    id: 'chk-2',
    title: 'GST Registration & Return Filing',
    statusText: 'Verified',
    statusType: 'verified',
    remarks: 'GSTIN 33AABCS1234D1ZP active. GSTR-3B & GSTR-1 filed through previous month.',
    portalSource: 'GSTN Taxpayer Registry API',
  },
  {
    id: 'chk-3',
    title: 'PAN & Income Tax Compliance',
    statusText: 'Verified',
    statusType: 'verified',
    remarks: 'PAN AABCS1234D corporate record matches legal entity name with 99.4% confidence.',
    portalSource: 'Income Tax NSDL Registry',
  },
  {
    id: 'chk-4',
    title: 'Make in India / Local Content',
    statusText: 'Compliant',
    statusType: 'compliant',
    remarks: 'Class-I Local Supplier self-declaration certified at 62% domestic content.',
    portalSource: 'DPIIT MII Framework Check',
  },
  {
    id: 'chk-5',
    title: 'EPFO / ESIC',
    statusText: 'Not Applicable',
    statusType: 'neutral',
    remarks: 'Direct workforce below statutory threshold; exemption statement verified.',
    portalSource: 'Shram Suvidha Portal',
  },
  {
    id: 'chk-6',
    title: 'Startup India / NSIC',
    statusText: 'Verified',
    statusType: 'verified',
    remarks: 'DPIIT recognized entity certificate DIPP99281 confirmed active.',
    portalSource: 'Startup India Hub Gateway',
  },
  {
    id: 'chk-7',
    title: 'OEM Authorization',
    statusText: 'Pending',
    statusType: 'warning',
    remarks: 'OEM Manufacturer Authorization Form valid till Nov 2026. Awaiting final officer validity sign-off.',
    portalSource: 'OEM Partner Verification Repository',
  },
];

export const SAMPLE_PORTAL_CHECKS: PortalCheckRecord[] = [
  {
    portalName: 'GSTN Public API Gateway',
    portalCode: 'GSTN-V2',
    verifiedAt: '2026-09-18 09:42:15 IST',
    status: 'VERIFIED',
    latencyMs: 142,
    details: {
      'GSTIN Status': 'Active (Regular Taxpayer)',
      'Legal Name': 'Shree Tech Solutions Private Limited',
      'Filing Compliance': 'GSTR-1 & GSTR-3B Regular (No default)',
      'Jurisdiction': 'State Tax Ward 14, Chennai Central',
    },
  },
  {
    portalName: 'Udyam MSME Registry (MoMSME)',
    portalCode: 'UDYAM-GOV',
    verifiedAt: '2026-09-18 09:42:16 IST',
    status: 'VERIFIED',
    latencyMs: 185,
    details: {
      'Udyam Number': 'UDYAM-TN-02-0045129',
      'Enterprise Type': 'Medium Enterprise',
      'Major Activity': 'Services & Custom Integration (NIC 6201)',
      'Aadhaar / OTP Authentication': 'Verified & Sealed',
    },
  },
  {
    portalName: 'Income Tax Department (NSDL/e-Filing)',
    portalCode: 'ITD-PAN-VER',
    verifiedAt: '2026-09-18 09:42:17 IST',
    status: 'MATCH',
    latencyMs: 110,
    details: {
      'PAN': 'AABCS1234D',
      'PAN Status': 'Active & Operational',
      'Aadhaar / MCA Seeding': 'Compliant',
      'Name Match Score': '99.4% Exact Match',
    },
  },
  {
    portalName: 'GeM Debarment & Vigilance Registry',
    portalCode: 'GEM-DEBAR',
    verifiedAt: '2026-09-18 09:42:18 IST',
    status: 'VERIFIED',
    latencyMs: 95,
    details: {
      'Blacklist Status': 'Clear (No Active Debarment Orders)',
      'CPPP Registry Check': 'Nil Adverse Reports',
      'Performance Incident Count': '0 reported in last 24 months',
    },
  },
];

export const SAMPLE_BIDDER_DOCUMENTS: BidderDocumentItem[] = [
  {
    id: 'doc-1',
    title: 'Form GST REG-06 Certificate',
    fileName: 'ShreeTech_GST_REG06_Signed.pdf',
    fileSize: '412 KB',
    uploadDate: '2026-09-14',
    status: 'Verified',
    confidence: 99,
    extractedSnippet: 'Government of India - Form GST REG-06. Reg No: 33AABCS1234D1ZP. Legal Name: Shree Tech Solutions Private Limited.',
    matchDetails: 'Matches GSTN database legal name and active jurisdiction without discrepancies.',
  },
  {
    id: 'doc-2',
    title: 'Permanent Account Number (PAN Card)',
    fileName: 'ShreeTech_PAN_Corporate.pdf',
    fileSize: '280 KB',
    uploadDate: '2026-09-14',
    status: 'Verified',
    confidence: 99,
    extractedSnippet: 'Income Tax Department - PAN: AABCS1234D. Name: SHREE TECH SOLUTIONS PRIVATE LIMITED.',
    matchDetails: 'Matches MCA incorporation master data and ITD PAN repository.',
  },
  {
    id: 'doc-3',
    title: 'Udyam Registration Certificate',
    fileName: 'Udyam_Certificate_TN02_2026.pdf',
    fileSize: '340 KB',
    uploadDate: '2026-09-14',
    status: 'Verified',
    confidence: 97,
    extractedSnippet: 'Ministry of MSME - Udyam Registration No: UDYAM-TN-02-0045129. Enterprise Name: Shree Tech Solutions Pvt. Ltd.',
    matchDetails: 'QR Code cryptographically validated against MSME digital signature authority.',
  },
  {
    id: 'doc-4',
    title: 'Manufacturer Authorization Form (OEM MAF)',
    fileName: 'HP_OEM_Authorization_2026_CPCL.pdf',
    fileSize: '520 KB',
    uploadDate: '2026-09-15',
    status: 'Pending Review',
    confidence: 88,
    extractedSnippet: 'OEM Partner Authorization: Ref HP-IN-2026-9014. Authorized Bidder: Shree Tech Solutions Pvt. Ltd. Validity: Nov 2026.',
    matchDetails: 'Tender period requires coverage through Dec 2026. Requires officer verification for 1-month buffer.',
  },
  {
    id: 'doc-5',
    title: 'CA Certified Turnover Certificate with UDIN',
    fileName: 'Turnover_UDIN_Certified_FY25.pdf',
    fileSize: '390 KB',
    uploadDate: '2026-09-14',
    status: 'Verified',
    confidence: 96,
    extractedSnippet: 'Chartered Accountants Certificate. UDIN: 26034189AAAA9912. 3-Year Average Turnover: ₹ 6.80 Crores.',
    matchDetails: 'Exceeds tender minimum threshold of ₹ 4.00 Cr.',
  },
  {
    id: 'doc-6',
    title: 'Make in India Local Content Declaration',
    fileName: 'MII_Local_Content_Self_Declaration.pdf',
    fileSize: '210 KB',
    uploadDate: '2026-09-15',
    status: 'Verified',
    confidence: 94,
    extractedSnippet: 'Self-certification under PPP-MII Order 2017: Local content calculated at 62% for enterprise hardware components.',
    matchDetails: 'Qualifies as Class-I Local Supplier (>= 50%).',
  },
];

export const SAMPLE_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Bid Evaluation Required',
    description: 'Shree Tech Solutions submitted documents for GEM/2025/0167. AI initial score: 92%.',
    time: '12 mins ago',
    unread: true,
    tag: 'Tender Evaluation',
    type: 'info',
  },
  {
    id: 'notif-2',
    title: 'Discrepancy Flagged',
    description: 'Bright Future Enterprises (GEM/2025/0139) shows turnover below mandatory ₹3.5 Cr threshold.',
    time: '45 mins ago',
    unread: true,
    tag: 'Compliance Alert',
    type: 'warning',
  },
  {
    id: 'notif-3',
    title: 'Portal Sync Completed',
    description: 'GSTN and Udyam MSME batch verification synchronized successfully for 128 active bidders.',
    time: '2 hours ago',
    unread: true,
    tag: 'System Sync',
    type: 'success',
  },
];

export const SAMPLE_AUDIT_TRAIL: AuditLogItem[] = [
  {
    id: 'aud-1',
    timestamp: '2026-09-18 09:42:20 IST',
    action: 'AI Verification Analysis Complete',
    actor: 'GeM AI Engine (v2.4)',
    role: 'Automated Service',
    bidderName: 'Shree Tech Solutions Pvt. Ltd.',
    statusTag: 'COMPLIANT (92%)',
    details: 'Completed multi-portal cross verification across GSTN, Udyam, NSDL PAN, and Debarment registry. Flagged OEM validity for officer confirmation.',
  },
  {
    id: 'aud-2',
    timestamp: '2026-09-17 16:30:12 IST',
    action: 'Officer Clarification Requested',
    actor: 'Rajeev Ramanathan',
    role: 'Procurement Officer',
    bidderName: 'Global Traders Ltd.',
    statusTag: 'CLARIFICATION_SENT',
    details: 'Requested certified proof of Q1 GSTR-3B return payment receipt within 48 hours.',
  },
  {
    id: 'aud-3',
    timestamp: '2026-09-17 14:15:05 IST',
    action: 'Bid Dossier Ingestion',
    actor: 'GeM Ingestion Gateway',
    role: 'System',
    bidderName: 'Bright Future Enterprises',
    statusTag: 'SUBMITTED',
    details: 'Received 5 statutory PDF attachments for Tender GEM-TND-2025-790.',
  },
  {
    id: 'aud-4',
    timestamp: '2026-09-16 11:04:48 IST',
    action: 'Officer Final Award Qualified',
    actor: 'Rajeev Ramanathan',
    role: 'Procurement Officer',
    bidderName: 'MSME Infra Pvt. Ltd.',
    statusTag: 'QUALIFIED_BY_OFFICER',
    details: 'Procurement Officer confirmed qualification after reviewing CA turnover UDIN certification and active Udyam exemption.',
  },
];

export const TENDERS_LIST = [
  {
    id: 'GEM-TND-2025-881',
    title: 'Supply, Turnkey Deployment & 3-Year Enterprise Cloud Infrastructure Maintenance',
    department: 'Chennai Petroleum Corporation Limited (CPCL) / MoPNG',
    estimatedValue: '₹ 4.85 Cr',
    deadline: '30 Sep 2026',
    biddersCount: 14,
    status: 'Evaluation Active',
    category: 'IT Hardware & Cloud',
  },
  {
    id: 'GEM-TND-2025-790',
    title: 'Unified Communication & Ruggedized Surveillance Hardware Fleet',
    department: 'Ministry of Home Affairs / Border Surveillance Directorate',
    estimatedValue: '₹ 8.20 Cr',
    deadline: '14 Oct 2026',
    biddersCount: 9,
    status: 'Technical Scrutiny',
    category: 'Electronics & Defense',
  },
  {
    id: 'GEM-TND-2025-654',
    title: 'Optical Fiber & Edge Routing Network Modernization',
    department: 'NHPC Limited (Govt. of India Enterprise)',
    estimatedValue: '₹ 2.40 Cr',
    deadline: '05 Oct 2026',
    biddersCount: 18,
    status: 'Evaluation Active',
    category: 'Networking Infrastructure',
  },
  {
    id: 'GEM-TND-2025-502',
    title: 'Medical Grade Diagnostic Imaging Equipments & Turnkey AMC',
    department: 'All India Institute of Medical Sciences (AIIMS) New Delhi',
    estimatedValue: '₹ 12.50 Cr',
    deadline: '22 Oct 2026',
    biddersCount: 11,
    status: 'Bid Submission Closed',
    category: 'Healthcare & Medical Devices',
  },
];
