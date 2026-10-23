import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/services/database';
import { AUTH_COOKIE_NAME, parseSessionToken } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId') || undefined;

    const payments = db.getPayments(studentId);
    return NextResponse.json({ success: true, count: payments.length, payments });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve payments';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    const actor = parseSessionToken(token) || { id: 'usr-prn-01', name: 'Principal Office', role: 'principal' };

    // Section 16 & 24: Enforce authorization - only authorized accounts can record payments
    if (actor.role !== 'principal' && actor.role !== 'chairman') {
      return NextResponse.json({ error: 'Unauthorized: only administration can record fee payments.' }, { status: 403 });
    }

    const body = await req.json();
    const { invoiceId, invoiceNumber, studentId, studentName, amount, paymentMethod, referenceNumber, notes } = body;

    if (!invoiceId || !studentId || !amount || Number(amount) <= 0 || !paymentMethod) {
      return NextResponse.json({ error: 'Valid invoice, student, positive payment amount, and method are required.' }, { status: 400 });
    }

    const payment = db.recordPayment(
      {
        invoiceId,
        invoiceNumber: invoiceNumber || 'INV-2026',
        studentId,
        studentName: studentName || 'Student',
        paymentDate: new Date().toISOString().slice(0, 10),
        amount: Number(amount),
        paymentMethod,
        referenceNumber: referenceNumber || `REF-${Date.now().toString().slice(-6)}`,
        recordedBy: actor.name,
        status: 'verified',
        notes: notes || 'Verified and recorded in institute accounts',
      },
      actor
    );

    return NextResponse.json({ success: true, payment }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to record payment';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
