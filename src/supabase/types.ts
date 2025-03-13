import {
  Enums,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/supabase/database.types";

export type Bucket = Tables<"buckets">;
export type BucketInsert = TablesInsert<"buckets">;
export type BucketUpdate = TablesUpdate<"buckets">;

export type BucketTransactionInsert = TablesInsert<"bucket_transactions">;

export type TransactionType = Enums<"transaction_type">;

export type BucketTransaction = Tables<"bucket_transactions">;
