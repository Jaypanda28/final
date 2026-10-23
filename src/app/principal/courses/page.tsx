'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  PlusCircle,
  Users,
  Calendar,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/ui/Badge';
import { Course, Batch, UserProfile } from '@/types';
import { formatINR } from '@/lib/calculations';

export default function PrincipalCoursesPage() {
  const [user] = useState<UserProfile>({
    id: 'usr-prn-01',
    name: 'Dr. Rajeshwar Sharma',
    email: 'principal@pinnakeedge.edu',
    role: 'principal',
    instituteId: 'SPE-PRN-01',
    status: 'active',
    createdAt: '',
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const [courseForm, setCourseForm] = useState({
    name: '',
    code: '',
    description: '',
    duration: '1 Year',
    feeAmount: 75000,
  });

  const [batchForm, setBatchForm] = useState({
    name: '',
    courseId: 'crs-jee-adv',
    courseName: 'JEE Advanced Pinnacle (2-Year Integrated)',
    capacity: 35,
    startDate: '2026-04-01',
    endDate: '2027-03-31',
    roomNumber: 'Room 203',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cRes, bRes] = await Promise.all([
        fetch('/api/courses'),
        fetch('/api/batches'),
      ]);
      const cData = await cRes.json();
      const bData = await bRes.json();
      if (cData.success) setCourses(cData.courses);
      if (bData.success) setBatches(bData.batches);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseForm),
      });
      if (res.ok) {
        setStatusMsg('Course created successfully.');
        fetchData();
        setTimeout(() => {
          setStatusMsg('');
          setShowCourseModal(false);
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedCourse = courses.find((c) => c.id === batchForm.courseId);
      const res = await fetch('/api/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...batchForm,
          courseName: selectedCourse?.name || 'Course',
        }),
      });
      if (res.ok) {
        setStatusMsg('Batch launched successfully.');
        fetchData();
        setTimeout(() => {
          setStatusMsg('');
          setShowBatchModal(false);
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DashboardShell
      user={user}
      title="Courses, Streams & Batches"
      subtitle="Configure academic programs, intake limits, fee structures, and batch assignments."
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBatchModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-orange-600" />
            Create Batch
          </button>
          <button
            onClick={() => setShowCourseModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-xs"
          >
            <BookOpen className="w-4 h-4" />
            Add Course
          </button>
        </div>
      }
    >
      {/* 1. COURSES GRID */}
      <div className="mb-10">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-orange-600" />
          Active Course Curricula ({courses.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                    {c.code}
                  </span>
                  <StatusBadge status={c.status} />
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-2">{c.name}</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{c.description}</p>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Duration</span>
                    <span className="font-semibold text-slate-800">{c.duration}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase">Tuition Fee</span>
                    <span className="font-extrabold text-orange-600">{formatINR(c.feeAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. BATCHES ROSTER */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-orange-600" />
          Active Batches & Intake ({batches.length})
        </h2>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Batch Name</th>
                  <th className="py-3 px-4">Associated Course</th>
                  <th className="py-3 px-4">Room / Hall</th>
                  <th className="py-3 px-4">Enrollment / Capacity</th>
                  <th className="py-3 px-4">Tenure</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {batches.map((b) => {
                  const percent = Math.round((b.enrolledCount / b.capacity) * 100);
                  return (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{b.name}</td>
                      <td className="py-3.5 px-4 text-slate-600 truncate max-w-xs">{b.courseName}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">{b.roomNumber || '—'}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">
                            {b.enrolledCount} / {b.capacity}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">({percent}%)</span>
                        </div>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              percent >= 90 ? 'bg-amber-500' : 'bg-orange-600'
                            }`}
                            style={{ width: `${Math.min(100, percent)}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {b.startDate} to {b.endDate}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={b.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CREATE COURSE MODAL */}
      <Modal
        isOpen={showCourseModal}
        onClose={() => setShowCourseModal(false)}
        title="Add Academic Course"
        description="Creates a new course program with prescribed fee structure."
      >
        {statusMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{statusMsg}</span>
          </div>
        )}
        <form onSubmit={handleCreateCourse} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Course Name *</label>
            <input
              type="text"
              required
              value={courseForm.name}
              onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
              placeholder="e.g. JEE Main Sprint 100-Day"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Course Code *</label>
              <input
                type="text"
                required
                value={courseForm.code}
                onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                placeholder="e.g. JEE-SPR-100"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Fee Amount (INR) *</label>
              <input
                type="number"
                required
                value={courseForm.feeAmount}
                onChange={(e) => setCourseForm({ ...courseForm, feeAmount: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Course Description</label>
            <textarea
              rows={3}
              value={courseForm.description}
              onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
              placeholder="Curriculum coverage and target exam..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCourseModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700"
            >
              Save Course
            </button>
          </div>
        </form>
      </Modal>

      {/* CREATE BATCH MODAL */}
      <Modal
        isOpen={showBatchModal}
        onClose={() => setShowBatchModal(false)}
        title="Launch New Batch"
        description="Creates an intake batch with room number and capacity."
      >
        {statusMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{statusMsg}</span>
          </div>
        )}
        <form onSubmit={handleCreateBatch} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Batch Name *</label>
            <input
              type="text"
              required
              value={batchForm.name}
              onChange={(e) => setBatchForm({ ...batchForm, name: e.target.value })}
              placeholder="e.g. Batch A3 - Weekend Rankers"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Program / Course *</label>
            <select
              value={batchForm.courseId}
              onChange={(e) => setBatchForm({ ...batchForm, courseId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden bg-white"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({formatINR(c.feeAmount)})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Capacity (Max Students) *</label>
              <input
                type="number"
                required
                value={batchForm.capacity}
                onChange={(e) => setBatchForm({ ...batchForm, capacity: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Classroom / Hall</label>
              <input
                type="text"
                value={batchForm.roomNumber}
                onChange={(e) => setBatchForm({ ...batchForm, roomNumber: e.target.value })}
                placeholder="Room 205"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowBatchModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700"
            >
              Create Batch
            </button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}
