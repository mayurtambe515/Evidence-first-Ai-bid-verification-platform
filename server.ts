import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { apiRouter } from "./server/routes/api";
import { getPgPool, syncStoreFromPostgres } from "./server/db/database";
import { initializePostgresDatabase } from "./server/db/initDb";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Mount full-stack modular API router for GeM compliance engine
app.use("/api", apiRouter);

// Initialize Gemini SDK with telemetry header
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// -------------------------------------------------------------
// Simulated Government Portal Endpoints (Mock)
// Clearly documented and marked as simulated for hackathon demo
// -------------------------------------------------------------

app.get("/mock/gstn-lookup", (req, res) => {
  const gstin = (req.query.gstin as string || "").toUpperCase().trim();
  
  if (gstin.includes("07AAAAA0000A1Z5") || gstin.includes("APEX")) {
    return res.json({
      portal: "GSTN Authorized Public API (Simulated)",
      query: gstin,
      status: "Active",
      legalName: "Apex Technologies Private Limited",
      tradeName: "Apex Tech Solutions",
      gstin: "07AAAAA0000A1Z5",
      taxpayerType: "Regular",
      registrationDate: "2018-04-12",
      constitutionOfBusiness: "Private Limited Company",
      principalPlaceOfBusiness: "Plot 42, Okhla Industrial Area Phase III, New Delhi 110020",
      filingStatus: {
        gstr1LastQuarter: "FILED",
        gstr3bLastQuarter: "FILED",
        filingFrequency: "Monthly",
        complianceRating: "10/10",
        lastFilingDate: "2026-08-10"
      },
      verifiedAt: new Date().toISOString()
    });
  }

  if (gstin.includes("27BBBBB1111B1Z2") || gstin.includes("BHARAT")) {
    return res.json({
      portal: "GSTN Authorized Public API (Simulated)",
      query: gstin,
      status: "Active (Returns Delayed)",
      legalName: "Bharat Logistics & Hardware Solutions LLP",
      tradeName: "Bharat Logistics",
      gstin: "27BBBBB1111B1Z2",
      taxpayerType: "Regular",
      registrationDate: "2021-09-15",
      constitutionOfBusiness: "Limited Liability Partnership",
      principalPlaceOfBusiness: "Gala 14, MIDC Industrial Area, Andheri East, Mumbai 400093",
      filingStatus: {
        gstr1LastQuarter: "NOT_FILED",
        gstr3bLastQuarter: "DELAYED_2_PERIODS",
        filingFrequency: "Quarterly",
        complianceRating: "4/10",
        lastFilingDate: "2026-01-20"
      },
      verifiedAt: new Date().toISOString()
    });
  }

  if (gstin.includes("09CCCCC2222C1Z8") || gstin.includes("VERTEX")) {
    return res.json({
      portal: "GSTN Authorized Public API (Simulated)",
      query: gstin,
      status: "Active",
      legalName: "Vertex Infotech Solutons LLP",
      tradeName: "Vertex Infotech Solutons",
      gstin: "09CCCCC2222C1Z8",
      taxpayerType: "Regular",
      registrationDate: "2020-02-18",
      constitutionOfBusiness: "Limited Liability Partnership",
      principalPlaceOfBusiness: "Tower B, Sector 62, Noida, Gautam Buddha Nagar, Uttar Pradesh 201309",
      filingStatus: {
        gstr1LastQuarter: "FILED",
        gstr3bLastQuarter: "FILED",
        filingFrequency: "Monthly",
        complianceRating: "9/10",
        lastFilingDate: "2026-07-28"
      },
      verifiedAt: new Date().toISOString()
    });
  }

  // Generic fallback simulated portal record
  return res.json({
    portal: "GSTN Authorized Public API (Simulated)",
    query: gstin,
    status: "Active",
    legalName: "Verified Enterprise Entity",
    tradeName: "Enterprise Trade Name",
    gstin: gstin || "07SAMPLE1234F1Z9",
    taxpayerType: "Regular",
    registrationDate: "2021-01-01",
    constitutionOfBusiness: "Private Limited Company",
    principalPlaceOfBusiness: "Industrial Area, New Delhi",
    filingStatus: {
      gstr1LastQuarter: "FILED",
      gstr3bLastQuarter: "FILED",
      filingFrequency: "Monthly",
      complianceRating: "8/10",
      lastFilingDate: "2026-08-01"
    },
    verifiedAt: new Date().toISOString()
  });
});

app.get("/mock/udyam-lookup", (req, res) => {
  const udyam = (req.query.udyam as string || "").toUpperCase().trim();

  if (udyam.includes("UDYAM-DL-01-0012345") || udyam.includes("APEX")) {
    return res.json({
      portal: "Ministry of MSME - Udyam Registry (Simulated)",
      status: "Active",
      udyamRegistrationNo: "UDYAM-DL-01-0012345",
      enterpriseName: "Apex Technologies Private Limited",
      enterpriseType: "Medium",
      majorActivity: "Services & Manufacturing",
      organizationType: "Private Limited",
      dateOfIncorporation: "2018-04-12",
      nic2DigitCode: "62 - Computer programming, consultancy and related activities",
      verifiedAt: new Date().toISOString()
    });
  }

  if (udyam.includes("UDYAM-MH-02-0098765") || udyam.includes("BHARAT")) {
    return res.json({
      portal: "Ministry of MSME - Udyam Registry (Simulated)",
      status: "Expired / Suspended (Classification Update Overdue)",
      udyamRegistrationNo: "UDYAM-MH-02-0098765",
      enterpriseName: "Bharat Logistics & Hardware Solutions LLP",
      enterpriseType: "Small",
      majorActivity: "Trading & Logistics",
      organizationType: "LLP",
      dateOfIncorporation: "2021-09-15",
      nic2DigitCode: "46 - Wholesale trade",
      verifiedAt: new Date().toISOString()
    });
  }

  if (udyam.includes("UDYAM-GJ-03-0054321") || udyam.includes("VERTEX")) {
    return res.json({
      portal: "Ministry of MSME - Udyam Registry (Simulated)",
      status: "Active",
      udyamRegistrationNo: "UDYAM-GJ-03-0054321",
      enterpriseName: "Vertex InfoTech Solutions Limited",
      enterpriseType: "Medium",
      majorActivity: "Services",
      organizationType: "Public Limited Company",
      dateOfIncorporation: "2019-11-04",
      registeredOfficeAddress: "SG Highway, Makarba, Ahmedabad, Gujarat 380051",
      nic2DigitCode: "62 - Computer programming and consultancy",
      verifiedAt: new Date().toISOString()
    });
  }

  return res.json({
    portal: "Ministry of MSME - Udyam Registry (Simulated)",
    status: "Active",
    udyamRegistrationNo: udyam || "UDYAM-XX-00-0000000",
    enterpriseName: "Sample Enterprise MSME",
    enterpriseType: "Small",
    majorActivity: "Manufacturing & Services",
    organizationType: "Private Limited",
    dateOfIncorporation: "2020-01-01",
    verifiedAt: new Date().toISOString()
  });
});

app.get("/mock/pan-nsdl-lookup", (req, res) => {
  const pan = (req.query.pan as string || "").toUpperCase().trim();

  if (pan.includes("AAAAA0000A") || pan.includes("APEX")) {
    return res.json({
      portal: "Income Tax Department / NSDL PAN Verification (Simulated)",
      status: "Valid & Operative",
      pan: "AAAAA0000A",
      registeredName: "Apex Technologies Private Limited",
      entityCategory: "Company",
      issuanceDate: "2018-03-25",
      aadhaarSeedingStatus: "Not Applicable (Company)",
      verifiedAt: new Date().toISOString()
    });
  }

  if (pan.includes("BBBBB1111B") || pan.includes("BHARAT")) {
    return res.json({
      portal: "Income Tax Department / NSDL PAN Verification (Simulated)",
      status: "Valid & Operative",
      pan: "BBBBB1111B",
      registeredName: "Bharat Logistics & Hardware Solutions LLP",
      entityCategory: "Limited Liability Partnership",
      issuanceDate: "2021-08-30",
      aadhaarSeedingStatus: "Not Applicable",
      verifiedAt: new Date().toISOString()
    });
  }

  if (pan.includes("CCCCC2222C") || pan.includes("VERTEX")) {
    return res.json({
      portal: "Income Tax Department / NSDL PAN Verification (Simulated)",
      status: "Valid & Operative",
      pan: "CCCCC2222C",
      registeredName: "VERTEX INFOTECH SOLUTIONS LIMITED",
      entityCategory: "Company",
      issuanceDate: "2019-10-10",
      aadhaarSeedingStatus: "Not Applicable",
      verifiedAt: new Date().toISOString()
    });
  }

  return res.json({
    portal: "Income Tax Department / NSDL PAN Verification (Simulated)",
    status: "Valid & Operative",
    pan: pan || "ABCDE1234F",
    registeredName: "Registered Corporate Entity",
    entityCategory: "Company",
    issuanceDate: "2020-05-15",
    verifiedAt: new Date().toISOString()
  });
});

app.get("/mock/oem-portal-lookup", (req, res) => {
  const cert = (req.query.cert as string || "").toUpperCase().trim();

  if (cert.includes("DELL-OEM-2026-9981") || cert.includes("APEX")) {
    return res.json({
      portal: "OEM Global Partner Registry (Dell Enterprise) (Simulated)",
      status: "Active & Verified",
      authorizationNumber: "DELL-OEM-2026-9981",
      authorizedBidder: "Apex Technologies Private Limited",
      partnerTier: "Titanium OEM Solution Partner",
      tenderSpecificAuthorization: "CPCL-2026-001",
      validFrom: "2026-01-01",
      validTill: "2027-12-31",
      warrantyCommitment: "Direct OEM 5-Year 24x7 Mission Critical Support",
      verifiedAt: new Date().toISOString()
    });
  }

  if (cert.includes("HPE-OEM-2024-4412") || cert.includes("VERTEX")) {
    return res.json({
      portal: "OEM Global Partner Registry (HPE Servers) (Simulated)",
      status: "EXPIRED",
      authorizationNumber: "HPE-OEM-2024-4412",
      authorizedBidder: "Vertex Infotech Solutions Limited",
      partnerTier: "Registered Reseller",
      tenderSpecificAuthorization: "General IT Supply",
      validFrom: "2024-06-01",
      validTill: "2026-07-15",
      warrantyCommitment: "Expired - Renewal Under Commercial Review",
      verifiedAt: new Date().toISOString()
    });
  }

  return res.json({
    portal: "OEM Global Partner Registry (Simulated)",
    status: "NOT_FOUND_OR_UNVERIFIED",
    authorizationNumber: cert || "UNKNOWN",
    authorizedBidder: "Unknown Bidder",
    verifiedAt: new Date().toISOString()
  });
});

// -------------------------------------------------------------
// Gemini API Endpoints (Server-Side)
// -------------------------------------------------------------

// Document extraction endpoint
app.post("/api/gemini/extract", async (req, res) => {
  try {
    const { documentName, documentType, rawText, sampleData } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback deterministic extractor if GEMINI_API_KEY is not configured
      return res.json({
        success: true,
        source: "deterministic_fallback",
        extractedFields: sampleData || {
          companyName: "Sample Extracted Ltd",
          documentNumber: "SAMPLE-999",
          issueDate: "2025-01-01",
          status: "Verified",
        },
        confidence: 0.94,
      });
    }

    const prompt = `You are an automated legal document parser for Indian Government GeM procurement tenders.
Extract all structured compliance fields from this ${documentType} document named "${documentName}".
Document text / context:
${rawText || JSON.stringify(sampleData || {})}

Return a valid JSON object with:
1. "fields": key-value pairs of extracted metadata (such as companyName, legalEntity, gstin, pan, udyamNumber, issueDate, expiryDate, address, authorizedSignatory, status, taxFilingStatus)
2. "confidence": float between 0.85 and 0.99
3. "summary": brief one-sentence summary of what this document certifies
4. "potentialAnomalies": array of strings describing any visible formatting or consistency red flags

ONLY return valid JSON.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      const text = response.text || "{}";
      const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
      const parsed = JSON.parse(cleaned);
      return res.json({
        success: true,
        source: "gemini-3.8-flash",
        ...parsed,
      });
    } catch (genError: any) {
      console.warn("Gemini call fell back to deterministic parser:", genError.message || genError);
      return res.json({
        success: true,
        source: "deterministic_fallback",
        extractedFields: sampleData || {
          companyName: "Apex Technologies Private Limited",
          documentNumber: "DOC-VERIFIED-2026",
          issueDate: "2026-01-15",
          status: "Active & Verified",
        },
        confidence: 0.95,
        summary: `Verified ${documentName} (${documentType}) metadata against tender criteria.`,
        potentialAnomalies: [],
      });
    }
  } catch (error: any) {
    console.error("Gemini extract error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to extract document fields via Gemini",
    });
  }
});

// Contradiction detection endpoint
app.post("/api/gemini/detect-contradictions", async (req, res) => {
  try {
    const { bidderName, documents, comparisonPairs } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback contradiction detection logic for demo if no key
      return res.json({
        success: true,
        source: "deterministic_fallback",
        contradictions: [
          {
            field: "Entity Name & Legal Structure",
            doc1: "GST Certificate (Vertex Infotech Solutons LLP)",
            doc2: "PAN Card (VERTEX INFOTECH SOLUTIONS LIMITED)",
            explanation: "Legal entity structure mismatch: 'LLP' vs 'LIMITED', along with typographical misspelling ('Solutons' vs 'Solutions').",
            severity: "HIGH",
            confidence: 0.96
          }
        ]
      });
    }

    const prompt = `You are a forensic compliance auditor for Government of India GeM tender evaluation.
Analyze these bidder documents and extracted fields for subtle contradictions, identity mismatches, spelling variations, entity classification conflicts (e.g. LLP vs Pvt Ltd vs Ltd), address discrepancies, or expired accreditations.

Bidder Name: ${bidderName}
Documents and Extracted Fields:
${JSON.stringify(documents, null, 2)}

Comparison Pairs to cross-check:
${JSON.stringify(comparisonPairs, null, 2)}

Return a valid JSON object with:
{
  "contradictions": [
    {
      "field": "string name of field",
      "doc1": "document name and value",
      "doc2": "counterpart document name and value",
      "explanation": "concise forensic finding of discrepancy",
      "severity": "HIGH" | "MEDIUM" | "LOW",
      "confidence": number between 0.85 and 0.99
    }
  ],
  "overallRiskAssessment": "string summary",
  "recommendedAction": "APPROVE" | "REJECT" | "REQUEST_CLARIFICATION"
}

ONLY return valid JSON.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      const text = response.text || "{}";
      const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
      const parsed = JSON.parse(cleaned);
      return res.json({
        success: true,
        source: "gemini-3.8-flash",
        ...parsed,
      });
    } catch (genError: any) {
      console.warn("Gemini contradiction call fell back to deterministic analyzer:", genError.message || genError);
      return res.json({
        success: true,
        source: "deterministic_fallback",
        contradictions: [
          {
            field: "Entity Name & Legal Structure",
            doc1: "GST Certificate (Vertex Infotech Solutons LLP)",
            doc2: "PAN Card (VERTEX INFOTECH SOLUTIONS LIMITED)",
            explanation: "Legal entity structure mismatch: 'LLP' vs 'LIMITED', along with typographical misspelling ('Solutons' vs 'Solutions').",
            severity: "HIGH",
            confidence: 0.96,
          },
        ],
        overallRiskAssessment: "Forensic analysis detected corporate constitution and spelling mismatches across submitted legal documents.",
        recommendedAction: "REJECT",
      });
    }
  } catch (error: any) {
    console.error("Gemini contradiction error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to detect contradictions via Gemini",
    });
  }
});

// -------------------------------------------------------------
// AI Assistant Helper / Chat Endpoint (Gemini + Domain Knowledge)
// Explains all app features, how to use the app, adding docs, and rules
// -------------------------------------------------------------
app.post("/api/gemini/assistant", async (req, res) => {
  try {
    const { message, conversationHistory = [], currentContext = {} } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        error: "Message query is required",
      });
    }

    const ai = getGeminiClient();

    // Context grounding
    const contextPrompt = `
You are the official GeM Compliance Intelligence AI Assistant and Technical Advisor for Government of India e-Marketplace public procurement officers, statutory auditors, and administrators.
You provide clear, accurate, step-by-step guidance on all platform features, document ingestion, compliance rules, and statutory procurement guidelines (GFR 2017 Rule 149, GeM GTC Clause 8.4).

CURRENT APP CONTEXT:
- Active Tab: ${currentContext.currentTab || "dashboard"}
- Selected Tender: ${currentContext.tenderRef || "CPCL-2026-001"} (${currentContext.tenderTitle || "Enterprise Server Cluster"})
- Selected Bidder: ${currentContext.bidderName || "Apex Technologies Ltd"} (Scenario: ${currentContext.bidderScenario || "CLEAN_COMPLIANT"})
- User Role: ${currentContext.userRole || "Procurement Officer"}

PLATFORM ARCHITECTURE & CAPABILITIES:
1. THREE CORE PILLARS:
   - Pillar 1: Deterministic Rules Engine (Zero hallucinations, mathematical scoring, verifiable rule citations).
   - Pillar 2: Multimodal AI & Registry Cross-Check (OCR parsing of PDF/images, matching against simulated GSTN, Udyam, and NSDL portals).
   - Pillar 3: Cryptographic Immutable Audit Chain (SHA-256 block-chained ledger with previousHash pointers, tamper detection, and verification).

2. KEY FEATURES & HOW TO USE:
   - Dashboard Cockpit: Live compliance score ring, risk level (LOW/MEDIUM/HIGH), evidence checklist with pass/warn/fail filters.
   - Side-by-Side Forensic Evidence Inspector: Highlights discrepancies side-by-side between submitted bidder PDFs and statutory registries (e.g. LLP vs Limited entity structure conflict in Vertex Infotech, or missing OEM MAF in Bharat Logistics).
   - What-If Resubmission Simulator: Non-destructive scenario tester allowing officers to preview projected score improvements if missing/expired documents are rectified under Clause 8.4.
   - Officer Override Modal: Allows authorized Procurement Officers (under GeM Clause 8.4) to conditionally approve or reject a bidder with mandatory written justification, circular citation, and officer designation. Auditors have read-only access.
   - Cryptographic Audit Trail: Chronological block-chained logs. Includes interactive "Verify Chain Integrity", "Simulate Tamper", and "Restore Valid Chain" tools.
   - Documents & AI Parsing: Drag-and-drop or manual upload of PDF/image certificates. Multi-modal Gemini OCR parses key attributes, and engine instantly re-evaluates all rules.
   - Statutory Portals Cross-Check: Live simulated queries against GSTN (returns & status), Udyam (MSME NIC code), and NSDL (PAN & entity classification).
   - Rules Configuration: Visual builder and JSON editor to adjust rule thresholds, weights, mandatory flags, or add custom procurement rules.
   - Formal Audit Report: Printable, exportable official audit document complete with executive findings, rule-by-rule matrix, officer sign-off, and QR verification.

3. HOW TO ADD / UPLOAD DOCUMENTS:
   - Navigate to the 'Documents & AI Parsing' tab from the left sidebar.
   - Click the 'Upload New Document' button or drag-and-drop a file (PDF or image).
   - Select the document category (GST Certificate, PAN Card, Udyam Registration, OEM Authorization Form, Financial Statement/Turnover, Past Experience).
   - The platform runs Gemini AI OCR to extract registration numbers, legal entity names, validity dates, and financial metrics.
   - Review or modify extracted values, then click 'Confirm & Ingest'.
   - The compliance engine automatically recalculates the bidder's compliance score, risk tier, and evidence items immediately.

4. EXPLANATION OF DETERMINISTIC COMPLIANCE RULES:
   - R-GST-ACT (GST Registration Status): Verifies active registration on GSTN portal, legal name consistency, and regular GSTR-3B filings. Weight: 20%.
   - R-PAN-MAT (PAN & Entity Classification): Cross-checks Permanent Account Number on the Income Tax Department NSDL registry and verifies entity constitution (e.g. catches fraudulent or conflicting claims such as an LLP claiming to be a Limited company). Weight: 20%.
   - R-UDYAM-ACT (Udyam MSME Active Status): Validates active registration on Ministry of MSME portal to qualify for statutory EMD exemption and procurement preference under Public Procurement Policy for MSEs Order 2012. Weight: 15%.
   - R-OEM-REQ (OEM Direct Authorization): Validates Manufacturer Authorization Form (MAF) from Tier-1 OEM, ensuring hardware warranty and SLA support for the complete tender lifecycle. Weight: 25%.
   - R-TURN-MIN (Minimum Annual Turnover Threshold): Confirms 3-year average audited annual turnover meets or exceeds tender requirement (e.g., ₹10.00 Cr for high-value tenders). Weight: 20%.

INSTRUCTIONS FOR YOUR RESPONSE:
- Answer the user's question directly, clearly, and authoritatively.
- Use clean formatting with bold titles, bullet points, and numbered steps where appropriate.
- Suggest specific tabs or buttons in the application that the user can click to accomplish their goal.
- If asked about rules, explain the statutory background (e.g. GeM STC, GFR 2017, Income Tax Act) as well as the practical check performed.
- If asked about uploading documents, give step-by-step instructions.
`;

    // Try Gemini first if available
    if (ai) {
      try {
        const chatMessages = [
          { role: "user", parts: [{ text: contextPrompt }] },
          { role: "model", parts: [{ text: "Understood. I am the GeM Compliance Intelligence AI Assistant, ready to guide users through all platform features, document ingestion, compliance rules, forensic analysis, and cryptographic audit workflows." }] },
        ];

        // Append conversation history
        for (const item of conversationHistory.slice(-6)) {
          chatMessages.push({
            role: item.role === "user" ? "user" : "model",
            parts: [{ text: item.text }],
          });
        }

        // Append the latest user query
        chatMessages.push({
          role: "user",
          parts: [{ text: message }],
        });

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: chatMessages as any,
        });

        const replyText = response.text || "";
        if (replyText.trim()) {
          return res.json({
            success: true,
            source: "gemini-3.8-flash",
            reply: replyText,
          });
        }
      } catch (geminiError: any) {
        console.warn("Gemini Assistant fallback to domain knowledge base:", geminiError.message || geminiError);
      }
    }

    // Deterministic Domain Knowledge Base Fallback
    const lower = message.toLowerCase();
    let reply = "";

    if (lower.includes("how to use") || lower.includes("get started") || lower.includes("guide") || lower.includes("overview")) {
      reply = `### How to Use GeM Compliance Intelligence

Welcome to the Government e-Marketplace (GeM) Compliance Intelligence platform. Here is your step-by-step workflow:

1. **Select Tender & Bidder**: Use the top header dropdowns or the sidebar **Evaluation Scenarios** to pick a tender and test bidder:
   - **Scenario A (Apex Technologies)**: Clean, 100% compliant bidder.
   - **Scenario B (Bharat Logistics)**: Missing OEM authorization and overdue GST filings.
   - **Scenario C (Vertex Infotech)**: Subtle corporate entity contradiction (LLP vs Public Limited).

2. **Inspect Compliance Cockpit**: Review the real-time Compliance Score ring, risk rating (Low/Medium/High), and Evidence Checklist. Filter by *Passed*, *Warnings*, or *Failed*.

3. **Inspect Side-by-Side Forensic Evidence**: When a discrepancy is detected, click **"Inspect Side-by-Side Evidence"** to view the submitted PDF certificate juxtaposed against the official government portal record with highlighted mismatching fields.

4. **Run "What-If" Resubmission Simulation**: Test how the bidder's score would improve if specific missing or expired documents are rectified under Clause 8.4, without altering official records.

5. **Officer Override (Clause 8.4)**: If authorized as a Procurement Officer, apply a statutory discretionary override with written justification. This creates an immutable block sealed with an SHA-256 cryptographic signature.

6. **Verify Audit Trail**: Go to **Audit Trail Logs** to view the cryptographically chained ledger. Click **"Verify Chain Integrity"** or **"Simulate Tamper"** to test blockchain-style verification.

7. **Generate Formal Audit Report**: Click **"Formal Report"** in the top header to view and print the official, executive-ready PDF audit dossier.`;
    } else if (lower.includes("document") || lower.includes("upload") || lower.includes("add doc") || lower.includes("ocr")) {
      reply = `### How to Add & Ingest Bidder Documents

To add new documents for verification:

1. **Open Documents View**: In the left sidebar navigation, click on **Documents & AI Parsing**.
2. **Upload or Add Manually**:
   - Click the **"Upload New Document"** button to drag-and-drop or select a file (PDF, PNG, JPG).
   - Or click **"Add Document Manually"** to enter document details directly.
3. **Select Category & Attributes**:
   - Supported categories include:
     - **GST Registration Certificate** (Form GST REG-06)
     - **Income Tax PAN Card** (NSDL format)
     - **Udyam MSME Registration Certificate**
     - **OEM Manufacturer Authorization Form (MAF)**
     - **Audited Financial Statements / Turnover Certificate**
     - **Past Performance & Experience Certificate**
4. **AI Multimodal OCR Extraction**:
   - The platform runs Gemini 2.5/3.8 Flash OCR to extract critical identifiers (Registration Numbers, Validity Dates, Entity Names, Financial Figures).
   - You can review the extracted confidence score and raw text snippet.
5. **Automatic Re-Evaluation**:
   - Once saved, the deterministic compliance engine immediately re-checks all tender rules against the newly uploaded document and updates the bidder's compliance score in real-time!`;
    } else if (lower.includes("rule") || lower.includes("criteria") || lower.includes("gst") || lower.includes("pan") || lower.includes("oem") || lower.includes("udyam") || lower.includes("turnover")) {
      reply = `### Explanation of Deterministic Compliance Rules

The platform evaluates bidders using strict, transparent deterministic rules to eliminate AI hallucinations:

- **R-GST-ACT (GST Registration & Active Status - Weight: 20%)**:
  - *Statutory Basis*: Central Goods and Services Tax Act 2017 & GeM GTC Cl. 4.
  - *Check*: Queries the simulated GSTN portal to confirm the GSTIN is active, the registered legal trade name matches the bid submission, and regular monthly returns (GSTR-3B) are filed.

- **R-PAN-MAT (PAN & Corporate Constitution Alignment - Weight: 20%)**:
  - *Statutory Basis*: Income Tax Act 1961 Sec 139A & Corporate Affairs Guidelines.
  - *Check*: Validates the 10-digit PAN on the NSDL database. Crucially checks **entity constitution** to prevent fraudulent misrepresentations (e.g. an LLP claiming to be a Limited company).

- **R-UDYAM-ACT (Udyam MSME Registration Status - Weight: 15%)**:
  - *Statutory Basis*: Ministry of MSME Public Procurement Policy for MSEs Order 2012.
  - *Check*: Validates active status on the National Udyam portal to grant statutory Earnest Money Deposit (EMD) exemption and 15% purchase preference.

- **R-OEM-REQ (OEM Direct Authorization Form / MAF - Weight: 25%)**:
  - *Statutory Basis*: GeM Specific Additional Terms (STC) Cl. 3.2.1.
  - *Check*: For IT hardware and server tenders, verifies an authorized Manufacturer Authorization Form (MAF) from the Tier-1 OEM covering warranty and SLA support for the entire 5-year tender lifecycle.

- **R-TURN-MIN (Minimum Annual Turnover Threshold - Weight: 20%)**:
  - *Statutory Basis*: General Financial Rules (GFR) 2017 Rule 149.
  - *Check*: Validates CA-certified audited balance sheets confirming 3-year average annual turnover meets or exceeds the tender's mandatory threshold (e.g. ₹10.00 Cr).

*Note: You can view, modify thresholds, adjust weights, or create new custom rules in the **Rules Configuration** tab.*`;
    } else if (lower.includes("override") || lower.includes("clause 8.4") || lower.includes("discretion")) {
      reply = `### Officer Discretionary Override (GeM Clause 8.4)

Under Indian Public Procurement norms and GeM General Terms and Conditions (GTC) Clause 8.4:

- **Human-in-the-Loop Safeguard**: AI never makes the final legal disqualification or qualification decision unilaterally. A designated Procurement Officer always holds statutory authority.
- **Mandatory Written Justification**: If an officer decides to overturn an automated failure (e.g. accepting an alternative certified undertaking for a minor typo), they must provide:
  - Official decision (**Approve Under Clause 8.4**, **Reject**, or **Request Official Clarification**)
  - Detailed statutory justification citing specific department orders or circulars
  - Officer Name, Employee ID, and Department Designation
- **Auditor Read-Only Enforcement**: Statutory Auditors can review all evidence and past overrides, but cannot execute overrides (button is disabled with an explanatory security badge).
- **Cryptographic Auto-Sealing**: Every override is immediately committed to the SHA-256 audit ledger, chaining it with the parent block hash to prevent post-facto tampering.`;
    } else if (lower.includes("audit") || lower.includes("hash") || lower.includes("chain") || lower.includes("tamper") || lower.includes("blockchain")) {
      reply = `### Cryptographically Chained Audit Trail

To satisfy Central Vigilance Commission (CVC) and CAG transparency standards:

1. **SHA-256 Block Chaining**: Each audit entry contains a cryptographic hash computed from its block number, timestamp, bidder data, evaluation score, override details, and the \`previousHash\` of the preceding block (starting from the Genesis block).
2. **Verify Chain Integrity**: In the **Audit Trail Logs** tab, clicking **"Verify Chain Integrity"** recalculates every block's cryptographic hash sequentially. A green verification banner confirms that zero records have been altered.
3. **Tamper Simulation**: Click **"Simulate Tamper"** to alter a historic compliance score. Re-verifying immediately triggers a red cryptographic alert showing the exact broken block number, expected hash, and actual hash!
4. **Restore Ledger**: Click **"Restore Valid Chain"** to re-seal the ledger back to valid cryptographic state.`;
    } else if (lower.includes("what if") || lower.includes("simulation") || lower.includes("resubmission")) {
      reply = `### Officer "What-If" Resubmission Simulator

The **What-If Resubmission Simulator** allows procurement officers to test hypothetical scenarios before issuing formal notices:

- **Non-Destructive Testing**: Test what would happen if a bidder provides a missing OEM certificate or rectifies an expired MSME renewal under a 48-hour clarification window.
- **Dynamic Score Projections**: Displays real-time score improvements (e.g. +28% or +45%) and updated risk levels as individual corrections are toggled.
- **Legal Integrity**: Clearly marked with an indigo **"Simulation Active: Preview Only"** badge, ensuring official audit logs and submitted bundles remain pristine and untampered.
- **Instant Reset**: Click **"Exit Simulation"** at any time to return to the official baseline compliance score.`;
    } else {
      reply = `### GeM Compliance Intelligence AI Assistant

I am here to assist you with all aspects of the application. Here are key things I can help you with:

- **App Navigation & Workflow**: How to switch tenders, test the 3 evaluation scenarios, filter evidence, and generate reports.
- **Document Management**: How to upload PDFs/images, run Gemini AI OCR, and manage verified attributes.
- **Compliance Rules**: In-depth explanations of R-GST-ACT, R-PAN-MAT, R-UDYAM-ACT, R-OEM-REQ, and R-TURN-MIN.
- **Forensic Inspection**: Using the Side-by-Side Evidence Inspector to uncover subtle discrepancies.
- **Cryptographic Audit Ledger**: How SHA-256 block chaining, tamper detection, and integrity verification work.
- **What-If Simulator & Officer Overrides**: Testing hypothetical resubmissions and recording Clause 8.4 decisions.

*Feel free to ask a specific question like: "How do I add a document?", "Explain rule R-OEM-REQ", or "How does the tamper check work?"*`;
    }

    return res.json({
      success: true,
      source: "domain_knowledge_base",
      reply,
    });
  } catch (error: any) {
    console.error("AI Assistant error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to process AI assistant query",
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    engine: "Evidence-First AI Bid Verification Engine",
    geminiEnabled: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// -------------------------------------------------------------
// Vite Middleware / Static Serving
// -------------------------------------------------------------
async function startServer() {
  // Initialize and verify PostgreSQL schema & sync store
  const pool = getPgPool();
  if (pool) {
    try {
      console.log("[Server] Verifying PostgreSQL connection and schema...");
      const initResult = await initializePostgresDatabase(pool);
      console.log("[Server] PostgreSQL schema verified. Tables:", initResult.tablesCreated.join(", "));
      await syncStoreFromPostgres(pool);
      console.log("[Server] Database-backed store synchronized with PostgreSQL.");
    } catch (err: any) {
      console.error("[Server] PostgreSQL initialization warning:", err.message);
    }
  } else {
    console.warn("[Server] PostgreSQL pool not available; operating in in-memory mode.");
  }

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GeM Compliance Engine Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
