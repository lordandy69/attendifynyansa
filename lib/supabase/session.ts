import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { useUserStore } from '../store/user';
import { Database } from '@/types/supabase';
import { supabaseClient } from './client';

type useDataProps = Database['public']['Tables']['user_profiles']['Row'];

export function useGetSession() {
  const supabase = supabaseClient();
  const [session, setSession] = useState<Session | null>(null);

  const {
    updateUser,
    updateProfile,
    removeProfile,
    profile,
    user,
    removeUser,
  } = useUserStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      updateUser(session?.user!);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setSession(null);
        removeUser(null);
      }
      setSession(session);
      updateUser(session?.user!);
    });
  }, []);

  useEffect(() => {
    if (!session?.user) {
      removeProfile(null);
      removeUser(null);
    } else {
      supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', session?.user!.id!)
        .single()
        .then(({ data }) => {
          updateProfile(data);
        });
    }
  }, [removeProfile, removeUser, session?.user, supabase, updateProfile]);
  // !session?.user.email ? console.log("Not Logged In") : console.log(profile);

  return { session, user, profile };
}
