"use client";
import { useGetClasses } from "@/components/ux/get-classes";
import { useQRCodeGenerator } from "@/components/ux/qr-code-generator";
import { FrameContext } from "@/lib/store/FrameContextStore";
import { format, parseISO, isValid } from "date-fns";
import { useContext, useEffect, useState } from "react";
import ExportButton from "@/components/ux/ExportButton";
import { useGetSession } from "@/lib/supabase/session";
import { redirect } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";
import { Database } from "@/types/supabase";
import { studentsJoinedArray } from "@/types/types";
import { Button } from "@/components/ui/button";

type props = {
  params: { class_id: string };
};

type classData = Database["public"]["Tables"]["classes"]["Row"];
type studentsDetailsProps =
  | {
      created_at: string;
      email: string | null;
      full_name: string | null;
      id: number;
      index_number: string | null;
      is_teacher: boolean;
      program_name: string | null;
      user_id: string | null;
    }[]
  | null;

async function fetchJoinedStudentsDetails(
  joinedStudents: studentsJoinedArray[]
) {
  const detailedStudents = [];
  const supabase = supabaseClient();

  for (const student of joinedStudents) {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", student.student_id)
      .single();

    if (data) {
      detailedStudents.push(data);
    }
  }

  return detailedStudents;
}

export default function Page({ params }: props) {
  const supabase = supabaseClient();
  const { user } = useGetSession();

  const [class_data, setClassData] = useState<classData | null>(null);
  const [joinedStudent, setJoinedStudents] =
    useState<studentsDetailsProps>(null);
  const frameContext = useContext(FrameContext);
  const { QRCodeComponent } = useQRCodeGenerator();

  console.log(joinedStudent);

  useEffect(() => {
    supabase
      .from("classes")
      .select("*")
      .eq("class_id", params.class_id)
      .single()
      .then(({ data }) => {
        setClassData(data);
      });

    supabase
      .channel("get-custome-class-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "classes",
          filter: `class_id=eq.${params.class_id}`,
        },
        (payload) => {
          console.log("Change received!", payload.new);
          setClassData(payload.new as any);
        }
      )
      .subscribe();
  }, []);

  // useEffect(() => {
  //   const detailedStudents: {
  //     created_at: string;
  //     email: string | null;
  //     full_name: string | null;
  //     id: number;
  //     index_number: string | null;
  //     is_teacher: boolean;
  //     program_name: string | null;
  //     user_id: string | null;
  //   }[] = [];
  //   const jS = class_data?.students_joined;

  //   if (jS && jS.length > 0) {
  //     for (const s of jS) {
  //       supabase
  //         .from("user_profiles")
  //         .select("*")
  //         .eq("user_id", s.student_id)
  //         .single()
  //         .then(({ data }) => {
  //           if (data) {
  //             detailedStudents.push(data);
  //           }
  //         });
  //     }
  //   }

  //   setJoinedStudents(detailedStudents as any);
  // }, [class_data?.students_joined]);

  return (
    <main className='mt-24'>
      <div className='mx-auto max-w-2xl p-4 flex flex-col'>
        <section className=''>
          <div className='grid md:grid-cols-2 gap-4'>
            <div className='flex flex-col space-y-4'>
              <div className='flex flex-col'>
                <p className='text-sm font-medium underline'>Class Id</p>
                <h2 className='text-neutral-500 py-1 px-2 rounded bg-neutral-200 w-fit'>
                  {class_data?.class_id}
                </h2>
              </div>
              <div>
                <p className='text-sm font-medium underline'>Class Name</p>
                <h2 className='text-neutral-500'>{class_data?.class_name}</h2>
              </div>
              <div>
                <p className='text-sm font-medium underline'>Created At</p>
                <h2 className='text-neutral-500'>
                  {class_data?.created_at!
                    ? format(parseISO(class_data?.created_at!), "PPP p")
                    : "date not available"}
                </h2>
              </div>
              <div>
                <p className='text-sm font-medium underline'>Teacher</p>
                <h2 className='text-neutral-500'>{class_data?.teacher_name}</h2>
              </div>
              <div>
                <p className='text-sm font-medium underline'>
                  Class Start Time
                </p>
                <h2 className='text-neutral-500'>
                  {class_data?.class_start!
                    ? format(parseISO(class_data?.class_start!), "PPP p")
                    : "date not available"}
                </h2>
              </div>
              <div>
                <p className='text-sm font-medium underline'>Class End Time</p>
                <h2 className='text-neutral-500'>
                  {class_data?.class_end!
                    ? format(parseISO(class_data?.class_end!), "PPP p")
                    : "date not available"}
                </h2>
              </div>
              <div>
                <p className='text-sm font-medium underline'>Class Location</p>
                <h2 className='text-neutral-500'>{class_data?.location!}</h2>
              </div>
            </div>
            <div className='flex flex-col items-center space-y-4'>
              <div
                ref={frameContext}
                id='frame'
                className='flex flex-col items-center space-y-2 bg-white'
              >
                <QRCodeComponent
                  size={346}
                  qrcodevalue={class_data?.class_id!}
                />
                <p>{class_data?.class_name}</p>
              </div>
              <div>
                <ExportButton />
              </div>
            </div>
          </div>
          <div className='flex flex-col my-10 border-t items-center border-neutral-200'>
            <div className='flex flex-col w-full'>
              {!class_data?.students_joined ? (
                <p className=''>No Students have Joined</p>
              ) : (
                <div className='flex flex-col'>
                  <div className=' flex items-center space-x-4'>
                    <p className='mb-2'>Studens Who Joined</p>
                    <Button>Copy Joined Students</Button>
                  </div>
                  <ol className='flex flex-col items-start w-full list-disc'>
                    {class_data.students_joined.map((c) => {
                      return (
                        <li key={c.student_id}>
                          {c.full_name} - {c.student_email}
                        </li>
                      );
                    })}
                  </ol>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
