import { Database } from "@/types/supabase";
import { User } from "@supabase/supabase-js";
import { create } from "zustand";

type user = User | null;
export type profile =
  | Database["public"]["Tables"]["user_profiles"]["Row"]
  | null;

type State = {
  user: user;
  profile: profile;
};

type Action = {
  updateUser: (user: State["user"]) => void;
  removeUser: (user: State["user"]) => void;
  updateProfile: (profile: State["profile"]) => void;
  removeProfile: (profile: State["profile"]) => void;
};

// Create your store, which includes both state and (optionally) actions
export const useUserStore = create<State & Action>((set) => ({
  user: null,
  profile: null,
  updateUser: (user) => set(() => ({ user: user })),
  removeUser: () => set(() => ({ user: null })),
  updateProfile: (profile) => set(() => ({ profile: profile })),
  removeProfile: () => set(() => ({ profile: null })),
}));
