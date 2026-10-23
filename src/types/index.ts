export type UserRole = 'principal' | 'chairman' | 'teacher' | 'student';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  instituteId?: string; // e.g. SPE-PRN-01, SPE-TCH-001, SPE-STU-2026-001
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
}

export interface Student {
  id: string;
  studentId: string; // Institutional Unique ID: SPE-STU-2026-xxx
  name: string;
  email: string;
  phone: string;
  guardianName: string;
  guardianPhone: string;
  admissionDate: string; // DD-MM-YYYY
  academicSession: string; // e.g. 2026-2027
  courseId: string;
  courseName?: string;
  batchId: string;
  batchName?: string;
  address?: string;
  status: 'active' | 'inactive' | 'graduated' | 'suspended';
  gender?: 'Male' | 'Female' | 'Other';
  dob?: string;
  category?: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  rollNumber?: string;
}

export interface Teacher {
  id: string;
  teacherId: string; // SPE-TCH-xxx
  name: string;
  email: string;
  phone: string;
  specialization: string; // e.g., Physics, Organic Chemistry, Mathematics, Zoology
  qualification: string; // e.g., M.Sc, Ph.D, B.Tech IIT
  assignedSubjectIds: string[];
  assignedSubjectNames?: string[];
  assignedBatchIds: string[];
  assignedBatchNames?: string[];
  joiningDate: string; // DD-MM-YYYY
  status: 'active' | 'inactive' | 'on_leave';
}

export interface Course {
  id: string;
  name: string; // e.g. "JEE Advanced Pinnacle", "NEET-UG Edge", "Class 10 Foundation"
  code: string; // e.g. JEE-ADV, NEET-UG
  description: string;
  duration: string; // e.g. "1 Year", "2 Years", "Crash Course 6 Months"
  academicSession: string;
  feeAmount: number; // in INR
  status: 'active' | 'archived';
  subjects?: Subject[];
}

export interface Subject {
  id: string;
  courseId: string;
  courseName?: string;
  name: string; // e.g. Physics, Chemistry, Mathematics, Biology
  code: string; // PHY-101, CHE-101
  description?: string;
  totalHours?: number;
}

export interface Batch {
  id: string;
  courseId: string;
  courseName?: string;
  name: string; // e.g. "Batch A1 - Morning Super 30", "Batch B2 - Evening Elite"
  academicSession: string;
  capacity: number;
  enrolledCount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'completed';
  roomNumber?: string;
  coordinatorTeacherId?: string;
}

export interface TimetableSession {
  id: string;
  batchId: string;
  batchName: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string; // "09:00"
  endTime: string; // "10:30"
  roomOrLink: string; // "Room 204 - Einstein Block"
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName?: string;
  rollNumber?: string;
  batchId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  markedByTeacherId: string;
  remarks?: string;
  sessionId?: string;
  createdAt: string;
  isCorrected?: boolean;
  correctionHistory?: {
    originalStatus: AttendanceStatus;
    correctedBy: string;
    correctedAt: string;
    reason: string;
  }[];
}

export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  subjectId: string;
  subjectName: string;
  batchId?: string; // If null, visible to all batches in course
  batchName?: string;
  topicTag: string; // e.g. "Thermodynamics", "Calculus", "Organic Reactions"
  fileUrl: string;
  fileName: string;
  fileSizeBytes: number;
  fileType: 'pdf' | 'docx' | 'pptx' | 'image' | 'video_link' | 'other';
  uploadedByTeacherId: string;
  uploadedByTeacherName: string;
  uploadDate: string;
  downloadCount: number;
}

export type AssignmentStatus = 'draft' | 'published' | 'submitted' | 'late' | 'under_review' | 'graded' | 'returned';

export interface Assignment {
  id: string;
  title: string;
  instructions: string;
  courseId: string;
  courseName: string;
  subjectId: string;
  subjectName: string;
  batchId: string;
  batchName: string;
  teacherId: string;
  teacherName: string;
  maxMarks: number;
  passingMarks: number;
  deadlineDate: string; // ISO date string or DD-MM-YYYY HH:mm
  attachmentUrl?: string;
  attachmentName?: string;
  allowedFormats: string[]; // ['pdf', 'doc', 'docx', 'jpg']
  status: 'draft' | 'published' | 'closed';
  createdAt: string;
  submissionsCount?: number;
  gradedCount?: number;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle?: string;
  studentId: string;
  studentName: string;
  batchId: string;
  submissionDate: string;
  fileUrl: string;
  fileName: string;
  studentNotes?: string;
  status: 'submitted' | 'late' | 'graded' | 'returned';
  marksObtained?: number;
  feedback?: string;
  gradedByTeacherId?: string;
  gradedAt?: string;
}

export type QuestionType = 'mcq' | 'true_false' | 'short' | 'descriptive';

export interface QuestionOption {
  id: string;
  optionText: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  examinationId: string;
  questionText: string;
  questionType: QuestionType;
  options?: QuestionOption[]; // for mcq & true_false
  correctAnswerText?: string; // for short answer / server reference
  marks: number;
  negativeMarks: number;
  explanation?: string;
  orderIndex: number;
}

export interface Examination {
  id: string;
  title: string; // e.g. "Weekly All India Grand Test #4 - Mechanics & Optics"
  subjectId: string;
  subjectName: string;
  courseId: string;
  courseName: string;
  batchId: string;
  batchName: string;
  instructions: string;
  scheduledStartTime: string; // ISO string
  scheduledEndTime: string; // ISO string
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  negativeMarkingEnabled: boolean;
  status: 'draft' | 'published' | 'live' | 'completed' | 'results_published';
  questions?: Question[];
  totalQuestions: number;
  resultsPublished: boolean;
  publishedAt?: string;
  createdByTeacherId: string;
}

export interface ExaminationAttempt {
  id: string;
  examinationId: string;
  examinationTitle?: string;
  studentId: string;
  studentName: string;
  startTime: string;
  submissionTime?: string;
  status: 'in_progress' | 'submitted' | 'evaluated' | 'timed_out';
  answers: Record<string, string>; // questionId -> selectedOptionId or text
  totalScore?: number;
  maxScore?: number;
  percentage?: number;
  passed?: boolean;
  rank?: number;
  evaluatedAt?: string;
}

export interface ExaminationResult {
  id: string;
  attemptId: string;
  examinationId: string;
  examinationTitle: string;
  subjectName: string;
  studentId: string;
  studentName: string;
  batchName: string;
  totalMarks: number;
  marksObtained: number;
  percentage: number;
  isPassed: boolean;
  rank: number;
  percentile: number;
  feedback?: string;
  publishedDate: string;
}

export type InvoiceStatus = 'paid' | 'partially_paid' | 'pending' | 'overdue' | 'cancelled';
export type PaymentMethod = 'cash' | 'upi' | 'net_banking' | 'cheque' | 'card';

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. INV-2026-0042
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  academicSession: string;
  feeDescription: string; // e.g. "Annual Tuition Fee - Term 1"
  totalAmount: number; // in INR
  discountAmount: number;
  amountPaid: number;
  outstandingBalance: number;
  dueDate: string; // DD-MM-YYYY
  status: InvoiceStatus;
  createdAt: string;
  receiptNumber?: string;
}

export interface PaymentRecord {
  id: string;
  receiptNumber: string; // e.g. REC-2026-0089
  invoiceId: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  paymentDate: string; // DD-MM-YYYY
  amount: number; // in INR
  paymentMethod: PaymentMethod;
  referenceNumber: string; // e.g. UPI txn id or Bank UTR or Cash Voucher
  recordedBy: string; // "Principal Office" or user name
  status: 'verified' | 'pending' | 'reconciled' | 'refunded';
  notes?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: 'Principal' | 'Chairman' | 'Teacher';
  targetAudience: 'all' | 'students' | 'teachers' | 'batch';
  targetBatchId?: string;
  targetBatchName?: string;
  priority: 'normal' | 'important' | 'urgent';
  createdAt: string;
  expiresAt?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'attendance' | 'exam' | 'assignment' | 'fee' | 'general';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string; // e.g. "STUDENT_ADMITTED", "ATTENDANCE_RECORDED", "FEE_PAYMENT_VERIFIED", "EXAM_PUBLISHED"
  targetEntity: string; // e.g. "Student", "Attendance", "Payment", "Examination"
  targetId: string;
  details: string;
  ipAddress?: string;
}

export interface PrincipalAnalytics {
  totalStudents: number;
  totalTeachers: number;
  activeCourses: number;
  activeBatches: number;
  todayAttendancePercent: number;
  totalFeeCollectedINR: number;
  totalFeeOutstandingINR: number;
  upcomingExamsCount: number;
  monthlyEnrollment: { month: string; students: number }[];
  attendanceTrends: { date: string; presentPercent: number }[];
  batchDistribution: { batchName: string; count: number }[];
  subjectPerformance: { subject: string; averageScore: number }[];
  feeCollectionMonthly: { month: string; collected: number; target: number }[];
}

export interface ChairmanAnalytics {
  totalEnrolledStudents: number;
  newAdmissionsThisMonth: number;
  activeTeachers: number;
  activeBatches: number;
  totalRevenueINR: number;
  outstandingBalanceINR: number;
  collectionRatePercent: number;
  overallAttendanceRate: number;
  overallExamPassRate: number;
  revenueByCourse: { courseName: string; revenue: number }[];
  batchPerformanceComparison: { batchName: string; avgScore: number; attendanceRate: number }[];
  studentRetentionRate: number;
}
