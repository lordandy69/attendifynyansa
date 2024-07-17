import { Database } from "@/types/supabase";
import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL } from "../constants";

export const supabaseClient = () =>
  createBrowserClient<Database>(
    SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
