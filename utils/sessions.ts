// utils/sessions.ts
import { supabase } from "./supabaseClient";

export interface Session {
  id?: string;
  course_id: string;
  teacher_id: string;
  session_date: string; // YYYY-MM-DD
  session_time: string; // HH:mm:ss
  venue?: string;
  qr_code?: string;
  qr_expiry?: string; // ISO timestamp
}

// Create a new class session
export async function createSession(session: Session) {
  const { data, error } = await supabase.from("sessions").insert([session]).select().single();
  if (error) throw error;
  return data;
}

// Get all sessions for a course
export async function getSessionsByCourse(courseId: string) {
  const { data, error } = await supabase
    .from("sessions")
    .select("*, courses(course_name), profiles(name)")
    .eq("course_id", courseId);
  if (error) throw error;
  return data;
}

// Get sessions for a specific teacher
export async function getSessionsByTeacher(teacherId: string) {
  const { data, error } = await supabase
    .from("sessions")
    .select("*, courses(course_name)")
    .eq("teacher_id", teacherId);
  if (error) throw error;
  return data;
}

// Update a session (e.g., venue, qr_code, qr_expiry)
export async function updateSession(sessionId: string, updates: Partial<Session>) {
  const { data, error } = await supabase
    .from("sessions")
    .update(updates)
    .eq("id", sessionId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Delete a session
export async function deleteSession(sessionId: string) {
  const { error } = await supabase.from("sessions").delete().eq("id", sessionId);
  if (error) throw error;
  return true;
}
