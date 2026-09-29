import React, { useState } from 'react';
import { Info } from 'lucide-react';

export const DemoModeBadge: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-flex items-center">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip((prev) => !prev)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-300/80 text-amber-800 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none hover:bg-amber-100 transition shadow-2xs"
        title="Demo Mode Information"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        <span>DEMO MODE</span>
        <Info className="w-3 h-3 text-amber-600" />
      </div>

      {showTooltip && (
        <div className="absolute top-full right-0 mt-2 w-72 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 border border-slate-700">
          <div className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
            <span>Prototype Sandbox</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            This prototype uses mock government portal data. Production deployment requires authorised API/integration access.
          </p>
        </div>
      )}
    </div>
  );
};
