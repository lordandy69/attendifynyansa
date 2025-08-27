// utils/auth.ts
import { supabase } from "./supabaseClient";
import { UserRole } from "./types";

// ========================
// SIGN UP
// ========================
export async function signUp({
  email,
  password,
  username,
  name,
  role = "student", // default role
}: {
  email: string;
  password: string;
  username: string;
  name: string;
  role?: UserRole;
}) {
  // Step 1: Sign up with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return { error: authError.message, data: null };
  }

  const userId = authData.user?.id;

  // Step 2: Create profile in "profiles" table
  if (userId) {
    const { data, error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: userId,
          username,
          name,
          email,
          role,
        },
      ])
      .select()
      .single();

    if (profileError) {
      return { error: profileError.message, data: null };
    }

    return { error: null, data };
  }

  return { error: "Could not get user ID from Supabase Auth", data: null };
}

// ========================
// LOGIN
// ========================
export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { error: error.message, data: null };
  return { error: null, data };
}

// ========================
// LOGOUT
// ========================
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) return { error: error.message };
  return { error: null };
}

// ========================
// GET CURRENT USER
// ========================
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) return { error: error.message, data: null };
  return { error: null, data: data.user };
}
