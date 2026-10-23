'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  Sparkles,
  User,
  GraduationCap,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  KeyRound,
  BookOpen,
  HelpCircle,
  Database,
  Search,
} from 'lucide-react';
import { UserRole } from '@/types';
import { DEMO_ACCOUNTS, DEMO_FACULTY, ALL_LEADERSHIP_AND_FACULTY } from '@/lib/auth/session';

const SAMPLE_STUDENTS = [
  {
    id: 'stu-001',
    name: 'Aarav Patel',
    instituteId: 'SPE-STU-2026-001',
    email: 'student.aarav@pinnakeedge.edu',
    batch: 'Batch A1 - JEE Morning Super 30',
    course: 'JEE Advanced Pinnacle',
  },
  {
    id: 'stu-002',
    name: 'Kabir Joshi',
    instituteId: 'SPE-STU-2026-002',
    email: 'kabir.joshi2@student.pinnakeedge.edu',
    batch: 'Batch A2 - JEE Evening Pinnacle',
    course: 'JEE Advanced Pinnacle',
  },
  {
    id: 'stu-003',
    name: 'Diya Sharma',
    instituteId: 'SPE-STU-2026-003',
    email: 'diya.sharma3@student.pinnakeedge.edu',
    batch: 'Batch B1 - NEET Doctors Squad',
    course: 'NEET-UG Edge Medical Elite',
  },
];

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get('role') as UserRole) || 'student';

  const [activeRole, setActiveRole] = useState<UserRole>(initialRole);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('PinnakeEdge@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [showDirectory, setShowDirectory] = useState(true);

  const demoInfo = DEMO_ACCOUNTS[activeRole];

  const handleRoleTabChange = (role: UserRole) => {
    setActiveRole(role);
    setErrorMsg('');
    setSuccessNotice('');
    setIdentifier('');
  };

  const executeLogin = async (loginIdentifier: string, loginPassword?: string, loginRole?: UserRole, isDemo = false) => {
    setIsLoading(true);
    setErrorMsg('');
    setSuccessNotice('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginIdentifier.trim(),
          password: loginPassword || password || 'PinnakeEdge@2026',
          role: loginRole || activeRole,
          isDemo,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please verify credentials.');
      }

      setSuccessNotice(`Authenticated as ${data.user.name} (${data.user.role.toUpperCase()}). Loading portal...`);
      setTimeout(() => {
        router.push(data.redirectUrl);
      }, 500);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Sign in failed');
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (roleToUse: UserRole, customEmail?: string) => {
    const emailToUse = customEmail || DEMO_ACCOUNTS[roleToUse].email;
    setIdentifier(emailToUse);
    executeLogin(emailToUse, 'PinnakeEdge@2026', roleToUse, true);
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMsg('Please enter your email or Institute ID.');
      return;
    }
    executeLogin(identifier, password, activeRole, false);
  };

  const fillCredentials = (idOrEmail: string, roleToSet: UserRole) => {
    setActiveRole(roleToSet);
    setIdentifier(idOrEmail);
    setPassword('PinnakeEdge@2026');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Ambient background glow matching the brand orange & deep navy */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-orange-500/10 via-orange-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1. BRAND HEADER */}
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center relative z-10 mb-6">
        <Link href="/" className="inline-flex flex-col items-center group">
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl shadow-orange-500/10 mb-3 group-hover:scale-105 transition-all">
            <img
              src="/brand/logo-full.png"
              alt="Sri PinnakEdge - YOUR EDGE IN EVERY COMPETITION"
              className="h-14 sm:h-16 w-auto object-contain"
            />
          </div>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
          <span>Shri PinnakEdge Smart LMS</span>
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-400 font-medium">
          Official Institutional Learning &bull; Examination &bull; Administrative Portal
        </p>
      </div>

      {/* 2. MAIN LOGIN CONTAINER */}
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl relative z-10">
        <div className="bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-800/80">
          {/* Role Tabs */}
          <div className="grid grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => handleRoleTabChange('student')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeRole === 'student'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleTabChange('teacher')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeRole === 'teacher'
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Faculty</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleTabChange('principal')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeRole === 'principal'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Principal</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleTabChange('chairman')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeRole === 'chairman'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Chairman</span>
            </button>
          </div>

          {/* Role-Specific Quick 1-Click Fast Sign In */}
          {activeRole === 'teacher' ? (
            <div className="mb-6 p-4 rounded-2xl bg-sky-950/40 border border-sky-800/40">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Select Faculty Subject Chair (1-Click Instant Login)
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-900/60 text-sky-300 border border-sky-700/50">
                  4 Subject Heads
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DEMO_FACULTY.map((fac) => (
                  <button
                    key={fac.id}
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleQuickDemoLogin('teacher', fac.email)}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-sky-500 hover:bg-sky-900/20 text-left transition-all flex flex-col justify-between group disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-sky-300">
                        {fac.name}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                        {fac.subject}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 truncate block font-mono">
                      {fac.email}
                    </span>
                    <div className="mt-2 text-[11px] font-bold text-sky-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Sign In as {fac.subject} Faculty &rarr;</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : activeRole === 'student' ? (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/40">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  Verified Evaluation Students (1-Click Login)
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
                  100 Enrolled
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {SAMPLE_STUDENTS.map((stu) => (
                  <button
                    key={stu.id}
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleQuickDemoLogin('student', stu.email)}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500 hover:bg-emerald-900/20 text-left transition-all flex flex-col justify-between group disabled:opacity-50"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white group-hover:text-emerald-300">
                          {stu.name}
                        </span>
                        <span className="text-[9px] font-mono text-emerald-400">
                          {stu.instituteId.split('-').pop()}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                        {stu.batch.split(' - ')[0]}
                      </span>
                    </div>
                    <div className="mt-2 text-[10px] font-bold text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Sign In &rarr;</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Verified Institutional Leadership
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  activeRole === 'principal' 
                    ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' 
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  {activeRole === 'principal' ? 'Super Admin' : 'Executive Trustee'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 shadow-md ${
                    activeRole === 'principal' ? 'border-orange-500' : 'border-amber-500'
                  }`}>
                    <img
                      src={activeRole === 'principal' ? '/leadership/yudhistir-debata.jpg' : '/leadership/debasis-dixit.jpg'}
                      alt={demoInfo.title}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">
                      {activeRole === 'principal' ? 'Mr. Yudhistir Debata' : 'Mr. Debasis Dixit'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {activeRole === 'principal'
                        ? 'Principal & Co-Founder • Dhirubhai Ambani School & Presidency Alumni'
                        : 'Executive Chairman & Trustee • Ex-CitiBank, TCS & Mindtree'}
                    </p>
                    <p className="text-[10px] text-orange-400 font-mono mt-0.5">{demoInfo.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleQuickDemoLogin(activeRole)}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all disabled:opacity-50 shrink-0 ${
                    activeRole === 'principal'
                      ? 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 shadow-orange-600/25'
                      : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 shadow-amber-600/25'
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  )}
                  Sign In as {activeRole === 'principal' ? 'Principal' : 'Chairman'}
                </button>
              </div>
            </div>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-3 text-slate-500 font-semibold tracking-wider">
                Or Sign In with Email or Institute ID
              </span>
            </div>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successNotice && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Manual Login Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Email Address or Institute ID
                </label>
                <span className="text-[10px] text-slate-400">
                  {activeRole === 'student' && 'e.g. SPE-STU-2026-001'}
                  {activeRole === 'teacher' && 'e.g. SPE-TCH-001'}
                  {activeRole === 'principal' && 'e.g. SPE-PRN-01'}
                  {activeRole === 'chairman' && 'e.g. SPE-CHR-01'}
                </span>
              </div>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  activeRole === 'student'
                    ? 'SPE-STU-2026-001 or student.aarav@pinnakeedge.edu'
                    : activeRole === 'teacher'
                    ? 'SPE-TCH-001 or avinash.rajput@pinnakeedge.edu'
                    : activeRole === 'principal'
                    ? 'SPE-PRN-01 or principal@pinnakeedge.edu'
                    : 'SPE-CHR-01 or chairman@pinnakeedge.edu'
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-hidden"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setPassword('PinnakeEdge@2026')}
                  className="text-[10px] text-orange-400 hover:text-orange-300 font-medium underline"
                >
                  Use Default: PinnakeEdge@2026
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-hidden pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 ${
                activeRole === 'student'
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                  : activeRole === 'teacher'
                  ? 'bg-sky-600 hover:bg-sky-500 shadow-sky-600/30'
                  : activeRole === 'principal'
                  ? 'bg-orange-600 hover:bg-orange-500 shadow-orange-600/30'
                  : 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying Credentials with Database...
                </>
              ) : (
                <>
                  Sign In to {activeRole.toUpperCase()} Portal
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Interactive Official Credentials Directory */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-orange-400" />
                Institutional Credentials Directory
              </span>
              <button
                type="button"
                onClick={() => setShowDirectory(!showDirectory)}
                className="text-[10px] text-orange-400 hover:text-orange-300 font-semibold"
              >
                {showDirectory ? 'Hide Directory' : 'Show Directory'}
              </button>
            </div>

            {showDirectory && (
              <div className="space-y-3">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Click <strong className="text-white">Sign In</strong> on any account to instantly authenticate, or click to populate credentials.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {ALL_LEADERSHIP_AND_FACULTY.map((account) => (
                    <div
                      key={account.email}
                      className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between group"
                    >
                      <div className="truncate pr-2">
                        <div className="flex items-center gap-1.5">
                          <strong className="text-white text-[11px] group-hover:text-orange-300">
                            {account.name}
                          </strong>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                              account.role === 'principal'
                                ? 'bg-orange-950 text-orange-300 border border-orange-800'
                                : account.role === 'chairman'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : 'bg-sky-950 text-sky-300 border border-sky-800'
                            }`}
                          >
                            {account.subject || account.designation}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block truncate font-mono">
                          {account.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => executeLogin(account.email, account.pass, account.role, true)}
                          className="px-2 py-1 rounded-lg text-[10px] font-bold bg-orange-600 hover:bg-orange-500 text-white shadow-xs transition-colors"
                        >
                          Sign In &rarr;
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Sample Student Card */}
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between group sm:col-span-2">
                    <div className="truncate pr-2">
                      <div className="flex items-center gap-1.5">
                        <strong className="text-white text-[11px] group-hover:text-emerald-300">
                          Aarav Patel (Student Rank #1)
                        </strong>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                          JEE Advanced Super 30
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate font-mono">
                        SPE-STU-2026-001 &bull; student.aarav@pinnakeedge.edu
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => executeLogin('SPE-STU-2026-001', 'PinnakeEdge@2026', 'student', true)}
                      className="px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-colors shrink-0"
                    >
                      Sign In &rarr;
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-800 text-center space-y-2.5">
            <div className="flex items-center justify-center gap-4 text-xs">
              <Link
                href="/forgot-password"
                className="text-slate-400 hover:text-orange-400 transition-colors font-medium"
              >
                Forgot Password?
              </Link>
              <span className="text-slate-700">&bull;</span>
              <Link
                href="/"
                className="text-slate-400 hover:text-white transition-colors font-medium"
              >
                ← Return to Public Website
              </Link>
            </div>

            <div className="text-[11px] text-slate-500 pt-1">
              Institute IT Desk:{' '}
              <span className="font-semibold text-slate-400">helpdesk@pinnakedge.edu</span> &bull; Campus: +91 11 2689 0042
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xs">
          <Loader2 className="w-5 h-5 animate-spin mr-2 text-orange-500" />
          Loading Shri PinnakEdge Portal...
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
