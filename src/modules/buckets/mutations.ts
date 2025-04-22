import { fetchTransactions } from "@/modules/dashboard/query-options";
import { supabase } from "@/supabase";
import {
  Bucket,
  BucketInsert,
  BucketTransaction,
  BucketTransactionInsert,
  BucketUpdate,
  Goal,
  GoalInsert,
} from "@/supabase/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateBucketMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: BucketInsert) => {
      const { error, data } = await supabase
        .from("buckets")
        .insert([payload])
        .select()
        .single();

      if (error) throw new Error(error.message);

      return data;
    },
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
    mutationFn: async (payload: { id: NonNullable<BucketUpdate["id"]> }) => {
      const { error, data } = await supabase
        .from("buckets")
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
      queryClient.setQueryData<Bucket[]>(["buckets"], (prev) => {
        if (!prev) return undefined;

        return prev.filter((bucket) => bucket.id !== variable.id);
      });
    },
  });
}

export function useUpdateBucketMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: BucketInsert & { id: NonNullable<BucketInsert["id"]> },
    ) => {
      const { error, data } = await supabase
        .from("buckets")
        .update(payload)
        .eq("id", payload.id)
        .select()
        .single();

      if (error) throw new Error(error.message);

      return data;
    },
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
    mutationFn: async (payload: BucketTransactionInsert) => {
      const { error, data } = await supabase
        .from("bucket_transactions")
        .insert(payload)
        .select(`*, buckets!inner(*)`)
        .single();

      if (error) throw new Error(error.message);

      return data;
    },
    onSettled: (payload) => {
      if (!payload) return undefined;

      queryClient.setQueryData<BucketTransaction[]>(
        ["buckets", payload.bucket_id, "transactions"],
        (prev) => {
          if (!prev) return undefined;

          return [...prev, payload];
        },
      );

      queryClient.setQueryData<Bucket[]>(["buckets"], (prev) => {
        if (!prev) return undefined;

        const updatedBucketIndex = prev.findIndex(
          (bucket) => payload.bucket_id === bucket.id,
        );

        return payload.current_balance
          ? prev.with(updatedBucketIndex, {
              ...prev[updatedBucketIndex],
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

export function useConvertToGoalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bucket_id,
      ...goalPayload
    }: GoalInsert & { bucket_id: Bucket["id"] }) => {
      const { error: bucketError } = await supabase
        .from("buckets")
        .update({
          is_active: false,
        })
        .eq("id", bucket_id);

      if (bucketError) throw new Error(bucketError.message);

      const { error: goalError, data } = await supabase
        .from("goals")
        .insert([goalPayload])
        .select()
        .single();

      if (goalError) throw new Error(goalError.message);

      return data;
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
