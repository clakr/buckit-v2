import {
  fetchBucket,
  fetchBuckets,
  fetchBucketTransactions,
} from "@/lib/actions";
import { Transaction } from "@/lib/types";
import { queryClient } from "@/main";
import { Bucket, BucketTransaction } from "@/supabase/types";
import { queryOptions } from "@tanstack/react-query";

export const bucketsQueryOptions = queryOptions({
  queryKey: ["buckets"],
  queryFn: fetchBuckets,
});

export function bucketQueryOptions(bucketId: Bucket["id"]) {
  return queryOptions({
    queryKey: ["buckets", bucketId],
    queryFn: () => fetchBucket(bucketId),
    initialData: () => {
      const buckets = queryClient.getQueryData<Bucket[]>(["buckets"]);
      if (!buckets) return undefined;

      return buckets.find((bucket) => bucketId === bucket.id);
    },
  });
}

export function bucketTransactionsQueryOptions(bucketId: Bucket["id"]) {
  return queryOptions({
    queryKey: ["buckets", bucketId, "transactions"],
    queryFn: () => fetchBucketTransactions(bucketId),
    initialData: () => {
      const transactions = queryClient.getQueryData<Transaction[]>([
        "transactions",
      ]);
      if (!transactions) return undefined;

      return transactions.reduce<BucketTransaction[]>((prev, transaction) => {
        if ("bucket_id" in transaction && transaction.bucket_id === bucketId) {
          delete transaction.buckets;

          prev.push(transaction);
        }

        return prev;
      }, []);
    },
  });
}
