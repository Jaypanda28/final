import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/services/database';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const batchId = searchParams.get('batchId') || undefined;
    const courseId = searchParams.get('courseId') || undefined;

    const examinations = db.getExaminations({ batchId, courseId });
    return NextResponse.json({ success: true, count: examinations.length, examinations });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve examinations';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
