export type UserRole = 'OFFICER' | 'BIDDER' | 'AUDITOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  designation?: string;
  createdAt: string;
}

export interface TenderRequirement {
  id: string;
  tenderId: string;
  code: string;
  title: string;
  description: string;
  category: 'STATUTORY' | 'FINANCIAL' | 'TECHNICAL' | 'POLICY';
  isMandatory: boolean;
  expectedDocumentType?: string;
  threshold?: number | string;
  verificationSource?: string;
  weight: number;
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
  status: 'OPEN' | 'UNDER_EVALUATION' | 'AWARDED' | 'CLOSED';
  requirements: TenderRequirement[];
  description: string;
  createdAt: string;
}

export interface BidderDocument {
  id: string;
  bidderId: string;
  tenderId?: string;
  documentType: string;
  title: string;
  fileName: string;
  fileSize: string;
  fileUrl?: string;
  rawText?: string;
  extractedData?: Record<string, any>;
  aiConfidence?: number;
  status: 'VERIFIED' | 'PENDING' | 'REQUIRES_REVIEW' | 'FLAGGED';
  uploadedAt: string;
}

export interface Bidder {
  id: string;
  tenderId: string;
  bidId: string; // e.g. GEM/2025/0167
  name: string; // e.g. Shree Tech Solutions Pvt. Ltd.
  pan: string; // e.g. AABCS1234D
  gstin: string; // e.g. 27ABCDE1234F1Z5
  udyamNumber?: string;
  turnoverCr: number;
  status: 'Compliant' | 'Partial' | 'Non-Compliant' | 'PENDING';
  riskLevel: 'Low' | 'Medium' | 'High';
  complianceScore: number;
  localContentPercent: number;
  remarks?: string;
  finalDecision?: {
    decision: 'QUALIFIED' | 'DISQUALIFIED' | 'FURTHER_REVIEW';
    officerId: string;
    officerName: string;
    remarks: string;
    evidenceReviewed: string[];
    timestamp: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface VerificationResult {
  id: string;
  bidderId: string;
  serviceName: string; // gst, udyam, pan, mca, epfo, esic, startup, nsic
  isMockData: boolean;
  status: 'VERIFIED' | 'MISMATCH' | 'NOT_FOUND' | 'PENDING' | 'REQUIRES_REVIEW';
  data: Record<string, any>;
  verifiedAt: string;
}

export type FindingStatus =
  | 'VERIFIED'
  | 'PENDING'
  | 'MISSING'
  | 'MISMATCH'
  | 'NOT_APPLICABLE'
  | 'REQUIRES_REVIEW';

export type FindingSeverity = 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export interface ComplianceFinding {
  id: string;
  bidderId: string;
  requirementCode: string;
  requirementTitle: string;
  category: string;
  isMandatory: boolean;
  status: FindingStatus;
  severity: FindingSeverity;
  evidence: string;
  reason: string;
  recommendedAction?: string;
  verifiedSource?: string;
}

export interface ComplianceScoreReport {
  bidderId: string;
  totalRequirements: number;
  verifiedCount: number;
  pendingCount: number;
  missingCount: number;
  mismatchCount: number;
  notApplicableCount: number;
  requiresReviewCount: number;
  complianceScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  riskScore: number;
  disclaimer: string;
  mandatoryStatusSummary: {
    totalMandatory: number;
    satisfiedMandatory: number;
    flaggedMandatory: number;
  };
  findings: ComplianceFinding[];
  aiRecommendation?: {
    summary: string;
    recommendedActions: string[];
    advisoryNote: string;
  };
}

export interface OfficerDecision {
  id: string;
  bidderId: string;
  officerId: string;
  officerName: string;
  officerDesignation: string;
  decision: 'QUALIFIED' | 'DISQUALIFIED' | 'FURTHER_REVIEW';
  remarks: string;
  evidenceReviewed: string[];
  timestamp: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userRole?: string;
  action:
    | 'BIDDER_CREATED'
    | 'DOCUMENT_UPLOADED'
    | 'DOCUMENT_ANALYZED'
    | 'GST_VERIFIED'
    | 'UDYAM_VERIFIED'
    | 'PAN_VERIFIED'
    | 'MCA_VERIFIED'
    | 'EPFO_VERIFIED'
    | 'ESIC_VERIFIED'
    | 'STARTUP_VERIFIED'
    | 'NSIC_VERIFIED'
    | 'COMPLIANCE_CHECKED'
    | 'RISK_GENERATED'
    | 'OFFICER_REMARK_ADDED'
    | 'FINAL_DECISION_RECORDED';
  entity: 'BIDDER' | 'DOCUMENT' | 'TENDER' | 'DECISION' | 'VERIFICATION';
  entityId: string;
  details: Record<string, any>;
  hash?: string;
  previousHash?: string;
}
