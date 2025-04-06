set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_bucket_current_amount(bucket_id uuid, amount numeric, transaction_type transaction_type)
 RETURNS numeric
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    updated_value NUMERIC;
BEGIN
    IF transaction_type = 'inbound' THEN
        UPDATE public.buckets  -- Added public schema
        SET current_amount = current_amount + update_bucket_current_amount.amount
        WHERE id = update_bucket_current_amount.bucket_id
        RETURNING current_amount INTO updated_value;
    ELSEIF transaction_type = 'outbound' THEN
        UPDATE public.buckets  -- Added public schema
        SET current_amount = current_amount - update_bucket_current_amount.amount
        WHERE id = update_bucket_current_amount.bucket_id
        RETURNING current_amount INTO updated_value;
    ELSE
        RAISE EXCEPTION 'Invalid transaction_type: %s', transaction_type;
    END IF;

    IF updated_value IS NULL THEN
        RAISE EXCEPTION 'Bucket with ID %s not found', bucket_id;
    END IF;

    RETURN updated_value;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_goal_current_amount(goal_id uuid, amount numeric, transaction_type transaction_type)
 RETURNS numeric
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    updated_value NUMERIC;
BEGIN
    IF transaction_type = 'inbound' THEN
        UPDATE public.goals  -- Added public schema
        SET current_amount = current_amount + update_goal_current_amount.amount
        WHERE id = update_goal_current_amount.goal_id
        RETURNING current_amount INTO updated_value;
    ELSEIF transaction_type = 'outbound' THEN
        UPDATE public.goals  -- Added public schema
        SET current_amount = current_amount - update_goal_current_amount.amount
        WHERE id = update_goal_current_amount.goal_id
        RETURNING current_amount INTO updated_value;
    ELSE
        RAISE EXCEPTION 'Invalid transaction_type: %s', transaction_type;
    END IF;

    IF updated_value IS NULL THEN
        RAISE EXCEPTION 'Bucket with ID %s not found', goal_id;
    END IF;

    RETURN updated_value;
END;
$function$
;


