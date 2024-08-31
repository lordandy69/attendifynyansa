'use client';
import { buttonVariants } from '@/components/ui/button';
import { useGetAllClasses } from '@/components/ux/get-classes';
import { useGetSession } from '@/lib/supabase/session';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import {
  isSameDay,
  isPast,
  isFuture,
  parseISO,
  startOfDay,
  format,
} from 'date-fns';
import { Database } from '@/types/supabase';
import { useEffect, useState } from 'react';
type classData = Database['public']['Tables']['classes']['Row'];
type classCat = {
  today: classData[];
  upcoming: classData[];
  ended: classData[];
};
export default function Page() {
  const router = useRouter();
  const [classCategories, setClassCategories] = useState<classCat>();
  const { profile, user } = useGetSession();
  const { all_class_data } = useGetAllClasses(profile?.user_id!);
  const today = classCategories?.today!;
  const upcoming = classCategories?.upcoming!;
  const ended = classCategories?.ended!;
  function categorizeClasses(classes: classData[]): {
    today: classData[];
    upcoming: classData[];
    ended: classData[];
  } {
    const now = startOfDay(new Date());

    return classes.reduce(
      (acc, classItem) => {
        const startDate = classItem.class_start
          ? parseISO(classItem.class_start)
          : null;
        const endDate = classItem.class_end
          ? parseISO(classItem.class_end)
          : null;

        if (startDate && isSameDay(startDate, now)) {
          acc.today.push(classItem);
        } else if (startDate && isFuture(startDate)) {
          acc.upcoming.push(classItem);
        } else if (endDate && isPast(endDate)) {
          acc.ended.push(classItem);
        }

        return acc;
      },
      { today: [], upcoming: [], ended: [] } as {
        today: classData[];
        upcoming: classData[];
        ended: classData[];
      }
    );
  }
  useEffect(() => {
    if (all_class_data) {
      const categorizedClasses = categorizeClasses(all_class_data);
      setClassCategories(categorizedClasses);
    }
  }, [all_class_data]);

  return (
    <main className='mt-24'>
      <div className='mx-auto max-w-2xl p-4 w-full flex flex-col'>
        <div className='flex flex-col w-full items-center justify-center'>
          <Link
            href={'/new-class'}
            className={cn(
              buttonVariants({}),
              'bg-gradient-to-r from-[#3A608A] to-[#232323]'
            )}
          >
            Create New Class
          </Link>
        </div>
        <div className='flex flex-col my-10 border-t w-full border-neutral-200'>
          {!all_class_data ? (
            <p className='py-10'>No Classes ...Create New Class</p>
          ) : (
            <div className='flex flex-col space-y-6 my-6  '>
              <div className='flex flex-col w-full divide-y divide-neutral-200'>
                <p className='text-xl font-medium py-2'>Today Classes</p>
                <div>
                  {!today ? (
                    <p>No Classes Today</p>
                  ) : (
                    <div className='divide-y divide-neutral-200 flex flex-col *:py-2'>
                      {today.length == 0 && <p>No Classes Today</p>}
                      {today.map((c) => (
                        <ClassComp c={c} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className='flex flex-col w-full divide-y divide-neutral-200'>
                <p className='text-xl font-medium py-2'>Upcoming Classes</p>
                <div>
                  {!upcoming ? (
                    <p>No Upcoming Classes</p>
                  ) : (
                    <div className='divide-y divide-neutral-200 flex flex-col *:py-2'>
                      {upcoming.length == 0 && <p>No Upcoming Classes</p>}
                      {upcoming.map((c) => (
                        <ClassComp c={c} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className='flex flex-col w-full divide-y divide-neutral-200'>
                <p className='text-xl font-medium py-2'>Ended Classes</p>
                <div>
                  {!ended ? (
                    <div>No Classes Today</div>
                  ) : (
                    <div className='divide-y divide-neutral-200 flex flex-col *:py-2'>
                      {upcoming.length == 0 && <p>No Ended Classes</p>}
                      {ended.map((c) => (
                        <ClassComp c={c} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function ClassComp({ c }: { c: classData }) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-col'>
        <p>{c.class_name}</p>
        <p className='text-sm'>
          {c.teacher_name} <br /> {format(parseISO(c.created_at!), 'PPP p')}
        </p>
      </div>
      <div className='flex items-center space-x-2'>
        <Link
          href={`/edit-class/${c.class_id}`}
          className={cn(buttonVariants({}))}
        >
          Edit Class
        </Link>
        <Link href={`/class/${c.class_id}`} className={cn(buttonVariants({}))}>
          View Class
        </Link>
      </div>
    </div>
  );
}
