import { fetchTransactions } from "@/modules/dashboard/query-options";
import { supabase } from "@/supabase";
import {
  Bucket,
  BucketInsert,
  Goal,
  GoalInsert,
  GoalTransaction,
  GoalTransactionInsert,
  GoalUpdate,
} from "@/supabase/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateGoalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: GoalInsert) => {
      const { error, data } = await supabase
        .from("goals")
        .insert([payload])
        .select()
        .single();

      if (error) throw new Error(error.message);

      return data;
    },
    onSettled: (payload) => {
      if (!payload) return undefined;

      queryClient.setQueryData<Goal[]>(["goals"], (prev) => {
        if (!prev) return undefined;

        return [...prev, payload];
      });
    },
  });
}

export function useArchiveGoalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { id: NonNullable<GoalUpdate["id"]> }) => {
      const { error, data } = await supabase
        .from("goals")
        .update({
          is_active: false,
        })
        .eq("id", payload.id)
        .select()
        .single();

      if (error) throw new Error(error.message);

      return data;
    },
    onSettled: (_, __, variable) => {
      queryClient.setQueryData<Goal[]>(["goals"], (prev) => {
        if (!prev) return undefined;

        return prev.filter((goal) => goal.id !== variable.id);
      });
    },
  });
}

export function useUpdateGoalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: GoalInsert & { id: NonNullable<GoalInsert["id"]> },
    ) => {
      const { error, data } = await supabase
        .from("goals")
        .update(payload)
        .eq("id", payload.id)
        .select()
        .single();

      if (error) throw new Error(error.message);

      return data;
    },
    onSettled: (payload) => {
      if (!payload) return undefined;

      queryClient.setQueryData<Goal[]>(["goals"], (prev) => {
        if (!prev) return undefined;

        const updatedGoalIndex = prev.findIndex(
          (goal) => payload.id === goal.id,
        );

        return prev.with(updatedGoalIndex, payload);
      });

      queryClient.setQueryData<Goal>(["goals", payload.id], (prev) => {
        if (!prev) return undefined;

        return payload;
      });
    },
  });
}

export function useCreateGoalTransactionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: GoalTransactionInsert) => {
      const { error, data } = await supabase
        .from("goal_transactions")
        .insert(payload)
        .select(`*, goals!inner(*)`)
        .single();

      if (error) throw new Error(error.message);

      return data;
    },
    onSettled: (payload) => {
      if (!payload) return undefined;

      queryClient.setQueryData<GoalTransaction[]>(
        ["goals", payload.goal_id, "transactions"],
        (prev) => {
          if (!prev) return undefined;

          return [...prev, payload];
        },
      );

      queryClient.setQueryData<Goal[]>(["goals"], (prev) => {
        if (!prev) return undefined;

        const updatedGoalIndex = prev.findIndex(
          (goal) => payload.goal_id === goal.id,
        );

        return payload.current_balance
          ? prev.with(updatedGoalIndex, {
              ...prev[updatedGoalIndex],
              current_amount: payload.current_balance,
            })
          : prev;
      });

      queryClient.setQueryData<Awaited<ReturnType<typeof fetchTransactions>>>(
        ["transactions"],
        (prev) => {
          if (!prev) return undefined;

          return [...prev, payload];
        },
      );
    },
  });
}

export function useConvertToBucketMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      goal_id,
      ...bucketPayload
    }: BucketInsert & { goal_id: Goal["id"] }) => {
      const { error: goalError } = await supabase
        .from("goals")
        .update({
          is_active: false,
        })
        .eq("id", goal_id);

      if (goalError) throw new Error(goalError.message);

      const { error: bucketError, data } = await supabase
        .from("buckets")
        .insert([bucketPayload])
        .select()
        .single();

      if (bucketError) throw new Error(bucketError.message);

      return data;
    },
    onSettled: async (payload, _, variable) => {
      if (!payload) return undefined;

      queryClient.setQueryData<Goal[]>(["goals"], (prev) => {
        if (!prev) return undefined;

        return prev.filter((goal) => variable.goal_id !== goal.id);
      });

      queryClient.setQueryData<Bucket[]>(["buckets"], (prev) => {
        if (!prev) return undefined;

        return [...prev, payload];
      });
    },
  });
}
