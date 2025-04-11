import { fetchTransactions } from "@/modules/dashboard/query-options";

export function getTransactionType(
  transaction: Awaited<ReturnType<typeof fetchTransactions>>[number],
) {
  return "buckets" in transaction ? "Bucket" : "Goal";
}

export function getTransactionParentName(
  transaction: Awaited<ReturnType<typeof fetchTransactions>>[number],
) {
  return "buckets" in transaction
    ? transaction.buckets.name
    : transaction.goals.name;
}
