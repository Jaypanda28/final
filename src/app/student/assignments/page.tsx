'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  Calendar,
  Award,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Assignment, AssignmentSubmission, UserProfile } from '@/types';

export default function StudentAssignmentsPage() {
  const [user, setUser] = useState<UserProfile>({
    id: 'usr-stu-01',
    name: 'Enrolled Student',
    email: 'student.aarav@pinnakeedge.edu',
    role: 'student',
    instituteId: 'SPE-STU-2026-001',
    status: 'active',
    createdAt: '',
  });

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  // Submit Modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedAsg, setSelectedAsg] = useState<Assignment | null>(null);
  const [studentNotes, setStudentNotes] = useState('');
  const [fileName, setFileName] = useState('student_assignment.pdf');
  const [statusMsg, setStatusMsg] = useState('');

  const fetchAssignments = async (batchId: string = 'btc-jee-a1') => {
    try {
      setLoading(true);
      const res = await fetch(`/api/assignments?batchId=${batchId}`);
      const data = await res.json();
      if (data?.success && data.assignments) setAssignments(data.assignments);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
          setFileName(`${data.user.name.toLowerCase().replace(/\s+/g, '_')}_assignment.pdf`);
          const batch = data.user.batchId || 'btc-jee-a1';
          fetchAssignments(batch);
        } else {
          fetchAssignments('btc-jee-a1');
        }
      })
      .catch(() => fetchAssignments('btc-jee-a1'));
  }, []);

  const openSubmitModal = (asg: Assignment) => {
    setSelectedAsg(asg);
    setStudentNotes('');
    setShowSubmitModal(true);
  };

  const handleSubmitWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsg) return;

    try {
      const res = await fetch(`/api/assignments/${selectedAsg.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentTitle: selectedAsg.title,
          studentId: user.id || user.instituteId || 'stu-001',
          studentName: user.name || 'Student',
          batchId: selectedAsg.batchId,
          fileName,
          studentNotes,
        }),
      });

      if (res.ok) {
        setStatusMsg('Assignment solution uploaded and submitted for faculty review.');
        fetchAssignments(user.instituteId ? (user as any).batchId || 'btc-jee-a1' : 'btc-jee-a1');
        setTimeout(() => {
          setStatusMsg('');
          setShowSubmitModal(false);
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DashboardShell
      user={user}
      title="Academic Assignments & Problem Sets"
      subtitle="Download question worksheets, submit step-by-step solutions, and inspect faculty feedback."
    >
      <div className="space-y-6 max-w-4xl">
        {assignments.map((asg) => (
          <div
            key={asg.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                  {asg.subjectName}
                </span>
                <StatusBadge status={asg.id === 'asg-01' ? 'graded' : 'pending'} />
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-2">{asg.title}</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{asg.instructions}</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Max Marks</span>
                  <span className="font-bold text-slate-800">{asg.maxMarks}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Faculty</span>
                  <span className="font-semibold text-slate-800">{asg.teacherName}</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Deadline</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(asg.deadlineDate).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>

              {asg.id === 'asg-01' && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-emerald-800">Evaluated Score: 46 / 50</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">
                      Graded
                    </span>
                  </div>
                  <p className="text-emerald-900 mt-0.5">
                    &quot;Excellent rigor in FBDs! Question 8 approach was neat and concise. Great work Aarav.&quot;
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">PDF Format Supported</span>
              <button
                onClick={() => openSubmitModal(asg)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-xs transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                {asg.id === 'asg-01' ? 'Resubmit Solution' : 'Submit Homework'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SUBMIT WORK MODAL */}
      {selectedAsg && (
        <Modal
          isOpen={showSubmitModal}
          onClose={() => setShowSubmitModal(false)}
          title="Submit Assignment Solution"
          description={`Submitting to: ${selectedAsg.title}`}
        >
          {statusMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{statusMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmitWork} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Upload PDF Solution File *
              </label>
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files?.[0]) setFileName(e.target.files[0].name);
                }}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Notes for Instructor (Optional)
              </label>
              <textarea
                rows={3}
                value={studentNotes}
                onChange={(e) => setStudentNotes(e.target.value)}
                placeholder="Mention any specific problem or step you need doubt clarification on..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700"
              >
                Upload & Submit
              </button>
            </div>
          </form>
        </Modal>
      )}
    </DashboardShell>
  );
}
