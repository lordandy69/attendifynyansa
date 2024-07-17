import CreateAccountForm from "@/components/forms/auth/create-account-form";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowLeft, UserPlusIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function Page() {
  return (
    <main>
      <div className='mx-auto w-full max-w-5xl flex flex-col min-h-screen h-full items-center justify-center py-10'>
        {/* back absolute top */}
        <Link
          href={"/"}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            " space-x-2 absolute top-4 left-4 group inline-flex w-max items-center justify-center text-gray-600 hover:text-black rounded-full text-sm font-medium transition-colors focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
          )}
        >
          <span>
            <ArrowLeft className=' w-[18px] h-[18px]' />
          </span>
          <span className='text-sm font-semibold'>Back</span>
        </Link>
        <section className='w-full flex flex-col items-center flex-1 justify-center p-6'>
          <div className='flex flex-col items-center justify-center pb-4 pt-2 w-full'>
            {/* message */}
            <div className={cn("text-center space-y-1")}>
              <h2 className='text-2xl font-semibold'>Create a new account</h2>
              <p className='text-gray-400'>Enter your details to register.</p>
            </div>
          </div>
          <CreateAccountForm />
        </section>
      </div>
    </main>
  );
}
