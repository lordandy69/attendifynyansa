// utils/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// ✅ Make sure you have these environment variables set in a `.env.local` file
// NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
// NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Create and export a single Supabase client for the whole app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
