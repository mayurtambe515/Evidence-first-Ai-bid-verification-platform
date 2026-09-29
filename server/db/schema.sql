-- ====================================================================
-- GeM AI Bid Compliance Verification Platform - PostgreSQL Schema
-- Database: PostgreSQL 14+ compatible
-- ====================================================================

-- 1. Users Table
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

-- 2. Tenders Table
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

-- 3. Tender Requirements Table
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

-- 4. Bidders Table
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

-- 5. Documents Table
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

-- 6. Verification Results Table (Mock Government Portals)
CREATE TABLE IF NOT EXISTS verification_results (
    id VARCHAR(64) PRIMARY KEY,
    bidder_id VARCHAR(64) REFERENCES bidders(id) ON DELETE CASCADE,
    service_name VARCHAR(64) NOT NULL,
    is_mock_data BOOLEAN DEFAULT true,
    status VARCHAR(32) NOT NULL CHECK (status IN ('VERIFIED', 'MISMATCH', 'NOT_FOUND', 'PENDING', 'REQUIRES_REVIEW')),
    data JSONB NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Compliance Findings Table
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

-- 8. Officer Decisions Table
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

-- 9. Audit Logs Table (Read-Only Chained Ledger)
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bidders_tender ON bidders(tender_id);
CREATE INDEX IF NOT EXISTS idx_bidders_bid_id ON bidders(bid_id);
CREATE INDEX IF NOT EXISTS idx_documents_bidder ON documents(bidder_id);
CREATE INDEX IF NOT EXISTS idx_verification_bidder ON verification_results(bidder_id);
CREATE INDEX IF NOT EXISTS idx_findings_bidder ON compliance_findings(bidder_id);
CREATE INDEX IF NOT EXISTS idx_decisions_bidder ON officer_decisions(bidder_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
