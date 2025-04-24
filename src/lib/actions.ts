import { supabase } from "@/supabase";
import {
  Bucket,
  BucketInsert,
  BucketTransactionInsert,
  BucketUpdate,
  Distribution,
  DistributionInsert,
  DistributionTargetInsert,
  Goal,
  GoalInsert,
  GoalTransactionInsert,
  GoalUpdate,
} from "@/supabase/types";

export async function fetchBuckets() {
  const { error, data } = await supabase
    .from("buckets")
    .select()
    .eq("is_active", true);

  if (error) throw new Error(error.message);

  return data;
}

export async function fetchBucket(bucketId: Bucket["id"]) {
  const { error, data } = await supabase
    .from("buckets")
    .select()
    .eq("id", bucketId)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function fetchBucketTransactions(bucketId: Bucket["id"]) {
  const { error, data } = await supabase
    .from("bucket_transactions")
    .select()
    .eq("bucket_id", bucketId)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw new Error(error.message);

  return data;
}

export async function fetchGoals() {
  const { error, data } = await supabase
    .from("goals")
    .select()
    .eq("is_active", true);

  if (error) throw new Error(error.message);

  return data;
}

export async function fetchGoal(goalId: Goal["id"]) {
  const { error, data } = await supabase
    .from("goals")
    .select()
    .eq("id", goalId)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function fetchGoalTransactions(goalId: Goal["id"]) {
  const { error, data } = await supabase
    .from("goal_transactions")
    .select()
    .eq("goal_id", goalId)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw new Error(error.message);

  return data;
}

export async function fetchBucketsTransactions() {
  const { error, data } = await supabase
    .from("bucket_transactions")
    .select(`*, buckets!inner(*)`)
    .eq("buckets.is_active", true);

  if (error) throw new Error(error.message);

  return data;
}

export async function fetchGoalsTransactions() {
  const { error, data } = await supabase
    .from("goal_transactions")
    .select(`*, goals!inner(*)`)
    .eq("goals.is_active", true);

  if (error) throw new Error(error.message);

  return data;
}

export async function fetchTransactions() {
  const promises = await Promise.allSettled([
    fetchBucketsTransactions(),
    fetchGoalsTransactions(),
  ]);

  return promises
    .filter((promise) => promise.status === "fulfilled")
    .flatMap<
      | Awaited<ReturnType<typeof fetchBucketsTransactions>>[number]
      | Awaited<ReturnType<typeof fetchGoalsTransactions>>[number]
    >((promise) => promise.value);
}

export async function fetchDistributions() {
  const { error, data } = await supabase
    .from("distributions")
    .select()
    .eq("is_active", true);

  if (error) throw new Error(error.message);

  return data;
}

export async function fetchDistribution(distributionId: Distribution["id"]) {
  const { error, data } = await supabase
    .from("distributions")
    .select(`*, distribution_targets(*)`)
    .eq("id", distributionId)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function fetchDistributionTargets(
  distributionId: Distribution["id"],
) {
  const { error, data } = await supabase
    .from("distribution_targets")
    .select()
    .eq("distribution_id", distributionId);

  if (error) throw new Error(error.message);

  return data;
}

export async function createBucket(payload: BucketInsert) {
  const { error, data } = await supabase
    .from("buckets")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function updateBucket(
  payload: BucketUpdate & { id: Bucket["id"] },
) {
  const { error, data } = await supabase
    .from("buckets")
    .update(payload)
    .eq("id", payload.id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function archiveBucket(bucketId: Bucket["id"]) {
  const { error, data } = await supabase
    .from("buckets")
    .update({ is_active: false })
    .eq("id", bucketId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function createGoal(payload: GoalInsert) {
  const { error, data } = await supabase
    .from("goals")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function updateGoal(payload: GoalUpdate & { id: Goal["id"] }) {
  const { error, data } = await supabase
    .from("goals")
    .update(payload)
    .eq("id", payload.id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function archiveGoal(goalId: Goal["id"]) {
  const { error, data } = await supabase
    .from("goals")
    .update({ is_active: false })
    .eq("id", goalId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function createDistribution(payload: DistributionInsert) {
  const { error, data } = await supabase
    .from("distributions")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function createDistributionTargets(
  payload: DistributionTargetInsert[],
) {
  const { error, data } = await supabase
    .from("distribution_targets")
    .insert(payload)
    .select();

  if (error) throw new Error(error.message);

  return data;
}

export async function createBucketTransactions(
  payload: BucketTransactionInsert[],
) {
  const { error, data } = await supabase
    .from("bucket_transactions")
    .insert(payload)
    .select(`*, buckets!inner(*)`);

  if (error) throw new Error(error.message);

  return data;
}

export async function createGoalTransactions(payload: GoalTransactionInsert[]) {
  const { error, data } = await supabase
    .from("goal_transactions")
    .insert(payload)
    .select(`*, goals!inner(*)`);

  if (error) throw new Error(error.message);

  return data;
}
