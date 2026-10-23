import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/services/database';
import { AUTH_COOKIE_NAME, parseSessionToken } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId') || undefined;
    const batchId = searchParams.get('batchId') || undefined;
    const search = searchParams.get('search') || undefined;

    const materials = db.getStudyMaterials({ courseId, batchId, search });
    return NextResponse.json({ success: true, count: materials.length, materials });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve materials';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    const actor = parseSessionToken(token) || { id: 'usr-tch-01', name: 'Prof. Ananya Sen', role: 'teacher' };

    const body = await req.json();
    if (!body.title || !body.courseId || !body.subjectId || !body.topicTag) {
      return NextResponse.json({ error: 'Title, course, subject, and topic are required.' }, { status: 400 });
    }

    const material = db.addStudyMaterial(
      {
        title: body.title,
        description: body.description || '',
        courseId: body.courseId,
        courseName: body.courseName || 'Course',
        subjectId: body.subjectId,
        subjectName: body.subjectName || 'Subject',
        batchId: body.batchId || undefined,
        batchName: body.batchName || undefined,
        topicTag: body.topicTag,
        fileUrl: body.fileUrl || '/materials/sample_handbook.pdf',
        fileName: body.fileName || `${body.title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
        fileSizeBytes: body.fileSizeBytes || 2500000,
        fileType: body.fileType || 'pdf',
        uploadedByTeacherId: actor.id,
        uploadedByTeacherName: actor.name,
      },
      actor
    );

    return NextResponse.json({ success: true, material }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to upload material';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
