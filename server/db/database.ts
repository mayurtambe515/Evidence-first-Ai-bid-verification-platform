import { Pool } from 'pg';
import {
  User,
  Tender,
  TenderRequirement,
  Bidder,
  BidderDocument,
  VerificationResult,
  ComplianceFinding,
  OfficerDecision,
  AuditLog,
} from '../types';

// Default PostgreSQL connection string (Neon Managed Instance)
const DEFAULT_DATABASE_URL =
  'postgresql://neondb_owner:npg_u0xmesZhR8QO@ep-odd-bread-b5ek5mgp-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

// Check if PostgreSQL is configured
let pgPool: Pool | null = null;

export function getPgPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL || DEFAULT_DATABASE_URL;

  if (!pgPool && connectionString) {
    try {
      pgPool = new Pool({
        connectionString,
        ssl: connectionString.includes('localhost')
          ? false
          : { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 30000,
        max: 10,
      });

      pgPool.on('error', (err) => {
        console.warn('[PostgreSQL Pool Internal Error]', err.message);
      });

      console.log('[PostgreSQL] Pool initialized successfully via DATABASE_URL');
    } catch (err: any) {
      console.warn('[PostgreSQL] Failed to initialize PostgreSQL pool, falling back to persistent store:', err.message);
      pgPool = null;
    }
  }
  return pgPool;
}

// In-Memory fallback store that mirrors PostgreSQL tables
class DatabaseStore {
  public users: Map<string, User> = new Map();
  public tenders: Map<string, Tender> = new Map();
  public tenderRequirements: Map<string, TenderRequirement[]> = new Map();
  public bidders: Map<string, Bidder> = new Map();
  public documents: Map<string, BidderDocument> = new Map();
  public verificationResults: Map<string, VerificationResult[]> = new Map();
  public complianceFindings: Map<string, ComplianceFinding[]> = new Map();
  public officerDecisions: Map<string, OfficerDecision> = new Map();
  public auditLogs: AuditLog[] = [];

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // 1. Seed Users
    const usersList: User[] = [
      {
        id: 'usr-officer-1',
        email: 'officer@gem.gov.in',
        name: 'Rajeev Ramanathan',
        role: 'OFFICER',
        department: 'Central Public Procurement Directorate',
        designation: 'Chief Procurement Officer (Grade I)',
        createdAt: '2026-01-01T09:00:00Z',
      },
      {
        id: 'usr-bidder-1',
        email: 'bidder@apextech.in',
        name: 'Suresh Sharma',
        role: 'BIDDER',
        department: 'Commercial Bid Division',
        designation: 'Managing Director, Apex Technologies',
        createdAt: '2026-01-01T09:00:00Z',
      },
      {
        id: 'usr-auditor-1',
        email: 'auditor@cag.gov.in',
        name: 'Anita Desai',
        role: 'AUDITOR',
        department: 'Comptroller and Auditor General of India (CAG)',
        designation: 'Principal Director of Audit',
        createdAt: '2026-01-01T09:00:00Z',
      },
    ];
    usersList.forEach((u) => this.users.set(u.id, u));

    // 2. Seed Tenders & Requirements
    const tender1Requirements: TenderRequirement[] = [
      {
        id: 'req-1',
        tenderId: 'GEM-TND-2025-881',
        code: 'R-GST-ACT',
        title: 'GST Active Status & Timely Filing',
        description: 'Bidder must possess active GST registration with no delayed return notices.',
        category: 'STATUTORY',
        isMandatory: true,
        expectedDocumentType: 'GST_CERTIFICATE',
        threshold: 'Active REG-06',
        verificationSource: 'GSTN Gateway API',
        weight: 20,
      },
      {
        id: 'req-2',
        tenderId: 'GEM-TND-2025-881',
        code: 'R-PAN-MAT',
        title: 'Income Tax PAN & Legal Entity Matching',
        description: 'PAN name and corporate constitution must match bid records on NSDL.',
        category: 'STATUTORY',
        isMandatory: true,
        expectedDocumentType: 'PAN_CARD',
        threshold: 'Valid & Operative',
        verificationSource: 'NSDL PAN Registry',
        weight: 20,
      },
      {
        id: 'req-3',
        tenderId: 'GEM-TND-2025-881',
        code: 'R-UDYAM-ACT',
        title: 'Udyam MSME Registry Verification',
        description: 'Valid Udyam Registration for statutory MSME preference / EMD waiver.',
        category: 'POLICY',
        isMandatory: false,
        expectedDocumentType: 'UDYAM_CERTIFICATE',
        threshold: 'Active Classification',
        verificationSource: 'Ministry of MSME Registry',
        weight: 15,
      },
      {
        id: 'req-4',
        tenderId: 'GEM-TND-2025-881',
        code: 'R-OEM-REQ',
        title: 'Direct OEM Authorization (MAF) Validity',
        description: 'Tier-1 OEM Manufacturer Authorization Form covering 3-year support.',
        category: 'TECHNICAL',
        isMandatory: true,
        expectedDocumentType: 'OEM_AUTHORIZATION',
        threshold: 'Valid Till Nov 2026+',
        verificationSource: 'OEM Partner Verification Service',
        weight: 25,
      },
      {
        id: 'req-5',
        tenderId: 'GEM-TND-2025-881',
        code: 'R-MII-CLASS',
        title: 'Make in India (MII) Local Content Declaration',
        description: 'Minimum 50% local content required for Class-I Local Supplier preference.',
        category: 'POLICY',
        isMandatory: true,
        expectedDocumentType: 'MAKE_IN_INDIA_DECLARATION',
        threshold: '>= 50%',
        verificationSource: 'Self-Certified CA Undertaking',
        weight: 10,
      },
      {
        id: 'req-6',
        tenderId: 'GEM-TND-2025-881',
        code: 'R-TURN-MIN',
        title: 'Minimum 3-Year Audited Annual Turnover',
        description: 'Audited annual turnover must meet or exceed required ₹4.00 Cr.',
        category: 'FINANCIAL',
        isMandatory: true,
        expectedDocumentType: 'TURNOVER_CERTIFICATE',
        threshold: '>= ₹ 4.00 Cr',
        verificationSource: 'ICAI UDIN Registry',
        weight: 10,
      },
    ];

    const t1: Tender = {
      id: 'GEM-TND-2025-881',
      refNumber: 'GEM/2025/B/881902',
      title: 'Supply & 3-Year Enterprise Cloud Infrastructure Maintenance',
      authority: 'National Informatics Centre Services Inc. (NICSI)',
      category: 'IT Hardware & Cloud Infrastructure',
      estimatedValue: '₹ 5,20,00,000 (INR 5.20 Cr)',
      deadline: '2026-10-15 17:00 IST',
      publishingDate: '2026-09-01',
      minAnnualTurnoverCr: 4.0,
      requiresOEMAuthorization: true,
      requiresActiveUdyamMSME: true,
      status: 'UNDER_EVALUATION',
      requirements: tender1Requirements,
      description: 'Procurement of mission-critical cloud server nodes, hyperconverged storage, and enterprise OEM 24x7 support.',
      createdAt: '2026-09-01T10:00:00Z',
    };

    const t2: Tender = {
      id: 'CPCL-2026-001',
      refNumber: 'CPCL-2026-001',
      title: 'Supply, Turnkey Deployment & 5-Year Maintenance of Enterprise Server Arrays',
      authority: 'Chennai Petroleum Corporation Limited (CPCL) / MoPNG',
      category: 'Enterprise Data Center Hardware',
      estimatedValue: '₹ 4,85,00,000 (INR 4.85 Cr)',
      deadline: '2026-09-30 17:00 IST',
      publishingDate: '2026-08-15',
      minAnnualTurnoverCr: 3.5,
      requiresOEMAuthorization: true,
      requiresActiveUdyamMSME: true,
      status: 'UNDER_EVALUATION',
      requirements: tender1Requirements,
      description: 'Mission-critical refinery process compute nodes with 24x7 OEM enterprise SLA support.',
      createdAt: '2026-08-15T09:00:00Z',
    };

    this.tenders.set(t1.id, t1);
    this.tenders.set(t2.id, t2);
    this.tenderRequirements.set(t1.id, tender1Requirements);
    this.tenderRequirements.set(t2.id, tender1Requirements);

    // 3. Seed Bidders (including Shree Tech Solutions Pvt. Ltd. as Primary Demo Bidder)
    const primaryBidder: Bidder = {
      id: 'bidder-1',
      tenderId: 'GEM-TND-2025-881',
      bidId: 'GEM/2025/0167',
      name: 'Shree Tech Solutions Pvt. Ltd.',
      pan: 'AABCS1234D',
      gstin: '27ABCDE1234F1Z5',
      udyamNumber: 'UDYAM-TN-02-0045129',
      turnoverCr: 6.8,
      status: 'Compliant',
      riskLevel: 'Low',
      complianceScore: 92,
      localContentPercent: 62,
      remarks: 'Primary demo bidder with verified GST, PAN, Udyam, MCA; OEM authorization pending procurement officer validity check.',
      createdAt: '2026-09-14T15:20:10Z',
      updatedAt: '2026-09-18T09:42:20Z',
    };

    const bidder2: Bidder = {
      id: 'bidder-2',
      tenderId: 'GEM-TND-2025-881',
      bidId: 'GEM/2025/0142',
      name: 'Apex Technologies Private Limited',
      pan: 'AAAAA0000A',
      gstin: '07AAAAA0000A1Z5',
      udyamNumber: 'UDYAM-DL-01-0012345',
      turnoverCr: 8.5,
      status: 'Compliant',
      riskLevel: 'Low',
      complianceScore: 96,
      localContentPercent: 70,
      remarks: 'All documents fully verified with 100% statutory clearance.',
      createdAt: '2026-09-13T11:00:00Z',
      updatedAt: '2026-09-17T14:30:00Z',
    };

    const bidder3: Bidder = {
      id: 'bidder-3',
      tenderId: 'GEM-TND-2025-881',
      bidId: 'GEM/2025/0189',
      name: 'Bharat Logistics & Hardware Solutions LLP',
      pan: 'BBBBB1111B',
      gstin: '27BBBBB1111B1Z2',
      udyamNumber: 'UDYAM-MH-02-0098765',
      turnoverCr: 3.2,
      status: 'Partial',
      riskLevel: 'High',
      complianceScore: 64,
      localContentPercent: 45,
      remarks: 'Turnover below threshold, delayed GST returns, expired Udyam classification.',
      createdAt: '2026-09-15T16:45:00Z',
      updatedAt: '2026-09-18T10:15:00Z',
    };

    const bidder4: Bidder = {
      id: 'bidder-4',
      tenderId: 'GEM-TND-2025-881',
      bidId: 'GEM/2025/0198',
      name: 'Vertex Infotech Solutions Limited',
      pan: 'CCCCC2222C',
      gstin: '09CCCCC2222C1Z8',
      udyamNumber: 'UDYAM-GJ-03-0054321',
      turnoverCr: 5.1,
      status: 'Non-Compliant',
      riskLevel: 'High',
      complianceScore: 48,
      localContentPercent: 30,
      remarks: 'Corporate entity constitution mismatch (LLP in GST vs Limited in PAN).',
      createdAt: '2026-09-16T12:10:00Z',
      updatedAt: '2026-09-18T11:00:00Z',
    };

    this.bidders.set(primaryBidder.id, primaryBidder);
    this.bidders.set(bidder2.id, bidder2);
    this.bidders.set(bidder3.id, bidder3);
    this.bidders.set(bidder4.id, bidder4);

    // 4. Seed Demo Documents for Shree Tech Solutions Pvt. Ltd.
    const docs: BidderDocument[] = [
      {
        id: 'doc-1',
        bidderId: 'bidder-1',
        tenderId: 'GEM-TND-2025-881',
        documentType: 'GST_CERTIFICATE',
        title: 'GST Registration Certificate (Form GST REG-06)',
        fileName: 'ShreeTech_GST_REG06_2026.pdf',
        fileSize: '1.4 MB',
        status: 'VERIFIED',
        aiConfidence: 0.98,
        rawText: 'Government of India Form GST REG-06 Registration Certificate. GSTIN: 27ABCDE1234F1Z5. Legal Name: Shree Tech Solutions Pvt. Ltd. Date of Registration: 18-05-2018. Status: Active.',
        extractedData: {
          documentType: 'GST_CERTIFICATE',
          companyName: 'Shree Tech Solutions Pvt. Ltd.',
          gstin: '27ABCDE1234F1Z5',
          registrationDate: '2018-05-18',
          status: 'Active',
          fieldsFound: ['GSTIN', 'Legal Name', 'Date of Registration', 'Taxpayer Type'],
          missingFields: [],
          observations: ['Matches official national GST portal record.'],
        },
        uploadedAt: '2026-09-14T15:20:10Z',
      },
      {
        id: 'doc-2',
        bidderId: 'bidder-1',
        tenderId: 'GEM-TND-2025-881',
        documentType: 'PAN_CARD',
        title: 'Permanent Account Number (PAN Card)',
        fileName: 'ShreeTech_PAN_Card.pdf',
        fileSize: '850 KB',
        status: 'VERIFIED',
        aiConfidence: 0.99,
        rawText: 'Income Tax Department, Govt of India. PAN: AABCS1234D. Name: Shree Tech Solutions Pvt. Ltd. Date of Incorporation: 10-04-2018.',
        extractedData: {
          documentType: 'PAN_CARD',
          companyName: 'Shree Tech Solutions Pvt. Ltd.',
          pan: 'AABCS1234D',
          entityType: 'Company (Private Limited)',
          fieldsFound: ['PAN', 'Name', 'Incorporation Date'],
          missingFields: [],
          observations: ['4th character C confirms Corporate Entity.'],
        },
        uploadedAt: '2026-09-14T15:20:12Z',
      },
      {
        id: 'doc-3',
        bidderId: 'bidder-1',
        tenderId: 'GEM-TND-2025-881',
        documentType: 'UDYAM_CERTIFICATE',
        title: 'Udyam Registration Certificate (MSME)',
        fileName: 'ShreeTech_Udyam_Registration.pdf',
        fileSize: '1.1 MB',
        status: 'VERIFIED',
        aiConfidence: 0.96,
        rawText: 'Ministry of Micro, Small and Medium Enterprises. UDYAM REGISTRATION NUMBER: UDYAM-TN-02-0045129. Name: Shree Tech Solutions Pvt. Ltd. Enterprise Type: Medium.',
        extractedData: {
          documentType: 'UDYAM_CERTIFICATE',
          companyName: 'Shree Tech Solutions Pvt. Ltd.',
          udyamNumber: 'UDYAM-TN-02-0045129',
          enterpriseType: 'Medium',
          majorActivity: 'Services & Infrastructure',
          fieldsFound: ['Udyam Number', 'Enterprise Type', 'Activity Code'],
          missingFields: [],
          observations: ['Active MSME classification.'],
        },
        uploadedAt: '2026-09-14T15:20:15Z',
      },
      {
        id: 'doc-4',
        bidderId: 'bidder-1',
        tenderId: 'GEM-TND-2025-881',
        documentType: 'OEM_AUTHORIZATION',
        title: 'Manufacturer Authorization Form (MAF)',
        fileName: 'OEM_Direct_MAF_Dell_Nov2026.pdf',
        fileSize: '2.3 MB',
        status: 'REQUIRES_REVIEW',
        aiConfidence: 0.89,
        rawText: 'Manufacturer Authorization Form. Issued by Dell Global B.V. To: Shree Tech Solutions Pvt. Ltd. Ref: GEM-TND-2025-881. Expiry Date: 30-Nov-2026.',
        extractedData: {
          documentType: 'OEM_AUTHORIZATION',
          companyName: 'Shree Tech Solutions Pvt. Ltd.',
          oemName: 'Dell Enterprise Solutions',
          authorizationExpiry: '2026-11-30',
          fieldsFound: ['OEM Name', 'Bidder Authorization', 'Tender Reference', 'Expiry Date'],
          missingFields: [],
          observations: [
            'MAF expiry is 30-Nov-2026; tender spans 3 years post-deployment. Procurement Officer should confirm OEM extended warranty commitment.',
          ],
        },
        uploadedAt: '2026-09-14T15:20:20Z',
      },
      {
        id: 'doc-5',
        bidderId: 'bidder-1',
        tenderId: 'GEM-TND-2025-881',
        documentType: 'MAKE_IN_INDIA_DECLARATION',
        title: 'Make in India (MII) Local Content Declaration',
        fileName: 'MII_LocalContent_Declaration_62Pct.pdf',
        fileSize: '920 KB',
        status: 'REQUIRES_REVIEW',
        aiConfidence: 0.91,
        rawText: 'Declaration under Public Procurement (Preference to Make in India) Order 2017. Local content is declared at 62% (Class-I Local Supplier). Location of value addition: Chennai, Tamil Nadu.',
        extractedData: {
          documentType: 'MAKE_IN_INDIA_DECLARATION',
          companyName: 'Shree Tech Solutions Pvt. Ltd.',
          localContentPercentage: 62,
          supplierClass: 'Class-I Local Supplier',
          fieldsFound: ['Local Content %', 'Location of Value Addition', 'Signatory'],
          missingFields: [],
          observations: ['Declared 62% meets Class-I requirement (>=50%). Supporting bill of materials subject to officer verification.'],
        },
        uploadedAt: '2026-09-14T15:20:25Z',
      },
    ];
    docs.forEach((d) => this.documents.set(d.id, d));

    // 5. Seed Mock Government Verification Results
    const verifications: VerificationResult[] = [
      {
        id: 'ver-gst-1',
        bidderId: 'bidder-1',
        serviceName: 'gstService',
        isMockData: true,
        status: 'VERIFIED',
        data: {
          portal: 'GSTN Gateway API (DEMO / MOCK DATA)',
          gstin: '27ABCDE1234F1Z5',
          legalName: 'Shree Tech Solutions Pvt. Ltd.',
          tradeName: 'Shree Tech Solutions',
          status: 'Active',
          taxpayerType: 'Regular',
          filingStatus: 'All GSTR-1 & GSTR-3B filings up to date',
          latencyMs: 142,
        },
        verifiedAt: '2026-09-18T09:42:18Z',
      },
      {
        id: 'ver-pan-1',
        bidderId: 'bidder-1',
        serviceName: 'panService',
        isMockData: true,
        status: 'VERIFIED',
        data: {
          portal: 'NSDL Income Tax PAN Registry (DEMO / MOCK DATA)',
          pan: 'AABCS1234D',
          legalName: 'Shree Tech Solutions Pvt. Ltd.',
          entityType: 'Company (Private Limited)',
          status: 'Valid & Operative',
          latencyMs: 118,
        },
        verifiedAt: '2026-09-18T09:42:17Z',
      },
      {
        id: 'ver-udyam-1',
        bidderId: 'bidder-1',
        serviceName: 'udyamService',
        isMockData: true,
        status: 'VERIFIED',
        data: {
          portal: 'Ministry of MSME Udyam Registry (DEMO / MOCK DATA)',
          udyamNumber: 'UDYAM-TN-02-0045129',
          enterpriseName: 'Shree Tech Solutions Pvt. Ltd.',
          enterpriseType: 'Medium',
          status: 'Active',
          latencyMs: 165,
        },
        verifiedAt: '2026-09-18T09:42:16Z',
      },
      {
        id: 'ver-mca-1',
        bidderId: 'bidder-1',
        serviceName: 'mcaService',
        isMockData: true,
        status: 'VERIFIED',
        data: {
          portal: 'Ministry of Corporate Affairs MCA21 (DEMO / MOCK DATA)',
          cin: 'U72900TN2018PTC123456',
          companyName: 'Shree Tech Solutions Pvt. Ltd.',
          status: 'Active / Registered',
          latencyMs: 210,
        },
        verifiedAt: '2026-09-18T09:42:15Z',
      },
    ];
    this.verificationResults.set('bidder-1', verifications);

    // 6. Seed Compliance Findings
    const findings: ComplianceFinding[] = [
      {
        id: 'f-1',
        bidderId: 'bidder-1',
        requirementCode: 'R-GST-ACT',
        requirementTitle: 'GST Active Registration Status',
        category: 'STATUTORY',
        isMandatory: true,
        status: 'VERIFIED',
        severity: 'LOW',
        evidence: 'GSTIN 27ABCDE1234F1Z5 active on GSTN Gateway; regular GSTR-3B filings confirmed.',
        reason: 'Statutory compliance satisfied under Central GST Act 2017.',
        verifiedSource: 'GSTN Gateway API',
      },
      {
        id: 'f-2',
        bidderId: 'bidder-1',
        requirementCode: 'R-PAN-MAT',
        requirementTitle: 'PAN Identity & Legal Structure',
        category: 'STATUTORY',
        isMandatory: true,
        status: 'VERIFIED',
        severity: 'LOW',
        evidence: 'PAN AABCS1234D matches Private Limited company classification on NSDL registry.',
        reason: 'Income Tax identity confirmed without discrepancies.',
        verifiedSource: 'NSDL PAN Registry',
      },
      {
        id: 'f-3',
        bidderId: 'bidder-1',
        requirementCode: 'R-UDYAM-ACT',
        requirementTitle: 'Udyam MSME Registry Status',
        category: 'POLICY',
        isMandatory: false,
        status: 'VERIFIED',
        severity: 'LOW',
        evidence: 'Udyam Certificate UDYAM-TN-02-0045129 valid active Medium Enterprise.',
        reason: 'Eligible for statutory MSME preference.',
        verifiedSource: 'Ministry of MSME Registry',
      },
      {
        id: 'f-4',
        bidderId: 'bidder-1',
        requirementCode: 'R-OEM-REQ',
        requirementTitle: 'OEM Direct Authorization (MAF)',
        category: 'TECHNICAL',
        isMandatory: true,
        status: 'REQUIRES_REVIEW',
        severity: 'MEDIUM',
        evidence: 'Dell OEM MAF expires on 30-Nov-2026. Tender requires 3-year support.',
        reason: 'Available evidence indicates authorization period is shorter than tender operational duration.',
        recommendedAction: 'Procurement Officer should review OEM warranty extension commitment.',
        verifiedSource: 'Submitted MAF Document',
      },
      {
        id: 'f-5',
        bidderId: 'bidder-1',
        requirementCode: 'R-MII-CLASS',
        requirementTitle: 'Make in India Local Content',
        category: 'POLICY',
        isMandatory: true,
        status: 'REQUIRES_REVIEW',
        severity: 'LOW',
        evidence: 'Declared local content is 62% (Class-I Supplier). Self-certified.',
        reason: 'Requires officer confirmation of supporting cost breakdown.',
        recommendedAction: 'Verify CA certificate and bill of materials.',
        verifiedSource: 'MII Declaration Undertaking',
      },
      {
        id: 'f-6',
        bidderId: 'bidder-1',
        requirementCode: 'R-TURN-MIN',
        requirementTitle: 'Annual Turnover Threshold',
        category: 'FINANCIAL',
        isMandatory: true,
        status: 'VERIFIED',
        severity: 'LOW',
        evidence: 'Audited turnover ₹ 6.80 Cr exceeds mandatory ₹ 4.00 Cr threshold.',
        reason: 'Financial criteria satisfied with UDIN verification.',
        verifiedSource: 'Audited Financial Statements',
      },
    ];
    this.complianceFindings.set('bidder-1', findings);

    // 7. Seed Audit Logs
    this.auditLogs = [
      {
        id: 'log-1',
        timestamp: '2026-09-14T15:20:10Z',
        user: 'GeM Portal Gateway',
        userRole: 'SYSTEM',
        action: 'BIDDER_CREATED',
        entity: 'BIDDER',
        entityId: 'bidder-1',
        details: {
          bidId: 'GEM/2025/0167',
          name: 'Shree Tech Solutions Pvt. Ltd.',
          tenderId: 'GEM-TND-2025-881',
        },
      },
      {
        id: 'log-2',
        timestamp: '2026-09-14T15:20:25Z',
        user: 'Bidder Representative',
        userRole: 'BIDDER',
        action: 'DOCUMENT_UPLOADED',
        entity: 'DOCUMENT',
        entityId: 'doc-1',
        details: {
          documentsCount: 5,
          types: ['GST_CERTIFICATE', 'PAN_CARD', 'UDYAM_CERTIFICATE', 'OEM_AUTHORIZATION', 'MAKE_IN_INDIA_DECLARATION'],
        },
      },
      {
        id: 'log-3',
        timestamp: '2026-09-18T09:42:15Z',
        user: 'GeM Automated Gateway',
        userRole: 'SYSTEM',
        action: 'GST_VERIFIED',
        entity: 'VERIFICATION',
        entityId: 'bidder-1',
        details: {
          gateway: 'GSTN Portal API (MOCK)',
          gstin: '27ABCDE1234F1Z5',
          result: 'Active & In Good Standing',
        },
      },
      {
        id: 'log-4',
        timestamp: '2026-09-18T09:42:16Z',
        user: 'GeM Automated Gateway',
        userRole: 'SYSTEM',
        action: 'UDYAM_VERIFIED',
        entity: 'VERIFICATION',
        entityId: 'bidder-1',
        details: {
          gateway: 'Udyam Registry (MOCK)',
          udyamNumber: 'UDYAM-TN-02-0045129',
          result: 'Valid Medium Enterprise',
        },
      },
      {
        id: 'log-5',
        timestamp: '2026-09-18T09:42:20Z',
        user: 'Compliance Rules Engine',
        userRole: 'SYSTEM',
        action: 'COMPLIANCE_CHECKED',
        entity: 'BIDDER',
        entityId: 'bidder-1',
        details: {
          complianceScore: 92,
          riskLevel: 'Low',
          verifiedCount: 4,
          requiresReviewCount: 2,
        },
      },
    ];
  }
}

export const dbStore = new DatabaseStore();

/**
 * Sync in-memory dbStore with records from PostgreSQL
 */
export async function syncStoreFromPostgres(pool: Pool): Promise<void> {
  const client = await pool.connect();
  try {
    // 1. Tenders
    const tendersRes = await client.query('SELECT * FROM tenders ORDER BY created_at ASC');
    for (const row of tendersRes.rows) {
      const tender: Tender = {
        id: row.id,
        refNumber: row.ref_number,
        title: row.title,
        authority: row.authority,
        category: row.category,
        estimatedValue: row.estimated_value,
        deadline: row.deadline,
        publishingDate: row.publishing_date,
        minAnnualTurnoverCr: parseFloat(row.min_annual_turnover_cr) || 0,
        requiresOEMAuthorization: Boolean(row.requires_oem_authorization),
        requiresActiveUdyamMSME: Boolean(row.requires_active_udyam_msme),
        status: row.status,
        requirements: [],
        description: row.description,
        createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      };
      dbStore.tenders.set(tender.id, tender);
    }

    // 2. Tender Requirements
    const reqsRes = await client.query('SELECT * FROM tender_requirements ORDER BY created_at ASC');
    const reqsByTender: Record<string, TenderRequirement[]> = {};
    for (const row of reqsRes.rows) {
      const req: TenderRequirement = {
        id: row.id,
        tenderId: row.tender_id,
        code: row.code,
        title: row.title,
        description: row.description,
        category: row.category,
        isMandatory: Boolean(row.is_mandatory),
        expectedDocumentType: row.expected_document_type,
        threshold: row.threshold,
        verificationSource: row.verification_source,
        weight: parseFloat(row.weight) || 1,
      };
      if (!reqsByTender[req.tenderId]) reqsByTender[req.tenderId] = [];
      reqsByTender[req.tenderId].push(req);
    }
    for (const [tenderId, reqs] of Object.entries(reqsByTender)) {
      dbStore.tenderRequirements.set(tenderId, reqs);
      const t = dbStore.tenders.get(tenderId);
      if (t) t.requirements = reqs;
    }

    // 3. Bidders
    const biddersRes = await client.query('SELECT * FROM bidders ORDER BY created_at ASC');
    for (const row of biddersRes.rows) {
      const bidder: Bidder = {
        id: row.id,
        tenderId: row.tender_id,
        bidId: row.bid_id,
        name: row.name,
        pan: row.pan,
        gstin: row.gstin,
        udyamNumber: row.udyam_number || '',
        turnoverCr: parseFloat(row.turnover_cr) || 0,
        status: row.status,
        riskLevel: row.risk_level,
        complianceScore: parseInt(row.compliance_score, 10) || 0,
        localContentPercent: parseInt(row.local_content_percent, 10) || 0,
        remarks: row.remarks || '',
        createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
        updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
      };
      dbStore.bidders.set(bidder.id, bidder);
    }

    // 4. Documents
    const docsRes = await client.query('SELECT * FROM documents ORDER BY uploaded_at ASC');
    for (const row of docsRes.rows) {
      const doc: BidderDocument = {
        id: row.id,
        bidderId: row.bidder_id,
        tenderId: row.tender_id,
        documentType: row.document_type,
        title: row.title,
        fileName: row.file_name,
        fileSize: row.file_size,
        rawText: row.raw_text,
        extractedData: typeof row.extracted_data === 'string' ? JSON.parse(row.extracted_data) : row.extracted_data,
        aiConfidence: parseFloat(row.ai_confidence) || 0.9,
        status: row.status,
        uploadedAt: row.uploaded_at ? new Date(row.uploaded_at).toISOString() : new Date().toISOString(),
      };
      dbStore.documents.set(doc.id, doc);
    }

    // 5. Verification Results
    const verRes = await client.query('SELECT * FROM verification_results ORDER BY verified_at ASC');
    const verMap: Record<string, VerificationResult[]> = {};
    for (const row of verRes.rows) {
      const v: VerificationResult = {
        id: row.id,
        bidderId: row.bidder_id,
        serviceName: row.service_name,
        isMockData: Boolean(row.is_mock_data),
        status: row.status,
        data: typeof row.data === 'string' ? JSON.parse(row.data) : row.data,
        verifiedAt: row.verified_at ? new Date(row.verified_at).toISOString() : new Date().toISOString(),
      };
      if (!verMap[v.bidderId]) verMap[v.bidderId] = [];
      verMap[v.bidderId].push(v);
    }
    for (const [bidderId, list] of Object.entries(verMap)) {
      dbStore.verificationResults.set(bidderId, list);
    }

    // 6. Compliance Findings
    const findingsRes = await client.query('SELECT * FROM compliance_findings ORDER BY created_at ASC');
    const findingsMap: Record<string, ComplianceFinding[]> = {};
    for (const row of findingsRes.rows) {
      const f: ComplianceFinding = {
        id: row.id,
        bidderId: row.bidder_id,
        requirementCode: row.requirement_code,
        requirementTitle: row.requirement_title,
        category: row.category,
        isMandatory: Boolean(row.is_mandatory),
        status: row.status,
        severity: row.severity,
        evidence: row.evidence,
        reason: row.reason,
        recommendedAction: row.recommended_action || undefined,
        verifiedSource: row.verified_source,
      };
      if (!findingsMap[f.bidderId]) findingsMap[f.bidderId] = [];
      findingsMap[f.bidderId].push(f);
    }
    for (const [bidderId, list] of Object.entries(findingsMap)) {
      dbStore.complianceFindings.set(bidderId, list);
    }

    // 7. Officer Decisions
    const decRes = await client.query('SELECT * FROM officer_decisions ORDER BY created_at ASC');
    for (const row of decRes.rows) {
      const dec: OfficerDecision = {
        id: row.id,
        bidderId: row.bidder_id,
        officerId: row.officer_id,
        officerName: row.officer_name,
        officerDesignation: row.officer_designation,
        decision: row.decision,
        remarks: row.remarks,
        evidenceReviewed: typeof row.evidence_reviewed === 'string' ? JSON.parse(row.evidence_reviewed) : row.evidence_reviewed || [],
        timestamp: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      };
      dbStore.officerDecisions.set(dec.bidderId, dec);
      const b = dbStore.bidders.get(dec.bidderId);
      if (b) {
        b.finalDecision = {
          decision: dec.decision,
          officerId: dec.officerId,
          officerName: dec.officerName,
          remarks: dec.remarks,
          evidenceReviewed: dec.evidenceReviewed,
          timestamp: dec.timestamp,
        };
      }
    }

    // 8. Audit Logs
    const auditRes = await client.query('SELECT * FROM audit_logs ORDER BY timestamp DESC');
    dbStore.auditLogs = auditRes.rows.map((row) => ({
      id: row.id,
      timestamp: row.timestamp ? new Date(row.timestamp).toISOString() : new Date().toISOString(),
      user: row.user_name,
      userRole: row.user_role,
      action: row.action,
      entity: row.entity,
      entityId: row.entity_id,
      details: typeof row.details === 'string' ? JSON.parse(row.details) : row.details,
      hash: row.hash,
      previousHash: row.previous_hash,
    }));

    console.log(`[PostgreSQL] Synced ${dbStore.bidders.size} bidders and ${dbStore.auditLogs.length} audit logs into active cache.`);
  } finally {
    client.release();
  }
}

/**
 * PostgreSQL write helpers
 */
export async function persistDocumentToPg(doc: BidderDocument): Promise<void> {
  const pool = getPgPool();
  if (!pool) return;
  try {
    await pool.query(
      `INSERT INTO documents (
        id, bidder_id, tender_id, document_type, title, file_name, file_size,
        raw_text, extracted_data, ai_confidence, status, uploaded_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        extracted_data = EXCLUDED.extracted_data,
        status = EXCLUDED.status`,
      [
        doc.id,
        doc.bidderId,
        doc.tenderId || null,
        doc.documentType,
        doc.title,
        doc.fileName,
        doc.fileSize || '1.0 MB',
        doc.rawText || '',
        JSON.stringify(doc.extractedData || {}),
        doc.aiConfidence || 0.9,
        doc.status,
        doc.uploadedAt,
      ]
    );
  } catch (e) {
    console.warn('[PostgreSQL] Failed to persist document:', e);
  }
}

export async function persistVerificationsToPg(bidderId: string, results: VerificationResult[]): Promise<void> {
  const pool = getPgPool();
  if (!pool) return;
  try {
    for (const v of results) {
      await pool.query(
        `INSERT INTO verification_results (id, bidder_id, service_name, is_mock_data, status, data, verified_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
          status = EXCLUDED.status,
          data = EXCLUDED.data,
          verified_at = EXCLUDED.verified_at`,
        [v.id, v.bidderId, v.serviceName, v.isMockData, v.status, JSON.stringify(v.data), v.verifiedAt]
      );
    }
  } catch (e) {
    console.warn('[PostgreSQL] Failed to persist verifications:', e);
  }
}

export async function persistFindingsToPg(bidderId: string, findings: ComplianceFinding[]): Promise<void> {
  const pool = getPgPool();
  if (!pool) return;
  try {
    for (const f of findings) {
      await pool.query(
        `INSERT INTO compliance_findings (
          id, bidder_id, requirement_code, requirement_title, category, is_mandatory,
          status, severity, evidence, reason, recommended_action, verified_source
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO UPDATE SET
          status = EXCLUDED.status,
          severity = EXCLUDED.severity,
          evidence = EXCLUDED.evidence,
          reason = EXCLUDED.reason,
          recommended_action = EXCLUDED.recommended_action`,
        [
          f.id,
          f.bidderId,
          f.requirementCode,
          f.requirementTitle,
          f.category,
          f.isMandatory,
          f.status,
          f.severity,
          f.evidence,
          f.reason,
          f.recommendedAction || null,
          f.verifiedSource || 'GeM Engine',
        ]
      );
    }
  } catch (e) {
    console.warn('[PostgreSQL] Failed to persist findings:', e);
  }
}

export async function persistBidderDecisionToPg(decision: OfficerDecision): Promise<void> {
  const pool = getPgPool();
  if (!pool) return;
  try {
    await pool.query(
      `INSERT INTO officer_decisions (
        id, bidder_id, officer_id, officer_name, officer_designation, decision, remarks, evidence_reviewed, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO UPDATE SET
        decision = EXCLUDED.decision,
        remarks = EXCLUDED.remarks,
        evidence_reviewed = EXCLUDED.evidence_reviewed`,
      [
        decision.id,
        decision.bidderId,
        decision.officerId,
        decision.officerName,
        decision.officerDesignation || '',
        decision.decision,
        decision.remarks,
        JSON.stringify(decision.evidenceReviewed || []),
        decision.timestamp,
      ]
    );

    // Update bidder status in PostgreSQL as well
    const status = decision.decision === 'QUALIFIED' ? 'Compliant' : decision.decision === 'DISQUALIFIED' ? 'Non-Compliant' : 'Partial';
    await pool.query(
      `UPDATE bidders SET status = $1, remarks = $2, updated_at = NOW() WHERE id = $3`,
      [status, decision.remarks, decision.bidderId]
    );
  } catch (e) {
    console.warn('[PostgreSQL] Failed to persist officer decision:', e);
  }
}

export async function persistAuditLogToPg(log: AuditLog): Promise<void> {
  const pool = getPgPool();
  if (!pool) return;
  try {
    await pool.query(
      `INSERT INTO audit_logs (id, timestamp, user_name, user_role, action, entity, entity_id, details, hash, previous_hash)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id) DO UPDATE SET
        details = EXCLUDED.details,
        hash = EXCLUDED.hash`,
      [
        log.id,
        log.timestamp,
        log.user,
        log.userRole || 'OFFICER',
        log.action,
        log.entity,
        log.entityId,
        JSON.stringify(log.details || {}),
        log.hash || null,
        log.previousHash || null,
      ]
    );
  } catch (e) {
    console.warn('[PostgreSQL] Failed to persist audit log:', e);
  }
}

export async function persistBidderScoreToPg(
  bidderId: string,
  score: number,
  riskLevel: 'Low' | 'Medium' | 'High',
  status: 'Compliant' | 'Partial' | 'Non-Compliant' | 'PENDING'
): Promise<void> {
  const pool = getPgPool();
  if (!pool) return;
  try {
    await pool.query(
      `UPDATE bidders SET compliance_score = $1, risk_level = $2, status = $3, updated_at = NOW() WHERE id = $4`,
      [score, riskLevel, status, bidderId]
    );
  } catch (e) {
    console.warn('[PostgreSQL] Failed to update bidder score:', e);
  }
}

