import { useUserStore } from "@/lib/store/user";
import { supabaseClient } from "@/lib/supabase/client";
import { supabaseServer } from "@/lib/supabase/server";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = supabaseClient();

  const { data, error } = await supabase.auth.getUser();
  if (!error || data?.user) {
    redirect("/class");
  }

  return (
    <main className="bg-blue-950 h-screen p-4 justify-center items-center  flex ">
      <section className="bg-white rounded-3xl w-full  h-full flex justify-center items-center">
        <section className="mx-auto max-w-2xl flex flex-col items-center min-h-screen h-dvh justify-center p-4 space-y-6">
          <h2 className="flex flex-col items-center text-5xl font-bold">
            <span>Welcome to</span>
            <span>Time Trace</span>
          </h2>
          <p className="max-w-3xl text-center">
            TImeTrace is a web application designed to simplify attendance
            tracking for educational institutions. Using our platform,
            instructors can easily create classes and generate unique QR codes
            for students to scan, making the attendance process efficient,
            accurate, and hassle-free.
          </p>
          <div className="flex flex-col items-start p-4 bg-blue-950 text-white max-w-2xl rounded-2xl">
            <p className="text-xl font-medium text-yellow-600">Key Features</p>
            <p>
              Easy class creation and management, Automatic QR code generation,
              Real-time attendance tracking , Comprehensive attendance reports
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
