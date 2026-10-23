'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, Phone, Mail } from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatusBadge } from '@/components/ui/Badge';
import { Student, UserProfile } from '@/types';

export default function TeacherStudentsPage() {
  const [user] = useState<UserProfile>({
    id: 'usr-tch-01',
    name: 'Prof. Ananya Sen',
    email: 'teacher.sharma@pinnakeedge.edu',
    role: 'teacher',
    instituteId: 'SPE-TCH-001',
    status: 'active',
    createdAt: '',
  });

  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/students?batchId=btc-jee-a1')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setStudents(data.students);
      });
  }, []);

  const filtered = search
    ? students.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.studentId.toLowerCase().includes(search.toLowerCase()) ||
          (s.rollNumber && s.rollNumber.toLowerCase().includes(search.toLowerCase()))
      )
    : students;

  return (
    <DashboardShell
      user={user}
      title="Batch Students Directory"
      subtitle="Students enrolled in Batch A1 (Morning Super 30 JEE) and Batch B1 (NEET Doctors)"
    >
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-xs flex items-center justify-between">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students in assigned batches..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Student ID & Name</th>
                <th className="py-3.5 px-4">Roll Number</th>
                <th className="py-3.5 px-4">Batch</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{s.name}</span>
                    <span className="font-mono text-[10px] text-orange-600 block">{s.studentId}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                    {s.rollNumber || '—'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{s.batchName?.split(' - ')[0]}</td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">{s.phone}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={s.status} />
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
