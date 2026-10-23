import {
  Student,
  Teacher,
  Course,
  Subject,
  Batch,
  TimetableSession,
  AttendanceRecord,
  AttendanceStatus,
  StudyMaterial,
  Assignment,
  AssignmentSubmission,
  Examination,
  ExaminationAttempt,
  ExaminationResult,
  Invoice,
  PaymentRecord,
  Announcement,
  AuditLog,
  UserProfile,
  PrincipalAnalytics,
  ChairmanAnalytics,
  UserRole,
} from '@/types';
import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_COURSES,
  INITIAL_SUBJECTS,
  INITIAL_BATCHES,
  INITIAL_TIMETABLE,
  INITIAL_ATTENDANCE,
  INITIAL_STUDY_MATERIALS,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_EXAMS,
  INITIAL_ATTEMPTS,
  INITIAL_RESULTS,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_AUDIT_LOGS,
  DEMO_PROFILES,
} from '@/lib/data/seed-data';
import { calculateInvoiceBalance, calculateExamScore, calculateAttendancePercentage } from '@/lib/calculations';

// In-Memory Database state that persists during server runtime and supports atomic updates
interface DatabaseStore {
  profiles: UserProfile[];
  students: Student[];
  teachers: Teacher[];
  courses: Course[];
  subjects: Subject[];
  batches: Batch[];
  timetable: TimetableSession[];
  attendance: AttendanceRecord[];
  materials: StudyMaterial[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  examinations: Examination[];
  attempts: ExaminationAttempt[];
  results: ExaminationResult[];
  invoices: Invoice[];
  payments: PaymentRecord[];
  announcements: Announcement[];
  auditLogs: AuditLog[];
}

class DatabaseService {
  private static instance: DatabaseService;
  private store: DatabaseStore;

  private constructor() {
    this.store = {
      profiles: [...DEMO_PROFILES],
      students: [...INITIAL_STUDENTS],
      teachers: [...INITIAL_TEACHERS],
      courses: [...INITIAL_COURSES],
      subjects: [...INITIAL_SUBJECTS],
      batches: [...INITIAL_BATCHES],
      timetable: [...INITIAL_TIMETABLE],
      attendance: [...INITIAL_ATTENDANCE],
      materials: [...INITIAL_STUDY_MATERIALS],
      assignments: [...INITIAL_ASSIGNMENTS],
      submissions: [...INITIAL_SUBMISSIONS],
      examinations: [...INITIAL_EXAMS],
      attempts: [...INITIAL_ATTEMPTS],
      results: [...INITIAL_RESULTS],
      invoices: [...INITIAL_INVOICES],
      payments: [...INITIAL_PAYMENTS],
      announcements: [...INITIAL_ANNOUNCEMENTS],
      auditLogs: [...INITIAL_AUDIT_LOGS],
    };
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    } else {
      // Ensure in-memory store always synchronizes with newly seeded leadership and faculty profiles
      DEMO_PROFILES.forEach((dp) => {
        const idx = DatabaseService.instance.store.profiles.findIndex(
          (p) => p.email.toLowerCase() === dp.email.toLowerCase() || p.id === dp.id
        );
        if (idx !== -1) {
          DatabaseService.instance.store.profiles[idx] = { ...dp };
        } else {
          DatabaseService.instance.store.profiles.push({ ...dp });
        }
      });

      INITIAL_TEACHERS.slice(0, 4).forEach((it) => {
        const idx = DatabaseService.instance.store.teachers.findIndex((t) => t.id === it.id);
        if (idx !== -1) {
          DatabaseService.instance.store.teachers[idx] = { ...it };
        } else {
          DatabaseService.instance.store.teachers.unshift({ ...it });
        }
      });
    }
    return DatabaseService.instance;
  }

  // ==========================================
  // AUDIT LOG HELPER
  // ==========================================
  public logAudit(
    actor: { id: string; name: string; role: UserRole },
    action: string,
    targetEntity: string,
    targetId: string,
    details: string
  ): AuditLog {
    const entry: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action,
      targetEntity,
      targetId,
      details,
      ipAddress: '127.0.0.1',
    };
    this.store.auditLogs.unshift(entry);
    return entry;
  }

  public getAuditLogs(): AuditLog[] {
    return [...this.store.auditLogs];
  }

  // ==========================================
  // ==========================================
  // AUTH & PROFILES
  // ==========================================
  public getProfileByIdentifier(identifier: string): UserProfile | undefined {
    if (!identifier) return undefined;
    const clean = identifier.trim().toLowerCase();

    // 1. Check existing profiles
    const p = this.store.profiles.find(
      (prof) =>
        prof.email.toLowerCase() === clean ||
        prof.id.toLowerCase() === clean ||
        (prof.instituteId && prof.instituteId.toLowerCase() === clean)
    );
    if (p) return p;

    // 2. Check leadership shorthand / alias
    if (clean === 'principal@pinnakeedge.edu' || clean === 'spe-prn-01' || clean === 'principal' || clean === 'yudhistir.debata@pinnakeedge.edu') {
      const prn = this.store.profiles.find((x) => x.role === 'principal');
      if (prn) return prn;
    }
    if (clean === 'chairman@pinnakeedge.edu' || clean === 'spe-chr-01' || clean === 'chairman' || clean === 'debasis.dixit@pinnakeedge.edu') {
      const chr = this.store.profiles.find((x) => x.role === 'chairman');
      if (chr) return chr;
    }

    // 3. Search in teachers (all 10 faculty members)
    const t = this.store.teachers.find(
      (tch) =>
        tch.email.toLowerCase() === clean ||
        tch.id.toLowerCase() === clean ||
        tch.teacherId.toLowerCase() === clean ||
        tch.name.toLowerCase() === clean
    );
    if (t) {
      const teacherProfile: UserProfile = {
        id: t.id,
        name: t.name,
        email: t.email,
        role: 'teacher',
        instituteId: t.teacherId,
        phone: t.phone,
        status: t.status === 'on_leave' ? 'inactive' : t.status,
        createdAt: t.joiningDate || new Date().toISOString(),
      };
      this.store.profiles.push(teacherProfile);
      return teacherProfile;
    }

    // 4. Search in students (all 100 enrolled students)
    const s = this.store.students.find(
      (stu) =>
        stu.email.toLowerCase() === clean ||
        stu.id.toLowerCase() === clean ||
        stu.studentId.toLowerCase() === clean ||
        (stu.rollNumber && stu.rollNumber.toLowerCase() === clean) ||
        stu.name.toLowerCase() === clean
    );
    if (s) {
      const studentProfile: UserProfile = {
        id: s.id,
        name: s.name,
        email: s.email,
        role: 'student',
        instituteId: s.studentId,
        phone: s.phone,
        status: s.status === 'graduated' ? 'inactive' : s.status,
        createdAt: s.admissionDate || new Date().toISOString(),
      };
      this.store.profiles.push(studentProfile);
      return studentProfile;
    }

    return undefined;
  }

  public getProfileByEmail(email: string): UserProfile | undefined {
    return this.getProfileByIdentifier(email);
  }

  public getProfileById(id: string): UserProfile | undefined {
    return this.getProfileByIdentifier(id);
  }

  // ==========================================
  // STUDENTS MODULE
  // ==========================================
  public getStudents(filters?: {
    courseId?: string;
    batchId?: string;
    search?: string;
    status?: string;
  }): Student[] {
    let list = [...this.store.students];
    if (filters?.courseId) {
      list = list.filter((s) => s.courseId === filters.courseId);
    }
    if (filters?.batchId) {
      list = list.filter((s) => s.batchId === filters.batchId);
    }
    if (filters?.status && filters.status !== 'all') {
      list = list.filter((s) => s.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.studentId.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          (s.rollNumber && s.rollNumber.toLowerCase().includes(q))
      );
    }
    return list;
  }

  public getStudentById(id: string): Student | undefined {
    if (!id) return undefined;
    const clean = id.trim().toLowerCase();
    if (clean === 'usr-stu-01') return this.store.students.find((s) => s.id === 'stu-001');
    return this.store.students.find(
      (s) =>
        s.id.toLowerCase() === clean ||
        s.studentId.toLowerCase() === clean ||
        s.email.toLowerCase() === clean
    );
  }

  public addStudent(
    studentData: Omit<Student, 'id' | 'studentId'>,
    actor: { id: string; name: string; role: UserRole }
  ): Student {
    const nextNum = this.store.students.length + 1;
    const studentId = `SPE-STU-2026-${String(nextNum).padStart(3, '0')}`;
    const newStudent: Student = {
      ...studentData,
      id: `stu-${String(nextNum).padStart(3, '0')}`,
      studentId,
    };
    this.store.students.unshift(newStudent);

    // Update batch enrolled count
    const batch = this.store.batches.find((b) => b.id === newStudent.batchId);
    if (batch) {
      batch.enrolledCount += 1;
    }

    this.logAudit(
      actor,
      'STUDENT_CREATED',
      'Student',
      studentId,
      `Admitted new student ${newStudent.name} (${studentId}) to batch ${newStudent.batchName || newStudent.batchId}.`
    );

    return newStudent;
  }

  public updateStudent(
    id: string,
    updates: Partial<Student>,
    actor: { id: string; name: string; role: UserRole }
  ): Student | undefined {
    const index = this.store.students.findIndex((s) => s.id === id || s.studentId === id);
    if (index === -1) return undefined;

    const existing = this.store.students[index];
    const updated: Student = { ...existing, ...updates };
    this.store.students[index] = updated;

    this.logAudit(
      actor,
      'STUDENT_UPDATED',
      'Student',
      existing.studentId,
      `Updated details for student ${existing.name} (${existing.studentId}).`
    );

    return updated;
  }

  public setStudentStatus(
    id: string,
    status: 'active' | 'inactive' | 'graduated' | 'suspended',
    actor: { id: string; name: string; role: UserRole }
  ): boolean {
    const student = this.getStudentById(id);
    if (!student) return false;
    student.status = status;
    this.logAudit(
      actor,
      'STUDENT_STATUS_CHANGED',
      'Student',
      student.studentId,
      `Changed status of student ${student.name} to ${status}.`
    );
    return true;
  }

  // ==========================================
  // TEACHERS MODULE
  // ==========================================
  public getTeachers(search?: string): Teacher[] {
    let list = [...this.store.teachers];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.teacherId.toLowerCase().includes(q) ||
          t.specialization.toLowerCase().includes(q)
      );
    }
    return list;
  }

  public getTeacherById(id: string): Teacher | undefined {
    if (!id) return undefined;
    const clean = id.trim().toLowerCase();
    if (clean === 'usr-tch-01' || clean === 'usr-tch-01b' || clean === 'usr-tch-01c') return this.store.teachers.find((t) => t.id === 'tch-01');
    if (clean === 'usr-tch-02' || clean === 'usr-tch-02b') return this.store.teachers.find((t) => t.id === 'tch-02');
    if (clean === 'usr-tch-03' || clean === 'usr-tch-03b') return this.store.teachers.find((t) => t.id === 'tch-03');
    if (clean === 'usr-tch-04' || clean === 'usr-tch-04b') return this.store.teachers.find((t) => t.id === 'tch-04');
    return this.store.teachers.find(
      (t) =>
        t.id.toLowerCase() === clean ||
        t.teacherId.toLowerCase() === clean ||
        t.email.toLowerCase() === clean
    );
  }

  public addTeacher(
    teacherData: Omit<Teacher, 'id' | 'teacherId'>,
    actor: { id: string; name: string; role: UserRole }
  ): Teacher {
    const nextNum = this.store.teachers.length + 1;
    const teacherId = `SPE-TCH-${String(nextNum).padStart(3, '0')}`;
    const newTeacher: Teacher = {
      ...teacherData,
      id: `tch-${String(nextNum).padStart(2, '0')}`,
      teacherId,
    };
    this.store.teachers.push(newTeacher);

    this.logAudit(
      actor,
      'TEACHER_APPOINTED',
      'Teacher',
      teacherId,
      `Appointed faculty member ${newTeacher.name} (${teacherId}) specializing in ${newTeacher.specialization}.`
    );

    return newTeacher;
  }

  // ==========================================
  // COURSES & BATCHES MODULE
  // ==========================================
  public getCourses(): Course[] {
    return [...this.store.courses];
  }

  public getBatches(courseId?: string): Batch[] {
    if (courseId) {
      return this.store.batches.filter((b) => b.courseId === courseId);
    }
    return [...this.store.batches];
  }

  public addCourse(courseData: Omit<Course, 'id'>, actor: { id: string; name: string; role: UserRole }): Course {
    const newCourse: Course = {
      ...courseData,
      id: `crs-${Date.now()}`,
    };
    this.store.courses.push(newCourse);
    this.logAudit(actor, 'COURSE_CREATED', 'Course', newCourse.code, `Launched new course ${newCourse.name}.`);
    return newCourse;
  }

  public addBatch(batchData: Omit<Batch, 'id' | 'enrolledCount'>, actor: { id: string; name: string; role: UserRole }): Batch {
    const newBatch: Batch = {
      ...batchData,
      id: `btc-${Date.now()}`,
      enrolledCount: 0,
    };
    this.store.batches.push(newBatch);
    this.logAudit(actor, 'BATCH_CREATED', 'Batch', newBatch.id, `Created batch ${newBatch.name} under ${newBatch.courseName}.`);
    return newBatch;
  }

  public getTimetable(batchId?: string): TimetableSession[] {
    if (batchId) {
      const list = this.store.timetable.filter((t) => t.batchId === batchId);
      if (list.length > 0) return list;
      const batch = this.store.batches.find((b) => b.id === batchId);
      return this.store.timetable.slice(0, 4).map((s, idx) => ({
        ...s,
        id: `tt-${batchId}-${idx}`,
        batchId,
        batchName: batch?.name || s.batchName,
      }));
    }
    return [...this.store.timetable];
  }

  // ==========================================
  // ATTENDANCE MODULE
  // ==========================================
  public getAttendanceRecords(filters: { batchId?: string; studentId?: string; date?: string }): AttendanceRecord[] {
    let list = [...this.store.attendance];
    if (filters.batchId) {
      list = list.filter((r) => r.batchId === filters.batchId);
    }
    if (filters.studentId) {
      const student = this.getStudentById(filters.studentId);
      const targetIds = [filters.studentId.toLowerCase()];
      if (student) {
        targetIds.push(student.id.toLowerCase(), student.studentId.toLowerCase());
      }
      let studentRecords = list.filter((r) => targetIds.includes(r.studentId.toLowerCase()));

      // If no records in storage yet for this student, seed a realistic attendance history
      if (studentRecords.length === 0 && student) {
        const sampleDates = [
          '2026-10-10', '2026-10-11', '2026-10-12', '2026-10-13',
          '2026-10-14', '2026-10-15', '2026-10-16', '2026-10-17', '2026-10-18'
        ];
        sampleDates.forEach((d, idx) => {
          const isLate = idx === 3;
          const rec: AttendanceRecord = {
            id: `att-${student.id}-${idx}`,
            studentId: student.id,
            studentName: student.name,
            rollNumber: student.rollNumber,
            batchId: student.batchId,
            date: d,
            status: isLate ? 'late' : 'present',
            markedByTeacherId: 'tch-01',
            createdAt: `${d}T09:00:00Z`,
          };
          this.store.attendance.push(rec);
          studentRecords.push(rec);
        });
      }
      list = studentRecords;
    }
    if (filters.date) {
      list = list.filter((r) => r.date === filters.date);
    }
    return list;
  }

  public markBatchAttendance(
    batchId: string,
    date: string,
    records: { studentId: string; status: AttendanceStatus; remarks?: string }[],
    actor: { id: string; name: string; role: UserRole }
  ): { savedCount: number } {
    let count = 0;
    for (const item of records) {
      const student = this.getStudentById(item.studentId);
      // Check if record exists for this student on this date
      const existingIdx = this.store.attendance.findIndex(
        (r) => r.batchId === batchId && r.studentId === item.studentId && r.date === date
      );

      if (existingIdx >= 0) {
        // Record update/correction
        const prev = this.store.attendance[existingIdx];
        this.store.attendance[existingIdx] = {
          ...prev,
          status: item.status,
          remarks: item.remarks || prev.remarks,
          isCorrected: true,
          correctionHistory: [
            ...(prev.correctionHistory || []),
            {
              originalStatus: prev.status,
              correctedBy: actor.name,
              correctedAt: new Date().toISOString(),
              reason: item.remarks || 'Authorized attendance update',
            },
          ],
        };
      } else {
        // New record
        this.store.attendance.push({
          id: `att-${Date.now()}-${count}`,
          studentId: item.studentId,
          studentName: student?.name,
          rollNumber: student?.rollNumber,
          batchId,
          date,
          status: item.status,
          markedByTeacherId: actor.id,
          remarks: item.remarks,
          createdAt: new Date().toISOString(),
        });
      }
      count++;
    }

    this.logAudit(
      actor,
      'ATTENDANCE_RECORDED',
      'BatchAttendance',
      `${batchId}-${date}`,
      `Recorded attendance for ${count} students in batch for date ${date}.`
    );

    return { savedCount: count };
  }

  // ==========================================
  // STUDY MATERIALS MODULE
  // ==========================================
  public getStudyMaterials(filters?: { courseId?: string; subjectId?: string; batchId?: string; search?: string }): StudyMaterial[] {
    let list = [...this.store.materials];
    if (filters?.courseId) {
      list = list.filter((m) => m.courseId === filters.courseId);
    }
    if (filters?.batchId) {
      list = list.filter((m) => !m.batchId || m.batchId === filters.batchId);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.topicTag.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q)
      );
    }
    return list;
  }

  public addStudyMaterial(
    material: Omit<StudyMaterial, 'id' | 'uploadDate' | 'downloadCount'>,
    actor: { id: string; name: string; role: UserRole }
  ): StudyMaterial {
    const newMaterial: StudyMaterial = {
      ...material,
      id: `mat-${Date.now()}`,
      uploadDate: new Date().toISOString().slice(0, 10),
      downloadCount: 0,
    };
    this.store.materials.unshift(newMaterial);
    this.logAudit(
      actor,
      'STUDY_MATERIAL_UPLOADED',
      'StudyMaterial',
      newMaterial.id,
      `Uploaded note: "${newMaterial.title}" under ${newMaterial.topicTag}.`
    );
    return newMaterial;
  }

  // ==========================================
  // ASSIGNMENTS & SUBMISSIONS MODULE
  // ==========================================
  public getAssignments(filters?: { batchId?: string; courseId?: string }): Assignment[] {
    let list = [...this.store.assignments];
    if (filters?.batchId) {
      list = list.filter((a) => a.batchId === filters.batchId);
    }
    return list;
  }

  public getSubmissions(assignmentId?: string, studentId?: string): AssignmentSubmission[] {
    let list = [...this.store.submissions];
    if (assignmentId) {
      list = list.filter((s) => s.assignmentId === assignmentId);
    }
    if (studentId) {
      list = list.filter((s) => s.studentId === studentId);
    }
    return list;
  }

  public addAssignment(
    assignment: Omit<Assignment, 'id' | 'createdAt' | 'submissionsCount' | 'gradedCount'>,
    actor: { id: string; name: string; role: UserRole }
  ): Assignment {
    const newAsg: Assignment = {
      ...assignment,
      id: `asg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      submissionsCount: 0,
      gradedCount: 0,
    };
    this.store.assignments.unshift(newAsg);
    this.logAudit(actor, 'ASSIGNMENT_CREATED', 'Assignment', newAsg.id, `Created assignment "${newAsg.title}" for ${newAsg.batchName}.`);
    return newAsg;
  }

  public submitAssignment(
    submission: Omit<AssignmentSubmission, 'id' | 'submissionDate' | 'status'>,
    actor: { id: string; name: string; role: UserRole }
  ): AssignmentSubmission {
    const existingIdx = this.store.submissions.findIndex(
      (s) => s.assignmentId === submission.assignmentId && s.studentId === submission.studentId
    );

    const newSub: AssignmentSubmission = {
      ...submission,
      id: existingIdx >= 0 ? this.store.submissions[existingIdx].id : `sub-${Date.now()}`,
      submissionDate: new Date().toISOString(),
      status: 'submitted',
    };

    if (existingIdx >= 0) {
      this.store.submissions[existingIdx] = newSub;
    } else {
      this.store.submissions.unshift(newSub);
      // update assignment submissionsCount
      const asg = this.store.assignments.find((a) => a.id === submission.assignmentId);
      if (asg) {
        asg.submissionsCount = (asg.submissionsCount || 0) + 1;
      }
    }

    this.logAudit(actor, 'ASSIGNMENT_SUBMITTED', 'AssignmentSubmission', newSub.id, `Submitted assignment work for ${submission.assignmentTitle || submission.assignmentId}.`);
    return newSub;
  }

  public gradeAssignment(
    submissionId: string,
    marks: number,
    feedback: string,
    actor: { id: string; name: string; role: UserRole }
  ): AssignmentSubmission | undefined {
    const sub = this.store.submissions.find((s) => s.id === submissionId);
    if (!sub) return undefined;

    sub.marksObtained = marks;
    sub.feedback = feedback;
    sub.status = 'graded';
    sub.gradedByTeacherId = actor.id;
    sub.gradedAt = new Date().toISOString();

    const asg = this.store.assignments.find((a) => a.id === sub.assignmentId);
    if (asg) {
      asg.gradedCount = (asg.gradedCount || 0) + 1;
    }

    this.logAudit(actor, 'ASSIGNMENT_GRADED', 'AssignmentSubmission', submissionId, `Graded submission: ${marks} marks given.`);
    return sub;
  }

  // ==========================================
  // EXAMINATIONS & QUIZZES MODULE
  // ==========================================
  public getExaminations(filters?: { batchId?: string; courseId?: string }): Examination[] {
    let list = [...this.store.examinations];
    if (filters?.batchId) {
      list = list.filter((e) => e.batchId === filters.batchId);
    }
    return list;
  }

  public getExaminationById(id: string): Examination | undefined {
    return this.store.examinations.find((e) => e.id === id);
  }

  public submitExamAttempt(
    examId: string,
    studentId: string,
    studentName: string,
    answers: Record<string, string>,
    actor: { id: string; name: string; role: UserRole }
  ): ExaminationAttempt {
    const exam = this.getExaminationById(examId);
    if (!exam) throw new Error('Examination not found');

    const questions = exam.questions || [];
    const questionListForScoring = questions.map((q) => {
      const correctOpt = q.options?.find((o) => o.isCorrect);
      return {
        id: q.id,
        marks: q.marks,
        negativeMarks: exam.negativeMarkingEnabled ? q.negativeMarks : 0,
        correctOptionId: correctOpt?.id,
        correctAnswerText: q.correctAnswerText,
      };
    });

    const scoreResult = calculateExamScore(questionListForScoring, answers, exam.passingMarks);

    const attempt: ExaminationAttempt = {
      id: `atm-${Date.now()}`,
      examinationId: examId,
      examinationTitle: exam.title,
      studentId,
      studentName,
      startTime: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      submissionTime: new Date().toISOString(),
      status: 'evaluated',
      answers,
      totalScore: scoreResult.obtainedMarks,
      maxScore: scoreResult.totalMarks,
      percentage: scoreResult.percentage,
      passed: scoreResult.isPassed,
      rank: 1,
      evaluatedAt: new Date().toISOString(),
    };

    this.store.attempts.unshift(attempt);

    // If results are already published, create or update Result record
    if (exam.resultsPublished) {
      const resultRecord: ExaminationResult = {
        id: `res-${Date.now()}`,
        attemptId: attempt.id,
        examinationId: examId,
        examinationTitle: exam.title,
        subjectName: exam.subjectName,
        studentId,
        studentName,
        batchName: exam.batchName,
        totalMarks: scoreResult.totalMarks,
        marksObtained: scoreResult.obtainedMarks,
        percentage: scoreResult.percentage,
        isPassed: scoreResult.isPassed,
        rank: 1,
        percentile: 99.5,
        publishedDate: new Date().toISOString().slice(0, 10),
      };
      this.store.results.unshift(resultRecord);
    }

    this.logAudit(actor, 'EXAMINATION_COMPLETED', 'ExaminationAttempt', attempt.id, `Completed exam "${exam.title}" scoring ${scoreResult.obtainedMarks}/${scoreResult.totalMarks}.`);
    return attempt;
  }

  public publishExaminationResults(
    examId: string,
    actor: { id: string; name: string; role: UserRole }
  ): boolean {
    const exam = this.getExaminationById(examId);
    if (!exam) return false;

    exam.resultsPublished = true;
    exam.status = 'results_published';
    exam.publishedAt = new Date().toISOString();

    // Generate result records for all attempts that haven't been published yet
    const attempts = this.store.attempts.filter((a) => a.examinationId === examId);
    attempts.forEach((att, idx) => {
      const exists = this.store.results.some((r) => r.attemptId === att.id);
      if (!exists) {
        this.store.results.unshift({
          id: `res-${Date.now()}-${idx}`,
          attemptId: att.id,
          examinationId: examId,
          examinationTitle: exam.title,
          subjectName: exam.subjectName,
          studentId: att.studentId,
          studentName: att.studentName,
          batchName: exam.batchName,
          totalMarks: att.maxScore || exam.totalMarks,
          marksObtained: att.totalScore || 0,
          percentage: att.percentage || 0,
          isPassed: att.passed || false,
          rank: idx + 1,
          percentile: 98.0,
          publishedDate: new Date().toISOString().slice(0, 10),
        });
      }
    });

    this.logAudit(actor, 'RESULTS_PUBLISHED', 'Examination', examId, `Authorized and published official examination results for ${exam.title}.`);
    return true;
  }

  public getResults(studentId?: string): ExaminationResult[] {
    if (studentId) {
      const student = this.getStudentById(studentId);
      const targetIds = [studentId.toLowerCase()];
      if (student) targetIds.push(student.id.toLowerCase(), student.studentId.toLowerCase());
      let list = this.store.results.filter((r) => targetIds.includes(r.studentId.toLowerCase()));
      if (list.length === 0 && student) {
        const exam = this.store.examinations[0];
        const res: ExaminationResult = {
          id: `res-${student.id}-01`,
          attemptId: `atm-${student.id}-01`,
          examinationId: exam?.id || 'exm-01',
          examinationTitle: exam?.title || 'All India Weekly Grand Test #6',
          subjectName: exam?.subjectName || 'Physics, Chemistry & Mathematics',
          studentId: student.id,
          studentName: student.name,
          batchName: student.batchName || 'Batch A1',
          totalMarks: 20,
          marksObtained: 18,
          percentage: 90,
          isPassed: true,
          rank: 2,
          percentile: 98.8,
          publishedDate: '2026-10-18',
        };
        this.store.results.push(res);
        list.push(res);
      }
      return list;
    }
    return [...this.store.results];
  }

  // ==========================================
  // INVOICES & PAYMENTS MODULE
  // ==========================================
  public getInvoices(filters?: { studentId?: string; status?: string }): Invoice[] {
    let list = [...this.store.invoices];
    if (filters?.studentId) {
      const student = this.getStudentById(filters.studentId);
      const targetIds = [filters.studentId.toLowerCase()];
      if (student) {
        targetIds.push(student.id.toLowerCase(), student.studentId.toLowerCase());
      }
      list = list.filter((i) => targetIds.includes(i.studentId.toLowerCase()));

      if (list.length === 0 && student) {
        const course = this.store.courses.find((c) => c.id === student.courseId) || this.store.courses[0];
        const numPart = student.studentId.replace(/\D/g, '').slice(-3) || '001';
        const inv: Invoice = {
          id: `inv-${student.id}`,
          invoiceNumber: `INV-2026-${numPart.padStart(4, '0')}`,
          studentId: student.id,
          studentName: student.name,
          courseId: course.id,
          courseName: course.name,
          academicSession: '2026-2027',
          feeDescription: `${course.name} - Annual Academic Fee`,
          totalAmount: course.feeAmount,
          discountAmount: 5000,
          amountPaid: Math.round(course.feeAmount * 0.5),
          outstandingBalance: course.feeAmount - 5000 - Math.round(course.feeAmount * 0.5),
          dueDate: '15-11-2026',
          status: 'partially_paid',
          createdAt: new Date().toISOString(),
          receiptNumber: `REC-2026-${numPart.padStart(4, '0')}`,
        };
        this.store.invoices.push(inv);
        list.push(inv);

        // Also add the corresponding verified payment record for the 50% paid portion
        const pay: PaymentRecord = {
          id: `pay-${student.id}-01`,
          receiptNumber: `REC-2026-${numPart.padStart(4, '0')}`,
          invoiceId: inv.id,
          invoiceNumber: inv.invoiceNumber,
          studentId: student.id,
          studentName: student.name,
          paymentDate: '2026-08-15',
          amount: Math.round(course.feeAmount * 0.5),
          paymentMethod: 'upi',
          referenceNumber: `UPI/HDFC/482910${numPart}`,
          recordedBy: 'Finance Desk - Principal Office',
          status: 'verified',
          notes: 'Installment 1 Fee received and confirmed via NetBanking/UPI gateway',
        };
        this.store.payments.push(pay);
      }
    }
    if (filters?.status && filters.status !== 'all') {
      list = list.filter((i) => i.status === filters.status);
    }
    return list;
  }

  public getPayments(studentId?: string): PaymentRecord[] {
    if (studentId) {
      const student = this.getStudentById(studentId);
      const targetIds = [studentId.toLowerCase()];
      if (student) {
        targetIds.push(student.id.toLowerCase(), student.studentId.toLowerCase());
      }
      // Ensure invoices/payments are seeded if needed
      this.getInvoices({ studentId });
      return this.store.payments.filter((p) => targetIds.includes(p.studentId.toLowerCase()));
    }
    return [...this.store.payments];
  }

  public recordPayment(
    paymentData: Omit<PaymentRecord, 'id' | 'receiptNumber'>,
    actor: { id: string; name: string; role: UserRole }
  ): PaymentRecord {
    const nextReceiptNum = `REC-2026-${String(this.store.payments.length + 1).padStart(4, '0')}`;
    const newPayment: PaymentRecord = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      receiptNumber: nextReceiptNum,
    };
    this.store.payments.unshift(newPayment);

    // Update invoice amountPaid and outstandingBalance
    const inv = this.store.invoices.find((i) => i.id === paymentData.invoiceId || i.invoiceNumber === paymentData.invoiceNumber);
    if (inv) {
      inv.amountPaid += paymentData.amount;
      const balanceCalcs = calculateInvoiceBalance(inv.totalAmount, inv.discountAmount, inv.amountPaid, inv.dueDate);
      inv.outstandingBalance = balanceCalcs.outstandingBalance;
      inv.status = balanceCalcs.status;
      inv.receiptNumber = nextReceiptNum;
    }

    this.logAudit(
      actor,
      'PAYMENT_RECORDED',
      'PaymentRecord',
      nextReceiptNum,
      `Received ₹${paymentData.amount} from ${paymentData.studentName} via ${paymentData.paymentMethod.toUpperCase()} (Ref: ${paymentData.referenceNumber}).`
    );

    return newPayment;
  }

  // ==========================================
  // ANNOUNCEMENTS MODULE
  // ==========================================
  public getAnnouncements(targetAudience?: string, batchId?: string): Announcement[] {
    let list = [...this.store.announcements];
    if (targetAudience && targetAudience !== 'all') {
      list = list.filter((a) => a.targetAudience === 'all' || a.targetAudience === targetAudience || (batchId && a.targetBatchId === batchId));
    }
    return list;
  }

  public addAnnouncement(
    announcement: Omit<Announcement, 'id' | 'createdAt'>,
    actor: { id: string; name: string; role: UserRole }
  ): Announcement {
    const newAnc: Announcement = {
      ...announcement,
      id: `anc-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.store.announcements.unshift(newAnc);
    this.logAudit(actor, 'ANNOUNCEMENT_POSTED', 'Announcement', newAnc.id, `Published announcement: "${newAnc.title}" for audience: ${newAnc.targetAudience}.`);
    return newAnc;
  }

  // ==========================================
  // DASHBOARD ANALYTICS CALCULATION
  // ==========================================
  public getPrincipalAnalytics(): PrincipalAnalytics {
    const totalStudents = this.store.students.filter((s) => s.status === 'active').length;
    const totalTeachers = this.store.teachers.filter((t) => t.status === 'active').length;
    const activeCourses = this.store.courses.filter((c) => c.status === 'active').length;
    const activeBatches = this.store.batches.filter((b) => b.status === 'active').length;

    // Calculate real attendance stats
    const todayRecords = this.store.attendance.slice(-30);
    const attCalc = calculateAttendancePercentage(todayRecords);
    const todayAttendancePercent = attCalc.percentage;

    // Calculate real fee stats from invoices
    const totalFeeCollectedINR = this.store.invoices.reduce((acc, inv) => acc + (inv.amountPaid || 0), 0);
    const totalFeeOutstandingINR = this.store.invoices.reduce((acc, inv) => acc + (inv.outstandingBalance || 0), 0);
    const upcomingExamsCount = this.store.examinations.filter((e) => e.status === 'published' || e.status === 'live').length;

    // Batch distribution
    const batchDistribution = this.store.batches.map((b) => ({
      batchName: b.name.split(' - ')[0],
      count: b.enrolledCount,
    }));

    return {
      totalStudents,
      totalTeachers,
      activeCourses,
      activeBatches,
      todayAttendancePercent,
      totalFeeCollectedINR,
      totalFeeOutstandingINR,
      upcomingExamsCount,
      monthlyEnrollment: [
        { month: 'Apr', students: 18 },
        { month: 'May', students: 24 },
        { month: 'Jun', students: 30 },
        { month: 'Jul', students: 42 },
        { month: 'Aug', students: 65 },
        { month: 'Sep', students: 82 },
        { month: 'Oct', students: totalStudents },
      ],
      attendanceTrends: [
        { date: '12-Oct', presentPercent: 94 },
        { date: '13-Oct', presentPercent: 91 },
        { date: '14-Oct', presentPercent: 96 },
        { date: '15-Oct', presentPercent: 92 },
        { date: '16-Oct', presentPercent: 95 },
        { date: '17-Oct', presentPercent: 93 },
        { date: '18-Oct', presentPercent: todayAttendancePercent },
      ],
      batchDistribution,
      subjectPerformance: [
        { subject: 'Physics', averageScore: 78 },
        { subject: 'Chemistry', averageScore: 84 },
        { subject: 'Mathematics', averageScore: 72 },
        { subject: 'Biology', averageScore: 89 },
      ],
      feeCollectionMonthly: [
        { month: 'Jun', collected: 1250000, target: 1500000 },
        { month: 'Jul', collected: 2100000, target: 2000000 },
        { month: 'Aug', collected: 2800000, target: 2500000 },
        { month: 'Sep', collected: 3200000, target: 3000000 },
        { month: 'Oct', collected: totalFeeCollectedINR, target: 3500000 },
      ],
    };
  }

  public getChairmanAnalytics(): ChairmanAnalytics {
    const totalEnrolledStudents = this.store.students.length;
    const newAdmissionsThisMonth = 14;
    const activeTeachers = this.store.teachers.filter((t) => t.status === 'active').length;
    const activeBatches = this.store.batches.filter((b) => b.status === 'active').length;

    const totalRevenueINR = this.store.invoices.reduce((acc, inv) => acc + (inv.amountPaid || 0), 0);
    const outstandingBalanceINR = this.store.invoices.reduce((acc, inv) => acc + (inv.outstandingBalance || 0), 0);
    const totalInvoiced = totalRevenueINR + outstandingBalanceINR;
    const collectionRatePercent = totalInvoiced > 0 ? Math.round((totalRevenueINR / totalInvoiced) * 100) : 0;

    return {
      totalEnrolledStudents,
      newAdmissionsThisMonth,
      activeTeachers,
      activeBatches,
      totalRevenueINR,
      outstandingBalanceINR,
      collectionRatePercent,
      overallAttendanceRate: 93.4,
      overallExamPassRate: 88.5,
      revenueByCourse: [
        { courseName: 'JEE Advanced Pinnacle', revenue: 4200000 },
        { courseName: 'NEET-UG Edge Medical', revenue: 3800000 },
        { courseName: 'Class 10 Foundation', revenue: 1950000 },
        { courseName: 'Crash Courses', revenue: 756000 },
      ],
      batchPerformanceComparison: [
        { batchName: 'JEE Batch A1', avgScore: 82, attendanceRate: 96 },
        { batchName: 'JEE Batch A2', avgScore: 76, attendanceRate: 92 },
        { batchName: 'NEET Batch B1', avgScore: 88, attendanceRate: 95 },
        { batchName: 'NEET Batch B2', avgScore: 81, attendanceRate: 90 },
        { batchName: 'Foundation C1', avgScore: 85, attendanceRate: 94 },
      ],
      studentRetentionRate: 97.2,
    };
  }
}

export const db = DatabaseService.getInstance();
