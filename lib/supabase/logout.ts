// "use client";
import { supabaseClient } from "@/lib/supabase/client";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserStore } from "../store/user";

const supabase = supabaseClient();

async function useLogOut() {
  return new Promise(async (resolve, reject) => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      reject(error);
    }

    resolve("Signed Out");
  });
}

export { useLogOut };
