import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, parseSessionToken } from '@/lib/auth/session';
import { db } from '@/lib/services/database';

export async function POST(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const user = parseSessionToken(token);

  if (user) {
    db.logAudit(user, 'USER_LOGGED_OUT', 'Session', user.id, `User ${user.name} logged out.`);
  }

  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.delete(AUTH_COOKIE_NAME);
  return response;
}
