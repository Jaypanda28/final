import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/services/database';
import { AUTH_COOKIE_NAME, parseSessionToken } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;

    const teachers = db.getTeachers(search);
    return NextResponse.json({ success: true, count: teachers.length, teachers });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve teachers';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    const actor = parseSessionToken(token) || { id: 'usr-prn-01', name: 'Principal Office', role: 'principal' };

    const body = await req.json();
    if (!body.name || !body.email || !body.phone || !body.specialization) {
      return NextResponse.json({ error: 'Name, email, phone, and specialization are required.' }, { status: 400 });
    }

    const created = db.addTeacher(
      {
        name: body.name,
        email: body.email,
        phone: body.phone,
        specialization: body.specialization,
        qualification: body.qualification || 'M.Sc / B.Tech',
        assignedSubjectIds: body.assignedSubjectIds || [],
        assignedSubjectNames: body.assignedSubjectNames || [],
        assignedBatchIds: body.assignedBatchIds || [],
        assignedBatchNames: body.assignedBatchNames || [],
        joiningDate: body.joiningDate || new Date().toISOString().slice(0, 10),
        status: 'active',
      },
      actor
    );

    return NextResponse.json({ success: true, teacher: created }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to appoint teacher';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
