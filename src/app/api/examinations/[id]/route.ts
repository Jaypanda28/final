import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/services/database';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const examination = db.getExaminationById(id);
  if (!examination) {
    return NextResponse.json({ error: 'Examination not found' }, { status: 404 });
  }

  // Security rule (Section 15): Never send correct answers to the student before publication
  const sanitizedQuestions = (examination.questions || []).map((q) => ({
    id: q.id,
    questionText: q.questionText,
    questionType: q.questionType,
    marks: q.marks,
    negativeMarks: q.negativeMarks,
    orderIndex: q.orderIndex,
    options: q.options?.map((opt) => ({
      id: opt.id,
      optionText: opt.optionText,
      // Don't send isCorrect flag to client!
    })),
  }));

  return NextResponse.json({
    success: true,
    examination: {
      ...examination,
      questions: sanitizedQuestions,
    },
  });
}
