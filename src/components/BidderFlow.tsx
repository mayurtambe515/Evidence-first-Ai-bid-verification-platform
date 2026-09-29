import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Cpu,
  Building2,
  FileCheck2,
  HelpCircle,
  Check,
  Send,
  ExternalLink,
} from 'lucide-react';
import { Tender, Bidder, BidderDocument, RiskLevel, CheckStatus } from '../types';
import { evaluateBidderCompliance, EvaluationResult } from '../utils/rulesEngine';
import { ComplianceRing } from './ComplianceRing';

interface BidderFlowProps {
  tender: Tender;
  bidders: Bidder[];
  activeBidder: Bidder;
  onUpdateBidder: (updated: Bidder) => void;
  onOpenAiAssistant?: () => void;
}

type Step = 1 | 2 | 3 | 4;

interface DocumentUploadState {
  type: 'gst' | 'pan' | 'udyam' | 'oem_auth';
  title: string;
  code: string;
  required: boolean;
  uploaded: boolean;
  fileName?: string;
  fileSize?: string;
  progress: number;
}

const REQUIRED_DOC_TYPES: { type: 'gst' | 'pan' | 'udyam' | 'oem_auth'; title: string; code: string; hint: string }[] = [
  {
    type: 'gst',
    title: 'GST Registration Certificate',
    code: 'Form GST REG-06',
    hint: 'Valid registration certificate issued by GSTN with active status',
  },
  {
    type: 'pan',
    title: 'Permanent Account Number Card',
    code: 'NSDL Corporate PAN',
    hint: 'Company corporate PAN card matching legal entity name',
  },
  {
    type: 'udyam',
    title: 'Udyam Registration Certificate',
    code: 'MSME Registration',
    hint: 'Active Udyam certificate for MSME purchase preference',
  },
  {
    type: 'oem_auth',
    title: 'OEM Direct Authorization (MAF)',
    code: 'Manufacturer Authorization',
    hint: 'Authorized OEM partnership letter valid through tender completion',
  },
];

export const BidderFlow: React.FC<BidderFlowProps> = ({
  tender,
  bidders,
  activeBidder,
  onUpdateBidder,
  onOpenAiAssistant,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>(1);

  // Form State
  const [companyName, setCompanyName] = useState(activeBidder.name);
  const [legalName, setLegalName] = useState(activeBidder.registeredLegalName);
  const [pan, setPan] = useState(activeBidder.pan);
  const [gstin, setGstin] = useState(activeBidder.gstin);
  const [udyamNumber, setUdyamNumber] = useState(activeBidder.udyamNumber);
  const [turnoverCr, setTurnoverCr] = useState(activeBidder.turnoverCr.toString());
  const [category, setCategory] = useState(tender.category);

  // Document Upload State
  const [docStates, setDocStates] = useState<Record<string, DocumentUploadState>>(() => {
    const initial: Record<string, DocumentUploadState> = {};
    REQUIRED_DOC_TYPES.forEach((doc) => {
      const existing = activeBidder.documents?.find((d) => d.type === doc.type);
      initial[doc.type] = {
        type: doc.type,
        title: doc.title,
        code: doc.code,
        required: true,
        uploaded: !!existing,
        fileName: existing?.fileName,
        fileSize: existing?.fileSize,
        progress: existing ? 100 : 0,
      };
    });
    return initial;
  });

  // AI Verification Processing States
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [verificationStepIndex, setVerificationStepIndex] = useState(0);
  const [isSubmittedToOfficer, setIsSubmittedToOfficer] = useState(false);

  // Pre-fill when active bidder changes
  useEffect(() => {
    setCompanyName(activeBidder.name);
    setLegalName(activeBidder.registeredLegalName);
    setPan(activeBidder.pan);
    setGstin(activeBidder.gstin);
    setUdyamNumber(activeBidder.udyamNumber);
    setTurnoverCr(activeBidder.turnoverCr.toString());

    const updated: Record<string, DocumentUploadState> = {};
    REQUIRED_DOC_TYPES.forEach((doc) => {
      const existing = activeBidder.documents?.find((d) => d.type === doc.type);
      updated[doc.type] = {
        type: doc.type,
        title: doc.title,
        code: doc.code,
        required: true,
        uploaded: !!existing,
        fileName: existing?.fileName,
        fileSize: existing?.fileSize,
        progress: existing ? 100 : 0,
      };
    });
    setDocStates(updated);
  }, [activeBidder]);

  // Load a Demo Preset
  const handleLoadPreset = (presetBidder: Bidder) => {
    onUpdateBidder(presetBidder);
    setCompanyName(presetBidder.name);
    setLegalName(presetBidder.registeredLegalName);
    setPan(presetBidder.pan);
    setGstin(presetBidder.gstin);
    setUdyamNumber(presetBidder.udyamNumber);
    setTurnoverCr(presetBidder.turnoverCr.toString());

    const updated: Record<string, DocumentUploadState> = {};
    REQUIRED_DOC_TYPES.forEach((doc) => {
      const existing = presetBidder.documents?.find((d) => d.type === doc.type);
      updated[doc.type] = {
        type: doc.type,
        title: doc.title,
        code: doc.code,
        required: true,
        uploaded: !!existing,
        fileName: existing?.fileName,
        fileSize: existing?.fileSize,
        progress: existing ? 100 : 0,
      };
    });
    setDocStates(updated);
  };

  // Upload single doc simulation
  const handleSimulatedUpload = (type: 'gst' | 'pan' | 'udyam' | 'oem_auth') => {
    setDocStates((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        progress: 40,
      },
    }));

    setTimeout(() => {
      setDocStates((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          progress: 100,
          uploaded: true,
          fileName: `${companyName.replace(/\s+/g, '_')}_${type.toUpperCase()}_Cert.pdf`,
          fileSize: `${Math.floor(Math.random() * 200 + 250)} KB`,
        },
      }));
    }, 400);
  };

  // Upload All Docs at once
  const handleUploadAll = () => {
    REQUIRED_DOC_TYPES.forEach((doc, idx) => {
      setTimeout(() => {
        handleSimulatedUpload(doc.type);
      }, idx * 150);
    });
  };

  // Start Step 3: AI Verification
  const startAiVerification = () => {
    setCurrentStep(3);
    setVerificationProgress(0);
    setVerificationStepIndex(0);

    const interval = setInterval(() => {
      setVerificationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setCurrentStep(4);
          }, 400);
          return 100;
        }
        const next = prev + 25;
        if (next >= 75) setVerificationStepIndex(2);
        else if (next >= 40) setVerificationStepIndex(1);
        return next;
      });
    }, 450);
  };

  // Compute live compliance result
  const evaluationResult: EvaluationResult = evaluateBidderCompliance(activeBidder, tender, [
    {
      id: 'RULE-GST-01',
      code: 'R-GST-ACT',
      title: 'Active GSTIN Status',
      category: 'TAX_COMPLIANCE',
      description: 'GSTIN must be Active on GSTN',
      severityIfFailed: 'FAIL',
      weight: 20,
      enabled: true,
      conditionDescription: '',
    },
    {
      id: 'RULE-GST-02',
      code: 'R-GST-FIL',
      title: 'Timely GST Filings',
      category: 'TAX_COMPLIANCE',
      description: 'Filings up to date',
      severityIfFailed: 'WARNING',
      weight: 15,
      enabled: true,
      conditionDescription: '',
    },
    {
      id: 'RULE-PAN-01',
      code: 'R-PAN-MAT',
      title: 'PAN Identity & Legal Name Match',
      category: 'IDENTITY',
      description: 'Legal entity matches PAN records',
      severityIfFailed: 'FAIL',
      weight: 20,
      enabled: true,
      conditionDescription: '',
    },
    {
      id: 'RULE-UDY-01',
      code: 'R-UDY-ACT',
      title: 'Udyam MSME Status',
      category: 'MSME_CRITERIA',
      description: 'Active MSME registration',
      severityIfFailed: 'WARNING',
      weight: 10,
      enabled: true,
      conditionDescription: '',
    },
    {
      id: 'RULE-OEM-01',
      code: 'R-OEM-VAL',
      title: 'OEM Authorization Validity',
      category: 'TECHNICAL_OEM',
      description: 'Valid MAF through tender deadline',
      severityIfFailed: 'FAIL',
      weight: 25,
      enabled: true,
      conditionDescription: '',
    },
    {
      id: 'RULE-FIN-01',
      code: 'R-FIN-TUR',
      title: 'Minimum Annual Turnover',
      category: 'FINANCIAL_TURNOVER',
      description: 'Meets ₹ 3.5 Cr threshold',
      severityIfFailed: 'FAIL',
      weight: 10,
      enabled: true,
      conditionDescription: '',
    },
  ]);

  const totalUploaded = (Object.values(docStates) as DocumentUploadState[]).filter((d) => d.uploaded).length;
  const allDocsUploaded = totalUploaded === REQUIRED_DOC_TYPES.length;

  const stepsList = [
    { num: 1, label: 'Company Details' },
    { num: 2, label: 'Upload Documents' },
    { num: 3, label: 'AI Verification' },
    { num: 4, label: 'Compliance Score' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Top Banner / Explanation */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                Bidder Portal
              </span>
              <span className="text-xs text-slate-400">
                Ref: <span className="font-mono text-slate-300 font-semibold">{tender.refNumber}</span>
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white">
              Tender Bid Application & Automated AI Verification
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Fill company details, attach mandatory compliance certificates, and run instant AI cross-checks against official registry records before submission.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {onOpenAiAssistant && (
              <button
                type="button"
                onClick={onOpenAiAssistant}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Ask AI Assistant</span>
              </button>
            )}
          </div>
        </div>

        {/* Simplified Top Step Indicator */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="grid grid-cols-4 gap-2">
            {stepsList.map((st) => {
              const isPassed = currentStep > st.num;
              const isCurrent = currentStep === st.num;
              return (
                <button
                  key={st.num}
                  type="button"
                  onClick={() => {
                    // Allow navigating between 1, 2, and 4 if ready
                    if (st.num <= 2 || (st.num === 4 && currentStep === 4)) {
                      setCurrentStep(st.num as Step);
                    }
                  }}
                  disabled={st.num === 3}
                  className={`text-left p-2.5 rounded-xl border transition flex items-center gap-2.5 ${
                    isCurrent
                      ? 'bg-blue-900/40 border-blue-500/80 text-white shadow-sm ring-1 ring-blue-500/50'
                      : isPassed
                      ? 'bg-slate-950/60 border-emerald-800/60 text-emerald-300'
                      : 'bg-slate-950/30 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      isCurrent
                        ? 'bg-blue-600 text-white'
                        : isPassed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : st.num}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase font-bold tracking-wider leading-none text-slate-400">
                      Step {st.num}
                    </div>
                    <div className="text-xs font-semibold truncate mt-0.5">{st.label}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* STEP 1: COMPANY / TENDER FORM */}
      {currentStep === 1 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>1. Company & Statutory Credentials</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Enter your official company registration details as declared on GeM and tax portals.
              </p>
            </div>

            {/* Instant Demo Presets for Judges */}
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg p-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-2">Presets:</span>
              {bidders.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => handleLoadPreset(b)}
                  className={`px-2 py-1 rounded text-xs font-medium transition ${
                    activeBidder.id === b.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {b.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Tender Reference & Authority
              </label>
              <input
                type="text"
                disabled
                value={`${tender.refNumber} — ${tender.authority}`}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 font-mono text-xs cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Company Display Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Apex Technologies Pvt Ltd"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Registered Legal Entity Name (as on Certificate)
              </label>
              <input
                type="text"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                placeholder="e.g. Apex Technologies Private Limited"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Company PAN Number (10 Characters)
              </label>
              <input
                type="text"
                value={pan}
                onChange={(e) => setPan(e.target.value.toUpperCase())}
                placeholder="e.g. AAAAA0000A"
                maxLength={10}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                GSTIN Registration Number (15 Characters)
              </label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                placeholder="e.g. 07AAAAA0000A1Z5"
                maxLength={15}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Udyam MSME Registration Number
              </label>
              <input
                type="text"
                value={udyamNumber}
                onChange={(e) => setUdyamNumber(e.target.value.toUpperCase())}
                placeholder="e.g. UDYAM-DL-01-0012345"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Certified Annual Turnover (₹ Crores)
              </label>
              <input
                type="number"
                step="0.1"
                value={turnoverCr}
                onChange={(e) => setTurnoverCr(e.target.value)}
                placeholder="e.g. 7.4"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Mandatory minimum for tender: ₹ {tender.minAnnualTurnoverCr} Cr
              </span>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={() => {
                // Save updated values into active bidder
                onUpdateBidder({
                  ...activeBidder,
                  name: companyName,
                  registeredLegalName: legalName,
                  pan,
                  gstin,
                  udyamNumber,
                  turnoverCr: parseFloat(turnoverCr) || 0,
                });
                setCurrentStep(2);
              }}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-950/60 transition active:scale-98"
            >
              <span>Continue to Document Upload</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: UPLOAD DOCUMENTS */}
      {currentStep === 2 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>2. Upload Mandatory Documents</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal">
                  {totalUploaded} of {REQUIRED_DOC_TYPES.length} attached
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload PDF copies of required statutory certificates for AI multimodal parsing.
              </p>
            </div>

            <button
              type="button"
              onClick={handleUploadAll}
              className="px-3 py-1.5 rounded-lg bg-teal-950/80 hover:bg-teal-900 text-teal-300 border border-teal-800 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Auto-Upload Sample Certificates</span>
            </button>
          </div>

          {/* Pending checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {REQUIRED_DOC_TYPES.map((doc) => {
              const state = docStates[doc.type];
              const isDone = state?.uploaded;

              return (
                <div
                  key={doc.type}
                  className={`p-4 rounded-xl border transition ${
                    isDone
                      ? 'bg-slate-950/80 border-emerald-800/80 ring-1 ring-emerald-900/40'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-750'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isDone ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                          <span>{doc.title}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">{doc.code}</div>
                        <div className="text-[10px] text-slate-400 mt-1">{doc.hint}</div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {isDone ? (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>ATTACHED</span>
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>PENDING</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Upload Action / File Info */}
                  <div className="mt-3 pt-3 border-t border-slate-850 flex items-center justify-between text-xs">
                    {isDone ? (
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 truncate">
                        <span className="font-mono text-slate-300 truncate">{state?.fileName}</span>
                        <span className="text-[10px] text-slate-400">({state?.fileSize})</span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">PDF document required</span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleSimulatedUpload(doc.type)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition"
                    >
                      {isDone ? 'Replace File' : 'Upload File'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Details</span>
            </button>

            <button
              type="button"
              onClick={startAiVerification}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-950/60 transition active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-teal-200" />
              <span>Submit for AI Verification</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: AI VERIFICATION PROCESSING SCREEN */}
      {currentStep === 3 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-900/60 via-indigo-900/40 to-teal-900/60 border border-blue-500/40 shadow-xl shadow-blue-950/50">
            <Cpu className="w-8 h-8 text-teal-300 animate-pulse" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">
              Verifying Bid with Gemini AI...
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Extracting fields from uploaded certificates and cross-checking against simulated official registries.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto space-y-2">
            <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-teal-400 transition-all duration-300"
                style={{ width: `${verificationProgress}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 font-mono text-right">
              {verificationProgress}% complete
            </div>
          </div>

          {/* Sequential Live Substeps */}
          <div className="max-w-md mx-auto space-y-2.5 text-left text-xs bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  verificationStepIndex >= 0 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {verificationStepIndex > 0 ? <Check className="w-3 h-3" /> : '1'}
              </div>
              <span className={verificationStepIndex >= 0 ? 'text-white font-medium' : 'text-slate-400'}>
                Multimodal OCR extraction of GST, PAN & Udyam documents
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  verificationStepIndex >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {verificationStepIndex > 1 ? <Check className="w-3 h-3" /> : '2'}
              </div>
              <span className={verificationStepIndex >= 1 ? 'text-white font-medium' : 'text-slate-400'}>
                Cross-checking records against simulated GSTN & NSDL registries
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  verificationStepIndex >= 2 ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {verificationProgress >= 100 ? <Check className="w-3 h-3" /> : '3'}
              </div>
              <span className={verificationStepIndex >= 2 ? 'text-white font-medium' : 'text-slate-400'}>
                Running deterministic tender criteria & computing compliance score
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="text-xs text-slate-400 hover:text-white underline transition"
            >
              Skip to results immediately
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: SCORE RESULT SCREEN (FOR BIDDER) */}
      {currentStep === 4 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Verification Complete
                </span>
                <span className="text-xs text-slate-400">
                  Evaluated on {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">
                Application Compliance Score & Findings
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Review your compliance score and itemized check results before finalizing submission to the Procurement Officer.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg">
                Simulated Portals Checked: <strong className="text-teal-300">GSTN, NSDL, Udyam</strong>
              </span>
            </div>
          </div>

          {/* Big Score Summary Banner */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-950/70 border border-slate-800 rounded-2xl p-6">
            <div className="md:col-span-5 flex items-center gap-5 md:border-r md:border-slate-800/80 md:pr-6">
              <ComplianceRing
                score={evaluationResult.score}
                riskLevel={evaluationResult.riskLevel}
                size={100}
                strokeWidth={10}
              />

              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Compliance Score
                </div>
                <div className="text-3xl font-black text-white mt-0.5">
                  {evaluationResult.score}/100
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {evaluationResult.passedCount} of {evaluationResult.totalChecks} checks verified
                </div>
              </div>
            </div>

            <div className="md:col-span-4 space-y-2 md:border-r md:border-slate-800/80 md:pr-6">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Risk Classification</div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full border inline-flex items-center gap-1.5 ${
                    evaluationResult.riskLevel === 'LOW'
                      ? 'bg-emerald-950/90 text-emerald-300 border-emerald-700'
                      : evaluationResult.riskLevel === 'MEDIUM'
                      ? 'bg-amber-950/90 text-amber-300 border-amber-700'
                      : 'bg-rose-950/90 text-rose-300 border-rose-700'
                  }`}
                >
                  {evaluationResult.riskLevel === 'LOW' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  {evaluationResult.riskLevel === 'MEDIUM' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                  {evaluationResult.riskLevel === 'HIGH' && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                  <span>{evaluationResult.riskLevel} RISK</span>
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {evaluationResult.riskLevel === 'LOW'
                  ? 'All mandatory tender criteria satisfied. Application ready for final submission.'
                  : evaluationResult.riskLevel === 'MEDIUM'
                  ? 'Minor issues detected in statutory filings. Please review warnings.'
                  : 'Critical non-compliance or document discrepancies detected.'}
              </p>
            </div>

            <div className="md:col-span-3 flex flex-col gap-2">
              {isSubmittedToOfficer ? (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs font-semibold flex flex-col items-center justify-center gap-1 text-center">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Application Submitted</span>
                  </div>
                  <span className="text-[11px] text-emerald-300/80">
                    Awaiting Officer Review
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSubmittedToOfficer(true)}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition active:scale-98"
                >
                  <Send className="w-3.5 h-3.5 fill-current" />
                  <span>Submit Final Application</span>
                </button>
              )}
            </div>
          </div>

          {/* Plain Checklist: What Passed / What Failed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Itemized Evaluation Checklist</h3>
              <span className="text-xs text-slate-400">All checks backed by documentary citations</span>
            </div>

            <div className="space-y-2.5">
              {evaluationResult.evidenceItems.map((item) => {
                const isPass = item.status === 'PASS';
                const isWarning = item.status === 'WARNING';
                const isFail = item.status === 'FAIL';

                return (
                  <div
                    key={item.ruleId}
                    className={`p-3.5 rounded-xl border transition ${
                      isPass
                        ? 'bg-slate-950/40 border-slate-800'
                        : isWarning
                        ? 'bg-amber-950/20 border-amber-900/50'
                        : 'bg-rose-950/20 border-rose-900/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="mt-0.5 flex-shrink-0">
                          {isPass && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          {isWarning && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                          {isFail && <XCircle className="w-4 h-4 text-rose-400" />}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-white">{item.ruleTitle}</span>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                              {item.ruleCode}
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 mt-1">{item.explanation}</p>

                          <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-2 flex-wrap">
                            <span>
                              Document: <strong className="text-slate-300">{item.documentSource}</strong>
                            </span>
                            <span>•</span>
                            <span>
                              Extracted: <strong className="font-mono text-slate-300">{item.extractedValue}</strong>
                            </span>
                            <span>•</span>
                            <span>
                              Portal Check:{' '}
                              <strong className="text-teal-300">
                                {item.matchedPortal} (Simulated)
                              </strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            isPass
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                              : isWarning
                              ? 'bg-amber-950 text-amber-300 border-amber-800'
                              : 'bg-rose-950 text-rose-300 border-rose-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Edit Details / Re-Upload</span>
            </button>

            <div className="flex items-center gap-3">
              {onOpenAiAssistant && (
                <button
                  type="button"
                  onClick={onOpenAiAssistant}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-blue-300 border border-blue-900/50 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Ask AI Assistant Why Flagged</span>
                </button>
              )}

              {isSubmittedToOfficer ? (
                <div className="px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Submission Received by GeM Portal</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSubmittedToOfficer(true)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950 transition active:scale-98"
                >
                  <Send className="w-3.5 h-3.5 fill-current" />
                  <span>Submit Final Application</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
