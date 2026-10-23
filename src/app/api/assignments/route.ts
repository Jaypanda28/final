import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/services/database';
import { AUTH_COOKIE_NAME, parseSessionToken } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const batchId = searchParams.get('batchId') || undefined;
    const courseId = searchParams.get('courseId') || undefined;

    const assignments = db.getAssignments({ batchId, courseId });
    return NextResponse.json({ success: true, count: assignments.length, assignments });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve assignments';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    const actor = parseSessionToken(token) || { id: 'usr-tch-01', name: 'Faculty', role: 'teacher' };

    const body = await req.json();
    if (!body.title || !body.batchId || !body.maxMarks || !body.deadlineDate) {
      return NextResponse.json({ error: 'Title, batch, maximum marks, and deadline date are required.' }, { status: 400 });
    }

    const created = db.addAssignment(
      {
        title: body.title,
        instructions: body.instructions || 'Follow problem set guidelines.',
        courseId: body.courseId || 'crs-jee-adv',
        courseName: body.courseName || 'Course',
        subjectId: body.subjectId || 'sbj-phy-01',
        subjectName: body.subjectName || 'Physics',
        batchId: body.batchId,
        batchName: body.batchName || 'Batch',
        teacherId: actor.id,
        teacherName: actor.name,
        maxMarks: Number(body.maxMarks),
        passingMarks: Number(body.passingMarks) || Math.round(Number(body.maxMarks) * 0.4),
        deadlineDate: body.deadlineDate,
        allowedFormats: body.allowedFormats || ['pdf', 'docx', 'jpg'],
        status: 'published',
      },
      actor
    );

    return NextResponse.json({ success: true, assignment: created }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create assignment';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
