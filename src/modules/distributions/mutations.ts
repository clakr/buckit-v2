import { Transaction } from "@/lib/types";
import { supabase } from "@/supabase";
import {
  Bucket,
  BucketTransaction,
  BucketTransactionInsert,
  Distribution,
  DistributionInsert,
  DistributionTargetInsert,
  Goal,
  GoalTransaction,
  GoalTransactionInsert,
} from "@/supabase/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateDistributionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: DistributionInsert & {
        distribution_targets: DistributionTargetInsert[];
      },
    ) => {
      const { distribution_targets: distributions, ...distributionPayload } =
        payload;

      const { error, data } = await supabase
        .from("distributions")
        .insert(distributionPayload)
        .select()
        .single();

      if (error) throw new Error(error.message);

      const distributionTargetsPayload = distributions.map((distribution) => ({
        ...distribution,
        distribution_id: data.id,
      }));

      await supabase
        .from("distribution_targets")
        .insert(distributionTargetsPayload)
        .select();

      return data;
    },
    onSettled: (payload) => {
      if (!payload) return undefined;

      queryClient.setQueryData<Distribution[]>(["distributions"], (prev) => {
        if (!prev) return undefined;

        return [...prev, payload];
      });
    },
  });
}

async function insertBucketTransactions(payload: BucketTransactionInsert[]) {
  const { error, data } = await supabase
    .from("bucket_transactions")
    .insert(payload)
    .select(`*, buckets!inner(*)`);

  if (error) throw new Error(error.message);

  return data;
}

async function insertGoalTransactions(payload: GoalTransactionInsert[]) {
  const { error, data } = await supabase
    .from("goal_transactions")
    .insert(payload)
    .select(`*, goals!inner(*)`);

  if (error) throw new Error(error.message);

  return data;
}

export function useDistributeFundsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      buckets: BucketTransactionInsert[];
      goals: GoalTransactionInsert[];
    }) => {
      const promises = await Promise.allSettled([
        insertBucketTransactions(payload.buckets),
        insertGoalTransactions(payload.goals),
      ]);

      return promises
        .filter((promise) => promise.status === "fulfilled")
        .flatMap<
          | Awaited<ReturnType<typeof insertBucketTransactions>>[number]
          | Awaited<ReturnType<typeof insertGoalTransactions>>[number]
        >((promise) => promise.value);
    },
    onSettled: (payload) => {
      if (!payload) return undefined;

      payload.forEach((transaction) => {
        if ("buckets" in transaction) {
          queryClient.setQueryData<BucketTransaction[]>(
            ["buckets", transaction.bucket_id, "transactions"],
            (prev) => {
              if (!prev) return undefined;

              return [...prev, transaction];
            },
          );

          queryClient.setQueryData<Bucket[]>(["buckets"], (prev) => {
            if (!prev) return undefined;

            const updatedBucketIndex = prev.findIndex(
              (bucket) => transaction.bucket_id === bucket.id,
            );

            return transaction.current_balance
              ? prev.with(updatedBucketIndex, {
                  ...prev[updatedBucketIndex],
                  current_amount: transaction.current_balance,
                })
              : prev;
          });
        } else {
          // goal

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
        }
      });

      queryClient.setQueryData<Transaction[]>(["transactions"], (prev) => {
        if (!prev) return undefined;

        return [...prev, ...payload];
      });
    },
  });
}
