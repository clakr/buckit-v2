import { queryClient } from "@/main";
import { supabase } from "@/supabase";
import { Bucket, BucketTransaction } from "@/supabase/types";
import { queryOptions } from "@tanstack/react-query";

export const bucketsQueryOptions = queryOptions({
  queryKey: ["buckets"],
  queryFn: async () => {
    const { error, data } = await supabase
      .from("buckets")
      .select()
      .eq("is_active", true);

    if (error) throw new Error(error.message);

    return data;
  },
});

export function bucketQueryOptions(bucketId: Bucket["id"]) {
  return queryOptions({
    queryKey: ["buckets", bucketId],
    queryFn: async () => {
      const { error, data } = await supabase
        .from("buckets")
        .select()
        .eq("id", bucketId);

      if (error) throw new Error(error.message);

      return data.at(0);
    },
    initialData: () => {
      const bucketsQueryData = queryClient.getQueryData([
        "buckets",
      ]) as Bucket[];
      if (!bucketsQueryData) return undefined;

      return bucketsQueryData.find((bucket) => bucketId === bucket.id);
    },
  });
}

export const bucketsTransactionsQueryOptions = queryOptions({
  queryKey: ["transactions", { type: "bucket" }],
  queryFn: async () => {
    const { error, data } = await supabase.from("bucket_transactions").select();

    if (error) throw new Error(error.message);

    return data;
  },
});

export function bucketTransactionsQueryOptions(bucketId: Bucket["id"]) {
  return queryOptions({
    queryKey: ["transactions", { type: "bucket" }, bucketId],
    queryFn: async () => {
      const { error, data } = await supabase
        .from("bucket_transactions")
        .select("*")
        .eq("bucket_id", bucketId)
        .order("created_at", {
          ascending: false,
        });

      if (error) throw new Error(error.message);

      return data;
    },
    initialData: () => {
      const bucketsTransactionsQueryData = queryClient.getQueryData([
        "bucket-transactions",
      ]) as BucketTransaction[];
      if (!bucketsTransactionsQueryData) return undefined;

      return bucketsTransactionsQueryData.filter(
        (transaction) => bucketId === transaction.bucket_id,
      );
    },
  });
}
