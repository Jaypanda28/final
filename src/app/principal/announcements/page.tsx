'use client';

import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Announcement, UserProfile } from '@/types';

export default function PrincipalAnnouncementsPage() {
  const [user] = useState<UserProfile>({
    id: 'usr-prn-01',
    name: 'Dr. Rajeshwar Sharma',
    email: 'principal@pinnakeedge.edu',
    role: 'principal',
    instituteId: 'SPE-PRN-01',
    status: 'active',
    createdAt: '',
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const [form, setForm] = useState({
    title: '',
    content: '',
    targetAudience: 'all',
    priority: 'normal' as 'normal' | 'important' | 'urgent',
  });

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/announcements');
      const data = await res.json();
      if (data.success) {
        setAnnouncements(data.announcements);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatusMsg('Notice published to all dashboards.');
        fetchAnnouncements();
        setTimeout(() => {
          setStatusMsg('');
          setShowModal(false);
          setForm({
            title: '',
            content: '',
            targetAudience: 'all',
            priority: 'normal',
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
      title="Institutional Announcements & Notices"
      subtitle="Publish circulars, holiday schedules, examination notices, and batch-specific instructions."
      actions={
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          Publish Notice
        </button>
      }
    >
      <div className="space-y-4 max-w-4xl">
        {announcements.map((anc) => (
          <div
            key={anc.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                <StatusBadge status={anc.priority} />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Target: {anc.targetAudience.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date(anc.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 mt-2">{anc.title}</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">{anc.content}</p>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Author: <span className="font-semibold text-slate-700">{anc.authorName} ({anc.authorRole})</span></span>
              <span>Shri PinnakeEdge Circular</span>
            </div>
          </div>
        ))}
      </div>

      {/* PUBLISH MODAL */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Publish Official Notice"
        description="Will be displayed instantly on the public site and logged-in user dashboards."
      >
        {statusMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{statusMsg}</span>
          </div>
        )}

        <form onSubmit={handleCreateAnnouncement} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Mandatory Grand Test on Sunday"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Audience</label>
              <select
                value={form.targetAudience}
                onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden bg-white"
              >
                <option value="all">Entire Institute (All)</option>
                <option value="students">Students Only</option>
                <option value="teachers">Faculty Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden bg-white"
              >
                <option value="normal">Normal</option>
                <option value="important">Important</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Notice Content *</label>
            <textarea
              required
              rows={4}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Write the circular message here..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
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
              Publish Circular
            </button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}
