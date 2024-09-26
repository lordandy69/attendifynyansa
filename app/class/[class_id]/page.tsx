//@ts-nocheck
'use client';
import { useGetAllClasses, useGetClasses } from '@/components/ux/get-classes';
import { useQRCodeGenerator } from '@/components/ux/qr-code-generator';
import { FrameContext } from '@/lib/store/FrameContextStore';
import { format, parseISO, isValid } from 'date-fns';
import { useContext, useEffect, useState } from 'react';
import ExportButton from '@/components/ux/ExportButton';
import { useGetSession } from '@/lib/supabase/session';
import { redirect, useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabase/client';
import { Database } from '@/types/supabase';
import { studentsJoinedArray } from '@/types/types';
import { Button } from '@/components/ui/button';
import { JoinedStudentsTable } from '@/components/tables/students-joined';
import { differenceInDays, isPast } from 'date-fns';
import { toast } from 'sonner';
import { ClassesPerDayChart } from '@/components/charts/classes-per-day';
import { ClassesPerTimeChart } from '@/components/charts/class-per-day';

type props = {
  params: { class_id: string };
};

type classData = Database['public']['Tables']['classes']['Row'];
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
      .from('user_profiles')
      .select('*')
      .eq('user_id', student.student_id)
      .single();

    if (data) {
      detailedStudents.push(data);
    }
  }

  return detailedStudents;
}

function getClassStatus(classEndDate: string | null): {
  status: 'Class Ended' | 'Class Upcoming' | 'Date not available';
} {
  if (!classEndDate) {
    return { status: 'Date not available' };
  }

  const endDate = parseISO(classEndDate);
  const now = new Date();

  if (isPast(endDate)) {
    // const daysPassed = differenceInDays(now, endDate);
    return { status: 'Class Ended' };
  } else {
    // const daysRemaining = differenceInDays(endDate, now);
    return { status: 'Class Upcoming' };
  }
}

const getNextAvailableCodeIndex = (
  joinedStudents: studentsJoinedArray[],
  rndCodes: { id: number; code: string }[]
) => {
  const usedCodes = new Set(
    joinedStudents.map((student) => student.random_code)
  );
  return rndCodes.findIndex((code) => !usedCodes.has(code.code));
};

function getJoinIdInfo(joinId: string, classData: classData) {
  const joinIdInRndCodes = classData.rnd_codes.find(
    (rnd) => rnd.code === joinId
  );
  const nextRndCode = classData.rnd_codes[joinIdInRndCodes?.id! + 1];

  // const currentRndCodeIndex = classData.rnd_codes.findIndex(
  //   (code) => code.code === currentRndCode
  // );

  // const nextRndCodeIndex = currentRndCodeIndex + 1;
  // const nextRndCode = classData.rnd_codes[nextRndCodeIndex];

  return nextRndCode;
}

export default function Page({ params }: props) {
  const supabase = supabaseClient();
  const { user } = useGetSession();
  const router = useRouter();

  const [class_data, setClassData] = useState<classData | null>(null);
  const [joinedStudent, setJoinedStudents] =
    useState<studentsDetailsProps>(null);
  const frameContext = useContext(FrameContext);
  const { QRCodeComponent } = useQRCodeGenerator();
  const { all_class_data } = useGetAllClasses(class_data?.teacher_id!);
  const [currentCodeIndex, setCurrentCodeIndex] = useState(0);

  const qrCodeValue = `${class_data?.class_id}-${class_data?.rnd_codes?.[currentCodeIndex]?.code}`;

  // console.log(class_data?.students_joined!);

  useEffect(() => {
    const lastJoinedStudent = class_data?.students_joined?.slice(-1)[0];
    const firstRandomCode = class_data?.rnd_codes?.[0];
    const lsj = class_data?.rnd_codes.find(
      (rnd) => rnd.code === lastJoinedStudent?.join_id!
    );
    const ljs_id = lsj?.id;
    const frc_id = 0;

    const joinIdInRndCodes = !class_data?.students_joined! ? frc_id! : ljs_id!;
    const nextRndCode = class_data?.rnd_codes[joinIdInRndCodes + 1];

    setCurrentCodeIndex(nextRndCode?.id!);
  });

  useEffect(() => {
    supabase
      .from('classes')
      .select('*')
      .eq('class_id', params.class_id)
      .single()
      .then(({ data }) => {
        setClassData(data);
      });

    supabase
      .channel('get-custome-class-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'classes',
          filter: `class_id=eq.${params.class_id}`,
        },
        (payload) => {
          console.log('Change received!', payload.new);
          setClassData(payload.new as any);
        }
      )
      .subscribe();
  }, []);

  function exportStudentsToCSV() {
    if (
      !class_data?.students_joined ||
      class_data.students_joined.length === 0
    ) {
      return 'No student data available';
    }

    const headers = [
      'Student Email',
      'Student ID',
      'Student Full Name',
      'Student Index Number',
      'Student Program',
    ];
    const csvRows = [headers.join(',')];

    class_data.students_joined.forEach((student: studentsJoinedArray) => {
      const row = [
        student.student_email,
        student.student_id,
        student.full_name,
        student.index_number,
        student.program_name,
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }

  // const joinIdInfo = getJoinIdInfo('5464', class_data);
  // console.log(joinIdInfo);

  // function exportAndDownloadStudentsCSV() {
  //   const csvContent = exportStudentsToCSV();

  //   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  //   const link = document.createElement("a");
  //   if (link.download !== undefined) {
  //     const url = URL.createObjectURL(blob);
  //     link.setAttribute("href", url);
  //     link.setAttribute("download", `students_${class_data?.class_id!}.csv`);
  //     link.style.visibility = "hidden";
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   }
  // }

  const [exportState, setExportState] = useState<
    'export' | 'exporting' | 'exported'
  >('export');

  function exportAndDownloadStudentsCSV() {
    setExportState('exporting');
    const csvContent = exportStudentsToCSV();

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `students_${class_data?.class_id!}_${class_data?.class_name!}.csv`
      );
      link.style.visibility = 'hidden';
      document.body.appendChild(link);

      setTimeout(() => {
        link.click();
        document.body.removeChild(link);
        setExportState('exported');

        // Reset to 'export' after 3 seconds
        setTimeout(() => {
          setExportState('export');
        }, 3000);
      }, 1000); // Simulate export process taking 1 second
    }
  }
  const classStatus = getClassStatus(class_data?.class_end!);

  function DeleteClass() {
    supabase
      .from('classes')
      .delete()
      .eq('class_id', params.class_id)
      .then(({ data }) => {
        router.push('/class');
        //navigate to all the classes
      });
  }

  const handleDelteClass = () => {
    return new Promise(async (resolve, reject) => {
      const supabase = supabaseClient();

      const { data, error, statusText } = await supabase
        .from('classes')
        .delete()
        .eq('class_id', params.class_id);

      if (error) {
        reject(error);
      } else {
        resolve(statusText);
        router.push('/class');
      }

      router.refresh();
    });
  };
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
                    ? format(parseISO(class_data?.created_at!), 'PPP p')
                    : 'date not available'}
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
                    ? format(parseISO(class_data?.class_start!), 'PPP p')
                    : 'date not available'}
                </h2>
              </div>
              <div>
                <p className='text-sm font-medium underline'>Class End Time</p>
                <h2 className='text-neutral-500'>
                  {class_data?.class_end!
                    ? format(parseISO(class_data?.class_end!), 'PPP p')
                    : 'date not available'}
                </h2>
              </div>
              <div>
                <p className='text-sm font-medium underline'>Class Location</p>
                <h2 className='text-neutral-500'>{class_data?.location!}</h2>
              </div>
              <div>
                <p className='text-sm font-medium underline'>
                  Current Joinning Code
                </p>
                <h2 className='text-neutral-500'>
                  {class_data?.rnd_codes?.[currentCodeIndex]?.code}
                </h2>
              </div>
            </div>
            <div className='flex flex-col py-4'>
              {classStatus.status === 'Class Upcoming' ? (
                <div className='flex flex-col items-center space-y-4'>
                  <div
                    ref={frameContext}
                    id='frame'
                    className='flex flex-col items-center space-y-2 bg-white'
                  >
                    <QRCodeComponent size={346} qrcodevalue={qrCodeValue} />
                    <p>{class_data?.class_name}</p>
                  </div>
                  <div>
                    <ExportButton />
                  </div>
                </div>
              ) : classStatus.status == 'Class Ended' ? (
                <p className='text-4xl font-medium'>Class Has Ended</p>
              ) : (
                <p className='text-4xl'>Date Not Available</p>
              )}
            </div>
          </div>
          {/* class chart */}
          <div>{/* <ClassesPerTimeChart /> */}</div>
          {/* class table */}
          <div className='flex flex-col my-10 border-t items-center border-neutral-200'>
            <div className='flex flex-col w-full'>
              {!class_data?.students_joined ? (
                <p className=''>No Students have Joined</p>
              ) : (
                <div className='flex flex-col'>
                  <div className='flex flex-col md:flex-row items-center space-x-4 py-4 justify-between'>
                    <p className='mb-2'>Studens Who Joined</p>
                    <Button
                      onClick={exportAndDownloadStudentsCSV}
                      disabled={exportState === 'exporting'}
                    >
                      {exportState === 'export' && 'Export Students CSV'}
                      {exportState === 'exporting' && 'Exporting...'}
                      {exportState === 'exported' && 'Exported!'}
                    </Button>
                  </div>
                  <JoinedStudentsTable data={class_data.students_joined} />
                </div>
              )}
            </div>
          </div>
          {/* delete class */}
          <div className='flex flex-col my-10 border-t items-center border-neutral-200'>
            <div className='flex flex-col w-full space-y-2'>
              <p className='text-xl font-medium'>Delete Class</p>
              <p className='text-neutral-500'>
                This will remove the class and its data.
              </p>
              <Button
                variant={'destructive'}
                className='w-fit'
                onClick={() =>
                  toast.promise(handleDelteClass, {
                    loading: 'Deleting Class...',
                    success: (data: any) => `Class Deleted ${data}`,
                    error: (err: any) => `Error: ${err.message}`,
                  })
                }
              >
                Delete Class
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
