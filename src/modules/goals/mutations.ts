import {
  archiveGoal,
  createBucket,
  createGoal,
  createGoalTransactions,
  updateGoal,
} from "@/lib/actions";
import {
  createGoalSchema,
  updateGoalSchema,
  archiveGoalSchema,
  createGoalTransactionSchema,
} from "@/lib/schemas";
import { Transaction } from "@/lib/types";
import { Bucket, BucketInsert, Goal, GoalTransaction } from "@/supabase/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

export function useCreateGoalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: z.output<typeof createGoalSchema>) =>
      await createGoal(payload),
    onSettled: (payload) => {
      if (!payload) return undefined;

      queryClient.setQueryData<Goal[]>(["goals"], (prev) => {
        if (!prev) return undefined;

        return [...prev, payload];
      });
    },
  });
}

export function useUpdateGoalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: z.output<typeof updateGoalSchema>) =>
      await updateGoal(payload),
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

export function useArchiveGoalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: z.output<typeof archiveGoalSchema>) =>
      await archiveGoal(payload),
    onSettled: (payload, __, variable) => {
      if (!payload) return undefined;

      queryClient.setQueryData<Goal[]>(["goals"], (prev) => {
        if (!prev) return undefined;

        return prev.filter((goal) => goal.id !== variable.id);
      });
    },
  });
}

export function useCreateGoalTransactionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: z.output<typeof createGoalTransactionSchema>) =>
      await createGoalTransactions(payload),
    onSettled: (payload) => {
      if (!payload) return undefined;

      const transaction = payload.at(0);
      if (!transaction) return undefined;

      queryClient.setQueryData<GoalTransaction[]>(
        ["goals", transaction.goal_id, "transactions"],
        (prev) => {
          if (!prev) return undefined;

          return [...prev, transaction];
        },
      );

      queryClient.setQueryData<Goal[]>(["goals"], (prev) => {
        if (!prev) return undefined;

        const updatedGoalIndex = prev.findIndex(
          (goal) => transaction.goal_id === goal.id,
        );

        return transaction.current_balance
          ? prev.with(updatedGoalIndex, {
              ...prev[updatedGoalIndex],
              current_amount: transaction.current_balance,
            })
          : prev;
      });

      queryClient.setQueryData<Transaction[]>(["transactions"], (prev) => {
        if (!prev) return undefined;

        return [...prev, transaction];
      });
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
      try {
        const promises = await Promise.allSettled([
          archiveGoal({ id: goal_id }),
          createBucket(bucketPayload),
        ]);

        promises.forEach((promise) => {
          if (promise.status === "rejected") throw new Error(promise.reason);
        });

        const [, bucketPromise] = promises;

        return bucketPromise.status === "fulfilled"
          ? bucketPromise.value
          : undefined;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);

        throw new Error("An unknown error occurred");
      }
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
