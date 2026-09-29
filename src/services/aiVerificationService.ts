/**
 * AI Verification Service
 * Simulates document understanding, information extraction, discrepancy detection,
 * and decision-support recommendations.
 * 
 * CORE PRINCIPLE: AI assists the Procurement Officer. AI must NEVER make the final
 * qualification/disqualification decision.
 * 
 * In production: Replace with authenticated calls to your backend AI/Gemini endpoint.
 */

export interface ExtractedDocumentData {
  documentId: string;
  documentTitle: string;
  fields: Record<string, { value: string; confidence: number; verifiedAgainstRegistry?: boolean }>;
  ocrConfidence: number;
  extractedAt: string;
}

export interface VerificationSourceComparison {
  field: string;
  submittedDocumentValue: string;
  governmentRegistryValue: string;
  portalSource: string;
  status: 'MATCH' | 'DISCREPANCY' | 'PENDING_PORTAL' | 'NOT_APPLICABLE';
  details: string;
}

export interface RiskIndicator {
  id: string;
  title: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'STATUTORY' | 'OEM' | 'FINANCIAL' | 'EXPIRY' | 'MISMATCH';
  reason: string;
  evidence: string;
  recommendedOfficerAction: string;
}

export interface AiAnalysisResult {
  bidderId: string;
  bidderName: string;
  overallScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  riskScore: number; // e.g. 15/100, 35/100, 75/100
  summary: string;
  extractedData: Record<string, ExtractedDocumentData>;
  verificationResults: VerificationSourceComparison[];
  missingRequirements: string[];
  inconsistencies: {
    field: string;
    description: string;
    submittedSource: string;
    registrySource: string;
    severity: 'WARNING' | 'CRITICAL';
  }[];
  riskIndicators: RiskIndicator[];
  recommendation: {
    overview: string;
    recommendedActions: string[];
    statutoryDisclaimer: string;
  };
}

export const aiVerificationService = {
  /**
   * Simulates OCR & LayoutLM document extraction
   */
  async analyzeDocument(docTitle: string, rawSnippet?: string): Promise<ExtractedDocumentData> {
    await new Promise((res) => setTimeout(res, 200));
    return {
      documentId: 'doc-' + Math.random().toString(36).substring(7),
      documentTitle: docTitle,
      ocrConfidence: 96.5,
      extractedAt: new Date().toISOString(),
      fields: {
        legalName: { value: 'Shree Tech Solutions Private Limited', confidence: 99.2, verifiedAgainstRegistry: true },
        gstin: { value: '27ABCDE1234F1Z5', confidence: 98.7, verifiedAgainstRegistry: true },
        pan: { value: 'AABCS1234D', confidence: 99.0, verifiedAgainstRegistry: true },
        validityDate: { value: '2026-11-30', confidence: 92.4, verifiedAgainstRegistry: false },
      },
    };
  },

  /**
   * Compares submitted document data against government registries
   */
  compareSources(submitted: Record<string, string>, registry: Record<string, string>): VerificationSourceComparison[] {
    return [
      {
        field: 'Legal Entity Name',
        submittedDocumentValue: submitted.legalName || 'Shree Tech Solutions Pvt. Ltd.',
        governmentRegistryValue: registry.legalName || 'Shree Tech Solutions Private Limited',
        portalSource: 'GSTN & MCA21 Master Data',
        status: 'MATCH',
        details: 'Entity name matches MCA21 database with 99.4% fuzzy string confidence.',
      },
      {
        field: 'Permanent Account Number (PAN)',
        submittedDocumentValue: submitted.pan || 'AABCS1234D',
        governmentRegistryValue: registry.pan || 'AABCS1234D',
        portalSource: 'Income Tax NSDL Registry',
        status: 'MATCH',
        details: 'Active operational PAN linked with corporate filing.',
      },
      {
        field: 'OEM Authorization Validity',
        submittedDocumentValue: submitted.oemValidTill || '30-Nov-2026',
        governmentRegistryValue: registry.tenderDeadline || '31-Dec-2026',
        portalSource: 'Tender Specification Clause 4.2',
        status: 'DISCREPANCY',
        details: 'OEM validity concludes 30 days prior to contract completion threshold. Requires Procurement Officer review.',
      },
      {
        field: 'Local Content Declaration (PPP-MII)',
        submittedDocumentValue: submitted.localContent || '62%',
        governmentRegistryValue: 'Class-I Local Supplier (>= 50%)',
        portalSource: 'DPIIT Make In India Framework',
        status: 'MATCH',
        details: 'Self-certification affidavit uploaded and verified by Chartered Engineer.',
      },
    ];
  },

  /**
   * Full AI verification analysis for a given bidder
   */
  async runFullVerification(bidderId: string, bidderName: string, complianceScore: number = 92): Promise<AiAnalysisResult> {
    // Simulate multi-stage AI reasoning latency
    await new Promise((res) => setTimeout(res, 500));

    const isNonCompliant = complianceScore < 50;
    const isPartial = complianceScore >= 50 && complianceScore < 80;

    const riskScore = isNonCompliant ? 78 : isPartial ? 35 : 15;
    const riskLevel: 'Low' | 'Medium' | 'High' = isNonCompliant ? 'High' : isPartial ? 'Medium' : 'Low';

    return {
      bidderId,
      bidderName,
      overallScore: complianceScore,
      riskLevel,
      riskScore,
      summary: isNonCompliant
        ? 'High compliance risk detected. Critical statutory documents are either missing or have expired return filings.'
        : isPartial
        ? 'The bidder is mostly compliant with key requirements. However, OEM authorization document and local content need officer verification.'
        : 'Most available registration information is verified. A small number of optional items require Procurement Officer review.',
      extractedData: {
        gstCert: {
          documentId: 'doc-gst-01',
          documentTitle: 'GST Certificate.pdf',
          ocrConfidence: 98.8,
          extractedAt: new Date().toISOString(),
          fields: {
            legalName: { value: bidderName, confidence: 99.4, verifiedAgainstRegistry: true },
            gstin: { value: '27ABCDE1234F1Z5', confidence: 98.9, verifiedAgainstRegistry: true },
          },
        },
      },
      verificationResults: [
        {
          field: 'GSTN Registration & Filing',
          submittedDocumentValue: 'Active Regular Taxpayer',
          governmentRegistryValue: 'Active Regular Taxpayer (GSTR-3B & GSTR-1 current)',
          portalSource: 'GSTN Public API Gateway',
          status: isNonCompliant ? 'DISCREPANCY' : 'MATCH',
          details: isNonCompliant ? 'Taxpayer status shows default in GSTR-3B filings.' : 'GSTR returns filed up to preceding tax period without default.',
        },
        {
          field: 'Udyam / MSME Certificate',
          submittedDocumentValue: 'UDYAM-TN-02-0045129',
          governmentRegistryValue: 'Active Medium Enterprise',
          portalSource: 'Ministry of MSME Udyam Portal',
          status: 'MATCH',
          details: 'Valid MSME certificate verified with authenticated digital signature.',
        },
        {
          field: 'Income Tax Permanent Account Number',
          submittedDocumentValue: 'AABCS1234D',
          governmentRegistryValue: 'Operative Company PAN',
          portalSource: 'Income Tax Department (NSDL)',
          status: 'MATCH',
          details: 'Valid and operative corporate PAN record.',
        },
        {
          field: 'OEM Manufacturer Authorization',
          submittedDocumentValue: 'Authorized till Nov 2026',
          governmentRegistryValue: 'Tender requires coverage through Dec 2026',
          portalSource: 'Tender Document Clause 4.2',
          status: 'DISCREPANCY',
          details: 'Authorization valid until Nov 2026. Needs Procurement Officer sign-off regarding 1-month buffer.',
        },
      ],
      missingRequirements: isNonCompliant ? ['Valid 3-Year Audited Balance Sheet', 'Bank Solvency Certificate'] : [],
      inconsistencies: isNonCompliant
        ? [
            {
              field: 'Annual Turnover',
              description: 'Reported ₹1.80 Cr in self-declaration, but CA certificate indicates ₹1.65 Cr.',
              submittedSource: 'Bidder Financial Self-Declaration',
              registrySource: 'CA Certified UDIN Statement',
              severity: 'CRITICAL',
            },
          ]
        : isPartial
        ? [
            {
              field: 'OEM MAF Validity Buffer',
              description: 'OEM Authorization is valid through Nov 2026, which is 30 days shy of the 3-year tender term.',
              submittedSource: 'OEM_Authorization.pdf',
              registrySource: 'Tender Specification Clause 4.2',
              severity: 'WARNING',
            },
          ]
        : [],
      riskIndicators: [
        {
          id: 'risk-1',
          title: 'OEM authorization requires review',
          severity: isNonCompliant ? 'HIGH' : 'MEDIUM',
          category: 'OEM',
          reason: 'OEM authorization document valid till Nov 2026 requires officer confirmation for 1-month buffer.',
          evidence: 'HP_OEM_Authorization_2026_CPCL.pdf, Page 1, Clause 3.',
          recommendedOfficerAction: 'Confirm with OEM or require supplementary 60-day validity extension letter.',
        },
        {
          id: 'risk-2',
          title: 'Make in India declaration requires verification',
          severity: 'LOW',
          category: 'STATUTORY',
          reason: 'Class-I Local Supplier self-declaration certified at 62% domestic content.',
          evidence: 'MII_Local_Content_Self_Declaration.pdf.',
          recommendedOfficerAction: 'Confirm local content breakdown matches Ministry of Commerce guidelines.',
        },
        {
          id: 'risk-3',
          title: 'One document has upcoming expiry concern',
          severity: 'LOW',
          category: 'EXPIRY',
          reason: 'Pollution Control Board consent certificate due for annual renewal in Q4.',
          evidence: 'Statutory compliance annexure page 4.',
          recommendedOfficerAction: 'Procurement officer may request routine renewal undertaking.',
        },
      ],
      recommendation: {
        overview: isNonCompliant
          ? 'Critical mandatory criteria have not been satisfied. The bidder presents high statutory risk; officer review is strongly advised before any qualification determination.'
          : 'Most available mandatory requirements have been verified. A small number of items require Procurement Officer review.',
        recommendedActions: [
          'Review latest applicable GST information',
          'Confirm local content declaration where applicable',
          'Review OEM authorization validity buffer if required by tender conditions',
        ],
        statutoryDisclaimer:
          'AI assists the Procurement Officer by identifying potential discrepancies and summarizing compliance data. Under GFR Rule 144, the Procurement Officer holds sole statutory authority to make and record final qualification/disqualification decisions.',
      },
    };
  },
};
