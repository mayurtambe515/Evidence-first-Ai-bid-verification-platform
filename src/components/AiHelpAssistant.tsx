import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  X,
  Minimize2,
  Maximize2,
  Trash2,
  HelpCircle,
  ArrowRight,
  FolderOpen,
  Sliders,
  History,
  FileText,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ShieldAlert,
  ArrowRightLeft,
  Flame,
  Compass,
  Play,
} from 'lucide-react';
import { Tender, Bidder, AuthUser } from '../types';
import { TabType } from './Sidebar';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  quickActions?: {
    label: string;
    action: () => void;
    icon?: React.ReactNode;
  }[];
}

interface AiHelpAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  selectedTender: Tender;
  selectedBidder: Bidder;
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  currentUser?: AuthUser | null;
  onOpenReport?: () => void;
  onOpenComparison?: () => void;
  onStartTour?: () => void;
}

const PRESET_PROMPTS = [
  {
    title: 'How to use this app?',
    query: 'How do I use this app step-by-step from start to finish?',
    category: 'General',
  },
  {
    title: 'How to add & upload documents?',
    query: 'How do I add or upload new documents, and how does the AI OCR extraction work?',
    category: 'Documents',
  },
  {
    title: 'Explain all compliance rules',
    query: 'Please explain all the deterministic compliance rules (GST, PAN, Udyam, OEM MAF, Turnover) and their weights.',
    category: 'Rules',
  },
  {
    title: 'Side-by-side evidence inspector',
    query: 'How does the side-by-side forensic evidence inspector work, and what discrepancies does it detect?',
    category: 'Forensics',
  },
  {
    title: 'What-If Resubmission Simulator',
    query: 'Explain how the Officer "What-If" Resubmission Simulator works and how to project scores.',
    category: 'Simulation',
  },
  {
    title: 'Cryptographic Audit & Tamper check',
    query: 'How does the SHA-256 chained audit hash ledger work, and how do I test tamper detection?',
    category: 'Audit',
  },
  {
    title: 'Officer Override vs Auditor Role',
    query: 'What is the statutory basis for Officer Override under Clause 8.4, and how does it differ from Auditor role?',
    category: 'Compliance',
  },
];

export const AiHelpAssistant: React.FC<AiHelpAssistantProps> = ({
  isOpen,
  onClose,
  onToggle,
  selectedTender,
  selectedBidder,
  currentTab,
  onSelectTab,
  currentUser,
  onOpenReport,
  onOpenComparison,
  onStartTour,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Hello! I am your **GeM Compliance Intelligence Assistant**.

I am here to guide you through:
- **Application Overview & Navigation**: How to evaluate bidders and navigate between tabs.
- **Adding & Ingesting Documents**: Uploading certificates, running multimodal OCR, and verifying extracted fields.
- **Deterministic Compliance Rules**: Deep dives into **R-GST-ACT**, **R-PAN-MAT**, **R-UDYAM-ACT**, **R-OEM-REQ**, and **R-TURN-MIN**.
- **Forensic Discrepancy Analysis**: Using the Side-by-Side comparison to catch hidden identity conflicts.
- **What-If Simulation & Officer Overrides**: Testing hypothetical resubmissions and recording Clause 8.4 statutory decisions.

What would you like to explore? Click **Start Tutorial** below or select any topic!`,
      timestamp: 'Just now',
      quickActions: onStartTour
        ? [
            {
              label: 'Start Guided Tutorial',
              action: () => {
                onClose();
                onStartTour();
              },
              icon: <Compass className="w-3.5 h-3.5 text-teal-300" />,
            },
          ]
        : undefined,
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'reset-' + Date.now(),
        sender: 'assistant',
        text: 'Chat history cleared. How can I help you with GeM compliance, document uploads, or rule evaluations?',
        timestamp: 'Just now',
      },
    ]);
  };

  const handleSend = async (userText?: string) => {
    const query = (userText || inputValue).trim();
    if (!query || isLoading) return;

    const userMessageId = `user-${Date.now()}`;
    const newMessages: ChatMessage[] = [
      ...messages,
      {
        id: userMessageId,
        sender: 'user',
        text: query,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];

    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const payload = {
        message: query,
        conversationHistory: newMessages.slice(-5).map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text,
        })),
        currentContext: {
          currentTab,
          tenderRef: selectedTender.refNumber,
          tenderTitle: selectedTender.title,
          bidderName: selectedBidder.name,
          bidderScenario: selectedBidder.scenarioTag,
          userRole: currentUser?.role || 'Procurement Officer',
        },
      };

      const response = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const replyText = data.reply || "I've processed your query. Please let me know if you need further clarification on GeM compliance!";

      // Generate context-aware quick action buttons based on keywords in query or reply
      const lowerQuery = query.toLowerCase();
      const actions: { label: string; action: () => void; icon?: React.ReactNode }[] = [];

      if (lowerQuery.includes('doc') || lowerQuery.includes('upload') || lowerQuery.includes('ocr')) {
        actions.push({
          label: 'Go to Documents & AI Parsing',
          action: () => {
            onSelectTab('documents');
          },
          icon: <FolderOpen className="w-3.5 h-3.5" />,
        });
      }

      if (lowerQuery.includes('rule') || lowerQuery.includes('config')) {
        actions.push({
          label: 'Go to Rules Configuration',
          action: () => {
            onSelectTab('rules');
          },
          icon: <Sliders className="w-3.5 h-3.5" />,
        });
      }

      if (lowerQuery.includes('audit') || lowerQuery.includes('hash') || lowerQuery.includes('tamper')) {
        actions.push({
          label: 'Go to Audit Trail Logs',
          action: () => {
            onSelectTab('audit');
          },
          icon: <History className="w-3.5 h-3.5" />,
        });
      }

      if (lowerQuery.includes('side') || lowerQuery.includes('forensic') || lowerQuery.includes('discrepan') || lowerQuery.includes('contradict')) {
        if (onOpenComparison) {
          actions.push({
            label: 'Inspect Side-by-Side Evidence',
            action: onOpenComparison,
            icon: <ArrowRightLeft className="w-3.5 h-3.5" />,
          });
        }
      }

      if (lowerQuery.includes('report')) {
        if (onOpenReport) {
          actions.push({
            label: 'Open Formal Audit Report',
            action: onOpenReport,
            icon: <FileText className="w-3.5 h-3.5" />,
          });
        }
      }

      if (
        lowerQuery.includes('tour') ||
        lowerQuery.includes('tutorial') ||
        lowerQuery.includes('walkthrough') ||
        lowerQuery.includes('how to use') ||
        lowerQuery.includes('start')
      ) {
        if (onStartTour) {
          actions.push({
            label: 'Start Guided Tutorial',
            action: () => {
              onClose();
              onStartTour();
            },
            icon: <Compass className="w-3.5 h-3.5 text-teal-300" />,
          });
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickActions: actions.length > 0 ? actions : undefined,
        },
      ]);
    } catch (err: any) {
      console.error('Assistant request error:', err);
      // Fallback response in case of network issue
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'assistant',
          text: `### GeM Compliance Quick Guidance

Here are direct links and steps to assist you right now:
- **How to add documents**: Navigate to **Documents & AI Parsing** in the sidebar and click **Upload New Document**.
- **How to test scenarios**: Use the bottom-left sidebar presets (Scenario A, B, or C).
- **Compliance Rules**: Rules like **R-GST-ACT**, **R-PAN-MAT**, **R-UDYAM-ACT**, and **R-OEM-REQ** enforce mandatory procurement compliance.
- **Audit Verification**: Open **Audit Trail Logs** to test the SHA-256 cryptographic chain integrity and simulate tampering.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to render Markdown-like text nicely
  const formatAssistantText = (raw: string) => {
    // Split by lines and process simple headings, bold, bullet points
    const lines = raw.split('\n');
    return (
      <div className="space-y-2 text-xs leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          if (!trimmed) {
            return <div key={idx} className="h-1" />;
          }

          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={idx} className="text-sm font-bold text-blue-300 mt-2 pb-1 border-b border-slate-700/60">
                {trimmed.replace('### ', '')}
              </h4>
            );
          }

          if (trimmed.startsWith('## ')) {
            return (
              <h3 key={idx} className="text-base font-bold text-white mt-2 pb-1 border-b border-slate-700">
                {trimmed.replace('## ', '')}
              </h3>
            );
          }

          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const content = trimmed.substring(2);
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="text-blue-400 font-bold">•</span>
                <div
                  className="text-slate-200"
                  dangerouslySetInnerHTML={{
                    __html: formatBoldAndCode(content),
                  }}
                />
              </div>
            );
          }

          if (/^\d+\.\s/.test(trimmed)) {
            const num = trimmed.match(/^\d+\./)?.[0];
            const content = trimmed.replace(/^\d+\.\s*/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-1 mt-1">
                <span className="text-teal-400 font-mono font-bold text-[11px] min-w-[18px]">{num}</span>
                <div
                  className="text-slate-200"
                  dangerouslySetInnerHTML={{
                    __html: formatBoldAndCode(content),
                  }}
                />
              </div>
            );
          }

          return (
            <p
              key={idx}
              className="text-slate-200"
              dangerouslySetInnerHTML={{
                __html: formatBoldAndCode(trimmed),
              }}
            />
          );
        })}
      </div>
    );
  };

  const formatBoldAndCode = (text: string) => {
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-slate-300 italic">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-800 text-teal-300 px-1 py-0.5 rounded font-mono text-[11px] border border-slate-700">$1</code>');
    return formatted;
  };

  return (
    <>
      {/* Floating Launcher Button at bottom-right */}
      {!isOpen && (
        <button
          onClick={onToggle}
          title="Open GeM AI Assistant & Help Center"
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 text-white shadow-xl shadow-blue-900/50 hover:shadow-2xl hover:shadow-blue-600/50 border border-blue-400/40 flex items-center gap-2.5 transition-all duration-200 transform hover:scale-105 active:scale-95 group"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-white animate-spin-slow" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-950 animate-pulse" />
          </div>
          <span className="font-bold text-xs tracking-wide pr-1 hidden sm:inline">
            GeM AI Assistant
          </span>
          <span className="text-[10px] bg-blue-950/80 text-blue-200 px-1.5 py-0.5 rounded border border-blue-400/30 hidden md:inline">
            Help
          </span>
        </button>
      )}

      {/* Floating Chat Drawer / Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 shadow-2xl rounded-2xl border border-slate-700 bg-slate-900/98 backdrop-blur-xl flex flex-col ${
            isExpanded
              ? 'top-8 left-8 right-8 bottom-8'
              : 'bottom-6 right-6 w-[94vw] max-w-xl h-[620px] max-h-[88vh]'
          }`}
        >
          {/* Header Bar */}
          <div className="px-4 py-3.5 bg-slate-950/90 border-b border-slate-800 rounded-t-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-900/40 border border-blue-400/30 flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-white tracking-wide truncate">
                    GeM AI Compliance Assistant
                  </h3>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-teal-950 text-teal-300 border border-teal-800 font-semibold">
                    Gemini 2.5 / 3.8
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="truncate">
                    Context: {selectedBidder.name.split(' ')[0]} • {selectedTender.refNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={handleClearChat}
                title="Clear chat history"
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Restore window size' : 'Expand window'}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={onClose}
                title="Close AI Assistant"
                className="p-1.5 rounded-md text-slate-400 hover:text-rose-300 hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Guided Tour Banner for First-Time Users */}
          {onStartTour && (
            <div className="px-4 py-2.5 bg-gradient-to-r from-blue-950/90 via-indigo-950/80 to-teal-950/90 border-b border-blue-500/30 flex items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-teal-300 flex-shrink-0">
                  <Compass className="w-4 h-4 animate-spin-slow" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                    <span>First time evaluating tenders?</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-teal-950 text-teal-300 border border-teal-800 font-semibold uppercase">
                      Tour
                    </span>
                  </div>
                  <p className="text-[10px] text-blue-200/80 truncate">
                    Interactive walkthrough of Dashboard, Sidebar & Audit Trail
                  </p>
                </div>
              </div>

              <button
                type="button"
                id="tour-start-tutorial-btn"
                onClick={() => {
                  onClose();
                  onStartTour();
                }}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-400 hover:to-teal-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-950 transition active:scale-95 flex-shrink-0"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Start Tutorial</span>
              </button>
            </div>
          )}

          {/* Preset Suggested Questions Carousel */}
          <div className="px-3.5 py-2 bg-slate-950/50 border-b border-slate-800/80 overflow-x-auto flex items-center gap-2 scrollbar-none text-[11px]">
            {onStartTour && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartTour();
                }}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-gradient-to-r from-teal-500/25 via-blue-500/25 to-indigo-500/25 hover:from-teal-500/40 hover:to-blue-500/40 text-teal-200 border border-teal-500/60 text-[10px] font-bold transition flex items-center gap-1.5 active:scale-95 shadow-sm flex-shrink-0"
              >
                <Play className="w-2.5 h-2.5 fill-current text-teal-300" />
                <span>Start Tutorial</span>
              </button>
            )}

            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-400" />
              Topics:
            </span>
            {PRESET_PROMPTS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(preset.query)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-blue-600/30 hover:text-blue-200 text-slate-300 border border-slate-700 hover:border-blue-500/50 text-[10px] font-medium transition active:scale-95"
              >
                {preset.title}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-bold ${
                      isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-gradient-to-br from-indigo-700 to-blue-800 text-teal-300 border border-teal-500/40'
                    }`}
                  >
                    {isUser ? (currentUser?.name?.charAt(0) || 'U') : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`relative max-w-[85%] rounded-2xl px-4 py-3 shadow-md ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-tl-none'
                    }`}
                  >
                    {/* Message Header / Timestamp & Copy */}
                    <div className="flex items-center justify-between gap-3 mb-1 text-[10px] text-slate-400">
                      <span className="font-semibold text-slate-300">
                        {isUser ? 'You' : 'GeM Compliance Advisor'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span>{msg.timestamp}</span>
                        {!isUser && (
                          <button
                            onClick={() => handleCopy(msg.id, msg.text)}
                            title="Copy response"
                            className="text-slate-400 hover:text-white transition ml-1"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Content Body */}
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      formatAssistantText(msg.text)
                    )}

                    {/* Interactive Direct Navigation Actions (if any) */}
                    {msg.quickActions && msg.quickActions.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-700/80 flex flex-wrap gap-2">
                        {msg.quickActions.map((qa, aIdx) => (
                          <button
                            key={aIdx}
                            type="button"
                            onClick={() => {
                              qa.action();
                              onClose();
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] flex items-center gap-1.5 shadow transition active:scale-95"
                          >
                            {qa.icon}
                            <span>{qa.label} →</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Pulsing Loading Bubble */}
            {isLoading && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-700 to-blue-800 text-teal-300 border border-teal-500/40 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 animate-spin-slow" />
                </div>
                <div className="bg-slate-800/90 border border-slate-700 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse delay-100" />
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse delay-200" />
                  <span className="text-[11px] text-slate-400 ml-1 font-mono">
                    Consulting Gemini & Public Procurement Knowledge Base...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box Footer */}
          <div className="p-3 bg-slate-950/90 border-t border-slate-800 rounded-b-2xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about app features, document uploads, compliance rules..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className={`p-2.5 rounded-xl font-medium transition flex items-center justify-center ${
                  inputValue.trim() && !isLoading
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 px-1">
              <span>Grounding: GFR 2017 • GeM GTC Cl. 8.4 • Indian Tax Portals</span>
              <span className="font-mono">Ready to assist</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
