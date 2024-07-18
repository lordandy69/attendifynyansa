"use client";
import { buttonVariants } from "@/components/ui/button";
import { useGetAllClasses } from "@/components/ux/get-classes";
import { useGetSession } from "@/lib/supabase/session";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";

export default function Page() {
  const { profile, user } = useGetSession();
  const router = useRouter();
  const { all_class_data } = useGetAllClasses(profile?.user_id!);

  if (!user) return redirect("/");
  return (
    <main className='mt-24'>
      <div className='mx-auto max-w-2xl p-4 flex flex-col'>
        <section className=''>
          <div className='flex flex-col w-full items-center justify-center'>
            <Link
              href={"/new-class"}
              className={cn(
                buttonVariants({}),
                "bg-gradient-to-r from-[#3A608A] to-[#232323]"
              )}
            >
              Create New Class
            </Link>
          </div>
          <div className='flex flex-col my-10 border-t items-center border-neutral-200'>
            {!all_class_data ? (
              <p className='py-10'>No Classes ...Create New Class</p>
            ) : (
              <div className='flex flex-col space-y-4 my-4  '>
                {all_class_data.map((c) => {
                  return (
                    <Link
                      href={`/class/${c.class_id}`}
                      key={c.id}
                      className='flex items-center justify-between border border-neutral-200 rounded-xl px-4 py-2'
                    >
                      <div>
                        <p>{c.class_name}</p>
                        <p className='text-sm'>{c.teacher_name}</p>
                      </div>
                      <p className=''>open class</p>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
