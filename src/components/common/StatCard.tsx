import React from 'react';
import type { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  iconBgColor?: string;
  badge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  subtitle,
  iconBgColor = 'bg-brand-50 text-brand-600',
  badge,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBgColor}`}>
            {icon}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</span>
              {badge && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {badge}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      {subtitle && (
        <p className="mt-3 text-xs text-slate-500 border-t border-slate-100 pt-2.5">
          {subtitle}
        </p>
      )}
    </div>
  );
};
