'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  CreditCard,
  AlertTriangle,
  FileCheck2,
  TrendingUp,
  PlusCircle,
  Megaphone,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { MetricCard } from '@/components/ui/MetricCard';
import {
  EnrollmentAreaChart,
  AttendanceLineChart,
  BatchDistributionBarChart,
  FeeCollectionAreaChart,
} from '@/components/dashboard/Charts';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/ui/Badge';
import { PrincipalAnalytics, UserProfile } from '@/types';
import { formatINR } from '@/lib/calculations';

export default function PrincipalDashboardPage() {
  const [user, setUser] = useState<UserProfile>({
    id: 'usr-prn-01',
    name: 'Yudhistir Debata',
    email: 'principal@pinnakeedge.edu',
    role: 'principal',
    instituteId: 'SPE-PRN-01',
    status: 'active',
    createdAt: '',
  });

  const [analytics, setAnalytics] = useState<PrincipalAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  // Quick Action Modals
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  // Form states
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentBatch, setNewStudentBatch] = useState('btc-jee-a1');
  const [studentSuccessMsg, setStudentSuccessMsg] = useState('');

  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [announcementPriority, setAnnouncementPriority] = useState<'normal' | 'important' | 'urgent'>('normal');
  const [announcementSuccessMsg, setAnnouncementSuccessMsg] = useState('');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/reports/analytics?role=principal');
      const data = await res.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newStudentName,
          email: newStudentEmail,
          phone: newStudentPhone,
          courseId: 'crs-jee-adv',
          courseName: 'JEE Advanced Pinnacle',
          batchId: newStudentBatch,
          batchName: 'Batch A1 - Morning Super 30',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStudentSuccessMsg(`Student ${data.student.name} created (${data.student.studentId})`);
        setNewStudentName('');
        setNewStudentEmail('');
        setNewStudentPhone('');
        fetchAnalytics();
        setTimeout(() => {
          setStudentSuccessMsg('');
          setShowAddStudentModal(false);
        }, 1500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: announcementTitle,
          content: announcementContent,
          priority: announcementPriority,
          targetAudience: 'all',
        }),
      });
      if (res.ok) {
        setAnnouncementSuccessMsg('Announcement published successfully.');
        setAnnouncementTitle('');
        setAnnouncementContent('');
        setTimeout(() => {
          setAnnouncementSuccessMsg('');
          setShowAnnouncementModal(false);
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DashboardShell
      user={user}
      title="Principal Administration Dashboard"
      subtitle="Complete operational oversight: admissions, faculty, attendance, tests, and fees."
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddStudentModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-xs transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Add Student
          </button>
          <button
            onClick={() => setShowAnnouncementModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all"
          >
            <Megaphone className="w-4 h-4" />
            Publish Notice
          </button>
        </div>
      }
    >
      {/* 0. LEADERSHIP EXECUTIVE PROFILE BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-[#080C14] rounded-3xl border border-orange-500/30 p-6 sm:p-7 shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left z-10">
          <div className="relative shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-orange-500 shadow-xl">
              <img
                src="/leadership/yudhistir-debata.jpg"
                alt="Mr. Yudhistir Debata"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-orange-500 text-white font-black text-[9px] uppercase tracking-wider shadow-md">
              PRINCIPAL
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                Principal &bull; Co-Founder
              </span>
              <span className="text-xs text-slate-400 font-medium">SPE-PRN-01 &bull; 35+ Yrs Academician</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Mr. Yudhistir Debata
            </h2>
            <p className="text-xs text-orange-400 font-medium">
              M.Sc (Mathematics) &bull; Ex-Academic Coordinator, Dhirubhai Ambani School &bull; Ex-VP Presidency School
            </p>
            <p className="text-[11px] text-slate-300 max-w-2xl leading-relaxed pt-0.5">
              &ldquo;Revolutionizing classroom practices with continuous diagnostic evaluation, conceptual rigor, and student-first mentorship across all batches.&rdquo;
            </p>
          </div>
        </div>

        <div className="flex sm:flex-col gap-2 shrink-0 z-10 w-full sm:w-auto">
          <div className="px-4 py-2.5 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-center flex-1 sm:flex-none">
            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block">Academic Status</span>
            <span className="text-sm font-black text-white">Active Session 2026-27</span>
          </div>
        </div>
      </div>

      {/* 1. TOP METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <MetricCard
          title="Total Active Students"
          value={analytics ? analytics.totalStudents : '100+'}
          subtitle="Enrolled across all batches"
          trend="+14% this month"
          trendType="positive"
          icon={Users}
          iconBgColor="bg-orange-50"
          iconColor="text-orange-600"
        />

        <MetricCard
          title="Appointed Faculty"
          value={analytics ? analytics.totalTeachers : 10}
          subtitle="IIT & Medical Specialists"
          trend="1:10 Faculty Ratio"
          trendType="neutral"
          icon={GraduationCap}
          iconBgColor="bg-sky-50"
          iconColor="text-sky-600"
        />

        <MetricCard
          title="Today's Attendance"
          value={analytics ? `${analytics.todayAttendancePercent}%` : '93.4%'}
          subtitle="Live session attendance"
          trend={analytics && analytics.todayAttendancePercent >= 90 ? 'Healthy' : 'Monitor'}
          trendType={analytics && analytics.todayAttendancePercent >= 90 ? 'positive' : 'negative'}
          icon={CalendarCheck}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />

        <MetricCard
          title="Fee Collection (INR)"
          value={analytics ? formatINR(analytics.totalFeeCollectedINR) : '₹1.72 Cr'}
          subtitle={`Outstanding: ${analytics ? formatINR(analytics.totalFeeOutstandingINR) : '₹1.07 Cr'}`}
          trend="Collection Rate 62%"
          trendType="positive"
          icon={CreditCard}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      {/* 2. STAR FACULTY DEPARTMENT PERFORMANCE & CHAIRS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-orange-50 text-orange-700">
                <GraduationCap className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Academic Faculty Department Chairs &amp; Syllabus Progress
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Principal&apos;s direct academic appraisal: syllabus completion, batch standing, and student ratings
            </p>
          </div>
          <Link
            href="/principal/teachers"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-800 bg-orange-50 hover:bg-orange-100/70 px-3 py-1.5 rounded-xl border border-orange-200 transition-colors"
          >
            Manage Faculty Roster &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-emerald-200/80 bg-gradient-to-b from-emerald-50/50 to-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Mathematics
                </span>
                <span className="text-xs font-bold text-slate-700">★ 4.9</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">Avinash Singh Rajput</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Calculus, Vectors &amp; Olympiads</p>
              <div className="mt-3 space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Syllabus Covered</span>
                  <span className="font-bold text-emerald-700">88%</span>
                </div>
                <div className="w-full bg-emerald-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '88%' }} />
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between text-[11px] text-slate-600">
              <span>52 Students (A1, C1)</span>
              <span className="font-bold text-slate-900">Avg 84.5%</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-sky-200/80 bg-gradient-to-b from-sky-50/50 to-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300">
                  Physics
                </span>
                <span className="text-xs font-bold text-slate-700">★ 4.8</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">Nandan Jha</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Mechanics &amp; Electrodynamics</p>
              <div className="mt-3 space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Syllabus Covered</span>
                  <span className="font-bold text-sky-700">85%</span>
                </div>
                <div className="w-full bg-sky-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-sky-600 h-full rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-sky-100 flex items-center justify-between text-[11px] text-slate-600">
              <span>60 Students (A1, B1)</span>
              <span className="font-bold text-slate-900">Avg 81.2%</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-purple-200/80 bg-gradient-to-b from-purple-50/50 to-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
                  Chemistry
                </span>
                <span className="text-xs font-bold text-slate-700">★ 4.9</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">Arun Kumar Naik</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Organic Reactions &amp; Carbonyls</p>
              <div className="mt-3 space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Syllabus Covered</span>
                  <span className="font-bold text-purple-700">91%</span>
                </div>
                <div className="w-full bg-purple-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-600 h-full rounded-full" style={{ width: '91%' }} />
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-100 flex items-center justify-between text-[11px] text-slate-600">
              <span>58 Students (A1, B1)</span>
              <span className="font-bold text-slate-900">Avg 86.8%</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-teal-200/80 bg-gradient-to-b from-teal-50/50 to-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-300">
                  Biology
                </span>
                <span className="text-xs font-bold text-slate-700">★ 4.9</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">Girija Shankar Panda</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Genetics, Botany &amp; NEET</p>
              <div className="mt-3 space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Syllabus Covered</span>
                  <span className="font-bold text-teal-700">94%</span>
                </div>
                <div className="w-full bg-teal-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-teal-600 h-full rounded-full" style={{ width: '94%' }} />
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-teal-100 flex items-center justify-between text-[11px] text-slate-600">
              <span>56 Students (B1, D1)</span>
              <span className="font-bold text-slate-900">Avg 89.4%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
        {/* Monthly Enrollment Trend */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Student Enrollment Growth</h3>
              <p className="text-xs text-slate-500">Cumulative admissions trend by month</p>
            </div>
            <Link
              href="/principal/students"
              className="text-xs font-semibold text-orange-600 hover:text-orange-800 flex items-center gap-1"
            >
              View Directory <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {analytics && <EnrollmentAreaChart data={analytics.monthlyEnrollment} />}
        </div>

        {/* Weekly Attendance Rate */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Attendance Trend (Past 7 Days)</h3>
              <p className="text-xs text-slate-500">Institution-wide present percentage</p>
            </div>
            <Link
              href="/principal/attendance"
              className="text-xs font-semibold text-orange-600 hover:text-orange-800 flex items-center gap-1"
            >
              Attendance Records <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {analytics && <AttendanceLineChart data={analytics.attendanceTrends} />}
        </div>

        {/* Batch Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Batch-wise Student Distribution</h3>
              <p className="text-xs text-slate-500">Capacity and enrolled student counts</p>
            </div>
            <Link
              href="/principal/courses"
              className="text-xs font-semibold text-orange-600 hover:text-orange-800 flex items-center gap-1"
            >
              Batch Setup <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {analytics && <BatchDistributionBarChart data={analytics.batchDistribution} />}
        </div>

        {/* Fee Collection vs Target */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Monthly Fee Collection vs Target</h3>
              <p className="text-xs text-slate-500">Realized revenue vs institutional budget</p>
            </div>
            <Link
              href="/principal/fees"
              className="text-xs font-semibold text-orange-600 hover:text-orange-800 flex items-center gap-1"
            >
              Invoices & Payments <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {analytics && <FeeCollectionAreaChart data={analytics.feeCollectionMonthly} />}
        </div>
      </div>

      {/* 3. QUICK OPERATIONS ROW */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 mb-8 border border-slate-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-orange-400 mb-4">
          Principal Rapid Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/principal/students"
            className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-all text-left"
          >
            <Users className="w-5 h-5 text-orange-400 mb-2" />
            <h4 className="text-xs font-bold text-white">Manage Students</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Admissions & batches</p>
          </Link>

          <Link
            href="/principal/attendance"
            className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-all text-left"
          >
            <CalendarCheck className="w-5 h-5 text-emerald-400 mb-2" />
            <h4 className="text-xs font-bold text-white">Attendance Oversight</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Alerts & summaries</p>
          </Link>

          <Link
            href="/principal/fees"
            className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-all text-left"
          >
            <CreditCard className="w-5 h-5 text-amber-400 mb-2" />
            <h4 className="text-xs font-bold text-white">Record Fee Payment</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Issue digital receipts</p>
          </Link>

          <Link
            href="/principal/examinations"
            className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-all text-left"
          >
            <FileCheck2 className="w-5 h-5 text-sky-400 mb-2" />
            <h4 className="text-xs font-bold text-white">Authorize Test Results</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Release scorecards</p>
          </Link>
        </div>
      </div>

      {/* QUICK ADD STUDENT MODAL */}
      <Modal
        isOpen={showAddStudentModal}
        onClose={() => setShowAddStudentModal(false)}
        title="Admit New Student"
        description="Creates an institutional student record and generates a unique Student ID."
      >
        {studentSuccessMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            {studentSuccessMsg}
          </div>
        )}
        <form onSubmit={handleAddStudent} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              placeholder="e.g. Diya Sengupta"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
              <input
                type="email"
                required
                value={newStudentEmail}
                onChange={(e) => setNewStudentEmail(e.target.value)}
                placeholder="diya.s@student.edu"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone *</label>
              <input
                type="tel"
                required
                value={newStudentPhone}
                onChange={(e) => setNewStudentPhone(e.target.value)}
                placeholder="+91 98..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Batch *</label>
            <select
              value={newStudentBatch}
              onChange={(e) => setNewStudentBatch(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden bg-white"
            >
              <option value="btc-jee-a1">Batch A1 - Morning Super 30 (JEE)</option>
              <option value="btc-jee-a2">Batch A2 - Evening Pinnacle (JEE)</option>
              <option value="btc-neet-b1">Batch B1 - Morning Doctors Squad (NEET)</option>
              <option value="btc-fnd-c1">Batch C1 - Weekend Foundation Champs</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddStudentModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700"
            >
              Create Student
            </button>
          </div>
        </form>
      </Modal>

      {/* QUICK ANNOUNCEMENT MODAL */}
      <Modal
        isOpen={showAnnouncementModal}
        onClose={() => setShowAnnouncementModal(false)}
        title="Publish Official Notice"
        description="Notices are broadcasted across student and teacher portal notice boards."
      >
        {announcementSuccessMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            {announcementSuccessMsg}
          </div>
        )}
        <form onSubmit={handlePostAnnouncement} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Notice Title *</label>
            <input
              type="text"
              required
              value={announcementTitle}
              onChange={(e) => setAnnouncementTitle(e.target.value)}
              placeholder="e.g. Schedule for All India Grand Test #7"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Notice Details *</label>
            <textarea
              required
              rows={4}
              value={announcementContent}
              onChange={(e) => setAnnouncementContent(e.target.value)}
              placeholder="Enter announcement instructions..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
            <select
              value={announcementPriority}
              onChange={(e) => setAnnouncementPriority(e.target.value as any)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden bg-white"
            >
              <option value="normal">Normal</option>
              <option value="important">Important</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAnnouncementModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
            >
              Publish Notice
            </button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}
