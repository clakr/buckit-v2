create type "public"."distribution_amount_type" as enum ('absolute', 'percentage');

create type "public"."distribution_target_type" as enum ('bucket', 'goal');

create table "public"."distribution_targets" (
    "id" uuid not null default uuid_generate_v4(),
    "distribution_id" uuid,
    "target_type" distribution_target_type,
    "target_id" uuid not null,
    "amount_type" distribution_amount_type not null,
    "amount" numeric not null,
    "description" text,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."distribution_targets" enable row level security;

create table "public"."distributions" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid not null default auth.uid(),
    "name" character varying(255) not null,
    "description" text,
    "base_amount" numeric not null,
    "created_at" timestamp with time zone not null default now(),
    "is_active" boolean not null default true
);


alter table "public"."distributions" enable row level security;

CREATE UNIQUE INDEX distribution_items_pkey ON public.distribution_targets USING btree (id);

CREATE UNIQUE INDEX distributions_pkey ON public.distributions USING btree (id);

alter table "public"."distribution_targets" add constraint "distribution_items_pkey" PRIMARY KEY using index "distribution_items_pkey";

alter table "public"."distributions" add constraint "distributions_pkey" PRIMARY KEY using index "distributions_pkey";

alter table "public"."distribution_targets" add constraint "distribution_items_distribution_id_fkey" FOREIGN KEY (distribution_id) REFERENCES distributions(id) not valid;

alter table "public"."distribution_targets" validate constraint "distribution_items_distribution_id_fkey";

alter table "public"."distributions" add constraint "distributions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."distributions" validate constraint "distributions_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.set_distribution_target_type()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Check if target_id exists in the buckets table
  IF EXISTS (SELECT 1 FROM public.buckets WHERE id = NEW.target_id) THEN
    NEW.target_type := 'bucket';
  -- Check if target_id exists in the goals table
  ELSIF EXISTS (SELECT 1 FROM public.goals WHERE id = NEW.target_id) THEN
    NEW.target_type := 'goal';
  ELSE
    -- Raise an exception if target_id does not exist in either table
    RAISE EXCEPTION 'target_id % does not exist in either buckets or goals table', NEW.target_id;
  END IF;

  -- Return the modified row
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."distribution_targets" to "anon";

grant insert on table "public"."distribution_targets" to "anon";

grant references on table "public"."distribution_targets" to "anon";

grant select on table "public"."distribution_targets" to "anon";

grant trigger on table "public"."distribution_targets" to "anon";

grant truncate on table "public"."distribution_targets" to "anon";

grant update on table "public"."distribution_targets" to "anon";

grant delete on table "public"."distribution_targets" to "authenticated";

grant insert on table "public"."distribution_targets" to "authenticated";

grant references on table "public"."distribution_targets" to "authenticated";

grant select on table "public"."distribution_targets" to "authenticated";

grant trigger on table "public"."distribution_targets" to "authenticated";

grant truncate on table "public"."distribution_targets" to "authenticated";

grant update on table "public"."distribution_targets" to "authenticated";

grant delete on table "public"."distribution_targets" to "service_role";

grant insert on table "public"."distribution_targets" to "service_role";

grant references on table "public"."distribution_targets" to "service_role";

grant select on table "public"."distribution_targets" to "service_role";

grant trigger on table "public"."distribution_targets" to "service_role";

grant truncate on table "public"."distribution_targets" to "service_role";

grant update on table "public"."distribution_targets" to "service_role";

grant delete on table "public"."distributions" to "anon";

grant insert on table "public"."distributions" to "anon";

grant references on table "public"."distributions" to "anon";

grant select on table "public"."distributions" to "anon";

grant trigger on table "public"."distributions" to "anon";

grant truncate on table "public"."distributions" to "anon";

grant update on table "public"."distributions" to "anon";

grant delete on table "public"."distributions" to "authenticated";

grant insert on table "public"."distributions" to "authenticated";

grant references on table "public"."distributions" to "authenticated";

grant select on table "public"."distributions" to "authenticated";

grant trigger on table "public"."distributions" to "authenticated";

grant truncate on table "public"."distributions" to "authenticated";

grant update on table "public"."distributions" to "authenticated";

grant delete on table "public"."distributions" to "service_role";

grant insert on table "public"."distributions" to "service_role";

grant references on table "public"."distributions" to "service_role";

grant select on table "public"."distributions" to "service_role";

grant trigger on table "public"."distributions" to "service_role";

grant truncate on table "public"."distributions" to "service_role";

grant update on table "public"."distributions" to "service_role";

create policy "Enable users to delete distribution items for their own distrib"
on "public"."distribution_targets"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM distributions
  WHERE ((distributions.id = distribution_targets.distribution_id) AND (distributions.user_id = auth.uid()) AND (distributions.is_active IS TRUE)))));


create policy "Enable users to insert distribution items for their own distrib"
on "public"."distribution_targets"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM distributions
  WHERE ((distributions.id = distribution_targets.distribution_id) AND (distributions.user_id = auth.uid()) AND (distributions.is_active IS TRUE)))));


create policy "Enable users to select distribution items for their own distrib"
on "public"."distribution_targets"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM distributions
  WHERE ((distributions.id = distribution_targets.distribution_id) AND (distributions.user_id = auth.uid()) AND (distributions.is_active IS TRUE)))));


create policy "Enable users to update distribution items for their own distrib"
on "public"."distribution_targets"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM distributions
  WHERE ((distributions.id = distribution_targets.distribution_id) AND (distributions.user_id = auth.uid()) AND (distributions.is_active IS TRUE)))))
with check ((EXISTS ( SELECT 1
   FROM distributions
  WHERE ((distributions.id = distribution_targets.distribution_id) AND (distributions.user_id = auth.uid()) AND (distributions.is_active IS TRUE)))));


create policy "Enable users to delete their own distributions"
on "public"."distributions"
as permissive
for delete
to authenticated
using ((auth.uid() = user_id));


create policy "Enable users to insert their own distributions"
on "public"."distributions"
as permissive
for insert
to authenticated
with check ((auth.uid() = user_id));


create policy "Enable users to select their own distributions"
on "public"."distributions"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "Enable users to update their own distributions"
on "public"."distributions"
as permissive
for update
to authenticated
using ((auth.uid() = user_id))
with check (((auth.uid() = user_id) AND (is_active IS TRUE)));


CREATE TRIGGER distribution_target_type_trigger BEFORE INSERT OR UPDATE ON public.distribution_targets FOR EACH ROW EXECUTE FUNCTION set_distribution_target_type();