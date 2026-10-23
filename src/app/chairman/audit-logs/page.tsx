'use client';

import React, { useState, useEffect } from 'react';
import { History, Search } from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { AuditLog, UserProfile } from '@/types';

export default function ChairmanAuditLogsPage() {
  const [user] = useState<UserProfile>({
    id: 'usr-chr-01',
    name: 'Shri Vikramaditya Singhania',
    email: 'chairman@pinnakeedge.edu',
    role: 'chairman',
    instituteId: 'SPE-CHR-01',
    status: 'active',
    createdAt: '',
  });

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/audit-logs')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setLogs(data.logs);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = search
    ? logs.filter(
        (l) =>
          l.action.toLowerCase().includes(search.toLowerCase()) ||
          l.actorName.toLowerCase().includes(search.toLowerCase()) ||
          l.details.toLowerCase().includes(search.toLowerCase())
      )
    : logs;

  return (
    <DashboardShell
      user={user}
      title="Executive Governance Audit Trail"
      subtitle="Complete chronological record of all administrative, financial, and academic operations."
    >
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search governance audit trail..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] font-sans">
              <tr>
                <th className="py-3 px-4">Timestamp (IST)</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 font-sans font-bold text-slate-900">
                    {log.actorName} ({log.actorRole.toUpperCase()})
                  </td>
                  <td className="py-3 px-4 font-bold text-orange-700">{log.action}</td>
                  <td className="py-3 px-4 font-sans font-semibold text-slate-700">{log.targetEntity}</td>
                  <td className="py-3 px-4 font-sans text-slate-600 max-w-md">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
