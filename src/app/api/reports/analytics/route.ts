import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/services/database';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role') || 'principal';

    if (role === 'chairman') {
      const chairmanData = db.getChairmanAnalytics();
      return NextResponse.json({ success: true, role: 'chairman', analytics: chairmanData });
    }

    const principalData = db.getPrincipalAnalytics();
    return NextResponse.json({ success: true, role: 'principal', analytics: principalData });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to calculate analytics';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
