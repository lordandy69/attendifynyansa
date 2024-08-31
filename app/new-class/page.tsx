import NewClassForm from "@/components/forms/class/new-class";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'New Class -- Time Trace',
  description: 'Create A New Class',
};

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
