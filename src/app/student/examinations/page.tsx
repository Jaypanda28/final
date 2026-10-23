'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  Clock,
  Award,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatusBadge } from '@/components/ui/Badge';
import { Examination, UserProfile } from '@/types';

export default function StudentExaminationsPage() {
  const [user, setUser] = useState<UserProfile>({
    id: 'usr-stu-01',
    name: 'Enrolled Student',
    email: 'student.aarav@pinnakeedge.edu',
    role: 'student',
    instituteId: 'SPE-STU-2026-001',
    status: 'active',
    createdAt: '',
  });

  const [examinations, setExaminations] = useState<Examination[]>([]);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
          const batch = data.user.batchId || 'btc-jee-a1';
          fetch(`/api/examinations?batchId=${batch}`)
            .then((r) => r.json())
            .then((exmData) => {
              if (exmData?.success && exmData.examinations) setExaminations(exmData.examinations);
            });
        } else {
          fetch('/api/examinations')
            .then((r) => r.json())
            .then((exmData) => {
              if (exmData?.success && exmData.examinations) setExaminations(exmData.examinations);
            });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <DashboardShell
      user={user}
      title="National Test Series & Mock Examinations"
      subtitle="Computer-Based Test (CBT) portal for weekly grand tests and speed booster quizzes."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {examinations.map((exam) => (
          <div
            key={exam.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                  {exam.subjectName}
                </span>
                <StatusBadge status={exam.status} />
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">{exam.title}</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">{exam.instructions}</p>

              <div className="grid grid-cols-3 gap-3 my-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Duration</span>
                  <span className="font-bold text-slate-800">{exam.durationMinutes} mins</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Max Marks</span>
                  <span className="font-bold text-slate-800">{exam.totalMarks}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Pass Marks</span>
                  <span className="font-bold text-slate-800">{exam.passingMarks}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500">
                Negative Marking: {exam.negativeMarkingEnabled ? 'Active (-1 for wrong answer)' : 'None'}
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Computer-Based Online Exam</span>
              <Link
                href={`/student/examinations/${exam.id}/take`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-xs transition-all"
              >
                Start Examination
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
