import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/services/database';
import { AUTH_COOKIE_NAME, parseSessionToken } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get('courseId') || undefined;
  const batches = db.getBatches(courseId);
  return NextResponse.json({ success: true, count: batches.length, batches });
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    const actor = parseSessionToken(token) || { id: 'usr-prn-01', name: 'Principal Office', role: 'principal' };

    const body = await req.json();
    if (!body.name || !body.courseId || !body.startDate || !body.endDate) {
      return NextResponse.json({ error: 'Batch name, course, start date, and end date are required.' }, { status: 400 });
    }

    const batch = db.addBatch(
      {
        name: body.name,
        courseId: body.courseId,
        courseName: body.courseName || 'Course',
        academicSession: body.academicSession || '2026-2027',
        capacity: Number(body.capacity) || 35,
        startDate: body.startDate,
        endDate: body.endDate,
        status: 'active',
        roomNumber: body.roomNumber || 'Room 101',
      },
      actor
    );

    return NextResponse.json({ success: true, batch }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create batch';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
