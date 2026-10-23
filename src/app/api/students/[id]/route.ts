import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/services/database';
import { AUTH_COOKIE_NAME, parseSessionToken } from '@/lib/auth/session';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const student = db.getStudentById(id);
  if (!student) {
    return NextResponse.json({ error: 'Student not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, student });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    const actor = parseSessionToken(token) || { id: 'usr-prn-01', name: 'Principal Office', role: 'principal' };

    const body = await req.json();
    const updated = db.updateStudent(id, body, actor);
    if (!updated) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, student: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update student';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    const actor = parseSessionToken(token) || { id: 'usr-prn-01', name: 'Principal Office', role: 'principal' };

    // Soft deactivation per architectural rule (preserves historical fee and attendance records)
    const success = db.setStudentStatus(id, 'inactive', actor);
    if (!success) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Student safely deactivated / archived.' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to deactivate student';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
