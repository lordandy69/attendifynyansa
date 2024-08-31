'use client';
import { useEffect, useState } from 'react';
import { useGetSession } from '@/lib/supabase/session';
import { supabaseClient } from '@/lib/supabase/client';
import { Database } from '@/types/supabase';
import EditClassForm from '@/components/forms/class/edit-class';

type props = {
  params: { class_id: string };
};

type classData = Database['public']['Tables']['classes']['Row'];

export default function Page({ params }: props) {
  const supabase = supabaseClient();
  const { user } = useGetSession();

  const [class_data, setClassData] = useState<classData | null>(null);

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
      .channel('get-class-updates')
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

  return (
    <main className='mt-24'>
      <div className='mx-auto max-w-2xl p-4 flex flex-col'>
        <section className=''>
          {!class_data ? (
            <p>No class Data</p>
          ) : (
            <div className='flex flex-col w-full items-center justify-center'>
              <EditClassForm cd={class_data!} />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
