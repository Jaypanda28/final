import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/services/database';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId') || undefined;

    const results = db.getResults(studentId);
    return NextResponse.json({ success: true, count: results.length, results });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve results';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
