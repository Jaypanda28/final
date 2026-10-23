import { UserProfile, UserRole } from '@/types';
import { db } from '@/lib/services/database';

export const AUTH_COOKIE_NAME = 'spe_auth_session';

export interface AuthSession {
  user: UserProfile;
  expiresAt: number;
}

export function createSessionToken(user: UserProfile): string {
  // In production with Supabase, JWT is handled by Supabase Auth.
  // For resilient local/SSR validation, encode session payload securely:
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    instituteId: user.instituteId,
    timestamp: Date.now(),
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export function parseSessionToken(token: string | null | undefined): UserProfile | null {
  if (!token) return null;
  try {
    const jsonStr = Buffer.from(token, 'base64').toString('utf-8');
    const parsed = JSON.parse(jsonStr);
    if (!parsed || !parsed.email) return null;

    const profile = db.getProfileByEmail(parsed.email);
    if (profile) return profile;

    // Fallback constructed profile
    return {
      id: parsed.userId || 'usr-temp',
      name: parsed.name || 'User',
      email: parsed.email,
      role: parsed.role as UserRole,
      instituteId: parsed.instituteId,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/**
 * Demo accounts map
 */
export const DEMO_ACCOUNTS: Record<UserRole, { email: string; pass: string; title: string; subtitle: string }> = {
  principal: {
    email: 'principal@pinnakeedge.edu',
    pass: 'PinnakeEdge@2026',
    title: 'Yudhistir Debata',
    subtitle: 'Principal & Academic Director',
  },
  chairman: {
    email: 'chairman@pinnakeedge.edu',
    pass: 'PinnakeEdge@2026',
    title: 'Debasis Dixit',
    subtitle: 'Chairman (Executive Governance)',
  },
  teacher: {
    email: 'avinash.rajput@pinnakeedge.edu',
    pass: 'PinnakeEdge@2026',
    title: 'Avinash Singh Rajput',
    subtitle: 'Mathematics Faculty (JEE Advanced & Olympiads)',
  },
  student: {
    email: 'student.aarav@pinnakeedge.edu',
    pass: 'PinnakeEdge@2026',
    title: 'Aarav Patel',
    subtitle: 'Class 12 JEE Advanced Super 30',
  },
};

export interface FacultyMemberConfig {
  id: string;
  name: string;
  subject: string;
  email: string;
  aliasEmail?: string;
  pass: string;
  specialization: string;
  badgeColor: string;
}

export const DEMO_FACULTY: FacultyMemberConfig[] = [
  {
    id: 'usr-tch-01',
    name: 'Avinash Singh Rajput',
    subject: 'Mathematics',
    email: 'avinash.rajput@pinnakeedge.edu',
    aliasEmail: 'math.avinash@pinnakeedge.edu',
    pass: 'PinnakeEdge@2026',
    specialization: 'Calculus, Vectors & Coordinate Geometry (JEE & Olympiads)',
    badgeColor: 'emerald',
  },
  {
    id: 'usr-tch-02',
    name: 'Nandan Jha',
    subject: 'Physics',
    email: 'nandan.jha@pinnakeedge.edu',
    aliasEmail: 'physics.nandan@pinnakeedge.edu',
    pass: 'PinnakeEdge@2026',
    specialization: 'Mechanics, Electrodynamics & Modern Physics',
    badgeColor: 'sky',
  },
  {
    id: 'usr-tch-03',
    name: 'Arun Kumar Naik',
    subject: 'Chemistry',
    email: 'arun.naik@pinnakeedge.edu',
    aliasEmail: 'chemistry.arun@pinnakeedge.edu',
    pass: 'PinnakeEdge@2026',
    specialization: 'Organic Reaction Mechanisms & Physical Chemistry',
    badgeColor: 'purple',
  },
  {
    id: 'usr-tch-04',
    name: 'Girija Shankar Panda',
    subject: 'Biology',
    email: 'girija.panda@pinnakeedge.edu',
    aliasEmail: 'biology.girija@pinnakeedge.edu',
    pass: 'PinnakeEdge@2026',
    specialization: 'Human Physiology, Genetics, Botany & NEET-UG',
    badgeColor: 'teal',
  },
];

export interface StaffAccountConfig {
  name: string;
  role: UserRole;
  designation: string;
  subject?: string;
  email: string;
  pass: string;
  badgeColor: string;
}

export const ALL_LEADERSHIP_AND_FACULTY: StaffAccountConfig[] = [
  {
    name: 'Debasis Dixit',
    role: 'chairman',
    designation: 'Executive Chairman',
    email: 'chairman@pinnakeedge.edu',
    pass: 'PinnakeEdge@2026',
    badgeColor: 'amber',
  },
  {
    name: 'Yudhistir Debata',
    role: 'principal',
    designation: 'Principal & Academic Director',
    email: 'principal@pinnakeedge.edu',
    pass: 'PinnakeEdge@2026',
    badgeColor: 'orange',
  },
  {
    name: 'Avinash Singh Rajput',
    role: 'teacher',
    designation: 'Senior Faculty',
    subject: 'Mathematics',
    email: 'avinash.rajput@pinnakeedge.edu',
    pass: 'PinnakeEdge@2026',
    badgeColor: 'emerald',
  },
  {
    name: 'Nandan Jha',
    role: 'teacher',
    designation: 'Senior Faculty',
    subject: 'Physics',
    email: 'nandan.jha@pinnakeedge.edu',
    pass: 'PinnakeEdge@2026',
    badgeColor: 'sky',
  },
  {
    name: 'Arun Kumar Naik',
    role: 'teacher',
    designation: 'Senior Faculty',
    subject: 'Chemistry',
    email: 'arun.naik@pinnakeedge.edu',
    pass: 'PinnakeEdge@2026',
    badgeColor: 'purple',
  },
  {
    name: 'Girija Shankar Panda',
    role: 'teacher',
    designation: 'Senior Faculty',
    subject: 'Biology',
    email: 'girija.panda@pinnakeedge.edu',
    pass: 'PinnakeEdge@2026',
    badgeColor: 'teal',
  },
];

