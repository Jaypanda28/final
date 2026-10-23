'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Send,
  ArrowRight,
} from 'lucide-react';
import { Examination, Question } from '@/types';
import { Suspense } from 'react';

function TakeExamContent({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [exam, setExam] = useState<Examination | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(30 * 60); // 30 minutes
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scorecard, setScorecard] = useState<{
    totalScore: number;
    maxScore: number;
    percentage: number;
    passed: boolean;
  } | null>(null);

  const [currentUser, setCurrentUser] = useState<{ id: string; name: string }>({
    id: 'stu-001',
    name: 'Aarav Patel',
  });

  // Fetch exam questions and auth user
  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser({
            id: data.user.id || data.user.studentId || 'stu-001',
            name: data.user.name || 'Student',
          });
        }
      })
      .catch(() => {});

    fetch(`/api/examinations/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setExam(data.examination);
          setTimeLeftSeconds(data.examination.durationMinutes * 60);
        }
        setLoading(false);
      });
  }, [id]);

  // Timer countdown
  useEffect(() => {
    if (!exam || scorecard) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [exam, scorecard]);

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleAutoSubmit = () => {
    handleSubmit();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/examinations/${id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          studentId: currentUser.id,
          studentName: currentUser.name,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setScorecard({
          totalScore: data.attempt.totalScore,
          maxScore: data.attempt.maxScore,
          percentage: data.attempt.percentage,
          passed: data.attempt.passed,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xs">
        Loading examination secure environment...
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xs">
        Examination not found. <Link href="/student/examinations" className="underline ml-2">Back to Tests</Link>
      </div>
    );
  }

  const questions: Question[] = exam.questions || [];
  const currentQuestion = questions[currentQIndex];

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Test Engine Header */}
      <header className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800 shadow-md">
        <div>
          <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider block">
            Shri PinnakeEdge CBT Engine &bull; {exam.subjectName}
          </span>
          <h1 className="text-sm font-extrabold text-white truncate max-w-lg">{exam.title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="font-mono text-sm font-black text-amber-300">
              {formatTimer(timeLeftSeconds)}
            </span>
          </div>

          {!scorecard && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-xs transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Evaluating...' : 'Finish & Submit Exam'}
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {scorecard ? (
          /* RESULT SCORECARD MODAL / VIEW */
          <div className="lg:col-span-12 bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl text-center max-w-xl mx-auto space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Award className="w-9 h-9" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Evaluation Complete &bull; Verified
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-3">
                Official Examination Scorecard
              </h2>
              <p className="text-xs text-slate-500 mt-1">{exam.title}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Marks Obtained</span>
                <span className="text-2xl font-black text-orange-700 block">
                  {scorecard.totalScore} / {scorecard.maxScore}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Percentage</span>
                <span className="text-2xl font-black text-slate-900 block">{scorecard.percentage}%</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Result</span>
                <span className="text-2xl font-black text-emerald-600 block">
                  {scorecard.passed ? 'PASSED' : 'NEEDS REVISION'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Your objective questions have been evaluated by the server engine. Your rank and percentile will update on your results scorecard.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Link
                href="/student/results"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-orange-600 text-white hover:bg-orange-700 shadow-md flex items-center gap-2"
              >
                View Full Scorecards
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/student"
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Left Column: Active Question View */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Question {currentQIndex + 1} of {questions.length}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    +{currentQuestion.marks} Marks
                  </span>
                  {exam.negativeMarkingEnabled && (
                    <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      -{currentQuestion.negativeMarks} Negative
                    </span>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <div className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed mb-6">
                {currentQuestion.questionText}
              </div>

              {/* Options Selector */}
              <div className="space-y-3 mb-8">
                {currentQuestion.options?.map((opt, oIdx) => {
                  const isSelected = answers[currentQuestion.id] === opt.id;
                  const optionLetters = ['A', 'B', 'C', 'D'];

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3.5 ${
                        isSelected
                          ? 'border-orange-600 bg-orange-50/70 text-orange-950 font-semibold shadow-xs ring-1 ring-orange-600'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {optionLetters[oIdx] || oIdx + 1}
                      </span>
                      <span className="text-xs sm:text-sm">{opt.optionText}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={currentQIndex === 0}
                  onClick={() => setCurrentQIndex(currentQIndex - 1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <button
                  type="button"
                  disabled={currentQIndex === questions.length - 1}
                  onClick={() => setCurrentQIndex(currentQIndex + 1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-40"
                >
                  Next Question
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Question Palette */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                Question Palette Navigator
              </h3>

              <div className="grid grid-cols-5 gap-2.5 mb-6">
                {questions.map((q, idx) => {
                  const isAnswered = !!answers[q.id];
                  const isCurrent = idx === currentQIndex;

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentQIndex(idx)}
                      className={`h-10 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'ring-2 ring-orange-600 bg-orange-600 text-white shadow-xs'
                          : isAnswered
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded bg-emerald-600" />
                  <span className="text-slate-600">Answered ({Object.keys(answers).length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded bg-slate-200" />
                  <span className="text-slate-600">
                    Unanswered ({questions.length - Object.keys(answers).length})
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit All Answers
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function TakeExamPage(props: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xs">Loading examination environment...</div>}>
      <TakeExamContent {...props} />
    </Suspense>
  );
}
