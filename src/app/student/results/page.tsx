'use client';

import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, Trophy, Clock } from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatusBadge } from '@/components/ui/Badge';
import { ExaminationResult, UserProfile } from '@/types';

export default function StudentResultsPage() {
  const [user, setUser] = useState<UserProfile>({
    id: 'usr-stu-01',
    name: 'Enrolled Student',
    email: 'student.aarav@pinnakeedge.edu',
    role: 'student',
    instituteId: 'SPE-STU-2026-001',
    status: 'active',
    createdAt: '',
  });

  const [results, setResults] = useState<ExaminationResult[]>([]);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
          const sId = data.user.id || data.user.studentId || 'stu-001';
          fetch(`/api/results?studentId=${sId}`)
            .then((r) => r.json())
            .then((resData) => {
              if (resData?.success && resData.results) setResults(resData.results);
            });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <DashboardShell
      user={user}
      title="Examination Scorecards & Merit Standing"
      subtitle="Official published results, percentile rank standing, and question-level performance feedback."
    >
      <div className="space-y-6 max-w-4xl">
        {results.map((res) => (
          <div
            key={res.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                  {res.subjectName}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">{res.examinationTitle}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-600" />
                  Institute Rank #{res.rank}
                </span>
                <StatusBadge status={res.isPassed ? 'passed' : 'failed'} />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs mb-6">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Score</span>
                <span className="text-xl font-black text-orange-700 block mt-0.5">
                  {res.marksObtained} / {res.totalMarks}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Percentage</span>
                <span className="text-xl font-black text-slate-900 block mt-0.5">{res.percentage}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Percentile</span>
                <span className="text-xl font-black text-emerald-600 block mt-0.5">{res.percentile}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Date</span>
                <span className="text-sm font-semibold text-slate-700 block mt-1">{res.publishedDate}</span>
              </div>
            </div>

            {res.feedback && (
              <div className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-100 text-xs text-orange-950">
                <span className="font-bold block mb-0.5">Faculty Evaluation Remark:</span>
                <p>{res.feedback}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
