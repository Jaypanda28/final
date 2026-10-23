import React from 'react';

type BadgeVariant =
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'neutral'
  | 'indigo'
  | 'purple'
  | 'orange';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    indigo: 'bg-orange-50 text-orange-700 border-orange-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  switch (normalized) {
    case 'present':
    case 'active':
    case 'paid':
    case 'verified':
    case 'graded':
    case 'passed':
    case 'results_published':
      return <Badge variant="success">{status.toUpperCase()}</Badge>;

    case 'absent':
    case 'suspended':
    case 'overdue':
    case 'cancelled':
    case 'failed':
      return <Badge variant="danger">{status.toUpperCase()}</Badge>;

    case 'late':
    case 'partially_paid':
    case 'under_review':
    case 'pending':
    case 'important':
      return <Badge variant="warning">{status.toUpperCase()}</Badge>;

    case 'leave':
    case 'upcoming':
    case 'submitted':
    case 'in_progress':
      return <Badge variant="info">{status.toUpperCase()}</Badge>;

    case 'urgent':
      return <Badge variant="danger">URGENT</Badge>;

    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
}
