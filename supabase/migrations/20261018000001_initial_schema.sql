-- ====================================================================
-- SHRI PINNAKEEDGE SMART LMS — DATABASE MIGRATION 01
-- FULL RELATIONAL SCHEMA WITH CONSTRAINTS, INDEXES, & AUDITING
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Identity and Access Management
CREATE TABLE IF NOT EXISTS roles (
  id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO roles (id, name, description) VALUES
  ('principal', 'Principal - Super Admin', 'Full academic, teacher, student, and administrative authority'),
  ('chairman', 'Chairman - Executive Admin', 'Executive institutional oversight, financial reports, and high-level governance'),
  ('teacher', 'Teacher / Faculty', 'Subject instructor with batch, attendance, assignments, and test authority'),
  ('student', 'Student / Learner', 'Enrolled student with access to authorized courses, tests, and personal records')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE, -- References auth.users(id) in Supabase
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL REFERENCES roles(id),
  phone VARCHAR(20),
  institute_id VARCHAR(64) UNIQUE, -- e.g. SPE-PRN-01, SPE-TCH-001, SPE-STU-2026-001
  avatar_url TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  actor_name VARCHAR(255) NOT NULL,
  actor_role VARCHAR(32) NOT NULL,
  action VARCHAR(128) NOT NULL,
  target_entity VARCHAR(64) NOT NULL,
  target_id VARCHAR(128) NOT NULL,
  details TEXT,
  ip_address VARCHAR(45),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Academic Structure
CREATE TABLE IF NOT EXISTS academic_sessions (
  id VARCHAR(32) PRIMARY KEY, -- e.g. '2026-2027'
  year_name VARCHAR(64) NOT NULL,
  is_current BOOLEAN DEFAULT false,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(64) NOT NULL UNIQUE,
  description TEXT,
  duration VARCHAR(64) NOT NULL,
  academic_session VARCHAR(32) REFERENCES academic_sessions(id),
  fee_amount NUMERIC(12, 2) NOT NULL CHECK (fee_amount >= 0),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(64) NOT NULL,
  description TEXT,
  total_hours INT DEFAULT 120,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_course_subject_code UNIQUE(course_id, code)
);

CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  teacher_id VARCHAR(64) NOT NULL UNIQUE, -- Institutional ID SPE-TCH-001
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  specialization VARCHAR(128) NOT NULL,
  qualification VARCHAR(128) NOT NULL,
  joining_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
  name VARCHAR(255) NOT NULL,
  academic_session VARCHAR(32) REFERENCES academic_sessions(id),
  capacity INT NOT NULL DEFAULT 40 CHECK (capacity > 0),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'upcoming', 'completed')),
  room_number VARCHAR(64),
  coordinator_teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  student_id VARCHAR(64) NOT NULL UNIQUE, -- SPE-STU-2026-xxx
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  guardian_name VARCHAR(255) NOT NULL,
  guardian_phone VARCHAR(20) NOT NULL,
  admission_date DATE NOT NULL,
  academic_session VARCHAR(32) REFERENCES academic_sessions(id),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE RESTRICT,
  address TEXT,
  gender VARCHAR(16),
  dob DATE,
  category VARCHAR(32) DEFAULT 'General',
  roll_number VARCHAR(32),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE RESTRICT,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'transferred', 'completed', 'dropped')),
  CONSTRAINT uq_student_batch UNIQUE(student_id, batch_id)
);

CREATE TABLE IF NOT EXISTS teacher_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_teacher_batch_subject UNIQUE(teacher_id, batch_id, subject_id)
);

CREATE TABLE IF NOT EXISTS timetable_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  day_of_week VARCHAR(16) NOT NULL CHECK (day_of_week IN ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room_or_link VARCHAR(128) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_session_times CHECK (end_time > start_time)
);

-- 4. Attendance Module
CREATE TABLE IF NOT EXISTS attendance_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  session_name VARCHAR(64) DEFAULT 'Morning Session',
  marked_by_teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_batch_date_session UNIQUE(batch_id, date, session_name)
);

CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status VARCHAR(16) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'leave')),
  marked_by_teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  session_id UUID REFERENCES attendance_sessions(id) ON DELETE SET NULL,
  remarks VARCHAR(255),
  is_corrected BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_student_batch_date UNIQUE(student_id, batch_id, date)
);

CREATE TABLE IF NOT EXISTS attendance_corrections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attendance_record_id UUID NOT NULL REFERENCES attendance_records(id) ON DELETE CASCADE,
  original_status VARCHAR(16) NOT NULL,
  new_status VARCHAR(16) NOT NULL,
  corrected_by VARCHAR(255) NOT NULL,
  reason TEXT NOT NULL,
  corrected_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Learning & Study Materials
CREATE TABLE IF NOT EXISTS study_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  batch_id UUID REFERENCES batches(id) ON DELETE SET NULL, -- Nullable: visible to whole course
  topic_tag VARCHAR(128) NOT NULL,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size_bytes BIGINT NOT NULL DEFAULT 0,
  file_type VARCHAR(32) NOT NULL,
  uploaded_by_teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  uploaded_by_teacher_name VARCHAR(255) NOT NULL,
  upload_date TIMESTAMPTZ DEFAULT NOW(),
  download_count INT DEFAULT 0
);

-- 6. Assignments Module
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  instructions TEXT NOT NULL,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  teacher_name VARCHAR(255) NOT NULL,
  max_marks NUMERIC(6, 2) NOT NULL CHECK (max_marks > 0),
  passing_marks NUMERIC(6, 2) NOT NULL CHECK (passing_marks >= 0),
  deadline_date TIMESTAMPTZ NOT NULL,
  attachment_url TEXT,
  attachment_name VARCHAR(255),
  allowed_formats TEXT[] DEFAULT ARRAY['pdf', 'docx', 'jpg'],
  status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  student_name VARCHAR(255) NOT NULL,
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  submission_date TIMESTAMPTZ DEFAULT NOW(),
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  student_notes TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'late', 'graded', 'returned')),
  marks_obtained NUMERIC(6, 2) CHECK (marks_obtained >= 0),
  feedback TEXT,
  graded_by_teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  graded_at TIMESTAMPTZ,
  CONSTRAINT uq_student_assignment UNIQUE(assignment_id, student_id)
);

-- 7. Online Examinations Module
CREATE TABLE IF NOT EXISTS examinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  instructions TEXT,
  scheduled_start_time TIMESTAMPTZ NOT NULL,
  scheduled_end_time TIMESTAMPTZ NOT NULL,
  duration_minutes INT NOT NULL CHECK (duration_minutes > 0),
  total_marks NUMERIC(6, 2) NOT NULL CHECK (total_marks > 0),
  passing_marks NUMERIC(6, 2) NOT NULL CHECK (passing_marks >= 0),
  negative_marking_enabled BOOLEAN DEFAULT false,
  status VARCHAR(24) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'live', 'completed', 'results_published')),
  results_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_by_teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  examination_id UUID NOT NULL REFERENCES examinations(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(24) NOT NULL CHECK (question_type IN ('mcq', 'true_false', 'short', 'descriptive')),
  marks NUMERIC(6, 2) NOT NULL DEFAULT 4.00,
  negative_marks NUMERIC(6, 2) NOT NULL DEFAULT 1.00,
  explanation TEXT,
  order_index INT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS examination_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  examination_id UUID NOT NULL REFERENCES examinations(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  student_name VARCHAR(255) NOT NULL,
  start_time TIMESTAMPTZ DEFAULT NOW(),
  submission_time TIMESTAMPTZ,
  status VARCHAR(20) NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'evaluated', 'timed_out')),
  answers_json JSONB DEFAULT '{}'::jsonb,
  total_score NUMERIC(6, 2),
  max_score NUMERIC(6, 2),
  percentage NUMERIC(5, 2),
  passed BOOLEAN,
  rank INT,
  evaluated_at TIMESTAMPTZ,
  CONSTRAINT uq_student_exam_attempt UNIQUE(examination_id, student_id)
);

CREATE TABLE IF NOT EXISTS results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES examination_attempts(id) ON DELETE CASCADE,
  examination_id UUID NOT NULL REFERENCES examinations(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  total_marks NUMERIC(6, 2) NOT NULL,
  marks_obtained NUMERIC(6, 2) NOT NULL,
  percentage NUMERIC(5, 2) NOT NULL,
  is_passed BOOLEAN NOT NULL,
  rank INT NOT NULL,
  percentile NUMERIC(5, 2) NOT NULL DEFAULT 90.00,
  feedback TEXT,
  published_date TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_result_attempt UNIQUE(attempt_id)
);

-- 8. Finance Module
CREATE TABLE IF NOT EXISTS fee_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  total_fee NUMERIC(12, 2) NOT NULL CHECK (total_fee >= 0),
  installments_count INT DEFAULT 2,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR(64) NOT NULL UNIQUE, -- e.g. INV-2026-0042
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  student_name VARCHAR(255) NOT NULL,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
  academic_session VARCHAR(32) REFERENCES academic_sessions(id),
  fee_description VARCHAR(255) NOT NULL,
  total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
  discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (discount_amount >= 0),
  amount_paid NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (amount_paid >= 0),
  outstanding_balance NUMERIC(12, 2) NOT NULL CHECK (outstanding_balance >= 0),
  due_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('paid', 'partially_paid', 'pending', 'overdue', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_number VARCHAR(64) NOT NULL UNIQUE, -- REC-2026-0089
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE RESTRICT,
  invoice_number VARCHAR(64) NOT NULL,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  student_name VARCHAR(255) NOT NULL,
  payment_date DATE NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  payment_method VARCHAR(24) NOT NULL CHECK (payment_method IN ('cash', 'upi', 'net_banking', 'cheque', 'card')),
  reference_number VARCHAR(128) NOT NULL, -- e.g. UPI txn id or Cheque No
  recorded_by VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'verified' CHECK (status IN ('verified', 'pending', 'reconciled', 'refunded')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Announcements & Notifications
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  author_role VARCHAR(32) NOT NULL CHECK (author_role IN ('Principal', 'Chairman', 'Teacher')),
  target_audience VARCHAR(20) NOT NULL CHECK (target_audience IN ('all', 'students', 'teachers', 'batch')),
  target_batch_id UUID REFERENCES batches(id) ON DELETE SET NULL,
  priority VARCHAR(16) NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'important', 'urgent')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(32) NOT NULL CHECK (type IN ('attendance', 'exam', 'assignment', 'fee', 'general')),
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_students_course ON students(course_id);
CREATE INDEX IF NOT EXISTS idx_students_batch ON students(batch_id);
CREATE INDEX IF NOT EXISTS idx_attendance_batch_date ON attendance_records(batch_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_assignments_batch ON assignments(batch_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON assignment_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_invoices_student ON invoices(student_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_audience ON announcements(target_audience, target_batch_id);
