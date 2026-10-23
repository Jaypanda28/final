'use client';

import React, { useState, useEffect } from 'react';
import { History, ShieldCheck, Search, Filter, Clock } from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { AuditLog, UserProfile } from '@/types';

export default function PrincipalAuditLogsPage() {
  const [user] = useState<UserProfile>({
    id: 'usr-prn-01',
    name: 'Dr. Rajeshwar Sharma',
    email: 'principal@pinnakeedge.edu',
    role: 'principal',
    instituteId: 'SPE-PRN-01',
    status: 'active',
    createdAt: '',
  });

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/audit-logs');
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = search
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
      title="System Audit Logs & Compliance"
      subtitle="Immutable cryptographic event trail for sensitive academic and financial transactions."
    >
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit trail by actor, action, or keyword..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Timestamp (IST)</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Action Code</th>
                <th className="py-3.5 px-4">Target Entity</th>
                <th className="py-3.5 px-4">Audit Details</th>
                <th className="py-3.5 px-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 font-sans font-bold text-slate-900">
                    <div>
                      <span>{log.actorName}</span>
                      <span className="text-[10px] text-slate-400 block font-normal uppercase">
                        {log.actorRole}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-orange-50 text-orange-700 border border-orange-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans font-semibold text-slate-700">{log.targetEntity}</td>
                  <td className="py-3 px-4 font-sans text-slate-600 max-w-md">{log.details}</td>
                  <td className="py-3 px-4 text-slate-400">{log.ipAddress || '127.0.0.1'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
