drop trigger if exists "update_metrics_after_bookmark" on "public"."bookmarks";

drop trigger if exists "update_news_timestamp" on "public"."news";

drop trigger if exists "update_research_timestamp" on "public"."research";

revoke select on table "public"."categories" from "authenticator";

revoke delete on table "public"."content_categories" from "anon";

revoke insert on table "public"."content_categories" from "anon";

revoke references on table "public"."content_categories" from "anon";

revoke select on table "public"."content_categories" from "anon";

revoke trigger on table "public"."content_categories" from "anon";

revoke truncate on table "public"."content_categories" from "anon";

revoke update on table "public"."content_categories" from "anon";

revoke delete on table "public"."content_categories" from "authenticated";

revoke insert on table "public"."content_categories" from "authenticated";

revoke references on table "public"."content_categories" from "authenticated";

revoke select on table "public"."content_categories" from "authenticated";

revoke trigger on table "public"."content_categories" from "authenticated";

revoke truncate on table "public"."content_categories" from "authenticated";

revoke update on table "public"."content_categories" from "authenticated";

revoke delete on table "public"."content_categories" from "service_role";

revoke insert on table "public"."content_categories" from "service_role";

revoke references on table "public"."content_categories" from "service_role";

revoke select on table "public"."content_categories" from "service_role";

revoke trigger on table "public"."content_categories" from "service_role";

revoke truncate on table "public"."content_categories" from "service_role";

revoke update on table "public"."content_categories" from "service_role";

revoke delete on table "public"."content_source_visits" from "anon";

revoke insert on table "public"."content_source_visits" from "anon";

revoke references on table "public"."content_source_visits" from "anon";

revoke select on table "public"."content_source_visits" from "anon";

revoke trigger on table "public"."content_source_visits" from "anon";

revoke truncate on table "public"."content_source_visits" from "anon";

revoke update on table "public"."content_source_visits" from "anon";

revoke delete on table "public"."content_source_visits" from "authenticated";

revoke insert on table "public"."content_source_visits" from "authenticated";

revoke references on table "public"."content_source_visits" from "authenticated";

revoke select on table "public"."content_source_visits" from "authenticated";

revoke trigger on table "public"."content_source_visits" from "authenticated";

revoke truncate on table "public"."content_source_visits" from "authenticated";

revoke update on table "public"."content_source_visits" from "authenticated";

revoke delete on table "public"."content_source_visits" from "service_role";

revoke insert on table "public"."content_source_visits" from "service_role";

revoke references on table "public"."content_source_visits" from "service_role";

revoke select on table "public"."content_source_visits" from "service_role";

revoke trigger on table "public"."content_source_visits" from "service_role";

revoke truncate on table "public"."content_source_visits" from "service_role";

revoke update on table "public"."content_source_visits" from "service_role";

revoke delete on table "public"."content_statuses" from "anon";

revoke insert on table "public"."content_statuses" from "anon";

revoke references on table "public"."content_statuses" from "anon";

revoke select on table "public"."content_statuses" from "anon";

revoke trigger on table "public"."content_statuses" from "anon";

revoke truncate on table "public"."content_statuses" from "anon";

revoke update on table "public"."content_statuses" from "anon";

revoke delete on table "public"."content_statuses" from "authenticated";

revoke insert on table "public"."content_statuses" from "authenticated";

revoke references on table "public"."content_statuses" from "authenticated";

revoke select on table "public"."content_statuses" from "authenticated";

revoke trigger on table "public"."content_statuses" from "authenticated";

revoke truncate on table "public"."content_statuses" from "authenticated";

revoke update on table "public"."content_statuses" from "authenticated";

revoke delete on table "public"."content_statuses" from "service_role";

revoke insert on table "public"."content_statuses" from "service_role";

revoke references on table "public"."content_statuses" from "service_role";

revoke select on table "public"."content_statuses" from "service_role";

revoke trigger on table "public"."content_statuses" from "service_role";

revoke truncate on table "public"."content_statuses" from "service_role";

revoke update on table "public"."content_statuses" from "service_role";

revoke select on table "public"."news" from "anon";

revoke select on table "public"."news" from "authenticated";

revoke select on table "public"."news" from "authenticator";

revoke delete on table "public"."news" from "service_role";

revoke insert on table "public"."news" from "service_role";

revoke select on table "public"."news" from "service_role";

revoke update on table "public"."news" from "service_role";

revoke select on table "public"."news_tags" from "anon";

revoke select on table "public"."news_tags" from "authenticated";

revoke delete on table "public"."news_tags" from "service_role";

revoke insert on table "public"."news_tags" from "service_role";

revoke select on table "public"."news_tags" from "service_role";

revoke update on table "public"."news_tags" from "service_role";

revoke delete on table "public"."research" from "anon";

revoke insert on table "public"."research" from "anon";

revoke references on table "public"."research" from "anon";

revoke select on table "public"."research" from "anon";

revoke trigger on table "public"."research" from "anon";

revoke truncate on table "public"."research" from "anon";

revoke update on table "public"."research" from "anon";

revoke delete on table "public"."research" from "authenticated";

revoke insert on table "public"."research" from "authenticated";

revoke references on table "public"."research" from "authenticated";

revoke select on table "public"."research" from "authenticated";

revoke trigger on table "public"."research" from "authenticated";

revoke truncate on table "public"."research" from "authenticated";

revoke update on table "public"."research" from "authenticated";

revoke delete on table "public"."research" from "service_role";

revoke insert on table "public"."research" from "service_role";

revoke references on table "public"."research" from "service_role";

revoke select on table "public"."research" from "service_role";

revoke trigger on table "public"."research" from "service_role";

revoke truncate on table "public"."research" from "service_role";

revoke update on table "public"."research" from "service_role";

alter table "public"."bookmarks" drop constraint "bookmarks_content_fk";

alter table "public"."comments" drop constraint "comments_user_id_fkey";

alter table "public"."companies" drop constraint "public_companies_category_id_fkey";

alter table "public"."content_categories" drop constraint "content_categories_category_id_fkey";

alter table "public"."content_categories" drop constraint "content_categories_content_id_fkey";

alter table "public"."content_source_visits" drop constraint "content_source_visits_content_id_fkey";

alter table "public"."content_source_visits" drop constraint "content_source_visits_user_id_fkey";

alter table "public"."content_sources" drop constraint "content_sources_url_key1";

alter table "public"."content_statuses" drop constraint "content_statuses_content_id_fkey";

alter table "public"."feed_sources" drop constraint "fk_feed_sources_content_sources";

alter table "public"."feeds" drop constraint "feeds_user_id_fkey";

alter table "public"."news" drop constraint "news_content_source_id_fkey";

alter table "public"."news" drop constraint "news_url_key";

alter table "public"."news" drop constraint "public_news_category_id_fkey";

alter table "public"."news" drop constraint "public_news_company_id_fkey";

alter table "public"."news" drop constraint "public_news_id_fkey";

alter table "public"."news_summaries" drop constraint "news_summaries_news_fk";

alter table "public"."news_tags" drop constraint "news_tags_tag_id_fkey";

alter table "public"."newsletters" drop constraint "newsletters_id_fkey";

alter table "public"."research" drop constraint "research_content_fk";

alter table "public"."research" drop constraint "research_pdf_url_key";

alter table "public"."research" drop constraint "research_url_key";

alter table "public"."research_embeddings" drop constraint "research_embeddings_research_id_fkey";

alter table "public"."content_sources" drop constraint "content_sources_company_id_fkey";

alter table "public"."content_tags" drop constraint "content_tags_content_id_fkey";

alter table "public"."content_tags" drop constraint "content_tags_tag_id_fkey";

alter table "public"."feed_categories" drop constraint "feed_categories_category_id_fkey";

alter table "public"."feed_categories" drop constraint "feed_categories_feed_id_fkey";

drop index if exists "public"."idx_content_scores_content_type";

drop index if exists "public"."idx_content_scores_created_at";

drop index if exists "public"."idx_content_scores_hot_score";

drop index if exists "public"."idx_content_scores_id";

drop index if exists "public"."news_details_id_idx";

drop materialized view if exists "public"."content_scores";

drop materialized view if exists "public"."news_details";

alter table "public"."content_categories" drop constraint "content_categories_pkey";

alter table "public"."content_source_visits" drop constraint "content_source_visits_pkey";


alter table "public"."content_statuses" drop constraint "content_statuses_pkey";

alter table "public"."news" drop constraint "news_pkey";

alter table "public"."news_tags" drop constraint "news_tags_pkey";

alter table "public"."research" drop constraint "research_pkey";

drop index if exists "public"."categories_title_key";

drop index if exists "public"."content_categories_pkey";

drop index if exists "public"."content_source_visits_pkey";

-- 

-- ✅ FEED SOURCES: Convert content_source_id from bigint → UUID
ALTER TABLE "public"."feed_sources" ADD COLUMN "new_content_source_id" UUID DEFAULT gen_random_uuid();

-- Create mapping table only if it doesn't exist
DROP TABLE IF EXISTS public.content_sources_id_mapping;

CREATE TABLE public.content_sources_id_mapping AS 
SELECT id AS old_id, gen_random_uuid() AS new_id FROM public.content_sources;

-- Update content_source_id using the mapping table
UPDATE "public"."feed_sources"
SET "new_content_source_id" = (SELECT new_id FROM public.content_sources_id_mapping WHERE old_id = public.feed_sources.content_source_id);

-- Drop old column and rename new column
ALTER TABLE "public"."feed_sources" DROP COLUMN "content_source_id";
ALTER TABLE "public"."feed_sources" RENAME COLUMN "new_content_source_id" TO "content_source_id";

ALTER TABLE "public"."feed_sources" ALTER COLUMN "created_at" DROP NOT NULL;


-- Re-use the existing mapping table from the previous step
UPDATE "public"."content_sources"
SET "new_id" = (SELECT new_id FROM public.content_sources_id_mapping WHERE old_id = public.content_sources.id);

-- Drop old primary key and convert content_sources.id to UUID
ALTER TABLE "public"."content_sources" DROP CONSTRAINT IF EXISTS content_sources_pkey1;
ALTER TABLE "public"."content_sources" DROP COLUMN "id";
ALTER TABLE "public"."content_sources" RENAME COLUMN "new_id" TO "id";
ALTER TABLE "public"."content_sources" ADD PRIMARY KEY ("id");

ALTER TABLE "public"."content_sources" ADD COLUMN "new_id" UUID DEFAULT gen_random_uuid();

-- ✅ Cleanup: Remove mapping table after it's no longer needed
DROP TABLE IF EXISTS public.content_sources_id_mapping;

drop index if exists "public"."content_sources_url_key1";

drop index if exists "public"."content_statuses_pkey";

drop index if exists "public"."feed_sources_feed_id_idx";

drop index if exists "public"."idx_comments_content";

drop index if exists "public"."idx_content_categories";

drop index if exists "public"."idx_content_source_visits_content_id";

drop index if exists "public"."idx_content_source_visits_created_at";

drop index if exists "public"."idx_content_source_visits_user_id";

drop index if exists "public"."idx_content_sources_url";

drop index if exists "public"."idx_content_statuses_content_id";

drop index if exists "public"."idx_content_tags";

drop index if exists "public"."idx_content_type";

drop index if exists "public"."idx_feed_sources_source_id";

drop index if exists "public"."idx_news_content_source_id";
alter table "public"."news" drop constraint "news_id_key";

drop index if exists "public"."news_id_key";

drop index if exists "public"."news_pkey";

drop index if exists "public"."news_tags_pkey";

drop index if exists "public"."news_url_key";

drop index if exists "public"."research_pdf_url_key";

drop index if exists "public"."research_pkey";

drop index if exists "public"."research_url_key";


drop table "public"."content_categories";

drop table "public"."content_source_visits";

drop table "public"."content_statuses";

drop table "public"."news";

drop table "public"."news_tags";

drop table "public"."research";

create table "public"."content_interactions" (
    "id" uuid not null default gen_random_uuid(),
    "content_id" uuid not null,
    "user_id" uuid not null,
    "interaction_type" text not null,
    "created_at" timestamp with time zone default now(),
    "details" jsonb
);

create table "public"."content_types" (
    "type_name" text not null,
    "config" jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);

create table "public"."errors" (
    "id" uuid not null default gen_random_uuid(),
    "table_name" text not null,
    "record_id" text not null,
    "error_message" text not null,
    "metadata" jsonb,
    "created_at" timestamp with time zone not null
);

alter table "public"."categories" alter column "body" set data type character varying using "body"::character varying;

alter table "public"."categories" alter column "created_at" set default now();

alter table "public"."categories" alter column "created_at" drop not null;

alter table "public"."categories" alter column "created_at" set data type timestamp with time zone using "created_at"::timestamp with time zone;

alter table "public"."categories" alter column "document_id" set data type character varying using "document_id"::character varying;

-- Step 1: Remove the default if there is one
ALTER TABLE "public"."categories" ALTER COLUMN "id" DROP DEFAULT;

-- Step 2: Convert column type from bigint to UUID
ALTER TABLE "public"."categories" ADD COLUMN "new_id" UUID DEFAULT gen_random_uuid();
UPDATE "public"."categories" SET "new_id" = gen_random_uuid();
ALTER TABLE "public"."categories" DROP CONSTRAINT "categories_pkey";
ALTER TABLE "public"."categories" ADD PRIMARY KEY ("new_id");
ALTER TABLE "public"."categories" DROP COLUMN "id";
ALTER TABLE "public"."categories" RENAME COLUMN "new_id" TO "id";

alter table "public"."categories" alter column "locale" set data type character varying using "locale"::character varying;

alter table "public"."categories" alter column "name" set data type character varying using "name"::character varying;

alter table "public"."categories" alter column "published_at" set data type character varying using "published_at"::character varying;

alter table "public"."categorized_urls" add column "content_error_count" integer;

alter table "public"."categorized_urls" add column "error_count" integer;

alter table "public"."categorized_urls" add column "last_content_error" text;

alter table "public"."categorized_urls" add column "last_error" text;

alter table "public"."comments" drop column "content";

alter table "public"."comments" drop column "content_type";

alter table "public"."comments" add column "comment_text" text not null;

alter table "public"."comments" add column "deleted_at" timestamp with time zone;

alter table "public"."comments" add column "is_active" boolean default true;

alter table "public"."comments" alter column "content_id" drop not null;

alter table "public"."comments" alter column "created_at" set default now();

alter table "public"."comments" alter column "id" set default gen_random_uuid();

alter table "public"."comments" alter column "updated_at" set default now();

alter table "public"."content_sources" drop column "hash";

alter table "public"."content_sources" drop column "refreshed_at";

alter table "public"."content_sources" drop column "rss_urls";

alter table "public"."content_sources" drop column "scraped_at";

alter table "public"."content_sources" add column "details" jsonb;

alter table "public"."content_sources" add column "is_rss" boolean default false;

alter table "public"."content_sources" add column "last_scraped_at" timestamp with time zone;

alter table "public"."content_sources" add column "name" text;

alter table "public"."content_sources" add column "rss_url" text;

alter table "public"."content_sources" alter column "content_type" set data type text using "content_type"::text;

alter table "public"."content_sources" alter column "created_at" set default now();

alter table "public"."content_sources" alter column "expected_count" drop default;

alter table "public"."content_sources" alter column "expected_count" set data type integer using "expected_count"::integer;

alter table "public"."content_sources" alter column "failed_count" set data type integer using "failed_count"::integer;

ALTER TABLE "public"."content_sources" ALTER COLUMN "id" DROP DEFAULT;

-- Step 2: Convert column type from bigint to UUID
ALTER TABLE "public"."content_sources" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::text::uuid;

-- Step 3: Set the new default to generate UUIDs automatically
ALTER TABLE "public"."content_sources" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

ALTER TABLE "public"."content_sources" ALTER COLUMN "priority" DROP DEFAULT;
alter table "public"."content_sources" alter column "priority" set data type text using "priority"::text;
alter table "public"."content_sources" alter column "priority" set default 'medium'::text;

ALTER TABLE "public"."content_sources" ALTER COLUMN "scrape_frequency" DROP DEFAULT;
alter table "public"."content_sources" alter column "scrape_frequency" set data type text using "scrape_frequency"::text;
alter table "public"."content_sources" alter column "scrape_frequency" set default 'daily'::text;


alter table "public"."content_sources" alter column "updated_at" set default now();

ALTER TABLE "public"."content_tags" ADD COLUMN "new_tag_id" UUID DEFAULT gen_random_uuid();
UPDATE "public"."content_tags"
SET "new_tag_id" = gen_random_uuid();
ALTER TABLE "public"."content_tags" DROP COLUMN "tag_id";
ALTER TABLE "public"."content_tags" RENAME COLUMN "new_tag_id" TO "tag_id";

alter table "public"."contents" drop column "rss_url";

alter table "public"."contents" add column "author" text;

alter table "public"."contents" add column "company_id" uuid;

alter table "public"."contents" add column "content_signature" text;

alter table "public"."contents" add column "deleted_at" timestamp with time zone;

alter table "public"."contents" add column "description" text;

alter table "public"."contents" add column "details" jsonb;

alter table "public"."contents" add column "featured_image" text;

alter table "public"."contents" add column "hash" text;

alter table "public"."contents" add column "is_active" boolean default true;

alter table "public"."contents" add column "published_at" timestamp with time zone;

alter table "public"."contents" add column "source_id" uuid;

alter table "public"."contents" alter column "content_type" drop default;

alter table "public"."contents" alter column "content_type" set data type text using "content_type"::text;

alter table "public"."contents" alter column "created_at" set default now();

alter table "public"."contents" alter column "id" set default gen_random_uuid();

alter table "public"."contents" alter column "updated_at" set default now();

-- ✅ FEED CATEGORIES: Convert id from bigint → UUID
ALTER TABLE "public"."feed_categories" ADD COLUMN "new_id" UUID DEFAULT gen_random_uuid();

-- Create the mapping table (this was missing)
CREATE TABLE public.feed_categories_id_mapping AS 
SELECT id AS old_id, gen_random_uuid() AS new_id FROM public.feed_categories;

-- Now, update the new_id column using the mapping table
UPDATE "public"."feed_categories"
SET "new_id" = (SELECT new_id FROM public.feed_categories_id_mapping WHERE old_id = public.feed_categories.id);

-- Drop the old id column
ALTER TABLE "public"."feed_categories" DROP COLUMN "id";

-- Rename new_id to id
ALTER TABLE "public"."feed_categories" RENAME COLUMN "new_id" TO "id";

-- Set new UUID column as primary key
ALTER TABLE "public"."feed_categories" ADD PRIMARY KEY ("id");

-- ✅ FEED SOURCES: Convert id from bigint → UUID
ALTER TABLE "public"."feed_sources" ADD COLUMN "new_id" UUID DEFAULT gen_random_uuid();

CREATE TABLE public.feed_sources_id_mapping AS 
SELECT id AS old_id, gen_random_uuid() AS new_id FROM public.feed_sources;

UPDATE "public"."feed_sources"
SET "new_id" = (SELECT new_id FROM public.feed_sources_id_mapping WHERE old_id = public.feed_sources.id);

ALTER TABLE "public"."feed_sources" DROP COLUMN "id";
ALTER TABLE "public"."feed_sources" RENAME COLUMN "new_id" TO "id";
ALTER TABLE "public"."feed_sources" ADD PRIMARY KEY ("id");



-- ✅ FEEDS TABLE
ALTER TABLE "public"."feeds" ADD COLUMN "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE "public"."feeds" ALTER COLUMN "created_at" DROP NOT NULL;
ALTER TABLE "public"."feeds" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "public"."feeds" ALTER COLUMN "user_id" SET NOT NULL;

-- ✅ TAGS TABLE: Convert id from integer → UUID
ALTER TABLE "public"."tags" DROP COLUMN "body";
ALTER TABLE "public"."tags" DROP COLUMN "document_id";
ALTER TABLE "public"."tags" DROP COLUMN "locale";
ALTER TABLE "public"."tags" DROP COLUMN "published_at";
ALTER TABLE "public"."tags" ALTER COLUMN "created_at" SET DEFAULT now();

ALTER TABLE "public"."tags" ADD COLUMN "new_id" UUID DEFAULT gen_random_uuid();

-- Create mapping table for tags (fixes error)
CREATE TABLE public.tags_id_mapping AS 
SELECT id AS old_id, gen_random_uuid() AS new_id FROM public.tags;

UPDATE "public"."tags"
SET "new_id" = (SELECT new_id FROM public.tags_id_mapping WHERE old_id = public.tags.id);

ALTER TABLE "public"."tags" DROP COLUMN "id";
ALTER TABLE "public"."tags" RENAME COLUMN "new_id" TO "id";
ALTER TABLE "public"."tags" ADD PRIMARY KEY ("id");

-- ✅ SEQUENCE CLEANUP
DROP SEQUENCE IF EXISTS "public"."categories_id_seq";
DROP SEQUENCE IF EXISTS "public"."content_sources_id_seq";

CREATE UNIQUE INDEX content_interactions_pkey ON public.content_interactions USING btree (id);

CREATE UNIQUE INDEX content_sources_url_key ON public.content_sources USING btree (url);

CREATE UNIQUE INDEX content_types_pkey ON public.content_types USING btree (type_name);

CREATE UNIQUE INDEX errors_pkey ON public.errors USING btree (id);

CREATE INDEX idx_comments_content_id ON public.comments USING btree (content_id);

CREATE INDEX idx_comments_parent_id ON public.comments USING btree (parent_comment_id);

CREATE INDEX idx_comments_user_id ON public.comments USING btree (user_id);

CREATE INDEX idx_content_interactions_content_id ON public.content_interactions USING btree (content_id);

CREATE INDEX idx_content_interactions_details ON public.content_interactions USING gin (details);

CREATE INDEX idx_content_interactions_type ON public.content_interactions USING btree (interaction_type);

CREATE INDEX idx_content_interactions_user_id ON public.content_interactions USING btree (user_id);

CREATE INDEX idx_content_sources_company_id ON public.content_sources USING btree (company_id);

CREATE INDEX idx_content_sources_content_type ON public.content_sources USING btree (content_type);

CREATE INDEX idx_content_sources_details ON public.content_sources USING gin (details);

CREATE INDEX idx_content_tags_tag_id ON public.content_tags USING btree (tag_id);

CREATE INDEX idx_contents_company_id ON public.contents USING btree (company_id);

CREATE INDEX idx_contents_content_type ON public.contents USING btree (content_type);

CREATE INDEX idx_contents_details ON public.contents USING gin (details);

CREATE INDEX idx_contents_hot_score ON public.contents USING btree (hot_score);

CREATE INDEX idx_contents_is_active ON public.contents USING btree (is_active);

CREATE INDEX idx_contents_published_at ON public.contents USING btree (published_at);

CREATE INDEX idx_contents_signature ON public.contents USING btree (content_signature);

CREATE INDEX idx_contents_source_id ON public.contents USING btree (source_id);

CREATE INDEX idx_errors_created_at ON public.errors USING btree (created_at);

CREATE INDEX idx_errors_table_record ON public.errors USING btree (table_name, record_id);

alter table "public"."content_interactions" add constraint "content_interactions_pkey" PRIMARY KEY using index "content_interactions_pkey";

alter table "public"."content_types" add constraint "content_types_pkey" PRIMARY KEY using index "content_types_pkey";

alter table "public"."errors" add constraint "errors_pkey" PRIMARY KEY using index "errors_pkey";

alter table "public"."bookmarks" add constraint "bookmarks_content_id_fkey" FOREIGN KEY (content_id) REFERENCES public.contents(id) ON DELETE CASCADE not valid;

alter table "public"."bookmarks" validate constraint "bookmarks_content_id_fkey";

alter table "public"."comments" add constraint "comments_content_id_fkey" FOREIGN KEY (content_id) REFERENCES public.contents(id) ON DELETE CASCADE not valid;

alter table "public"."comments" validate constraint "comments_content_id_fkey";

alter table "public"."content_interactions" add constraint "content_interactions_content_id_fkey" FOREIGN KEY (content_id) REFERENCES public.contents(id) ON DELETE CASCADE not valid;

alter table "public"."content_interactions" validate constraint "content_interactions_content_id_fkey";

alter table "public"."content_sources" add constraint "content_sources_url_key" UNIQUE using index "content_sources_url_key";

alter table "public"."contents" add constraint "contents_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE SET NULL not valid;

alter table "public"."contents" validate constraint "contents_company_id_fkey";

alter table "public"."contents" add constraint "contents_source_id_fkey" FOREIGN KEY (source_id) REFERENCES public.content_sources(id) ON DELETE SET NULL not valid;

alter table "public"."contents" validate constraint "contents_source_id_fkey";

alter table "public"."feed_sources" add constraint "feed_sources_content_source_id_fkey" FOREIGN KEY (content_source_id) REFERENCES public.content_sources(id) ON DELETE CASCADE not valid;

alter table "public"."feed_sources" validate constraint "feed_sources_content_source_id_fkey";

alter table "public"."tags" add constraint "tags_name_key" UNIQUE using index "tags_name_key";

alter table "public"."content_sources" add constraint "content_sources_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE SET NULL not valid;

alter table "public"."content_sources" validate constraint "content_sources_company_id_fkey";

alter table "public"."content_tags" add constraint "content_tags_content_id_fkey" FOREIGN KEY (content_id) REFERENCES public.contents(id) ON DELETE CASCADE not valid;

alter table "public"."content_tags" validate constraint "content_tags_content_id_fkey";

alter table "public"."content_tags" add constraint "content_tags_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE not valid;

alter table "public"."content_tags" validate constraint "content_tags_tag_id_fkey";

alter table "public"."feed_categories" add constraint "feed_categories_feed_id_fkey" FOREIGN KEY (feed_id) REFERENCES public.feeds(id) ON DELETE CASCADE not valid;

alter table "public"."feed_categories" validate constraint "feed_categories_feed_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.generate_content_signature(title text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
  normalized_title TEXT;

BEGIN
  -- Normalize: lowercase, remove punctuation, trim spaces
  normalized_title = TRIM(BOTH ' ' FROM lower(regexp_replace(title, '[^a-zA-Z0-9 ]', '', 'g')));

-- Take first 50 characters
  RETURN SUBSTR(normalized_title, 1, 50);

END;

$function$;

CREATE OR REPLACE FUNCTION public.increment_field(table_name text, field_name text, row_id uuid)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
  current_val integer;

new_val integer;

BEGIN
  EXECUTE format('SELECT COALESCE(%I, 0) FROM %I WHERE id = $1', field_name, table_name)
  INTO current_val
  USING row_id;

new_val := current_val + 1;

EXECUTE format('UPDATE %I SET %I = $1 WHERE id = $2', table_name, field_name)
  USING new_val, row_id;

RETURN new_val;

END;

$function$;

CREATE OR REPLACE FUNCTION public.jsonb_set_field(current_data jsonb, field_path text, new_value jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF current_data IS NULL THEN
    RETURN jsonb_build_object(field_path, new_value);

ELSE
    RETURN jsonb_set(current_data, ARRAY[field_path], new_value, true);

END IF;

END;

$function$;

CREATE OR REPLACE FUNCTION public.update_content_score(content_id uuid, score_change integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE contents
  SET hot_score = hot_score + score_change
  WHERE id = content_id;

END;


$function$;

create or replace view "public"."error_frequency" as  SELECT public.error_frequency.service_name,
    error_frequency.error_type,
    error_frequency.severity,
    error_frequency.time_bucket,
    error_frequency.error_count
   FROM public.error_frequency;

create or replace view "public"."error_metrics" as  SELECT public.error_metrics.time_bucket,
    error_metrics.service_name,
    error_metrics.error_type,
    error_metrics.severity,
    error_metrics.error_count
   FROM public.error_metrics;

create or replace view "public"."error_stats" as  SELECT public.error_stats.calls,
    error_stats.mean_exec_time,
    error_stats.max_exec_time,
    error_stats.rows,
    error_stats.query,
    error_stats.queryid,
    error_stats.toplevel
   FROM public.error_stats;

create or replace view "public"."recent_errors" as  SELECT public.recent_errors.created_at,
    recent_errors.service_name,
    recent_errors.error_type,
    recent_errors.severity,
    recent_errors.message,
    recent_errors.metadata
   FROM public.recent_errors;

create or replace view "public"."slow_query_patterns" as  SELECT public.slow_query_patterns.query_id,
    slow_query_patterns.occurrence_count,
    slow_query_patterns.avg_exec_time,
    slow_query_patterns.max_exec_time,
    slow_query_patterns.first_seen,
    slow_query_patterns.last_seen
   FROM public.slow_query_patterns;

CREATE OR REPLACE FUNCTION public.update_bookmark_metrics()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- For new bookmarks, increment the bookmark_count in the content's details
        UPDATE public.contents
        SET details = jsonb_set(
            COALESCE(details, '{}'::jsonb),
            '{bookmark_count}',
            to_jsonb((COALESCE((details->>'bookmark_count')::int, 0) + 1))
        )
        WHERE id = NEW.content_id;

ELSIF TG_OP = 'DELETE' THEN
        -- For deleted bookmarks, decrement the bookmark_count
        UPDATE public.contents
        SET details = jsonb_set(
            COALESCE(details, '{}'::jsonb),
            '{bookmark_count}',
            to_jsonb(GREATEST(COALESCE((details->>'bookmark_count')::int, 0) - 1, 0))
        )
        WHERE id = OLD.content_id;

END IF;

RETURN NULL;

END;

$function$;

grant delete on table "public"."categories" to "anon";

grant insert on table "public"."categories" to "anon";

grant references on table "public"."categories" to "anon";

grant trigger on table "public"."categories" to "anon";

grant truncate on table "public"."categories" to "anon";

grant update on table "public"."categories" to "anon";

grant delete on table "public"."categories" to "authenticated";

grant insert on table "public"."categories" to "authenticated";

grant references on table "public"."categories" to "authenticated";

grant trigger on table "public"."categories" to "authenticated";

grant truncate on table "public"."categories" to "authenticated";

grant update on table "public"."categories" to "authenticated";

grant references on table "public"."categories" to "service_role";

grant trigger on table "public"."categories" to "service_role";

grant truncate on table "public"."categories" to "service_role";

grant delete on table "public"."content_interactions" to "anon";

grant insert on table "public"."content_interactions" to "anon";

grant references on table "public"."content_interactions" to "anon";

grant select on table "public"."content_interactions" to "anon";

grant trigger on table "public"."content_interactions" to "anon";

grant truncate on table "public"."content_interactions" to "anon";

grant update on table "public"."content_interactions" to "anon";

grant delete on table "public"."content_interactions" to "authenticated";

grant insert on table "public"."content_interactions" to "authenticated";

grant references on table "public"."content_interactions" to "authenticated";

grant select on table "public"."content_interactions" to "authenticated";

grant trigger on table "public"."content_interactions" to "authenticated";

grant truncate on table "public"."content_interactions" to "authenticated";

grant update on table "public"."content_interactions" to "authenticated";

grant delete on table "public"."content_interactions" to "service_role";

grant insert on table "public"."content_interactions" to "service_role";

grant references on table "public"."content_interactions" to "service_role";

grant select on table "public"."content_interactions" to "service_role";

grant trigger on table "public"."content_interactions" to "service_role";

grant truncate on table "public"."content_interactions" to "service_role";

grant update on table "public"."content_interactions" to "service_role";

grant delete on table "public"."content_types" to "anon";

grant insert on table "public"."content_types" to "anon";

grant references on table "public"."content_types" to "anon";

grant select on table "public"."content_types" to "anon";

grant trigger on table "public"."content_types" to "anon";

grant truncate on table "public"."content_types" to "anon";

grant update on table "public"."content_types" to "anon";

grant delete on table "public"."content_types" to "authenticated";

grant insert on table "public"."content_types" to "authenticated";

grant references on table "public"."content_types" to "authenticated";

grant select on table "public"."content_types" to "authenticated";

grant trigger on table "public"."content_types" to "authenticated";

grant truncate on table "public"."content_types" to "authenticated";

grant update on table "public"."content_types" to "authenticated";

grant delete on table "public"."content_types" to "service_role";

grant insert on table "public"."content_types" to "service_role";

grant references on table "public"."content_types" to "service_role";

grant select on table "public"."content_types" to "service_role";

grant trigger on table "public"."content_types" to "service_role";

grant truncate on table "public"."content_types" to "service_role";

grant update on table "public"."content_types" to "service_role";

grant delete on table "public"."errors" to "anon";

grant insert on table "public"."errors" to "anon";

grant references on table "public"."errors" to "anon";

grant select on table "public"."errors" to "anon";

grant trigger on table "public"."errors" to "anon";

grant truncate on table "public"."errors" to "anon";

grant update on table "public"."errors" to "anon";

grant delete on table "public"."errors" to "authenticated";

grant insert on table "public"."errors" to "authenticated";

grant references on table "public"."errors" to "authenticated";

grant select on table "public"."errors" to "authenticated";

grant trigger on table "public"."errors" to "authenticated";

grant truncate on table "public"."errors" to "authenticated";

grant update on table "public"."errors" to "authenticated";

grant delete on table "public"."errors" to "service_role";

grant insert on table "public"."errors" to "service_role";

grant references on table "public"."errors" to "service_role";

grant select on table "public"."errors" to "service_role";

grant trigger on table "public"."errors" to "service_role";

grant truncate on table "public"."errors" to "service_role";

grant update on table "public"."errors" to "service_role";

grant delete on table "public"."tags" to "anon";

grant insert on table "public"."tags" to "anon";

grant references on table "public"."tags" to "anon";

grant trigger on table "public"."tags" to "anon";

grant truncate on table "public"."tags" to "anon";

grant update on table "public"."tags" to "anon";

grant delete on table "public"."tags" to "authenticated";

grant insert on table "public"."tags" to "authenticated";

grant references on table "public"."tags" to "authenticated";

grant trigger on table "public"."tags" to "authenticated";

grant truncate on table "public"."tags" to "authenticated";

grant update on table "public"."tags" to "authenticated";

grant references on table "public"."tags" to "service_role";

grant trigger on table "public"."tags" to "service_role";

grant truncate on table "public"."tags" to "service_role";

CREATE TRIGGER update_bookmark_metrics_trigger AFTER INSERT OR DELETE ON public.bookmarks FOR EACH ROW EXECUTE FUNCTION public.update_bookmark_metrics();

CREATE TRIGGER update_content_types_timestamp BEFORE UPDATE ON public.content_types FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_feeds_timestamp BEFORE UPDATE ON public.feeds FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
