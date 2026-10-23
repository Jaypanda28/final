import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, parseSessionToken } from '@/lib/auth/session';
import { db } from '@/lib/services/database';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const user = parseSessionToken(token);

  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  // Augment with rich student/teacher details from the database
  let enrichedUser: Record<string, any> = { ...user };
  if (user.role === 'student') {
    const student = db.getStudentById(user.id) || db.getStudentById(user.instituteId || '') || db.getStudentById(user.email);
    if (student) {
      enrichedUser = {
        ...user,
        studentId: student.studentId,
        courseId: student.courseId,
        courseName: student.courseName,
        batchId: student.batchId,
        batchName: student.batchName,
        rollNumber: student.rollNumber,
        guardianName: student.guardianName,
        guardianPhone: student.guardianPhone,
        academicSession: student.academicSession,
      };
    }
  } else if (user.role === 'teacher') {
    const teacher = db.getTeacherById(user.id) || db.getTeacherById(user.instituteId || '') || db.getTeacherById(user.email);
    if (teacher) {
      enrichedUser = {
        ...user,
        teacherId: teacher.teacherId,
        specialization: teacher.specialization,
        qualification: teacher.qualification,
        assignedSubjectIds: teacher.assignedSubjectIds,
        assignedSubjectNames: teacher.assignedSubjectNames,
        assignedBatchIds: teacher.assignedBatchIds,
        assignedBatchNames: teacher.assignedBatchNames,
      };
    }
  }

  return NextResponse.json({ authenticated: true, user: enrichedUser });
}
