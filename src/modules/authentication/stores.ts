import { loginSchema, registerSchema } from "@/lib/schemas";
import { supabase } from "@/supabase";
import { User } from "@supabase/supabase-js";
import { z } from "zod";
import { createStore } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  user: User | null;
  login: (value: z.input<typeof loginSchema>) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser(): Promise<void>;
  register: (value: z.input<typeof registerSchema>) => Promise<void>;

  reset: () => void;
};

export const useAuthStore = createStore<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      login: async (value) => {
        try {
          const { error } = await supabase.auth.signInWithPassword(value);

          if (error) throw new Error(error.message);

          await get().fetchUser();
        } catch (error) {
          console.error(error);

          get().reset();
        }
      },
      logout: async () => {
        try {
          const { error } = await supabase.auth.signOut();

          if (error) throw new Error(error.message);

          get().reset();
        } catch (error) {
          console.error(error);

          set((state) => ({
            user: state.user,
          }));
        }
      },
      fetchUser: async () => {
        try {
          const { error, data } = await supabase.auth.getUser();

          if (error) throw new Error(error.message);

          set({ user: data.user });
        } catch (error) {
          console.error(error);

          get().reset();
        }
      },
      register: async (value) => {
        try {
          const { error } = await supabase.auth.signUp(value);

          if (error) throw new Error(error.message);

          await get().fetchUser();
        } catch (error) {
          console.error(error);

          get().reset();
        }
      },

      reset: () => {
        set({ user: null });
      },
    }),
    {
      name: "auth",
    },
  ),
);
