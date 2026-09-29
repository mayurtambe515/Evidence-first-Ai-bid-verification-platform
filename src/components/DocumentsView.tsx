import React, { useState } from 'react';
import { Bidder, BidderDocument } from '../types';
import {
  FolderOpen,
  UploadCloud,
  FileText,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Sparkles,
  Eye,
  FileCheck,
} from 'lucide-react';

interface DocumentsViewProps {
  bidder: Bidder;
  onUpdateBidderDocuments: (documents: BidderDocument[]) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  bidder,
  onUpdateBidderDocuments,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [activeDocId, setActiveDocId] = useState<string>(bidder?.documents?.[0]?.id || '');
  const [geminiResult, setGeminiResult] = useState<any>(null);

  const activeDoc = bidder?.documents?.find((d) => d.id === activeDocId) || bidder?.documents?.[0];

  const handleRunAIExtraction = async () => {
    setIsProcessing(true);
    setProcessingStage('Ingesting uploaded certificates & OCR scanning...');

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setProcessingStage('Calling Gemini 3.8 Flash for Multimodal Structured Extraction...');

      // Call our Express server endpoint /api/gemini/extract
      const response = await fetch('/api/gemini/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentName: activeDoc?.fileName || 'GST_Certificate.pdf',
          documentType: activeDoc?.type || 'gst',
          rawText: activeDoc?.rawSnippet || '',
          sampleData: activeDoc?.extractedFields || {},
        }),
      });

      const data = await response.json();
      setGeminiResult(data);

      setProcessingStage('Detecting subtle cross-document contradictions with Gemini...');
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Also call contradiction endpoint
      await fetch('/api/gemini/detect-contradictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bidderName: bidder.name,
          documents: bidder.documents.map((d) => ({
            title: d.title,
            type: d.type,
            extractedFields: d.extractedFields,
          })),
        }),
      });

      setProcessingStage('Extraction & Forensic Contradiction Analysis Complete!');
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (err) {
      console.error('Extraction error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const newDoc: BidderDocument = {
      id: `doc-up-${Date.now()}`,
      type: 'other',
      title: file.name.replace(/\.[^/.]+$/, ''),
      fileName: file.name,
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: `${Math.round(file.size / 1024)} KB`,
      status: 'EXTRACTED',
      confidence: 0.94,
      rawSnippet: `MOCK INGESTED DOCUMENT CONTENT: ${file.name}\nTimestamp: ${new Date().toISOString()}\nUploaded by procurement operator for compliance check.`,
      extractedFields: {
        'Document Name': file.name,
        'File Size': `${Math.round(file.size / 1024)} KB`,
        'Extracted Status': 'Successfully Queued & Parsed',
        'Ingestion Method': 'Direct User File Upload',
      },
    };

    onUpdateBidderDocuments([...bidder.documents, newDoc]);
    setActiveDocId(newDoc.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-blue-400" />
            <span>Document Ingestion & AI Field Extraction</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluating documents submitted by <strong className="text-slate-200">{bidder.name}</strong>.
            Powered by Gemini 3.8 Flash for structured entity extraction and anomaly flagging.
          </p>
        </div>

        <button
          onClick={handleRunAIExtraction}
          disabled={isProcessing}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-blue-950/50 transition disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-indigo-200" />
          <span>{isProcessing ? 'Processing AI Extraction...' : 'Run Gemini AI Extraction'}</span>
        </button>
      </div>

      {/* Processing Banner if active */}
      {isProcessing && (
        <div className="bg-indigo-950/60 border border-indigo-700/60 rounded-xl p-4 text-xs text-indigo-200 flex items-center gap-3 animate-pulse">
          <Cpu className="w-5 h-5 text-indigo-400 animate-spin" />
          <div>
            <div className="font-bold text-white text-sm">Automated Neural Extraction in Progress</div>
            <div className="text-indigo-300 text-xs mt-0.5">{processingStage}</div>
          </div>
        </div>
      )}

      {/* Upload Zone */}
      <div className="bg-slate-900 border border-dashed border-slate-700 rounded-xl p-6 text-center hover:border-blue-500/70 transition">
        <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <h4 className="text-sm font-semibold text-white">Upload New Compliance Certificate</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          Upload PDF or Image (GST REG-06, PAN Card, Udyam MSME, or OEM Direct MAF).
          Simulated secure encrypted storage with instant OCR parsing.
        </p>
        <div className="mt-3">
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer border border-slate-700 transition">
            <span>Select File from Disk</span>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Two Column Layout: Document List on Left, Extracted Fields on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Document Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Submitted Documents Bundle ({bidder.documents.length})
          </div>

          {bidder.documents.map((doc) => {
            const isActive = doc.id === activeDoc?.id;
            let statusIcon = <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
            let statusText = 'Extracted';

            if (doc.status === 'MISSING') {
              statusIcon = <XCircle className="w-4 h-4 text-rose-400" />;
              statusText = 'Missing';
            } else if (doc.status === 'EXPIRED') {
              statusIcon = <AlertTriangle className="w-4 h-4 text-amber-400" />;
              statusText = 'Expired';
            } else if (doc.status === 'CONTRADICTORY') {
              statusIcon = <AlertTriangle className="w-4 h-4 text-rose-400" />;
              statusText = 'Contradiction';
            }

            return (
              <button
                key={doc.id}
                onClick={() => setActiveDocId(doc.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition flex items-start justify-between gap-3 ${
                  isActive
                    ? 'bg-slate-850 border-blue-500 ring-1 ring-blue-500/50 shadow-md'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 text-slate-300 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-snug">{doc.title}</h4>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{doc.fileName}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                      <span>Size: {doc.fileSize}</span>
                      <span>•</span>
                      <span>Confidence: {Math.round(doc.confidence * 100)}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] font-semibold">
                  {statusIcon}
                  <span className="text-slate-300">{statusText}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Active Document Extracted Fields & Raw Text */}
        <div className="lg:col-span-7 space-y-4">
          {activeDoc ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-900">
                    TYPE: {activeDoc.type.toUpperCase()}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1">{activeDoc.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">AI Confidence:</span>
                  <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
                    {Math.round(activeDoc.confidence * 100)}%
                  </span>
                </div>
              </div>

              {/* Extracted Key-Value Table */}
              <div className="mt-4">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Structured Extracted Attributes</span>
                  <span className="text-[11px] font-normal text-slate-500">Gemini 3.8 Normalizer</span>
                </div>

                <div className="border border-slate-800 rounded-lg overflow-hidden divide-y divide-slate-800 text-xs">
                  {Object.entries(activeDoc.extractedFields).map(([k, v]) => (
                    <div key={k} className="grid grid-cols-1 sm:grid-cols-3 p-2.5 bg-slate-950/40 hover:bg-slate-950/80 transition">
                      <div className="text-slate-400 font-medium sm:col-span-1">{k}</div>
                      <div className="font-mono text-slate-200 sm:col-span-2 font-semibold break-all">
                        {v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Raw Document OCR Snippet Preview */}
              {activeDoc.rawSnippet && (
                <div className="mt-4">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>Raw Document OCR Stream</span>
                  </div>
                  <pre className="text-[11px] font-mono text-slate-400 bg-slate-950 border border-slate-800 rounded-lg p-3 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                    {activeDoc.rawSnippet}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
              No document selected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
