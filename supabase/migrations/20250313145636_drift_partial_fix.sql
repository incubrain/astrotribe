alter table "public"."categorized_urls" drop constraint if exists "unique_normalized_url";

drop index if exists "public"."unique_normalized_url";

drop table if exists "public"."strapi_migrations" cascade;

drop table if exists "public"."strapi_migrations_internal" cascade;

alter table "public"."categorized_urls" add column if not exists "company_id" uuid;

alter table "public"."categorized_urls" add column if not exists "content_hash" character varying;

alter table "public"."categorized_urls" add column if not exists "updated_at" timestamp with time zone default now();

alter table "public"."categorized_urls" alter column "found_on" drop not null;

drop sequence if exists "public"."strapi_migrations_id_seq";

drop sequence if exists "public"."strapi_migrations_internal_id_seq";

DROP FUNCTION if exists public.refresh_content_views(text[])


