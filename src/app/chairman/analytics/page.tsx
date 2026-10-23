'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, TrendingUp, Download, CheckCircle2 } from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { FeeCollectionAreaChart } from '@/components/dashboard/Charts';
import { ChairmanAnalytics, UserProfile } from '@/types';
import { formatINR } from '@/lib/calculations';

export default function ChairmanAnalyticsPage() {
  const [user] = useState<UserProfile>({
    id: 'usr-chr-01',
    name: 'Shri Vikramaditya Singhania',
    email: 'chairman@pinnakeedge.edu',
    role: 'chairman',
    instituteId: 'SPE-CHR-01',
    status: 'active',
    createdAt: '',
  });

  const [analytics, setAnalytics] = useState<ChairmanAnalytics | null>(null);

  useEffect(() => {
    fetch('/api/reports/analytics?role=chairman')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAnalytics(data.analytics);
      });
  }, []);

  return (
    <DashboardShell
      user={user}
      title="Institutional Financial Analytics"
      subtitle="Comprehensive revenue realization, stream profitability, and outstanding fee recovery metrics."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <span className="text-xs font-semibold text-slate-500 uppercase">Gross Invoiced Revenue</span>
          <span className="text-2xl font-bold text-slate-900 block mt-2">
            {formatINR((analytics?.totalRevenueINR || 0) + (analytics?.outstandingBalanceINR || 0))}
          </span>
          <p className="text-xs text-slate-400 mt-1">Total tuition fees committed</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <span className="text-xs font-semibold text-slate-500 uppercase">Verified Collections</span>
          <span className="text-2xl font-bold text-emerald-600 block mt-2">
            {formatINR(analytics?.totalRevenueINR || 0)}
          </span>
          <p className="text-xs text-emerald-600 font-semibold mt-1">
            {analytics?.collectionRatePercent}% Collection Efficiency
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <span className="text-xs font-semibold text-slate-500 uppercase">Outstanding Receivables</span>
          <span className="text-2xl font-bold text-rose-600 block mt-2">
            {formatINR(analytics?.outstandingBalanceINR || 0)}
          </span>
          <p className="text-xs text-slate-400 mt-1">Pending student installments</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-2">Program-wise Revenue Realization</h3>
        <p className="text-xs text-slate-500 mb-6">Financial contribution broken down by coaching stream</p>

        <div className="space-y-4">
          {analytics?.revenueByCourse.map((c, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-900">{c.courseName}</span>
                <span className="text-xs text-slate-400 block mt-0.5">Academic Session 2026-2027</span>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-orange-700">{formatINR(c.revenue)}</span>
                <span className="text-[10px] text-emerald-600 block font-semibold">100% Audited</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
