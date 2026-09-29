import { dbStore } from '../db/database';
import { BidderDocument, Bidder } from '../types';
import { aiVerificationService, ExtractedDocumentData } from './aiVerificationService';
import { auditService } from './auditService';

export interface DocumentUploadInput {
  bidderId: string;
  tenderId?: string;
  documentType: string;
  title: string;
  fileName: string;
  fileSize?: string;
  fileData?: string; // Base64 or plain text string
  rawText?: string;
  officerUser?: string;
}

export const documentService = {
  /**
   * Upload and process a document
   */
  async processAndUploadDocument(input: DocumentUploadInput): Promise<{
    document: BidderDocument;
    extractedData: ExtractedDocumentData;
    inconsistencyReport: any;
  }> {
    const bidder = dbStore.bidders.get(input.bidderId);
    if (!bidder) {
      throw new Error(`Bidder ${input.bidderId} not found`);
    }

    // Prepare text from fileData or rawText
    let documentContent = input.rawText || '';
    if (!documentContent && input.fileData) {
      if (input.fileData.startsWith('data:')) {
        const base64Part = input.fileData.split(',')[1] || '';
        documentContent = Buffer.from(base64Part, 'base64').toString('utf-8');
      } else {
        documentContent = input.fileData;
      }
    }

    if (!documentContent) {
      documentContent = `Uploaded Document: ${input.title}. File: ${input.fileName}. Document Type: ${input.documentType}. Bidder Name: ${bidder.name}. PAN: ${bidder.pan}. GSTIN: ${bidder.gstin}.`;
    }

    // Run AI structured extraction
    const extracted = await aiVerificationService.extractDocumentInformation(
      input.documentType,
      input.fileName,
      documentContent
    );

    // Cross-check inconsistencies with bidder data
    const inconsistencyReport = await aiVerificationService.detectInconsistencies(bidder, extracted);

    const docId = `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newDoc: BidderDocument = {
      id: docId,
      bidderId: input.bidderId,
      tenderId: input.tenderId || bidder.tenderId,
      documentType: input.documentType,
      title: input.title,
      fileName: input.fileName,
      fileSize: input.fileSize || '1.2 MB',
      rawText: documentContent.slice(0, 1000),
      extractedData: extracted as any,
      aiConfidence: extracted.confidence,
      status: inconsistencyReport.hasInconsistencies ? 'REQUIRES_REVIEW' : 'VERIFIED',
      uploadedAt: new Date().toISOString(),
    };

    // Save to database
    dbStore.documents.set(newDoc.id, newDoc);

    // Log to immutable audit trail
    auditService.recordLog({
      user: input.officerUser || 'Procurement Officer',
      userRole: 'OFFICER',
      action: 'DOCUMENT_UPLOADED',
      entity: 'DOCUMENT',
      entityId: newDoc.id,
      details: {
        documentType: newDoc.documentType,
        fileName: newDoc.fileName,
        bidderId: input.bidderId,
        bidderName: bidder.name,
        extractedFields: extracted.fieldsFound,
        hasInconsistencies: inconsistencyReport.hasInconsistencies,
      },
    });

    auditService.recordLog({
      user: 'AI Verification Engine',
      userRole: 'SYSTEM',
      action: 'DOCUMENT_ANALYZED',
      entity: 'DOCUMENT',
      entityId: newDoc.id,
      details: {
        documentType: newDoc.documentType,
        confidence: extracted.confidence,
        status: newDoc.status,
      },
    });

    return {
      document: newDoc,
      extractedData: extracted,
      inconsistencyReport,
    };
  },

  /**
   * Get all documents for a bidder
   */
  getDocumentsByBidderId(bidderId: string): BidderDocument[] {
    const results: BidderDocument[] = [];
    for (const doc of dbStore.documents.values()) {
      if (doc.bidderId === bidderId) {
        results.push(doc);
      }
    }
    return results;
  },
};
