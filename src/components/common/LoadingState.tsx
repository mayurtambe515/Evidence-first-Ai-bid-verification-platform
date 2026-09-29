import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  submessage?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Processing verification...',
  submessage = 'Connecting to government registries and running deterministic compliance rules.',
}) => {
  return (
    <div className="py-14 px-6 text-center flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
        <Loader2 className="w-5 h-5 text-blue-600 absolute inset-0 m-auto animate-pulse" />
      </div>
      <h4 className="text-base font-bold text-slate-800">{message}</h4>
      <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
        {submessage}
      </p>
    </div>
  );
};
