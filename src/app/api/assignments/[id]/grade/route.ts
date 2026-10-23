import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/services/database';
import { AUTH_COOKIE_NAME, parseSessionToken } from '@/lib/auth/session';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // submissionId or assignmentId
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    const actor = parseSessionToken(token) || { id: 'usr-tch-01', name: 'Prof. Ananya Sen', role: 'teacher' };

    const body = await req.json();
    const { submissionId, marks, feedback } = body;

    const targetSubId = submissionId || id;
    const graded = db.gradeAssignment(targetSubId, Number(marks), feedback || '', actor);

    if (!graded) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, submission: graded });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to grade submission';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
