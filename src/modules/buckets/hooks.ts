import { queryClient } from "@/main";
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
import { useMutation } from "@tanstack/react-query";

export function useCreateBucketMutation() {
  return useMutation({
    mutationFn: async (payload: BucketInsert) => {
      const { error, data } = await supabase
        .from("buckets")
        .insert([payload])
        .select();

      if (error) throw new Error(error.message);

      return data.at(0);
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
  return useMutation({
    mutationFn: async (payload: { id: NonNullable<BucketUpdate["id"]> }) => {
      const { error, data } = await supabase
        .from("buckets")
        .update({
          is_active: false,
        })
        .eq("id", payload.id)
        .select();

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
  return useMutation({
    mutationFn: async (
      payload: BucketInsert & { id: NonNullable<BucketInsert["id"]> },
    ) => {
      const { error, data } = await supabase
        .from("buckets")
        .update(payload)
        .eq("id", payload.id)
        .select();

      if (error) throw new Error(error.message);

      return data.at(0);
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
    },
  });
}

export function useCreateBucketTransactionMutation() {
  return useMutation({
    mutationFn: async (payload: BucketTransactionInsert) => {
      const { error: updateCurrentAmountError, data: updateCurrentAmountData } =
        await supabase.rpc("update_bucket_current_amount", {
          bucket_id: payload.bucket_id,
          amount: payload.amount,
          transaction_type: payload.type,
        });

      if (updateCurrentAmountError)
        throw new Error(updateCurrentAmountError.message);

      const { data, error } = await supabase
        .from("bucket_transactions")
        .insert({
          ...payload,
          current_balance: updateCurrentAmountData,
        })
        .select();

      if (error) throw new Error(error.message);

      return {
        updatedBucketCurrentAmount: updateCurrentAmountData,
        transaction: data[0],
      };
    },
    onSettled: (payload) => {
      if (!payload) return undefined;

      queryClient.setQueryData<BucketTransaction[]>(
        ["buckets", payload.transaction.bucket_id, "transactions"],
        (prev) => {
          if (!prev) return undefined;

          return [...prev, payload.transaction];
        },
      );

      queryClient.setQueryData<Bucket[]>(["buckets"], (prev) => {
        if (!prev) return undefined;

        const updatedBucketIndex = prev.findIndex(
          (bucket) => payload.transaction.bucket_id === bucket.id,
        );

        return prev.with(updatedBucketIndex, {
          ...prev[updatedBucketIndex],
          current_amount: payload.updatedBucketCurrentAmount,
        });
      });
    },
  });
}

export function useConvertToGoalMutation() {
  return useMutation({
    mutationFn: async ({
      bucketId,
      ...goalPayload
    }: GoalInsert & { bucketId: Bucket["id"] }) => {
      const { error: bucketError } = await supabase
        .from("buckets")
        .update({
          is_active: false,
        })
        .eq("id", bucketId);

      if (bucketError) throw new Error(bucketError.message);

      const { error: goalError, data } = await supabase
        .from("goals")
        .insert([goalPayload])
        .select();

      if (goalError) throw new Error(goalError.message);

      return data.at(0);
    },
    onSettled: async (payload, _, variable) => {
      if (!payload) return undefined;

      queryClient.setQueryData<Bucket[]>(["buckets"], (prev) => {
        if (!prev) return undefined;

        return prev.filter((bucket) => variable.bucketId !== bucket.id);
      });

      queryClient.setQueryData<Goal[]>(["goals"], (prev) => {
        if (!prev) return undefined;

        return [...prev, payload];
      });
    },
  });
}
