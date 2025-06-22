create type "public"."expense_item_type" as enum ('absolute', 'percentage', 'equal');

create type "public"."expense_status_type" as enum ('draft', 'calculated', 'settled');

create table "public"."expense_item_distributions" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "expense_item_id" uuid not null,
    "expense_participant_id" uuid not null,
    "amount" numeric not null
);


alter table "public"."expense_item_distributions" enable row level security;

create table "public"."expense_items" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "expense_id" uuid not null,
    "expense_participant_id" uuid not null,
    "amount" numeric not null,
    "description" text not null,
    "type" expense_item_type not null
);


alter table "public"."expense_items" enable row level security;

create table "public"."expense_participants" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "expense_id" uuid not null,
    "name" text not null
);


alter table "public"."expense_participants" enable row level security;

create table "public"."expense_settlements" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "expense_id" uuid not null,
    "payer_participant_id" uuid not null,
    "receiver_participant_id" uuid not null,
    "amount" numeric not null
);


alter table "public"."expense_settlements" enable row level security;

create table "public"."expenses" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null default auth.uid(),
    "name" text not null,
    "description" text,
    "status" expense_status_type not null
);


alter table "public"."expenses" enable row level security;

CREATE UNIQUE INDEX expense_item_distributions_pkey ON public.expense_item_distributions USING btree (id);

CREATE UNIQUE INDEX expense_items_pkey ON public.expense_items USING btree (id);

CREATE UNIQUE INDEX expense_participants_pkey ON public.expense_participants USING btree (id);

CREATE UNIQUE INDEX expense_settlements_pkey ON public.expense_settlements USING btree (id);

CREATE UNIQUE INDEX expenses_pkey ON public.expenses USING btree (id);

alter table "public"."expense_item_distributions" add constraint "expense_item_distributions_pkey" PRIMARY KEY using index "expense_item_distributions_pkey";

alter table "public"."expense_items" add constraint "expense_items_pkey" PRIMARY KEY using index "expense_items_pkey";

alter table "public"."expense_participants" add constraint "expense_participants_pkey" PRIMARY KEY using index "expense_participants_pkey";

alter table "public"."expense_settlements" add constraint "expense_settlements_pkey" PRIMARY KEY using index "expense_settlements_pkey";

alter table "public"."expenses" add constraint "expenses_pkey" PRIMARY KEY using index "expenses_pkey";

alter table "public"."expense_item_distributions" add constraint "expense_item_distributions_expense_item_id_fkey" FOREIGN KEY (expense_item_id) REFERENCES expense_items(id) not valid;    

alter table "public"."expense_item_distributions" validate constraint "expense_item_distributions_expense_item_id_fkey";

alter table "public"."expense_item_distributions" add constraint "expense_item_distributions_expense_participant_id_fkey" FOREIGN KEY (expense_participant_id) REFERENCES expense_participants(id) not valid;

alter table "public"."expense_item_distributions" validate constraint "expense_item_distributions_expense_participant_id_fkey";

alter table "public"."expense_items" add constraint "expense_items_expense_id_fkey" FOREIGN KEY (expense_id) REFERENCES expenses(id) not valid;

alter table "public"."expense_items" validate constraint "expense_items_expense_id_fkey";

alter table "public"."expense_items" add constraint "expense_items_expense_participant_id_fkey" FOREIGN KEY (expense_participant_id) REFERENCES expense_participants(id) not valid;

alter table "public"."expense_items" validate constraint "expense_items_expense_participant_id_fkey";

alter table "public"."expense_participants" add constraint "expense_participants_expense_id_fkey" FOREIGN KEY (expense_id) REFERENCES expenses(id) not valid;

alter table "public"."expense_participants" validate constraint "expense_participants_expense_id_fkey";

alter table "public"."expense_settlements" add constraint "expense_settlements_expense_id_fkey" FOREIGN KEY (expense_id) REFERENCES expenses(id) not valid;

alter table "public"."expense_settlements" validate constraint "expense_settlements_expense_id_fkey";

alter table "public"."expense_settlements" add constraint "expense_settlements_payer_participant_id_fkey" FOREIGN KEY (payer_participant_id) REFERENCES expense_participants(id) not valid; 

alter table "public"."expense_settlements" validate constraint "expense_settlements_payer_participant_id_fkey";

alter table "public"."expense_settlements" add constraint "expense_settlements_receiver_participant_id_fkey" FOREIGN KEY (receiver_participant_id) REFERENCES expense_participants(id) not valid;

alter table "public"."expense_settlements" validate constraint "expense_settlements_receiver_participant_id_fkey";

alter table "public"."expenses" add constraint "expenses_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."expenses" validate constraint "expenses_user_id_fkey";

grant delete on table "public"."expense_item_distributions" to "anon";

grant insert on table "public"."expense_item_distributions" to "anon";

grant references on table "public"."expense_item_distributions" to "anon";

grant select on table "public"."expense_item_distributions" to "anon";

grant trigger on table "public"."expense_item_distributions" to "anon";

grant truncate on table "public"."expense_item_distributions" to "anon";

grant update on table "public"."expense_item_distributions" to "anon";

grant delete on table "public"."expense_item_distributions" to "authenticated";

grant insert on table "public"."expense_item_distributions" to "authenticated";

grant references on table "public"."expense_item_distributions" to "authenticated";

grant select on table "public"."expense_item_distributions" to "authenticated";

grant trigger on table "public"."expense_item_distributions" to "authenticated";

grant truncate on table "public"."expense_item_distributions" to "authenticated";

grant update on table "public"."expense_item_distributions" to "authenticated";

grant delete on table "public"."expense_item_distributions" to "service_role";

grant insert on table "public"."expense_item_distributions" to "service_role";

grant references on table "public"."expense_item_distributions" to "service_role";

grant select on table "public"."expense_item_distributions" to "service_role";

grant trigger on table "public"."expense_item_distributions" to "service_role";

grant truncate on table "public"."expense_item_distributions" to "service_role";

grant update on table "public"."expense_item_distributions" to "service_role";

grant delete on table "public"."expense_items" to "anon";

grant insert on table "public"."expense_items" to "anon";

grant references on table "public"."expense_items" to "anon";

grant select on table "public"."expense_items" to "anon";

grant trigger on table "public"."expense_items" to "anon";

grant truncate on table "public"."expense_items" to "anon";

grant update on table "public"."expense_items" to "anon";

grant delete on table "public"."expense_items" to "authenticated";

grant insert on table "public"."expense_items" to "authenticated";

grant references on table "public"."expense_items" to "authenticated";

grant select on table "public"."expense_items" to "authenticated";

grant trigger on table "public"."expense_items" to "authenticated";

grant truncate on table "public"."expense_items" to "authenticated";

grant update on table "public"."expense_items" to "authenticated";

grant delete on table "public"."expense_items" to "service_role";

grant insert on table "public"."expense_items" to "service_role";

grant references on table "public"."expense_items" to "service_role";

grant select on table "public"."expense_items" to "service_role";

grant trigger on table "public"."expense_items" to "service_role";

grant truncate on table "public"."expense_items" to "service_role";

grant update on table "public"."expense_items" to "service_role";

grant delete on table "public"."expense_participants" to "anon";

grant insert on table "public"."expense_participants" to "anon";

grant references on table "public"."expense_participants" to "anon";

grant select on table "public"."expense_participants" to "anon";

grant trigger on table "public"."expense_participants" to "anon";

grant truncate on table "public"."expense_participants" to "anon";

grant update on table "public"."expense_participants" to "anon";

grant delete on table "public"."expense_participants" to "authenticated";

grant insert on table "public"."expense_participants" to "authenticated";

grant references on table "public"."expense_participants" to "authenticated";

grant select on table "public"."expense_participants" to "authenticated";

grant trigger on table "public"."expense_participants" to "authenticated";

grant truncate on table "public"."expense_participants" to "authenticated";

grant update on table "public"."expense_participants" to "authenticated";

grant delete on table "public"."expense_participants" to "service_role";

grant insert on table "public"."expense_participants" to "service_role";

grant references on table "public"."expense_participants" to "service_role";

grant select on table "public"."expense_participants" to "service_role";

grant trigger on table "public"."expense_participants" to "service_role";

grant truncate on table "public"."expense_participants" to "service_role";

grant update on table "public"."expense_participants" to "service_role";

grant delete on table "public"."expense_settlements" to "anon";

grant insert on table "public"."expense_settlements" to "anon";

grant references on table "public"."expense_settlements" to "anon";

grant select on table "public"."expense_settlements" to "anon";

grant trigger on table "public"."expense_settlements" to "anon";

grant truncate on table "public"."expense_settlements" to "anon";

grant update on table "public"."expense_settlements" to "anon";

grant delete on table "public"."expense_settlements" to "authenticated";

grant insert on table "public"."expense_settlements" to "authenticated";

grant references on table "public"."expense_settlements" to "authenticated";

grant select on table "public"."expense_settlements" to "authenticated";

grant trigger on table "public"."expense_settlements" to "authenticated";

grant truncate on table "public"."expense_settlements" to "authenticated";

grant update on table "public"."expense_settlements" to "authenticated";

grant delete on table "public"."expense_settlements" to "service_role";

grant insert on table "public"."expense_settlements" to "service_role";

grant references on table "public"."expense_settlements" to "service_role";

grant select on table "public"."expense_settlements" to "service_role";

grant trigger on table "public"."expense_settlements" to "service_role";

grant truncate on table "public"."expense_settlements" to "service_role";

grant update on table "public"."expense_settlements" to "service_role";

grant delete on table "public"."expenses" to "anon";

grant insert on table "public"."expenses" to "anon";

grant references on table "public"."expenses" to "anon";

grant select on table "public"."expenses" to "anon";

grant trigger on table "public"."expenses" to "anon";

grant truncate on table "public"."expenses" to "anon";

grant update on table "public"."expenses" to "anon";

grant delete on table "public"."expenses" to "authenticated";

grant insert on table "public"."expenses" to "authenticated";

grant references on table "public"."expenses" to "authenticated";

grant select on table "public"."expenses" to "authenticated";

grant trigger on table "public"."expenses" to "authenticated";

grant truncate on table "public"."expenses" to "authenticated";

grant update on table "public"."expenses" to "authenticated";

grant delete on table "public"."expenses" to "service_role";

grant insert on table "public"."expenses" to "service_role";

grant references on table "public"."expenses" to "service_role";

grant select on table "public"."expenses" to "service_role";

grant trigger on table "public"."expenses" to "service_role";

grant truncate on table "public"."expenses" to "service_role";

grant update on table "public"."expenses" to "service_role";

create policy "Enable users to delete expense item distributions for their own"
on "public"."expense_item_distributions"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM (expense_items ei
     JOIN expenses e ON ((ei.expense_id = e.id)))
  WHERE ((ei.id = expense_item_distributions.expense_item_id) AND (e.user_id = auth.uid())))));


create policy "Enable users to insert expense item distributions for their own"
on "public"."expense_item_distributions"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM (expense_items ei
     JOIN expenses e ON ((ei.expense_id = e.id)))
  WHERE ((ei.id = expense_item_distributions.expense_item_id) AND (e.user_id = auth.uid())))));


create policy "Enable users to select expense item distributions for their own"
on "public"."expense_item_distributions"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM (expense_items ei
     JOIN expenses e ON ((ei.expense_id = e.id)))
  WHERE ((ei.id = expense_item_distributions.expense_item_id) AND (e.user_id = auth.uid())))));


create policy "Enable users to update expense item distributions for their own"
on "public"."expense_item_distributions"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM (expense_items ei
     JOIN expenses e ON ((ei.expense_id = e.id)))
  WHERE ((ei.id = expense_item_distributions.expense_item_id) AND (e.user_id = auth.uid())))))
with check ((EXISTS ( SELECT 1
   FROM (expense_items ei
     JOIN expenses e ON ((ei.expense_id = e.id)))
  WHERE ((ei.id = expense_item_distributions.expense_item_id) AND (e.user_id = auth.uid())))));


create policy "Enable users to delete expense items for their own expense"
on "public"."expense_items"
as permissive
for delete
to authenticated
using ((( SELECT expenses.user_id
   FROM expenses
  WHERE (expenses.id = expense_items.expense_id)) = auth.uid()));


create policy "Enable users to insert expense items for their own expense"
on "public"."expense_items"
as permissive
for insert
to authenticated
with check ((( SELECT expenses.user_id
   FROM expenses
  WHERE (expenses.id = expense_items.expense_id)) = auth.uid()));


create policy "Enable users to select expense items for their own expense"
on "public"."expense_items"
as permissive
for select
to authenticated
using ((( SELECT expenses.user_id
   FROM expenses
  WHERE (expenses.id = expense_items.expense_id)) = auth.uid()));


create policy "Enable users to update expense items for their own expense"
on "public"."expense_items"
as permissive
for update
to authenticated
using ((( SELECT expenses.user_id
   FROM expenses
  WHERE (expenses.id = expense_items.expense_id)) = auth.uid()))
with check ((( SELECT expenses.user_id
   FROM expenses
  WHERE (expenses.id = expense_items.expense_id)) = auth.uid()));


create policy "Enable users to delete participants for their own expenses"
on "public"."expense_participants"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM expenses
  WHERE ((expenses.id = expense_participants.expense_id) AND (expenses.user_id = auth.uid())))));


create policy "Enable users to insert participants for their own expenses"
on "public"."expense_participants"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM expenses
  WHERE ((expenses.id = expense_participants.expense_id) AND (expenses.user_id = auth.uid())))));


create policy "Enable users to select participants for their own expenses"
on "public"."expense_participants"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM expenses
  WHERE ((expenses.id = expense_participants.expense_id) AND (expenses.user_id = auth.uid())))));


create policy "Enable users to update participants for their own expenses"
on "public"."expense_participants"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM expenses
  WHERE ((expenses.id = expense_participants.expense_id) AND (expenses.user_id = auth.uid())))))
with check ((EXISTS ( SELECT 1
   FROM expenses
  WHERE ((expenses.id = expense_participants.expense_id) AND (expenses.user_id = auth.uid())))));


create policy "Enable users to delete expense settlements for their own expens"
on "public"."expense_settlements"
as permissive
for delete
to authenticated
using ((( SELECT expenses.user_id
   FROM expenses
  WHERE (expenses.id = expense_settlements.expense_id)) = auth.uid()));


create policy "Enable users to insert expense settlements for their own expens"
on "public"."expense_settlements"
as permissive
for insert
to authenticated
with check ((( SELECT expenses.user_id
   FROM expenses
  WHERE (expenses.id = expense_settlements.expense_id)) = auth.uid()));


create policy "Enable users to select expense settlements for their own expens"
on "public"."expense_settlements"
as permissive
for select
to authenticated
using ((( SELECT expenses.user_id
   FROM expenses
  WHERE (expenses.id = expense_settlements.expense_id)) = auth.uid()));


create policy "Enable users to update expense settlements for their own expens"
on "public"."expense_settlements"
as permissive
for update
to authenticated
using ((( SELECT expenses.user_id
   FROM expenses
  WHERE (expenses.id = expense_settlements.expense_id)) = auth.uid()))
with check ((( SELECT expenses.user_id
   FROM expenses
  WHERE (expenses.id = expense_settlements.expense_id)) = auth.uid()));


create policy "Enable users to delete their own expenses"
on "public"."expenses"
as permissive
for delete
to authenticated
using ((auth.uid() = user_id));


create policy "Enable users to insert their own expenses"
on "public"."expenses"
as permissive
for insert
to authenticated
with check ((auth.uid() = user_id));


create policy "Enable users to select their own expenses"
on "public"."expenses"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "Enable users to update their own expenses"
on "public"."expenses"
as permissive
for update
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));