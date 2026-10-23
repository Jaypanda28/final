'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Download, Search, FileText, CheckCircle2 } from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StudyMaterial, UserProfile } from '@/types';

export default function StudentMaterialsPage() {
  const [user, setUser] = useState<UserProfile>({
    id: 'usr-stu-01',
    name: 'Enrolled Student',
    email: 'student.aarav@pinnakeedge.edu',
    role: 'student',
    instituteId: 'SPE-STU-2026-001',
    status: 'active',
    createdAt: '',
  });

  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [search, setSearch] = useState('');
  const [downloadNotice, setDownloadNotice] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
          const batch = data.user.batchId || 'btc-jee-a1';
          fetch(`/api/materials?batchId=${batch}`)
            .then((r) => r.json())
            .then((matData) => {
              if (matData?.success && matData.materials) setMaterials(matData.materials);
            });
        }
      })
      .catch(() => {});
  }, []);

  const handleDownload = (fileName: string) => {
    setDownloadNotice(`Secure download initiated for: ${fileName}`);
    setTimeout(() => setDownloadNotice(''), 3000);
  };

  const filtered = search
    ? materials.filter(
        (m) =>
          m.title.toLowerCase().includes(search.toLowerCase()) ||
          m.topicTag.toLowerCase().includes(search.toLowerCase()) ||
          m.description.toLowerCase().includes(search.toLowerCase())
      )
    : materials;

  return (
    <DashboardShell
      user={user}
      title="Study Notes & Faculty Handbooks"
      subtitle="Authorized educational material for JEE Advanced Pinnacle Batch A1."
    >
      {downloadNotice && (
        <div className="mb-6 p-4 rounded-2xl bg-orange-50 border border-orange-200 text-orange-900 text-xs font-bold flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-orange-600 shrink-0" />
          <span>{downloadNotice}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-xs flex items-center justify-between">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search study notes by topic or formula title..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                  {m.topicTag}
                </span>
                <span className="text-[11px] font-mono text-slate-400">{(m.fileSizeBytes / 1000000).toFixed(1)} MB</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-2">{m.title}</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{m.description}</p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>{m.subjectName}</span>
                <span className="font-semibold text-slate-800">Faculty: {m.uploadedByTeacherName}</span>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Uploaded on {m.uploadDate}</span>
              <button
                onClick={() => handleDownload(m.fileName)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
