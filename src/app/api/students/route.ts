import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/services/database';
import { AUTH_COOKIE_NAME, parseSessionToken } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const batchId = searchParams.get('batchId') || undefined;
    const courseId = searchParams.get('courseId') || undefined;
    const status = searchParams.get('status') || undefined;

    const students = db.getStudents({ search, batchId, courseId, status });
    return NextResponse.json({ success: true, count: students.length, students });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve students';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    const actor = parseSessionToken(token) || { id: 'usr-prn-01', name: 'Principal Office', role: 'principal' };

    const body = await req.json();
    if (!body.name || !body.email || !body.phone || !body.courseId || !body.batchId) {
      return NextResponse.json(
        { error: 'Name, email, phone, course, and batch are mandatory fields.' },
        { status: 400 }
      );
    }

    const created = db.addStudent(
      {
        name: body.name,
        email: body.email,
        phone: body.phone,
        guardianName: body.guardianName || 'Guardian',
        guardianPhone: body.guardianPhone || body.phone,
        admissionDate: body.admissionDate || new Date().toISOString().slice(0, 10),
        academicSession: body.academicSession || '2026-2027',
        courseId: body.courseId,
        courseName: body.courseName || 'Enrolled Course',
        batchId: body.batchId,
        batchName: body.batchName || 'Enrolled Batch',
        address: body.address || '',
        status: 'active',
        gender: body.gender || 'Male',
        dob: body.dob || '2008-01-01',
        category: body.category || 'General',
        rollNumber: body.rollNumber || `ROL-${Date.now().toString().slice(-4)}`,
      },
      actor
    );

    return NextResponse.json({ success: true, student: created }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create student';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
