import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/services/database';
import { AUTH_COOKIE_NAME, parseSessionToken } from '@/lib/auth/session';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    const actor = parseSessionToken(token) || { id: 'usr-stu-01', name: 'Aarav Patel', role: 'student' };

    const body = await req.json();
    const { answers, studentId, studentName } = body;

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'Answers payload is required' }, { status: 400 });
    }

    const attempt = db.submitExamAttempt(
      id,
      studentId || actor.id,
      studentName || actor.name,
      answers,
      actor
    );

    return NextResponse.json({
      success: true,
      message: 'Examination submitted and evaluated successfully',
      attempt: {
        id: attempt.id,
        examinationId: attempt.examinationId,
        studentId: attempt.studentId,
        submissionTime: attempt.submissionTime,
        status: attempt.status,
        totalScore: attempt.totalScore,
        maxScore: attempt.maxScore,
        percentage: attempt.percentage,
        passed: attempt.passed,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to submit examination';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
