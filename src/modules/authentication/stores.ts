import { supabase } from "@/supabase";
import { AuthError, User } from "@supabase/supabase-js";
import { createStore } from "zustand";

type AuthStoreState = { user: User | null };

type AuthStoreActions = {
  fetchUser: () => Promise<
    | {
        error: AuthError;
      }
    | {
        error: null;
      }
  >;
  logout: () => Promise<
    | {
        error: AuthError;
      }
    | {
        error: null;
      }
  >;
};

type AuthStore = AuthStoreState & AuthStoreActions;

export const authStore = createStore<AuthStore>()((set) => ({
  user: null,
  fetchUser: async () => {
    console.log("fetching...");
    const { error, data } = await supabase.auth.getUser();

    if (error) {
      return {
        error,
      };
    }

    set({ user: data.user });
    return {
      error: null,
    };
  },
  logout: async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        error,
      };
    }

    set({ user: null });

    return {
      error: null,
    };
  },
}));
