import React, { useState } from 'react';
import { ComplianceRule } from '../types';
import { Sliders, Code2, RefreshCw, CheckCircle2, AlertTriangle, Plus, Save } from 'lucide-react';
import { DEFAULT_RULES } from '../data/seedData';

interface RulesConfigViewProps {
  rules: ComplianceRule[];
  onUpdateRules: (rules: ComplianceRule[]) => void;
}

export const RulesConfigView: React.FC<RulesConfigViewProps> = ({
  rules,
  onUpdateRules,
}) => {
  const [jsonText, setJsonText] = useState(JSON.stringify(rules, null, 2));
  const [activeMode, setActiveMode] = useState<'visual' | 'json'>('visual');
  const [jsonError, setJsonError] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggleRule = (ruleId: string) => {
    const updated = rules.map((r) =>
      r.id === ruleId ? { ...r, enabled: !r.enabled } : r
    );
    onUpdateRules(updated);
    setJsonText(JSON.stringify(updated, null, 2));
  };

  const handleSaveJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('Rules configuration must be an array of rule objects.');
      }
      onUpdateRules(parsed);
      setJsonError('');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e: any) {
      setJsonError(e.message || 'Invalid JSON syntax.');
    }
  };

  const handleResetDefaults = () => {
    onUpdateRules(DEFAULT_RULES);
    setJsonText(JSON.stringify(DEFAULT_RULES, null, 2));
    setJsonError('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-400" />
            <span>Configurable Rules Engine</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent, deterministic procurement rules stored as simple JSON.
            Adjust weights, severities, or edit the JSON directly for live hackathon testing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-1 text-xs flex">
            <button
              onClick={() => setActiveMode('visual')}
              className={`px-3 py-1 rounded font-medium transition ${
                activeMode === 'visual'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Visual Controls
            </button>
            <button
              onClick={() => {
                setJsonText(JSON.stringify(rules, null, 2));
                setActiveMode('json');
              }}
              className={`px-3 py-1 rounded font-medium transition flex items-center gap-1.5 ${
                activeMode === 'json'
                  ? 'bg-blue-950 text-blue-300 border border-blue-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Editable JSON</span>
            </button>
          </div>

          <button
            onClick={handleResetDefaults}
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition"
          >
            Reset Defaults
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-950/80 border border-emerald-700 rounded-lg p-3 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Rules updated and re-evaluated across all active bidders!</span>
        </div>
      )}

      {/* Visual Mode */}
      {activeMode === 'visual' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map((rule) => {
            return (
              <div
                key={rule.id}
                className={`p-4 rounded-xl border transition ${
                  rule.enabled
                    ? 'bg-slate-900 border-slate-800 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800/50 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                      {rule.code}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">
                      {rule.category}
                    </span>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => handleToggleRule(rule.id)}
                    className={`text-xs px-2.5 py-1 rounded font-semibold transition ${
                      rule.enabled
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {rule.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                <h4 className="text-sm font-bold text-white mb-1">{rule.title}</h4>
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">{rule.description}</p>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
                  <div>
                    <span className="text-slate-500">Weight:</span>
                    <span className="font-bold text-slate-200 ml-1.5">{rule.weight} pts</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Violation Penalty:</span>
                    <span className={`font-bold ml-1.5 ${rule.severityIfFailed === 'FAIL' ? 'text-rose-400' : 'text-amber-400'}`}>
                      {rule.severityIfFailed}
                    </span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-800/60 font-mono text-[11px] text-slate-400 truncate">
                    Condition: <span className="text-teal-300">{rule.conditionDescription}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* JSON Mode */}
      {activeMode === 'json' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-slate-300">
              Direct JSON Editor (Evaluated in real-time)
            </div>
            <button
              onClick={handleSaveJson}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Apply & Re-Score Bidders</span>
            </button>
          </div>

          {jsonError && (
            <div className="mb-3 p-2.5 rounded bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{jsonError}</span>
            </div>
          )}

          <textarea
            rows={18}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-teal-300 focus:ring-1 focus:ring-blue-500 focus:outline-none leading-relaxed"
          />
        </div>
      )}
    </div>
  );
};
