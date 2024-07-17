import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Page() {
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
            <p className='py-10'>No Classes ...Create New Class</p>
          </div>
        </section>
      </div>
    </main>
  );
}
