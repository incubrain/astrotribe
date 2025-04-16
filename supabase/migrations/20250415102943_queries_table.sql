create table public.queries (
  id uuid not null default gen_random_uuid (),
  text text not null,
  constraint queries_pkey primary key (id)
) TABLESPACE pg_default;

grant delete on table "public"."queries" to "anon";

grant insert on table "public"."queries" to "anon";

grant references on table "public"."queries" to "anon";

grant select on table "public"."queries" to "anon";

grant trigger on table "public"."queries" to "anon";

grant truncate on table "public"."queries" to "anon";

grant update on table "public"."queries" to "anon";

grant delete on table "public"."queries" to "authenticated";

grant insert on table "public"."queries" to "authenticated";

grant references on table "public"."queries" to "authenticated";

grant select on table "public"."queries" to "authenticated";

grant trigger on table "public"."queries" to "authenticated";

grant truncate on table "public"."queries" to "authenticated";

grant update on table "public"."queries" to "authenticated";

grant delete on table "public"."queries" to "service_role";

grant insert on table "public"."queries" to "service_role";

grant references on table "public"."queries" to "service_role";

grant select on table "public"."queries" to "service_role";

grant trigger on table "public"."queries" to "service_role";

grant truncate on table "public"."queries" to "service_role";

grant update on table "public"."queries" to "service_role";

ALTER TABLE "public"."contents"
ADD COLUMN summary text;
