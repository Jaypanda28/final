'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  PlusCircle,
  Download,
  FileText,
  Search,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Modal } from '@/components/ui/Modal';
import { StudyMaterial, UserProfile } from '@/types';

export default function TeacherMaterialsPage() {
  const [user] = useState<UserProfile>({
    id: 'usr-tch-01',
    name: 'Prof. Ananya Sen',
    email: 'teacher.sharma@pinnakeedge.edu',
    role: 'teacher',
    instituteId: 'SPE-TCH-001',
    status: 'active',
    createdAt: '',
  });

  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: 'crs-jee-adv',
    courseName: 'JEE Advanced Pinnacle (2-Year Integrated)',
    subjectId: 'sbj-phy-01',
    subjectName: 'Physics (Mechanics)',
    batchId: 'btc-jee-a1',
    batchName: 'Batch A1 - Morning Super 30',
    topicTag: 'Electrodynamics',
    fileName: 'electrodynamics_master_formulas.pdf',
    fileType: 'pdf' as const,
  });

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/materials');
      const data = await res.json();
      if (data.success) {
        setMaterials(data.materials);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleUploadMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          fileSizeBytes: 3200000,
          fileUrl: `/materials/${formData.fileName}`,
        }),
      });
      if (res.ok) {
        setStatusMsg('Study material published to enrolled students.');
        fetchMaterials();
        setTimeout(() => {
          setStatusMsg('');
          setShowModal(false);
          setFormData({
            title: '',
            description: '',
            courseId: 'crs-jee-adv',
            courseName: 'JEE Advanced Pinnacle (2-Year Integrated)',
            subjectId: 'sbj-phy-01',
            subjectName: 'Physics (Mechanics)',
            batchId: 'btc-jee-a1',
            batchName: 'Batch A1 - Morning Super 30',
            topicTag: '',
            fileName: '',
            fileType: 'pdf',
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
      title="Study Materials & Faculty Handbooks"
      subtitle="Publish copyrighted notes, formula summaries, and solved derivation sheets with batch-level privacy."
      actions={
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          Upload New Material
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {materials.map((m) => (
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
                <span className="font-semibold text-slate-800">{m.batchName || 'All Batches'}</span>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">{m.downloadCount} student downloads</span>
              <a
                href={`#download-${m.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  alert(`Downloading protected document: ${m.fileName}`);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* UPLOAD MODAL */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Upload Study Material / Handbook"
        description="Encrypted private storage bucket with short-lived signed URLs for students."
      >
        {statusMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{statusMsg}</span>
          </div>
        )}

        <form onSubmit={handleUploadMaterial} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Material Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Electromagnetic Induction Formula Handbook"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Topic Tag *</label>
              <input
                type="text"
                required
                value={formData.topicTag}
                onChange={(e) => setFormData({ ...formData, topicTag: e.target.value })}
                placeholder="e.g. EMI & AC Circuits"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Batch</label>
              <select
                value={formData.batchId}
                onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden bg-white"
              >
                <option value="btc-jee-a1">Batch A1 (Morning Super 30)</option>
                <option value="btc-neet-b1">Batch B1 (NEET Doctors)</option>
                <option value="btc-crash-d1">Batch D1 (Rank Booster)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description / Guidelines</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Summary of formulas and instructions for students..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">File Attachment (PDF / DOCX)</label>
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFormData({ ...formData, fileName: e.target.files[0].name });
                }
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700"
            >
              Publish Notes
            </button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}
