'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Users,
  AlertCircle,
  Save,
  Check,
  X,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatusBadge } from '@/components/ui/Badge';
import { AttendanceStatus, Batch, Student, UserProfile } from '@/types';

export default function TeacherAttendancePage() {
  const [user] = useState<UserProfile>({
    id: 'usr-tch-01',
    name: 'Prof. Ananya Sen',
    email: 'teacher.sharma@pinnakeedge.edu',
    role: 'teacher',
    instituteId: 'SPE-TCH-001',
    status: 'active',
    createdAt: '',
  });

  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState('btc-jee-a1');
  const [selectedDate, setSelectedDate] = useState('2026-10-18');
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceState, setAttendanceState] = useState<Record<string, { status: AttendanceStatus; remarks: string }>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch batches assigned to teacher
  useEffect(() => {
    fetch('/api/batches')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setBatches(data.batches);
        }
      });
  }, []);

  // Fetch enrolled students for selected batch and existing attendance for date
  useEffect(() => {
    if (!selectedBatch) return;

    Promise.all([
      fetch(`/api/students?batchId=${selectedBatch}`).then((r) => r.json()),
      fetch(`/api/attendance?batchId=${selectedBatch}&date=${selectedDate}`).then((r) => r.json()),
    ]).then(([stuData, attData]) => {
      if (stuData.success) {
        setStudents(stuData.students);

        // Prepopulate attendance state from existing records if any, or default to 'present'
        const initialMap: Record<string, { status: AttendanceStatus; remarks: string }> = {};
        stuData.students.forEach((s: Student) => {
          const existing = attData.records?.find((r: any) => r.studentId === s.id);
          initialMap[s.id] = {
            status: existing ? existing.status : 'present',
            remarks: existing?.remarks || '',
          };
        });
        setAttendanceState(initialMap);
      }
    });
  }, [selectedBatch, selectedDate]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    setAttendanceState((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((id) => {
        updated[id] = { ...updated[id], status };
      });
      return updated;
    });
  };

  const handleSubmitAttendance = async () => {
    setSubmitting(true);
    setSuccessMsg('');
    try {
      const recordsToSubmit = Object.entries(attendanceState).map(([studentId, data]) => ({
        studentId,
        status: data.status,
        remarks: data.remarks,
      }));

      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchId: selectedBatch,
          date: selectedDate,
          records: recordsToSubmit,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(`Attendance successfully saved to PostgreSQL for ${data.savedCount} student(s)!`);
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const total = students.length;
  const presentCount = Object.values(attendanceState).filter((s) => s.status === 'present').length;
  const absentCount = Object.values(attendanceState).filter((s) => s.status === 'absent').length;
  const lateCount = Object.values(attendanceState).filter((s) => s.status === 'late').length;
  const leaveCount = Object.values(attendanceState).filter((s) => s.status === 'leave').length;

  return (
    <DashboardShell
      user={user}
      title="Daily Batch Attendance Marking"
      subtitle="Select assigned batch, mark student attendance, enter authorized remarks, and persist to database."
    >
      {/* Batch & Date Selection Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Assigned Batch
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
              Lecture Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white"
            />
          </div>
        </div>

        {/* Quick Bulk Actions */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-1">Quick Set:</span>
          <button
            onClick={() => handleMarkAll('present')}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
          >
            All Present
          </button>
          <button
            onClick={() => handleMarkAll('absent')}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
          >
            All Absent
          </button>
        </div>
      </div>

      {/* Real-time Tally Strip */}
      <div className="grid grid-cols-4 gap-4 mb-6 text-center">
        <div className="bg-white p-3 rounded-xl border border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Enrolled</span>
          <span className="text-xl font-bold text-slate-900">{total}</span>
        </div>
        <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
          <span className="text-[10px] uppercase font-bold text-emerald-600 block">Present</span>
          <span className="text-xl font-bold text-emerald-700">{presentCount}</span>
        </div>
        <div className="bg-rose-50 p-3 rounded-xl border border-rose-200">
          <span className="text-[10px] uppercase font-bold text-rose-600 block">Absent</span>
          <span className="text-xl font-bold text-rose-700">{absentCount}</span>
        </div>
        <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
          <span className="text-[10px] uppercase font-bold text-amber-600 block">Late / Leave</span>
          <span className="text-xl font-bold text-amber-700">{lateCount + leaveCount}</span>
        </div>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Attendance Interactive Grid Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Student Name & Roll No</th>
                <th className="py-3 px-4 text-center">Attendance Status</th>
                <th className="py-3 px-4">Instructor Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => {
                const currentStatus = attendanceState[student.id]?.status || 'present';
                const currentRemarks = attendanceState[student.id]?.remarks || '';

                return (
                  <tr key={student.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{student.name}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-[10px] text-orange-600 font-semibold">
                          {student.studentId}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Roll: {student.rollNumber || '—'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'present')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            currentStatus === 'present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          Present
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'absent')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            currentStatus === 'absent'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                          }`}
                        >
                          Absent
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'late')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            currentStatus === 'late'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                          }`}
                        >
                          Late
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'leave')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            currentStatus === 'leave'
                              ? 'bg-sky-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-700'
                          }`}
                        >
                          Leave
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={currentRemarks}
                        onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                        placeholder="Optional remarks (e.g. sick leave, late by 10m)..."
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 focus:ring-1 focus:ring-orange-500 focus:outline-hidden"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating or Bottom Save Bar */}
      <div className="sticky bottom-4 z-20 bg-slate-900 text-white p-4 rounded-2xl shadow-xl border border-slate-800 flex items-center justify-between">
        <div className="text-xs">
          <span className="text-slate-400">Marking Batch: </span>
          <span className="font-bold text-white">Batch A1 ({selectedDate})</span>
        </div>
        <button
          onClick={handleSubmitAttendance}
          disabled={submitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-md transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {submitting ? 'Persisting to Database...' : 'Save & Submit Attendance'}
        </button>
      </div>
    </DashboardShell>
  );
}
