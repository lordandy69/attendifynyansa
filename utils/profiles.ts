// utils/profiles.ts
import { supabase } from "./supabaseClient";

// Profile type (aligns with our schema)
export type Profile = {
  id: string; // uuid from auth.users
  username?: string;
  name?: string;
  email?: string;
  role?: "admin" | "teacher" | "student";
  student_id?: string;
  teacher_id?: string;
  admin_id?: string;
  department?: string;
};

// Create a new profile (after user signs up via Supabase Auth)
export async function createProfile(profile: Profile) {
  const { data, error } = await supabase
    .from("profiles")
    .insert([profile])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Get all profiles
export async function getProfiles() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*");

  if (error) throw new Error(error.message);
  return data;
}

// Get a single profile by ID
export async function getProfileById(id: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Update profile
export async function updateProfile(id: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Delete profile
export async function deleteProfile(id: string) {
  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
}
