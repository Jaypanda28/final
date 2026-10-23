'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  LogOut,
  User,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Menu,
} from 'lucide-react';
import { UserProfile, UserRole } from '@/types';

interface NavbarProps {
  user: UserProfile;
  onToggleSidebar?: () => void;
}

export function Navbar({ user, onToggleSidebar }: NavbarProps) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch {
      router.push('/login');
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'principal':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
            Principal (Super Admin)
          </span>
        );
      case 'chairman':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Chairman (Executive Admin)
          </span>
        );
      case 'teacher':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-700 border border-orange-500/20">
            <GraduationCap className="w-3.5 h-3.5 text-orange-600" />
            Faculty Teacher
          </span>
        );
      case 'student':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <User className="w-3.5 h-3.5 text-emerald-600" />
            Enrolled Student
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link href="/" className="flex items-center gap-2.5 group">
          <img
            src="/brand/logo-mark.png"
            alt="Shri PinnakEdge"
            className="w-9 h-9 object-contain shrink-0 transition-transform group-hover:scale-105"
          />
          <div className="hidden sm:block">
            <span className="text-sm font-extrabold tracking-tight text-slate-900 block leading-tight">
              Shri PinnakEdge
            </span>
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">
              Smart LMS Portal
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Role Badge */}
        <div className="hidden md:block">{getRoleBadge(user.role)}</div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">Notifications</span>
                <span className="text-[11px] font-medium text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                  2 unread
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                <div className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer">
                  <p className="text-xs font-semibold text-slate-800">
                    Grand Test #6 Results Published
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Scores and detailed rank breakdown are now available on the portal.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">15 minutes ago</span>
                </div>
                <div className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer">
                  <p className="text-xs font-semibold text-slate-800">
                    Diwali Break & Doubt Counters
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Offline classes resume Nov 3rd. Online doubts will remain open.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">2 hours ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-orange-500/40 bg-orange-500/15 flex items-center justify-center text-xs font-bold text-orange-600 shrink-0">
              {user.role === 'principal' ? (
                <img
                  src="/leadership/yudhistir-debata.jpg"
                  alt="Principal"
                  className="w-full h-full object-cover object-top"
                />
              ) : user.role === 'chairman' ? (
                <img
                  src="/leadership/debasis-dixit.jpg"
                  alt="Chairman"
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
              )}
            </div>
            <div className="text-left hidden lg:block">
              <span className="text-xs font-bold text-slate-800 block leading-tight">{user.name}</span>
              <span className="text-[10px] text-slate-500 block">{user.instituteId || user.email}</span>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
              </div>

              <div className="p-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
