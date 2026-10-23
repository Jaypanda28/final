'use client';

import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  Clock,
  Award,
  Users,
  Search,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatusBadge } from '@/components/ui/Badge';
import { Examination, UserProfile } from '@/types';

export default function PrincipalExaminationsPage() {
  const [user] = useState<UserProfile>({
    id: 'usr-prn-01',
    name: 'Dr. Rajeshwar Sharma',
    email: 'principal@pinnakeedge.edu',
    role: 'principal',
    instituteId: 'SPE-PRN-01',
    status: 'active',
    createdAt: '',
  });

  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');

  const fetchExams = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/examinations');
      const data = await res.json();
      if (data.success) {
        setExaminations(data.examinations);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleAuthorizeResults = async (examId: string, title: string) => {
    try {
      const res = await fetch(`/api/examinations/${examId}/publish`, {
        method: 'POST',
      });
      if (res.ok) {
        setStatusMsg(`Official results published for ${title}. Scorecards are now accessible to students.`);
        fetchExams();
        setTimeout(() => setStatusMsg(''), 4000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DashboardShell
      user={user}
      title="Examinations & Test Series Governance"
      subtitle="Oversee national mock test series, review attempts, and authorize official publication of student scorecards."
    >
      {statusMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {examinations.map((exam) => (
          <div
            key={exam.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                  {exam.subjectName}
                </span>
                <StatusBadge status={exam.status} />
              </div>

              <h3 className="text-lg font-bold text-slate-900 leading-snug">{exam.title}</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">{exam.instructions}</p>

              <div className="grid grid-cols-3 gap-3 my-5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Duration</span>
                  <span className="text-xs font-bold text-slate-800">{exam.durationMinutes} mins</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Marks</span>
                  <span className="text-xs font-bold text-slate-800">{exam.totalMarks}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Questions</span>
                  <span className="text-xs font-bold text-slate-800">{exam.totalQuestions} Questions</span>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <p>
                  <span className="font-semibold text-slate-700">Target Batch:</span> {exam.batchName}
                </p>
                <p>
                  <span className="font-semibold text-slate-700">Negative Marking:</span>{' '}
                  {exam.negativeMarkingEnabled ? 'Enabled (-1 mark)' : 'Disabled'}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              {exam.resultsPublished ? (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Scorecards Released to Students
                </div>
              ) : (
                <button
                  onClick={() => handleAuthorizeResults(exam.id, exam.title)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-xs transition-all"
                >
                  Authorize & Publish Results
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
