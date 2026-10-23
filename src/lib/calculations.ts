import { AttendanceRecord, AttendanceStatus, Invoice, PaymentRecord } from '@/types';

/**
 * Formats a number into Indian Rupee Currency representation (e.g., ₹1,25,000)
 */
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats standard date into Indian standard DD-MM-YYYY
 */
export function formatDateIN(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '—';
  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return String(dateInput);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return String(dateInput);
  }
}

/**
 * Calculates student attendance percentage.
 * Policy: Excludes approved 'leave' from the denominator if configurable, or treats 'present' + 0.5 * 'late'
 */
export function calculateAttendancePercentage(
  records: AttendanceRecord[],
  options: { excludeLeaveFromDenominator?: boolean } = { excludeLeaveFromDenominator: true }
): {
  totalSessions: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  leaveCount: number;
  percentage: number;
  isLowAttendance: boolean;
} {
  if (!records || records.length === 0) {
    return {
      totalSessions: 0,
      presentCount: 0,
      absentCount: 0,
      lateCount: 0,
      leaveCount: 0,
      percentage: 100,
      isLowAttendance: false,
    };
  }

  let present = 0;
  let absent = 0;
  let late = 0;
  let leave = 0;

  for (const rec of records) {
    if (rec.status === 'present') present++;
    else if (rec.status === 'absent') absent++;
    else if (rec.status === 'late') late++;
    else if (rec.status === 'leave') leave++;
  }

  const denominator = options.excludeLeaveFromDenominator
    ? present + absent + late
    : present + absent + late + leave;

  // Late counts as 0.75 or full attendance depending on policy; we credit late as 0.8
  const attendedScore = present + late * 0.8;
  const percentage = denominator > 0 ? Math.min(100, Math.round((attendedScore / denominator) * 100)) : 100;

  return {
    totalSessions: records.length,
    presentCount: present,
    absentCount: absent,
    lateCount: late,
    leaveCount: leave,
    percentage,
    isLowAttendance: percentage < 75,
  };
}

/**
 * Calculates financial invoice balances and status
 */
export function calculateInvoiceBalance(
  totalAmount: number,
  discountAmount: number,
  amountPaid: number,
  dueDateString: string
): {
  netPayable: number;
  outstandingBalance: number;
  status: 'paid' | 'partially_paid' | 'pending' | 'overdue';
} {
  const netPayable = Math.max(0, totalAmount - (discountAmount || 0));
  const outstandingBalance = Math.max(0, netPayable - (amountPaid || 0));

  let status: 'paid' | 'partially_paid' | 'pending' | 'overdue' = 'pending';

  if (outstandingBalance === 0 && netPayable > 0) {
    status = 'paid';
  } else if (amountPaid > 0 && outstandingBalance > 0) {
    status = 'partially_paid';
  } else {
    // Check if overdue
    try {
      const parts = dueDateString.split('-');
      const dueDate = parts.length === 3 
        ? new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]))
        : new Date(dueDateString);
      
      if (!isNaN(dueDate.getTime()) && dueDate < new Date()) {
        status = 'overdue';
      } else {
        status = 'pending';
      }
    } catch {
      status = 'pending';
    }
  }

  return {
    netPayable,
    outstandingBalance,
    status,
  };
}

/**
 * Calculates examination score including negative marking
 */
export function calculateExamScore(
  questions: { id: string; marks: number; negativeMarks: number; correctOptionId?: string; correctAnswerText?: string }[],
  answers: Record<string, string>,
  passingMarks: number
): {
  totalMarks: number;
  obtainedMarks: number;
  correctAnswersCount: number;
  incorrectAnswersCount: number;
  unansweredCount: number;
  percentage: number;
  isPassed: boolean;
} {
  let totalMarks = 0;
  let obtainedMarks = 0;
  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;

  for (const q of questions) {
    totalMarks += q.marks;
    const studentAns = answers[q.id];

    if (!studentAns || studentAns.trim() === '') {
      unanswered++;
      continue;
    }

    const isMatch = q.correctOptionId 
      ? studentAns === q.correctOptionId 
      : studentAns.trim().toLowerCase() === (q.correctAnswerText || '').trim().toLowerCase();

    if (isMatch) {
      correct++;
      obtainedMarks += q.marks;
    } else {
      incorrect++;
      obtainedMarks -= q.negativeMarks || 0;
    }
  }

  // Score cannot be lower than 0
  obtainedMarks = Math.max(0, Math.round(obtainedMarks * 10) / 10);
  const percentage = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0;
  const isPassed = obtainedMarks >= passingMarks;

  return {
    totalMarks,
    obtainedMarks,
    correctAnswersCount: correct,
    incorrectAnswersCount: incorrect,
    unansweredCount: unanswered,
    percentage,
    isPassed,
  };
}
