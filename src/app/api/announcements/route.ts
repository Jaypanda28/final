import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/services/database';
import { AUTH_COOKIE_NAME, parseSessionToken } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const audience = searchParams.get('audience') || undefined;
    const batchId = searchParams.get('batchId') || undefined;

    const announcements = db.getAnnouncements(audience, batchId);
    return NextResponse.json({ success: true, count: announcements.length, announcements });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve announcements';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    const actor = parseSessionToken(token) || { id: 'usr-prn-01', name: 'Dr. Rajeshwar Sharma', role: 'principal' };

    const body = await req.json();
    if (!body.title || !body.content) {
      return NextResponse.json({ error: 'Title and content are required.' }, { status: 400 });
    }

    const created = db.addAnnouncement(
      {
        title: body.title,
        content: body.content,
        authorName: actor.name,
        authorRole: actor.role === 'principal' ? 'Principal' : actor.role === 'chairman' ? 'Chairman' : 'Teacher',
        targetAudience: body.targetAudience || 'all',
        targetBatchId: body.targetBatchId,
        targetBatchName: body.targetBatchName,
        priority: body.priority || 'normal',
      },
      actor
    );

    return NextResponse.json({ success: true, announcement: created }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create announcement';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
