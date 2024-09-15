create sequence "public"."classified_urls_id_seq";

alter table "public"."metric_definitions" drop constraint "metric_definitions_name_key";

drop index if exists "public"."metric_definitions_name_key";

alter table "public"."contents" alter column "content_type" drop default;

alter type "public"."content_type" rename to "content_type__old_version_to_be_dropped";

create type "public"."content_type" as enum ('news', 'events', 'jobs', 'research', 'companies', 'contact', 'people', 'unknown');

create table "public"."classified_urls" (
    "id" integer not null default nextval('public.classified_urls_id_seq'::regclass),
    "url" text not null,
    "predicted_category" public.content_type,
    "actual_category" public.content_type,
    "is_reviewed" boolean default false,
    "added_to_training" boolean default false,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."classified_urls" enable row level security;

alter table "public"."bookmarks" alter column content_type type "public"."content_type" using content_type::text::"public"."content_type";

alter table "public"."comments" alter column content_type type "public"."content_type" using content_type::text::"public"."content_type";

alter table "public"."content_sources" alter column content_type type "public"."content_type" using content_type::text::"public"."content_type";

alter table "public"."contents" alter column content_type type "public"."content_type" using content_type::text::"public"."content_type";

alter table "public"."contents" alter column "content_type" set default 'companies'::public.content_type;

drop type "public"."content_type__old_version_to_be_dropped";

alter sequence "public"."classified_urls_id_seq" owned by "public"."classified_urls"."id";

CREATE UNIQUE INDEX classified_urls_pkey ON public.classified_urls USING btree (id);

CREATE UNIQUE INDEX classified_urls_url_key ON public.classified_urls USING btree (url);

CREATE INDEX idx_metric_definitions_name_category ON public.metric_definitions USING btree (name, category);

CREATE UNIQUE INDEX metric_definitions_name_category_key ON public.metric_definitions USING btree (name, category);

alter table "public"."classified_urls" add constraint "classified_urls_pkey" PRIMARY KEY using index "classified_urls_pkey";

alter table "public"."classified_urls" add constraint "classified_urls_url_key" UNIQUE using index "classified_urls_url_key";

alter table "public"."metric_definitions" add constraint "metric_definitions_name_category_key" UNIQUE using index "metric_definitions_name_category_key";

grant delete on table "public"."classified_urls" to "anon";

grant insert on table "public"."classified_urls" to "anon";

grant references on table "public"."classified_urls" to "anon";

grant select on table "public"."classified_urls" to "anon";

grant trigger on table "public"."classified_urls" to "anon";

grant truncate on table "public"."classified_urls" to "anon";

grant update on table "public"."classified_urls" to "anon";

grant delete on table "public"."classified_urls" to "authenticated";

grant insert on table "public"."classified_urls" to "authenticated";

grant references on table "public"."classified_urls" to "authenticated";

grant select on table "public"."classified_urls" to "authenticated";

grant trigger on table "public"."classified_urls" to "authenticated";

grant truncate on table "public"."classified_urls" to "authenticated";

grant update on table "public"."classified_urls" to "authenticated";

grant delete on table "public"."classified_urls" to "service_role";

grant insert on table "public"."classified_urls" to "service_role";

grant references on table "public"."classified_urls" to "service_role";

grant select on table "public"."classified_urls" to "service_role";

grant trigger on table "public"."classified_urls" to "service_role";

grant truncate on table "public"."classified_urls" to "service_role";

grant update on table "public"."classified_urls" to "service_role";

create policy "delete_policy"
on "public"."classified_urls"
as permissive
for delete
to public
using (public.authorize('classified_urls.delete'::text));


create policy "insert_policy"
on "public"."classified_urls"
as permissive
for insert
to public
with check (public.authorize('classified_urls.insert'::text));


create policy "select_policy"
on "public"."classified_urls"
as permissive
for select
to public
using (public.authorize('classified_urls.select'::text));


create policy "update_policy"
on "public"."classified_urls"
as permissive
for update
to public
using (public.authorize('classified_urls.update'::text));



