import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/services/database';
import { AUTH_COOKIE_NAME, parseSessionToken } from '@/lib/auth/session';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    const actor = parseSessionToken(token) || { id: 'usr-stu-01', name: 'Aarav Patel', role: 'student' };

    const body = await req.json();
    const submission = db.submitAssignment(
      {
        assignmentId: id,
        assignmentTitle: body.assignmentTitle,
        studentId: body.studentId || actor.id,
        studentName: body.studentName || actor.name,
        batchId: body.batchId || 'btc-jee-a1',
        fileUrl: body.fileUrl || '/submissions/student_work.pdf',
        fileName: body.fileName || 'submission.pdf',
        studentNotes: body.studentNotes,
      },
      actor
    );

    return NextResponse.json({ success: true, submission }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to submit assignment';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
