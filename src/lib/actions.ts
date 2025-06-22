import {
  createBucketSchema,
  updateBucketSchema,
  archiveBucketSchema,
  createBucketTransactionSchema,
  createGoalSchema,
  updateGoalSchema,
  archiveGoalSchema,
  createGoalTransactionSchema,
  baseDistributionSchema,
  baseDistributionTargetSchema,
  archiveDistributionSchema,
} from "@/lib/schemas";
import { supabase } from "@/supabase";
import {
  Bucket,
  Distribution,
  ExpenseInsert,
  ExpenseItemDistributionInsert,
  ExpenseItemInsert,
  ExpenseParticipantInsert,
  ExpenseSettlementInsert,
  Goal,
} from "@/supabase/types";
import { z } from "zod";

export async function fetchBuckets() {
  const { error, data } = await supabase
    .from("buckets")
    .select()
    .eq("is_active", true);

  if (error) throw new Error(error.message);

  return data;
}

export async function createBucket(
  payload: z.output<typeof createBucketSchema>,
) {
  const { error, data } = await supabase
    .from("buckets")
    .insert(payload)
    .select()
    .single();

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

export async function updateBucket(
  payload: z.output<typeof updateBucketSchema>,
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

export async function archiveBucket(
  payload: z.output<typeof archiveBucketSchema>,
) {
  const { error, data } = await supabase
    .from("buckets")
    .update({ is_active: false })
    .eq("id", payload.id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function fetchBucketTransactions(bucketId: Bucket["id"]) {
  const { error, data } = await supabase
    .from("bucket_transactions")
    .select(`*, buckets!inner(*)`)
    .eq("bucket_id", bucketId)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw new Error(error.message);

  return data;
}

export async function createBucketTransactions(
  payload: z.output<typeof createBucketTransactionSchema>[],
) {
  const { error, data } = await supabase
    .from("bucket_transactions")
    .insert(payload)
    .select(`*, buckets!inner(*)`);

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

export async function createGoal(payload: z.output<typeof createGoalSchema>) {
  const { error, data } = await supabase
    .from("goals")
    .insert(payload)
    .select()
    .single();

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

export async function updateGoal(payload: z.output<typeof updateGoalSchema>) {
  const { error, data } = await supabase
    .from("goals")
    .update(payload)
    .eq("id", payload.id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function archiveGoal(payload: z.output<typeof archiveGoalSchema>) {
  const { error, data } = await supabase
    .from("goals")
    .update({ is_active: false })
    .eq("id", payload.id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function fetchGoalTransactions(goalId: Goal["id"]) {
  const { error, data } = await supabase
    .from("goal_transactions")
    .select(`*, goals!inner(*)`)
    .eq("goal_id", goalId)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw new Error(error.message);

  return data;
}

export async function createGoalTransactions(
  payload: z.output<typeof createGoalTransactionSchema>[],
) {
  const { error, data } = await supabase
    .from("goal_transactions")
    .insert(payload)
    .select(`*, goals!inner(*)`);

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

  const transactions: (
    | Awaited<ReturnType<typeof fetchBucketsTransactions>>[number]
    | Awaited<ReturnType<typeof fetchGoalsTransactions>>[number]
  )[] = [];

  for (const promise of promises) {
    if (promise.status === "fulfilled") {
      transactions.push(...promise.value);
    }
  }

  return transactions;
}

export async function fetchDistributions() {
  const { error, data } = await supabase
    .from("distributions")
    .select()
    .eq("is_active", true);

  if (error) throw new Error(error.message);

  return data;
}

export async function createDistribution(
  payload: z.output<typeof baseDistributionSchema>,
) {
  const { error, data } = await supabase
    .from("distributions")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function createDistributionTargets(
  payload: z.output<typeof baseDistributionTargetSchema>[],
) {
  const { error, data } = await supabase
    .from("distribution_targets")
    .insert(payload)
    .select();

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

export async function updateDistribution(
  payload: z.output<typeof baseDistributionSchema>,
) {
  const { error, data } = await supabase
    .from("distributions")
    .update(payload)
    .eq("id", payload.id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function deleteDistributionTargets(
  distributionId: Distribution["id"],
) {
  const { error, data } = await supabase
    .from("distribution_targets")
    .delete()
    .eq("distribution_id", distributionId)
    .select();

  if (error) throw new Error(error.message);

  return data;
}

export async function archiveDistribution(
  payload: z.output<typeof archiveDistributionSchema>,
) {
  const { error, data } = await supabase
    .from("distributions")
    .update({ is_active: false })
    .eq("id", payload.id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function createExpense(payload: ExpenseInsert) {
  const { error, data } = await supabase
    .from("expenses")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function fetchExpenses() {
  const { error, data } = await supabase.from("expenses").select();

  if (error) throw new Error(error.message);

  return data;
}

export async function createExpenseParticipants(
  payload: ExpenseParticipantInsert[],
) {
  const { error, data } = await supabase
    .from("expense_participants")
    .insert(payload)
    .select();

  if (error) throw new Error(error.message);

  return data;
}

export async function createExpenseItems(payload: ExpenseItemInsert[]) {
  const { error, data } = await supabase
    .from("expense_items")
    .insert(payload)
    .select();

  if (error) throw new Error(error.message);

  return data;
}

export async function createExpenseItemsDistributions(
  payload: ExpenseItemDistributionInsert[],
) {
  const { error, data } = await supabase
    .from("expense_item_distributions")
    .insert(payload)
    .select();

  if (error) throw new Error(error.message);

  return data;
}

export async function createExpenseSettlements(
  payload: ExpenseSettlementInsert[],
) {
  const { error, data } = await supabase
    .from("expense_settlements")
    .insert(payload)
    .select();

  if (error) throw new Error(error.message);

  return data;
}
