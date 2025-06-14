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

export type Distribution = Tables<"distributions">;
export type DistributionInsert = TablesInsert<"distributions">;
export type DistributionUpdate = TablesUpdate<"distributions">;

export type DistributionTarget = Tables<"distribution_targets">;
export type DistributionTargetInsert = TablesInsert<"distribution_targets">;
export type DistributionTargetUpdate = TablesUpdate<"distribution_targets">;

export type Expense = Tables<"expenses">;
export type ExpenseInsert = TablesInsert<"expenses">;
export type ExpenseUpdate = TablesUpdate<"expenses">;

export type ExpenseParticipant = Tables<"expense_participants">;
export type ExpenseParticipantInsert = TablesInsert<"expense_participants">;
export type ExpenseParticipantUpdate = TablesUpdate<"expense_participants">;

export type ExpenseItem = Tables<"expense_items">;
export type ExpenseItemInsert = TablesInsert<"expense_items">;
export type ExpenseItemUpdate = TablesUpdate<"expense_items">;
