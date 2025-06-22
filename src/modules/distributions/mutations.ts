import {
  archiveDistribution,
  createBucketTransactions,
  createDistribution,
  createDistributionTargets,
  createGoalTransactions,
  deleteDistributionTargets,
  updateDistribution,
} from "@/lib/actions";
import {
  archiveDistributionSchema,
  createDistributionSchema,
  distributeFundsSchema,
  updateDistributionSchema,
} from "@/lib/schemas";
import { Transaction } from "@/lib/types";
import {
  Bucket,
  BucketTransaction,
  Distribution,
  Goal,
  GoalTransaction,
} from "@/supabase/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

export function useCreateDistributionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: z.output<typeof createDistributionSchema>) => {
      try {
        const {
          distribution_targets: distributionTargetsPayload,
          ...distributionPayload
        } = payload;

        const data = await createDistribution(distributionPayload);

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

export function useUpdateDistributionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: z.output<typeof updateDistributionSchema>) => {
      try {
        const {
          distribution_targets: distributionTargetsPayload,
          ...distributionPayload
        } = payload;

        const distributionData = await updateDistribution(distributionPayload);

        await deleteDistributionTargets(distributionData.id);
        const distributionTargetsData = await createDistributionTargets(
          distributionTargetsPayload,
        );

        return {
          ...distributionData,
          distribution_targets: distributionTargetsData,
        };
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);

        throw new Error("An unknown error occurred");
      }
    },
    onSettled: (payload) => {
      if (!payload) return undefined;

      queryClient.setQueryData<Distribution[]>(["distributions"], (prev) => {
        if (!prev) return undefined;

        const updatedDistributionIndex = prev.findIndex(
          (distribution) => payload.id === distribution.id,
        );

        return prev.with(updatedDistributionIndex, payload);
      });

      queryClient.setQueryData<Distribution>(
        ["distributions", payload.id],
        (prev) => {
          if (!prev) return undefined;

          return payload;
        },
      );
    },
  });
}

export function useDistributeFundsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: z.output<typeof distributeFundsSchema>) => {
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

export function useArchiveDistributionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: z.output<typeof archiveDistributionSchema>) => {
      const data = await archiveDistribution(payload);

      return data;
    },
    onSettled: (payload, _, variable) => {
      if (!payload) return undefined;

      queryClient.setQueryData<Distribution[]>(["distributions"], (prev) => {
        if (!prev) return undefined;

        return prev.filter((distribution) => variable.id !== distribution.id);
      });
    },
  });
}
