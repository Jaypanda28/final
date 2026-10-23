'use client';

import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  PlusCircle,
  Search,
  BookOpen,
  Mail,
  Phone,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Teacher, UserProfile } from '@/types';

export default function PrincipalTeachersPage() {
  const [user] = useState<UserProfile>({
    id: 'usr-prn-01',
    name: 'Dr. Rajeshwar Sharma',
    email: 'principal@pinnakeedge.edu',
    role: 'principal',
    instituteId: 'SPE-PRN-01',
    status: 'active',
    createdAt: '',
  });

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    qualification: '',
    joiningDate: '2026-10-18',
  });

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const url = search ? `/api/teachers?search=${encodeURIComponent(search)}` : '/api/teachers';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setTeachers(data.teachers);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTeachers();
  };

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg(`Appointed faculty ${data.teacher.name} (${data.teacher.teacherId})`);
        fetchTeachers();
        setTimeout(() => {
          setStatusMsg('');
          setShowAddModal(false);
          setFormData({
            name: '',
            email: '',
            phone: '',
            specialization: '',
            qualification: '',
            joiningDate: '2026-10-18',
          });
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DashboardShell
      user={user}
      title="Faculty & Teaching Staff"
      subtitle={`Total appointed faculty: ${teachers.length} members`}
      actions={
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          Appoint Faculty
        </button>
      }
    >
      {/* Search Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-xs flex items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by faculty name, subject, or ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
          />
        </form>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                    {teacher.teacherId}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-2">{teacher.name}</h3>
                  <p className="text-xs font-semibold text-orange-700">{teacher.specialization}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{teacher.qualification}</p>
                </div>
                <StatusBadge status={teacher.status} />
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[11px] truncate">{teacher.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[11px]">{teacher.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[11px]">Joined: {teacher.joiningDate}</span>
                </div>
              </div>

              {teacher.assignedBatchNames && teacher.assignedBatchNames.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Assigned Batches
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {teacher.assignedBatchNames.map((bn, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium"
                      >
                        {bn}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* APPOINT TEACHER MODAL */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Appoint Faculty Member"
        description="Creates official faculty credentials and issues an institutional Teacher ID."
      >
        {statusMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{statusMsg}</span>
          </div>
        )}

        <form onSubmit={handleCreateTeacher} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Faculty Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Dr. Rameshwar Verma"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="faculty@pinnakeedge.edu"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Teaching Specialization *</label>
            <input
              type="text"
              required
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              placeholder="e.g. Physical Chemistry & Thermodynamics"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Qualifications & Experience</label>
            <input
              type="text"
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              placeholder="e.g. Ph.D IIT Delhi, 10+ Yrs Exp"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700"
            >
              Appoint Faculty
            </button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}
