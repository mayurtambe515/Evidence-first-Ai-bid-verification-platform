import { Pool } from 'pg';
import crypto from 'crypto';

export async function initializePostgresDatabase(pool: Pool): Promise<{
  success: boolean;
  tablesCreated: string[];
  counts: Record<string, number>;
}> {
  console.log('[PostgreSQL] Starting schema initialization and migrations...');

  const client = await pool.connect();
  const tables = [
    'users',
    'tenders',
    'tender_requirements',
    'bidders',
    'documents',
    'verification_results',
    'compliance_findings',
    'officer_decisions',
    'audit_logs',
  ];

  try {
    // Check if the PostgreSQL instance is in read-only / replica recovery mode
    let isReadOnly = false;
    try {
      const recoveryCheck = await client.query('SELECT pg_is_in_recovery()');
      isReadOnly = recoveryCheck.rows[0]?.pg_is_in_recovery === true;
    } catch (checkErr) {
      console.warn('[PostgreSQL] Recovery check warning:', checkErr);
    }

    // Inspect existing tables in public schema
    const existingTablesRes = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );
    const existingTableSet = new Set(existingTablesRes.rows.map((r: any) => r.table_name));
    const allTablesExist = tables.every((t) => existingTableSet.has(t));

    // If tables already exist or database is a read-only replica, bypass DDL and seed queries
    if (allTablesExist || isReadOnly) {
      console.log(
        `[PostgreSQL] Existing schema verified (read-only replica: ${isReadOnly}, all tables present: ${allTablesExist}). Skipping DDL migrations.`
      );
      const counts: Record<string, number> = {};
      for (const table of tables) {
        try {
          const res = await client.query(`SELECT COUNT(*) FROM ${table}`);
          counts[table] = parseInt(res.rows[0].count, 10);
        } catch {
          counts[table] = 0;
        }
      }

      console.log('[PostgreSQL] Table verification completed. Row counts:', counts);
      return {
        success: true,
        tablesCreated: tables.filter((t) => existingTableSet.has(t)),
        counts,
      };
    }

    await client.query('BEGIN');

    // 1. Create Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(32) NOT NULL CHECK (role IN ('OFFICER', 'BIDDER', 'AUDITOR', 'ADMIN')),
        department VARCHAR(255),
        designation VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Create Tenders Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tenders (
        id VARCHAR(64) PRIMARY KEY,
        ref_number VARCHAR(128) UNIQUE NOT NULL,
        title TEXT NOT NULL,
        authority VARCHAR(255) NOT NULL,
        category VARCHAR(128) NOT NULL,
        estimated_value VARCHAR(128),
        deadline VARCHAR(128) NOT NULL,
        publishing_date VARCHAR(64),
        min_annual_turnover_cr NUMERIC(10, 2) DEFAULT 0,
        requires_oem_authorization BOOLEAN DEFAULT false,
        requires_active_udyam_msme BOOLEAN DEFAULT false,
        status VARCHAR(32) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'UNDER_EVALUATION', 'AWARDED', 'CLOSED')),
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Create Tender Requirements Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tender_requirements (
        id VARCHAR(64) PRIMARY KEY,
        tender_id VARCHAR(64) REFERENCES tenders(id) ON DELETE CASCADE,
        code VARCHAR(64) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(64) NOT NULL,
        is_mandatory BOOLEAN DEFAULT true,
        expected_document_type VARCHAR(128),
        threshold VARCHAR(128),
        verification_source VARCHAR(128),
        weight NUMERIC(5, 2) DEFAULT 1.0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT uq_tender_req UNIQUE (tender_id, code)
      );
    `);

    // 4. Create Bidders Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bidders (
        id VARCHAR(64) PRIMARY KEY,
        tender_id VARCHAR(64) REFERENCES tenders(id) ON DELETE CASCADE,
        bid_id VARCHAR(128) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        pan VARCHAR(16) NOT NULL,
        gstin VARCHAR(20) NOT NULL,
        udyam_number VARCHAR(64),
        turnover_cr NUMERIC(10, 2) DEFAULT 0,
        status VARCHAR(32) DEFAULT 'PENDING' CHECK (status IN ('Compliant', 'Partial', 'Non-Compliant', 'PENDING')),
        risk_level VARCHAR(32) DEFAULT 'Medium' CHECK (risk_level IN ('Low', 'Medium', 'High')),
        compliance_score INT DEFAULT 0,
        local_content_percent INT DEFAULT 0,
        remarks TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Create Documents Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id VARCHAR(64) PRIMARY KEY,
        bidder_id VARCHAR(64) REFERENCES bidders(id) ON DELETE CASCADE,
        tender_id VARCHAR(64) REFERENCES tenders(id) ON DELETE SET NULL,
        document_type VARCHAR(128) NOT NULL,
        title VARCHAR(255) NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_size VARCHAR(64),
        file_url TEXT,
        raw_text TEXT,
        extracted_data JSONB,
        ai_confidence NUMERIC(4, 2) DEFAULT 0.90,
        status VARCHAR(32) DEFAULT 'PENDING' CHECK (status IN ('VERIFIED', 'PENDING', 'REQUIRES_REVIEW', 'FLAGGED')),
        uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Create Verification Results Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS verification_results (
        id VARCHAR(64) PRIMARY KEY,
        bidder_id VARCHAR(64) REFERENCES bidders(id) ON DELETE CASCADE,
        service_name VARCHAR(64) NOT NULL,
        is_mock_data BOOLEAN DEFAULT true,
        status VARCHAR(32) NOT NULL CHECK (status IN ('VERIFIED', 'MISMATCH', 'NOT_FOUND', 'PENDING', 'REQUIRES_REVIEW')),
        data JSONB NOT NULL,
        verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 7. Create Compliance Findings Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS compliance_findings (
        id VARCHAR(64) PRIMARY KEY,
        bidder_id VARCHAR(64) REFERENCES bidders(id) ON DELETE CASCADE,
        requirement_code VARCHAR(64) NOT NULL,
        requirement_title VARCHAR(255) NOT NULL,
        category VARCHAR(64) NOT NULL,
        is_mandatory BOOLEAN DEFAULT true,
        status VARCHAR(32) NOT NULL CHECK (status IN ('VERIFIED', 'PENDING', 'MISSING', 'MISMATCH', 'NOT_APPLICABLE', 'REQUIRES_REVIEW')),
        severity VARCHAR(32) NOT NULL CHECK (severity IN ('HIGH', 'MEDIUM', 'LOW', 'INFO')),
        evidence TEXT NOT NULL,
        reason TEXT NOT NULL,
        recommended_action TEXT,
        verified_source VARCHAR(128),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 8. Create Officer Decisions Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS officer_decisions (
        id VARCHAR(64) PRIMARY KEY,
        bidder_id VARCHAR(64) REFERENCES bidders(id) ON DELETE CASCADE,
        officer_id VARCHAR(64) NOT NULL,
        officer_name VARCHAR(255) NOT NULL,
        officer_designation VARCHAR(255),
        decision VARCHAR(32) NOT NULL CHECK (decision IN ('QUALIFIED', 'DISQUALIFIED', 'FURTHER_REVIEW')),
        remarks TEXT NOT NULL,
        evidence_reviewed JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 9. Create Audit Logs Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id VARCHAR(64) PRIMARY KEY,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        user_name VARCHAR(255) NOT NULL,
        user_role VARCHAR(64),
        action VARCHAR(64) NOT NULL,
        entity VARCHAR(64) NOT NULL,
        entity_id VARCHAR(64) NOT NULL,
        details JSONB DEFAULT '{}'::jsonb,
        hash VARCHAR(128),
        previous_hash VARCHAR(128)
      );
    `);

    // Add indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_bidders_tender ON bidders(tender_id);
      CREATE INDEX IF NOT EXISTS idx_bidders_bid_id ON bidders(bid_id);
      CREATE INDEX IF NOT EXISTS idx_documents_bidder ON documents(bidder_id);
      CREATE INDEX IF NOT EXISTS idx_verification_bidder ON verification_results(bidder_id);
      CREATE INDEX IF NOT EXISTS idx_findings_bidder ON compliance_findings(bidder_id);
      CREATE INDEX IF NOT EXISTS idx_decisions_bidder ON officer_decisions(bidder_id);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_id);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
    `);

    // ================================================================
    // SEEDING REQUIRED DATA
    // ================================================================

    // 1. Seed Users
    await client.query(`
      INSERT INTO users (id, email, password_hash, name, role, department, designation)
      VALUES
        ('usr-officer-1', 'officer@gem.gov.in', 'hashed_pass_officer', 'Rajeev Ramanathan', 'OFFICER', 'Central Public Procurement Directorate', 'Chief Procurement Officer (Grade I)'),
        ('usr-bidder-1', 'bidder@shreetech.in', 'hashed_pass_bidder', 'Kavita Sundaram', 'BIDDER', 'Commercial Bid Division', 'Director, Shree Tech Solutions Pvt. Ltd.'),
        ('usr-auditor-1', 'auditor@cag.gov.in', 'hashed_pass_auditor', 'Anita Desai', 'AUDITOR', 'Comptroller and Auditor General of India (CAG)', 'Principal Director of Audit')
      ON CONFLICT (id) DO NOTHING;
    `);

    // 2. Seed Demo Tenders
    await client.query(`
      INSERT INTO tenders (
        id, ref_number, title, authority, category, estimated_value, deadline,
        publishing_date, min_annual_turnover_cr, requires_oem_authorization, requires_active_udyam_msme,
        status, description
      )
      VALUES
        (
          'GEM-TND-2025-881',
          'GEM/2025/B/881902',
          'Supply & 3-Year Enterprise Cloud Infrastructure Maintenance',
          'National Informatics Centre Services Inc. (NICSI)',
          'IT Hardware & Cloud Infrastructure',
          '₹ 5,20,00,000 (INR 5.20 Cr)',
          '2026-10-15 17:00 IST',
          '2026-09-01',
          4.00,
          true,
          true,
          'UNDER_EVALUATION',
          'Procurement of mission-critical cloud server nodes, hyperconverged storage, and enterprise OEM 24x7 support.'
        ),
        (
          'CPCL-2026-001',
          'CPCL-2026-001',
          'Supply, Turnkey Deployment & 5-Year Maintenance of Enterprise Server Arrays',
          'Chennai Petroleum Corporation Limited (CPCL) / MoPNG',
          'Enterprise Data Center Hardware',
          '₹ 4,85,00,000 (INR 4.85 Cr)',
          '2026-09-30 17:00 IST',
          '2026-08-15',
          3.50,
          true,
          true,
          'UNDER_EVALUATION',
          'Mission-critical refinery process compute nodes with 24x7 OEM enterprise SLA support.'
        )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        authority = EXCLUDED.authority,
        estimated_value = EXCLUDED.estimated_value,
        min_annual_turnover_cr = EXCLUDED.min_annual_turnover_cr;
    `);

    // 3. Seed Tender Requirements
    const tenderReqs = [
      {
        id: 'req-1',
        tenderId: 'GEM-TND-2025-881',
        code: 'R-GST-ACT',
        title: 'GST Active Status & Timely Filing',
        description: 'Bidder must possess active GST registration with no delayed return notices.',
        category: 'STATUTORY',
        isMandatory: true,
        expectedDoc: 'GST_CERTIFICATE',
        threshold: 'Active REG-06',
        source: 'GSTN Gateway API',
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
        expectedDoc: 'PAN_CARD',
        threshold: 'Valid & Operative',
        source: 'NSDL PAN Registry',
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
        expectedDoc: 'UDYAM_CERTIFICATE',
        threshold: 'Active Classification',
        source: 'Ministry of MSME Registry',
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
        expectedDoc: 'OEM_AUTHORIZATION',
        threshold: 'Valid Till Nov 2026+',
        source: 'OEM Partner Verification Service',
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
        expectedDoc: 'MAKE_IN_INDIA_DECLARATION',
        threshold: '>= 50%',
        source: 'Self-Certified CA Undertaking',
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
        expectedDoc: 'TURNOVER_CERTIFICATE',
        threshold: '>= ₹ 4.00 Cr',
        source: 'ICAI UDIN Registry',
        weight: 10,
      },
    ];

    for (const r of tenderReqs) {
      await client.query(`
        INSERT INTO tender_requirements (
          id, tender_id, code, title, description, category, is_mandatory,
          expected_document_type, threshold, verification_source, weight
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (tender_id, code) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          threshold = EXCLUDED.threshold,
          weight = EXCLUDED.weight;
      `, [r.id, r.tenderId, r.code, r.title, r.description, r.category, r.isMandatory, r.expectedDoc, r.threshold, r.source, r.weight]);
    }

    // 4. Insert Primary Demo Bidder: Shree Tech Solutions Pvt. Ltd. (and other demo bidders)
    await client.query(`
      INSERT INTO bidders (
        id, tender_id, bid_id, name, pan, gstin, udyam_number, turnover_cr,
        status, risk_level, compliance_score, local_content_percent, remarks, created_at, updated_at
      )
      VALUES
        (
          'bidder-1',
          'GEM-TND-2025-881',
          'GEM/2025/0167',
          'Shree Tech Solutions Pvt. Ltd.',
          'AABCS1234D',
          '27ABCDE1234F1Z5',
          'UDYAM-TN-02-0045129',
          6.80,
          'Compliant',
          'Low',
          92,
          62,
          'Primary demo bidder: GST, PAN, Udyam, MCA verified. OEM authorization requires officer validity verification.',
          '2026-09-14 15:20:10+00',
          '2026-09-19 09:00:00+00'
        ),
        (
          'bidder-2',
          'GEM-TND-2025-881',
          'GEM/2025/0142',
          'Apex Technologies Private Limited',
          'AAAAA0000A',
          '07AAAAA0000A1Z5',
          'UDYAM-DL-01-0012345',
          8.50,
          'Compliant',
          'Low',
          96,
          70,
          'All statutory documents verified with 100% compliance on GeM registry cross-checks.',
          '2026-09-13 11:00:00+00',
          '2026-09-17 14:30:00+00'
        ),
        (
          'bidder-3',
          'GEM-TND-2025-881',
          'GEM/2025/0189',
          'Bharat Logistics & Hardware Solutions LLP',
          'BBBBB1111B',
          '27BBBBB1111B1Z2',
          'UDYAM-MH-02-0098765',
          3.20,
          'Partial',
          'High',
          64,
          45,
          'Turnover below ₹4.00 Cr threshold, overdue GST filings, expired MSME classification.',
          '2026-09-15 16:45:00+00',
          '2026-09-18 10:15:00+00'
        ),
        (
          'bidder-4',
          'GEM-TND-2025-881',
          'GEM/2025/0198',
          'Vertex Infotech Solutions Limited',
          'CCCCC2222C',
          '09CCCCC2222C1Z8',
          'UDYAM-GJ-03-0054321',
          5.10,
          'Non-Compliant',
          'High',
          48,
          30,
          'Corporate entity constitution mismatch: LLP on GST vs Limited on PAN/MCA21.',
          '2026-09-16 12:10:00+00',
          '2026-09-18 11:00:00+00'
        )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        pan = EXCLUDED.pan,
        gstin = EXCLUDED.gstin,
        udyam_number = EXCLUDED.udyam_number,
        turnover_cr = EXCLUDED.turnover_cr,
        compliance_score = EXCLUDED.compliance_score,
        risk_level = EXCLUDED.risk_level,
        status = EXCLUDED.status;
    `);

    // 5. Seed Documents for Shree Tech Solutions Pvt. Ltd.
    const docs = [
      {
        id: 'doc-1',
        bidderId: 'bidder-1',
        tenderId: 'GEM-TND-2025-881',
        docType: 'GST_CERTIFICATE',
        title: 'GST Registration Certificate (Form GST REG-06)',
        fileName: 'ShreeTech_GST_REG06_2026.pdf',
        fileSize: '1.4 MB',
        status: 'VERIFIED',
        confidence: 0.98,
        rawText: 'Government of India Form GST REG-06 Registration Certificate. GSTIN: 27ABCDE1234F1Z5. Legal Name: Shree Tech Solutions Pvt. Ltd. Date of Registration: 18-05-2018. Status: Active.',
        extractedData: JSON.stringify({
          documentType: 'GST_CERTIFICATE',
          companyName: 'Shree Tech Solutions Pvt. Ltd.',
          gstin: '27ABCDE1234F1Z5',
          registrationDate: '2018-05-18',
          status: 'Active',
          fieldsFound: ['GSTIN', 'Legal Name', 'Date of Registration', 'Taxpayer Type'],
          missingFields: [],
          observations: ['Matches official national GST portal record.'],
        }),
      },
      {
        id: 'doc-2',
        bidderId: 'bidder-1',
        tenderId: 'GEM-TND-2025-881',
        docType: 'PAN_CARD',
        title: 'Permanent Account Number (PAN Card)',
        fileName: 'ShreeTech_PAN_Card.pdf',
        fileSize: '850 KB',
        status: 'VERIFIED',
        confidence: 0.99,
        rawText: 'Income Tax Department, Govt of India. PAN: AABCS1234D. Name: Shree Tech Solutions Pvt. Ltd. Date of Incorporation: 10-04-2018.',
        extractedData: JSON.stringify({
          documentType: 'PAN_CARD',
          companyName: 'Shree Tech Solutions Pvt. Ltd.',
          pan: 'AABCS1234D',
          entityType: 'Company (Private Limited)',
          fieldsFound: ['PAN', 'Name', 'Incorporation Date'],
          missingFields: [],
          observations: ['4th character C confirms Corporate Entity.'],
        }),
      },
      {
        id: 'doc-3',
        bidderId: 'bidder-1',
        tenderId: 'GEM-TND-2025-881',
        docType: 'UDYAM_CERTIFICATE',
        title: 'Udyam Registration Certificate (MSME)',
        fileName: 'ShreeTech_Udyam_Registration.pdf',
        fileSize: '1.1 MB',
        status: 'VERIFIED',
        confidence: 0.96,
        rawText: 'Ministry of Micro, Small and Medium Enterprises. UDYAM REGISTRATION NUMBER: UDYAM-TN-02-0045129. Name: Shree Tech Solutions Pvt. Ltd. Enterprise Type: Medium.',
        extractedData: JSON.stringify({
          documentType: 'UDYAM_CERTIFICATE',
          companyName: 'Shree Tech Solutions Pvt. Ltd.',
          udyamNumber: 'UDYAM-TN-02-0045129',
          enterpriseType: 'Medium',
          majorActivity: 'Services & Infrastructure',
          fieldsFound: ['Udyam Number', 'Enterprise Type', 'Activity Code'],
          missingFields: [],
          observations: ['Active MSME classification.'],
        }),
      },
      {
        id: 'doc-4',
        bidderId: 'bidder-1',
        tenderId: 'GEM-TND-2025-881',
        docType: 'OEM_AUTHORIZATION',
        title: 'Manufacturer Authorization Form (MAF)',
        fileName: 'OEM_Direct_MAF_Dell_Nov2026.pdf',
        fileSize: '2.3 MB',
        status: 'REQUIRES_REVIEW',
        confidence: 0.89,
        rawText: 'Manufacturer Authorization Form. Issued by Dell Global B.V. To: Shree Tech Solutions Pvt. Ltd. Ref: GEM-TND-2025-881. Expiry Date: 30-Nov-2026.',
        extractedData: JSON.stringify({
          documentType: 'OEM_AUTHORIZATION',
          companyName: 'Shree Tech Solutions Pvt. Ltd.',
          oemName: 'Dell Enterprise Solutions',
          authorizationExpiry: '2026-11-30',
          fieldsFound: ['OEM Name', 'Bidder Authorization', 'Tender Reference', 'Expiry Date'],
          missingFields: [],
          observations: [
            'MAF expiry is 30-Nov-2026; tender spans 3 years post-deployment. Procurement Officer should confirm OEM extended warranty commitment.',
          ],
        }),
      },
      {
        id: 'doc-5',
        bidderId: 'bidder-1',
        tenderId: 'GEM-TND-2025-881',
        docType: 'MAKE_IN_INDIA_DECLARATION',
        title: 'Make in India (MII) Local Content Declaration',
        fileName: 'MII_LocalContent_Declaration_62Pct.pdf',
        fileSize: '920 KB',
        status: 'REQUIRES_REVIEW',
        confidence: 0.91,
        rawText: 'Declaration under Public Procurement (Preference to Make in India) Order 2017. Local content is declared at 62% (Class-I Local Supplier). Location of value addition: Chennai, Tamil Nadu.',
        extractedData: JSON.stringify({
          documentType: 'MAKE_IN_INDIA_DECLARATION',
          companyName: 'Shree Tech Solutions Pvt. Ltd.',
          localContentPercentage: 62,
          supplierClass: 'Class-I Local Supplier',
          fieldsFound: ['Local Content %', 'Location of Value Addition', 'Signatory'],
          missingFields: [],
          observations: ['Declared 62% meets Class-I requirement (>=50%). Supporting bill of materials subject to officer verification.'],
        }),
      },
    ];

    for (const d of docs) {
      await client.query(`
        INSERT INTO documents (
          id, bidder_id, tender_id, document_type, title, file_name, file_size,
          raw_text, extracted_data, ai_confidence, status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          status = EXCLUDED.status,
          extracted_data = EXCLUDED.extracted_data;
      `, [d.id, d.bidderId, d.tenderId, d.docType, d.title, d.fileName, d.fileSize, d.rawText, d.extractedData, d.confidence, d.status]);
    }

    // 6. Seed Mock Government Verification Results for Shree Tech Solutions
    const verifications = [
      {
        id: 'ver-gst-1',
        bidderId: 'bidder-1',
        serviceName: 'gstService',
        status: 'VERIFIED',
        data: JSON.stringify({
          portal: 'GSTN Gateway API (DEMO / MOCK DATA)',
          gstin: '27ABCDE1234F1Z5',
          legalName: 'Shree Tech Solutions Pvt. Ltd.',
          tradeName: 'Shree Tech Solutions',
          status: 'Active',
          taxpayerType: 'Regular',
          filingStatus: 'All GSTR-1 & GSTR-3B filings up to date',
          latencyMs: 142,
        }),
      },
      {
        id: 'ver-pan-1',
        bidderId: 'bidder-1',
        serviceName: 'panService',
        status: 'VERIFIED',
        data: JSON.stringify({
          portal: 'NSDL Income Tax PAN Registry (DEMO / MOCK DATA)',
          pan: 'AABCS1234D',
          legalName: 'Shree Tech Solutions Pvt. Ltd.',
          entityType: 'Company (Private Limited)',
          status: 'Valid & Operative',
          latencyMs: 118,
        }),
      },
      {
        id: 'ver-udyam-1',
        bidderId: 'bidder-1',
        serviceName: 'udyamService',
        status: 'VERIFIED',
        data: JSON.stringify({
          portal: 'Ministry of MSME Udyam Registry (DEMO / MOCK DATA)',
          udyamNumber: 'UDYAM-TN-02-0045129',
          enterpriseName: 'Shree Tech Solutions Pvt. Ltd.',
          enterpriseType: 'Medium',
          status: 'Active',
          latencyMs: 165,
        }),
      },
      {
        id: 'ver-mca-1',
        bidderId: 'bidder-1',
        serviceName: 'mcaService',
        status: 'VERIFIED',
        data: JSON.stringify({
          portal: 'Ministry of Corporate Affairs MCA21 (DEMO / MOCK DATA)',
          cin: 'U72900TN2018PTC123456',
          companyName: 'Shree Tech Solutions Pvt. Ltd.',
          status: 'Active / Registered',
          latencyMs: 210,
        }),
      },
    ];

    for (const v of verifications) {
      await client.query(`
        INSERT INTO verification_results (id, bidder_id, service_name, is_mock_data, status, data)
        VALUES ($1, $2, $3, true, $4, $5)
        ON CONFLICT (id) DO UPDATE SET
          status = EXCLUDED.status,
          data = EXCLUDED.data;
      `, [v.id, v.bidderId, v.serviceName, v.status, v.data]);
    }

    // 7. Seed Compliance Findings
    const findings = [
      {
        id: 'f-1',
        bidderId: 'bidder-1',
        code: 'R-GST-ACT',
        title: 'GST Active Registration Status',
        category: 'STATUTORY',
        isMandatory: true,
        status: 'VERIFIED',
        severity: 'LOW',
        evidence: 'GSTIN 27ABCDE1234F1Z5 active on GSTN Gateway; regular GSTR-3B filings confirmed.',
        reason: 'Statutory compliance satisfied under Central GST Act 2017.',
        source: 'GSTN Gateway API',
      },
      {
        id: 'f-2',
        bidderId: 'bidder-1',
        code: 'R-PAN-MAT',
        title: 'PAN Identity & Legal Structure',
        category: 'STATUTORY',
        isMandatory: true,
        status: 'VERIFIED',
        severity: 'LOW',
        evidence: 'PAN AABCS1234D matches Private Limited company classification on NSDL registry.',
        reason: 'Income Tax identity confirmed without discrepancies.',
        source: 'NSDL PAN Registry',
      },
      {
        id: 'f-3',
        bidderId: 'bidder-1',
        code: 'R-UDYAM-ACT',
        title: 'Udyam MSME Registry Status',
        category: 'POLICY',
        isMandatory: false,
        status: 'VERIFIED',
        severity: 'LOW',
        evidence: 'Udyam Certificate UDYAM-TN-02-0045129 valid active Medium Enterprise.',
        reason: 'Eligible for statutory MSME preference.',
        source: 'Ministry of MSME Registry',
      },
      {
        id: 'f-4',
        bidderId: 'bidder-1',
        code: 'R-OEM-REQ',
        title: 'OEM Direct Authorization (MAF)',
        category: 'TECHNICAL',
        isMandatory: true,
        status: 'REQUIRES_REVIEW',
        severity: 'MEDIUM',
        evidence: 'Dell OEM MAF expires on 30-Nov-2026. Tender requires 3-year support.',
        reason: 'Available evidence indicates authorization period is shorter than tender operational duration.',
        recommendedAction: 'Procurement Officer should review OEM warranty extension commitment.',
        source: 'Submitted MAF Document',
      },
      {
        id: 'f-5',
        bidderId: 'bidder-1',
        code: 'R-MII-CLASS',
        title: 'Make in India Local Content',
        category: 'POLICY',
        isMandatory: true,
        status: 'REQUIRES_REVIEW',
        severity: 'LOW',
        evidence: 'Declared local content is 62% (Class-I Supplier). Self-certified.',
        reason: 'Requires officer confirmation of supporting cost breakdown.',
        recommendedAction: 'Verify CA certificate and bill of materials.',
        source: 'MII Declaration Undertaking',
      },
      {
        id: 'f-6',
        bidderId: 'bidder-1',
        code: 'R-TURN-MIN',
        title: 'Annual Turnover Threshold',
        category: 'FINANCIAL',
        isMandatory: true,
        status: 'VERIFIED',
        severity: 'LOW',
        evidence: 'Audited turnover ₹ 6.80 Cr exceeds mandatory ₹ 4.00 Cr threshold.',
        reason: 'Financial criteria satisfied with UDIN verification.',
        source: 'Audited Financial Statements',
      },
    ];

    for (const f of findings) {
      await client.query(`
        INSERT INTO compliance_findings (
          id, bidder_id, requirement_code, requirement_title, category, is_mandatory,
          status, severity, evidence, reason, recommended_action, verified_source
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO UPDATE SET
          status = EXCLUDED.status,
          evidence = EXCLUDED.evidence,
          severity = EXCLUDED.severity;
      `, [f.id, f.bidderId, f.code, f.title, f.category, f.isMandatory, f.status, f.severity, f.evidence, f.reason, f.recommendedAction || null, f.source]);
    }

    // 8. Seed Audit Logs with cryptographic hashes
    const logs = [
      {
        id: 'log-1',
        timestamp: '2026-09-14 15:20:10+00',
        userName: 'GeM Portal Gateway',
        userRole: 'SYSTEM',
        action: 'BIDDER_CREATED',
        entity: 'BIDDER',
        entityId: 'bidder-1',
        details: JSON.stringify({
          bidId: 'GEM/2025/0167',
          name: 'Shree Tech Solutions Pvt. Ltd.',
          tenderId: 'GEM-TND-2025-881',
        }),
        hash: 'a1b2c3d4e5f67890123456789abcdef0',
        previousHash: '00000000000000000000000000000000',
      },
      {
        id: 'log-2',
        timestamp: '2026-09-14 15:20:25+00',
        userName: 'Bidder Representative',
        userRole: 'BIDDER',
        action: 'DOCUMENT_UPLOADED',
        entity: 'DOCUMENT',
        entityId: 'doc-1',
        details: JSON.stringify({
          documentsCount: 5,
          types: ['GST_CERTIFICATE', 'PAN_CARD', 'UDYAM_CERTIFICATE', 'OEM_AUTHORIZATION', 'MAKE_IN_INDIA_DECLARATION'],
        }),
        hash: 'b2c3d4e5f6a17890123456789abcdef1',
        previousHash: 'a1b2c3d4e5f67890123456789abcdef0',
      },
      {
        id: 'log-3',
        timestamp: '2026-09-18 09:42:15+00',
        userName: 'GeM Automated Gateway',
        userRole: 'SYSTEM',
        action: 'GST_VERIFIED',
        entity: 'VERIFICATION',
        entityId: 'bidder-1',
        details: JSON.stringify({
          gateway: 'GSTN Portal API (MOCK)',
          gstin: '27ABCDE1234F1Z5',
          result: 'Active & In Good Standing',
        }),
        hash: 'c3d4e5f6a1b27890123456789abcdef2',
        previousHash: 'b2c3d4e5f6a17890123456789abcdef1',
      },
      {
        id: 'log-4',
        timestamp: '2026-09-18 09:42:16+00',
        userName: 'GeM Automated Gateway',
        userRole: 'SYSTEM',
        action: 'UDYAM_VERIFIED',
        entity: 'VERIFICATION',
        entityId: 'bidder-1',
        details: JSON.stringify({
          gateway: 'Udyam Registry (MOCK)',
          udyamNumber: 'UDYAM-TN-02-0045129',
          result: 'Valid Medium Enterprise',
        }),
        hash: 'd4e5f6a1b2c37890123456789abcdef3',
        previousHash: 'c3d4e5f6a1b27890123456789abcdef2',
      },
      {
        id: 'log-5',
        timestamp: '2026-09-18 09:42:20+00',
        userName: 'Compliance Rules Engine',
        userRole: 'SYSTEM',
        action: 'COMPLIANCE_CHECKED',
        entity: 'BIDDER',
        entityId: 'bidder-1',
        details: JSON.stringify({
          complianceScore: 92,
          riskLevel: 'Low',
          verifiedCount: 4,
          requiresReviewCount: 2,
        }),
        hash: 'e5f6a1b2c3d47890123456789abcdef4',
        previousHash: 'd4e5f6a1b2c37890123456789abcdef3',
      },
    ];

    for (const l of logs) {
      await client.query(`
        INSERT INTO audit_logs (id, timestamp, user_name, user_role, action, entity, entity_id, details, hash, previous_hash)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET
          details = EXCLUDED.details,
          hash = EXCLUDED.hash;
      `, [l.id, l.timestamp, l.userName, l.userRole, l.action, l.entity, l.entityId, l.details, l.hash, l.previousHash]);
    }

    await client.query('COMMIT');

    // Retrieve row counts to confirm
    const counts: Record<string, number> = {};
    for (const table of tables) {
      const res = await client.query(`SELECT COUNT(*) FROM ${table}`);
      counts[table] = parseInt(res.rows[0].count, 10);
    }

    console.log('[PostgreSQL] Database initialization completed successfully. Table counts:', counts);

    return {
      success: true,
      tablesCreated: tables,
      counts,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[PostgreSQL] Schema initialization error:', error);
    throw error;
  } finally {
    client.release();
  }
}
