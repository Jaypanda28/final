'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  AlertTriangle,
  CheckCircle2,
  Users,
  Search,
  Filter,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatusBadge } from '@/components/ui/Badge';
import { MetricCard } from '@/components/ui/MetricCard';
import { AttendanceRecord, Batch, Student, UserProfile } from '@/types';
import { calculateAttendancePercentage } from '@/lib/calculations';

export default function PrincipalAttendancePage() {
  const [user] = useState<UserProfile>({
    id: 'usr-prn-01',
    name: 'Dr. Rajeshwar Sharma',
    email: 'principal@pinnakeedge.edu',
    role: 'principal',
    instituteId: 'SPE-PRN-01',
    status: 'active',
    createdAt: '',
  });

  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState('btc-jee-a1');
  const [selectedDate, setSelectedDate] = useState('2026-10-18');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [batchStudents, setBatchStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/batches')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.batches.length > 0) {
          setBatches(data.batches);
        }
      });
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const [attRes, stuRes] = await Promise.all([
        fetch(`/api/attendance?batchId=${selectedBatch}&date=${selectedDate}`),
        fetch(`/api/students?batchId=${selectedBatch}`),
      ]);
      const attData = await attRes.json();
      const stuData = await stuRes.json();
      if (attData.success) setAttendanceRecords(attData.records);
      if (stuData.success) setBatchStudents(stuData.students);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBatch && selectedDate) {
      fetchAttendance();
    }
  }, [selectedBatch, selectedDate]);

  const stats = calculateAttendancePercentage(attendanceRecords);

  return (
    <DashboardShell
      user={user}
      title="Attendance Oversight & Analytics"
      subtitle="Monitor daily attendance records, session logs, and low-attendance indicators."
    >
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <MetricCard
          title="Batch Present Rate"
          value={`${stats.percentage}%`}
          subtitle={`${stats.presentCount} of ${stats.totalSessions || batchStudents.length} present`}
          trend={stats.isLowAttendance ? 'Low Attendance' : 'Compliant'}
          trendType={stats.isLowAttendance ? 'negative' : 'positive'}
          icon={CalendarCheck}
          iconBgColor={stats.isLowAttendance ? 'bg-rose-50' : 'bg-emerald-50'}
          iconColor={stats.isLowAttendance ? 'text-rose-600' : 'text-emerald-600'}
        />

        <MetricCard
          title="Present Count"
          value={stats.presentCount}
          subtitle="Students in class"
          icon={CheckCircle2}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />

        <MetricCard
          title="Absent Count"
          value={stats.absentCount}
          subtitle="Unexcused absences"
          icon={AlertTriangle}
          iconBgColor="bg-rose-50"
          iconColor="text-rose-600"
        />

        <MetricCard
          title="Late / Leave Count"
          value={stats.lateCount + stats.leaveCount}
          subtitle={`${stats.lateCount} Late | ${stats.leaveCount} Leave`}
          icon={Users}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      {/* Batch & Date Picker Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Select Batch
            </label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Attendance Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white"
            >
            </input>
          </div>
        </div>

        {stats.isLowAttendance && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Attendance below 75% threshold! Automated guardian SMS queued.</span>
          </div>
        )}
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Student ID & Name</th>
                <th className="py-3.5 px-4">Roll Number</th>
                <th className="py-3.5 px-4">Recorded Status</th>
                <th className="py-3.5 px-4">Remarks / Explanation</th>
                <th className="py-3.5 px-4">Correction History</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {batchStudents.map((student) => {
                const rec = attendanceRecords.find((r) => r.studentId === student.id);
                const status = rec ? rec.status : 'present';

                return (
                  <tr key={student.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{student.name}</span>
                      <span className="font-mono text-[10px] text-orange-600 block">{student.studentId}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 font-semibold">
                      {student.rollNumber || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={status} />
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs">
                      {rec?.remarks || 'Routine batch lecture attendance'}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {rec?.isCorrected ? (
                        <span className="text-amber-600 font-medium">Modified by Faculty</span>
                      ) : (
                        'Original'
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
