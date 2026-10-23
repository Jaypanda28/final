import { UserRole } from '@/types';

export type Permission =
  // Student permissions
  | 'view_personal_dashboard'
  | 'view_enrolled_courses'
  | 'download_study_materials'
  | 'submit_assignments'
  | 'take_examinations'
  | 'view_published_results'
  | 'view_personal_fees'
  
  // Teacher permissions
  | 'view_assigned_batches'
  | 'mark_attendance'
  | 'correct_attendance'
  | 'upload_study_materials'
  | 'create_assignments'
  | 'grade_assignments'
  | 'create_examinations'
  | 'grade_examinations'
  | 'post_batch_announcements'
  
  // Principal permissions
  | 'manage_students'
  | 'manage_teachers'
  | 'manage_courses'
  | 'manage_batches'
  | 'manage_timetable'
  | 'oversight_all_attendance'
  | 'authorize_results_publication'
  | 'manage_fee_structures'
  | 'record_fee_payments'
  | 'view_academic_reports'
  | 'view_audit_logs'
  
  // Chairman permissions
  | 'view_executive_dashboard'
  | 'view_financial_analytics'
  | 'view_retention_reports'
  | 'export_management_reports'
  | 'manage_executive_settings';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  student: [
    'view_personal_dashboard',
    'view_enrolled_courses',
    'download_study_materials',
    'submit_assignments',
    'take_examinations',
    'view_published_results',
    'view_personal_fees',
  ],
  teacher: [
    'view_assigned_batches',
    'mark_attendance',
    'correct_attendance',
    'upload_study_materials',
    'create_assignments',
    'grade_assignments',
    'create_examinations',
    'grade_examinations',
    'post_batch_announcements',
    'download_study_materials',
  ],
  principal: [
    'manage_students',
    'manage_teachers',
    'manage_courses',
    'manage_batches',
    'manage_timetable',
    'oversight_all_attendance',
    'mark_attendance',
    'correct_attendance',
    'upload_study_materials',
    'create_assignments',
    'create_examinations',
    'authorize_results_publication',
    'manage_fee_structures',
    'record_fee_payments',
    'view_academic_reports',
    'view_audit_logs',
    'post_batch_announcements',
  ],
  chairman: [
    'view_executive_dashboard',
    'view_financial_analytics',
    'view_retention_reports',
    'export_management_reports',
    'manage_executive_settings',
    'view_academic_reports',
    'view_audit_logs',
    'oversight_all_attendance',
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions ? permissions.includes(permission) : false;
}

export function getRoleDashboardPath(role: UserRole): string {
  switch (role) {
    case 'principal':
      return '/principal';
    case 'chairman':
      return '/chairman';
    case 'teacher':
      return '/teacher';
    case 'student':
      return '/student';
    default:
      return '/login';
  }
}
