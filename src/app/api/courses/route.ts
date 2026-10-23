import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/services/database';
import { AUTH_COOKIE_NAME, parseSessionToken } from '@/lib/auth/session';

export async function GET() {
  const courses = db.getCourses();
  return NextResponse.json({ success: true, count: courses.length, courses });
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    const actor = parseSessionToken(token) || { id: 'usr-prn-01', name: 'Principal Office', role: 'principal' };

    const body = await req.json();
    if (!body.name || !body.code || !body.feeAmount) {
      return NextResponse.json({ error: 'Course name, code, and fee amount are required.' }, { status: 400 });
    }

    const course = db.addCourse(
      {
        name: body.name,
        code: body.code,
        description: body.description || '',
        duration: body.duration || '1 Year',
        academicSession: body.academicSession || '2026-2027',
        feeAmount: Number(body.feeAmount),
        status: 'active',
      },
      actor
    );

    return NextResponse.json({ success: true, course }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create course';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
