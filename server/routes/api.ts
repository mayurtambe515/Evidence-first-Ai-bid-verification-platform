import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {
  dbStore,
  getPgPool,
  persistDocumentToPg,
  persistVerificationsToPg,
  persistFindingsToPg,
  persistBidderDecisionToPg,
  persistBidderScoreToPg,
} from '../db/database';
import { allMockGovernmentServices } from '../services/mockGovernmentServices';
import { documentService } from '../services/documentService';
import { complianceEngine } from '../services/complianceEngine';
import { auditService } from '../services/auditService';
import { Tender, Bidder, VerificationResult, OfficerDecision } from '../types';

export const apiRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production';

// ====================================================================
// 0. Database Status & Connectivity Endpoint
// ====================================================================
apiRouter.get('/db/status', async (req: Request, res: Response) => {
  const pool = getPgPool();
  if (!pool) {
    return res.status(503).json({
      success: false,
      connected: false,
      activePool: false,
      error: 'DATABASE_URL is not configured or connection failed',
      database: 'In-Memory Fallback',
    });
  }

  try {
    const client = await pool.connect();
    try {
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
      const tableCounts: Record<string, number> = {};
      for (const t of tables) {
        try {
          const r = await client.query(`SELECT COUNT(*) FROM ${t}`);
          tableCounts[t] = parseInt(r.rows[0].count, 10);
        } catch {
          tableCounts[t] = 0;
        }
      }

      res.json({
        success: true,
        connected: true,
        activePool: true,
        database: 'PostgreSQL (Neon Managed Instance)',
        tableCounts,
        tablesCount: Object.keys(tableCounts).length,
        cacheBidderCount: dbStore.bidders.size,
        timestamp: new Date().toISOString(),
      });
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error('[PostgreSQL API Status Error]', err.message);
    res.status(500).json({
      success: false,
      connected: false,
      activePool: true,
      error: err.message,
      database: 'PostgreSQL Error',
    });
  }
});

// ====================================================================
// 1. Authentication Endpoints
// ====================================================================

// POST /api/auth/login
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user in dbStore
    let foundUser = Array.from(dbStore.users.values()).find(
      (u) => u.email.toLowerCase() === (email || '').toLowerCase().trim()
    );

    // If user not in store, provision temporary mock session user
    if (!foundUser) {
      foundUser = {
        id: `usr-${Date.now()}`,
        email: email.trim(),
        name: email.split('@')[0].toUpperCase(),
        role: email.includes('bidder') ? 'BIDDER' : email.includes('audit') ? 'AUDITOR' : 'OFFICER',
        department: 'Government Procurement Directorate',
        designation: 'Procurement Evaluation Officer',
        createdAt: new Date().toISOString(),
      };
      dbStore.users.set(foundUser.id, foundUser);
    }

    const token = jwt.sign(
      {
        id: foundUser.id,
        email: foundUser.email,
        role: foundUser.role,
        name: foundUser.name,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        department: foundUser.department,
        designation: foundUser.designation,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Authentication failed', details: err.message });
  }
});

// ====================================================================
// 2. Tender Endpoints
// ====================================================================

// GET /api/tenders
apiRouter.get('/tenders', (req: Request, res: Response) => {
  const tenders = Array.from(dbStore.tenders.values());
  res.json({ success: true, count: tenders.length, tenders });
});

// POST /api/tenders
apiRouter.post('/tenders', (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newTender: Tender = {
      id: `tender-${Date.now()}`,
      refNumber: data.refNumber || `GEM/${new Date().getFullYear()}/B/${Math.floor(100000 + Math.random() * 900000)}`,
      title: data.title || 'Enterprise Procurement Tender',
      authority: data.authority || 'Ministry of Commerce & Industry',
      category: data.category || 'General Procurement',
      estimatedValue: data.estimatedValue || '₹ 1,00,00,000',
      deadline: data.deadline || '2026-12-31 17:00 IST',
      publishingDate: new Date().toISOString().split('T')[0],
      minAnnualTurnoverCr: Number(data.minAnnualTurnoverCr) || 2.0,
      requiresOEMAuthorization: Boolean(data.requiresOEMAuthorization),
      requiresActiveUdyamMSME: Boolean(data.requiresActiveUdyamMSME),
      status: 'OPEN',
      requirements: data.requirements || [],
      description: data.description || '',
      createdAt: new Date().toISOString(),
    };

    dbStore.tenders.set(newTender.id, newTender);
    if (newTender.requirements.length > 0) {
      dbStore.tenderRequirements.set(newTender.id, newTender.requirements);
    }

    res.status(201).json({ success: true, tender: newTender });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create tender', details: err.message });
  }
});

// GET /api/tenders/:id
apiRouter.get('/tenders/:id', (req: Request, res: Response) => {
  const tender = dbStore.tenders.get(req.params.id);
  if (!tender) {
    return res.status(404).json({ error: 'Tender not found' });
  }
  const requirements = dbStore.tenderRequirements.get(tender.id) || [];
  res.json({ success: true, tender: { ...tender, requirements } });
});

// ====================================================================
// 3. Bidder Endpoints
// ====================================================================

// GET /api/bidders (with optional search query)
apiRouter.get('/bidders', (req: Request, res: Response) => {
  const query = ((req.query.q as string) || '').toLowerCase().trim();
  let bidders = Array.from(dbStore.bidders.values());

  if (query) {
    bidders = bidders.filter(
      (b) =>
        b.name.toLowerCase().includes(query) ||
        b.bidId.toLowerCase().includes(query) ||
        b.pan.toLowerCase().includes(query) ||
        b.gstin.toLowerCase().includes(query)
    );
  }

  res.json({ success: true, count: bidders.length, bidders });
});

// POST /api/bidders
apiRouter.post('/bidders', (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newBidder: Bidder = {
      id: `bidder-${Date.now()}`,
      tenderId: data.tenderId || 'GEM-TND-2025-881',
      bidId: data.bidId || `GEM/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
      name: data.name || 'New Enterprise Solutions',
      pan: (data.pan || 'AABCS9999Z').toUpperCase(),
      gstin: (data.gstin || '27AABCS9999Z1Z5').toUpperCase(),
      udyamNumber: data.udyamNumber || '',
      turnoverCr: Number(data.turnoverCr) || 4.5,
      status: 'PENDING',
      riskLevel: 'Medium',
      complianceScore: 0,
      localContentPercent: Number(data.localContentPercent) || 50,
      remarks: data.remarks || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dbStore.bidders.set(newBidder.id, newBidder);

    auditService.recordLog({
      user: data.officerUser || 'Procurement Officer',
      userRole: 'OFFICER',
      action: 'BIDDER_CREATED',
      entity: 'BIDDER',
      entityId: newBidder.id,
      details: {
        bidId: newBidder.bidId,
        name: newBidder.name,
        pan: newBidder.pan,
        gstin: newBidder.gstin,
      },
    });

    res.status(201).json({ success: true, bidder: newBidder });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create bidder', details: err.message });
  }
});

// GET /api/bidders/:id
apiRouter.get('/bidders/:id', (req: Request, res: Response) => {
  const bidder = dbStore.bidders.get(req.params.id);
  if (!bidder) {
    return res.status(404).json({ error: 'Bidder not found' });
  }
  const documents = documentService.getDocumentsByBidderId(bidder.id);
  const verifications = dbStore.verificationResults.get(bidder.id) || [];
  const findings = dbStore.complianceFindings.get(bidder.id) || [];

  res.json({
    success: true,
    bidder,
    documentsCount: documents.length,
    verificationsCount: verifications.length,
    findingsCount: findings.length,
  });
});

// POST /api/bidders/verify (convenience trigger)
apiRouter.post('/bidders/verify', async (req: Request, res: Response) => {
  try {
    const { bidderId } = req.body;
    if (!bidderId) {
      return res.status(400).json({ error: 'bidderId is required' });
    }

    const bidder = dbStore.bidders.get(bidderId);
    if (!bidder) {
      return res.status(404).json({ error: 'Bidder not found' });
    }

    // Run GST, PAN, Udyam, MCA mock services
    const gstRes = await allMockGovernmentServices.gstService.verifyGstin(bidder.gstin, bidder.name);
    const panRes = await allMockGovernmentServices.panService.verifyPan(bidder.pan, bidder.name);
    const udyamRes = await allMockGovernmentServices.udyamService.verifyUdyam(bidder.udyamNumber || '', bidder.name);
    const mcaRes = await allMockGovernmentServices.mcaService.verifyCin(bidder.name);

    const results: VerificationResult[] = [
      {
        id: `ver-gst-${Date.now()}`,
        bidderId,
        serviceName: 'gstService',
        isMockData: true,
        status: gstRes.status === 'VERIFIED' ? 'VERIFIED' : 'REQUIRES_REVIEW',
        data: gstRes,
        verifiedAt: new Date().toISOString(),
      },
      {
        id: `ver-pan-${Date.now()}`,
        bidderId,
        serviceName: 'panService',
        isMockData: true,
        status: panRes.status === 'VERIFIED' ? 'VERIFIED' : 'REQUIRES_REVIEW',
        data: panRes,
        verifiedAt: new Date().toISOString(),
      },
      {
        id: `ver-udyam-${Date.now()}`,
        bidderId,
        serviceName: 'udyamService',
        isMockData: true,
        status: udyamRes.status === 'VERIFIED' ? 'VERIFIED' : 'REQUIRES_REVIEW',
        data: udyamRes,
        verifiedAt: new Date().toISOString(),
      },
      {
        id: `ver-mca-${Date.now()}`,
        bidderId,
        serviceName: 'mcaService',
        isMockData: true,
        status: mcaRes.status === 'VERIFIED' ? 'VERIFIED' : 'REQUIRES_REVIEW',
        data: mcaRes,
        verifiedAt: new Date().toISOString(),
      },
    ];

    dbStore.verificationResults.set(bidderId, results);

    // Audit logs for mock government verifications
    auditService.recordLog({
      user: 'GeM Automated Gateway',
      userRole: 'SYSTEM',
      action: 'GST_VERIFIED',
      entity: 'VERIFICATION',
      entityId: bidderId,
      details: { gstin: bidder.gstin, result: gstRes.status },
    });

    auditService.recordLog({
      user: 'GeM Automated Gateway',
      userRole: 'SYSTEM',
      action: 'PAN_VERIFIED',
      entity: 'VERIFICATION',
      entityId: bidderId,
      details: { pan: bidder.pan, result: panRes.status },
    });

    auditService.recordLog({
      user: 'GeM Automated Gateway',
      userRole: 'SYSTEM',
      action: 'UDYAM_VERIFIED',
      entity: 'VERIFICATION',
      entityId: bidderId,
      details: { udyamNumber: bidder.udyamNumber, result: udyamRes.status },
    });

    // Run compliance evaluation
    const complianceReport = await complianceEngine.evaluateBidderCompliance(bidderId);

    // Persist to PostgreSQL
    await persistVerificationsToPg(bidderId, results);
    await persistFindingsToPg(bidderId, complianceReport.findings);
    await persistBidderScoreToPg(bidderId, complianceReport.complianceScore, complianceReport.riskLevel, bidder.status);

    res.json({
      success: true,
      message: 'Government portal verification and compliance engine completed successfully',
      verificationResults: results,
      complianceReport,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to verify bidder', details: err.message });
  }
});

// ====================================================================
// 4. Document Processing Endpoints
// ====================================================================

// POST /api/documents/upload
apiRouter.post('/documents/upload', async (req: Request, res: Response) => {
  try {
    const { bidderId, tenderId, documentType, title, fileName, fileSize, fileData, rawText, officerUser } = req.body;

    if (!bidderId || !documentType || !title || !fileName) {
      return res.status(400).json({
        error: 'Missing required fields: bidderId, documentType, title, and fileName are mandatory',
      });
    }

    const result = await documentService.processAndUploadDocument({
      bidderId,
      tenderId,
      documentType,
      title,
      fileName,
      fileSize,
      fileData,
      rawText,
      officerUser,
    });

    await persistDocumentToPg(result.document);

    res.status(201).json({
      success: true,
      document: result.document,
      extractedData: result.extractedData,
      inconsistencyReport: result.inconsistencyReport,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to upload document', details: err.message });
  }
});

// GET /api/bidders/:id/documents
apiRouter.get('/bidders/:id/documents', (req: Request, res: Response) => {
  const documents = documentService.getDocumentsByBidderId(req.params.id);
  res.json({ success: true, count: documents.length, documents });
});

// ====================================================================
// 5. Verification & Compliance Endpoints
// ====================================================================

// POST /api/verification/run
apiRouter.post('/verification/run', async (req: Request, res: Response) => {
  try {
    const { bidderId } = req.body;
    if (!bidderId) {
      return res.status(400).json({ error: 'bidderId is required' });
    }

    const bidder = dbStore.bidders.get(bidderId);
    if (!bidder) {
      return res.status(404).json({ error: 'Bidder not found' });
    }

    // Run Mock Government Services
    const [gstRes, panRes, udyamRes, mcaRes] = await Promise.all([
      allMockGovernmentServices.gstService.verifyGstin(bidder.gstin, bidder.name),
      allMockGovernmentServices.panService.verifyPan(bidder.pan, bidder.name),
      allMockGovernmentServices.udyamService.verifyUdyam(bidder.udyamNumber || '', bidder.name),
      allMockGovernmentServices.mcaService.verifyCin(bidder.name),
    ]);

    const results: VerificationResult[] = [
      {
        id: `ver-gst-${Date.now()}`,
        bidderId,
        serviceName: 'gstService',
        isMockData: true,
        status: gstRes.status === 'VERIFIED' ? 'VERIFIED' : 'REQUIRES_REVIEW',
        data: gstRes,
        verifiedAt: new Date().toISOString(),
      },
      {
        id: `ver-pan-${Date.now()}`,
        bidderId,
        serviceName: 'panService',
        isMockData: true,
        status: panRes.status === 'VERIFIED' ? 'VERIFIED' : 'REQUIRES_REVIEW',
        data: panRes,
        verifiedAt: new Date().toISOString(),
      },
      {
        id: `ver-udyam-${Date.now()}`,
        bidderId,
        serviceName: 'udyamService',
        isMockData: true,
        status: udyamRes.status === 'VERIFIED' ? 'VERIFIED' : 'REQUIRES_REVIEW',
        data: udyamRes,
        verifiedAt: new Date().toISOString(),
      },
      {
        id: `ver-mca-${Date.now()}`,
        bidderId,
        serviceName: 'mcaService',
        isMockData: true,
        status: mcaRes.status === 'VERIFIED' ? 'VERIFIED' : 'REQUIRES_REVIEW',
        data: mcaRes,
        verifiedAt: new Date().toISOString(),
      },
    ];

    dbStore.verificationResults.set(bidderId, results);

    // Run Deterministic Compliance Engine & AI Advisory Generator
    const complianceReport = await complianceEngine.evaluateBidderCompliance(bidderId);

    // Persist to PostgreSQL
    await persistVerificationsToPg(bidderId, results);
    await persistFindingsToPg(bidderId, complianceReport.findings);
    await persistBidderScoreToPg(bidderId, complianceReport.complianceScore, complianceReport.riskLevel, bidder.status);

    res.json({
      success: true,
      verificationResults: results,
      complianceReport,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Verification failed', details: err.message });
  }
});

// GET /api/bidders/:id/verification
apiRouter.get('/bidders/:id/verification', (req: Request, res: Response) => {
  const verifications = dbStore.verificationResults.get(req.params.id) || [];
  res.json({ success: true, count: verifications.length, verifications });
});

// GET /api/bidders/:id/compliance
apiRouter.get('/bidders/:id/compliance', async (req: Request, res: Response) => {
  try {
    const bidderId = req.params.id;
    const report = await complianceEngine.evaluateBidderCompliance(bidderId);
    res.json({ success: true, report });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

// GET /api/bidders/:id/risk
apiRouter.get('/bidders/:id/risk', async (req: Request, res: Response) => {
  try {
    const bidderId = req.params.id;
    const report = await complianceEngine.evaluateBidderCompliance(bidderId);
    res.json({
      success: true,
      bidderId,
      riskLevel: report.riskLevel,
      riskScore: report.riskScore,
      flaggedMandatory: report.mandatoryStatusSummary.flaggedMandatory,
      findings: report.findings.filter((f) => f.severity === 'HIGH' || f.severity === 'MEDIUM'),
      disclaimer: report.disclaimer,
    });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

// ====================================================================
// 6. Officer Remarks & Decision Endpoints
// ====================================================================

// POST /api/bidders/:id/remarks
apiRouter.post('/bidders/:id/remarks', (req: Request, res: Response) => {
  try {
    const bidder = dbStore.bidders.get(req.params.id);
    if (!bidder) {
      return res.status(404).json({ error: 'Bidder not found' });
    }

    const { remarks, officerName, officerId } = req.body;
    if (!remarks) {
      return res.status(400).json({ error: 'Remarks are required' });
    }

    bidder.remarks = remarks;
    bidder.updatedAt = new Date().toISOString();

    auditService.recordLog({
      user: officerName || 'Procurement Officer',
      userRole: 'OFFICER',
      action: 'OFFICER_REMARK_ADDED',
      entity: 'BIDDER',
      entityId: bidder.id,
      details: {
        officerId: officerId || 'OFF-001',
        bidId: bidder.bidId,
        remarks,
      },
    });

    res.json({ success: true, message: 'Remarks recorded successfully', bidder });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to record remarks', details: err.message });
  }
});

// POST /api/bidders/:id/final-decision
apiRouter.post('/bidders/:id/final-decision', async (req: Request, res: Response) => {
  try {
    const bidder = dbStore.bidders.get(req.params.id);
    if (!bidder) {
      return res.status(404).json({ error: 'Bidder not found' });
    }

    const { officerId, officerName, officerDesignation, decision, remarks, evidenceReviewed } = req.body;

    const allowedDecisions = ['QUALIFIED', 'DISQUALIFIED', 'FURTHER_REVIEW'];
    if (!decision || !allowedDecisions.includes(decision)) {
      return res.status(400).json({
        error: `Decision must be one of: ${allowedDecisions.join(', ')}`,
      });
    }

    if (!officerId) {
      return res.status(400).json({ error: 'Officer ID is mandatory' });
    }
    if (!remarks || remarks.trim().length === 0) {
      return res.status(400).json({ error: 'Officer remarks are mandatory' });
    }

    const decisionRecord: OfficerDecision = {
      id: `dec-${Date.now()}`,
      bidderId: bidder.id,
      officerId,
      officerName: officerName || 'Rajeev Ramanathan',
      officerDesignation: officerDesignation || 'Chief Procurement Officer (Grade I)',
      decision,
      remarks,
      evidenceReviewed: Array.isArray(evidenceReviewed) ? evidenceReviewed : [],
      timestamp: new Date().toISOString(),
    };

    // Store in database
    dbStore.officerDecisions.set(bidder.id, decisionRecord);
    await persistBidderDecisionToPg(decisionRecord);

    bidder.finalDecision = {
      decision: decisionRecord.decision,
      officerId: decisionRecord.officerId,
      officerName: decisionRecord.officerName,
      remarks: decisionRecord.remarks,
      evidenceReviewed: decisionRecord.evidenceReviewed,
      timestamp: decisionRecord.timestamp,
    };
    bidder.updatedAt = new Date().toISOString();

    // Create Audit Log automatically
    const auditEntry = auditService.recordLog({
      user: decisionRecord.officerName,
      userRole: 'OFFICER',
      action: 'FINAL_DECISION_RECORDED',
      entity: 'DECISION',
      entityId: bidder.id,
      details: {
        bidId: bidder.bidId,
        decision: decisionRecord.decision,
        officerId: decisionRecord.officerId,
        remarks: decisionRecord.remarks,
        evidenceReviewedCount: decisionRecord.evidenceReviewed.length,
      },
    });

    res.json({
      success: true,
      message: `Final decision ${decision} recorded with immutable audit trail`,
      decision: decisionRecord,
      auditLog: auditEntry,
      bidder,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to record final decision', details: err.message });
  }
});

// ====================================================================
// 7. Audit Trail Endpoints (Read-Only)
// ====================================================================

// GET /api/bidders/:id/audit
apiRouter.get('/bidders/:id/audit', (req: Request, res: Response) => {
  const logs = auditService.getAuditLogsByEntity(req.params.id);
  res.json({ success: true, count: logs.length, logs });
});

// GET /api/audit
apiRouter.get('/audit', (req: Request, res: Response) => {
  const logs = auditService.getAllAuditLogs();
  res.json({ success: true, count: logs.length, logs });
});
