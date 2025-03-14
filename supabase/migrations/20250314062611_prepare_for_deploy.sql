create type "public"."transaction_type" as enum ('inbound', 'outbound');

create table "public"."bucket_transactions" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "bucket_id" uuid not null,
    "description" text not null,
    "amount" numeric not null,
    "type" transaction_type not null,
    "current_balance" numeric not null
);


alter table "public"."bucket_transactions" enable row level security;

create table "public"."buckets" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null default auth.uid(),
    "created_at" timestamp with time zone not null default now(),
    "name" character varying not null,
    "description" text,
    "current_amount" numeric not null default '0'::numeric,
    "is_active" boolean not null default true
);


alter table "public"."buckets" enable row level security;

create table "public"."goal_transactions" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "goal_id" uuid not null,
    "description" text not null,
    "amount" numeric not null,
    "type" transaction_type not null,
    "current_balance" numeric not null
);


alter table "public"."goal_transactions" enable row level security;

create table "public"."goals" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null default auth.uid(),
    "created_at" timestamp with time zone not null default now(),
    "name" character varying not null,
    "description" text,
    "target_amount" numeric not null default '0'::numeric,
    "current_amount" numeric not null default '0'::numeric,
    "is_active" boolean not null default true
);


alter table "public"."goals" enable row level security;

CREATE UNIQUE INDEX bucket_transactions_pkey ON public.bucket_transactions USING btree (id);

CREATE UNIQUE INDEX buckets_pkey ON public.buckets USING btree (id);

CREATE UNIQUE INDEX goal_transactions_pkey ON public.goal_transactions USING btree (id);

CREATE UNIQUE INDEX goals_pkey ON public.goals USING btree (id);

CREATE INDEX idx_bucket_transactions_bucket_id ON public.bucket_transactions USING btree (bucket_id);

alter table "public"."bucket_transactions" add constraint "bucket_transactions_pkey" PRIMARY KEY using index "bucket_transactions_pkey";

alter table "public"."buckets" add constraint "buckets_pkey" PRIMARY KEY using index "buckets_pkey";

alter table "public"."goal_transactions" add constraint "goal_transactions_pkey" PRIMARY KEY using index "goal_transactions_pkey";

alter table "public"."goals" add constraint "goals_pkey" PRIMARY KEY using index "goals_pkey";

alter table "public"."bucket_transactions" add constraint "bucket_transactions_bucket_id_fkey" FOREIGN KEY (bucket_id) REFERENCES buckets(id) not valid;

alter table "public"."bucket_transactions" validate constraint "bucket_transactions_bucket_id_fkey";

alter table "public"."buckets" add constraint "buckets_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."buckets" validate constraint "buckets_user_id_fkey";

alter table "public"."goal_transactions" add constraint "goal_transactions_goal_id_fkey" FOREIGN KEY (goal_id) REFERENCES goals(id) not valid;

alter table "public"."goal_transactions" validate constraint "goal_transactions_goal_id_fkey";

alter table "public"."goals" add constraint "goals_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."goals" validate constraint "goals_user_id_fkey";

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

grant delete on table "public"."bucket_transactions" to "anon";

grant insert on table "public"."bucket_transactions" to "anon";

grant references on table "public"."bucket_transactions" to "anon";

grant select on table "public"."bucket_transactions" to "anon";

grant trigger on table "public"."bucket_transactions" to "anon";

grant truncate on table "public"."bucket_transactions" to "anon";

grant update on table "public"."bucket_transactions" to "anon";

grant delete on table "public"."bucket_transactions" to "authenticated";

grant insert on table "public"."bucket_transactions" to "authenticated";

grant references on table "public"."bucket_transactions" to "authenticated";

grant select on table "public"."bucket_transactions" to "authenticated";

grant trigger on table "public"."bucket_transactions" to "authenticated";

grant truncate on table "public"."bucket_transactions" to "authenticated";

grant update on table "public"."bucket_transactions" to "authenticated";

grant delete on table "public"."bucket_transactions" to "service_role";

grant insert on table "public"."bucket_transactions" to "service_role";

grant references on table "public"."bucket_transactions" to "service_role";

grant select on table "public"."bucket_transactions" to "service_role";

grant trigger on table "public"."bucket_transactions" to "service_role";

grant truncate on table "public"."bucket_transactions" to "service_role";

grant update on table "public"."bucket_transactions" to "service_role";

grant delete on table "public"."buckets" to "anon";

grant insert on table "public"."buckets" to "anon";

grant references on table "public"."buckets" to "anon";

grant select on table "public"."buckets" to "anon";

grant trigger on table "public"."buckets" to "anon";

grant truncate on table "public"."buckets" to "anon";

grant update on table "public"."buckets" to "anon";

grant delete on table "public"."buckets" to "authenticated";

grant insert on table "public"."buckets" to "authenticated";

grant references on table "public"."buckets" to "authenticated";

grant select on table "public"."buckets" to "authenticated";

grant trigger on table "public"."buckets" to "authenticated";

grant truncate on table "public"."buckets" to "authenticated";

grant update on table "public"."buckets" to "authenticated";

grant delete on table "public"."buckets" to "service_role";

grant insert on table "public"."buckets" to "service_role";

grant references on table "public"."buckets" to "service_role";

grant select on table "public"."buckets" to "service_role";

grant trigger on table "public"."buckets" to "service_role";

grant truncate on table "public"."buckets" to "service_role";

grant update on table "public"."buckets" to "service_role";

grant delete on table "public"."goal_transactions" to "anon";

grant insert on table "public"."goal_transactions" to "anon";

grant references on table "public"."goal_transactions" to "anon";

grant select on table "public"."goal_transactions" to "anon";

grant trigger on table "public"."goal_transactions" to "anon";

grant truncate on table "public"."goal_transactions" to "anon";

grant update on table "public"."goal_transactions" to "anon";

grant delete on table "public"."goal_transactions" to "authenticated";

grant insert on table "public"."goal_transactions" to "authenticated";

grant references on table "public"."goal_transactions" to "authenticated";

grant select on table "public"."goal_transactions" to "authenticated";

grant trigger on table "public"."goal_transactions" to "authenticated";

grant truncate on table "public"."goal_transactions" to "authenticated";

grant update on table "public"."goal_transactions" to "authenticated";

grant delete on table "public"."goal_transactions" to "service_role";

grant insert on table "public"."goal_transactions" to "service_role";

grant references on table "public"."goal_transactions" to "service_role";

grant select on table "public"."goal_transactions" to "service_role";

grant trigger on table "public"."goal_transactions" to "service_role";

grant truncate on table "public"."goal_transactions" to "service_role";

grant update on table "public"."goal_transactions" to "service_role";

grant delete on table "public"."goals" to "anon";

grant insert on table "public"."goals" to "anon";

grant references on table "public"."goals" to "anon";

grant select on table "public"."goals" to "anon";

grant trigger on table "public"."goals" to "anon";

grant truncate on table "public"."goals" to "anon";

grant update on table "public"."goals" to "anon";

grant delete on table "public"."goals" to "authenticated";

grant insert on table "public"."goals" to "authenticated";

grant references on table "public"."goals" to "authenticated";

grant select on table "public"."goals" to "authenticated";

grant trigger on table "public"."goals" to "authenticated";

grant truncate on table "public"."goals" to "authenticated";

grant update on table "public"."goals" to "authenticated";

grant delete on table "public"."goals" to "service_role";

grant insert on table "public"."goals" to "service_role";

grant references on table "public"."goals" to "service_role";

grant select on table "public"."goals" to "service_role";

grant trigger on table "public"."goals" to "service_role";

grant truncate on table "public"."goals" to "service_role";

grant update on table "public"."goals" to "service_role";

create policy "Enable users to insert bucket transactions for their own bucket"
on "public"."bucket_transactions"
as permissive
for insert
to authenticated
with check ((( SELECT buckets.user_id
   FROM buckets
  WHERE (buckets.id = bucket_transactions.bucket_id)) = ( SELECT auth.uid() AS uid)));


create policy "Enable users to select their own bucket transactions"
on "public"."bucket_transactions"
as permissive
for select
to authenticated
using ((( SELECT buckets.user_id
   FROM buckets
  WHERE (buckets.id = bucket_transactions.bucket_id)) = ( SELECT auth.uid() AS uid)));


create policy "Enable users to insert their own buckets"
on "public"."buckets"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable users to update their own buckets"
on "public"."buckets"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable users to view their own data only"
on "public"."buckets"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable users to insert goal transactions for their own goals"
on "public"."goal_transactions"
as permissive
for insert
to authenticated
with check ((( SELECT goals.user_id
   FROM goals
  WHERE (goals.id = goal_transactions.goal_id)) = ( SELECT auth.uid() AS uid)));


create policy "Enable users to select their own goal transactions"
on "public"."goal_transactions"
as permissive
for select
to authenticated
using ((( SELECT goals.user_id
   FROM goals
  WHERE (goals.id = goal_transactions.goal_id)) = ( SELECT auth.uid() AS uid)));


create policy "Enable users to insert their own goals"
on "public"."goals"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable users to update their own goals"
on "public"."goals"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable users to view their own goals only"
on "public"."goals"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));