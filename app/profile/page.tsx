"use client";
import { Button } from "@/components/ui/button";
import { useLogOut } from "@/lib/supabase/logout";
import { useGetSession } from "@/lib/supabase/session";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Page() {
  const { profile, user } = useGetSession();
  const router = useRouter();

  return (
    <main className='mt-24'>
      <div className='mx-auto max-w-2xl flex flex-col p-4'>
        <section className=''>
          <div className='flex flex-col mb-4'>
            <h2 className='text-2xl font-bold'>Profile Page</h2>
          </div>
          <div className='flex flex-col space-y-4 mb-4'>
            <div className='flex flex-col'>
              <p className='font-medium'>Full Name</p>
              <p className='text-neutral-500'>{profile?.full_name!}</p>
            </div>
            <div className='flex flex-col'>
              <p className='font-medium'>Email Address</p>
              <p className='text-neutral-500'>{profile?.email!}</p>
            </div>
            <div className='flex flex-col'>
              <p className='font-medium'>Teacher Id</p>
              <p className='text-neutral-500'>{profile?.user_id!}</p>
            </div>
          </div>
          <div>
            <Button
              variant={"destructive"}
              onClick={() => {
                toast.promise(useLogOut, {
                  loading: "Loading..",
                  success: (data) => {
                    return "Signed Out";
                  },
                  error: (err: any) => `Error: ${err.message}`,
                });
                router.push("/");
              }}
            >
              Log Out
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
