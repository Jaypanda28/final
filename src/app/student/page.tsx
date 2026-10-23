'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  BookOpen,
  FileText,
  FileCheck2,
  Clock,
  Layers,
  Award,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Megaphone,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusBadge } from '@/components/ui/Badge';
import { AttendanceRecord, TimetableSession, UserProfile } from '@/types';
import { calculateAttendancePercentage } from '@/lib/calculations';

export default function StudentDashboardPage() {
  const [user, setUser] = useState<UserProfile>({
    id: 'usr-stu-01',
    name: 'Enrolled Student',
    email: 'student.aarav@pinnakeedge.edu',
    role: 'student',
    instituteId: 'SPE-STU-2026-001',
    status: 'active',
    createdAt: '',
  });

  const [studentDetails, setStudentDetails] = useState<any>(null);
  const [timetable, setTimetable] = useState<TimetableSession[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [recentResult, setRecentResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
          setStudentDetails(data.user);
          const batch = data.user.batchId || 'btc-jee-a1';
          const sId = data.user.id || data.user.studentId || 'stu-001';

          Promise.all([
            fetch(`/api/timetable?batchId=${batch}`).then((r) => r.json()),
            fetch(`/api/attendance?studentId=${sId}`).then((r) => r.json()),
            fetch(`/api/results?studentId=${sId}`).then((r) => r.json()),
          ]).then(([ttData, attData, resData]) => {
            if (ttData?.success && ttData.sessions) setTimetable(ttData.sessions.slice(0, 3));
            if (attData?.success && attData.records) setAttendance(attData.records);
            if (resData?.success && resData.results && resData.results.length > 0) {
              setRecentResult(resData.results[0]);
            }
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  const attCalc = calculateAttendancePercentage(attendance);

  return (
    <DashboardShell
      user={user}
      title="Student Learning Workspace"
      subtitle={`${studentDetails?.courseName || 'JEE Advanced Pinnacle'} • ${studentDetails?.batchName || 'Batch A1'} • ID: ${user.instituteId || user.id}`}
      actions={
        <Link
          href="/student/examinations"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-orange-500 text-white shadow-md shadow-orange-500/20"
        >
          <FileCheck2 className="w-4 h-4" />
          Take Online Test
        </Link>
      }
    >
      {/* 1. TOP METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <MetricCard
          title="Attendance Discipline"
          value={`${attCalc.percentage}%`}
          subtitle={`${attCalc.presentCount} of ${attCalc.totalSessions} sessions attended`}
          trend={attCalc.isLowAttendance ? 'Warning: Low' : 'Exemplary'}
          trendType={attCalc.isLowAttendance ? 'negative' : 'positive'}
          icon={CalendarCheck}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />

        <MetricCard
          title="Pending Assignments"
          value={1}
          subtitle="Rotational Motion Problem Set #7"
          trend="Due in 7 days"
          trendType="neutral"
          icon={FileText}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
        />

        <MetricCard
          title="Latest Test Standing"
          value="Rank #1"
          subtitle="Grand Test #6 (20/20 Marks)"
          trend="100% (99.8 %ile)"
          trendType="positive"
          icon={Award}
          iconBgColor="bg-orange-500/10"
          iconColor="text-orange-600"
        />

        <MetricCard
          title="Fee Installment"
          value="Term 1 Settled"
          subtitle="Installment 2 due 15-Nov-2026"
          trend="Receipt Active"
          trendType="positive"
          icon={CreditCard}
          iconBgColor="bg-amber-500/10"
          iconColor="text-amber-600"
        />
      </div>

      {/* 2. MAIN WORKSPACE STRIP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Today's Timetable */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Today&apos;s Class Schedule</h3>
              <p className="text-xs text-slate-500">Live lecture timings and faculty details</p>
            </div>
            <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
              Ramanujan Hall
            </span>
          </div>

          <div className="space-y-3">
            {timetable.map((tt) => (
              <div
                key={tt.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {tt.startTime}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{tt.subjectName}</h4>
                    <p className="text-[11px] text-slate-500">{tt.teacherName}</p>
                    <span className="text-[10px] text-orange-600 font-medium">{tt.roomOrLink}</span>
                  </div>
                </div>

                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Scheduled
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Learning Shortcuts */}
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-orange-400">
            Student Quick Actions
          </h3>

          <Link
            href="/student/examinations"
            className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 hover:border-orange-500/40 block transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white group-hover:text-orange-300">
                1. Take Grand Test #6
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-400" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Physics Mechanics & Calculus CBT mock exam with countdown timer.
            </p>
          </Link>

          <Link
            href="/student/materials"
            className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 hover:border-orange-500/40 block transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white group-hover:text-orange-300">
                2. Download Handbooks & Notes
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-400" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Rotational Motion & Definite Integrals solved sheets.
            </p>
          </Link>

          <Link
            href="/student/assignments"
            className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 hover:border-orange-500/40 block transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white group-hover:text-orange-300">
                3. Submit Homework & View Grades
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-400" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Upload problem set responses and inspect faculty remarks.
            </p>
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
