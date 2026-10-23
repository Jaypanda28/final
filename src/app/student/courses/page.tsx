'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Calendar, CheckCircle2, User } from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { TimetableSession, UserProfile } from '@/types';

export default function StudentCoursesPage() {
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

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
          setStudentDetails(data.user);
          const batch = data.user.batchId || 'btc-jee-a1';
          fetch(`/api/timetable?batchId=${batch}`)
            .then((r) => r.json())
            .then((ttData) => {
              if (ttData?.success && ttData.sessions) setTimetable(ttData.sessions);
            });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <DashboardShell
      user={user}
      title="Enrolled Program & Lecture Timetable"
      subtitle={`${studentDetails?.courseName || 'JEE Advanced Pinnacle (2-Year Integrated)'} • ${studentDetails?.batchName || 'Batch A1'}`}
    >
      {/* Course Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200">
              JEE-ADV-2YR &bull; Academic Session 2026-2027
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-3">
              JEE Advanced Pinnacle (2-Year Integrated)
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Comprehensive 2-year preparation for IIT-JEE Advanced covering Mechanics, Electrodynamics, Inorganic & Organic Reaction Mechanisms, and Advanced Coordinate Geometry & Calculus.
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs font-bold text-slate-400 block uppercase">Enrolled Batch</span>
            <span className="text-base font-extrabold text-slate-900 block mt-0.5">
              Batch A1 (Morning Super 30)
            </span>
            <span className="text-xs text-orange-600 font-semibold block mt-0.5">Room 201 - Ramanujan Hall</span>
          </div>
        </div>

        {/* Core Subjects */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-bold text-orange-700 block">Physics (JEE-ADV)</span>
            <span className="text-xs text-slate-500 mt-1 block">Faculty: Prof. Ananya Sen (M.Tech IIT)</span>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span>Syllabus Covered</span>
              <span className="font-bold text-slate-700">68%</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-bold text-orange-700 block">Chemistry (Physical & Organic)</span>
            <span className="text-xs text-slate-500 mt-1 block">Faculty: Dr. Vivek Bhattacharya (Ph.D)</span>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span>Syllabus Covered</span>
              <span className="font-bold text-slate-700">72%</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-bold text-orange-700 block">Mathematics (Calculus & Algebra)</span>
            <span className="text-xs text-slate-500 mt-1 block">Faculty: Er. Ramanujam Iyer (B.Tech IITM)</span>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span>Syllabus Covered</span>
              <span className="font-bold text-slate-700">65%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timetable Schedule Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-600" />
          Weekly Class & Lecture Timetable
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Day</th>
                <th className="py-3 px-4">Time Slot</th>
                <th className="py-3 px-4">Subject & Module</th>
                <th className="py-3 px-4">Faculty</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {timetable.map((tt) => (
                <tr key={tt.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{tt.dayOfWeek}</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-orange-700">
                    {tt.startTime} - {tt.endTime}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{tt.subjectName}</td>
                  <td className="py-3.5 px-4 text-slate-600">{tt.teacherName}</td>
                  <td className="py-3.5 px-4 text-slate-500">{tt.roomOrLink}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Regular
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
