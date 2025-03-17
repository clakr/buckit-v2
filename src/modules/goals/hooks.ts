import { queryClient } from "@/main";
import { supabase } from "@/supabase";
import {
  BucketInsert,
  Goal,
  GoalInsert,
  GoalTransactionInsert,
  GoalUpdate,
} from "@/supabase/types";
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

export function useCreateGoalTransactionMutation() {
  return useMutation({
    mutationFn: async (payload: GoalTransactionInsert) => {
      const { error: updateCurrentAmountError, data: updateCurrentAmountData } =
        await supabase.rpc("update_goal_current_amount", {
          goal_id: payload.goal_id,
          amount: payload.amount,
          transaction_type: payload.type,
        });

      if (updateCurrentAmountError)
        throw new Error(updateCurrentAmountError.message);

      const { data, error } = await supabase
        .from("goal_transactions")
        .insert({
          ...payload,
          current_balance: updateCurrentAmountData,
        })
        .select();

      if (error) throw new Error(error.message);

      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["goals"],
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

      const { error: bucketError } = await supabase
        .from("buckets")
        .insert([bucketPayload]);

      if (bucketError) throw new Error(bucketError.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["goals"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["buckets"],
      });
    },
  });
}
