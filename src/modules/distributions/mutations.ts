import {
  createBucketTransactions,
  createDistribution,
  createDistributionTargets,
  createGoalTransactions,
} from "@/lib/actions";
import { Transaction } from "@/lib/types";
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
      try {
        const { distribution_targets, ...distributionPayload } = payload;

        const data = await createDistribution(distributionPayload);

        const distributionTargetsPayload = distribution_targets.map(
          (distribution) => ({
            ...distribution,
            distribution_id: data.id,
          }),
        );

        await createDistributionTargets(distributionTargetsPayload);

        return data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);

        throw new Error("An unknown error occurred");
      }
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

export function useDistributeFundsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      buckets: BucketTransactionInsert[];
      goals: GoalTransactionInsert[];
    }) => {
      try {
        const promises = await Promise.allSettled([
          createBucketTransactions(payload.buckets),
          createGoalTransactions(payload.goals),
        ]);

        promises.forEach((promise) => {
          if (promise.status === "rejected") throw new Error(promise.reason);
        });

        return promises
          .filter((promise) => promise.status === "fulfilled")
          .flatMap<
            | Awaited<ReturnType<typeof createBucketTransactions>>[number]
            | Awaited<ReturnType<typeof createGoalTransactions>>[number]
          >((promise) => promise.value);
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);

        throw new Error("An unknown error occurred");
      }
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
