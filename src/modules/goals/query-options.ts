import { queryClient } from "@/main";
import { supabase } from "@/supabase";
import { Goal } from "@/supabase/types";
import { queryOptions } from "@tanstack/react-query";

export const goalsQueryOptions = queryOptions({
  queryKey: ["goals"],
  queryFn: async () => {
    const { error, data } = await supabase
      .from("goals")
      .select()
      .eq("is_active", true);

    if (error) throw new Error(error.message);

    return data;
  },
});

export function goalQueryOptions(goalId: Goal["id"]) {
  return queryOptions({
    queryKey: ["goals", goalId],
    queryFn: async () => {
      const { error, data } = await supabase
        .from("goals")
        .select()
        .eq("id", goalId)
        .single();

      if (error) throw new Error(error.message);

      return data;
    },
    initialData: () => {
      const goalsQueryData = queryClient.getQueryData(["goals"]) as Goal[];
      if (!goalsQueryData) return undefined;

      return goalsQueryData.find((goal) => goalId === goal.id);
    },
  });
}

export function goalTransactionsQueryOptions(goalId: Goal["id"]) {
  return queryOptions({
    queryKey: ["goals", goalId, "transactions"],
    queryFn: async () => {
      const { error, data } = await supabase
        .from("goal_transactions")
        .select()
        .eq("goal_id", goalId)
        .order("created_at", {
          ascending: false,
        });

      if (error) throw new Error(error.message);

      return data;
    },
  });
}
