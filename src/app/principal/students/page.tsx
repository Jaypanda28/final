'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  PlusCircle,
  MoreVertical,
  CheckCircle2,
  Trash2,
  Edit,
  Mail,
  Phone,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Student, UserProfile } from '@/types';

export default function PrincipalStudentsPage() {
  const [user] = useState<UserProfile>({
    id: 'usr-prn-01',
    name: 'Dr. Rajeshwar Sharma',
    email: 'principal@pinnakeedge.edu',
    role: 'principal',
    instituteId: 'SPE-PRN-01',
    status: 'active',
    createdAt: '',
  });

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [batchFilter, setBatchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guardianName: '',
    guardianPhone: '',
    courseId: 'crs-jee-adv',
    courseName: 'JEE Advanced Pinnacle (2-Year Integrated)',
    batchId: 'btc-jee-a1',
    batchName: 'Batch A1 - Morning Super 30 (JEE)',
    category: 'General',
    rollNumber: '',
  });
  const [statusMessage, setStatusMessage] = useState('');

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (batchFilter !== 'all') params.set('batchId', batchFilter);
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const res = await fetch(`/api/students?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setStudents(data.students);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [batchFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage(`Enrolled ${data.student.name} as ${data.student.studentId}`);
        fetchStudents();
        setTimeout(() => {
          setStatusMessage('');
          setShowAddModal(false);
          setFormData({
            name: '',
            email: '',
            phone: '',
            guardianName: '',
            guardianPhone: '',
            courseId: 'crs-jee-adv',
            courseName: 'JEE Advanced Pinnacle (2-Year Integrated)',
            batchId: 'btc-jee-a1',
            batchName: 'Batch A1 - Morning Super 30 (JEE)',
            category: 'General',
            rollNumber: '',
          });
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeactivate = async (studentId: string, studentName: string) => {
    if (!confirm(`Are you sure you want to deactivate student ${studentName}? Historical records will be archived.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/students/${studentId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchStudents();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Student ID', 'Name', 'Roll Number', 'Email', 'Phone', 'Batch', 'Status', 'Admission Date'];
    const rows = students.map((s) => [
      s.studentId,
      s.name,
      s.rollNumber || '',
      s.email,
      s.phone,
      s.batchName || '',
      s.status,
      s.admissionDate,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Shri_PinnakeEdge_Students_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardShell
      user={user}
      title="Student Directory & Admissions"
      subtitle={`Total registered students: ${students.length} record(s)`}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            Add Student
          </button>
        </div>
      }
    >
      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student by name, ID, or roll number..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white"
          >
            <option value="all">All Batches</option>
            <option value="btc-jee-a1">Batch A1 (Morning Super 30)</option>
            <option value="btc-jee-a2">Batch A2 (Evening Pinnacle)</option>
            <option value="btc-neet-b1">Batch B1 (Doctors Squad)</option>
            <option value="btc-fnd-c1">Batch C1 (Foundation Champs)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive / Suspended</option>
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Student ID & Name</th>
                <th className="py-3.5 px-4">Batch & Course</th>
                <th className="py-3.5 px-4">Roll Number</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Guardian</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    Loading student records from database...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500">
                    No students match the selected search or filter criteria.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-bold text-slate-900 block">{student.name}</span>
                        <span className="font-mono text-[10px] text-orange-600 font-semibold block">
                          {student.studentId}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block text-[11px]">
                        {student.batchName ? student.batchName.split(' - ')[0] : 'Batch'}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate max-w-xs">
                        {student.courseName}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-slate-700 font-semibold text-[11px]">
                        {student.rollNumber || '—'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{student.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[140px]">{student.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      <span className="font-medium text-slate-800 block text-[11px]">{student.guardianName}</span>
                      <span className="text-[10px] text-slate-400 block">{student.guardianPhone}</span>
                    </td>

                    <td className="py-3 px-4">
                      <StatusBadge status={student.status} />
                    </td>

                    <td className="py-3 px-4 text-right">
                      {student.status === 'active' ? (
                        <button
                          onClick={() => handleDeactivate(student.id, student.name)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">Archived</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD STUDENT MODAL */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Admit Student & Register Profile"
        description="Persists directly to the database and issues an official institutional ID."
        maxWidth="xl"
      >
        {statusMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{statusMessage}</span>
          </div>
        )}

        <form onSubmit={handleCreateStudent} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Diya Sengupta"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Roll Number</label>
              <input
                type="text"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                placeholder="e.g. JEE-26-045"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="diya@example.com"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone *</label>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Guardian Name *</label>
              <input
                type="text"
                required
                value={formData.guardianName}
                onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                placeholder="Father / Mother Name"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Guardian Phone *</label>
              <input
                type="tel"
                required
                value={formData.guardianPhone}
                onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                placeholder="+91 97..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Enrolled Course *</label>
              <select
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden bg-white"
              >
                <option value="crs-jee-adv">JEE Advanced Pinnacle (2-Year)</option>
                <option value="crs-neet-ug">NEET-UG Edge Medical Elite</option>
                <option value="crs-foundation-10">Class 10 Foundation & Olympiad</option>
                <option value="crs-jee-crash">JEE Crash Course 90-Day</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Batch *</label>
              <select
                value={formData.batchId}
                onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden bg-white"
              >
                <option value="btc-jee-a1">Batch A1 - Morning Super 30</option>
                <option value="btc-jee-a2">Batch A2 - Evening Pinnacle</option>
                <option value="btc-neet-b1">Batch B1 - Morning Doctors Squad</option>
                <option value="btc-fnd-c1">Batch C1 - Weekend Foundation Champs</option>
              </select>
            </div>
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
              Admit Student
            </button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}
