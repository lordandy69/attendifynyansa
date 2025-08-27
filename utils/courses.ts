// utils/courses.ts
import { supabase } from "./supabaseClient";

export type Course = {
  id?: string;          // UUID, auto-generated
  course_code: string;  // e.g., "CS101"
  course_name: string;  // e.g., "Introduction to Computer Science"
};

// ========================
// CREATE COURSE
// ========================
export async function createCourse(course: Course) {
  const { data, error } = await supabase
    .from("courses")
    .insert([course])
    .select()
    .single();

  if (error) return { error: error.message, data: null };
  return { error: null, data };
}

// ========================
// GET ALL COURSES
// ========================
export async function getAllCourses() {
  const { data, error } = await supabase.from("courses").select("*");

  if (error) return { error: error.message, data: null };
  return { error: null, data };
}

// ========================
// GET COURSE BY ID
// ========================
export async function getCourseById(id: string) {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return { error: error.message, data: null };
  return { error: null, data };
}

// ========================
// UPDATE COURSE
// ========================
export async function updateCourse(
  id: string,
  updates: Partial<Course>
) {
  const { data, error } = await supabase
    .from("courses")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return { error: error.message, data: null };
  return { error: null, data };
}

// ========================
// DELETE COURSE
// ========================
export async function deleteCourse(id: string) {
  const { error } = await supabase
    .from("courses")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };
  return { error: null };
}
