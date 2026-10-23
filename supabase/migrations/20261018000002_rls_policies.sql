-- ====================================================================
-- SHRI PINNAKEEDGE SMART LMS — DATABASE MIGRATION 02
-- ROW LEVEL SECURITY (RLS) POLICIES & HELPER FUNCTIONS
-- ====================================================================

-- 1. Helper function to get current authenticated user's role from profiles
CREATE OR REPLACE FUNCTION get_auth_role()
RETURNS VARCHAR AS $$
  SELECT role FROM profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_auth_profile_id()
RETURNS UUID AS $$
  SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_auth_student_id()
RETURNS UUID AS $$
  SELECT id FROM students WHERE profile_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1) LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_auth_teacher_id()
RETURNS UUID AS $$
  SELECT id FROM teachers WHERE profile_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1) LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 2. Enable RLS on sensitive tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE examinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE examination_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 3. Profiles Policies
CREATE POLICY "Public profile view" ON profiles FOR SELECT USING (true);
CREATE POLICY "Admin update profiles" ON profiles FOR UPDATE USING (
  get_auth_role() IN ('principal', 'chairman') OR user_id = auth.uid()
);

-- 4. Students Policies
CREATE POLICY "Principals and Chairmen view all students" ON students FOR SELECT
  USING (get_auth_role() IN ('principal', 'chairman'));

CREATE POLICY "Teachers view students in assigned batches" ON students FOR SELECT
  USING (
    get_auth_role() = 'teacher' AND
    batch_id IN (SELECT batch_id FROM teacher_assignments WHERE teacher_id = get_auth_teacher_id())
  );

CREATE POLICY "Students view only their own record" ON students FOR SELECT
  USING (get_auth_role() = 'student' AND id = get_auth_student_id());

CREATE POLICY "Principal manages students" ON students FOR ALL
  USING (get_auth_role() = 'principal');

-- 5. Attendance Policies
CREATE POLICY "Admins view all attendance" ON attendance_records FOR SELECT
  USING (get_auth_role() IN ('principal', 'chairman'));

CREATE POLICY "Teachers view and mark attendance in assigned batches" ON attendance_records FOR ALL
  USING (
    get_auth_role() = 'principal' OR (
      get_auth_role() = 'teacher' AND
      batch_id IN (SELECT batch_id FROM teacher_assignments WHERE teacher_id = get_auth_teacher_id())
    )
  );

CREATE POLICY "Students view only their own attendance" ON attendance_records FOR SELECT
  USING (get_auth_role() = 'student' AND student_id = get_auth_student_id());

-- 6. Study Materials Policies
CREATE POLICY "View study materials" ON study_materials FOR SELECT
  USING (
    get_auth_role() IN ('principal', 'chairman', 'teacher') OR (
      get_auth_role() = 'student' AND (
        batch_id IS NULL OR
        batch_id = (SELECT batch_id FROM students WHERE id = get_auth_student_id())
      )
    )
  );

CREATE POLICY "Teachers and Principals manage materials" ON study_materials FOR ALL
  USING (get_auth_role() IN ('principal', 'teacher'));

-- 7. Assignments & Submissions Policies
CREATE POLICY "View assignments" ON assignments FOR SELECT
  USING (
    get_auth_role() IN ('principal', 'chairman', 'teacher') OR (
      get_auth_role() = 'student' AND
      batch_id = (SELECT batch_id FROM students WHERE id = get_auth_student_id()) AND
      status = 'published'
    )
  );

CREATE POLICY "Manage assignments" ON assignments FOR ALL
  USING (get_auth_role() IN ('principal', 'teacher'));

CREATE POLICY "Students view and submit own assignments" ON assignment_submissions FOR ALL
  USING (
    get_auth_role() IN ('principal', 'chairman') OR (
      get_auth_role() = 'teacher' AND
      batch_id IN (SELECT batch_id FROM teacher_assignments WHERE teacher_id = get_auth_teacher_id())
    ) OR (
      get_auth_role() = 'student' AND student_id = get_auth_student_id()
    )
  );

-- 8. Examinations & Results Policies
CREATE POLICY "View examinations" ON examinations FOR SELECT
  USING (
    get_auth_role() IN ('principal', 'chairman', 'teacher') OR (
      get_auth_role() = 'student' AND
      batch_id = (SELECT batch_id FROM students WHERE id = get_auth_student_id()) AND
      status IN ('published', 'live', 'completed', 'results_published')
    )
  );

CREATE POLICY "Students take own exams" ON examination_attempts FOR ALL
  USING (
    get_auth_role() IN ('principal', 'chairman') OR (
      get_auth_role() = 'teacher'
    ) OR (
      get_auth_role() = 'student' AND student_id = get_auth_student_id()
    )
  );

CREATE POLICY "Results view policy" ON results FOR SELECT
  USING (
    get_auth_role() IN ('principal', 'chairman', 'teacher') OR (
      get_auth_role() = 'student' AND student_id = get_auth_student_id()
    )
  );

-- 9. Finance Policies (Invoices & Payments)
CREATE POLICY "Admins full financial access" ON invoices FOR ALL
  USING (get_auth_role() IN ('principal', 'chairman'));

CREATE POLICY "Students view only their own invoices" ON invoices FOR SELECT
  USING (get_auth_role() = 'student' AND student_id = get_auth_student_id());

CREATE POLICY "Admins full payment access" ON payments FOR ALL
  USING (get_auth_role() IN ('principal', 'chairman'));

CREATE POLICY "Students view only their own payment receipts" ON payments FOR SELECT
  USING (get_auth_role() = 'student' AND student_id = get_auth_student_id());

-- 10. Audit Logs Policies
CREATE POLICY "Only Principal and Chairman can view audit logs" ON audit_logs FOR SELECT
  USING (get_auth_role() IN ('principal', 'chairman'));

CREATE POLICY "Server inserts audit logs" ON audit_logs FOR INSERT
  WITH CHECK (true);
