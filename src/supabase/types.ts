import {
  Enums,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/supabase/database.types";

export type Bucket = Tables<"buckets">;
export type BucketInsert = TablesInsert<"buckets">;
export type BucketUpdate = TablesUpdate<"buckets">;

export type TransactionType = Enums<"transaction_type">;

export type BucketTransaction = Tables<"bucket_transactions">;
export type BucketTransactionInsert = TablesInsert<"bucket_transactions">;

export type Goal = Tables<"goals">;
export type GoalInsert = TablesInsert<"goals">;
export type GoalUpdate = TablesUpdate<"goals">;

export type GoalTransaction = Tables<"goal_transactions">;
export type GoalTransactionInsert = TablesInsert<"goal_transactions">;
