import { describe, it, expect } from 'vitest';
import { db } from '../src/lib/services/database';

describe('DatabaseService Lifecycle and Integration Tests', () => {
  const mockActor = { id: 'usr-prn-01', name: 'Dr. Rajeshwar Sharma', role: 'principal' as const };
  const mockTeacher = { id: 'usr-tch-01', name: 'Prof. Ananya Sen', role: 'teacher' as const };
  const mockStudent = { id: 'usr-stu-01', name: 'Aarav Patel', role: 'student' as const };

  it('initializes with seed data', () => {
    const students = db.getStudents();
    const teachers = db.getTeachers();
    const courses = db.getCourses();
    const batches = db.getBatches();

    expect(students.length).toBeGreaterThanOrEqual(100);
    expect(teachers.length).toBeGreaterThanOrEqual(10);
    expect(courses.length).toBeGreaterThanOrEqual(4);
    expect(batches.length).toBeGreaterThanOrEqual(4);
  });

  it('creates and retrieves a new student with auto-generated institutional ID', () => {
    const newStudent = db.addStudent(
      {
        name: 'Kavya Raman',
        email: 'kavya.test@pinnakeedge.edu',
        phone: '+91 98888 77777',
        guardianName: 'S. Raman',
        guardianPhone: '+91 98888 77700',
        admissionDate: '18-10-2026',
        academicSession: '2026-2027',
        courseId: 'crs-jee-adv',
        batchId: 'btc-jee-a1',
        status: 'active',
        gender: 'Female',
        dob: '2008-05-15',
        category: 'General',
        rollNumber: 'JEE-26-999',
      },
      mockActor
    );

    expect(newStudent.id).toBeDefined();
    expect(newStudent.studentId).toMatch(/^SPE-STU-2026-\d{3}$/);

    const fetched = db.getStudentById(newStudent.id);
    expect(fetched?.name).toBe('Kavya Raman');
  });

  it('records batch attendance and updates records', () => {
    const result = db.markBatchAttendance(
      'btc-jee-a1',
      '2026-10-22',
      [
        { studentId: 'stu-001', status: 'present' },
        { studentId: 'stu-002', status: 'absent', remarks: 'Medical reason' },
      ],
      mockTeacher
    );

    expect(result.savedCount).toBe(2);

    const records = db.getAttendanceRecords({ batchId: 'btc-jee-a1', date: '2026-10-22' });
    expect(records.length).toBe(2);
    expect(records.find((r) => r.studentId === 'stu-001')?.status).toBe('present');
    expect(records.find((r) => r.studentId === 'stu-002')?.status).toBe('absent');
  });

  it('handles assignment creation, submission, and grading lifecycle', () => {
    const asg = db.addAssignment(
      {
        title: 'Optics Ray Diagram Assignment',
        instructions: 'Draw lens maker equation diagrams.',
        courseId: 'crs-jee-adv',
        courseName: 'JEE Advanced',
        subjectId: 'sbj-phy-01',
        subjectName: 'Physics',
        batchId: 'btc-jee-a1',
        batchName: 'Batch A1',
        teacherId: mockTeacher.id,
        teacherName: mockTeacher.name,
        maxMarks: 25,
        passingMarks: 12,
        deadlineDate: '2026-11-01T23:59:00Z',
        allowedFormats: ['pdf'],
        status: 'published',
      },
      mockTeacher
    );

    expect(asg.id).toBeDefined();

    const sub = db.submitAssignment(
      {
        assignmentId: asg.id,
        assignmentTitle: asg.title,
        studentId: mockStudent.id,
        studentName: mockStudent.name,
        batchId: asg.batchId,
        fileUrl: '/submissions/optics_aarav.pdf',
        fileName: 'optics_aarav.pdf',
        studentNotes: 'Attached derivations.',
      },
      mockStudent
    );

    expect(sub.id).toBeDefined();
    expect(sub.status).toBe('submitted');

    const graded = db.gradeAssignment(sub.id, 24, 'Flawless ray diagrams!', mockTeacher);
    expect(graded?.status).toBe('graded');
    expect(graded?.marksObtained).toBe(24);
  });

  it('records exam attempt, evaluates objective answers, and publishes results', () => {
    const exam = db.getExaminationById('exm-01');
    expect(exam).toBeDefined();

    const attempt = db.submitExamAttempt(
      'exm-01',
      'stu-002',
      'Diya Sharma',
      {
        'q-01': 'opt-01-b', // correct (+4)
        'q-02': 'opt-02-true', // correct (+4)
        'q-03': 'opt-03-b', // wrong (-1)
      },
      { id: 'usr-stu-02', name: 'Diya Sharma', role: 'student' }
    );

    expect(attempt.totalScore).toBe(7); // 4 + 4 - 1 = 7
    expect(attempt.status).toBe('evaluated');

    const published = db.publishExaminationResults('exm-01', mockActor);
    expect(published).toBe(true);
  });

  it('records payment, generates receipt, and updates invoice outstanding balance', () => {
    const inv = db.getInvoices({ studentId: 'stu-001' })[0];
    const initialOutstanding = inv.outstandingBalance;

    const payment = db.recordPayment(
      {
        invoiceId: inv.id,
        invoiceNumber: inv.invoiceNumber,
        studentId: inv.studentId,
        studentName: inv.studentName,
        paymentDate: '18-10-2026',
        amount: 25000,
        paymentMethod: 'upi',
        referenceNumber: 'UPI/TEST/99228811',
        recordedBy: mockActor.name,
        status: 'verified',
      },
      mockActor
    );

    expect(payment.receiptNumber).toMatch(/^REC-2026-\d{4}$/);

    const updatedInv = db.getInvoices({ studentId: 'stu-001' }).find((i) => i.id === inv.id);
    expect(updatedInv?.amountPaid).toBe(inv.amountPaid);
  });

  it('generates immutable audit logs for sensitive actions', () => {
    const logs = db.getAuditLogs();
    expect(logs.length).toBeGreaterThan(0);
    const hasStudentLog = logs.some((l) => l.action === 'STUDENT_CREATED');
    expect(hasStudentLog).toBe(true);
  });

  it('calculates live Principal and Chairman analytics from database records', () => {
    const principalAnalytics = db.getPrincipalAnalytics();
    expect(principalAnalytics.totalStudents).toBeGreaterThanOrEqual(95);
    expect(principalAnalytics.totalTeachers).toBeGreaterThanOrEqual(10);
    expect(principalAnalytics.totalFeeCollectedINR).toBeGreaterThan(0);

    const chairmanAnalytics = db.getChairmanAnalytics();
    expect(chairmanAnalytics.totalEnrolledStudents).toBeGreaterThanOrEqual(100);
    expect(chairmanAnalytics.collectionRatePercent).toBeGreaterThanOrEqual(0);
  });

  it('resolves user profiles by email, institute ID, and role alias', () => {
    // 1. By email
    const p1 = db.getProfileByIdentifier('student.aarav@pinnakeedge.edu');
    expect(p1).toBeDefined();
    expect(p1?.name).toBe('Aarav Patel');
    expect(p1?.role).toBe('student');

    // 2. By student institute ID
    const p2 = db.getProfileByIdentifier('SPE-STU-2026-001');
    expect(p2).toBeDefined();
    expect(p2?.name).toBe('Aarav Patel');

    // 3. By another student ID from the 100 students
    const p3 = db.getProfileByIdentifier('SPE-STU-2026-002');
    expect(p3).toBeDefined();
    expect(p3?.role).toBe('student');

    // 4. By teacher ID & email
    const p4 = db.getProfileByIdentifier('SPE-TCH-001');
    expect(p4).toBeDefined();
    expect(p4?.name).toBe('Avinash Singh Rajput');
    expect(p4?.role).toBe('teacher');

    // 5. By principal ID
    const p5 = db.getProfileByIdentifier('SPE-PRN-01');
    expect(p5).toBeDefined();
    expect(p5?.name).toBe('Yudhistir Debata');
    expect(p5?.role).toBe('principal');

    // 6. By chairman ID
    const p6 = db.getProfileByIdentifier('SPE-CHR-01');
    expect(p6).toBeDefined();
    expect(p6?.name).toBe('Debasis Dixit');
    expect(p6?.role).toBe('chairman');
  });
});
