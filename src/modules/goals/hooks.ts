import { queryClient } from "@/main";
import { supabase } from "@/supabase";
import { GoalInsert, GoalUpdate } from "@/supabase/types";
import { useMutation } from "@tanstack/react-query";

export function useCreateGoalMutation() {
  return useMutation({
    mutationFn: async (payload: GoalInsert) => {
      const { error, data } = await supabase.from("goals").insert([payload]);

      if (error) throw new Error(error.message);

      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}

export function useUpdateGoalMutation() {
  return useMutation({
    mutationFn: async (
      payload: GoalInsert & { id: NonNullable<GoalInsert["id"]> },
    ) => {
      const { error, data } = await supabase
        .from("goals")
        .update(payload)
        .eq("id", payload.id);

      if (error) throw new Error(error.message);

      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}

export function useArchiveGoalMutation() {
  return useMutation({
    mutationFn: async (payload: { id: NonNullable<GoalUpdate["id"]> }) => {
      const { error, data } = await supabase
        .from("goals")
        .update({
          is_active: false,
        })
        .eq("id", payload.id)
        .select();

      if (error) throw new Error(error.message);

      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}
