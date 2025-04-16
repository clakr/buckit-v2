drop function if exists "public"."update_bucket_current_amount"(bucket_id uuid, amount numeric, transaction_type transaction_type);

drop function if exists "public"."update_goal_current_amount"(goal_id uuid, amount numeric, transaction_type transaction_type);

alter table "public"."bucket_transactions" alter column "current_balance" drop not null;

alter table "public"."goal_transactions" alter column "current_balance" drop not null;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_bucket_balance()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  current_bucket_amount NUMERIC;
BEGIN
  -- Get the current amount from the bucket
  SELECT current_amount INTO current_bucket_amount
  FROM public.buckets
  WHERE id = NEW.bucket_id;

  -- Check if the bucket exists
  IF current_bucket_amount IS NOT NULL THEN
    -- Update the bucket's current_amount based on the transaction type
    IF NEW.type = 'inbound' THEN
      UPDATE public.buckets
      SET current_amount = current_bucket_amount + NEW.amount
      WHERE id = NEW.bucket_id;

      -- Update current_balance in bucket_transactions table
       NEW.current_balance := current_bucket_amount + NEW.amount;
    ELSEIF NEW.type = 'outbound' THEN
      UPDATE public.buckets
      SET current_amount = current_bucket_amount - NEW.amount
      WHERE id = NEW.bucket_id;

        -- Update current_balance in bucket_transactions table
       NEW.current_balance := current_bucket_amount - NEW.amount;
    END IF;
  ELSE
    -- Raise an exception if the bucket does not exist
    RAISE EXCEPTION 'Bucket with ID % does not exist', NEW.bucket_id;
  END IF;

  -- Return the new row
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_goal_balance()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  current_goal_amount NUMERIC;
BEGIN
  -- Get the current amount from the goal
  SELECT current_amount INTO current_goal_amount
  FROM public.goals
  WHERE id = NEW.goal_id;

  -- Check if the goal exists
  IF current_goal_amount IS NOT NULL THEN
    -- Update the goal's current_amount based on the transaction type
    IF NEW.type = 'inbound' THEN
      UPDATE public.goals
      SET current_amount = current_goal_amount + NEW.amount
      WHERE id = NEW.goal_id;

        -- Update current_balance in goal_transactions table
       NEW.current_balance := current_goal_amount + NEW.amount;
    ELSEIF NEW.type = 'outbound' THEN
      UPDATE public.goals
      SET current_amount = current_goal_amount - NEW.amount
      WHERE id = NEW.goal_id;

       -- Update current_balance in goal_transactions table
       NEW.current_balance := current_goal_amount - NEW.amount;
    END IF;
  ELSE
    -- Raise an exception if the goal does not exist
    RAISE EXCEPTION 'Goal with ID % does not exist', NEW.goal_id;
  END IF;

  -- Return the new row
  RETURN NEW;
END;
$function$
;

CREATE TRIGGER bucket_transaction_insert BEFORE INSERT ON public.bucket_transactions FOR EACH ROW EXECUTE FUNCTION update_bucket_balance();

CREATE TRIGGER goal_transaction_insert BEFORE INSERT ON public.goal_transactions FOR EACH ROW EXECUTE FUNCTION update_goal_balance();