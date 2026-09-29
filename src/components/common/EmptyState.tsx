import React from 'react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  description = 'Try adjusting your search query or filter parameters to locate matching entries.',
  actionText,
  onAction,
  icon: Icon = SearchX,
}) => {
  return (
    <div className="py-12 px-6 text-center flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-slate-200">
      <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="text-base font-bold text-slate-800">{title}</h4>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md mt-1 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
