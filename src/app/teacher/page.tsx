'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  BookOpen,
  FileText,
  FileCheck2,
  Clock,
  Users,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Sparkles,
  GraduationCap,
  Award,
  UploadCloud,
  Check,
  TrendingUp,
  HelpCircle,
  Bookmark,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { AssignmentSubmission, TimetableSession, UserProfile } from '@/types';
import { DEMO_FACULTY, FacultyMemberConfig } from '@/lib/auth/session';

interface FacultySubjectData {
  subject: string;
  departmentChair: string;
  qualification: string;
  specialization: string;
  batches: string[];
  studentsCount: number;
  syllabusProgress: number;
  avgScore: number;
  rating: number;
  colorScheme: {
    badgeBg: string;
    badgeText: string;
    border: string;
    accent: string;
    cardBg: string;
  };
  todayLectures: {
    time: string;
    topic: string;
    batch: string;
    room: string;
    status: 'Upcoming' | 'Live Now' | 'Completed';
  }[];
  pendingAssignments: {
    id: string;
    studentName: string;
    title: string;
    batch: string;
    submittedAt: string;
  }[];
  recentMaterials: {
    title: string;
    fileType: string;
    size: string;
    downloads: number;
  }[];
}

const FACULTY_DISCIPLINES: Record<string, FacultySubjectData> = {
  'Mathematics': {
    subject: 'Mathematics',
    departmentChair: 'Avinash Singh Rajput',
    qualification: 'M.Sc (Mathematics, IIT Kharagpur), CSIR-NET JRF',
    specialization: 'Integral & Differential Calculus, Vectors, 3D Geometry & Olympiads',
    batches: ['Batch A1 (Morning Super 30)', 'Batch C1 (Weekend Champs)'],
    studentsCount: 52,
    syllabusProgress: 88,
    avgScore: 84.5,
    rating: 4.9,
    colorScheme: {
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-700',
      border: 'border-emerald-200',
      accent: 'emerald',
      cardBg: 'from-emerald-950/40 to-slate-900',
    },
    todayLectures: [
      {
        time: '08:30 AM - 10:00 AM',
        topic: 'Definite Integrals & Fundamental Theorem of Calculus',
        batch: 'Batch A1 (Morning Super 30)',
        room: 'Lecture Hall 1 (Smart Board)',
        status: 'Completed',
      },
      {
        time: '11:30 AM - 01:00 PM',
        topic: 'Vectors, Scalar Triple Products & 3D Geometry Problem Solving',
        batch: 'Batch C1 (Weekend Champs)',
        room: 'Seminar Room B',
        status: 'Upcoming',
      },
    ],
    pendingAssignments: [
      {
        id: 'sub-m1',
        studentName: 'Aarav Patel',
        title: 'Definite Integrals & Advanced Limits Problem Sheet #4',
        batch: 'Batch A1',
        submittedAt: 'Today, 09:15 AM',
      },
      {
        id: 'sub-m2',
        studentName: 'Rohan Sharma',
        title: 'Vectors & 3D Coordinate Geometry Olympiad Challenge',
        batch: 'Batch C1',
        submittedAt: 'Yesterday, 07:45 PM',
      },
      {
        id: 'sub-m3',
        studentName: 'Ananya Mishra',
        title: 'Matrices & Determinants Proof Verification',
        batch: 'Batch A1',
        submittedAt: 'Yesterday, 04:20 PM',
      },
    ],
    recentMaterials: [
      { title: 'Definite Integrals Formula Sheet & Quick Shortcuts.pdf', fileType: 'PDF', size: '2.4 MB', downloads: 52 },
      { title: 'Vectors & 3D Geometry 15-Year JEE PYQ Handbook.pdf', fileType: 'PDF', size: '4.8 MB', downloads: 49 },
    ],
  },
  'Physics': {
    subject: 'Physics',
    departmentChair: 'Nandan Jha',
    qualification: 'M.Tech / M.Sc (Applied Physics, IIT Roorkee)',
    specialization: 'Mechanics, Rotational Dynamics, Electrodynamics & Wave Optics',
    batches: ['Batch A1 (Morning Super 30)', 'Batch B1 (Medical Rankers)'],
    studentsCount: 60,
    syllabusProgress: 85,
    avgScore: 81.2,
    rating: 4.8,
    colorScheme: {
      badgeBg: 'bg-sky-50',
      badgeText: 'text-sky-700',
      border: 'border-sky-200',
      accent: 'sky',
      cardBg: 'from-sky-950/40 to-slate-900',
    },
    todayLectures: [
      {
        time: '10:15 AM - 11:45 AM',
        topic: 'Electromagnetic Induction, Lenz’s Law & Mutual Inductance',
        batch: 'Batch A1 (Morning Super 30)',
        room: 'Lecture Hall 1 (Smart Board)',
        status: 'Live Now',
      },
      {
        time: '02:00 PM - 03:30 PM',
        topic: 'Ray Optics & Refraction through Spherical Surfaces for NEET',
        batch: 'Batch B1 (Medical Rankers)',
        room: 'Physics Lab 2',
        status: 'Upcoming',
      },
    ],
    pendingAssignments: [
      {
        id: 'sub-p1',
        studentName: 'Diya Sengupta',
        title: 'Electromagnetic Induction & Faraday Laws Numerical Set',
        batch: 'Batch A1',
        submittedAt: 'Today, 08:30 AM',
      },
      {
        id: 'sub-p2',
        studentName: 'Rohan Sharma',
        title: 'Rotational Motion & Moment of Inertia Practice Sheet',
        batch: 'Batch A1',
        submittedAt: 'Yesterday, 06:10 PM',
      },
    ],
    recentMaterials: [
      { title: 'Electrodynamics & EMI Quick Concept Maps.pdf', fileType: 'PDF', size: '3.1 MB', downloads: 58 },
      { title: 'Rotational Dynamics Problem Solving Strategies.pdf', fileType: 'PDF', size: '5.2 MB', downloads: 55 },
    ],
  },
  'Chemistry': {
    subject: 'Chemistry',
    departmentChair: 'Arun Kumar Naik',
    qualification: 'Ph.D (Organic Chemistry, Utkal University / CSIR Fellow)',
    specialization: 'Organic Reaction Mechanisms, Carbonyls, Biomolecules & Physical Equilibrium',
    batches: ['Batch A1 (Morning Super 30)', 'Batch B1 (Medical Rankers)'],
    studentsCount: 58,
    syllabusProgress: 91,
    avgScore: 86.8,
    rating: 4.9,
    colorScheme: {
      badgeBg: 'bg-purple-50',
      badgeText: 'text-purple-700',
      border: 'border-purple-200',
      accent: 'purple',
      cardBg: 'from-purple-950/40 to-slate-900',
    },
    todayLectures: [
      {
        time: '08:30 AM - 10:00 AM',
        topic: 'Aldol & Cannizzaro Reaction Mechanisms in Carbonyl Compounds',
        batch: 'Batch B1 (Medical Rankers)',
        room: 'Chemistry Demo Lab',
        status: 'Completed',
      },
      {
        time: '03:45 PM - 05:15 PM',
        topic: 'Coordination Chemistry, Crystal Field Theory & Isomerism',
        batch: 'Batch A1 (Morning Super 30)',
        room: 'Lecture Hall 2',
        status: 'Upcoming',
      },
    ],
    pendingAssignments: [
      {
        id: 'sub-c1',
        studentName: 'Aarav Patel',
        title: 'Carbonyl Compounds Named Reactions & Mechanisms Sheet',
        batch: 'Batch A1',
        submittedAt: 'Today, 10:05 AM',
      },
      {
        id: 'sub-c2',
        studentName: 'Pooja Verma',
        title: 'Chemical Equilibrium & Le Chatelier Calculations',
        batch: 'Batch B1',
        submittedAt: 'Yesterday, 09:30 PM',
      },
    ],
    recentMaterials: [
      { title: 'Master Organic Reaction Roadmaps 2026.pdf', fileType: 'PDF', size: '6.5 MB', downloads: 60 },
      { title: 'Coordination Compounds Color & Magnetic Moment Tables.pdf', fileType: 'PDF', size: '2.1 MB', downloads: 54 },
    ],
  },
  'Biology': {
    subject: 'Biology',
    departmentChair: 'Girija Shankar Panda',
    qualification: 'M.Sc (Zoology & Molecular Biology), B.Ed',
    specialization: 'Genetics, Molecular Basis of Inheritance, Human Physiology & NEET-UG',
    batches: ['Batch B1 (Medical Rankers)', 'Batch D1 (Evening Foundation)'],
    studentsCount: 56,
    syllabusProgress: 94,
    avgScore: 89.4,
    rating: 4.9,
    colorScheme: {
      badgeBg: 'bg-teal-50',
      badgeText: 'text-teal-700',
      border: 'border-teal-200',
      accent: 'teal',
      cardBg: 'from-teal-950/40 to-slate-900',
    },
    todayLectures: [
      {
        time: '10:30 AM - 12:00 PM',
        topic: 'Molecular Basis of Inheritance: DNA Replication & Transcription',
        batch: 'Batch B1 (Medical Rankers)',
        room: 'Bio-Smart Amphitheatre',
        status: 'Live Now',
      },
      {
        time: '04:00 PM - 05:30 PM',
        topic: 'Human Neural Control and Chemical Coordination (Endocrine)',
        batch: 'Batch D1 (Evening Foundation)',
        room: 'Biology Lab 1',
        status: 'Upcoming',
      },
    ],
    pendingAssignments: [
      {
        id: 'sub-b1',
        studentName: 'Pooja Verma',
        title: 'Genetics & Mendelian Dihybrid Cross Pedigree Analysis',
        batch: 'Batch B1',
        submittedAt: 'Today, 07:50 AM',
      },
      {
        id: 'sub-b2',
        studentName: 'Sneha Mohanty',
        title: 'DNA Fingerprinting & Lac Operon Diagram Submission',
        batch: 'Batch B1',
        submittedAt: 'Yesterday, 05:15 PM',
      },
    ],
    recentMaterials: [
      { title: 'NCERT High-Yield Biology Diagrams & Labeling Workbook.pdf', fileType: 'PDF', size: '7.8 MB', downloads: 56 },
      { title: 'Genetics & Pedigree Analysis 30-Year NEET Compilation.pdf', fileType: 'PDF', size: '4.2 MB', downloads: 53 },
    ],
  },
};

export default function TeacherDashboardPage() {
  const [user, setUser] = useState<UserProfile>({
    id: 'usr-tch-01',
    name: 'Avinash Singh Rajput',
    email: 'avinash.rajput@pinnakeedge.edu',
    role: 'teacher',
    instituteId: 'SPE-TCH-001',
    status: 'active',
    createdAt: '',
  });

  // Active subject workspace (Mathematics, Physics, Chemistry, Biology)
  const [activeSubject, setActiveSubject] = useState<'Mathematics' | 'Physics' | 'Chemistry' | 'Biology'>('Mathematics');
  const [quickUploadModal, setQuickUploadModal] = useState(false);
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialTopic, setMaterialTopic] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [gradingSuccessId, setGradingSuccessId] = useState<string | null>(null);

  // Sync user from auth session on mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
          // Auto switch active subject based on user name/email
          const nameLower = data.user.name.toLowerCase();
          const emailLower = data.user.email.toLowerCase();
          if (nameLower.includes('avinash') || emailLower.includes('avinash') || emailLower.includes('math')) {
            setActiveSubject('Mathematics');
          } else if (nameLower.includes('nandan') || emailLower.includes('nandan') || emailLower.includes('physics')) {
            setActiveSubject('Physics');
          } else if (nameLower.includes('arun') || emailLower.includes('arun') || emailLower.includes('chemistry')) {
            setActiveSubject('Chemistry');
          } else if (nameLower.includes('girija') || emailLower.includes('girija') || emailLower.includes('biology')) {
            setActiveSubject('Biology');
          }
        }
      })
      .catch(() => {});
  }, []);

  const activeData = FACULTY_DISCIPLINES[activeSubject];

  const handleSelectFacultyChair = (chair: FacultyMemberConfig) => {
    setActiveSubject(chair.subject as 'Mathematics' | 'Physics' | 'Chemistry' | 'Biology');
    setUser({
      id: chair.id,
      name: chair.name,
      email: chair.email,
      role: 'teacher',
      instituteId: chair.id.replace('tch', 'SPE-TCH'),
      status: 'active',
      createdAt: '',
    });
  };

  const handleGradeQuick = (id: string) => {
    setGradingSuccessId(id);
    setTimeout(() => {
      setGradingSuccessId(null);
    }, 2000);
  };

  const handlePublishMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialTitle) return;
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setQuickUploadModal(false);
      setMaterialTitle('');
      setMaterialTopic('');
    }, 1500);
  };

  return (
    <DashboardShell
      user={user}
      title={`${activeData.subject} Department Workspace`}
      subtitle={`Faculty Head: ${activeData.departmentChair} — ${activeData.specialization}`}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setQuickUploadModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <UploadCloud className="w-4 h-4 text-orange-600" />
            Upload Study Material
          </button>
          <Link
            href="/teacher/attendance"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-xs transition-all"
          >
            <CalendarCheck className="w-4 h-4" />
            Mark Today&apos;s Attendance
          </Link>
        </div>
      }
    >
      {/* 1. FACULTY CHAIR SELECTOR STRIP */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Department Faculty Chairs
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Click any teacher to view their live dashboard workspace
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {DEMO_FACULTY.map((f) => {
            const isSelected = activeSubject === f.subject;
            return (
              <button
                key={f.id}
                onClick={() => handleSelectFacultyChair(f)}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-orange-50/80 border-orange-400 ring-2 ring-orange-200/50 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 ${
                    isSelected
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {f.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{f.name}</p>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                        f.subject === 'Mathematics'
                          ? 'bg-emerald-100 text-emerald-800'
                          : f.subject === 'Physics'
                          ? 'bg-sky-100 text-sky-800'
                          : f.subject === 'Chemistry'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-teal-100 text-teal-800'
                      }`}
                    >
                      {f.subject}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">{f.email}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. ACTIVE TEACHER HERO BANNER */}
      <div className={`rounded-2xl border p-5 mb-8 bg-gradient-to-r ${activeData.colorScheme.cardBg} text-white shadow-md relative overflow-hidden`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${activeData.colorScheme.badgeBg} ${activeData.colorScheme.badgeText}`}>
                Department Chair &bull; {activeData.subject}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {activeData.qualification}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {activeData.departmentChair}
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Assigned to: <strong className="text-white">{activeData.batches.join(' & ')}</strong> &bull; Mentoring {activeData.studentsCount} Enrolled Aspirants
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/60 backdrop-blur-xs p-3.5 rounded-xl border border-white/10 shrink-0">
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Syllabus Covered</span>
              <span className="text-lg font-black text-emerald-400">{activeData.syllabusProgress}%</span>
            </div>
            <div className="h-8 w-px bg-white/15" />
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Student Rating</span>
              <span className="text-lg font-black text-amber-300 flex items-center justify-center gap-1">
                ★ {activeData.rating}
              </span>
            </div>
            <div className="h-8 w-px bg-white/15" />
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Subject Avg</span>
              <span className="text-lg font-black text-sky-400">{activeData.avgScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <MetricCard
          title="Assigned Batches"
          value={activeData.batches.length}
          subtitle={activeData.batches[0]}
          trend={`${activeData.studentsCount} Active Students`}
          trendType="neutral"
          icon={Layers}
          iconBgColor="bg-orange-50"
          iconColor="text-orange-600"
        />

        <MetricCard
          title="Today's Classes"
          value={activeData.todayLectures.length}
          subtitle={`Next: ${activeData.todayLectures.find((l) => l.status === 'Live Now' || l.status === 'Upcoming')?.time.split('-')[0].trim() || 'Done'}`}
          trend="Lecture Hall 1"
          trendType="positive"
          icon={Clock}
          iconBgColor="bg-sky-50"
          iconColor="text-sky-600"
        />

        <MetricCard
          title="Pending Reviews"
          value={activeData.pendingAssignments.length}
          subtitle="Submissions waiting grade"
          trend="Action required"
          trendType="negative"
          icon={FileText}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
        />

        <MetricCard
          title="Grand Test #6 Avg"
          value={`${activeData.avgScore}%`}
          subtitle="Recent Benchmark Rank Exam"
          trend="Class Target: 80%"
          trendType="positive"
          icon={Award}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />
      </div>

      {/* 4. MAIN SPLIT: TODAY'S TIMETABLE & PENDING GRADING DECK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Left Column: Today's Class Lectures (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {activeData.subject} Lecture Schedule Today
                </h3>
                <p className="text-xs text-slate-500">
                  Daily smart-board sessions & laboratory demonstrations
                </p>
              </div>
              <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                Active Session
              </span>
            </div>

            <div className="space-y-3">
              {activeData.todayLectures.map((lec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-100/60 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex flex-col items-center justify-center font-black text-[10px] shrink-0 mt-0.5">
                      <Clock className="w-3.5 h-3.5 mb-0.5" />
                      <span>{lec.time.split(' ')[0]}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-xs font-bold text-slate-900">{lec.topic}</h4>
                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                            lec.status === 'Completed'
                              ? 'bg-slate-200 text-slate-700'
                              : lec.status === 'Live Now'
                              ? 'bg-rose-100 text-rose-700 animate-pulse'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {lec.status}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-orange-600">{lec.batch}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{lec.room} &bull; {lec.time}</p>
                    </div>
                  </div>

                  <Link
                    href="/teacher/attendance"
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 transition-all text-center shrink-0"
                  >
                    Take Attendance
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Syllabus pace is on target for November completion
            </span>
            <Link
              href="/teacher/examinations"
              className="text-xs font-bold text-orange-600 hover:text-orange-800 inline-flex items-center gap-1"
            >
              View Full Exam Schedule
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Pending Assignment Reviews (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Submissions to Grade ({activeData.pendingAssignments.length})
                </h3>
                <p className="text-xs text-slate-500">Pending student homework review</p>
              </div>
              <Link
                href="/teacher/assignments"
                className="text-xs font-bold text-orange-600 hover:text-orange-800"
              >
                All Assignments &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {activeData.pendingAssignments.map((sub) => (
                <div
                  key={sub.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {sub.studentName}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {sub.batch}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate mt-0.5">{sub.title}</p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">{sub.submittedAt}</span>
                  </div>

                  {gradingSuccessId === sub.id ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 shrink-0">
                      <Check className="w-3.5 h-3.5" />
                      Graded
                    </span>
                  ) : (
                    <button
                      onClick={() => handleGradeQuick(sub.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white transition-colors shrink-0 shadow-2xs"
                    >
                      Grade (10/10)
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              href="/teacher/materials"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5 text-slate-600" />
              Manage {activeData.subject} Notes &amp; Formula Sheets
            </Link>
          </div>
        </div>
      </div>

      {/* 5. PUBLISHED MATERIALS & QUICK ACTIONS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recently Published Courseware (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Department Courseware &amp; Notes Archive
              </h3>
              <p className="text-xs text-slate-500">
                Protected learning materials made available to enrolled students
              </p>
            </div>
            <Link
              href="/teacher/materials"
              className="text-xs font-bold text-orange-600 hover:text-orange-800"
            >
              Open File Vault &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {activeData.recentMaterials.map((mat, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-extrabold text-[10px] shrink-0">
                    {mat.fileType}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{mat.title}</p>
                    <p className="text-[11px] text-slate-500">
                      {mat.size} &bull; {mat.downloads} Student Downloads
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200 shrink-0">
                  Verified Active
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Action Shortcuts (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-orange-400 mb-4">
              Faculty Workflows &amp; Tools
            </h3>

            <div className="space-y-3">
              <Link
                href="/teacher/attendance"
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 block transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-orange-300">
                    1. Mark Live Batch Attendance
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Session-by-session roll call with instant low-attendance alert triggers.
                </p>
              </Link>

              <Link
                href="/teacher/assignments"
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 block transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-orange-300">
                    2. Create Weekly Problem Set / Assignment
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Dispatch numerical drill sheets with due dates &amp; answer keys.
                </p>
              </Link>

              <Link
                href="/teacher/students"
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 block transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-orange-300">
                    3. Student Performance &amp; Doubt Roster
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  View individual student scores, test marks, and attendance percentages.
                </p>
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Faculty Portal v2.6 &bull; Shri Pinnakedge</span>
            <span className="text-orange-400 font-semibold">{activeData.departmentChair}</span>
          </div>
        </div>
      </div>

      {/* QUICK UPLOAD MATERIAL MODAL */}
      <Modal
        isOpen={quickUploadModal}
        onClose={() => setQuickUploadModal(false)}
        title={`Upload ${activeData.subject} Learning Material`}
      >
        <form onSubmit={handlePublishMaterial} className="space-y-4">
          {uploadSuccess ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold">Material Published Successfully!</p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Enrolled students in {activeData.batches.join(', ')} can now download this PDF.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Document / Sheet Title
                </label>
                <input
                  type="text"
                  required
                  placeholder={`e.g. ${activeData.subject} Complete Formula Handbook 2026`}
                  value={materialTitle}
                  onChange={(e) => setMaterialTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Topic / Chapter Focus
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chapter 4 - Advanced Practice & Solved PYQs"
                  value={materialTopic}
                  onChange={(e) => setMaterialTopic(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Batches
                </label>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                  {activeData.batches.map((b, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-orange-600" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl border-2 border-dashed border-slate-200 text-center hover:border-orange-400 cursor-pointer bg-slate-50/50">
                <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <p className="text-xs font-semibold text-slate-700">Choose PDF / PPT file from device</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Maximum file size: 25 MB</p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setQuickUploadModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs"
                >
                  Publish to Students
                </button>
              </div>
            </>
          )}
        </form>
      </Modal>
    </DashboardShell>
  );
}
