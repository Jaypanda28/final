'use client';

import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface MonthlyEnrollmentData {
  month: string;
  students: number;
}

interface AttendanceTrendData {
  date: string;
  presentPercent: number;
}

interface BatchDistributionData {
  batchName: string;
  count: number;
}

interface FeeTrendData {
  month: string;
  collected: number;
  target: number;
}

export function EnrollmentAreaChart({ data }: { data: MonthlyEnrollmentData[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-64 bg-slate-900/60 animate-pulse rounded-2xl" />;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="enrollmentOrangeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f95700" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#f95700" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
          <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#080c14', borderRadius: '14px', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
          />
          <Area type="monotone" dataKey="students" stroke="#f95700" strokeWidth={3} fillOpacity={1} fill="url(#enrollmentOrangeGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AttendanceLineChart({ data }: { data: AttendanceTrendData[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-64 bg-slate-900/60 animate-pulse rounded-2xl" />;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
          <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
          <YAxis domain={[80, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#080c14', borderRadius: '14px', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
            formatter={(value) => [`${value}%`, 'Present Rate']}
          />
          <Line type="monotone" dataKey="presentPercent" stroke="#f95700" strokeWidth={3} dot={{ r: 4, fill: '#ff7a00' }} activeDot={{ r: 6, fill: '#ea580c' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BatchDistributionBarChart({ data }: { data: BatchDistributionData[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-64 bg-slate-900/60 animate-pulse rounded-2xl" />;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
          <XAxis dataKey="batchName" stroke="#64748b" fontSize={10} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#080c14', borderRadius: '14px', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
          />
          <Bar dataKey="count" fill="#f95700" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FeeCollectionAreaChart({ data }: { data: FeeTrendData[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-64 bg-slate-900/60 animate-pulse rounded-2xl" />;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
          <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
          <YAxis
            stroke="#64748b"
            fontSize={10}
            tickLine={false}
            tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#080c14', borderRadius: '14px', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
            formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
          />
          <Bar dataKey="collected" fill="#f95700" radius={[8, 8, 0, 0]} name="Collected" />
          <Bar dataKey="target" fill="#334155" radius={[8, 8, 0, 0]} name="Budget Target" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
