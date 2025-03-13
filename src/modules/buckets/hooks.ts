import { queryClient } from "@/main";
import { supabase } from "@/supabase";
import {
  BucketInsert,
  BucketTransactionInsert,
  BucketUpdate,
} from "@/supabase/types";
import { useMutation } from "@tanstack/react-query";

export function useCreateBucketMutation() {
  return useMutation({
    mutationFn: async (payload: BucketInsert) => {
      const { error, data } = await supabase.from("buckets").insert([payload]);

      if (error) throw new Error(error.message);

      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["buckets"] });
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["buckets"] });
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
        .eq("id", payload.id);

      if (error) throw new Error(error.message);

      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["buckets"] });
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

      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["buckets"],
      });
      queryClient.invalidateQueries({
        queryKey: ["transactions", { type: "bucket" }],
      });
    },
  });
}
