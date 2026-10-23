'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Award, Download, ArrowUpRight } from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { EnrollmentAreaChart } from '@/components/dashboard/Charts';
import { ChairmanAnalytics, UserProfile } from '@/types';

export default function ChairmanReportsPage() {
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
      title="Retention, Admissions & Academic Growth"
      subtitle="Multi-session student retention, batch capacity trends, and rank performance metrics."
      actions={
        <button
          onClick={() => alert('Exporting complete retention metrics report...')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          Export Report
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <span className="text-xs font-semibold text-slate-500 uppercase">Retention Rate</span>
          <span className="text-3xl font-extrabold text-orange-700 block mt-2">
            {analytics?.studentRetentionRate || 97.2}%
          </span>
          <p className="text-xs text-slate-500 mt-1">Students continuing across consecutive terms</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <span className="text-xs font-semibold text-slate-500 uppercase">Cross-Batch Test Standing</span>
          <span className="text-3xl font-extrabold text-emerald-600 block mt-2">
            {analytics?.overallExamPassRate || 88.5}%
          </span>
          <p className="text-xs text-slate-500 mt-1">Passing score achievement in Grand Tests</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-2">Batch Benchmarking Overview</h3>
        <p className="text-xs text-slate-500 mb-6">Comparative examination standing vs attendance discipline</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Batch</th>
                <th className="py-3 px-4">Average Exam Score</th>
                <th className="py-3 px-4">Attendance Adherence</th>
                <th className="py-3 px-4">Institutional Standing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {analytics?.batchPerformanceComparison.map((b, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{b.batchName}</td>
                  <td className="py-3.5 px-4 font-extrabold text-orange-700">{b.avgScore}%</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600">{b.attendanceRate}%</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
                      Tier 1 Rankers
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
