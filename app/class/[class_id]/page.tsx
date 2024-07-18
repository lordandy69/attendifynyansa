"use client";
import { useGetClasses } from "@/components/ux/get-classes";
import { useQRCodeGenerator } from "@/components/ux/qr-code-generator";
import { FrameContext } from "@/lib/store/FrameContextStore";
import { format, parseISO, isValid } from "date-fns";
import { useContext } from "react";
import ExportButton from "@/components/ux/ExportButton";
import { useGetSession } from "@/lib/supabase/session";
import { redirect } from "next/navigation";

type props = {
  params: { class_id: string };
};
export default function Page({ params }: props) {
  const { user } = useGetSession();
  const { class_data } = useGetClasses(params.class_id);
  const frameContext = useContext(FrameContext);
  const { QRCodeComponent } = useQRCodeGenerator();

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
              <p className='mb-2'>Studens Who Joined</p>
              {!class_data?.students_joined ? (
                <p className=''>No Students have Joined</p>
              ) : (
                <ol className='flex flex-col items-start w-full list-disc'>
                  {class_data.students_joined.map((c) => {
                    return <li key={c.student_id}>{c.student_email}</li>;
                  })}
                </ol>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
