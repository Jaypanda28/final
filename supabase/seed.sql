-- ====================================================================
-- SHRI PINNAKEEDGE SMART LMS — DATABASE SEED SCRIPT
-- Populates courses, batches, teachers, students, attendance, exams, fees
-- ====================================================================

-- 1. Academic Sessions
INSERT INTO academic_sessions (id, year_name, is_current, start_date, end_date) VALUES
  ('2025-2026', 'Academic Year 2025-2026', false, '2025-04-01', '2026-03-31'),
  ('2026-2027', 'Academic Year 2026-2027', true, '2026-04-01', '2027-03-31')
ON CONFLICT (id) DO NOTHING;

-- 2. Demo User Profiles
INSERT INTO profiles (id, email, name, role, phone, institute_id, status) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'principal@pinnakeedge.edu', 'Dr. Rajeshwar Sharma', 'principal', '+91 98765 43210', 'SPE-PRN-01', 'active'),
  ('a0000000-0000-0000-0000-000000000002', 'chairman@pinnakeedge.edu', 'Shri Vikramaditya Singhania', 'chairman', '+91 98111 22334', 'SPE-CHR-01', 'active'),
  ('a0000000-0000-0000-0000-000000000003', 'teacher.sharma@pinnakeedge.edu', 'Prof. Ananya Sen', 'teacher', '+91 98300 12345', 'SPE-TCH-001', 'active'),
  ('a0000000-0000-0000-0000-000000000004', 'student.aarav@pinnakeedge.edu', 'Aarav Patel', 'student', '+91 99887 76655', 'SPE-STU-2026-001', 'active')
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role;

-- 3. Courses
INSERT INTO courses (id, name, code, description, duration, academic_session, fee_amount, status) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'JEE Advanced Pinnacle (2-Year Integrated)', 'JEE-ADV-2YR', 'Comprehensive preparation for IIT-JEE Advanced', '2 Years', '2026-2027', 145000, 'active'),
  ('c0000000-0000-0000-0000-000000000002', 'NEET-UG Edge Medical Elite', 'NEET-UG-ELITE', 'Intensive medical entrance program focusing on NCERT mastery', '2 Years', '2026-2027', 140000, 'active'),
  ('c0000000-0000-0000-0000-000000000003', 'Class 10 Foundation & Olympiad Mastery', 'FND-10-OLY', 'Board Exam + NTSE / PRMO Olympiad foundation', '1 Year', '2026-2027', 75000, 'active'),
  ('c0000000-0000-0000-0000-000000000004', 'JEE Main & Advanced 90-Day Crash Course', 'JEE-CRASH-90', 'High-yield problem solving and mock tests', '3 Months', '2026-2027', 42000, 'active')
ON CONFLICT (code) DO NOTHING;

-- 4. Subjects
INSERT INTO subjects (id, course_id, name, code, total_hours) VALUES
  ('50000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Physics (Mechanics & Electrodynamics)', 'PHY-JEE', 180),
  ('50000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'Physical & Organic Chemistry', 'CHE-JEE', 180),
  ('50000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'Higher Mathematics & Calculus', 'MAT-JEE', 190),
  ('50000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000002', 'Botany & Zoology Biology', 'BIO-NEET', 210)
ON CONFLICT DO NOTHING;

-- 5. Teachers
INSERT INTO teachers (id, profile_id, teacher_id, name, email, phone, specialization, qualification, joining_date, status) VALUES
  ('70000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'SPE-TCH-001', 'Prof. Ananya Sen', 'teacher.sharma@pinnakeedge.edu', '+91 98300 12345', 'Physics (Mechanics)', 'M.Tech IIT Kharagpur', '2021-04-10', 'active'),
  ('70000000-0000-0000-0000-000000000002', NULL, 'SPE-TCH-002', 'Dr. Vivek Bhattacharya', 'vivek.bhatt@pinnakeedge.edu', '+91 98210 54321', 'Organic Chemistry', 'Ph.D Delhi University', '2020-06-15', 'active'),
  ('70000000-0000-0000-0000-000000000003', NULL, 'SPE-TCH-003', 'Er. Ramanujam Iyer', 'ramanujam.iyer@pinnakeedge.edu', '+91 97410 88990', 'Higher Mathematics', 'B.Tech IIT Madras', '2019-08-01', 'active'),
  ('70000000-0000-0000-0000-000000000004', NULL, 'SPE-TCH-004', 'Dr. Meenakshi Sundaram', 'meenakshi.s@pinnakeedge.edu', '+91 98450 77665', 'Biology & Physiology', 'AIIMS Alumna', '2022-01-12', 'active')
ON CONFLICT (teacher_id) DO NOTHING;

-- 6. Batches
INSERT INTO batches (id, course_id, name, academic_session, capacity, start_date, end_date, status, room_number, coordinator_teacher_id) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Batch A1 - Morning Super 30 (JEE)', '2026-2027', 35, '2026-04-01', '2027-03-31', 'active', 'Room 201 - Ramanujan Hall', '70000000-0000-0000-0000-000000000001'),
  ('b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'Batch A2 - Evening Pinnacle (JEE)', '2026-2027', 35, '2026-04-01', '2027-03-31', 'active', 'Room 202 - Aryabhata Wing', '70000000-0000-0000-0000-000000000002'),
  ('b0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000002', 'Batch B1 - Morning Doctors Squad (NEET)', '2026-2027', 40, '2026-04-01', '2027-03-31', 'active', 'Room 101 - Sushruta Block', '70000000-0000-0000-0000-000000000004')
ON CONFLICT DO NOTHING;

-- 7. Teacher Assignments
INSERT INTO teacher_assignments (teacher_id, course_id, subject_id, batch_id) VALUES
  ('70000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- 8. Demo Student
INSERT INTO students (id, profile_id, student_id, name, email, phone, guardian_name, guardian_phone, admission_date, academic_session, course_id, batch_id, status, roll_number) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000004', 'SPE-STU-2026-001', 'Aarav Patel', 'student.aarav@pinnakeedge.edu', '+91 99887 76655', 'Suresh Patel', '+91 99887 76600', '2026-01-15', '2026-2027', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'active', 'JEE-26-001')
ON CONFLICT (student_id) DO NOTHING;

-- 9. Sample Attendance for Demo Student
INSERT INTO attendance_records (student_id, batch_id, date, status, marked_by_teacher_id) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', '2026-10-15', 'present', '70000000-0000-0000-0000-000000000001'),
  ('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', '2026-10-16', 'present', '70000000-0000-0000-0000-000000000001'),
  ('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', '2026-10-17', 'present', '70000000-0000-0000-0000-000000000001'),
  ('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', '2026-10-18', 'present', '70000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- 10. Sample Invoice & Payment
INSERT INTO invoices (id, invoice_number, student_id, student_name, course_id, academic_session, fee_description, total_amount, discount_amount, amount_paid, outstanding_balance, due_date, status) VALUES
  ('10000000-0000-0000-0000-000000000001', 'INV-2026-0001', 'd0000000-0000-0000-0000-000000000001', 'Aarav Patel', 'c0000000-0000-0000-0000-000000000001', '2026-2027', 'Annual Tuition Fee - Term 1', 72500, 5000, 67500, 0, '2026-02-15', 'paid')
ON CONFLICT (invoice_number) DO NOTHING;

INSERT INTO payments (id, receipt_number, invoice_id, invoice_number, student_id, student_name, payment_date, amount, payment_method, reference_number, recorded_by, status) VALUES
  ('20000000-0000-0000-0000-000000000001', 'REC-2026-0001', '10000000-0000-0000-0000-000000000001', 'INV-2026-0001', 'd0000000-0000-0000-0000-000000000001', 'Aarav Patel', '2026-01-15', 67500, 'upi', 'UPI/AXIS/401582910482', 'Principal Office', 'verified')
ON CONFLICT (receipt_number) DO NOTHING;

-- 11. Sample Announcement
INSERT INTO announcements (id, title, content, author_name, author_role, target_audience, priority) VALUES
  ('0a000000-0000-0000-0000-000000000001', 'Welcome to Shri PinnakeEdge Smart LMS', 'Official digital portal is live for all teachers and students. Check your timetable and course modules.', 'Dr. Rajeshwar Sharma', 'Principal', 'all', 'important')
ON CONFLICT DO NOTHING;
