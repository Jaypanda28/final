import { describe, it, expect } from 'vitest';
import {
  formatINR,
  formatDateIN,
  calculateAttendancePercentage,
  calculateInvoiceBalance,
  calculateExamScore,
} from '../src/lib/calculations';
import { AttendanceRecord } from '../src/types';

describe('Calculations Utility Tests', () => {
  describe('formatINR', () => {
    it('formats positive integers to INR currency string', () => {
      const formatted = formatINR(125000);
      expect(formatted).toContain('1,25,000');
    });

    it('handles zero and null', () => {
      expect(formatINR(0)).toContain('0');
      // @ts-expect-error testing null input
      expect(formatINR(null)).toContain('0');
    });
  });

  describe('calculateAttendancePercentage', () => {
    it('calculates 100% when all sessions are present', () => {
      const records: AttendanceRecord[] = [
        { id: '1', studentId: 's1', batchId: 'b1', date: '2026-10-01', status: 'present', markedByTeacherId: 't1', createdAt: '' },
        { id: '2', studentId: 's1', batchId: 'b1', date: '2026-10-02', status: 'present', markedByTeacherId: 't1', createdAt: '' },
      ];
      const result = calculateAttendancePercentage(records);
      expect(result.percentage).toBe(100);
      expect(result.isLowAttendance).toBe(false);
    });

    it('triggers isLowAttendance when percentage falls below 75%', () => {
      const records: AttendanceRecord[] = [
        { id: '1', studentId: 's1', batchId: 'b1', date: '2026-10-01', status: 'present', markedByTeacherId: 't1', createdAt: '' },
        { id: '2', studentId: 's1', batchId: 'b1', date: '2026-10-02', status: 'absent', markedByTeacherId: 't1', createdAt: '' },
        { id: '3', studentId: 's1', batchId: 'b1', date: '2026-10-03', status: 'absent', markedByTeacherId: 't1', createdAt: '' },
        { id: '4', studentId: 's1', batchId: 'b1', date: '2026-10-04', status: 'present', markedByTeacherId: 't1', createdAt: '' },
      ];
      const result = calculateAttendancePercentage(records);
      expect(result.percentage).toBe(50);
      expect(result.isLowAttendance).toBe(true);
    });
  });

  describe('calculateInvoiceBalance', () => {
    it('calculates net payable and outstanding balance properly', () => {
      const result = calculateInvoiceBalance(50000, 5000, 25000, '25-12-2026');
      expect(result.netPayable).toBe(45000);
      expect(result.outstandingBalance).toBe(20000);
      expect(result.status).toBe('partially_paid');
    });

    it('marks as paid when balance is zero', () => {
      const result = calculateInvoiceBalance(50000, 5000, 45000, '25-12-2026');
      expect(result.outstandingBalance).toBe(0);
      expect(result.status).toBe('paid');
    });
  });

  describe('calculateExamScore', () => {
    it('calculates marks and negative marking correctly', () => {
      const questions = [
        { id: 'q1', marks: 4, negativeMarks: 1, correctOptionId: 'opt-a' },
        { id: 'q2', marks: 4, negativeMarks: 1, correctOptionId: 'opt-b' },
        { id: 'q3', marks: 4, negativeMarks: 1, correctOptionId: 'opt-c' },
      ];
      const answers = {
        q1: 'opt-a', // correct +4
        q2: 'opt-c', // wrong -1
        // q3 unanswered 0
      };
      const result = calculateExamScore(questions, answers, 6);
      expect(result.totalMarks).toBe(12);
      expect(result.obtainedMarks).toBe(3); // 4 - 1 = 3
      expect(result.isPassed).toBe(false); // passing was 6
      expect(result.correctAnswersCount).toBe(1);
      expect(result.incorrectAnswersCount).toBe(1);
      expect(result.unansweredCount).toBe(1);
    });
  });
});
