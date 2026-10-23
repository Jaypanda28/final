import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/services/database';
import { createSessionToken, AUTH_COOKIE_NAME, DEMO_ACCOUNTS } from '@/lib/auth/session';
import { getRoleDashboardPath } from '@/lib/auth/roles';
import { UserRole } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, role: requestedRole, isDemo } = body;
    const identifier = (email || body.identifier || body.username || '').toString().trim();

    // Check if demo login requested
    if (isDemo) {
      // Find by provided identifier first, or fallback to role demoConfig
      let user = identifier ? db.getProfileByIdentifier(identifier) : null;
      if (!user && requestedRole) {
        const demoConfig = DEMO_ACCOUNTS[requestedRole as UserRole];
        if (demoConfig) {
          user = db.getProfileByIdentifier(demoConfig.email);
        }
      }

      // Fallback to first profile with matching role if any
      if (!user && requestedRole) {
        if (requestedRole === 'student') {
          user = db.getProfileByIdentifier('SPE-STU-2026-001') || db.getProfileByIdentifier('student.aarav@pinnakeedge.edu');
        } else if (requestedRole === 'teacher') {
          user = db.getProfileByIdentifier('SPE-TCH-001') || db.getProfileByIdentifier('avinash.rajput@pinnakeedge.edu');
        } else if (requestedRole === 'principal') {
          user = db.getProfileByIdentifier('SPE-PRN-01') || db.getProfileByIdentifier('principal@pinnakeedge.edu');
        } else if (requestedRole === 'chairman') {
          user = db.getProfileByIdentifier('SPE-CHR-01') || db.getProfileByIdentifier('chairman@pinnakeedge.edu');
        }
      }

      if (user) {
        const token = createSessionToken(user);
        const response = NextResponse.json({
          success: true,
          user,
          redirectUrl: getRoleDashboardPath(user.role),
        });
        response.cookies.set({
          name: AUTH_COOKIE_NAME,
          value: token,
          httpOnly: false, // accessible to client for sync
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          sameSite: 'lax',
        });

        db.logAudit(
          user,
          'USER_LOGGED_IN',
          'Session',
          user.id,
          `User ${user.name} logged in via Demo Portal as ${user.role.toUpperCase()}.`
        );

        return response;
      }

      return NextResponse.json(
        { error: `Could not initialize demo session for role "${requestedRole || 'unknown'}".` },
        { status: 400 }
      );
    }

    if (!identifier) {
      return NextResponse.json({ error: 'Email address or Institute ID is required' }, { status: 400 });
    }

    // Standard credential check (matches email, student ID, teacher ID, institute ID, or roll number)
    const user = db.getProfileByIdentifier(identifier);
    if (!user) {
      return NextResponse.json(
        {
          error: `No registered account found matching "${identifier}". Use your institutional email or ID (e.g. SPE-STU-2026-001, SPE-TCH-001, SPE-PRN-01, SPE-CHR-01).`,
        },
        { status: 401 }
      );
    }

    // Validate password (in dev/demo mode with mock/seed password or any non-empty input >= 4 chars)
    if (!password || password.length < 4) {
      return NextResponse.json({ error: 'Password must be at least 4 characters long' }, { status: 400 });
    }

    // Role verification: allow user and seamlessly direct them to their assigned role dashboard
    const redirectUrl = getRoleDashboardPath(user.role);
    const token = createSessionToken(user);
    const response = NextResponse.json({
      success: true,
      user,
      redirectUrl,
      roleMismatch: requestedRole && user.role !== requestedRole ? true : false,
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });

    db.logAudit(
      user,
      'USER_LOGGED_IN',
      'Session',
      user.id,
      `User ${user.name} (${user.instituteId || user.email}) logged in successfully as ${user.role.toUpperCase()}.`
    );

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Login failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
