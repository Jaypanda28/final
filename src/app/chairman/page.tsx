'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  TrendingUp,
  CreditCard,
  Users,
  Award,
  CalendarCheck,
  Download,
  Building,
  GraduationCap,
  ArrowUpRight,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { MetricCard } from '@/components/ui/MetricCard';
import {
  EnrollmentAreaChart,
  FeeCollectionAreaChart,
  BatchDistributionBarChart,
} from '@/components/dashboard/Charts';
import { ChairmanAnalytics, UserProfile } from '@/types';
import { formatINR } from '@/lib/calculations';

export default function ChairmanDashboardPage() {
  const [user, setUser] = useState<UserProfile>({
    id: 'usr-chr-01',
    name: 'Debasis Dixit',
    email: 'chairman@pinnakeedge.edu',
    role: 'chairman',
    instituteId: 'SPE-CHR-01',
    status: 'active',
    createdAt: '',
  });

  const [analytics, setAnalytics] = useState<ChairmanAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});

    fetch('/api/reports/analytics?role=chairman')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAnalytics(data.analytics);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleExportExecutiveSummary = () => {
    alert('Executive Q3 Strategic Summary Report PDF has been compiled and downloaded.');
  };

  return (
    <DashboardShell
      user={user}
      title="Executive Chairman Oversight Portal"
      subtitle="High-level governance: financial performance, enrollment retention, and institutional health."
      actions={
        <button
          onClick={handleExportExecutiveSummary}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          Export Executive Report
        </button>
      }
    >
      {/* 0. CHAIRMAN EXECUTIVE PROFILE BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-[#080C14] rounded-3xl border border-amber-500/30 p-6 sm:p-7 shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left z-10">
          <div className="relative shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-500 shadow-xl">
              <img
                src="/leadership/debasis-dixit.jpg"
                alt="Mr. Debasis Dixit"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-md">
              CHAIRMAN
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Executive Chairman &bull; Founder
              </span>
              <span className="text-xs text-slate-400 font-medium">SPE-CHR-01 &bull; Managing Trustee</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Mr. Debasis Dixit
            </h2>
            <p className="text-xs text-amber-400 font-medium">
              B.Tech (Electronics &amp; Telecom) &bull; Ex-Software Engineer: CitiBank &bull; TCS &bull; Mindtree (9 Yrs)
            </p>
            <p className="text-[11px] text-slate-300 max-w-2xl leading-relaxed pt-0.5">
              &ldquo;Devoted to the welfare of education in Bhadrak—bringing cutting-edge digital infrastructure and institutional excellence to empower every aspirant.&rdquo;
            </p>
          </div>
        </div>

        <div className="flex sm:flex-col gap-2 shrink-0 z-10 w-full sm:w-auto">
          <div className="px-4 py-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-center flex-1 sm:flex-none">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Governance</span>
            <span className="text-sm font-black text-white">Managing Trustee</span>
          </div>
        </div>
      </div>

      {/* 1. EXECUTIVE KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <MetricCard
          title="Total Student Base"
          value={analytics ? analytics.totalEnrolledStudents : '100+'}
          subtitle={`New admissions this month: ${analytics?.newAdmissionsThisMonth || 14}`}
          trend="97.2% Retention"
          trendType="positive"
          icon={Users}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-700"
        />

        <MetricCard
          title="Gross Realized Revenue"
          value={analytics ? formatINR(analytics.totalRevenueINR) : '₹1.72 Cr'}
          subtitle={`Outstanding: ${analytics ? formatINR(analytics.outstandingBalanceINR) : '₹1.07 Cr'}`}
          trend={`Collection Rate ${analytics ? analytics.collectionRatePercent : 62}%`}
          trendType="positive"
          icon={CreditCard}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />

        <MetricCard
          title="Institutional Attendance"
          value={analytics ? `${analytics.overallAttendanceRate}%` : '93.4%'}
          subtitle="Cross-batch average"
          trend="Super 30: 96%"
          trendType="positive"
          icon={CalendarCheck}
          iconBgColor="bg-orange-50"
          iconColor="text-orange-600"
        />

        <MetricCard
          title="Grand Test Pass Rate"
          value={analytics ? `${analytics.overallExamPassRate}%` : '88.5%'}
          subtitle="All India Mock Performance"
          trend="+4.2% YoY"
          trendType="positive"
          icon={Award}
          iconBgColor="bg-sky-50"
          iconColor="text-sky-600"
        />
      </div>

      {/* 2. REVENUE BY COURSE & BATCH COMPARISON */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
        {/* Revenue Contribution by Program */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Revenue Contribution by Stream</h3>
              <p className="text-xs text-slate-500">Academic program realization</p>
            </div>
            <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              FY 2026-27
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {analytics?.revenueByCourse.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{item.courseName}</span>
                  <span className="text-[10px] text-slate-400">Integrated Coaching</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-orange-700 block">{formatINR(item.revenue)}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Batch Performance Benchmarking */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Batch Comparative Performance</h3>
              <p className="text-xs text-slate-500">Test average score vs attendance adherence</p>
            </div>
            <Link
              href="/chairman/reports"
              className="text-xs font-semibold text-orange-600 hover:text-orange-800 flex items-center gap-1"
            >
              Detailed Metrics <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3 pt-2">
            {analytics?.batchPerformanceComparison.map((batch, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{batch.batchName}</span>
                  <span className="text-[10px] text-slate-500">Attendance: {batch.attendanceRate}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-slate-800 block">Avg: {batch.avgScore}%</span>
                    <span className="text-[10px] text-orange-600 font-semibold">Test Standing</span>
                  </div>
                  <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-600 rounded-full" style={{ width: `${batch.avgScore}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. ACADEMIC GOVERNANCE COUNCIL & DEPARTMENT HEADS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Institutional Academic Governance &amp; Faculty Chairs
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Chairman&apos;s direct council: Principal Yudhistir Debata and the 4 Department Chairs
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            All Departments 100% Operational
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Principal */}
          <div className="p-4 rounded-xl border border-orange-200 bg-orange-50/40 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                Academic Director
              </span>
              <h4 className="text-xs font-bold text-slate-900 mt-2">Yudhistir Debata</h4>
              <p className="text-[10px] text-slate-500">Principal (SPE-PRN-01)</p>
            </div>
            <div className="mt-3 pt-2 border-t border-orange-100 text-[10px] text-orange-700 font-semibold">
              93.4% Daily Attendance
            </div>
          </div>

          {/* Math */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Mathematics Chair
              </span>
              <h4 className="text-xs font-bold text-slate-900 mt-2">Avinash Singh Rajput</h4>
              <p className="text-[10px] text-slate-500">Calculus &amp; Olympiads</p>
            </div>
            <div className="mt-3 pt-2 border-t border-emerald-100 text-[10px] text-emerald-700 font-semibold">
              88% Syllabus &bull; ★ 4.9
            </div>
          </div>

          {/* Physics */}
          <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/40 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                Physics Chair
              </span>
              <h4 className="text-xs font-bold text-slate-900 mt-2">Nandan Jha</h4>
              <p className="text-[10px] text-slate-500">Mechanics &amp; Electrodynamics</p>
            </div>
            <div className="mt-3 pt-2 border-t border-sky-100 text-[10px] text-sky-700 font-semibold">
              85% Syllabus &bull; ★ 4.8
            </div>
          </div>

          {/* Chemistry */}
          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                Chemistry Chair
              </span>
              <h4 className="text-xs font-bold text-slate-900 mt-2">Arun Kumar Naik</h4>
              <p className="text-[10px] text-slate-500">Organic Mechanisms</p>
            </div>
            <div className="mt-3 pt-2 border-t border-purple-100 text-[10px] text-purple-700 font-semibold">
              91% Syllabus &bull; ★ 4.9
            </div>
          </div>

          {/* Biology */}
          <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/40 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                Biology Chair
              </span>
              <h4 className="text-xs font-bold text-slate-900 mt-2">Girija Shankar Panda</h4>
              <p className="text-[10px] text-slate-500">Genetics &amp; NEET</p>
            </div>
            <div className="mt-3 pt-2 border-t border-teal-100 text-[10px] text-teal-700 font-semibold">
              94% Syllabus &bull; ★ 4.9
            </div>
          </div>
        </div>
      </div>

      {/* 4. EXECUTIVE QUICK ACTIONS */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
            Chairman Executive Controls
          </h3>
          <span className="text-[11px] text-slate-400">Authorized Access Only</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/chairman/reports"
            className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-all text-left"
          >
            <TrendingUp className="w-5 h-5 text-amber-400 mb-2" />
            <h4 className="text-xs font-bold text-white">Enrollment & Retention</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Year-over-year admission curves</p>
          </Link>

          <Link
            href="/chairman/analytics"
            className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-all text-left"
          >
            <CreditCard className="w-5 h-5 text-emerald-400 mb-2" />
            <h4 className="text-xs font-bold text-white">Financial Audit & Receivables</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Verified collections and dues</p>
          </Link>

          <Link
            href="/chairman/audit-logs"
            className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-all text-left"
          >
            <Building className="w-5 h-5 text-sky-400 mb-2" />
            <h4 className="text-xs font-bold text-white">Institutional Audit Trail</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Governance event logs</p>
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
