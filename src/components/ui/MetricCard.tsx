import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  trend,
  trendType = 'positive',
  icon: Icon,
  iconBgColor = 'bg-orange-500/10',
  iconColor = 'text-orange-600',
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-orange-500/30 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
        <div className={`p-2.5 rounded-lg ${iconBgColor} ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
        {trend && (
          <span
            className={`text-xs font-medium px-1.5 py-0.5 rounded ${
              trendType === 'positive'
                ? 'bg-emerald-50 text-emerald-700'
                : trendType === 'negative'
                ? 'bg-rose-50 text-rose-700'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
    </div>
  );
}
