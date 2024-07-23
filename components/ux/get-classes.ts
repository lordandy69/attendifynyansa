import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Database } from "@/types/supabase";
import { supabaseClient } from "@/lib/supabase/client";

type classData = Database["public"]["Tables"]["classes"]["Row"];

export function useGetClasses(class_id: string) {
  const supabase = supabaseClient();
  const [class_data, setClassData] = useState<classData | null>(null);

  useEffect(() => {
    supabase
      .from("classes")
      .select("*")
      .eq("class_id", class_id)
      .single()
      .then(({ data }) => {
        setClassData(data);
      });
  }, [class_id, supabase]);

  useEffect(() => {
    supabase
      .channel("get-custome-class-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "classes",
          // filter: `class_id=eq.${class_id}`,
          filter: "class_id=eq.gHrrws",
        },
        (payload) => {
          console.log("Change received!", payload.new);
          setClassData(payload.new as classData);
        }
      )
      .subscribe();
  }, []);

  // !session?.user.email ? console.log("Not Logged In") : console.log(profile);

  return { class_data };
}
export function useGetAllClasses(teacher_id: string) {
  const supabase = supabaseClient();
  const [all_class_data, setAllClassData] = useState<classData[] | null>(null);

  useEffect(() => {
    supabase
      .from("classes")
      .select("*")
      .eq("teacher_id", teacher_id)
      .then(({ data }) => {
        setAllClassData(data);
      });
  }, [supabase, teacher_id]);
  // !session?.user.email ? console.log("Not Logged In") : console.log(profile);

  return { all_class_data };
}
