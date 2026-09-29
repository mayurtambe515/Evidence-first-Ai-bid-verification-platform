import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  ShieldAlert,
  Sparkles,
  Upload,
  Plus,
  Trash2,
  Building,
  Calendar,
  IndianRupee,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TenderRequirement } from '../../types';

export const CreateTenderPage: React.FC = () => {
  const navigate = useNavigate();
  const { addTender } = useApp();

  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  // Step 1: Basic details
  const [tenderName, setTenderName] = useState('Procurement of High Performance Computing Servers');
  const [tenderId, setTenderId] = useState(`GEM/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`);
  const [department, setDepartment] = useState('Ministry of Electronics & Information Technology');
  const [category, setCategory] = useState('IT Hardware & Infrastructure');
  const [tenderDate, setTenderDate] = useState('2025-03-01');
  const [lastDate, setLastDate] = useState('2025-04-15');
  const [estimatedValue, setEstimatedValue] = useState('₹ 4.50 Crore');

  // Step 2: Tender Requirements
  const [requirements, setRequirements] = useState<TenderRequirement[]>([
    { id: 'req_1', name: 'Active GST Registration & GSTR-3B Filings', code: 'GST', isMandatory: true, category: 'statutory', verificationSource: 'GSTN Portal API' },
    { id: 'req_2', name: 'PAN & Valid IT Return for AY 2024-25', code: 'PAN_ITR', isMandatory: true, category: 'statutory', verificationSource: 'CBDT / Income Tax Portal' },
    { id: 'req_3', name: 'Udyam / MSME Registration Certificate', code: 'UDYAM', isMandatory: false, category: 'eligibility', verificationSource: 'Ministry of MSME' },
    { id: 'req_4', name: 'Manufacturer Authorization Form (MAF)', code: 'OEM_AUTH', isMandatory: true, category: 'technical', verificationSource: 'OEM Direct Verification' },
    { id: 'req_5', name: 'Class-I Local Supplier (Make in India > 50%)', code: 'MII_LOCAL', isMandatory: true, category: 'compliance', verificationSource: 'DPIIT Self-Declaration' },
    { id: 'req_6', name: 'EPFO & ESIC Active Monthly Remittance', code: 'EPFO_ESIC', isMandatory: false, category: 'statutory', verificationSource: 'EPFO / ESIC Portal' },
    { id: 'req_7', name: 'DPIIT Recognized Startup Certificate', code: 'STARTUP', isMandatory: false, category: 'eligibility', verificationSource: 'Startup India Portal' },
    { id: 'req_8', name: 'NSIC Enlistment Certificate', code: 'NSIC', isMandatory: false, category: 'eligibility', verificationSource: 'NSIC Portal' },
  ]);

  const [newCustomReqName, setNewCustomReqName] = useState('');
  const [newCustomReqSource, setNewCustomReqSource] = useState('Document Verification');

  // Step 3: Tender Document & AI Extraction
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedAiRules, setExtractedAiRules] = useState<string[]>([]);
  const [tenderFileUploaded, setTenderFileUploaded] = useState(false);

  // Step 4: Bidders
  const [biddersList, setBiddersList] = useState([
    { name: 'Shree Tech Solutions Pvt. Ltd.', pan: 'AABCS1234D', gstin: '27ABCDE1234F1Z5' },
    { name: 'National Informatics Services Ltd.', pan: 'AABCN5678E', gstin: '07AABCN5678E1Z1' },
    { name: 'Apex Computech India Pvt Ltd', pan: 'AAACA9999F', gstin: '29AAACA9999F1Z0' },
  ]);
  const [manualBidderName, setManualBidderName] = useState('');
  const [manualBidderPan, setManualBidderPan] = useState('');
  const [manualBidderGstin, setManualBidderGstin] = useState('');

  // Add custom requirement
  const handleAddCustomRequirement = () => {
    if (!newCustomReqName.trim()) return;
    const newReq: TenderRequirement = {
      id: `req_${Date.now()}`,
      name: newCustomReqName.trim(),
      code: `CUSTOM_${Date.now()}`,
      isMandatory: true,
      category: 'technical',
      verificationSource: newCustomReqSource,
    };
    setRequirements((prev) => [...prev, newReq]);
    setNewCustomReqName('');
  };

  const handleToggleRequirement = (id: string) => {
    setRequirements((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isMandatory: !r.isMandatory } : r))
    );
  };

  const handleDeleteRequirement = (id: string) => {
    setRequirements((prev) => prev.filter((r) => r.id !== id));
  };

  // Simulate AI extraction
  const handleSimulateAiExtraction = () => {
    setIsExtracting(true);
    setTenderFileUploaded(true);
    setTimeout(() => {
      setIsExtracting(false);
      setExtractedAiRules([
        'Extracted Rule: Turnover > ₹ 2.00 Crore for past 3 financial years (Requires CA Audited Balance Sheet)',
        'Extracted Rule: OEM Authorization required explicitly mentioning Tender ID reference',
        'Extracted Rule: Make in India local content percentage must be declared by Statutory Auditor or CA',
        'Extracted Rule: Land border country declaration under Rule 144(xi) of GFR 2017 is mandatory',
      ]);
    }, 1500);
  };

  // Add manual bidder
  const handleAddBidder = () => {
    if (!manualBidderName.trim()) return;
    setBiddersList((prev) => [
      ...prev,
      {
        name: manualBidderName.trim(),
        pan: manualBidderPan.trim() || 'AABCP9999K',
        gstin: manualBidderGstin.trim() || '27AABCP9999K1Z5',
      },
    ]);
    setManualBidderName('');
    setManualBidderPan('');
    setManualBidderGstin('');
  };

  // Publish Tender
  const handlePublish = () => {
    addTender({
      id: tenderId,
      name: tenderName,
      department,
      category,
      biddersCount: biddersList.length,
      status: 'Ongoing',
      deadline: lastDate,
      estimatedValue,
      requirements,
    });
    navigate('/bids');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/bids')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tenders</span>
        </button>

        <span className="text-xs font-bold text-slate-500">
          Step {currentStep} of 5
        </span>
      </div>

      {/* Step Tracker Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="grid grid-cols-5 gap-2">
          {[
            { num: 1, label: 'Basic Details' },
            { num: 2, label: 'Requirements' },
            { num: 3, label: 'Tender Document' },
            { num: 4, label: 'Add Bidders' },
            { num: 5, label: 'Review & Publish' },
          ].map((s) => (
            <div
              key={s.num}
              onClick={() => setCurrentStep(s.num)}
              className={`p-2.5 rounded-xl cursor-pointer transition text-center ${
                currentStep === s.num
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                  : currentStep > s.num
                  ? 'bg-emerald-50 text-emerald-800 font-medium border border-emerald-200'
                  : 'bg-slate-50 text-slate-500 font-medium hover:bg-slate-100'
              }`}
            >
              <div className="text-xs font-black">STEP {s.num}</div>
              <div className="text-[11px] truncate mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: Basic Details */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Step 1: Tender Basic Information</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify statutory procurement reference, department nomenclature, and budget allocation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tender Title / Name *
              </label>
              <input
                type="text"
                value={tenderName}
                onChange={(e) => setTenderName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                GeM Bid / Tender ID *
              </label>
              <input
                type="text"
                value={tenderId}
                onChange={(e) => setTenderId(e.target.value)}
                className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Government Department / Ministry *
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Procurement Category *
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Estimated Tender Value *
              </label>
              <input
                type="text"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tender Issue Date
              </label>
              <input
                type="date"
                value={tenderDate}
                onChange={(e) => setTenderDate(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Bid Submission Closing Date (Deadline) *
              </label>
              <input
                type="date"
                value={lastDate}
                onChange={(e) => setLastDate(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Tender Requirements */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Step 2: Statutory & Technical Requirements</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Toggle required certificates, configure verification registries, or add custom technical prerequisites.
            </p>
          </div>

          <div className="space-y-3">
            {requirements.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{req.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        req.isMandatory
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {req.isMandatory ? 'Mandatory' : 'Optional / Preferential'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                    <span>Source: <strong>{req.verificationSource}</strong></span>
                    <span>•</span>
                    <span className="capitalize">{req.category} Check</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleRequirement(req.id)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg border transition ${
                      req.isMandatory
                        ? 'bg-rose-50 text-rose-700 border-rose-300'
                        : 'bg-slate-100 text-slate-600 border-slate-300'
                    }`}
                  >
                    {req.isMandatory ? 'Make Optional' : 'Make Mandatory'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteRequirement(req.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                    title="Remove rule"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Custom Requirement Box */}
          <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/40 space-y-3">
            <div className="text-xs font-bold text-slate-800">Add Custom Requirement Rule</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Requirement Name (e.g. ISO 9001:2015 Certification)"
                value={newCustomReqName}
                onChange={(e) => setNewCustomReqName(e.target.value)}
                className="sm:col-span-2 text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none"
              />
              <input
                type="text"
                placeholder="Verification Source (e.g. NABCB Registry)"
                value={newCustomReqSource}
                onChange={(e) => setNewCustomReqSource(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleAddCustomRequirement}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Requirement</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Tender Document Upload & AI Extraction */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Step 3: Tender Document & AI Scrutiny</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload RFP / GeM Bid Specification document. AI will parse clauses and propose deterministic compliance checks.
            </p>
          </div>

          {/* Drag & Drop Area */}
          <div
            onClick={handleSimulateAiExtraction}
            className="border-2 border-dashed border-blue-300 bg-blue-50/40 hover:bg-blue-50 rounded-2xl p-8 text-center cursor-pointer transition group"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition">
              <Upload className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">
              {tenderFileUploaded ? 'GEM_Tender_Specifications_2025.pdf Uploaded' : 'Upload GeM Bid Document (PDF)'}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Click to browse or drop RFP / GeM document here. AI will instantly extract eligibility criteria.
            </p>
            <button
              type="button"
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              {isExtracting ? 'Analyzing Document with AI...' : 'Select & Extract Rules'}
            </button>
          </div>

          {/* AI Extracted Rules Confirmation */}
          {extractedAiRules.length > 0 && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>AI Requirement Extraction Complete (4 Rules Detected)</span>
              </div>
              <ul className="space-y-2 text-xs text-emerald-800">
                {extractedAiRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-lg border border-emerald-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
              <div className="text-[11px] text-emerald-700 font-medium">
                Note: All extracted rules require final officer confirmation prior to tender publication.
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 4: Add Bidders */}
      {currentStep === 4 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Step 4: Add Participating Bidders</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter participating bidders manually or use demo generator for instant compliance evaluation.
            </p>
          </div>

          {/* Current Bidders List */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 p-3 text-xs font-bold text-slate-700 border-b border-slate-200 flex items-center justify-between">
              <span>Bidders In Queue ({biddersList.length})</span>
              <button
                type="button"
                onClick={() => {
                  setBiddersList((prev) => [
                    ...prev,
                    { name: 'Bharat Electronics Systems', pan: 'AABCB1001M', gstin: '27AABCB1001M1Z3' },
                    { name: 'Hind Cybernetic Softwares', pan: 'AABCH2002L', gstin: '06AABCH2002L1Z9' },
                  ]);
                }}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold"
              >
                + Generate 2 Demo Bidders
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {biddersList.map((b, idx) => (
                <div key={idx} className="p-3 text-xs flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800">{b.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      PAN: {b.pan} • GSTIN: {b.gstin}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBiddersList((prev) => prev.filter((_, i) => i !== idx))}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Manual Bidder Input Form */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-700">Manual Bidder Entry</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Company / Bidder Legal Name *"
                value={manualBidderName}
                onChange={(e) => setManualBidderName(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
              <input
                type="text"
                placeholder="Bidder PAN"
                value={manualBidderPan}
                onChange={(e) => setManualBidderPan(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white uppercase font-mono"
              />
              <input
                type="text"
                placeholder="GSTIN"
                value={manualBidderGstin}
                onChange={(e) => setManualBidderGstin(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white uppercase font-mono"
              />
            </div>
            <button
              type="button"
              onClick={handleAddBidder}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition"
            >
              Add Bidder to Tender
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Review & Publish */}
      {currentStep === 5 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Step 5: Review & Publish Tender</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review finalized procurement parameters, verified rules, and initial bidders list.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 border-b border-slate-200 pb-2">Tender Details</div>
              <div><span className="text-slate-400">Title: </span><strong>{tenderName}</strong></div>
              <div><span className="text-slate-400">ID: </span><span className="font-mono font-bold text-blue-700">{tenderId}</span></div>
              <div><span className="text-slate-400">Department: </span><span>{department}</span></div>
              <div><span className="text-slate-400">Est. Value: </span><strong>{estimatedValue}</strong></div>
              <div><span className="text-slate-400">Deadline: </span><span>{lastDate}</span></div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 border-b border-slate-200 pb-2">Compliance Rules & Bidders</div>
              <div><span className="text-slate-400">Mandatory Rules: </span><strong>{requirements.filter((r) => r.isMandatory).length} Active Rules</strong></div>
              <div><span className="text-slate-400">Optional Rules: </span><strong>{requirements.filter((r) => !r.isMandatory).length} Rules</strong></div>
              <div><span className="text-slate-400">Enrolled Bidders: </span><strong>{biddersList.length} Bidders</strong></div>
              <div><span className="text-slate-400">AI Verification: </span><span className="text-emerald-700 font-bold">Enabled</span></div>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Officer Governance Notice: </strong>
              Publishing will initiate AI verification pipelines and registry cross-checks. As Procurement Officer, you retain full statutory authority over final bid qualifications.
            </div>
          </div>
        </div>
      )}

      {/* Bottom Step Navigation Bar */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          disabled={currentStep === 1}
          onClick={() => setCurrentStep((prev) => prev - 1)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
            currentStep === 1
              ? 'opacity-40 cursor-not-allowed text-slate-400'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous Step</span>
        </button>

        <div className="flex items-center gap-3">
          {currentStep < 5 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/bids')}
                className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={handlePublish}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Publish Tender</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
