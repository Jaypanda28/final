import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/services/database';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId') || undefined;
    const status = searchParams.get('status') || undefined;

    const invoices = db.getInvoices({ studentId, status });
    return NextResponse.json({ success: true, count: invoices.length, invoices });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve invoices';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
