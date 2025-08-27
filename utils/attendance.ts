// utils/attendance.ts
import { supabase } from "./supabaseClient";

export type AttendanceStatus = "present" | "late" | "absent";

export type AttendanceRecord = {
  id?: string;            // UUID, auto-generated
  session_id: string;     // FK -> sessions.id
  student_id: string;     // FK -> profiles.id
  teacher_id?: string;    // FK -> profiles.id (optional)
  time_logged?: string;   // timestamp, default now()
  status?: AttendanceStatus; // defaults to 'present'
};

// ========================
// CREATE ATTENDANCE (student scans QR)
// ========================
export async function markAttendance(record: AttendanceRecord) {
  const { data, error } = await supabase
    .from("attendance")
    .insert([record])
    .select()
    .single();

  if (error) return { error: error.message, data: null };
  return { error: null, data };
}

// ========================
// GET ATTENDANCE BY SESSION
// ========================
export async function getAttendanceBySession(session_id: string) {
  const { data, error } = await supabase
    .from("attendance")
    .select("*, profiles!student_id(*)")
    .eq("session_id", session_id);

  if (error) return { error: error.message, data: null };
  return { error: null, data };
}

// ========================
// GET ATTENDANCE BY STUDENT
// ========================
export async function getAttendanceByStudent(student_id: string) {
  const { data, error } = await supabase
    .from("attendance")
    .select("*, sessions(*), profiles!teacher_id(*)")
    .eq("student_id", student_id);

  if (error) return { error: error.message, data: null };
  return { error: null, data };
}

// ========================
// UPDATE ATTENDANCE STATUS
// ========================
export async function updateAttendanceStatus(
  attendance_id: string,
  status: AttendanceStatus
) {
  const { data, error } = await supabase
    .from("attendance")
    .update({ status })
    .eq("id", attendance_id)
    .select()
    .single();

  if (error) return { error: error.message, data: null };
  return { error: null, data };
}

// ========================
// DELETE ATTENDANCE (admin/teacher only)
// ========================
export async function deleteAttendance(attendance_id: string) {
  const { error } = await supabase
    .from("attendance")
    .delete()
    .eq("id", attendance_id);

  if (error) return { error: error.message };
  return { error: null };
}
