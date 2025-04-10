import { queryClient } from "@/main";
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
import { useMutation } from "@tanstack/react-query";

export function useCreateGoalMutation() {
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
    },
  });
}

export function useCreateGoalTransactionMutation() {
  return useMutation({
    mutationFn: async (payload: GoalTransactionInsert) => {
      const { error: updateCurrentAmountError, data: updatedCurrentAmount } =
        await supabase.rpc("update_goal_current_amount", {
          goal_id: payload.goal_id,
          amount: payload.amount,
          transaction_type: payload.type,
        });

      if (updateCurrentAmountError)
        throw new Error(updateCurrentAmountError.message);

      const { error, data: transaction } = await supabase
        .from("goal_transactions")
        .insert({
          ...payload,
          current_balance: updatedCurrentAmount,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);

      return {
        updatedCurrentAmount,
        transaction,
      };
    },
    onSettled: (payload) => {
      if (!payload) return undefined;

      queryClient.setQueryData<GoalTransaction[]>(
        ["goals", payload.transaction.goal_id, "transactions"],
        (prev) => {
          if (!prev) return undefined;

          return [...prev, payload.transaction];
        },
      );

      queryClient.setQueryData<Goal[]>(["goals"], (prev) => {
        if (!prev) return undefined;

        const updatedGoalIndex = prev.findIndex(
          (goal) => payload.transaction.goal_id === goal.id,
        );

        return prev.with(updatedGoalIndex, {
          ...prev[updatedGoalIndex],
          current_amount: payload.updatedCurrentAmount,
        });
      });
    },
  });
}

export function useConvertToBucketMutation() {
  return useMutation({
    mutationFn: async ({
      goalId,
      ...bucketPayload
    }: BucketInsert & { goalId: Goal["id"] }) => {
      const { error: goalError } = await supabase
        .from("goals")
        .update({
          is_active: false,
        })
        .eq("id", goalId);

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

        return prev.filter((goal) => variable.goalId !== goal.id);
      });

      queryClient.setQueryData<Bucket[]>(["buckets"], (prev) => {
        if (!prev) return undefined;

        return [...prev, payload];
      });
    },
  });
}
