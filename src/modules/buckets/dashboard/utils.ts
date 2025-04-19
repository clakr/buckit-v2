import { Transaction } from "@/lib/types";

export function getTransactionType(transaction: Transaction) {
  return "buckets" in transaction ? "Bucket" : "Goal";
}

export function getTransactionParentName(transaction: Transaction) {
  return "buckets" in transaction
    ? transaction.buckets.name
    : transaction.goals.name;
}
