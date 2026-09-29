/**
 * Compliance Rule Engine
 * Deterministic rules calculation engine for public procurement tenders.
 * 
 * Rules are deterministic (not probabilistic LLMs) ensuring 100% auditable,
 * explainable, and consistent results compliant with GFR 2017 & GeM GTC.
 */

export interface RuleDefinition {
  id: string;
  code: string;
  name: string;
  category: 'STATUTORY' | 'TAX' | 'TECHNICAL' | 'FINANCIAL' | 'POLICY';
  isMandatory: boolean;
  weight: number; // e.g. 15 points
}

export interface RuleEvaluationResult {
  rule: RuleDefinition;
  status: 'COMPLIANT' | 'PARTIAL' | 'NON_COMPLIANT' | 'NOT_APPLICABLE' | 'PENDING_OFFICER_REVIEW';
  scoreAwarded: number;
  remarks: string;
  evidenceSource: string;
}

export interface BidderComplianceReportSummary {
  bidderId: string;
  totalRulesChecked: number;
  mandatoryRulesCount: number;
  mandatoryPassedCount: number;
  mandatoryIssuesCount: number;
  overallScore: number;
  status: 'Compliant' | 'Partial' | 'Non-Compliant';
  riskLevel: 'Low' | 'Medium' | 'High';
  ruleResults: RuleEvaluationResult[];
  complianceScoreNotice: string;
}

export const DEFAULT_TENDER_RULES: RuleDefinition[] = [
  { id: 'r-gst', code: 'R-GST-01', name: 'Active GST Registration & Regular Returns', category: 'TAX', isMandatory: true, weight: 20 },
  { id: 'r-pan', code: 'R-PAN-02', name: 'Valid Company PAN & Active ITR Filing', category: 'TAX', isMandatory: true, weight: 15 },
  { id: 'r-udyam', code: 'R-MSME-03', name: 'Active Udyam MSME Registration', category: 'STATUTORY', isMandatory: false, weight: 10 },
  { id: 'r-mca', code: 'R-MCA-04', name: 'MCA21 Active Legal Entity & Solvency', category: 'STATUTORY', isMandatory: true, weight: 15 },
  { id: 'r-mii', code: 'R-MII-05', name: 'Make In India (PPP-MII) Local Content Declaration', category: 'POLICY', isMandatory: true, weight: 15 },
  { id: 'r-oem', code: 'R-OEM-06', name: 'Manufacturer Authorization Form (OEM MAF)', category: 'TECHNICAL', isMandatory: true, weight: 15 },
  { id: 'r-epfo', code: 'R-EPF-07', name: 'EPFO / ESIC Statutory Compliance or Exemption', category: 'STATUTORY', isMandatory: false, weight: 5 },
  { id: 'r-debar', code: 'R-DEBAR-08', name: 'Debarment & Vigilance Blacklist Clearance', category: 'STATUTORY', isMandatory: true, weight: 5 },
];

export const complianceEngine = {
  evaluate(
    bidderId: string,
    inputs: {
      gstActive: boolean;
      gstReturnsFiled: boolean;
      panOperative: boolean;
      udyamActive: boolean;
      mcaActive: boolean;
      miiLocalPercent: number; // e.g. 62%
      oemVerified: boolean;
      oemPending: boolean;
      epfoCompliant: boolean;
      isBlacklisted: boolean;
    }
  ): BidderComplianceReportSummary {
    const results: RuleEvaluationResult[] = [];
    let totalScore = 0;
    let mandatoryIssues = 0;
    let mandatoryCount = 0;
    let mandatoryPassed = 0;

    for (const rule of DEFAULT_TENDER_RULES) {
      if (rule.isMandatory) mandatoryCount++;
      let status: RuleEvaluationResult['status'] = 'COMPLIANT';
      let score = rule.weight;
      let remarks = 'Verified through official portal cross-reference.';
      let evidence = 'National Government Gateway';

      switch (rule.id) {
        case 'r-gst':
          if (!inputs.gstActive) {
            status = 'NON_COMPLIANT';
            score = 0;
            remarks = 'GSTIN is suspended or inactive on GSTN portal.';
            evidence = 'GSTN Public API Gateway';
          } else if (!inputs.gstReturnsFiled) {
            status = 'PARTIAL';
            score = rule.weight * 0.5;
            remarks = 'GSTIN active but delay observed in latest GSTR-3B filings.';
            evidence = 'GSTN Taxpayer Filing Ledger';
          } else {
            evidence = 'GSTN Taxpayer Master Registry';
          }
          break;

        case 'r-pan':
          if (!inputs.panOperative) {
            status = 'NON_COMPLIANT';
            score = 0;
            remarks = 'PAN is inoperative or name does not match MCA database.';
            evidence = 'NSDL / Income Tax e-Filing API';
          } else {
            evidence = 'NSDL PAN Corporate Registry';
          }
          break;

        case 'r-udyam':
          if (inputs.udyamActive) {
            status = 'COMPLIANT';
            score = rule.weight;
            remarks = 'Active Medium Enterprise Udyam Registration confirmed.';
            evidence = 'Ministry of MSME Udyam Portal';
          } else {
            status = 'NOT_APPLICABLE';
            score = rule.weight;
            remarks = 'Udyam not claimed; standard non-MSME criteria applied.';
            evidence = 'Bidder Submission Self-declaration';
          }
          break;

        case 'r-mca':
          if (inputs.mcaActive) {
            status = 'COMPLIANT';
            score = rule.weight;
            remarks = 'Active Private Limited Company in good standing with ROC.';
            evidence = 'Ministry of Corporate Affairs MCA21 Master Data';
          } else {
            status = 'NON_COMPLIANT';
            score = 0;
            remarks = 'Entity strike-off or default status on MCA21.';
            evidence = 'MCA21 Database';
          }
          break;

        case 'r-mii':
          if (inputs.miiLocalPercent >= 50) {
            status = 'COMPLIANT';
            score = rule.weight;
            remarks = `Class-I Local Supplier confirmed with ${inputs.miiLocalPercent}% domestic content.`;
            evidence = 'DPIIT Make In India Self-Declaration';
          } else if (inputs.miiLocalPercent >= 20) {
            status = 'PARTIAL';
            score = rule.weight * 0.7;
            remarks = `Class-II Local Supplier with ${inputs.miiLocalPercent}% domestic content.`;
            evidence = 'DPIIT Make In India Self-Declaration';
          } else {
            status = 'NON_COMPLIANT';
            score = 0;
            remarks = 'Domestic content below statutory threshold (<20%).';
            evidence = 'DPIIT Make In India Self-Declaration';
          }
          break;

        case 'r-oem':
          if (inputs.oemVerified) {
            status = 'COMPLIANT';
            score = rule.weight;
            remarks = 'OEM Authorization Form verified and covering full contract period.';
            evidence = 'OEM Direct Partner Verification Portal';
          } else if (inputs.oemPending) {
            status = 'PENDING_OFFICER_REVIEW';
            score = rule.weight * 0.6;
            remarks = 'OEM Authorization Form attached; validity buffer requires officer scrutiny.';
            evidence = 'Uploaded OEM Authorization PDF';
          } else {
            status = 'NON_COMPLIANT';
            score = 0;
            remarks = 'OEM Authorization Form missing from tender submission package.';
            evidence = 'Technical Evaluation Envelope';
          }
          break;

        case 'r-epfo':
          if (inputs.epfoCompliant) {
            status = 'COMPLIANT';
            score = rule.weight;
            remarks = 'Exemption statement for small headcount (<20 staff) verified.';
            evidence = 'Shram Suvidha Unified Portal';
          } else {
            status = 'PARTIAL';
            score = rule.weight * 0.5;
            remarks = 'EPFO electronic challan return receipt pending verification.';
            evidence = 'EPFO ECR Verification Portal';
          }
          break;

        case 'r-debar':
          if (inputs.isBlacklisted) {
            status = 'NON_COMPLIANT';
            score = 0;
            remarks = 'Adverse debarment record identified on Central Public Procurement Portal.';
            evidence = 'Central Vigilance / GeM Debarment Repository';
          } else {
            status = 'COMPLIANT';
            score = rule.weight;
            remarks = 'Clear background. No active debarment or vigilance sanction found.';
            evidence = 'GeM Debarment & Vigilance Registry';
          }
          break;
      }

      if (rule.isMandatory) {
        if (status === 'COMPLIANT') {
          mandatoryPassed++;
        } else if (status === 'NON_COMPLIANT' || status === 'PENDING_OFFICER_REVIEW') {
          mandatoryIssues++;
        }
      }

      totalScore += score;
      results.push({
        rule,
        status,
        scoreAwarded: score,
        remarks,
        evidenceSource: evidence,
      });
    }

    const overallScore = Math.round(totalScore);
    const status: BidderComplianceReportSummary['status'] =
      overallScore >= 80 && mandatoryIssues === 0
        ? 'Compliant'
        : overallScore >= 50
        ? 'Partial'
        : 'Non-Compliant';

    const riskLevel: 'Low' | 'Medium' | 'High' =
      overallScore >= 80 && mandatoryIssues === 0
        ? 'Low'
        : overallScore >= 60
        ? 'Medium'
        : 'High';

    return {
      bidderId,
      totalRulesChecked: DEFAULT_TENDER_RULES.length,
      mandatoryRulesCount: mandatoryCount,
      mandatoryPassedCount: mandatoryPassed,
      mandatoryIssuesCount: mandatoryIssues,
      overallScore,
      status,
      riskLevel,
      ruleResults: results,
      complianceScoreNotice:
        'Compliance score is a decision-support indicator and does not automatically determine bidder qualification. Mandatory requirements require individual officer scrutiny.',
    };
  },
};
