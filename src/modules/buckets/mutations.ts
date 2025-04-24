import {
  archiveBucket,
  createBucket,
  createBucketTransactions,
  createGoal,
  updateBucket,
} from "@/lib/actions";
import { Transaction } from "@/lib/types";
import { Bucket, BucketTransaction, Goal, GoalInsert } from "@/supabase/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateBucketMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBucket,
    onSettled: (payload) => {
      if (!payload) return undefined;

      queryClient.setQueryData<Bucket[]>(["buckets"], (prev) => {
        if (!prev) return undefined;

        return [...prev, payload];
      });
    },
  });
}

export function useArchiveBucketMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveBucket,
    onSettled: (_, __, bucketId) => {
      queryClient.setQueryData<Bucket[]>(["buckets"], (prev) => {
        if (!prev) return undefined;

        return prev.filter((bucket) => bucketId !== bucket.id);
      });
    },
  });
}

export function useUpdateBucketMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBucket,
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

export function useCreateBucketTransactionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBucketTransactions,
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
        const [, goalPromise] = await Promise.allSettled([
          archiveBucket(bucket_id),
          createGoal(goalPayload),
        ]);

        if (goalPromise.status === "rejected") {
          throw new Error(goalPromise.reason);
        }

        return goalPromise.value;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }

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
