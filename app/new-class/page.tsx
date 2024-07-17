import NewClassForm from "@/components/forms/class/new-class";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Page() {
  return (
    <main className='mt-24'>
      <div className='mx-auto max-w-2xl p-4 flex flex-col'>
        <section className=''>
          <div className='flex flex-col w-full items-center justify-center'>
            <NewClassForm />
          </div>
        </section>
      </div>
    </main>
  );
}
