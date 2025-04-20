import { supabase } from "@/supabase";
import { queryOptions } from "@tanstack/react-query";

// extracted functions so I can infer the return types
async function fetchBucketTransactions() {
  const { error, data } = await supabase
    .from("bucket_transactions")
    .select(`*, buckets!inner(*)`)
    .eq("buckets.is_active", true);

  if (error) throw new Error(error.message);

  return data;
}

async function fetchGoalTransactions() {
  const { error, data } = await supabase
    .from("goal_transactions")
    .select(`*, goals!inner(*)`)
    .eq("goals.is_active", true);

  if (error) throw new Error(error.message);

  return data;
}

export async function fetchTransactions() {
  const promises = await Promise.allSettled([
    fetchBucketTransactions(),
    fetchGoalTransactions(),
  ]);

  return promises
    .filter((promise) => promise.status === "fulfilled")
    .flatMap<
      | Awaited<ReturnType<typeof fetchBucketTransactions>>[number]
      | Awaited<ReturnType<typeof fetchGoalTransactions>>[number]
    >((promise) => promise.value);
}

export const transactionsQueryOptions = queryOptions({
  queryKey: ["transactions"],
  queryFn: fetchTransactions,
});
