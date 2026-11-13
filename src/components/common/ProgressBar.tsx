import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  color?: 'brand' | 'indigo' | 'emerald' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  label,
  color = 'brand',
  size = 'md',
  showPercentage = true,
}) => {
  const percentage = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

  const colorClasses = {
    brand: 'bg-brand-600',
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
  };

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-600 mb-1.5">
          {label && <span>{label}</span>}
          {showPercentage && <span className="font-semibold text-slate-800">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-200/70 rounded-full overflow-hidden ${heightClasses[size]}`}>
        <div
          className={`${heightClasses[size]} rounded-full transition-all duration-500 ease-out ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

