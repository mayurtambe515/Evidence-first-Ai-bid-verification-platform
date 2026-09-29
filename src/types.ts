export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type CheckStatus = 'PASS' | 'WARNING' | 'FAIL';
export type OfficerDecision = 'APPROVE' | 'REJECT' | 'REQUEST_CLARIFICATION';
export type UserRole = 'BIDDER' | 'OFFICER' | 'AUDITOR';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  designation: string;
  department: string;
  avatarInitials?: string;
  idNumber?: string;
  organization?: string;
}

export interface TenderPastHistoryItem {
  tenderRef: string;
  authority: string;
  year: string;
  status: 'CLEAN' | 'WARNING' | 'FAILED' | 'DISQUALIFIED';
  complianceScore: number;
  flagSummary?: string;
}

export interface BidderRiskHistory {
  totalTendersSubmitted: number;
  flaggedTendersCount: number;
  cleanTendersCount: number;
  repeatFlagRatio: string;
  riskTrend: 'STABLE_LOW' | 'HIGH_VOLATILITY' | 'PERSISTENT_DEFECTS';
  summary: string;
  pastTenders: TenderPastHistoryItem[];
}

export interface SideBySideComparisonData {
  title: string;
  requirementName: string;
  discrepancyType: string;
  explanation: string;
  ruleCitation: string;
  docA: {
    title: string;
    source: string;
    highlightField: string;
    highlightValue: string;
    confidence?: number;
    uploadDate?: string;
    rawSnippet?: string;
    status: string;
  };
  docB: {
    title: string;
    source: string;
    highlightField: string;
    highlightValue: string;
    verifiedAt?: string;
    registryRecord?: string;
    status: string;
  };
}

export interface Tender {
  id: string;
  refNumber: string;
  title: string;
  authority: string;
  category: string;
  estimatedValue: string;
  deadline: string;
  publishingDate: string;
  minAnnualTurnoverCr: number;
  requiresOEMAuthorization: boolean;
  requiresActiveUdyamMSME: boolean;
  requiredDocuments: string[];
  description: string;
}

export interface ExtractedFieldItem {
  label: string;
  key: string;
  value: string;
  confidence: number;
  highlight?: boolean;
}

export interface BidderDocument {
  id: string;
  type: 'gst' | 'pan' | 'udyam' | 'oem_auth' | 'turnover_cert' | 'other';
  title: string;
  fileName: string;
  uploadDate: string;
  fileSize: string;
  status: 'EXTRACTED' | 'MISSING' | 'EXPIRED' | 'CONTRADICTORY';
  rawSnippet?: string;
  extractedFields: Record<string, string>;
  confidence: number;
}

export interface GovernmentPortalRecord {
  portalName: string;
  portalType: 'GSTN' | 'UDYAM' | 'PAN_NSDL' | 'OEM_REGISTRY';
  status: string;
  isSimulated: boolean;
  verifiedAt: string;
  fields: Record<string, string>;
}

export interface ContradictionHighlight {
  field: string;
  doc1Label: string;
  doc1Value: string;
  doc2Label: string;
  doc2Value: string;
  discrepancyType: 'SPELLING_TYPO' | 'LEGAL_ENTITY_MISMATCH' | 'ADDRESS_CONFLICT' | 'EXPIRY_VIOLATION' | 'STATUS_CONFLICT';
  explanation: string;
}

export interface ComplianceRule {
  id: string;
  code: string;
  title: string;
  category: 'IDENTITY' | 'TAX_COMPLIANCE' | 'MSME_CRITERIA' | 'TECHNICAL_OEM' | 'FINANCIAL_TURNOVER';
  description: string;
  severityIfFailed: 'FAIL' | 'WARNING';
  weight: number;
  enabled: boolean;
  conditionDescription: string;
}

export interface ComplianceEvidenceItem {
  ruleId: string;
  ruleCode: string;
  ruleTitle: string;
  status: CheckStatus;
  documentSource: string;
  documentField: string;
  extractedValue: string;
  expectedPortalValue: string;
  matchedPortal: string;
  ruleCitation: string;
  explanation: string;
  aiConfidence: number;
  contradiction?: ContradictionHighlight;
}

export interface OfficerOverride {
  isOverridden: boolean;
  officerName: string;
  officerDesignation: string;
  officerId: string;
  decision: OfficerDecision;
  justification: string;
  timestamp: string;
}

export interface Bidder {
  id: string;
  tenderId: string;
  name: string;
  registeredLegalName: string;
  gstin: string;
  pan: string;
  udyamNumber: string;
  oemCertNumber: string;
  turnoverCr: number;
  submissionDate: string;
  scenarioTag: 'CLEAN_COMPLIANT' | 'MISSING_EXPIRED' | 'SUBTLE_CONTRADICTION' | 'CUSTOM';
  scenarioDescription: string;
  documents: BidderDocument[];
  portals: {
    gstn?: GovernmentPortalRecord;
    udyam?: GovernmentPortalRecord;
    pan?: GovernmentPortalRecord;
    oem?: GovernmentPortalRecord;
  };
  officerOverride?: OfficerOverride;
  lastEvaluatedScore?: number;
  lastEvaluatedRisk?: RiskLevel;
  riskHistory?: BidderRiskHistory;
}

export interface AuditLogEntry {
  id: string;
  blockNumber?: number;
  timestamp: string;
  tenderId: string;
  tenderRef: string;
  tenderTitle: string;
  bidderId: string;
  bidderName: string;
  score: number;
  riskLevel: RiskLevel;
  totalChecks: number;
  passedChecks: number;
  warningChecks: number;
  failedChecks: number;
  officerOverride?: OfficerOverride;
  previousHash?: string;
  hashSignature: string;
}

export interface BidderData {
  id: string;
  index?: number;
  name: string;
  pan: string;
  gstin: string;
  bidId: string;
  complianceScore: number;
  status: 'Compliant' | 'Partial' | 'Non-Compliant' | string;
  riskLevel: 'Low' | 'Medium' | 'High' | string;
  tenderId?: string;
  tenderTitle?: string;
  turnoverCr?: number;
  udyamNumber?: string;
  udyam?: string;
  oemStatus?: string;
  gstStatus?: string;
  localContentPercent?: number;
  companyType?: string;
  registeredAddress?: string;
  officerDecision?: any;
  officerRemarks?: string;
}

export interface TenderRequirement {
  id: string;
  name?: string;
  title?: string;
  code?: string;
  isMandatory?: boolean;
  mandatory?: boolean;
  category?: string;
  verificationSource?: string;
  description?: string;
  type?: string;
  weight?: number;
}

