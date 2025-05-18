-- OLD MIGRATION

revoke delete on table "public"."domain_url_processing_history" from "anon";

revoke insert on table "public"."domain_url_processing_history" from "anon";

revoke references on table "public"."domain_url_processing_history" from "anon";

revoke select on table "public"."domain_url_processing_history" from "anon";

revoke trigger on table "public"."domain_url_processing_history" from "anon";

revoke truncate on table "public"."domain_url_processing_history" from "anon";

revoke update on table "public"."domain_url_processing_history" from "anon";

revoke delete on table "public"."domain_url_processing_history" from "authenticated";

revoke insert on table "public"."domain_url_processing_history" from "authenticated";

revoke references on table "public"."domain_url_processing_history" from "authenticated";

revoke select on table "public"."domain_url_processing_history" from "authenticated";

revoke trigger on table "public"."domain_url_processing_history" from "authenticated";

revoke truncate on table "public"."domain_url_processing_history" from "authenticated";

revoke update on table "public"."domain_url_processing_history" from "authenticated";

revoke delete on table "public"."domain_url_processing_history" from "service_role";

revoke insert on table "public"."domain_url_processing_history" from "service_role";

revoke references on table "public"."domain_url_processing_history" from "service_role";

revoke select on table "public"."domain_url_processing_history" from "service_role";

revoke trigger on table "public"."domain_url_processing_history" from "service_role";

revoke truncate on table "public"."domain_url_processing_history" from "service_role";

revoke update on table "public"."domain_url_processing_history" from "service_role";

alter table "public"."contents" drop constraint "contents_url_key";

alter table "public"."domain_relationships" drop constraint "domain_relationships_source_domain_root_id_fkey";

alter table "public"."domain_relationships" drop constraint "domain_relationships_source_url_id_target_url_id_key";

alter table "public"."domain_relationships" drop constraint "domain_relationships_target_domain_root_id_fkey";

alter table "public"."domain_url_processing_history" drop constraint "domain_url_processing_history_url_id_fkey";

alter table "public"."opportunities" drop constraint "opportunities_contents_id_fkey";

alter table "public"."opportunities" drop constraint "opportunities_contents_id_key";

alter table "public"."content_sources" drop constraint "content_sources_parser_type_check";

alter table "public"."domain_relationships" drop constraint "domain_relationships_source_url_id_fkey";

alter table "public"."domain_relationships" drop constraint "domain_relationships_target_url_id_fkey";

drop view if exists "public"."job_filters";

alter table "public"."domain_url_processing_history" drop constraint "domain_url_processing_history_pkey";

drop index if exists "public"."contents_url_key";

drop index if exists "public"."domain_relationships_source_url_id_target_url_id_key";

drop index if exists "public"."domain_url_processing_history_pkey";

drop index if exists "public"."idx_companies_content_status";
drop index if exists "public"."opportunities_content_status_idx";

drop index if exists "public"."idx_contents_details";

drop index if exists "public"."idx_domain_relationships_source_company";

drop index if exists "public"."idx_domain_url_processing_history_classification";

drop index if exists "public"."idx_domain_url_processing_history_crawl_id";

drop index if exists "public"."idx_domain_url_processing_history_url_id";

drop index if exists "public"."idx_dr_created_at";

drop index if exists "public"."idx_dr_source_domain";

drop index if exists "public"."idx_dr_source_url";

drop index if exists "public"."idx_dr_target_domain";

drop index if exists "public"."idx_dr_target_url";


drop index if exists "public"."opportunities_contents_id_key";

drop table "public"."domain_url_processing_history";



create table "public"."content_categories" (
    "content_id" uuid not null,
    "category_id" uuid not null,
    "role" text not null,
    "created_at" timestamp with time zone default now()
);

create table "public"."crawl_stats" (
    "id" uuid not null default gen_random_uuid(),
    "company_id" uuid not null,
    "seed_url" text not null,
    "domain" text not null,
    "start_time" timestamp with time zone not null,
    "end_time" timestamp with time zone,
    "duration_ms" bigint not null,
    "total_urls" integer not null default 0,
    "processed_urls" integer not null default 0,
    "failed_urls" integer not null default 0,
    "skipped_urls" integer not null default 0,
    "pending_urls" integer not null default 0,
    "batches_processed" integer not null default 0,
    "fetches_completed" integer not null default 0,
    "storage_time" bigint not null default 0,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);

create table "public"."domain_assets" (
    "id" uuid not null default gen_random_uuid(),
    "domain_root_id" uuid,
    "company_id" uuid,
    "url" text not null,
    "asset_type" text,
    "asset_url" text not null,
    "usage" text,
    "crawl_id" uuid,
    "captured_at" timestamp with time zone default now()
);

create table "public"."domain_contacts" (
    "id" uuid not null default gen_random_uuid(),
    "domain_root_id" uuid,
    "company_id" uuid,
    "url" text not null,
    "contact_type" text,
    "value" text not null,
    "confidence" numeric default 0.8,
    "source_plugin" text,
    "crawl_id" uuid,
    "captured_at" timestamp with time zone default now()
);

create table "public"."domain_content" (
    "id" uuid not null default gen_random_uuid(),
    "domain_root_id" uuid not null,
    "company_id" uuid not null,
    "url" text not null,
    "content_type" text,
    "confidence" numeric default 0.8,
    "source_plugin" text,
    "crawl_id" uuid not null,
    "captured_at" timestamp with time zone default now()
);

create table "public"."domain_content_sources" (
    "id" uuid not null default gen_random_uuid(),
    "domain_root_id" uuid,
    "company_id" uuid,
    "url" text not null,
    "proposed_type" text,
    "confidence" numeric default 0.7,
    "reason" text,
    "captured_at" timestamp with time zone default now(),
    "crawl_id" uuid
);

create table "public"."domain_documents" (
    "id" uuid not null default gen_random_uuid(),
    "domain_root_id" uuid,
    "company_id" uuid,
    "url" text not null,
    "file_type" text,
    "file_url" text not null,
    "content_hash" text,
    "crawl_id" uuid,
    "captured_at" timestamp with time zone default now()
);

create table "public"."news" (
    "id" uuid not null default gen_random_uuid(),
    "content_id" uuid not null,
    "organization_id" uuid,
    "source_id" uuid,
    "title" text not null,
    "description" text,
    "url" text not null,
    "author_name_fallback" text,
    "published_at" timestamp with time zone,
    "featured_image" text,
    "news_type" text,
    "is_featured" boolean default false,
    "is_active" boolean default true,
    "primary_category_id" uuid,
    "content_text" text,
    "title_vector" tsvector,
    "language_code" text,
    "change_hash" text,
    "graph_migrated_at" timestamp with time zone,
    "removed_at" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);

create table "public"."research" (
    "id" uuid not null default gen_random_uuid(),
    "content_id" uuid not null,
    "organization_id" uuid,
    "source_id" uuid,
    "title" text not null,
    "abstract" text,
    "url" text not null,
    "doi" text,
    "arxiv_id" text,
    "journal_name" text,
    "journal_ref" text,
    "published_at" timestamp with time zone,
    "primary_category_id" uuid,
    "featured_image" text,
    "content_text" text,
    "is_open_access" boolean default false,
    "is_peer_reviewed" boolean default true,
    "is_active" boolean default true,
    "is_featured" boolean default false,
    "title_vector" tsvector,
    "language_code" text,
    "change_hash" text,
    "graph_migrated_at" timestamp with time zone,
    "removed_at" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);

-- content_status migration start
-- Step 1: Drop default constraints on all tables using this enum
ALTER TABLE "public"."companies" ALTER COLUMN "content_status" DROP DEFAULT;
ALTER TABLE "public"."opportunities" ALTER COLUMN "content_status" DROP DEFAULT;
ALTER TABLE "public"."newsletters" ALTER COLUMN "content_status" DROP DEFAULT;

-- Step 2: Create the new enum type
ALTER TYPE "public"."content_status" RENAME TO "content_status__old_version_to_be_dropped";
CREATE TYPE "public"."content_status" AS ENUM (
  'pending_crawl', 'scraped', 'processing', 'indexing', 
  'pending_review', 'irrelevant', 'retracted', 'draft', 
  'scheduled', 'published', 'archived', 'failed', 'flagged', 'unpublished'
);

-- Step 3: Update each table to use the new enum type
ALTER TABLE "public"."companies" ALTER COLUMN content_status TYPE "public"."content_status" 
  USING content_status::text::"public"."content_status";
ALTER TABLE "public"."opportunities" ALTER COLUMN content_status TYPE "public"."content_status" 
  USING content_status::text::"public"."content_status";
ALTER TABLE "public"."newsletters" ALTER COLUMN content_status TYPE "public"."content_status" 
  USING content_status::text::"public"."content_status";

-- Step 4: Now it's safe to drop the old type
DROP TYPE "public"."content_status__old_version_to_be_dropped";

-- Step 5: Additional column modifications as needed
ALTER TABLE "public"."companies" ALTER COLUMN "content_status" DROP NOT NULL;
-- Add similar modifications for other tables if needed

-- Step 6: Add the new column to contents table (from your original migration)
ALTER TABLE "public"."contents" ADD COLUMN "content_status" public.content_status DEFAULT 'scraped'::public.content_status;

-- content_status migration end

alter table "public"."companies" drop column "keywords";


alter table "public"."contents" drop column "author";

alter table "public"."contents" drop column "details";

alter table "public"."contents" drop column "featured_image";

alter table "public"."contents" drop column "is_active";

alter table "public"."contents" drop column "summary";

alter table "public"."contents" add column "uri" text;

alter table "public"."domain_relationships" drop column "source_domain_root_id";

alter table "public"."domain_relationships" drop column "target_domain_root_id";

alter table "public"."domain_relationships" add column "target_company_id" uuid not null;

alter table "public"."domain_relationships" alter column "source_company_id" set not null;

alter table "public"."domain_relationships" alter column "source_url_id" drop not null;

alter table "public"."domain_relationships" alter column "target_url_id" drop not null;

alter table "public"."domain_roots" drop column "is_crawled";

alter table "public"."domain_roots" add column "has_crawled" boolean default false;

alter table "public"."opportunities" drop column "contents_id";

alter table "public"."opportunities" add column "content_id" uuid not null;

alter table "public"."opportunities" add column "featured" boolean not null default false;

CREATE INDEX content_categories_category_id_idx ON public.content_categories USING btree (category_id);

CREATE UNIQUE INDEX content_categories_pkey ON public.content_categories USING btree (content_id, category_id, role);

CREATE INDEX content_categories_role_idx ON public.content_categories USING btree (role);

CREATE UNIQUE INDEX contents_url_uri_unique ON public.contents USING btree (url, uri);

CREATE UNIQUE INDEX crawl_stats_pkey ON public.crawl_stats USING btree (id);

CREATE UNIQUE INDEX domain_assets_pkey ON public.domain_assets USING btree (id);

CREATE UNIQUE INDEX domain_contacts_pkey ON public.domain_contacts USING btree (id);

CREATE UNIQUE INDEX domain_content_sources_pkey ON public.domain_content_sources USING btree (id);

CREATE UNIQUE INDEX domain_documents_pkey ON public.domain_documents USING btree (id);

CREATE UNIQUE INDEX domain_relationships_source_company_id_target_company_id_key ON public.domain_relationships USING btree (source_company_id, target_company_id);

CREATE INDEX idx_crawl_stats_company_id ON public.crawl_stats USING btree (company_id);

CREATE INDEX idx_crawl_stats_start_time ON public.crawl_stats USING btree (start_time);

CREATE INDEX news_content_id_idx ON public.news USING btree (content_id);

CREATE INDEX news_news_type_idx ON public.news USING btree (news_type);

CREATE INDEX news_organization_id_idx ON public.news USING btree (organization_id);

CREATE UNIQUE INDEX news_pkey ON public.news USING btree (id);

CREATE INDEX news_primary_category_id_idx ON public.news USING btree (primary_category_id);

CREATE INDEX news_published_at_idx ON public.news USING btree (published_at);

CREATE INDEX news_source_id_idx ON public.news USING btree (source_id);

CREATE INDEX news_title_vector_idx ON public.news USING gin (title_vector);

CREATE INDEX research_arxiv_id_idx ON public.research USING btree (arxiv_id);

CREATE INDEX research_content_id_idx ON public.research USING btree (content_id);

CREATE INDEX research_doi_idx ON public.research USING btree (doi);

CREATE INDEX research_organization_id_idx ON public.research USING btree (organization_id);

CREATE UNIQUE INDEX research_pkey ON public.research USING btree (id);

CREATE INDEX research_primary_category_id_idx ON public.research USING btree (primary_category_id);

CREATE INDEX research_published_at_idx ON public.research USING btree (published_at);

CREATE INDEX research_source_id_idx ON public.research USING btree (source_id);

CREATE INDEX research_title_vector_idx ON public.research USING gin (title_vector);

alter table "public"."content_categories" add constraint "content_categories_pkey" PRIMARY KEY using index "content_categories_pkey";

alter table "public"."crawl_stats" add constraint "crawl_stats_pkey" PRIMARY KEY using index "crawl_stats_pkey";

alter table "public"."domain_assets" add constraint "domain_assets_pkey" PRIMARY KEY using index "domain_assets_pkey";

alter table "public"."domain_contacts" add constraint "domain_contacts_pkey" PRIMARY KEY using index "domain_contacts_pkey";

alter table "public"."domain_content_sources" add constraint "domain_content_sources_pkey" PRIMARY KEY using index "domain_content_sources_pkey";

alter table "public"."domain_documents" add constraint "domain_documents_pkey" PRIMARY KEY using index "domain_documents_pkey";

alter table "public"."news" add constraint "news_pkey" PRIMARY KEY using index "news_pkey";

alter table "public"."research" add constraint "research_pkey" PRIMARY KEY using index "research_pkey";

alter table "public"."content_categories" add constraint "content_categories_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE not valid;

alter table "public"."content_categories" validate constraint "content_categories_category_id_fkey";

alter table "public"."content_categories" add constraint "content_categories_content_id_fkey" FOREIGN KEY (content_id) REFERENCES public.contents(id) ON DELETE CASCADE not valid;

alter table "public"."content_categories" validate constraint "content_categories_content_id_fkey";

alter table "public"."content_categories" add constraint "content_categories_role_check" CHECK ((role = ANY (ARRAY['primary'::text, 'secondary'::text, 'inferred'::text, 'editorial'::text, 'sponsored'::text, 'archival'::text, 'suppressed'::text, 'test'::text]))) not valid;

alter table "public"."content_categories" validate constraint "content_categories_role_check";

alter table "public"."contents" add constraint "contents_url_uri_unique" UNIQUE using index "contents_url_uri_unique";

alter table "public"."crawl_stats" add constraint "crawl_stats_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id) not valid;

alter table "public"."crawl_stats" validate constraint "crawl_stats_company_id_fkey";

alter table "public"."domain_assets" add constraint "domain_assets_asset_type_check" CHECK ((asset_type = ANY (ARRAY['image'::text, 'video'::text, 'icon'::text, 'embed'::text]))) not valid;

alter table "public"."domain_assets" validate constraint "domain_assets_asset_type_check";

alter table "public"."domain_assets" add constraint "domain_assets_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id) not valid;

alter table "public"."domain_assets" validate constraint "domain_assets_company_id_fkey";

alter table "public"."domain_assets" add constraint "domain_assets_domain_root_id_fkey" FOREIGN KEY (domain_root_id) REFERENCES public.domain_roots(id) not valid;

alter table "public"."domain_assets" validate constraint "domain_assets_domain_root_id_fkey";

alter table "public"."domain_contacts" add constraint "domain_contacts_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE not valid;

alter table "public"."domain_contacts" validate constraint "domain_contacts_company_id_fkey";

alter table "public"."domain_contacts" add constraint "domain_contacts_contact_type_check" CHECK ((contact_type = ANY (ARRAY['email'::text, 'phone'::text, 'social'::text, 'messenger'::text, 'unknown'::text]))) not valid;

alter table "public"."domain_contacts" validate constraint "domain_contacts_contact_type_check";

alter table "public"."domain_contacts" add constraint "domain_contacts_domain_root_id_fkey" FOREIGN KEY (domain_root_id) REFERENCES public.domain_roots(id) ON DELETE CASCADE not valid;

alter table "public"."domain_contacts" validate constraint "domain_contacts_domain_root_id_fkey";

alter table "public"."domain_content" add constraint "domain_content_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id) not valid;

alter table "public"."domain_content" validate constraint "domain_content_company_id_fkey";

alter table "public"."domain_content" add constraint "domain_content_content_type_check" CHECK ((content_type = ANY (ARRAY['opportunities'::text, 'products'::text, 'news'::text, 'events'::text, 'research'::text, 'unknown'::text]))) not valid;

alter table "public"."domain_content" validate constraint "domain_content_content_type_check";

alter table "public"."domain_content" add constraint "domain_content_domain_root_id_fkey" FOREIGN KEY (domain_root_id) REFERENCES public.domain_roots(id) not valid;

alter table "public"."domain_content" validate constraint "domain_content_domain_root_id_fkey";

alter table "public"."domain_content_sources" add constraint "domain_content_sources_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE not valid;

alter table "public"."domain_content_sources" validate constraint "domain_content_sources_company_id_fkey";

alter table "public"."domain_content_sources" add constraint "domain_content_sources_confidence_check" CHECK (((confidence >= (0)::numeric) AND (confidence <= (1)::numeric))) not valid;

alter table "public"."domain_content_sources" validate constraint "domain_content_sources_confidence_check";

alter table "public"."domain_content_sources" add constraint "domain_content_sources_domain_root_id_fkey" FOREIGN KEY (domain_root_id) REFERENCES public.domain_roots(id) ON DELETE CASCADE not valid;

alter table "public"."domain_content_sources" validate constraint "domain_content_sources_domain_root_id_fkey";

alter table "public"."domain_content_sources" add constraint "domain_content_sources_proposed_type_check" CHECK ((proposed_type = ANY (ARRAY['opportunities'::text, 'products'::text, 'news'::text, 'events'::text, 'research'::text, 'unknown'::text]))) not valid;

alter table "public"."domain_content_sources" validate constraint "domain_content_sources_proposed_type_check";

alter table "public"."domain_documents" add constraint "domain_documents_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE not valid;

alter table "public"."domain_documents" validate constraint "domain_documents_company_id_fkey";

alter table "public"."domain_documents" add constraint "domain_documents_domain_root_id_fkey" FOREIGN KEY (domain_root_id) REFERENCES public.domain_roots(id) ON DELETE CASCADE not valid;

alter table "public"."domain_documents" validate constraint "domain_documents_domain_root_id_fkey";

alter table "public"."domain_documents" add constraint "domain_documents_file_type_check" CHECK ((file_type = ANY (ARRAY['pdf'::text, 'doc'::text, 'ppt'::text, 'xls'::text, 'other'::text]))) not valid;

alter table "public"."domain_documents" validate constraint "domain_documents_file_type_check";

alter table "public"."domain_relationships" add constraint "domain_relationships_source_company_id_target_company_id_key" UNIQUE using index "domain_relationships_source_company_id_target_company_id_key";

alter table "public"."domain_relationships" add constraint "domain_relationships_target_company_id_fkey" FOREIGN KEY (target_company_id) REFERENCES public.companies(id) ON DELETE CASCADE not valid;

alter table "public"."domain_relationships" validate constraint "domain_relationships_target_company_id_fkey";

alter table "public"."news" add constraint "news_content_id_fkey" FOREIGN KEY (content_id) REFERENCES public.contents(id) ON DELETE CASCADE not valid;

alter table "public"."news" validate constraint "news_content_id_fkey";

alter table "public"."news" add constraint "news_language_code_check" CHECK ((char_length(language_code) = 2)) not valid;

alter table "public"."news" validate constraint "news_language_code_check";

alter table "public"."news" add constraint "news_news_type_check" CHECK ((news_type = ANY (ARRAY['article'::text, 'podcast'::text, 'video'::text, 'press_release'::text]))) not valid;

alter table "public"."news" validate constraint "news_news_type_check";

alter table "public"."news" add constraint "news_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES public.companies(id) not valid;

alter table "public"."news" validate constraint "news_organization_id_fkey";

alter table "public"."news" add constraint "news_primary_category_id_fkey" FOREIGN KEY (primary_category_id) REFERENCES public.categories(id) not valid;

alter table "public"."news" validate constraint "news_primary_category_id_fkey";

alter table "public"."news" add constraint "news_source_id_fkey" FOREIGN KEY (source_id) REFERENCES public.content_sources(id) not valid;

alter table "public"."news" validate constraint "news_source_id_fkey";

alter table "public"."news" add constraint "news_url_check" CHECK ((url ~* '^https?://'::text)) not valid;

alter table "public"."news" validate constraint "news_url_check";

alter table "public"."opportunities" add constraint "opportunities_content_id_fkey" FOREIGN KEY (content_id) REFERENCES public.contents(id) ON DELETE CASCADE not valid;

alter table "public"."opportunities" validate constraint "opportunities_content_id_fkey";

alter table "public"."research" add constraint "research_content_id_fkey" FOREIGN KEY (content_id) REFERENCES public.contents(id) ON DELETE CASCADE not valid;

alter table "public"."research" validate constraint "research_content_id_fkey";

alter table "public"."research" add constraint "research_language_code_check" CHECK ((char_length(language_code) = 2)) not valid;

alter table "public"."research" validate constraint "research_language_code_check";

alter table "public"."research" add constraint "research_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES public.companies(id) not valid;

alter table "public"."research" validate constraint "research_organization_id_fkey";

alter table "public"."research" add constraint "research_primary_category_id_fkey" FOREIGN KEY (primary_category_id) REFERENCES public.categories(id) not valid;

alter table "public"."research" validate constraint "research_primary_category_id_fkey";

alter table "public"."research" add constraint "research_source_id_fkey" FOREIGN KEY (source_id) REFERENCES public.content_sources(id) not valid;

alter table "public"."research" validate constraint "research_source_id_fkey";

alter table "public"."research" add constraint "research_url_check" CHECK ((url ~* '^https?://'::text)) not valid;

alter table "public"."research" validate constraint "research_url_check";

alter table "public"."content_sources" add constraint "content_sources_parser_type_check" CHECK ((parser_type = ANY (ARRAY['rss'::text, 'atom'::text, 'rdf'::text, 'cheerio'::text, 'podcast'::text, 'youtube'::text, 'playwright'::text, 'firecrawl'::text]))) not valid;

alter table "public"."content_sources" validate constraint "content_sources_parser_type_check";

alter table "public"."domain_relationships" add constraint "domain_relationships_source_url_id_fkey" FOREIGN KEY (source_url_id) REFERENCES public.domain_urls(id) ON DELETE CASCADE not valid;

alter table "public"."domain_relationships" validate constraint "domain_relationships_source_url_id_fkey";

alter table "public"."domain_relationships" add constraint "domain_relationships_target_url_id_fkey" FOREIGN KEY (target_url_id) REFERENCES public.domain_urls(id) ON DELETE CASCADE not valid;

alter table "public"."domain_relationships" validate constraint "domain_relationships_target_url_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_sites_to_crawl(fetch_limit integer)
 RETURNS SETOF public.companies
 LANGUAGE sql
AS $function$
  SELECT *
  FROM public.companies c
  WHERE
    c.url IS NOT NULL
    AND c.url != ''
    AND (c.content_status IS NULL OR c.content_status != 'pending_crawl')
    AND public.should_rescrape(c.scrape_frequency, c.scraped_at)
  ORDER BY COALESCE(c.scraped_at, '1970-01-01'::timestamp) ASC
  LIMIT fetch_limit
$function$;

CREATE OR REPLACE FUNCTION public.should_rescrape(frequency text, last_scraped timestamp with time zone, reference_time timestamp with time zone DEFAULT now())
 RETURNS boolean
 LANGUAGE sql
AS $function$
  select
    last_scraped is null
    or (
      frequency = 'four_times_daily' and last_scraped < reference_time - interval '6 hours'
      or frequency = 'twice_daily'    and last_scraped < reference_time - interval '12 hours'
      or frequency = 'daily'          and last_scraped < reference_time - interval '1 day'
      or frequency = 'twice_weekly'   and last_scraped < reference_time - interval '3 days'
      or frequency = 'weekly'         and last_scraped < reference_time - interval '7 days'
      or frequency = 'bi_weekly'      and last_scraped < reference_time - interval '14 days'
      or frequency = 'monthly'        and last_scraped < reference_time - interval '1 month'
      or frequency = 'quarterly'      and last_scraped < reference_time - interval '3 months'
      or frequency = 'biannual'       and last_scraped < reference_time - interval '6 months'
      or frequency = 'annually'       and last_scraped < reference_time - interval '1 year'
      or frequency = 'never'
    )
$function$;

create or replace view "public"."job_filters" as  SELECT DISTINCT j.location,
    c.name AS company_name,
    j.company_id,
    j.employment_type
   FROM (public.opportunities j
     JOIN public.companies c ON ((c.id = j.company_id)))
  ORDER BY c.name, j.company_id, j.location, j.employment_type;

CREATE OR REPLACE FUNCTION public.should_send_webhook(table_name text, operation text, old_record record, new_record record)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Logic for contents table
  IF table_name = 'contents' THEN
    IF operation = 'INSERT' THEN
      IF new_record.content_status = 'scraped' THEN
        RETURN TRUE;

END IF;

ELSIF operation = 'UPDATE' THEN
      IF old_record IS NULL THEN
        RETURN FALSE;

-- safety check
      END IF;

-- Trigger if URI changes
      IF old_record.uri IS DISTINCT FROM new_record.uri THEN
        RETURN TRUE;

END IF;

-- Trigger if status becomes scraped
      IF old_record.content_status IS DISTINCT FROM new_record.content_status
         AND new_record.content_status = 'scraped' THEN
        RETURN TRUE;

END IF;

END IF;

-- Logic for articles table
  ELSIF table_name = 'articles' THEN
    IF operation = 'INSERT' THEN
      RETURN TRUE;

ELSIF operation = 'UPDATE' THEN
      IF old_record IS NULL THEN
        RETURN FALSE;

END IF;

IF old_record.content IS DISTINCT FROM new_record.content THEN
        RETURN TRUE;

END IF;

END IF;

-- Logic for documents table
  ELSIF table_name = 'documents' THEN
    IF operation = 'UPDATE' THEN
      IF old_record IS NULL THEN
        RETURN FALSE;

END IF;

IF old_record.status != 'processed' AND new_record.status = 'processed' THEN
        RETURN TRUE;

END IF;

END IF;

END IF;

-- Default: don't send webhook
  RETURN FALSE;

END;

$function$;

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

grant delete on table "public"."crawl_stats" to "anon";

grant insert on table "public"."crawl_stats" to "anon";

grant references on table "public"."crawl_stats" to "anon";

grant select on table "public"."crawl_stats" to "anon";

grant trigger on table "public"."crawl_stats" to "anon";

grant truncate on table "public"."crawl_stats" to "anon";

grant update on table "public"."crawl_stats" to "anon";

grant delete on table "public"."crawl_stats" to "authenticated";

grant insert on table "public"."crawl_stats" to "authenticated";

grant references on table "public"."crawl_stats" to "authenticated";

grant select on table "public"."crawl_stats" to "authenticated";

grant trigger on table "public"."crawl_stats" to "authenticated";

grant truncate on table "public"."crawl_stats" to "authenticated";

grant update on table "public"."crawl_stats" to "authenticated";

grant delete on table "public"."crawl_stats" to "service_role";

grant insert on table "public"."crawl_stats" to "service_role";

grant references on table "public"."crawl_stats" to "service_role";

grant select on table "public"."crawl_stats" to "service_role";

grant trigger on table "public"."crawl_stats" to "service_role";

grant truncate on table "public"."crawl_stats" to "service_role";

grant update on table "public"."crawl_stats" to "service_role";

grant delete on table "public"."domain_assets" to "anon";

grant insert on table "public"."domain_assets" to "anon";

grant references on table "public"."domain_assets" to "anon";

grant select on table "public"."domain_assets" to "anon";

grant trigger on table "public"."domain_assets" to "anon";

grant truncate on table "public"."domain_assets" to "anon";

grant update on table "public"."domain_assets" to "anon";

grant delete on table "public"."domain_assets" to "authenticated";

grant insert on table "public"."domain_assets" to "authenticated";

grant references on table "public"."domain_assets" to "authenticated";

grant select on table "public"."domain_assets" to "authenticated";

grant trigger on table "public"."domain_assets" to "authenticated";

grant truncate on table "public"."domain_assets" to "authenticated";

grant update on table "public"."domain_assets" to "authenticated";

grant delete on table "public"."domain_assets" to "service_role";

grant insert on table "public"."domain_assets" to "service_role";

grant references on table "public"."domain_assets" to "service_role";

grant select on table "public"."domain_assets" to "service_role";

grant trigger on table "public"."domain_assets" to "service_role";

grant truncate on table "public"."domain_assets" to "service_role";

grant update on table "public"."domain_assets" to "service_role";

grant delete on table "public"."domain_contacts" to "anon";

grant insert on table "public"."domain_contacts" to "anon";

grant references on table "public"."domain_contacts" to "anon";

grant select on table "public"."domain_contacts" to "anon";

grant trigger on table "public"."domain_contacts" to "anon";

grant truncate on table "public"."domain_contacts" to "anon";

grant update on table "public"."domain_contacts" to "anon";

grant delete on table "public"."domain_contacts" to "authenticated";

grant insert on table "public"."domain_contacts" to "authenticated";

grant references on table "public"."domain_contacts" to "authenticated";

grant select on table "public"."domain_contacts" to "authenticated";

grant trigger on table "public"."domain_contacts" to "authenticated";

grant truncate on table "public"."domain_contacts" to "authenticated";

grant update on table "public"."domain_contacts" to "authenticated";

grant delete on table "public"."domain_contacts" to "service_role";

grant insert on table "public"."domain_contacts" to "service_role";

grant references on table "public"."domain_contacts" to "service_role";

grant select on table "public"."domain_contacts" to "service_role";

grant trigger on table "public"."domain_contacts" to "service_role";

grant truncate on table "public"."domain_contacts" to "service_role";

grant update on table "public"."domain_contacts" to "service_role";

grant delete on table "public"."domain_content" to "anon";

grant insert on table "public"."domain_content" to "anon";

grant references on table "public"."domain_content" to "anon";

grant select on table "public"."domain_content" to "anon";

grant trigger on table "public"."domain_content" to "anon";

grant truncate on table "public"."domain_content" to "anon";

grant update on table "public"."domain_content" to "anon";

grant delete on table "public"."domain_content" to "authenticated";

grant insert on table "public"."domain_content" to "authenticated";

grant references on table "public"."domain_content" to "authenticated";

grant select on table "public"."domain_content" to "authenticated";

grant trigger on table "public"."domain_content" to "authenticated";

grant truncate on table "public"."domain_content" to "authenticated";

grant update on table "public"."domain_content" to "authenticated";

grant delete on table "public"."domain_content" to "service_role";

grant insert on table "public"."domain_content" to "service_role";

grant references on table "public"."domain_content" to "service_role";

grant select on table "public"."domain_content" to "service_role";

grant trigger on table "public"."domain_content" to "service_role";

grant truncate on table "public"."domain_content" to "service_role";

grant update on table "public"."domain_content" to "service_role";

grant delete on table "public"."domain_content_sources" to "anon";

grant insert on table "public"."domain_content_sources" to "anon";

grant references on table "public"."domain_content_sources" to "anon";

grant select on table "public"."domain_content_sources" to "anon";

grant trigger on table "public"."domain_content_sources" to "anon";

grant truncate on table "public"."domain_content_sources" to "anon";

grant update on table "public"."domain_content_sources" to "anon";

grant delete on table "public"."domain_content_sources" to "authenticated";

grant insert on table "public"."domain_content_sources" to "authenticated";

grant references on table "public"."domain_content_sources" to "authenticated";

grant select on table "public"."domain_content_sources" to "authenticated";

grant trigger on table "public"."domain_content_sources" to "authenticated";

grant truncate on table "public"."domain_content_sources" to "authenticated";

grant update on table "public"."domain_content_sources" to "authenticated";

grant delete on table "public"."domain_content_sources" to "service_role";

grant insert on table "public"."domain_content_sources" to "service_role";

grant references on table "public"."domain_content_sources" to "service_role";

grant select on table "public"."domain_content_sources" to "service_role";

grant trigger on table "public"."domain_content_sources" to "service_role";

grant truncate on table "public"."domain_content_sources" to "service_role";

grant update on table "public"."domain_content_sources" to "service_role";

grant delete on table "public"."domain_documents" to "anon";

grant insert on table "public"."domain_documents" to "anon";

grant references on table "public"."domain_documents" to "anon";

grant select on table "public"."domain_documents" to "anon";

grant trigger on table "public"."domain_documents" to "anon";

grant truncate on table "public"."domain_documents" to "anon";

grant update on table "public"."domain_documents" to "anon";

grant delete on table "public"."domain_documents" to "authenticated";

grant insert on table "public"."domain_documents" to "authenticated";

grant references on table "public"."domain_documents" to "authenticated";

grant select on table "public"."domain_documents" to "authenticated";

grant trigger on table "public"."domain_documents" to "authenticated";

grant truncate on table "public"."domain_documents" to "authenticated";

grant update on table "public"."domain_documents" to "authenticated";

grant delete on table "public"."domain_documents" to "service_role";

grant insert on table "public"."domain_documents" to "service_role";

grant references on table "public"."domain_documents" to "service_role";

grant select on table "public"."domain_documents" to "service_role";

grant trigger on table "public"."domain_documents" to "service_role";

grant truncate on table "public"."domain_documents" to "service_role";

grant update on table "public"."domain_documents" to "service_role";

grant delete on table "public"."news" to "anon";

grant insert on table "public"."news" to "anon";

grant references on table "public"."news" to "anon";

grant select on table "public"."news" to "anon";

grant trigger on table "public"."news" to "anon";

grant truncate on table "public"."news" to "anon";

grant update on table "public"."news" to "anon";

grant delete on table "public"."news" to "authenticated";

grant insert on table "public"."news" to "authenticated";

grant references on table "public"."news" to "authenticated";

grant select on table "public"."news" to "authenticated";

grant trigger on table "public"."news" to "authenticated";

grant truncate on table "public"."news" to "authenticated";

grant update on table "public"."news" to "authenticated";

grant delete on table "public"."news" to "service_role";

grant insert on table "public"."news" to "service_role";

grant references on table "public"."news" to "service_role";

grant select on table "public"."news" to "service_role";

grant trigger on table "public"."news" to "service_role";

grant truncate on table "public"."news" to "service_role";

grant update on table "public"."news" to "service_role";

grant delete on table "public"."research" to "anon";

grant insert on table "public"."research" to "anon";

grant references on table "public"."research" to "anon";

grant select on table "public"."research" to "anon";

grant trigger on table "public"."research" to "anon";

grant truncate on table "public"."research" to "anon";

grant update on table "public"."research" to "anon";

grant delete on table "public"."research" to "authenticated";

grant insert on table "public"."research" to "authenticated";

grant references on table "public"."research" to "authenticated";

grant select on table "public"."research" to "authenticated";

grant trigger on table "public"."research" to "authenticated";

grant truncate on table "public"."research" to "authenticated";

grant update on table "public"."research" to "authenticated";

grant delete on table "public"."research" to "service_role";

grant insert on table "public"."research" to "service_role";

grant references on table "public"."research" to "service_role";

grant select on table "public"."research" to "service_role";

grant trigger on table "public"."research" to "service_role";

grant truncate on table "public"."research" to "service_role";

grant update on table "public"."research" to "service_role";

CREATE TRIGGER update_crawl_stats_timestamp BEFORE UPDATE ON public.crawl_stats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_news_timestamp BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_research_timestamp BEFORE UPDATE ON public.research FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


CREATE OR REPLACE FUNCTION public.compute_company_relationships()
RETURNS void AS $$
BEGIN
  INSERT INTO public.domain_relationships (
    source_company_id,
    target_company_id,
    source_url_id,
    target_url_id,
    created_at,
    updated_at
  )
  SELECT
    source.company_id AS source_company_id,
    target_comp.id AS target_company_id,
    source.id AS source_url_id,
    target.id AS target_url_id,
    NOW(), NOW()
  FROM public.domain_urls source
  JOIN public.domain_urls target ON source.id <> target.id
  JOIN public.companies target_comp
    ON POSITION(target_comp.url IN target.url) > 0
  WHERE source.company_id IS NOT NULL
    AND target_comp.id IS DISTINCT FROM source.company_id
    AND target.company_id IS NOT NULL
  ON CONFLICT (source_url_id, target_url_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Cron Jobs
-- Note: Common maintenance jobs are handled in a separate migration
-- This section only includes additional custom jobs
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM cron.job 
    WHERE command = 'CALL public.compute_company_relationships()'
  ) THEN
    PERFORM cron.schedule(
      'call_public_compute_company_relationships',
      '30 2 * * *',
      'CALL public.compute_company_relationships()'
    );

END IF;

END $$;