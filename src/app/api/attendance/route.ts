import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/services/database';
import { AUTH_COOKIE_NAME, parseSessionToken } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const batchId = searchParams.get('batchId') || undefined;
    const studentId = searchParams.get('studentId') || undefined;
    const date = searchParams.get('date') || undefined;

    const records = db.getAttendanceRecords({ batchId, studentId, date });
    return NextResponse.json({ success: true, count: records.length, records });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve attendance';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    const actor = parseSessionToken(token) || { id: 'usr-tch-01', name: 'Faculty', role: 'teacher' };

    const body = await req.json();
    const { batchId, date, records } = body;

    if (!batchId || !date || !records || !Array.isArray(records)) {
      return NextResponse.json(
        { error: 'batchId, date, and student records array are required' },
        { status: 400 }
      );
    }

    const result = db.markBatchAttendance(batchId, date, records, actor);
    return NextResponse.json({ success: true, ...result });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to submit attendance';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
