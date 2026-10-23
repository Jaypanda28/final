'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  PlusCircle,
  Clock,
  CheckCircle2,
  Calendar,
  Award,
  Send,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Assignment, AssignmentSubmission, UserProfile } from '@/types';

export default function TeacherAssignmentsPage() {
  const [user] = useState<UserProfile>({
    id: 'usr-tch-01',
    name: 'Prof. Ananya Sen',
    email: 'teacher.sharma@pinnakeedge.edu',
    role: 'teacher',
    instituteId: 'SPE-TCH-001',
    status: 'active',
    createdAt: '',
  });

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);
  const [gradeMarks, setGradeMarks] = useState<number>(45);
  const [gradeFeedback, setGradeFeedback] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const [createForm, setCreateForm] = useState({
    title: '',
    instructions: '',
    batchId: 'btc-jee-a1',
    batchName: 'Batch A1 - Morning Super 30',
    maxMarks: 50,
    passingMarks: 25,
    deadlineDate: '2026-11-05T23:59:00Z',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/assignments');
      const data = await res.json();
      if (data.success) {
        setAssignments(data.assignments);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      });
      if (res.ok) {
        setStatusMsg('New assignment problem set published.');
        fetchData();
        setTimeout(() => {
          setStatusMsg('');
          setShowCreateModal(false);
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openGradeModal = (sub: AssignmentSubmission) => {
    setSelectedSubmission(sub);
    setGradeMarks(sub.marksObtained || 45);
    setGradeFeedback(sub.feedback || 'Great conceptual approach and steps.');
    setShowGradeModal(true);
  };

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    try {
      const res = await fetch(`/api/assignments/${selectedSubmission.id}/grade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: selectedSubmission.id,
          marks: Number(gradeMarks),
          feedback: gradeFeedback,
        }),
      });

      if (res.ok) {
        setStatusMsg('Submission evaluated and returned to student with feedback.');
        setTimeout(() => {
          setStatusMsg('');
          setShowGradeModal(false);
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DashboardShell
      user={user}
      title="Assignment Management & Evaluation"
      subtitle="Create problem sets, set deadlines, review uploaded student work, and award marks."
      actions={
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          Create Assignment
        </button>
      }
    >
      {/* Assignments List */}
      <div className="space-y-6 mb-12">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-orange-600" />
          Published Problem Sets ({assignments.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignments.map((asg) => (
            <div
              key={asg.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                    {asg.batchName}
                  </span>
                  <StatusBadge status={asg.status} />
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-2">{asg.title}</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{asg.instructions}</p>

                <div className="grid grid-cols-3 gap-3 my-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Max Marks</span>
                    <span className="font-bold text-slate-800">{asg.maxMarks}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Pass Marks</span>
                    <span className="font-bold text-slate-800">{asg.passingMarks}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Submissions</span>
                    <span className="font-bold text-emerald-600">
                      {asg.submissionsCount || 22} / 30
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Deadline: {new Date(asg.deadlineDate).toLocaleDateString('en-IN')} 23:59 IST</span>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {asg.gradedCount || 18} Graded
                </span>
                <button
                  onClick={() =>
                    openGradeModal({
                      id: 'sub-01',
                      assignmentId: asg.id,
                      assignmentTitle: asg.title,
                      studentId: 'stu-001',
                      studentName: 'Aarav Patel',
                      batchId: asg.batchId,
                      submissionDate: new Date().toISOString(),
                      fileUrl: '/submissions/work.pdf',
                      fileName: 'aarav_patel_work.pdf',
                      status: 'submitted',
                      marksObtained: 46,
                      feedback: 'Detailed free-body diagrams, excellent work!',
                    })
                  }
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
                >
                  Review Submissions
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE ASSIGNMENT MODAL */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Academic Assignment"
        description="Publish problem set instructions, deadlines, and maximum score."
      >
        {statusMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{statusMsg}</span>
          </div>
        )}

        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assignment Title *</label>
            <input
              type="text"
              required
              value={createForm.title}
              onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
              placeholder="e.g. Wave Optics Interference & Diffraction Sheet"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Batch</label>
              <select
                value={createForm.batchId}
                onChange={(e) => setCreateForm({ ...createForm, batchId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden bg-white"
              >
                <option value="btc-jee-a1">Batch A1 (Morning Super 30)</option>
                <option value="btc-neet-b1">Batch B1 (NEET Doctors)</option>
                <option value="btc-crash-d1">Batch D1 (Rank Booster)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Maximum Marks *</label>
              <input
                type="number"
                required
                value={createForm.maxMarks}
                onChange={(e) => setCreateForm({ ...createForm, maxMarks: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Instructions & Problem Notes *</label>
            <textarea
              required
              rows={4}
              value={createForm.instructions}
              onChange={(e) => setCreateForm({ ...createForm, instructions: e.target.value })}
              placeholder="Instructions for students regarding derivations, step marking, etc..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700"
            >
              Publish Assignment
            </button>
          </div>
        </form>
      </Modal>

      {/* GRADE SUBMISSION MODAL */}
      {selectedSubmission && (
        <Modal
          isOpen={showGradeModal}
          onClose={() => setShowGradeModal(false)}
          title="Grade Student Assignment"
          description={`Evaluating submission for: ${selectedSubmission.studentName}`}
        >
          {statusMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{statusMsg}</span>
            </div>
          )}

          <form onSubmit={handleGradeSubmit} className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <p><span className="font-semibold text-slate-700">Student:</span> {selectedSubmission.studentName}</p>
              <p><span className="font-semibold text-slate-700">Submitted File:</span> {selectedSubmission.fileName}</p>
              {selectedSubmission.studentNotes && (
                <p><span className="font-semibold text-slate-700">Student Notes:</span> {selectedSubmission.studentNotes}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Marks Awarded (out of 50) *</label>
              <input
                type="number"
                required
                min={0}
                max={50}
                value={gradeMarks}
                onChange={(e) => setGradeMarks(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Teacher Feedback & Remarks *</label>
              <textarea
                required
                rows={3}
                value={gradeFeedback}
                onChange={(e) => setGradeFeedback(e.target.value)}
                placeholder="Give constructive feedback on formulas, speed, or accuracy..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowGradeModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700"
              >
                Submit Grade & Return
              </button>
            </div>
          </form>
        </Modal>
      )}
    </DashboardShell>
  );
}
