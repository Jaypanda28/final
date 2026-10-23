import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/services/database';
import { AUTH_COOKIE_NAME, parseSessionToken } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    const actor = parseSessionToken(token);

    // Section 24: Audit logs must only be accessible to Principal and Chairman
    if (actor && actor.role !== 'principal' && actor.role !== 'chairman') {
      return NextResponse.json({ error: 'Access forbidden: Restricted to administrative audit.' }, { status: 403 });
    }

    const logs = db.getAuditLogs();
    return NextResponse.json({ success: true, count: logs.length, logs });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve audit logs';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
