'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  FileText,
  FileCheck2,
  CreditCard,
  Megaphone,
  History,
  TrendingUp,
  BarChart3,
  Award,
  Layers,
  Clock,
  X,
} from 'lucide-react';
import { UserRole } from '@/types';

interface SidebarProps {
  role: UserRole;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const getNavItems = (r: UserRole): NavItem[] => {
    switch (r) {
      case 'principal':
        return [
          { label: 'Admin Dashboard', href: '/principal', icon: LayoutDashboard },
          { label: 'Student Directory', href: '/principal/students', icon: Users },
          { label: 'Faculty & Teachers', href: '/principal/teachers', icon: GraduationCap },
          { label: 'Courses & Batches', href: '/principal/courses', icon: BookOpen },
          { label: 'Daily Attendance', href: '/principal/attendance', icon: CalendarCheck },
          { label: 'Examinations', href: '/principal/examinations', icon: FileCheck2 },
          { label: 'Fee Invoicing', href: '/principal/fees', icon: CreditCard },
          { label: 'Announcements', href: '/principal/announcements', icon: Megaphone },
          { label: 'System Audit Logs', href: '/principal/audit-logs', icon: History },
        ];
      case 'chairman':
        return [
          { label: 'Executive Dashboard', href: '/chairman', icon: LayoutDashboard },
          { label: 'Institutional Analytics', href: '/chairman/analytics', icon: BarChart3 },
          { label: 'Retention & Growth', href: '/chairman/reports', icon: TrendingUp },
          { label: 'Executive Audit Trail', href: '/chairman/audit-logs', icon: History },
        ];
      case 'teacher':
        return [
          { label: 'Teacher Overview', href: '/teacher', icon: LayoutDashboard },
          { label: 'Mark Attendance', href: '/teacher/attendance', icon: CalendarCheck },
          { label: 'Study Materials', href: '/teacher/materials', icon: Layers },
          { label: 'Assignments', href: '/teacher/assignments', icon: FileText },
          { label: 'Examinations & Grading', href: '/teacher/examinations', icon: FileCheck2 },
          { label: 'Batch Students', href: '/teacher/students', icon: Users },
        ];
      case 'student':
        return [
          { label: 'My Learning Space', href: '/student', icon: LayoutDashboard },
          { label: 'My Courses & Timetable', href: '/student/courses', icon: Clock },
          { label: 'Study Notes & PDFs', href: '/student/materials', icon: Layers },
          { label: 'Assignments', href: '/student/assignments', icon: FileText },
          { label: 'Online Tests', href: '/student/examinations', icon: FileCheck2 },
          { label: 'Results & Ranks', href: '/student/results', icon: Award },
          { label: 'Fees & Invoices', href: '/student/fees', icon: CreditCard },
        ];
    }
  };

  const navItems = getNavItems(role);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center p-1 shrink-0 shadow-xs">
              <img
                src="/brand/logo-mark.png"
                alt="Shri PinnakEdge"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-sm font-extrabold text-white tracking-wide block group-hover:text-orange-400 transition-colors">
                PinnakEdge
              </span>
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block">
                {role.toUpperCase()} PORTAL
              </span>
            </div>
          </Link>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white lg:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 text-white font-bold shadow-lg shadow-orange-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Institution Badge */}
        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/60 rounded-xl p-3 text-center border border-slate-700/50">
            <p className="text-[11px] font-bold text-slate-200">Shri PinnakEdge</p>
            <p className="text-[9px] text-slate-400 mt-0.5">Session: 2026-2027</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-medium border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Database Online
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
