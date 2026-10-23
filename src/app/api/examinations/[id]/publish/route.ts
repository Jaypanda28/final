import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/services/database';
import { AUTH_COOKIE_NAME, parseSessionToken } from '@/lib/auth/session';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    const actor = parseSessionToken(token) || { id: 'usr-prn-01', name: 'Dr. Rajeshwar Sharma', role: 'principal' };

    // Verify role has authorization to publish
    if (actor.role !== 'principal' && actor.role !== 'teacher') {
      return NextResponse.json({ error: 'Unauthorized to publish examination results.' }, { status: 403 });
    }

    const success = db.publishExaminationResults(id, actor);
    if (!success) {
      return NextResponse.json({ error: 'Examination not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Examination results officially published to students.' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to publish results';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
