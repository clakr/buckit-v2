-- Drop Triggers
DROP TRIGGER IF EXISTS "bucket_transaction_insert" ON "public"."bucket_transactions";
DROP TRIGGER IF EXISTS "distribution_target_type_trigger" ON "public"."distribution_targets";
DROP TRIGGER IF EXISTS "goal_transaction_insert" ON "public"."goal_transactions";

-- Drop Policies
-- Bucket Transactions Policies
DROP POLICY IF EXISTS "Enable users to insert bucket transactions for their own bucket" ON "public"."bucket_transactions";
DROP POLICY IF EXISTS "Enable users to select their own bucket transactions" ON "public"."bucket_transactions";

-- Buckets Policies
DROP POLICY IF EXISTS "Enable users to insert their own buckets" ON "public"."buckets";
DROP POLICY IF EXISTS "Enable users to update their own buckets" ON "public"."buckets";
DROP POLICY IF EXISTS "Enable users to view their own data only" ON "public"."buckets";

-- Distribution Targets Policies
DROP POLICY IF EXISTS "Enable users to delete distribution items for their own distrib" ON "public"."distribution_targets";
DROP POLICY IF EXISTS "Enable users to insert distribution items for their own distrib" ON "public"."distribution_targets";
DROP POLICY IF EXISTS "Enable users to select distribution items for their own distrib" ON "public"."distribution_targets";
DROP POLICY IF EXISTS "Enable users to update distribution items for their own distrib" ON "public"."distribution_targets";

-- Distributions Policies
DROP POLICY IF EXISTS "Enable users to delete their own distributions" ON "public"."distributions";
DROP POLICY IF EXISTS "Enable users to insert their own distributions" ON "public"."distributions";
DROP POLICY IF EXISTS "Enable users to select their own distributions" ON "public"."distributions";
DROP POLICY IF EXISTS "Enable users to update their own distributions" ON "public"."distributions";

-- Expense Item Distributions Policies
DROP POLICY IF EXISTS "Enable users to delete expense item distributions for their own" ON "public"."expense_item_distributions";
DROP POLICY IF EXISTS "Enable users to insert expense item distributions for their own" ON "public"."expense_item_distributions";
DROP POLICY IF EXISTS "Enable users to select expense item distributions for their own" ON "public"."expense_item_distributions";
DROP POLICY IF EXISTS "Enable users to update expense item distributions for their own" ON "public"."expense_item_distributions";

-- Expense Items Policies
DROP POLICY IF EXISTS "Enable users to delete expense items for their own expense" ON "public"."expense_items";
DROP POLICY IF EXISTS "Enable users to insert expense items for their own expense" ON "public"."expense_items";
DROP POLICY IF EXISTS "Enable users to select expense items for their own expense" ON "public"."expense_items";
DROP POLICY IF EXISTS "Enable users to update expense items for their own expense" ON "public"."expense_items";

-- Expense Participants Policies
DROP POLICY IF EXISTS "Enable users to delete participants for their own expenses" ON "public"."expense_participants";
DROP POLICY IF EXISTS "Enable users to insert participants for their own expenses" ON "public"."expense_participants";
DROP POLICY IF EXISTS "Enable users to select participants for their own expenses" ON "public"."expense_participants";
DROP POLICY IF EXISTS "Enable users to update participants for their own expenses" ON "public"."expense_participants";

-- Expense Settlements Policies
DROP POLICY IF EXISTS "Enable users to delete expense settlements for their own expens" ON "public"."expense_settlements";
DROP POLICY IF EXISTS "Enable users to insert expense settlements for their own expens" ON "public"."expense_settlements";
DROP POLICY IF EXISTS "Enable users to select expense settlements for their own expens" ON "public"."expense_settlements";
DROP POLICY IF EXISTS "Enable users to update expense settlements for their own expens" ON "public"."expense_settlements";

-- Expenses Policies
DROP POLICY IF EXISTS "Enable users to delete their own expenses" ON "public"."expenses";
DROP POLICY IF EXISTS "Enable users to insert their own expenses" ON "public"."expenses";
DROP POLICY IF EXISTS "Enable users to select their own expenses" ON "public"."expenses";
DROP POLICY IF EXISTS "Enable users to update their own expenses" ON "public"."expenses";

-- Goal Transactions Policies
DROP POLICY IF EXISTS "Enable users to insert goal transactions for their own goals" ON "public"."goal_transactions";
DROP POLICY IF EXISTS "Enable users to select their own goal transactions" ON "public"."goal_transactions";

-- Goals Policies
DROP POLICY IF EXISTS "Enable users to insert their own goals" ON "public"."goals";
DROP POLICY IF EXISTS "Enable users to update their own goals" ON "public"."goals";
DROP POLICY IF EXISTS "Enable users to view their own goals only" ON "public"."goals";

-- Drop Foreign Key Constraints
ALTER TABLE "public"."bucket_transactions" DROP CONSTRAINT IF EXISTS "bucket_transactions_bucket_id_fkey";
ALTER TABLE "public"."buckets" DROP CONSTRAINT IF EXISTS "buckets_user_id_fkey";
ALTER TABLE "public"."distribution_targets" DROP CONSTRAINT IF EXISTS "distribution_items_distribution_id_fkey";
ALTER TABLE "public"."distributions" DROP CONSTRAINT IF EXISTS "distributions_user_id_fkey";
ALTER TABLE "public"."expense_item_distributions" DROP CONSTRAINT IF EXISTS "expense_item_distributions_expense_item_id_fkey";
ALTER TABLE "public"."expense_item_distributions" DROP CONSTRAINT IF EXISTS "expense_item_distributions_expense_participant_id_fkey";
ALTER TABLE "public"."expense_items" DROP CONSTRAINT IF EXISTS "expense_items_expense_id_fkey";
ALTER TABLE "public"."expense_items" DROP CONSTRAINT IF EXISTS "expense_items_expense_participant_id_fkey";
ALTER TABLE "public"."expense_participants" DROP CONSTRAINT IF EXISTS "expense_participants_expense_id_fkey";
ALTER TABLE "public"."expense_settlements" DROP CONSTRAINT IF EXISTS "expense_settlements_expense_id_fkey";
ALTER TABLE "public"."expense_settlements" DROP CONSTRAINT IF EXISTS "expense_settlements_payer_participant_id_fkey";
ALTER TABLE "public"."expense_settlements" DROP CONSTRAINT IF EXISTS "expense_settlements_receiver_participant_id_fkey";
ALTER TABLE "public"."expenses" DROP CONSTRAINT IF EXISTS "expenses_user_id_fkey";
ALTER TABLE "public"."goal_transactions" DROP CONSTRAINT IF EXISTS "goal_transactions_goal_id_fkey";
ALTER TABLE "public"."goals" DROP CONSTRAINT IF EXISTS "goals_user_id_fkey";

-- Drop Functions
DROP FUNCTION IF EXISTS "public"."set_distribution_target_type"();
DROP FUNCTION IF EXISTS "public"."update_bucket_balance"();
DROP FUNCTION IF EXISTS "public"."update_goal_balance"();

-- Drop Primary Key Constraints
ALTER TABLE "public"."bucket_transactions" DROP CONSTRAINT IF EXISTS "bucket_transactions_pkey";
ALTER TABLE "public"."buckets" DROP CONSTRAINT IF EXISTS "buckets_pkey";
ALTER TABLE "public"."distribution_targets" DROP CONSTRAINT IF EXISTS "distribution_items_pkey";
ALTER TABLE "public"."distributions" DROP CONSTRAINT IF EXISTS "distributions_pkey";
ALTER TABLE "public"."expense_item_distributions" DROP CONSTRAINT IF EXISTS "expense_item_distributions_pkey";
ALTER TABLE "public"."expense_items" DROP CONSTRAINT IF EXISTS "expense_items_pkey";
ALTER TABLE "public"."expense_participants" DROP CONSTRAINT IF EXISTS "expense_participants_pkey";
ALTER TABLE "public"."expense_settlements" DROP CONSTRAINT IF EXISTS "expense_settlements_pkey";
ALTER TABLE "public"."expenses" DROP CONSTRAINT IF EXISTS "expenses_pkey";
ALTER TABLE "public"."goal_transactions" DROP CONSTRAINT IF EXISTS "goal_transactions_pkey";
ALTER TABLE "public"."goals" DROP CONSTRAINT IF EXISTS "goals_pkey";

-- Drop Indexes
DROP INDEX IF EXISTS "public"."bucket_transactions_pkey";
DROP INDEX IF EXISTS "public"."buckets_pkey";
DROP INDEX IF EXISTS "public"."distribution_items_pkey";
DROP INDEX IF EXISTS "public"."distributions_pkey";
DROP INDEX IF EXISTS "public"."expense_item_distributions_pkey";
DROP INDEX IF EXISTS "public"."expense_items_pkey";
DROP INDEX IF EXISTS "public"."expense_participants_pkey";
DROP INDEX IF EXISTS "public"."expense_settlements_pkey";
DROP INDEX IF EXISTS "public"."expenses_pkey";
DROP INDEX IF EXISTS "public"."goal_transactions_pkey";
DROP INDEX IF EXISTS "public"."goals_pkey";
DROP INDEX IF EXISTS "public"."idx_bucket_transactions_bucket_id";

-- Drop Tables
DROP TABLE IF EXISTS "public"."bucket_transactions";
DROP TABLE IF EXISTS "public"."buckets";
DROP TABLE IF EXISTS "public"."distribution_targets";
DROP TABLE IF EXISTS "public"."distributions";
DROP TABLE IF EXISTS "public"."expense_item_distributions";
DROP TABLE IF EXISTS "public"."expense_items";
DROP TABLE IF EXISTS "public"."expense_participants";
DROP TABLE IF EXISTS "public"."expense_settlements";
DROP TABLE IF EXISTS "public"."expenses";
DROP TABLE IF EXISTS "public"."goal_transactions";
DROP TABLE IF EXISTS "public"."goals";

-- Drop Types
DROP TYPE IF EXISTS "public"."distribution_amount_type";
DROP TYPE IF EXISTS "public"."distribution_target_type";
DROP TYPE IF EXISTS "public"."expense_item_type";
DROP TYPE IF EXISTS "public"."expense_status_type";
DROP TYPE IF EXISTS "public"."transaction_type";
