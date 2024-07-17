import { Database } from "@/types/supabase";
import { Session, User, WeakPassword } from "@supabase/supabase-js";

export type userProfile = Database["public"]["Tables"]["user_profiles"]["Row"];

export type userType = User;
export type LoginTypes = {
  email: string;
  password: string;
};

export type LoginDataTypes =
  | {
      user: User;
      session: Session;
      weakPassword?: WeakPassword | undefined;
    }
  | {
      user: null;
      session: null;
      weakPassword?: null | undefined;
    };
