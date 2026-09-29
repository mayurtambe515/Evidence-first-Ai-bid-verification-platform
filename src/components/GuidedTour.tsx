import React, { useState, useEffect, useCallback } from 'react';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  LayoutDashboard,
  Menu,
  History,
  HelpCircle,
  Eye,
} from 'lucide-react';
import { TabType } from './Sidebar';

export interface TourStep {
  id: string;
  targetId: string;
  requiredTab: TabType;
  title: string;
  description: string;
  badge?: string;
  preferredPosition?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  keyHighlights?: string[];
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'dashboard-cockpit',
    targetId: 'tour-compliance-ring',
    requiredTab: 'dashboard',
    title: 'The Dashboard Compliance Cockpit',
    badge: 'Pillar 1: Deterministic Scoring',
    description:
      'The central evaluation hub computes real-time mathematical compliance (0–100%) and assigns a strict risk tier (Low, Medium, or High). There are zero AI hallucinations—every point is grounded in deterministic rule logic.',
    keyHighlights: [
      'Interactive risk level dial & score breakdown',
      'Pass, Warning, and Disqualification counts',
      'Non-destructive "What-If" resubmission simulation',
    ],
    preferredPosition: 'bottom',
  },
  {
    id: 'evidence-checklist',
    targetId: 'tour-evidence-checklist',
    requiredTab: 'dashboard',
    title: 'Evidence-Backed Verification & Forensics',
    badge: 'Pillar 2: Multimodal Verification',
    description:
      'Every tender requirement is cross-referenced against submitted certificates and statutory registries (GSTN, Udyam, NSDL). Flagged items display exact legal citations and offer 1-click Side-by-Side forensic comparison.',
    keyHighlights: [
      'Statutory rule citations (GFR 2017 & GeM STC)',
      'Side-by-side evidence inspection for discrepancies',
      'Filter checklist by Passed, Warnings, or Failed',
    ],
    preferredPosition: 'top',
  },
  {
    id: 'sidebar-nav',
    targetId: 'tour-sidebar',
    requiredTab: 'dashboard',
    title: 'Navigation Sidebar & Pre-loaded Scenarios',
    badge: 'Quick Scenarios',
    description:
      'Explore Document AI OCR parsing, simulated government portal queries, and visual rule builder. At the bottom, switch between the 3 evaluator demo scenarios with a single click.',
    keyHighlights: [
      'Scenario A: Clean 100% compliant bidder',
      'Scenario B: Missing OEM MAF & expired filings',
      'Scenario C: Forensic entity contradiction (LLP vs Ltd)',
    ],
    preferredPosition: 'right',
  },
  {
    id: 'audit-trail-ledger',
    targetId: 'tour-audit-view',
    requiredTab: 'audit',
    title: 'Cryptographically Chained Audit Trail',
    badge: 'Pillar 3: Immutable Ledger',
    description:
      'Every compliance decision, evaluation event, and officer override is cryptographically chained using SHA-256 hash pointers. This satisfies Central Vigilance Commission (CVC) & CAG integrity standards.',
    keyHighlights: [
      'Genesis-chained SHA-256 previousHash pointers',
      'Click "Verify Chain Integrity" to validate math',
      'Click "Simulate Tamper" to test live breach detection',
    ],
    preferredPosition: 'bottom',
  },
  {
    id: 'tour-finish',
    targetId: 'tour-header-ai-btn',
    requiredTab: 'dashboard',
    title: 'Tour Complete! AI Assistant Ready',
    badge: '24/7 Knowledge Advisor',
    description:
      'You are all set to evaluate tenders! Whenever you need assistance explaining rules, uploading documents, or exercising Clause 8.4 officer overrides, just launch the GeM AI Assistant.',
    keyHighlights: [
      'Instant answers to public procurement questions',
      'Step-by-step document ingestion guidance',
      'Direct navigation to corresponding app views',
    ],
    preferredPosition: 'center',
  },
];

interface GuidedTourProps {
  isActive: boolean;
  onClose: () => void;
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenAiAssistant?: () => void;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({
  isActive,
  onClose,
  currentTab,
  onSelectTab,
  onOpenAiAssistant,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  const currentStep = TOUR_STEPS[currentStepIndex];

  // When step changes, ensure the required tab is active
  useEffect(() => {
    if (!isActive) return;

    if (currentStep.requiredTab !== currentTab) {
      onSelectTab(currentStep.requiredTab);
    }
  }, [currentStepIndex, isActive, currentStep.requiredTab, currentTab, onSelectTab]);

  // Update target bounding box
  const updateRect = useCallback(() => {
    if (!isActive) return;

    if (currentStep.preferredPosition === 'center') {
      setHighlightRect(null);
      return;
    }

    const el = document.getElementById(currentStep.targetId);
    if (el) {
      const rect = el.getBoundingClientRect();
      setHighlightRect(rect);
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setHighlightRect(null);
    }
  }, [isActive, currentStep]);

  useEffect(() => {
    if (!isActive) return;

    // Small delay to allow tab render and layout stability
    const timer = setTimeout(updateRect, 180);
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [currentStepIndex, isActive, currentTab, updateRect]);

  // Keyboard navigation
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, currentStepIndex]);

  if (!isActive) return null;

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onClose();
      if (onOpenAiAssistant) {
        onOpenAiAssistant();
      }
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  // Determine tooltip style and placement
  const getTooltipStyle = () => {
    if (!highlightRect || currentStep.preferredPosition === 'center') {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'fixed' as const,
      };
    }

    const pad = 16;
    const tooltipWidth = 440;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let top = 0;
    let left = 0;

    switch (currentStep.preferredPosition) {
      case 'bottom':
        top = highlightRect.bottom + pad;
        left = Math.max(pad, Math.min(windowWidth - tooltipWidth - pad, highlightRect.left));
        break;
      case 'top':
        top = Math.max(pad, highlightRect.top - 360);
        left = Math.max(pad, Math.min(windowWidth - tooltipWidth - pad, highlightRect.left));
        break;
      case 'right':
        top = Math.max(pad, Math.min(windowHeight - 380, highlightRect.top));
        left = Math.min(windowWidth - tooltipWidth - pad, highlightRect.right + pad);
        break;
      case 'left':
        top = Math.max(pad, Math.min(windowHeight - 380, highlightRect.top));
        left = Math.max(pad, highlightRect.left - tooltipWidth - pad);
        break;
      default:
        top = Math.max(pad, highlightRect.bottom + pad);
        left = Math.max(pad, Math.min(windowWidth - tooltipWidth - pad, highlightRect.left));
    }

    // Safety clamp within viewport
    if (top + 340 > windowHeight) {
      top = Math.max(pad, windowHeight - 360);
    }

    return {
      top: `${top}px`,
      left: `${left}px`,
      position: 'fixed' as const,
      width: `${tooltipWidth}px`,
    };
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto select-none transition-all duration-200">
      {/* Dark overlay backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Target spotlight cutout border */}
      {highlightRect && currentStep.preferredPosition !== 'center' && (
        <div
          style={{
            top: `${Math.max(0, highlightRect.top - 8)}px`,
            left: `${Math.max(0, highlightRect.left - 8)}px`,
            width: `${highlightRect.width + 16}px`,
            height: `${highlightRect.height + 16}px`,
          }}
          className="fixed rounded-2xl border-2 border-blue-400/90 ring-8 ring-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.3)] transition-all duration-300 pointer-events-none z-50 animate-pulse"
        />
      )}

      {/* Interactive Tour Tooltip Card */}
      <div
        style={getTooltipStyle()}
        className="z-50 bg-slate-900 border border-blue-500/50 rounded-2xl shadow-2xl p-5 text-slate-100 max-w-[94vw] animate-fadeIn"
      >
        {/* Step Progress Bar */}
        <div className="w-full bg-slate-800 h-1 rounded-full mb-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-teal-400 h-full transition-all duration-300"
            style={{
              width: `${((currentStepIndex + 1) / TOUR_STEPS.length) * 100}%`,
            }}
          />
        </div>

        {/* Card Header with Step Badge and Close */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
              <Compass className="w-3 h-3 text-blue-400" />
              Step {currentStepIndex + 1} of {TOUR_STEPS.length}
            </span>
            {currentStep.badge && (
              <span className="text-[10px] font-semibold text-teal-400 bg-teal-950/60 border border-teal-800 px-2 py-0.5 rounded">
                {currentStep.badge}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            title="Exit Tour (Esc)"
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title & Body */}
        <h3 className="text-base font-bold text-white tracking-tight mb-2">
          {currentStep.title}
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed mb-3">
          {currentStep.description}
        </p>

        {/* Key Highlights Bullet List */}
        {currentStep.keyHighlights && currentStep.keyHighlights.length > 0 && (
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 mb-4 space-y-1.5 text-[11px]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Key Features:
            </div>
            {currentStep.keyHighlights.map((hl, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 flex-shrink-0 mt-0.5" />
                <span>{hl}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200 transition"
          >
            Skip Tutorial
          </button>

          <div className="flex items-center gap-2">
            {currentStepIndex > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-900/40 transition active:scale-95"
            >
              <span>{currentStepIndex === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
