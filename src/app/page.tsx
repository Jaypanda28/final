'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  CheckCircle2,
  BookOpen,
  Calendar,
  Award,
  Clock,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Layers,
  Send,
  Star,
  Zap,
  BarChart3,
  Target,
  Flame,
  Check,
} from 'lucide-react';
import { DEMO_ACCOUNTS } from '@/lib/auth/session';

export default function LandingPage() {
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryCourse, setInquiryCourse] = useState('JEE Advanced Pinnacle');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inquiryName && inquiryPhone) {
      setInquirySubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* 1. TOP ANNOUNCEMENT TICKER BANNER */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white text-xs py-2 px-4 text-center font-medium shadow-sm flex items-center justify-center gap-2 flex-wrap">
        <span className="px-2.5 py-0.5 rounded-full bg-black/25 text-white font-extrabold text-[10px] tracking-wider uppercase border border-white/20">
          ADMISSIONS OPEN 2026-2027
        </span>
        <span className="font-semibold text-white/95">
          Shri PinnakEdge National Scholarship &amp; Diagnostic Aptitude Test (SP-SAT) Registrations Active.
        </span>
        <Link
          href="/login?role=student"
          className="underline font-bold text-white hover:text-black transition-colors ml-1 inline-flex items-center gap-0.5"
        >
          Book Your Slot &rarr;
        </Link>
      </div>

      {/* 2. HEADER */}
      <header className="sticky top-0 z-50 bg-[#080C14]/90 backdrop-blur-xl border-b border-orange-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 opacity-60 blur-xs group-hover:opacity-100 transition duration-300" />
              <img
                src="/brand/logo-mark.png"
                alt="Shri PinnakEdge"
                className="relative w-11 h-11 object-contain shrink-0 transition-transform group-hover:scale-105"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white block leading-tight">
                  Shri Pinnak<span className="text-orange-500">Edge</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-orange-500/15 text-orange-400 border border-orange-500/30">
                  LMS
                </span>
              </div>
              <span className="text-[10px] font-bold text-orange-400/90 tracking-wider uppercase block">
                Your Edge In Every Competition
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#about" className="hover:text-orange-400 transition-colors">
              About Institute
            </a>
            <a href="#rankers" className="hover:text-orange-400 transition-colors">
              Hall of Fame
            </a>
            <a href="#courses" className="hover:text-orange-400 transition-colors">
              Flagship Programs
            </a>
            <a href="#faculty" className="hover:text-orange-400 transition-colors">
              Star Faculty
            </a>
            <a href="#lms" className="hover:text-orange-400 transition-colors">
              LMS Platform
            </a>
            <a href="#contact" className="hover:text-orange-400 transition-colors">
              Admissions
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-orange-500 text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-95"
            >
              Sign In to LMS
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION - ORANGE & BLACK GLORY */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 bg-radial-[at_50%_0%] from-orange-500/15 via-[#080C14] to-[#080C14] border-b border-orange-500/15">
        {/* Ambient Glowing Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-orange-500/15 via-amber-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Vision & Humanized Pitch */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-bold text-orange-400 shadow-sm">
                <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
                <span>Premier IIT-JEE &bull; NEET-UG &bull; Olympiads &bull; Class 9-12</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
                Ignite Your Potential.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400">
                  Conquer Every Exam.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                At <span className="text-white font-semibold">Shri PinnakEdge</span>, we combine national-caliber faculty mentorship with state-of-the-art CBT Grand Test engines, precision attendance analytics, and transparent digital academic management.
              </p>

              {/* Direct Demo Access Grid */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-orange-400/90">
                    Instant Demo Portals &bull; 1-Click Access
                  </p>
                  <span className="text-[11px] text-slate-400">Database Connected</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                  {/* Student */}
                  <Link
                    href="/login?role=student"
                    className="p-3.5 bg-slate-900/80 hover:bg-slate-900 rounded-2xl border border-slate-800 hover:border-orange-500/60 hover:shadow-lg hover:shadow-orange-500/10 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-1.5 rounded-lg bg-orange-500/15 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-extrabold text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20">
                        STUDENT
                      </span>
                    </div>
                    <span className="text-xs font-bold text-white group-hover:text-orange-400 block truncate">
                      Aarav Patel
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">JEE Advanced A1</span>
                  </Link>

                  {/* Teacher */}
                  <Link
                    href="/login?role=teacher"
                    className="p-3.5 bg-slate-900/80 hover:bg-slate-900 rounded-2xl border border-slate-800 hover:border-orange-500/60 hover:shadow-lg hover:shadow-orange-500/10 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                        FACULTY
                      </span>
                    </div>
                    <span className="text-xs font-bold text-white group-hover:text-amber-400 block truncate">
                      Avinash Rajput
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">Maths Chair &bull; IIT-KGP</span>
                  </Link>

                  {/* Principal */}
                  <Link
                    href="/login?role=principal"
                    className="p-3.5 bg-slate-900/80 hover:bg-slate-900 rounded-2xl border border-slate-800 hover:border-orange-500/60 hover:shadow-lg hover:shadow-orange-500/10 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-1.5 rounded-lg bg-orange-500/15 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-extrabold text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20">
                        PRINCIPAL
                      </span>
                    </div>
                    <span className="text-xs font-bold text-white group-hover:text-orange-400 block truncate">
                      Yudhistir Debata
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">Academic Director</span>
                  </Link>

                  {/* Chairman */}
                  <Link
                    href="/login?role=chairman"
                    className="p-3.5 bg-slate-900/80 hover:bg-slate-900 rounded-2xl border border-slate-800 hover:border-amber-500/60 hover:shadow-lg hover:shadow-amber-500/10 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                        CHAIRMAN
                      </span>
                    </div>
                    <span className="text-xs font-bold text-white group-hover:text-amber-400 block truncate">
                      Debasis Dixit
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">Managing Trustee</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Showcase Card with Brand Crest & Live Indicators */}
            <div className="lg:col-span-5">
              <div className="relative">
                {/* Background ambient glow */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 opacity-30 blur-xl" />

                <div className="relative bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-orange-500/30 p-6 sm:p-8 space-y-6 shadow-2xl">
                  {/* Brand lockup header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src="/brand/logo-mark.png"
                        alt="Shri PinnakEdge"
                        className="w-10 h-10 object-contain shrink-0"
                      />
                      <div>
                        <h3 className="text-sm font-black text-white tracking-wide">
                          Shri PinnakEdge Academic Edge
                        </h3>
                        <p className="text-[11px] text-orange-400 font-semibold">
                          Session 2026-2027 Live
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      LMS Active
                    </span>
                  </div>

                  {/* Highlights list */}
                  <div className="space-y-3.5">
                    <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-orange-500/30 transition-all">
                      <div className="p-2.5 rounded-xl bg-orange-500/15 text-orange-400 shrink-0">
                        <Target className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">
                          CBT Grand Test Engine
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                          NTA-pattern online tests with negative scoring and percentile breakdown.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-orange-500/30 transition-all">
                      <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 shrink-0">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">
                          Curated IIT/AIIMS Notes &amp; DPPs
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                          Exclusive copyright study material and daily practice problems curated by chairs.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-orange-500/30 transition-all">
                      <div className="p-2.5 rounded-xl bg-orange-500/15 text-orange-400 shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">
                          Real-Time Attendance &amp; Performance
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                          Subject-wise session tracking with instant notifications to parents.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CTA button */}
                  <div className="pt-2">
                    <Link
                      href="/login"
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-orange-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01]"
                    >
                      Enter Smart LMS Learning Portal
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KEY METRICS COUNTER (ORANGE & BLACK STATS) */}
      <section className="py-12 bg-slate-950 border-b border-orange-500/15 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="pt-4 md:pt-0">
              <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 block">
                100+
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1 block">
                Active Enrolled Students
              </span>
            </div>
            <div className="pt-4 md:pt-0">
              <span className="text-3xl sm:text-4xl font-black text-white block">
                10
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1 block">
                Expert IIT/AIIMS Faculty
              </span>
            </div>
            <div className="pt-4 md:pt-0">
              <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 block">
                93.4%
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1 block">
                Average Attendance Rate
              </span>
            </div>
            <div className="pt-4 md:pt-0">
              <span className="text-3xl sm:text-4xl font-black text-white block">
                88.5%
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1 block">
                Grand Test Pass Rate
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HALL OF FAME: HUMANIZED STUDENT TRIUMPHS & RANKERS */}
      <section id="rankers" className="py-20 bg-[#080C14] border-b border-orange-500/15 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/25 text-xs font-bold">
              <Award className="w-3.5 h-3.5 text-orange-500" />
              <span>Proven Academic Triumphs</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Hall of Fame &bull; Inspiring Stories of Success
            </h2>
            <p className="text-sm text-slate-400">
              Behind every high rank is disciplined hard work, faculty guidance, and the confidence powered by Shri PinnakEdge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Ranker 1 */}
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-orange-500/50 p-6 flex flex-col justify-between transition-all group hover:shadow-xl hover:shadow-orange-500/5">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/15 text-orange-400 border border-orange-500/30">
                    AIR TOPPER &bull; RANK 1
                  </span>
                  <div className="flex items-center text-amber-400 text-xs gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-bold">96.5%</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white font-black flex items-center justify-center text-base shadow-md">
                    AP
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                      Aarav Patel
                    </h4>
                    <span className="text-[11px] text-slate-400 block">JEE Advanced Batch A1</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed mt-2 border-l-2 border-orange-500 pl-3">
                  &ldquo;The weekly CBT grand test simulation gave me the exact composure needed. The instantaneous negative marking analytics helped me rectify recurring mistakes in Calculus!&rdquo;
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Target: IIT Bombay CS</span>
                <span className="font-bold text-orange-400">Verified Ranker</span>
              </div>
            </div>

            {/* Ranker 2 */}
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-orange-500/50 p-6 flex flex-col justify-between transition-all group hover:shadow-xl hover:shadow-orange-500/5">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    NEET ELITE &bull; RANK 2
                  </span>
                  <div className="flex items-center text-amber-400 text-xs gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-bold">94.8%</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black flex items-center justify-center text-base shadow-md">
                    DS
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                      Diya Sharma
                    </h4>
                    <span className="text-[11px] text-slate-400 block">NEET Medical Batch B1</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed mt-2 border-l-2 border-emerald-500 pl-3">
                  &ldquo;Dr. Panda&apos;s Botany sessions and line-by-line NCERT decoding transformed my preparation. I scored 355/360 in the institute Grand Biology simulator!&rdquo;
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Target: AIIMS New Delhi</span>
                <span className="font-bold text-emerald-400">Verified Ranker</span>
              </div>
            </div>

            {/* Ranker 3 */}
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-orange-500/50 p-6 flex flex-col justify-between transition-all group hover:shadow-xl hover:shadow-orange-500/5">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/15 text-orange-400 border border-orange-500/30">
                    PHYSICS ACE &bull; RANK 3
                  </span>
                  <div className="flex items-center text-amber-400 text-xs gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-bold">92.2%</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-600 text-white font-black flex items-center justify-center text-base shadow-md">
                    IV
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                      Ishaan Verma
                    </h4>
                    <span className="text-[11px] text-slate-400 block">JEE Advanced Batch A1</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed mt-2 border-l-2 border-orange-500 pl-3">
                  &ldquo;Nandan Jha Sir makes Mechanics intuitive with physical models and practical problems. The LMS chapter notes are absolute gold for quick revisions.&rdquo;
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Target: IIT Kharagpur EE</span>
                <span className="font-bold text-orange-400">Verified Ranker</span>
              </div>
            </div>

            {/* Ranker 4 */}
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-orange-500/50 p-6 flex flex-col justify-between transition-all group hover:shadow-xl hover:shadow-orange-500/5">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    OLYMPIAD GOLD &bull; RANK 4
                  </span>
                  <div className="flex items-center text-amber-400 text-xs gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-bold">91.0%</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-500 text-white font-black flex items-center justify-center text-base shadow-md">
                    AR
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                      Ananya Rao
                    </h4>
                    <span className="text-[11px] text-slate-400 block">Class 10 Foundation C1</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed mt-2 border-l-2 border-amber-500 pl-3">
                  &ldquo;Balancing Board exam preparations alongside national Olympiad rounds was made effortless by PinnakEdge&apos;s modular scheduling and doubt sessions.&rdquo;
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Target: 100% CBSE &amp; PRMO</span>
                <span className="font-bold text-amber-400">Verified Ranker</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FLAGSHIP COURSES SECTION (SLEEK ORANGE & BLACK CARDS) */}
      <section id="courses" className="py-20 bg-slate-950 border-b border-orange-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/25 text-xs font-bold">
              <BookOpen className="w-3.5 h-3.5 text-orange-500" />
              <span>Structured Academic Curricula</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Flagship Programs Engineered for Rankers
            </h2>
            <p className="text-sm text-slate-400">
              Each course is designed with daily classroom lectures, weekly Grand CBT tests, DPP problem sets, and individual doubt resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Course 1 - JEE */}
            <div className="bg-[#080C14] rounded-3xl border border-orange-500/30 p-7 shadow-xl hover:shadow-2xl hover:border-orange-500/60 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/15 text-orange-400 border border-orange-500/30">
                    2 Years &bull; Target 2027/2028
                  </span>
                  <span className="text-base font-black text-white">₹1,45,000</span>
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-orange-400 transition-colors">
                  JEE Advanced Pinnacle
                </h3>
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                  Rigorous preparation for IIT-JEE covering Mechanics, Electrodynamics, Organic Reaction Pathways, Coordinate Geometry &amp; Advanced Calculus.
                </p>

                <div className="mt-5 space-y-2.5 border-t border-slate-800/80 pt-5">
                  <div className="flex items-center gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                    <span>Batch A1 (Super 30 Rankers Squad)</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                    <span>Weekly All-India Grand CBT Tests</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                    <span>Mentored by IIT Kharagpur &amp; Roorkee Alumni</span>
                  </div>
                </div>
              </div>

              <div className="mt-7 pt-5 border-t border-slate-800/80">
                <Link
                  href="/login?role=student"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 transition-all"
                >
                  Enroll in Batch &rarr;
                </Link>
              </div>
            </div>

            {/* Course 2 - NEET */}
            <div className="bg-[#080C14] rounded-3xl border border-emerald-500/30 p-7 shadow-xl hover:shadow-2xl hover:border-emerald-500/60 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    2 Years &bull; Medical Elite
                  </span>
                  <span className="text-base font-black text-white">₹1,40,000</span>
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors">
                  NEET-UG Edge Medical Elite
                </h3>
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                  NCERT line-by-line mastery in Zoology, Botany, and high-yield numerical problem solving in Physics and Physical/Inorganic Chemistry.
                </p>

                <div className="mt-5 space-y-2.5 border-t border-slate-800/80 pt-5">
                  <div className="flex items-center gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Batch B1 (Future Doctors Squad)</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>AIIMS &amp; NTA Pattern Mock Simulators</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Dedicated Botany &amp; Physiology Lab Drills</span>
                  </div>
                </div>
              </div>

              <div className="mt-7 pt-5 border-t border-slate-800/80">
                <Link
                  href="/login?role=student"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all"
                >
                  Enroll in Batch &rarr;
                </Link>
              </div>
            </div>

            {/* Course 3 - Foundation */}
            <div className="bg-[#080C14] rounded-3xl border border-amber-500/30 p-7 shadow-xl hover:shadow-2xl hover:border-amber-500/60 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    1 Year &bull; Class 9 &amp; 10
                  </span>
                  <span className="text-base font-black text-white">₹75,000</span>
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition-colors">
                  Foundation &amp; Olympiad Edge
                </h3>
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                  Dual-focus curriculum targeting 100% Board Exam scores alongside PRMO, NTSE, Science Olympiad, and mental ability training.
                </p>

                <div className="mt-5 space-y-2.5 border-t border-slate-800/80 pt-5">
                  <div className="flex items-center gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Batch C1 (Young Achievers Squad)</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Mental Ability &amp; Analytical Reasoning</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Full CBSE Board Exam Mock Drills</span>
                  </div>
                </div>
              </div>

              <div className="mt-7 pt-5 border-t border-slate-800/80">
                <Link
                  href="/login?role=student"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20 transition-all"
                >
                  Enroll in Batch &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DISTINGUISHED LEADERSHIP & STAR FACULTY CHAIRS */}
      <section id="faculty" className="py-20 bg-[#080C14] border-b border-orange-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/25 text-xs font-bold">
              <Users className="w-3.5 h-3.5 text-orange-500" />
              <span>Institutional Pedagogy &amp; Mentorship</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Guided by Visionary Leaders &amp; National-Level Faculty
            </h2>
            <p className="text-sm text-slate-400">
              Meet our institutional chairs and expert department heads dedicated to producing top-tier selections.
            </p>
          </div>

          {/* Leadership Row - Authentic Founders & Educational Visionaries */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Mr. Debasis Dixit - Chairman */}
            <div className="bg-slate-900/90 rounded-3xl p-7 sm:p-8 border border-amber-500/30 hover:border-amber-500/60 shadow-2xl transition-all flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-5 relative z-10">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <div className="relative shrink-0">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-xl group-hover:scale-105 transition-transform duration-300">
                      <img
                        src="/leadership/debasis-dixit.jpg"
                        alt="Mr. Debasis Dixit - Chairman & Educational Leader"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-md">
                      CHAIRMAN
                    </span>
                  </div>

                  <div className="space-y-1.5 text-center sm:text-left flex-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        Executive Chairman &bull; Founder
                      </span>
                      <span className="text-xs text-slate-400 font-medium">Bhadrak Educational Leader</span>
                    </div>
                    <h3 className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors">
                      Mr. Debasis Dixit
                    </h3>
                    <p className="text-xs font-semibold text-amber-400">
                      Chairman &amp; Managing Trustee &bull; B.Tech (Electronics &amp; Telecom)
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Ex-Software Engineer: <span className="text-slate-200 font-semibold">CitiBank &bull; TCS &bull; Mindtree</span> (9 Years)
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed space-y-2">
                  <p>
                    A passionate entrepreneur, promising academician, and enterprising educational leader, <strong>Mr. Debasis Dixit</strong> is a name to reckon with in the educational arena of Bhadrak. With a zeal to contribute something lasting for the people of Bhadrak and to give shape to his father&apos;s cherished dream, he founded SBDIS and Shri PinnakEdge, sacrificing a lucrative corporate engineering career.
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    At an early age when many enjoy the comforts of corporate life, Mr. Dixit devoted himself entirely to the welfare of education in Bhadrak, bringing 9 years of software engineering rigor from global giants like <strong>CitiBank, TCS, and Mindtree</strong> into institutional infrastructure.
                  </p>
                </div>

                {/* Career Pedigree Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    B.Tech E&amp;TC
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    CitiBank Alumni
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    TCS Software Engineer
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    Mindtree
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Founder SBDIS &amp; PinnakEdge
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Executive Admin Desk</span>
                <Link
                  href="/login?role=chairman"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-500/20 transition-all"
                >
                  Enter Chairman Portal &rarr;
                </Link>
              </div>
            </div>

            {/* Mr. Yudhistir Debata - Principal */}
            <div className="bg-slate-900/90 rounded-3xl p-7 sm:p-8 border border-orange-500/30 hover:border-orange-500/60 shadow-2xl transition-all flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-5 relative z-10">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <div className="relative shrink-0">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-orange-500/50 shadow-xl group-hover:scale-105 transition-transform duration-300">
                      <img
                        src="/leadership/yudhistir-debata.jpg"
                        alt="Mr. Yudhistir Debata - Principal & Co-Founder"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-orange-500 text-white font-black text-[9px] uppercase tracking-wider shadow-md">
                      PRINCIPAL
                    </span>
                  </div>

                  <div className="space-y-1.5 text-center sm:text-left flex-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30">
                        Principal &bull; Co-Founder
                      </span>
                      <span className="text-xs text-slate-400 font-medium">35+ Years Teaching Mastery</span>
                    </div>
                    <h3 className="text-2xl font-black text-white group-hover:text-orange-400 transition-colors">
                      Mr. Yudhistir Debata
                    </h3>
                    <p className="text-xs font-semibold text-orange-400">
                      Principal &amp; Head of Academics &bull; M.Sc (Mathematics)
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Ex-Academic Coordinator: <span className="text-slate-200 font-semibold">Dhirubhai Ambani School &bull; Vice-Principal Presidency School</span>
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed space-y-2">
                  <p>
                    A hardcore academician and educational visionary, <strong>Mr. Yudhistir Debata</strong> completed his education in Mathematics and was posted as Physics faculty in DPS Vidyapeeth in 1991. From 1995, he served as Mathematics Lecturer at Charampa Degree College, Bhadrak for 7 years before being selected as Academic Coordinator at India&apos;s leading <strong>Dhirubhai Ambani School, Gujarat</strong> in 2003 (8 years).
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    He then served as Vice-Principal at <strong>Presidency School, Bangalore/Mangalore</strong> (2009–2012). Guided by an irresistible drive to revolutionize classroom practices and bring academic innovations to life, he co-founded SBD International School and Shri PinnakEdge to materialise his lifelong dream of excellence in education.
                  </p>
                </div>

                {/* Career Pedigree Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-300 border border-orange-500/20">
                    DPS Vidyapeeth (1991)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    Charampa College (7 Yrs)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    Dhirubhai Ambani School (8 Yrs)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    Presidency School VP (2009-12)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-300 border border-orange-500/20">
                    Co-Founder SBDIS &amp; PinnakEdge
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Academic Super Admin Desk</span>
                <Link
                  href="/login?role=principal"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 transition-all"
                >
                  Enter Principal Portal &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Department Faculty Chairs Row */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400/90 text-center mb-6">
              Core Subject Department Chairs
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Mathematics */}
              <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 hover:border-orange-500/50 shadow-md transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center font-black text-sm mb-3 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    AR
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/25 block w-fit mb-2">
                    Mathematics
                  </span>
                  <h5 className="text-sm font-black text-white">Avinash Singh Rajput</h5>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">M.Sc IIT Kharagpur</p>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Specialist in Calculus, Coordinate Geometry &amp; PRMO / RMO Olympiad Problem Solving.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-amber-400 font-bold">★ 4.9 (420+ ratings)</span>
                  <Link
                    href="/login?role=teacher"
                    className="font-bold text-orange-400 hover:text-orange-300"
                  >
                    Faculty Login &rarr;
                  </Link>
                </div>
              </div>

              {/* Physics */}
              <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 hover:border-orange-500/50 shadow-md transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-black text-sm mb-3 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                    NJ
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/25 block w-fit mb-2">
                    Physics
                  </span>
                  <h5 className="text-sm font-black text-white">Nandan Jha</h5>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">M.Tech IIT Roorkee</p>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Expert in Mechanics, Electrodynamics &amp; Wave Optics with 14+ years JEE coaching.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-amber-400 font-bold">★ 4.8 (380+ ratings)</span>
                  <Link
                    href="/login?role=teacher"
                    className="font-bold text-amber-400 hover:text-amber-300"
                  >
                    Faculty Login &rarr;
                  </Link>
                </div>
              </div>

              {/* Chemistry */}
              <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 hover:border-orange-500/50 shadow-md transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center font-black text-sm mb-3 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    AN
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/25 block w-fit mb-2">
                    Chemistry
                  </span>
                  <h5 className="text-sm font-black text-white">Dr. Arun Kumar Naik</h5>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">Ph.D Utkal / CSIR Fellow</p>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Master of Organic Reaction Mechanisms, Named Reactions &amp; Chemical Equilibrium.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-amber-400 font-bold">★ 4.9 (510+ ratings)</span>
                  <Link
                    href="/login?role=teacher"
                    className="font-bold text-orange-400 hover:text-orange-300"
                  >
                    Faculty Login &rarr;
                  </Link>
                </div>
              </div>

              {/* Biology */}
              <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 hover:border-emerald-500/50 shadow-md transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-black text-sm mb-3 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    GP
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 block w-fit mb-2">
                    Biology
                  </span>
                  <h5 className="text-sm font-black text-white">Girija Shankar Panda</h5>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">M.Sc Molecular Biology</p>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    National NEET-UG mentor specializing in Genetics, Physiology, Botany &amp; NCERT decoding.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-amber-400 font-bold">★ 4.9 (460+ ratings)</span>
                  <Link
                    href="/login?role=teacher"
                    className="font-bold text-emerald-400 hover:text-emerald-300"
                  >
                    Faculty Login &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. HOW THE LMS WORKS (4 PILLARS IN SLEEK DARK ONYX) */}
      <section id="lms" className="py-20 bg-slate-950 border-b border-orange-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/25 text-xs font-bold">
              <Layers className="w-3.5 h-3.5 text-orange-500" />
              <span>Full-Stack Connected Infrastructure</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              The 4 Pillars of PinnakEdge Smart LMS
            </h2>
            <p className="text-sm text-slate-400">
              One unified, real-time database synchronizing student attendance, CBT examinations, copyrighted study vaults, and fee accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#080C14] border border-orange-500/20 hover:border-orange-500/50 space-y-3 transition-all">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center font-black">
                1
              </div>
              <h3 className="text-base font-bold text-white">Daily Attendance &amp; Alerts</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Faculty marks daily attendance per batch. Automated triggers alert parents whenever attendance dips below 75%.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#080C14] border border-orange-500/20 hover:border-orange-500/50 space-y-3 transition-all">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center font-black">
                2
              </div>
              <h3 className="text-base font-bold text-white">Secure Notes &amp; Video Vault</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Curated PDF modules and video lecture archives protected with batch-level authorization so only enrolled students access them.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#080C14] border border-orange-500/20 hover:border-orange-500/50 space-y-3 transition-all">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center font-black">
                3
              </div>
              <h3 className="text-base font-bold text-white">Grand CBT Online Tests</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full-screen exam environment with negative scoring, instant automated grading, percentile benchmarking, and rank publication.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#080C14] border border-orange-500/20 hover:border-orange-500/50 space-y-3 transition-all">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center font-black">
                4
              </div>
              <h3 className="text-base font-bold text-white">Transparent Fee Tracking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Digital fee cards, installment notifications, and verifiable transaction receipts with unique reference numbers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. ADMISSIONS & INQUIRY FORM */}
      <section id="contact" className="py-20 bg-[#080C14] border-b border-orange-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl p-8 sm:p-12 lg:p-16 border border-orange-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-[#080C14] shadow-2xl overflow-hidden">
            {/* Ambient decorative circle */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
              <div className="lg:col-span-6 space-y-6">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-orange-500/15 text-orange-400 border border-orange-500/30">
                  Direct Admission Counseling
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Book a One-on-One Academic Counseling Session
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Speak directly with our Academic Dean, take a diagnostic aptitude test, and unlock scholarship opportunities up to 100% tuition waiver.
                </p>

                <div className="space-y-3 pt-2 text-xs text-slate-300">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-orange-400" />
                    <span>Main Campus: 42 Knowledge Boulevard, Institutional Area, New Delhi</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-orange-400" />
                    <span>Helpline: +91 98765 43210 &bull; Office: +91 11 2689 0042</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-orange-400" />
                    <span>admissions@pinnakeedge.edu</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-orange-500/30">
                {inquirySubmitted ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-14 h-14 bg-orange-500/15 text-orange-400 border border-orange-500/30 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Inquiry Received!</h3>
                    <p className="text-xs text-slate-300 max-w-sm mx-auto">
                      Thank you, {inquiryName}. Our Senior Academic Counselor will contact you on {inquiryPhone} within 24 hours.
                    </p>
                    <button
                      onClick={() => setInquirySubmitted(false)}
                      className="px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-lg hover:bg-orange-600"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    <h3 className="text-base font-bold text-white">
                      Admission Inquiry &amp; SP-SAT Slot Booking
                    </h3>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Student Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        placeholder="e.g. Rohan Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={inquiryPhone}
                          onChange={(e) => setInquiryPhone(e.target.value)}
                          placeholder="+91 98765..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={inquiryEmail}
                          onChange={(e) => setInquiryEmail(e.target.value)}
                          placeholder="student@example.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Target Course Program
                      </label>
                      <select
                        value={inquiryCourse}
                        onChange={(e) => setInquiryCourse(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                      >
                        <option value="JEE Advanced Pinnacle">JEE Advanced Pinnacle (2-Year Integrated)</option>
                        <option value="NEET-UG Edge Medical Elite">NEET-UG Edge Medical Elite</option>
                        <option value="Class 10 Foundation">Class 10 Foundation &amp; Olympiad Mastery</option>
                        <option value="JEE/NEET Crash Course">JEE/NEET 90-Day Crash Course</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-orange-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all"
                    >
                      <Send className="w-4 h-4" />
                      Submit Admission Inquiry
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FOOTER IN DEEP OBSIDIAN BLACK */}
      <footer className="bg-[#05080E] text-slate-400 py-12 border-t border-orange-500/15 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <img
                  src="/brand/logo-full.png"
                  alt="Sri PinnakEdge - YOUR EDGE IN EVERY COMPETITION"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <p className="text-slate-400 leading-relaxed text-xs">
                Shri PinnakEdge Smart LMS is the official digital infrastructure for coaching institute management, CBT conduct, and ranker success.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">
                Portals &amp; Logins
              </h4>
              <ul className="space-y-2">
                <li><Link href="/login?role=student" className="hover:text-orange-400 transition-colors">Student Learning Portal</Link></li>
                <li><Link href="/login?role=teacher" className="hover:text-orange-400 transition-colors">Faculty Portal</Link></li>
                <li><Link href="/login?role=principal" className="hover:text-orange-400 transition-colors">Principal Administration</Link></li>
                <li><Link href="/login?role=chairman" className="hover:text-orange-400 transition-colors">Chairman Executive Portal</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">
                Programs
              </h4>
              <ul className="space-y-2">
                <li><a href="#courses" className="hover:text-orange-400 transition-colors">IIT-JEE Advanced (2 Yrs)</a></li>
                <li><a href="#courses" className="hover:text-orange-400 transition-colors">NEET-UG Medical Elite</a></li>
                <li><a href="#courses" className="hover:text-orange-400 transition-colors">Class 9 &amp; 10 Foundation</a></li>
                <li><a href="#courses" className="hover:text-orange-400 transition-colors">National Grand Test Series</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">
                Institutional Compliance
              </h4>
              <p className="text-slate-400 leading-relaxed mb-2">
                Locale: en-IN | Currency: INR (₹) | Time Zone: Asia/Kolkata
              </p>
              <p className="text-[10px] text-slate-500">
                &copy; 2026 Shri PinnakEdge Coaching Center. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
