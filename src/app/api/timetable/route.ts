import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/services/database';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const batchId = searchParams.get('batchId') || undefined;
  const sessions = db.getTimetable(batchId);
  return NextResponse.json({ success: true, count: sessions.length, sessions });
}
