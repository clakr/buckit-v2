import { queryClient } from "@/main";
import { supabase } from "@/supabase";
import { Bucket } from "@/supabase/types";
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
        .eq("id", bucketId)
        .single();

      if (error) throw new Error(error.message);

      return data;
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

export function bucketTransactionsQueryOptions(bucketId: Bucket["id"]) {
  return queryOptions({
    queryKey: ["buckets", bucketId, "transactions"],
    queryFn: async () => {
      const { error, data } = await supabase
        .from("bucket_transactions")
        .select()
        .eq("bucket_id", bucketId)
        .order("created_at", {
          ascending: false,
        });

      if (error) throw new Error(error.message);

      return data;
    },
  });
}
