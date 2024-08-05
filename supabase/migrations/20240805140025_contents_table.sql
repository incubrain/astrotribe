create type "public"."priority" as enum ('very_low', 'low', 'medium', 'high', 'critical');

create sequence "public"."blacklisted_urls_id_seq";

create sequence "public"."content_sources_id_seq";

create sequence "public"."scraping_metrics_id_seq";

drop policy "delete_policy" on "public"."company_news";

drop policy "insert_policy" on "public"."company_news";

drop policy "read_all_policy" on "public"."company_news";

drop policy "update_policy" on "public"."company_news";

drop policy "delete_policy" on "public"."embedding_review";

drop policy "insert_policy" on "public"."embedding_review";

drop policy "update_policy" on "public"."embedding_review";

revoke delete on table "public"."company_news" from "anon";

revoke insert on table "public"."company_news" from "anon";

revoke references on table "public"."company_news" from "anon";

revoke select on table "public"."company_news" from "anon";

revoke trigger on table "public"."company_news" from "anon";

revoke truncate on table "public"."company_news" from "anon";

revoke update on table "public"."company_news" from "anon";

revoke delete on table "public"."company_news" from "authenticated";

revoke insert on table "public"."company_news" from "authenticated";

revoke references on table "public"."company_news" from "authenticated";

revoke select on table "public"."company_news" from "authenticated";

revoke trigger on table "public"."company_news" from "authenticated";

revoke truncate on table "public"."company_news" from "authenticated";

revoke update on table "public"."company_news" from "authenticated";

revoke delete on table "public"."company_news" from "service_role";

revoke insert on table "public"."company_news" from "service_role";

revoke references on table "public"."company_news" from "service_role";

revoke select on table "public"."company_news" from "service_role";

revoke trigger on table "public"."company_news" from "service_role";

revoke truncate on table "public"."company_news" from "service_role";

revoke update on table "public"."company_news" from "service_role";

revoke delete on table "public"."embedding_review" from "anon";

revoke insert on table "public"."embedding_review" from "anon";

revoke references on table "public"."embedding_review" from "anon";

revoke select on table "public"."embedding_review" from "anon";

revoke trigger on table "public"."embedding_review" from "anon";

revoke truncate on table "public"."embedding_review" from "anon";

revoke update on table "public"."embedding_review" from "anon";

revoke delete on table "public"."embedding_review" from "authenticated";

revoke insert on table "public"."embedding_review" from "authenticated";

revoke references on table "public"."embedding_review" from "authenticated";

revoke select on table "public"."embedding_review" from "authenticated";

revoke trigger on table "public"."embedding_review" from "authenticated";

revoke truncate on table "public"."embedding_review" from "authenticated";

revoke update on table "public"."embedding_review" from "authenticated";

revoke delete on table "public"."embedding_review" from "service_role";

revoke insert on table "public"."embedding_review" from "service_role";

revoke references on table "public"."embedding_review" from "service_role";

revoke select on table "public"."embedding_review" from "service_role";

revoke trigger on table "public"."embedding_review" from "service_role";

revoke truncate on table "public"."embedding_review" from "service_role";

revoke update on table "public"."embedding_review" from "service_role";

alter table "public"."companies" drop constraint "fk_category";

alter table "public"."company_news" drop constraint "company_news_company_id_fkey";

alter table "public"."addresses" drop constraint "public_addresses_company_id_fkey";

alter table "public"."companies" drop constraint "companies_website_url_key";

alter table "public"."company_contacts" drop constraint "fk_company";

alter table "public"."company_extras" drop constraint "fk_company";

alter table "public"."company_urls" drop constraint "fk_company";

alter table "public"."contacts" drop constraint "fk_company";

alter table "public"."research_embeddings" drop constraint "public_research_embeddings_embedding_review_id_fkey";

alter table "public"."research_embeddings" drop constraint "public_research_embeddings_research_id_fkey";

alter table "public"."company_employees" drop constraint "company_employees_pkey";

alter table "public"."company_news" drop constraint "company_news_pkey";

alter table "public"."embedding_review" drop constraint "embedding_review_pkey";

drop index if exists "public"."company_employees_pkey";

drop index if exists "public"."company_news_pkey";

drop index if exists "public"."idx_cc_company_id";

drop index if exists "public"."idx_ce_company_id";

drop index if exists "public"."idx_company_id";

drop index if exists "public"."idx_unique_company_contact";

drop index if exists "public"."companies_website_url_key";

drop index if exists "public"."embedding_review_pkey";

drop table "public"."company_news";

drop table "public"."embedding_review";

alter type "public"."content_type" rename to "content_type__old_version_to_be_dropped";

create type "public"."content_type" as enum ('news', 'events', 'jobs', 'research', 'companies');

create table "public"."blacklisted_urls" (
    "id" integer not null default nextval('public.blacklisted_urls_id_seq'::regclass),
    "url" text not null,
    "reason" text,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP
);


alter table "public"."blacklisted_urls" enable row level security;

create table "public"."content_categories" (
    "content_id" uuid not null,
    "category_id" integer not null,
    "is_primary" boolean not null
);


create table "public"."content_sources" (
    "id" bigint not null default nextval('public.content_sources_id_seq'::regclass),
    "url" text not null,
    "content_type" public.content_type not null,
    "scrape_frequency" public.scrape_frequency not null,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "refreshed_at" timestamp with time zone,
    "has_failed" boolean default false,
    "failed_count" smallint default 0,
    "priority" public.priority not null,
    "hash" bigint,
    "scraped_at" timestamp with time zone,
    "expected_count" smallint default '10'::smallint,
    "company_id" uuid
);


alter table "public"."content_sources" enable row level security;

create table "public"."content_tags" (
    "content_id" uuid not null,
    "tag_id" integer not null
);


create table "public"."contents" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "content_type" public.content_type not null,
    "title" text,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "url" text
);


create table "public"."embedding_reviews" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now(),
    "agent_review" boolean default false,
    "human_review" boolean default false,
    "notes" text
);


alter table "public"."embedding_reviews" enable row level security;

create table "public"."scraping_metrics" (
    "id" integer not null default nextval('public.scraping_metrics_id_seq'::regclass),
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "scraper_name" character varying(255) not null,
    "start_time" timestamp without time zone not null,
    "end_time" timestamp without time zone not null,
    "batch_size" smallint not null,
    "total_errors" integer not null,
    "time_per_task" numeric(10,2) not null,
    "error_rate" numeric(5,2) not null,
    "errors" jsonb not null,
    "more" jsonb
);


alter table "public"."scraping_metrics" enable row level security;

drop type "public"."content_type__old_version_to_be_dropped";

-- Step 1: Drop existing constraints
ALTER TABLE "public"."addresses" DROP CONSTRAINT IF EXISTS addresses_pkey;
ALTER TABLE "public"."addresses" DROP CONSTRAINT IF EXISTS addresses_company_id_fkey;

-- Step 2: Rename the existing company_id column
ALTER TABLE "public"."addresses" RENAME COLUMN "company_id" TO "old_company_id";

-- Step 3: Create a new company_id column with UUID type
ALTER TABLE "public"."addresses" ADD COLUMN "company_id" uuid;

-- Step 4: Drop the old column
ALTER TABLE "public"."addresses" DROP COLUMN "old_company_id";

alter table "public"."companies" drop column "website_url";

alter table "public"."companies" add column "failed_count" smallint;

alter table "public"."companies" add column "is_english" boolean;

alter table "public"."companies" add column "is_valid" boolean;

alter table "public"."companies" add column "scrape_rating" smallint;

alter table "public"."companies" add column "url" text not null;


ALTER TABLE "public"."company_contacts" DROP CONSTRAINT IF EXISTS company_contacts_company_id_fkey;
ALTER TABLE "public"."company_employees" DROP CONSTRAINT IF EXISTS company_employees_company_id_fkey;
ALTER TABLE "public"."company_extras" DROP CONSTRAINT IF EXISTS company_extras_company_id_fkey;
ALTER TABLE "public"."company_urls" DROP CONSTRAINT IF EXISTS company_urls_company_id_fkey;
ALTER TABLE "public"."contacts" DROP CONSTRAINT IF EXISTS contacts_company_id_fkey;
-- Step 1: Drop existing constraints
ALTER TABLE "public"."companies" DROP CONSTRAINT IF EXISTS companies_pkey;

-- Step 2: Rename the existing id column
ALTER TABLE "public"."companies" RENAME COLUMN "id" TO "old_id";

-- Step 3: Create a new id column with UUID type
ALTER TABLE "public"."companies" ADD COLUMN "id" uuid;

-- Step 4: Set the new id column as the primary key
ALTER TABLE "public"."companies" ADD PRIMARY KEY ("id");

-- Step 5: Drop the old column
ALTER TABLE "public"."companies" DROP COLUMN "old_id";

alter table "public"."companies" alter column "is_government" drop not null;

alter table "public"."companies" alter column "name" drop not null;

alter table "public"."companies" alter column "scrape_frequency" set default 'monthly'::public.scrape_frequency;

-- For company_contacts table
ALTER TABLE "public"."company_contacts" RENAME COLUMN "company_id" TO "old_company_id";
ALTER TABLE "public"."company_contacts" ADD COLUMN "company_id" uuid;
ALTER TABLE "public"."company_contacts" DROP COLUMN "old_company_id";

-- For company_employees table
ALTER TABLE "public"."company_employees" RENAME COLUMN "company_id" TO "old_company_id";
ALTER TABLE "public"."company_employees" ADD COLUMN "company_id" uuid;
ALTER TABLE "public"."company_employees" DROP COLUMN "old_company_id";

-- For company_extras table
ALTER TABLE "public"."company_extras" RENAME COLUMN "company_id" TO "old_company_id";
ALTER TABLE "public"."company_extras" ADD COLUMN "company_id" uuid;
ALTER TABLE "public"."company_extras" DROP COLUMN "old_company_id";

-- For company_urls table
ALTER TABLE "public"."company_urls" RENAME COLUMN "company_id" TO "old_company_id";
ALTER TABLE "public"."company_urls" ADD COLUMN "company_id" uuid;
ALTER TABLE "public"."company_urls" DROP COLUMN "old_company_id";

-- For contacts table
ALTER TABLE "public"."contacts" RENAME COLUMN "company_id" TO "old_company_id";
ALTER TABLE "public"."contacts" ADD COLUMN "company_id" uuid;
ALTER TABLE "public"."contacts" DROP COLUMN "old_company_id";


alter table "public"."company_contacts" alter column "company_id" drop not null;
alter table "public"."company_employees" alter column "company_id" drop not null;


alter table "public"."company_extras" add column "body" text;

alter table "public"."company_extras" add column "found_count" integer default 1;

alter table "public"."company_extras" add column "review" jsonb;

alter table "public"."company_extras" alter column "company_id" drop not null;


alter table "public"."company_extras" alter column "success" drop not null;

alter table "public"."company_urls" drop column "data";

alter table "public"."company_urls" drop column "level";

alter table "public"."company_urls" add column "content" text;

alter table "public"."company_urls" add column "distance" smallint;

alter table "public"."company_urls" alter column "company_id" drop not null;

alter table "public"."countries" add column "code_3" character varying;

alter table "public"."news" drop column "last_scraped";

alter table "public"."news" drop column "source";

alter table "public"."news" add column "company_id" uuid;

alter table "public"."news" add column "failed_count" smallint default '0'::smallint;

alter table "public"."news" add column "scrape_frequency" public.scrape_frequency not null default 'daily'::public.scrape_frequency;

alter table "public"."news" add column "scraped_at" timestamp with time zone default now();

alter table "public"."news" alter column "title" drop not null;

alter table "public"."research" add column "summary" text;

alter sequence "public"."blacklisted_urls_id_seq" owned by "public"."blacklisted_urls"."id";

alter sequence "public"."content_sources_id_seq" owned by "public"."content_sources"."id";

alter sequence "public"."scraping_metrics_id_seq" owned by "public"."scraping_metrics"."id";

drop sequence if exists "public"."companies_id_seq";
drop sequence if exists "public"."scrapers_pages_id_seq";

CREATE UNIQUE INDEX blacklisted_urls_pkey ON public.blacklisted_urls USING btree (id);

CREATE UNIQUE INDEX blacklisted_urls_url_key ON public.blacklisted_urls USING btree (url);

CREATE UNIQUE INDEX companies_id_key1 ON public.companies USING btree (id);

CREATE UNIQUE INDEX company_urls_url_key ON public.company_urls USING btree (url);

CREATE UNIQUE INDEX content_categories_pkey ON public.content_categories USING btree (content_id, category_id);

CREATE UNIQUE INDEX content_sources_pkey1 ON public.content_sources USING btree (id);

CREATE UNIQUE INDEX content_sources_url_key1 ON public.content_sources USING btree (url);

CREATE UNIQUE INDEX content_tags_pkey ON public.content_tags USING btree (content_id, tag_id);

CREATE UNIQUE INDEX contents_pkey ON public.contents USING btree (id);

CREATE INDEX idx_blacklisted_urls_url ON public.blacklisted_urls USING btree (url);

CREATE INDEX idx_content_categories ON public.content_categories USING btree (category_id, is_primary);

CREATE INDEX idx_content_sources_url ON public.content_sources USING btree (url);

CREATE INDEX idx_content_tags ON public.content_tags USING btree (tag_id);

CREATE INDEX idx_content_type ON public.contents USING btree (content_type);

CREATE INDEX idx_scraping_metrics_scraper_name ON public.scraping_metrics USING btree (scraper_name);

CREATE INDEX idx_scraping_metrics_start_time ON public.scraping_metrics USING btree (start_time);

CREATE UNIQUE INDEX scraping_metrics_pkey ON public.scraping_metrics USING btree (id);

CREATE UNIQUE INDEX companies_website_url_key ON public.companies USING btree (url);

CREATE UNIQUE INDEX embedding_review_pkey ON public.embedding_reviews USING btree (id);

alter table "public"."blacklisted_urls" add constraint "blacklisted_urls_pkey" PRIMARY KEY using index "blacklisted_urls_pkey";

alter table "public"."content_categories" add constraint "content_categories_pkey" PRIMARY KEY using index "content_categories_pkey";

alter table "public"."content_sources" add constraint "content_sources_pkey1" PRIMARY KEY using index "content_sources_pkey1";

alter table "public"."content_tags" add constraint "content_tags_pkey" PRIMARY KEY using index "content_tags_pkey";

alter table "public"."contents" add constraint "contents_pkey" PRIMARY KEY using index "contents_pkey";

alter table "public"."embedding_reviews" add constraint "embedding_review_pkey" PRIMARY KEY using index "embedding_review_pkey";

alter table "public"."scraping_metrics" add constraint "scraping_metrics_pkey" PRIMARY KEY using index "scraping_metrics_pkey";

alter table "public"."blacklisted_urls" add constraint "blacklisted_urls_url_key" UNIQUE using index "blacklisted_urls_url_key";

alter table "public"."companies" add constraint "companies_content_fk" FOREIGN KEY (id) REFERENCES public.contents(id) not valid;

alter table "public"."companies" validate constraint "companies_content_fk";

alter table "public"."companies" add constraint "companies_id_key1" UNIQUE using index "companies_id_key1";

alter table "public"."companies" add constraint "public_companies_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."companies" validate constraint "public_companies_category_id_fkey";

alter table "public"."company_urls" add constraint "company_urls_url_key" UNIQUE using index "company_urls_url_key";

alter table "public"."content_categories" add constraint "content_categories_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.categories(id) not valid;

alter table "public"."content_categories" validate constraint "content_categories_category_id_fkey";

alter table "public"."content_categories" add constraint "content_categories_content_id_fkey" FOREIGN KEY (content_id) REFERENCES public.contents(id) not valid;

alter table "public"."content_categories" validate constraint "content_categories_content_id_fkey";

alter table "public"."content_sources" add constraint "content_sources_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id) not valid;

alter table "public"."content_sources" validate constraint "content_sources_company_id_fkey";

alter table "public"."content_sources" add constraint "content_sources_url_key1" UNIQUE using index "content_sources_url_key1";

alter table "public"."content_tags" add constraint "content_tags_content_id_fkey" FOREIGN KEY (content_id) REFERENCES public.contents(id) not valid;

alter table "public"."content_tags" validate constraint "content_tags_content_id_fkey";

alter table "public"."content_tags" add constraint "content_tags_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES public.tags(id) not valid;

alter table "public"."content_tags" validate constraint "content_tags_tag_id_fkey";

alter table "public"."news" add constraint "news_content_fk" FOREIGN KEY (id) REFERENCES public.contents(id) not valid;

alter table "public"."news" validate constraint "news_content_fk";

alter table "public"."news" add constraint "public_news_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id) not valid;

alter table "public"."news" validate constraint "public_news_company_id_fkey";

alter table "public"."research" add constraint "research_content_fk" FOREIGN KEY (id) REFERENCES public.contents(id) not valid;

alter table "public"."research" validate constraint "research_content_fk";

alter table "public"."addresses" add constraint "public_addresses_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id) not valid;

alter table "public"."addresses" validate constraint "public_addresses_company_id_fkey";

alter table "public"."companies" add constraint "companies_website_url_key" UNIQUE using index "companies_website_url_key";

alter table "public"."company_contacts" add constraint "fk_company" FOREIGN KEY (company_id) REFERENCES public.companies(id) not valid;

alter table "public"."company_contacts" validate constraint "fk_company";

alter table "public"."company_extras" add constraint "fk_company" FOREIGN KEY (company_id) REFERENCES public.companies(id) not valid;

alter table "public"."company_extras" validate constraint "fk_company";

alter table "public"."company_urls" add constraint "fk_company" FOREIGN KEY (company_id) REFERENCES public.companies(id) not valid;

alter table "public"."company_urls" validate constraint "fk_company";

alter table "public"."contacts" add constraint "fk_company" FOREIGN KEY (company_id) REFERENCES public.companies(id) not valid;

alter table "public"."contacts" validate constraint "fk_company";

alter table "public"."research_embeddings" add constraint "public_research_embeddings_embedding_review_id_fkey" FOREIGN KEY (embedding_review_id) REFERENCES public.embedding_reviews(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."research_embeddings" validate constraint "public_research_embeddings_embedding_review_id_fkey";

alter table "public"."research_embeddings" add constraint "public_research_embeddings_research_id_fkey" FOREIGN KEY (research_id) REFERENCES public.research(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."research_embeddings" validate constraint "public_research_embeddings_research_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.extract_base_url(p_full_url text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_base_url TEXT;
BEGIN
    SELECT INTO v_base_url
        regexp_replace(p_full_url, '(https?://[^/]+).*', '\1');
    RETURN v_base_url;
END;
$function$
;

grant delete on table "public"."blacklisted_urls" to "anon";

grant insert on table "public"."blacklisted_urls" to "anon";

grant references on table "public"."blacklisted_urls" to "anon";

grant select on table "public"."blacklisted_urls" to "anon";

grant trigger on table "public"."blacklisted_urls" to "anon";

grant truncate on table "public"."blacklisted_urls" to "anon";

grant update on table "public"."blacklisted_urls" to "anon";

grant delete on table "public"."blacklisted_urls" to "authenticated";

grant insert on table "public"."blacklisted_urls" to "authenticated";

grant references on table "public"."blacklisted_urls" to "authenticated";

grant select on table "public"."blacklisted_urls" to "authenticated";

grant trigger on table "public"."blacklisted_urls" to "authenticated";

grant truncate on table "public"."blacklisted_urls" to "authenticated";

grant update on table "public"."blacklisted_urls" to "authenticated";

grant delete on table "public"."blacklisted_urls" to "service_role";

grant insert on table "public"."blacklisted_urls" to "service_role";

grant references on table "public"."blacklisted_urls" to "service_role";

grant select on table "public"."blacklisted_urls" to "service_role";

grant trigger on table "public"."blacklisted_urls" to "service_role";

grant truncate on table "public"."blacklisted_urls" to "service_role";

grant update on table "public"."blacklisted_urls" to "service_role";

grant delete on table "public"."content_categories" to "anon";

grant insert on table "public"."content_categories" to "anon";

grant references on table "public"."content_categories" to "anon";

grant select on table "public"."content_categories" to "anon";

grant trigger on table "public"."content_categories" to "anon";

grant truncate on table "public"."content_categories" to "anon";

grant update on table "public"."content_categories" to "anon";

grant delete on table "public"."content_categories" to "authenticated";

grant insert on table "public"."content_categories" to "authenticated";

grant references on table "public"."content_categories" to "authenticated";

grant select on table "public"."content_categories" to "authenticated";

grant trigger on table "public"."content_categories" to "authenticated";

grant truncate on table "public"."content_categories" to "authenticated";

grant update on table "public"."content_categories" to "authenticated";

grant delete on table "public"."content_categories" to "service_role";

grant insert on table "public"."content_categories" to "service_role";

grant references on table "public"."content_categories" to "service_role";

grant select on table "public"."content_categories" to "service_role";

grant trigger on table "public"."content_categories" to "service_role";

grant truncate on table "public"."content_categories" to "service_role";

grant update on table "public"."content_categories" to "service_role";

grant delete on table "public"."content_sources" to "anon";

grant insert on table "public"."content_sources" to "anon";

grant references on table "public"."content_sources" to "anon";

grant select on table "public"."content_sources" to "anon";

grant trigger on table "public"."content_sources" to "anon";

grant truncate on table "public"."content_sources" to "anon";

grant update on table "public"."content_sources" to "anon";

grant delete on table "public"."content_sources" to "authenticated";

grant insert on table "public"."content_sources" to "authenticated";

grant references on table "public"."content_sources" to "authenticated";

grant select on table "public"."content_sources" to "authenticated";

grant trigger on table "public"."content_sources" to "authenticated";

grant truncate on table "public"."content_sources" to "authenticated";

grant update on table "public"."content_sources" to "authenticated";

grant delete on table "public"."content_sources" to "service_role";

grant insert on table "public"."content_sources" to "service_role";

grant references on table "public"."content_sources" to "service_role";

grant select on table "public"."content_sources" to "service_role";

grant trigger on table "public"."content_sources" to "service_role";

grant truncate on table "public"."content_sources" to "service_role";

grant update on table "public"."content_sources" to "service_role";

grant delete on table "public"."content_tags" to "anon";

grant insert on table "public"."content_tags" to "anon";

grant references on table "public"."content_tags" to "anon";

grant select on table "public"."content_tags" to "anon";

grant trigger on table "public"."content_tags" to "anon";

grant truncate on table "public"."content_tags" to "anon";

grant update on table "public"."content_tags" to "anon";

grant delete on table "public"."content_tags" to "authenticated";

grant insert on table "public"."content_tags" to "authenticated";

grant references on table "public"."content_tags" to "authenticated";

grant select on table "public"."content_tags" to "authenticated";

grant trigger on table "public"."content_tags" to "authenticated";

grant truncate on table "public"."content_tags" to "authenticated";

grant update on table "public"."content_tags" to "authenticated";

grant delete on table "public"."content_tags" to "service_role";

grant insert on table "public"."content_tags" to "service_role";

grant references on table "public"."content_tags" to "service_role";

grant select on table "public"."content_tags" to "service_role";

grant trigger on table "public"."content_tags" to "service_role";

grant truncate on table "public"."content_tags" to "service_role";

grant update on table "public"."content_tags" to "service_role";

grant delete on table "public"."contents" to "anon";

grant insert on table "public"."contents" to "anon";

grant references on table "public"."contents" to "anon";

grant select on table "public"."contents" to "anon";

grant trigger on table "public"."contents" to "anon";

grant truncate on table "public"."contents" to "anon";

grant update on table "public"."contents" to "anon";

grant delete on table "public"."contents" to "authenticated";

grant insert on table "public"."contents" to "authenticated";

grant references on table "public"."contents" to "authenticated";

grant select on table "public"."contents" to "authenticated";

grant trigger on table "public"."contents" to "authenticated";

grant truncate on table "public"."contents" to "authenticated";

grant update on table "public"."contents" to "authenticated";

grant delete on table "public"."contents" to "service_role";

grant insert on table "public"."contents" to "service_role";

grant references on table "public"."contents" to "service_role";

grant select on table "public"."contents" to "service_role";

grant trigger on table "public"."contents" to "service_role";

grant truncate on table "public"."contents" to "service_role";

grant update on table "public"."contents" to "service_role";

grant delete on table "public"."embedding_reviews" to "anon";

grant insert on table "public"."embedding_reviews" to "anon";

grant references on table "public"."embedding_reviews" to "anon";

grant select on table "public"."embedding_reviews" to "anon";

grant trigger on table "public"."embedding_reviews" to "anon";

grant truncate on table "public"."embedding_reviews" to "anon";

grant update on table "public"."embedding_reviews" to "anon";

grant delete on table "public"."embedding_reviews" to "authenticated";

grant insert on table "public"."embedding_reviews" to "authenticated";

grant references on table "public"."embedding_reviews" to "authenticated";

grant select on table "public"."embedding_reviews" to "authenticated";

grant trigger on table "public"."embedding_reviews" to "authenticated";

grant truncate on table "public"."embedding_reviews" to "authenticated";

grant update on table "public"."embedding_reviews" to "authenticated";

grant delete on table "public"."embedding_reviews" to "service_role";

grant insert on table "public"."embedding_reviews" to "service_role";

grant references on table "public"."embedding_reviews" to "service_role";

grant select on table "public"."embedding_reviews" to "service_role";

grant trigger on table "public"."embedding_reviews" to "service_role";

grant truncate on table "public"."embedding_reviews" to "service_role";

grant update on table "public"."embedding_reviews" to "service_role";

grant delete on table "public"."scraping_metrics" to "anon";

grant insert on table "public"."scraping_metrics" to "anon";

grant references on table "public"."scraping_metrics" to "anon";

grant select on table "public"."scraping_metrics" to "anon";

grant trigger on table "public"."scraping_metrics" to "anon";

grant truncate on table "public"."scraping_metrics" to "anon";

grant update on table "public"."scraping_metrics" to "anon";

grant delete on table "public"."scraping_metrics" to "authenticated";

grant insert on table "public"."scraping_metrics" to "authenticated";

grant references on table "public"."scraping_metrics" to "authenticated";

grant select on table "public"."scraping_metrics" to "authenticated";

grant trigger on table "public"."scraping_metrics" to "authenticated";

grant truncate on table "public"."scraping_metrics" to "authenticated";

grant update on table "public"."scraping_metrics" to "authenticated";

grant delete on table "public"."scraping_metrics" to "service_role";

grant insert on table "public"."scraping_metrics" to "service_role";

grant references on table "public"."scraping_metrics" to "service_role";

grant select on table "public"."scraping_metrics" to "service_role";

grant trigger on table "public"."scraping_metrics" to "service_role";

grant truncate on table "public"."scraping_metrics" to "service_role";

grant update on table "public"."scraping_metrics" to "service_role";

create policy "delete_policy"
on "public"."embedding_reviews"
as permissive
for delete
to public
using (public.authorize('public.embedding_review.delete'::text));


create policy "insert_policy"
on "public"."embedding_reviews"
as permissive
for insert
to public
with check (public.authorize('public.embedding_review.insert'::text));


create policy "update_policy"
on "public"."embedding_reviews"
as permissive
for update
to public
using (public.authorize('public.embedding_review.update'::text));


create policy "Enable read access for all users"
on "public"."scraping_metrics"
as permissive
for select
to public
using (true);



