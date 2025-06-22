import {
  archiveBucket,
  createBucket,
  createBucketTransactions,
  createGoal,
  updateBucket,
} from "@/lib/actions";
import {
  createBucketSchema,
  updateBucketSchema,
  archiveBucketSchema,
  createBucketTransactionSchema,
} from "@/lib/schemas";
import { Transaction } from "@/lib/types";
import { Bucket, BucketTransaction, Goal, GoalInsert } from "@/supabase/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

export function useCreateBucketMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: z.output<typeof createBucketSchema>) =>
      await createBucket(payload),
    onSettled: (payload) => {
      if (!payload) return undefined;

      queryClient.setQueryData<Bucket[]>(["buckets"], (prev) => {
        if (!prev) return undefined;

        return [...prev, payload];
      });
    },
  });
}

export function useUpdateBucketMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: z.output<typeof updateBucketSchema>) =>
      await updateBucket(payload),
    onSettled: (payload) => {
      if (!payload) return undefined;

      queryClient.setQueryData<Bucket[]>(["buckets"], (prev) => {
        if (!prev) return undefined;

        const updatedBucketIndex = prev.findIndex(
          (bucket) => payload.id === bucket.id,
        );

        return prev.with(updatedBucketIndex, payload);
      });

      queryClient.setQueryData<Bucket>(["buckets", payload.id], (prev) => {
        if (!prev) return undefined;

        return payload;
      });
    },
  });
}

export function useArchiveBucketMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: z.output<typeof archiveBucketSchema>) =>
      await archiveBucket(payload),
    onSettled: (payload, _, variable) => {
      if (!payload) return undefined;

      queryClient.setQueryData<Bucket[]>(["buckets"], (prev) => {
        if (!prev) return undefined;

        return prev.filter((bucket) => variable.id !== bucket.id);
      });
    },
  });
}

export function useCreateBucketTransactionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: z.output<typeof createBucketTransactionSchema>,
    ) => await createBucketTransactions(payload),
    onSettled: (payload) => {
      if (!payload) return undefined;

      const transaction = payload.at(0);
      if (!transaction) return undefined;

      queryClient.setQueryData<BucketTransaction[]>(
        ["buckets", transaction.id, "transactions"],
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

      queryClient.setQueryData<Transaction[]>(["transactions"], (prev) => {
        if (!prev) return undefined;

        return [...prev, payload];
      });
    },
  });
}

export function useConvertToGoalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bucket_id,
      ...goalPayload
    }: GoalInsert & { bucket_id: Bucket["id"] }) => {
      try {
        const promises = await Promise.allSettled([
          archiveBucket({ id: bucket_id }),
          createGoal(goalPayload),
        ]);

        promises.forEach((promise) => {
          if (promise.status === "rejected") throw new Error(promise.reason);
        });

        const [, goalPromise] = promises;

        return goalPromise.status === "fulfilled"
          ? goalPromise.value
          : undefined;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);

        throw new Error("An unknown error occurred");
      }
    },
    onSettled: async (payload, _, variable) => {
      if (!payload) return undefined;

      queryClient.setQueryData<Bucket[]>(["buckets"], (prev) => {
        if (!prev) return undefined;

        return prev.filter((bucket) => variable.bucket_id !== bucket.id);
      });

      queryClient.setQueryData<Goal[]>(["goals"], (prev) => {
        if (!prev) return undefined;

        return [...prev, payload];
      });
    },
  });
}
