export type UserRole = "admin" | "teacher" | "student";
export type AttendanceStatus = "present" | "late" | "absent";

export interface Profile {
  id: string; // uuid
  username?: string;
  name?: string;
  email: string;
  role: UserRole;
  student_id?: string;
  teacher_id?: string;
  admin_id?: string;
  department?: string;
}

export interface Course {
  id: string; // uuid
  course_code: string;
  course_name: string;
}

export interface Session {
  id: string; // uuid
  course_id: string;
  teacher_id?: string;
  session_date: string; // date
  session_time: string; // time
  venue?: string;
  qr_code?: string;
  qr_expiry?: string;
}

export interface Attendance {
  id: string; // uuid
  session_id: string;
  student_id: string;
  teacher_id?: string;
  time_logged: string; // timestamp
  status: AttendanceStatus;
}
