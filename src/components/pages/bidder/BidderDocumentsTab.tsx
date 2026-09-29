import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  FileText,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  X,
  FileCheck,
  Shield,
  Download,
  FileCode,
  Upload,
  Plus,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { BidderData } from '../../../types';
import { SAMPLE_BIDDER_DOCUMENTS } from '../../../data/gemDashboardData';
import { apiService } from '../../../services/api';

interface DocumentDetail {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  status: 'Verified' | 'Pending Review' | 'Needs Review' | 'Missing';
  aiExtraction: string;
  extractedFields: Record<string, string>;
  source: string;
  observations: string;
  mismatchAlert?: string;
}

const EXTENDED_DOCUMENTS: DocumentDetail[] = [
  {
    id: 'doc_gst',
    name: 'GST Certificate.pdf',
    type: 'Tax Registration',
    uploadDate: '2025-02-18',
    status: 'Verified',
    aiExtraction: 'GSTIN: 27ABCDE1234F1Z5, Legal Name: Shree Tech Solutions Pvt. Ltd.',
    extractedFields: {
      'GSTIN': '27ABCDE1234F1Z5',
      'Legal Name': 'Shree Tech Solutions Pvt. Ltd.',
      'Registration Date': '01/07/2017',
      'Taxpayer Type': 'Regular',
      'Jurisdiction': 'State - Maharashtra, Ward - Andheri East',
    },
    source: 'GSTN Government Gateway API',
    observations: 'Extracted GSTIN, business address, and legal entity match portal record with 100% precision.',
  },
  {
    id: 'doc_pan',
    name: 'PAN Card.pdf',
    type: 'Identity / Statutory',
    uploadDate: '2025-02-18',
    status: 'Verified',
    aiExtraction: 'PAN: AABCS1234D, Category: Company',
    extractedFields: {
      'PAN': 'AABCS1234D',
      'Name on Card': 'SHREE TECH SOLUTIONS PVT. LTD.',
      'Date of Incorporation': '14/05/2015',
      'Status in CBDT': 'Active & Operative',
      'Aadhaar / Director Linkage': 'Compliant',
    },
    source: 'Income Tax CBDT Registry',
    observations: 'Permanent Account Number verified as operative. No debarment or penalty records present.',
  },
  {
    id: 'doc_udyam',
    name: 'Udyam Certificate.pdf',
    type: 'MSME Classification',
    uploadDate: '2025-02-19',
    status: 'Verified',
    aiExtraction: 'Udyam No: UDYAM-MH-02-0045678, Enterprise Type: Small (Manufacturing)',
    extractedFields: {
      'Udyam Registration': 'UDYAM-MH-02-0045678',
      'Enterprise Type': 'Small Enterprise',
      'Major Activity': 'Manufacturing & IT Hardware Integration',
      'NIC Code': '26201 - Manufacture of electronic computers',
      'Investment in P&M': '₹ 4.25 Crore',
    },
    source: 'Ministry of MSME Udyam Portal',
    observations: 'Valid MSME certificate entitles bidder to tender fee exemption and price preference policy under PPP-MSE.',
  },
  {
    id: 'doc_itr',
    name: 'Income Tax Document.pdf',
    type: 'Financial Filing',
    uploadDate: '2025-02-19',
    status: 'Verified',
    aiExtraction: 'AY 2024-25 ITR-6 Acknowledgment verified, Gross Income: ₹ 14.82 Crore',
    extractedFields: {
      'Assessment Year': '2024-25',
      'Filing Date': '28/10/2024',
      'Acknowledgment No': '984512039481230',
      'Gross Total Income': '₹ 14,82,40,000',
      'Audit Report Form 3CD': 'Attached & Signed by CA',
    },
    source: 'CBDT e-Filing Verification API',
    observations: 'Turnover meets minimum threshold requirement of ₹ 2.00 Crore. CA UDIN valid.',
  },
  {
    id: 'doc_oem',
    name: 'OEM Authorization.pdf',
    type: 'Manufacturer Authorization',
    uploadDate: '2025-02-20',
    status: 'Needs Review',
    aiExtraction: 'Authorization valid until 31-March-2025 (Expiry in 30 days)',
    extractedFields: {
      'OEM Name': 'Cisco Systems India Pvt. Ltd.',
      'Authorized Partner': 'Shree Tech Solutions Pvt. Ltd.',
      'GeM Tender Reference': 'GEM/2025/0167 mentioned',
      'Issue Date': '01/04/2024',
      'Validity Expiry Date': '31/03/2025',
    },
    source: 'Direct OEM Document Scrutiny',
    observations: 'Validity period terminates in approximately 30 days. Tender contract term is 12 months.',
    mismatchAlert: 'Short validity warning: Contract delivery schedule exceeds MAF certificate expiry. Recommend Procurement Officer request extension.',
  },
  {
    id: 'doc_mii',
    name: 'Make in India Declaration.pdf',
    type: 'Local Content Preference',
    uploadDate: '2025-02-20',
    status: 'Verified',
    aiExtraction: 'Class-I Local Supplier (62% Local Content declared)',
    extractedFields: {
      'Supplier Category': 'Class-I Local Supplier',
      'Local Content Declared': '62.4%',
      'Location of Value Addition': 'MIDC Electronic Zone, Pune, Maharashtra',
      'Statutory Auditor Sign': 'Verified (UDIN: 24102938ABCD12)',
    },
    source: 'DPIIT Public Procurement Order (PPO)',
    observations: 'Meets minimum 50% local content requirement for Class-I Local Supplier preference under GFR.',
  },
];

export const BidderDocumentsTab: React.FC = () => {
  const { bidder } = useOutletContext<{ bidder: BidderData }>();
  const [documents, setDocuments] = useState<DocumentDetail[]>(EXTENDED_DOCUMENTS);
  const [selectedDoc, setSelectedDoc] = useState<DocumentDetail | null>(null);

  // Upload modal & state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [docType, setDocType] = useState('Tax Registration');
  const [docTitle, setDocTitle] = useState('Updated Tax Clearance Certificate');
  const [fileName, setFileName] = useState('Tax_Clearance_2026.pdf');
  const [rawText, setRawText] = useState(
    'GSTIN: 27ABCDE1234F1Z5. Legal Name: Shree Tech Solutions Pvt. Ltd. Certified that regular GSTR-3B filings are up to date through current tax period. Turnover reported ₹ 14.82 Cr.'
  );

  // Load existing documents from backend API if available
  useEffect(() => {
    let isMounted = true;
    apiService
      .getBidderDocuments(bidder.id)
      .then((res) => {
        if (isMounted && res.success && Array.isArray(res.documents) && res.documents.length > 0) {
          const apiDocs: DocumentDetail[] = res.documents.map((d: any) => ({
            id: d.id,
            name: d.fileName || d.title,
            type: d.documentType || 'Statutory Filing',
            uploadDate: d.uploadDate ? new Date(d.uploadDate).toISOString().split('T')[0] : '2026-09-18',
            status: d.status === 'VERIFIED' ? 'Verified' : d.status === 'NEEDS_REVIEW' ? 'Needs Review' : 'Pending Review',
            aiExtraction: d.extractedData ? JSON.stringify(d.extractedData).slice(0, 100) : 'Extracted via AI OCR',
            extractedFields: d.extractedData || {},
            source: 'GeM AI Document Extraction Engine',
            observations: d.remarks || 'Document processed and verified by AI verification pipeline.',
          }));
          // Merge unique docs
          setDocuments((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newDocs = apiDocs.filter((ad) => !existingIds.has(ad.id));
            return [...newDocs, ...prev];
          });
        }
      })
      .catch((e) => console.warn('Could not fetch backend docs:', e));
    return () => {
      isMounted = false;
    };
  }, [bidder.id]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !fileName.trim()) {
      setUploadError('Document title and file name are required.');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      const response = await apiService.uploadDocument({
        bidderId: bidder.id,
        tenderId: bidder.tenderId,
        documentType: docType,
        title: docTitle,
        fileName: fileName,
        fileSize: '1.4 MB',
        rawText: rawText,
        officerUser: 'Procurement Officer (Admin)',
      });

      if (response.success && response.document) {
        const d = response.document;
        const newDetail: DocumentDetail = {
          id: d.id,
          name: d.fileName,
          type: d.documentType,
          uploadDate: new Date().toISOString().split('T')[0],
          status: d.status === 'VERIFIED' ? 'Verified' : 'Needs Review',
          aiExtraction: d.extractedData
            ? Object.entries(d.extractedData)
                .map(([k, v]) => `${k}: ${v}`)
                .join(', ')
            : 'AI extracted attributes confirmed.',
          extractedFields: d.extractedData || {},
          source: 'Gemini AI Document Understanding',
          observations: 'Document successfully parsed and verified against bidder profile.',
        };

        setDocuments((prev) => [newDetail, ...prev]);
        setUploadSuccess('Document successfully uploaded & parsed using Gemini AI! Re-running compliance rules...');
        
        // Automatically re-run compliance engine on the backend so scores & findings update
        try {
          await apiService.runVerification(bidder.id);
        } catch (verErr) {
          console.warn('Re-verification notice:', verErr);
        }

        setTimeout(() => {
          setIsUploadOpen(false);
          setUploadSuccess('');
        }, 1600);
      } else {
        setUploadError(response.error || 'Failed to process document');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Error uploading document to backend');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Uploaded Documents Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Submitted Tender Documents & OCR Extraction</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tender attachments scrutinized via AI Document Understanding engine against regulatory requirements.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setIsUploadOpen(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl">
              {documents.length} Documents Submitted
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-5">Document Name</th>
                <th className="py-3.5 px-5">Type</th>
                <th className="py-3.5 px-5">Upload Date</th>
                <th className="py-3.5 px-5">Verification Status</th>
                <th className="py-3.5 px-5">AI Extraction Summary</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="font-bold text-slate-900">{doc.name}</div>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-slate-600">{doc.type}</td>
                  <td className="py-4 px-5 text-slate-500 font-mono text-[11px]">{doc.uploadDate}</td>
                  <td className="py-4 px-5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        doc.status === 'Verified'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : doc.status === 'Needs Review'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {doc.status === 'Verified' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                      )}
                      <span>{doc.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-5 text-slate-600 max-w-xs truncate">
                    {doc.aiExtraction}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedDoc(doc)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 transition inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Document Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span>Upload Tender Document for AI Extraction</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Extracted information will be automatically reconciled against statutory registries.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{uploadSuccess}</span>
              </div>
            )}

            {uploadError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Category</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-slate-50/50"
                >
                  <option value="Tax Registration">Tax Registration (GST Certificate)</option>
                  <option value="Identity / Statutory">Identity / Statutory (PAN Card)</option>
                  <option value="MSME Classification">MSME Classification (Udyam Certificate)</option>
                  <option value="Financial Filing">Financial Filing (ITR / Audit Report)</option>
                  <option value="Manufacturer Authorization">Manufacturer Authorization (OEM MAF)</option>
                  <option value="Local Content Preference">Local Content (Make in India Certificate)</option>
                  <option value="Debarment Declaration">Non-Debarment Affidavit (Rule 151)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. GST Registration Certificate REG-06"
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">File Name</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g. GST_Certificate.pdf"
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Document Text / OCR Content (Simulated File Stream)
                </label>
                <textarea
                  rows={3}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste certificate text or OCR transcription to extract..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-mono text-[11px] text-slate-700"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  disabled={isUploading}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-1.5 transition shadow-xs"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Extracting with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Upload & Extract</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Details Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{selectedDoc.name}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedDoc.status === 'Verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {selectedDoc.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Type: {selectedDoc.type} • Uploaded on {selectedDoc.uploadDate}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Preview Placeholder */}
            <div className="border border-slate-200 rounded-xl p-6 bg-slate-50/70 text-center space-y-2">
              <FileCode className="w-10 h-10 text-slate-400 mx-auto" />
              <div className="text-xs font-bold text-slate-700">Digital Document Preview</div>
              <div className="text-[11px] text-slate-400">
                Official GeM Bidder Document Vault (Encrypted Storage)
              </div>
            </div>

            {/* Extracted Information Key-Values */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Extracted Entities & Attributes
              </h4>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                {Object.entries(selectedDoc.extractedFields).map(([key, val]) => (
                  <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/60 pb-1.5 last:border-0 last:pb-0">
                    <span className="text-slate-500 font-medium">{key}:</span>
                    <strong className="text-slate-800 font-mono text-[11px]">{val}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Source & AI Observations */}
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 space-y-1 text-slate-700">
                <div className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-blue-600" />
                  <span>Cross-Check Source: {selectedDoc.source}</span>
                </div>
                <p className="text-[11px] leading-relaxed">{selectedDoc.observations}</p>
              </div>

              {selectedDoc.mismatchAlert && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2 text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Discrepancy / Attention Note:</div>
                    <div className="text-[11px] leading-relaxed mt-0.5">{selectedDoc.mismatchAlert}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Close Button */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
