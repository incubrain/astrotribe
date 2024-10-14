create type "public"."content_status" as enum ('draft', 'agent_action', 'agent_review', 'human_review', 'trash', 'ready', 'scheduled', 'unpublished', 'archived', 'published');

drop trigger if exists "update_authors_updated_at" on "public"."research_authors";

drop trigger if exists "update_citations_updated_at" on "public"."research_citations";

drop trigger if exists "update_figures_updated_at" on "public"."research_figures";

drop trigger if exists "update_math_updated_at" on "public"."research_math";

drop trigger if exists "update_research_metrics_updated_at" on "public"."research_metrics";

drop trigger if exists "update_notes_updated_at" on "public"."research_notes";

drop trigger if exists "update_data_tables_updated_at" on "public"."research_tables";

drop trigger if exists "update_tools_updated_at" on "public"."research_tools";

drop trigger if exists "update_user_metadata_trigger" on "public"."user_profiles";

drop policy "delete_policy" on "public"."news_embeddings";

drop policy "insert_policy" on "public"."news_embeddings";

drop policy "read_all_policy" on "public"."news_embeddings";

drop policy "update_policy" on "public"."news_embeddings";

drop policy "Allow read access to all users" on "public"."research_authors";

drop policy "delete_policy" on "public"."research_authors";

drop policy "insert_policy" on "public"."research_authors";

drop policy "update_policy" on "public"."research_authors";

drop policy "Allow read access to all users" on "public"."research_citations";

drop policy "delete_policy" on "public"."research_citations";

drop policy "insert_policy" on "public"."research_citations";

drop policy "update_policy" on "public"."research_citations";

drop policy "Allow read access to all users" on "public"."research_figures";

drop policy "delete_policy" on "public"."research_figures";

drop policy "insert_policy" on "public"."research_figures";

drop policy "update_policy" on "public"."research_figures";

drop policy "Allow read access to all users" on "public"."research_math";

drop policy "delete_policy" on "public"."research_math";

drop policy "insert_policy" on "public"."research_math";

drop policy "update_policy" on "public"."research_math";

drop policy "Allow read access to all users" on "public"."research_metrics";

drop policy "delete_policy" on "public"."research_metrics";

drop policy "insert_policy" on "public"."research_metrics";

drop policy "update_policy" on "public"."research_metrics";

drop policy "Allow read access to all users" on "public"."research_notes";

drop policy "delete_policy" on "public"."research_notes";

drop policy "insert_policy" on "public"."research_notes";

drop policy "update_policy" on "public"."research_notes";

drop policy "Allow read access to all users" on "public"."research_tables";

drop policy "delete_policy" on "public"."research_tables";

drop policy "insert_policy" on "public"."research_tables";

drop policy "update_policy" on "public"."research_tables";

drop policy "Allow read access to all users" on "public"."research_tools";

drop policy "delete_policy" on "public"."research_tools";

drop policy "insert_policy" on "public"."research_tools";

drop policy "update_policy" on "public"."research_tools";

revoke select on table "public"."news_embeddings" from "anon";

revoke select on table "public"."news_embeddings" from "authenticated";

revoke delete on table "public"."news_embeddings" from "service_role";

revoke insert on table "public"."news_embeddings" from "service_role";

revoke select on table "public"."news_embeddings" from "service_role";

revoke update on table "public"."news_embeddings" from "service_role";

revoke delete on table "public"."research_authors" from "anon";

revoke insert on table "public"."research_authors" from "anon";

revoke references on table "public"."research_authors" from "anon";

revoke select on table "public"."research_authors" from "anon";

revoke trigger on table "public"."research_authors" from "anon";

revoke truncate on table "public"."research_authors" from "anon";

revoke update on table "public"."research_authors" from "anon";

revoke delete on table "public"."research_authors" from "authenticated";

revoke insert on table "public"."research_authors" from "authenticated";

revoke references on table "public"."research_authors" from "authenticated";

revoke select on table "public"."research_authors" from "authenticated";

revoke trigger on table "public"."research_authors" from "authenticated";

revoke truncate on table "public"."research_authors" from "authenticated";

revoke update on table "public"."research_authors" from "authenticated";

revoke delete on table "public"."research_authors" from "service_role";

revoke insert on table "public"."research_authors" from "service_role";

revoke references on table "public"."research_authors" from "service_role";

revoke select on table "public"."research_authors" from "service_role";

revoke trigger on table "public"."research_authors" from "service_role";

revoke truncate on table "public"."research_authors" from "service_role";

revoke update on table "public"."research_authors" from "service_role";

revoke delete on table "public"."research_citations" from "anon";

revoke insert on table "public"."research_citations" from "anon";

revoke references on table "public"."research_citations" from "anon";

revoke select on table "public"."research_citations" from "anon";

revoke trigger on table "public"."research_citations" from "anon";

revoke truncate on table "public"."research_citations" from "anon";

revoke update on table "public"."research_citations" from "anon";

revoke delete on table "public"."research_citations" from "authenticated";

revoke insert on table "public"."research_citations" from "authenticated";

revoke references on table "public"."research_citations" from "authenticated";

revoke select on table "public"."research_citations" from "authenticated";

revoke trigger on table "public"."research_citations" from "authenticated";

revoke truncate on table "public"."research_citations" from "authenticated";

revoke update on table "public"."research_citations" from "authenticated";

revoke delete on table "public"."research_citations" from "service_role";

revoke insert on table "public"."research_citations" from "service_role";

revoke references on table "public"."research_citations" from "service_role";

revoke select on table "public"."research_citations" from "service_role";

revoke trigger on table "public"."research_citations" from "service_role";

revoke truncate on table "public"."research_citations" from "service_role";

revoke update on table "public"."research_citations" from "service_role";

revoke delete on table "public"."research_figures" from "anon";

revoke insert on table "public"."research_figures" from "anon";

revoke references on table "public"."research_figures" from "anon";

revoke select on table "public"."research_figures" from "anon";

revoke trigger on table "public"."research_figures" from "anon";

revoke truncate on table "public"."research_figures" from "anon";

revoke update on table "public"."research_figures" from "anon";

revoke delete on table "public"."research_figures" from "authenticated";

revoke insert on table "public"."research_figures" from "authenticated";

revoke references on table "public"."research_figures" from "authenticated";

revoke select on table "public"."research_figures" from "authenticated";

revoke trigger on table "public"."research_figures" from "authenticated";

revoke truncate on table "public"."research_figures" from "authenticated";

revoke update on table "public"."research_figures" from "authenticated";

revoke delete on table "public"."research_figures" from "service_role";

revoke insert on table "public"."research_figures" from "service_role";

revoke references on table "public"."research_figures" from "service_role";

revoke select on table "public"."research_figures" from "service_role";

revoke trigger on table "public"."research_figures" from "service_role";

revoke truncate on table "public"."research_figures" from "service_role";

revoke update on table "public"."research_figures" from "service_role";

revoke delete on table "public"."research_math" from "anon";

revoke insert on table "public"."research_math" from "anon";

revoke references on table "public"."research_math" from "anon";

revoke select on table "public"."research_math" from "anon";

revoke trigger on table "public"."research_math" from "anon";

revoke truncate on table "public"."research_math" from "anon";

revoke update on table "public"."research_math" from "anon";

revoke delete on table "public"."research_math" from "authenticated";

revoke insert on table "public"."research_math" from "authenticated";

revoke references on table "public"."research_math" from "authenticated";

revoke select on table "public"."research_math" from "authenticated";

revoke trigger on table "public"."research_math" from "authenticated";

revoke truncate on table "public"."research_math" from "authenticated";

revoke update on table "public"."research_math" from "authenticated";

revoke delete on table "public"."research_math" from "service_role";

revoke insert on table "public"."research_math" from "service_role";

revoke references on table "public"."research_math" from "service_role";

revoke select on table "public"."research_math" from "service_role";

revoke trigger on table "public"."research_math" from "service_role";

revoke truncate on table "public"."research_math" from "service_role";

revoke update on table "public"."research_math" from "service_role";

revoke delete on table "public"."research_metrics" from "anon";

revoke insert on table "public"."research_metrics" from "anon";

revoke references on table "public"."research_metrics" from "anon";

revoke select on table "public"."research_metrics" from "anon";

revoke trigger on table "public"."research_metrics" from "anon";

revoke truncate on table "public"."research_metrics" from "anon";

revoke update on table "public"."research_metrics" from "anon";

revoke delete on table "public"."research_metrics" from "authenticated";

revoke insert on table "public"."research_metrics" from "authenticated";

revoke references on table "public"."research_metrics" from "authenticated";

revoke select on table "public"."research_metrics" from "authenticated";

revoke trigger on table "public"."research_metrics" from "authenticated";

revoke truncate on table "public"."research_metrics" from "authenticated";

revoke update on table "public"."research_metrics" from "authenticated";

revoke delete on table "public"."research_metrics" from "service_role";

revoke insert on table "public"."research_metrics" from "service_role";

revoke references on table "public"."research_metrics" from "service_role";

revoke select on table "public"."research_metrics" from "service_role";

revoke trigger on table "public"."research_metrics" from "service_role";

revoke truncate on table "public"."research_metrics" from "service_role";

revoke update on table "public"."research_metrics" from "service_role";

revoke delete on table "public"."research_notes" from "anon";

revoke insert on table "public"."research_notes" from "anon";

revoke references on table "public"."research_notes" from "anon";

revoke select on table "public"."research_notes" from "anon";

revoke trigger on table "public"."research_notes" from "anon";

revoke truncate on table "public"."research_notes" from "anon";

revoke update on table "public"."research_notes" from "anon";

revoke delete on table "public"."research_notes" from "authenticated";

revoke insert on table "public"."research_notes" from "authenticated";

revoke references on table "public"."research_notes" from "authenticated";

revoke select on table "public"."research_notes" from "authenticated";

revoke trigger on table "public"."research_notes" from "authenticated";

revoke truncate on table "public"."research_notes" from "authenticated";

revoke update on table "public"."research_notes" from "authenticated";

revoke delete on table "public"."research_notes" from "service_role";

revoke insert on table "public"."research_notes" from "service_role";

revoke references on table "public"."research_notes" from "service_role";

revoke select on table "public"."research_notes" from "service_role";

revoke trigger on table "public"."research_notes" from "service_role";

revoke truncate on table "public"."research_notes" from "service_role";

revoke update on table "public"."research_notes" from "service_role";

revoke delete on table "public"."research_tables" from "anon";

revoke insert on table "public"."research_tables" from "anon";

revoke references on table "public"."research_tables" from "anon";

revoke select on table "public"."research_tables" from "anon";

revoke trigger on table "public"."research_tables" from "anon";

revoke truncate on table "public"."research_tables" from "anon";

revoke update on table "public"."research_tables" from "anon";

revoke delete on table "public"."research_tables" from "authenticated";

revoke insert on table "public"."research_tables" from "authenticated";

revoke references on table "public"."research_tables" from "authenticated";

revoke select on table "public"."research_tables" from "authenticated";

revoke trigger on table "public"."research_tables" from "authenticated";

revoke truncate on table "public"."research_tables" from "authenticated";

revoke update on table "public"."research_tables" from "authenticated";

revoke delete on table "public"."research_tables" from "service_role";

revoke insert on table "public"."research_tables" from "service_role";

revoke references on table "public"."research_tables" from "service_role";

revoke select on table "public"."research_tables" from "service_role";

revoke trigger on table "public"."research_tables" from "service_role";

revoke truncate on table "public"."research_tables" from "service_role";

revoke update on table "public"."research_tables" from "service_role";

revoke delete on table "public"."research_tools" from "anon";

revoke insert on table "public"."research_tools" from "anon";

revoke references on table "public"."research_tools" from "anon";

revoke select on table "public"."research_tools" from "anon";

revoke trigger on table "public"."research_tools" from "anon";

revoke truncate on table "public"."research_tools" from "anon";

revoke update on table "public"."research_tools" from "anon";

revoke delete on table "public"."research_tools" from "authenticated";

revoke insert on table "public"."research_tools" from "authenticated";

revoke references on table "public"."research_tools" from "authenticated";

revoke select on table "public"."research_tools" from "authenticated";

revoke trigger on table "public"."research_tools" from "authenticated";

revoke truncate on table "public"."research_tools" from "authenticated";

revoke update on table "public"."research_tools" from "authenticated";

revoke delete on table "public"."research_tools" from "service_role";

revoke insert on table "public"."research_tools" from "service_role";

revoke references on table "public"."research_tools" from "service_role";

revoke select on table "public"."research_tools" from "service_role";

revoke trigger on table "public"."research_tools" from "service_role";

revoke truncate on table "public"."research_tools" from "service_role";

revoke update on table "public"."research_tools" from "service_role";

alter table "public"."companies" drop constraint "companies_content_fk";

alter table "public"."news" drop constraint "news_content_fk";

alter table "public"."research_authors" drop constraint "research_authors_url_key";

alter table "public"."research_citations" drop constraint "citations_url_key";

alter table "public"."research_citations" drop constraint "unique_id_url";

alter table "public"."research_figures" drop constraint "figures_srcs_key";

alter table "public"."research_math" drop constraint "math_id_key";

alter table "public"."research_math" drop constraint "math_latex_key";

alter table "public"."research_math" drop constraint "unique_id_latex";

alter table "public"."research_notes" drop constraint "notes_body_key";

alter table "public"."research_tables" drop constraint "research_tables_hash_key";

alter table "public"."research_tools" drop constraint "tools_url_key";

alter table "public"."companies" drop constraint "public_companies_category_id_fkey";

alter table "public"."news" drop constraint "public_news_company_id_fkey";

drop function if exists "public"."get_citation_ids_by_url"(urls character varying[]);

drop function if exists "public"."get_citation_ids_by_url"(urls text[]);

drop function if exists "public"."get_math_ids_by_latex"(latexes text[]);

drop function if exists "public"."get_note_ids_by_body"(bodies text[]);

drop function if exists "public"."get_table_ids_by_hashes"(hashes text[]);

drop function if exists "public"."insert_company_news_by_source"(p_company_id integer, p_source text);

drop function if exists "public"."remove_placeholders"(text_array text[]);

drop view if exists "public"."research_metrics_monthly_totals";

drop view if exists "public"."research_metrics_totals";

drop function if exists "public"."calculate_monthly_research_metrics_totals"();

drop function if exists "public"."calculate_research_metrics_totals"();

alter table "public"."news_embeddings" drop constraint "news_embeddings_pkey";

alter table "public"."research_authors" drop constraint "authors_pkey";

alter table "public"."research_citations" drop constraint "citations_pkey";

alter table "public"."research_figures" drop constraint "figures_pkey";

alter table "public"."research_math" drop constraint "math_pkey";

alter table "public"."research_metrics" drop constraint "research_metrics_pkey";

alter table "public"."research_notes" drop constraint "notes_pkey";

alter table "public"."research_tables" drop constraint "data_tables_pkey";

alter table "public"."research_tools" drop constraint "toolss_pkey";

drop index if exists "public"."authors_pkey";

drop index if exists "public"."citations_pkey";

drop index if exists "public"."citations_url_key";

drop index if exists "public"."data_tables_pkey";

drop index if exists "public"."figures_pkey";

drop index if exists "public"."figures_srcs_key";

drop index if exists "public"."math_id_key";

drop index if exists "public"."math_latex_key";

drop index if exists "public"."math_pkey";

drop index if exists "public"."notes_body_key";

drop index if exists "public"."notes_pkey";

drop index if exists "public"."research_authors_url_key";

drop index if exists "public"."research_metrics_pkey";

drop index if exists "public"."research_tables_hash_key";

drop index if exists "public"."tools_url_key";

drop index if exists "public"."toolss_pkey";

drop index if exists "public"."unique_id_latex";

drop index if exists "public"."unique_id_url";

drop index if exists "public"."news_embeddings_pkey";

drop table "public"."news_embeddings";

drop table "public"."research_authors";

drop table "public"."research_citations";

drop table "public"."research_figures";

drop table "public"."research_math";

drop table "public"."research_metrics";

drop table "public"."research_notes";

drop table "public"."research_tables";

drop table "public"."research_tools";

create table "public"."content_statuses" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "content_id" uuid not null,
    "status" public.content_status not null,
    "notes" text,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP
);


create table "public"."news_summaries" (
    "id" bigint not null,
    "summary" text,
    "embedding" public.vector(1536),
    "news_id" uuid not null
);


alter table "public"."news_summaries" enable row level security;

create table "public"."newsletters" (
    "id" uuid not null,
    "title" character varying(255) not null,
    "frequency" character varying(50) not null,
    "start_date" timestamp with time zone not null,
    "end_date" timestamp with time zone not null,
    "generated_content" text,
    "status" public.content_status not null default 'draft'::public.content_status,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."companies" add column "scraped_at" timestamp with time zone;

alter table "public"."companies" add column "status" public.content_status not null default 'draft'::public.content_status;

alter table "public"."company_urls" alter column "success" drop not null;

alter table "public"."contents" alter column "url" set not null;

alter table "public"."news" add column "status" public.content_status not null default 'draft'::public.content_status;

-- Step 1: Add a new column of type text[]
ALTER TABLE "public"."news" ADD COLUMN "keywords_array" text[];

-- Step 2: Update the new column with the array data
UPDATE "public"."news"
SET "keywords_array" = CASE
  WHEN keywords IS NULL THEN NULL
  WHEN (keywords::text)::jsonb IS NULL THEN NULL
  ELSE (
    SELECT array_agg(value::text)
    FROM jsonb_array_elements(keywords::jsonb->'values')
  )
END;

-- Step 3: Drop the old column and rename the new one
ALTER TABLE "public"."news" DROP COLUMN "keywords";
ALTER TABLE "public"."news" RENAME COLUMN "keywords_array" TO "keywords";

alter table "public"."research" add column "status" public.content_status not null default 'draft'::public.content_status;

alter table "public"."user_profiles" drop column "cover_image";

drop sequence if exists "public"."research_metrics_id_seq";

CREATE UNIQUE INDEX content_statuses_pkey ON public.content_statuses USING btree (id);

CREATE UNIQUE INDEX contents_url_key ON public.contents USING btree (url);

CREATE INDEX idx_content_statuses_content_id ON public.content_statuses USING btree (content_id);

CREATE INDEX idx_newsletters_id ON public.newsletters USING btree (id);

CREATE UNIQUE INDEX newsletters_pkey ON public.newsletters USING btree (id);

CREATE UNIQUE INDEX news_embeddings_pkey ON public.news_summaries USING btree (id);

alter table "public"."content_statuses" add constraint "content_statuses_pkey" PRIMARY KEY using index "content_statuses_pkey";

alter table "public"."news_summaries" add constraint "news_embeddings_pkey" PRIMARY KEY using index "news_embeddings_pkey";

alter table "public"."newsletters" add constraint "newsletters_pkey" PRIMARY KEY using index "newsletters_pkey";

alter table "public"."companies" add constraint "public_companies_id_fkey" FOREIGN KEY (id) REFERENCES public.contents(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."companies" validate constraint "public_companies_id_fkey";

alter table "public"."content_statuses" add constraint "content_statuses_content_id_fkey" FOREIGN KEY (content_id) REFERENCES public.contents(id) not valid;

alter table "public"."content_statuses" validate constraint "content_statuses_content_id_fkey";

alter table "public"."contents" add constraint "contents_url_key" UNIQUE using index "contents_url_key";

alter table "public"."news" add constraint "public_news_id_fkey" FOREIGN KEY (id) REFERENCES public.contents(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."news" validate constraint "public_news_id_fkey";

alter table "public"."news_summaries" add constraint "public_news_summaries_news_id_fkey" FOREIGN KEY (news_id) REFERENCES public.news(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."news_summaries" validate constraint "public_news_summaries_news_id_fkey";

alter table "public"."newsletters" add constraint "newsletters_id_fkey" FOREIGN KEY (id) REFERENCES public.contents(id) not valid;

alter table "public"."newsletters" validate constraint "newsletters_id_fkey";

alter table "public"."companies" add constraint "public_companies_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.categories(id) not valid;

alter table "public"."companies" validate constraint "public_companies_category_id_fkey";

alter table "public"."news" add constraint "public_news_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."news" validate constraint "public_news_company_id_fkey";

drop policy "read_all_policy" on "public"."role_permissions";

drop policy "delete_policy" on "public"."embedding_reviews";

drop policy "insert_policy" on "public"."embedding_reviews";

drop policy "update_policy" on "public"."embedding_reviews";

drop policy "insert_policy" on "public"."feedbacks";

revoke select on table "public"."role_permissions" from "authenticator";

alter table "public"."role_permissions" drop constraint "role_permission_unique";

drop function if exists "public"."add_authorize_rls_policies"();

drop index if exists "public"."role_permission_unique";

alter table "public"."content_categories" enable row level security;

alter table "public"."content_statuses" enable row level security;

alter table "public"."content_tags" enable row level security;

alter table "public"."contents" enable row level security;

alter table "public"."newsletters" enable row level security;


alter table "public"."role_permissions" add column "conditions" jsonb default '{}'::jsonb;

ALTER TABLE "public"."role_permissions" 
ADD COLUMN "permissions" text[] NOT NULL DEFAULT '{}';

-- Step 2: Update the new column with values from existing columns
UPDATE "public"."role_permissions"
SET "permissions" = ARRAY_REMOVE(ARRAY[
    CASE WHEN "select" THEN 'select' ELSE NULL END,
    CASE WHEN "update" THEN 'update' ELSE NULL END,
    CASE WHEN "insert" THEN 'insert' ELSE NULL END,
    CASE WHEN "delete" THEN 'delete' ELSE NULL END
], NULL);

alter table "public"."role_permissions" alter column "table_name" set data type text using "table_name"::text;

alter table "public"."role_permissions" drop column "delete";

alter table "public"."role_permissions" drop column "insert";

alter table "public"."role_permissions" drop column "select";

alter table "public"."role_permissions" drop column "update";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION auth.check_condition(condition jsonb)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
    condition_sql TEXT;
BEGIN
    condition_sql := condition->>'sql';
    IF condition_sql IS NULL THEN
        RETURN TRUE;
    END IF;

    RETURN auth.evaluate_condition(condition_sql);
END;
$function$
;

CREATE OR REPLACE FUNCTION auth.evaluate_condition(condition_sql text)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
    result BOOLEAN;
BEGIN
    EXECUTE 'SELECT ' || condition_sql INTO result;
    RETURN result;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.enable_rls_on_all_tables()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    schema_name text := 'public';  -- or your specific schema
    table_name text;
BEGIN
    FOR table_name IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = schema_name
    LOOP
        EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', schema_name, table_name);
        RAISE NOTICE 'Enabled RLS on table: %.%', schema_name, table_name;
    END LOOP;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_role_permissions(config jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    role_key TEXT;
    table_group TEXT;
    table_name TEXT;
    permissions TEXT[];
BEGIN
    -- Clear existing permissions
    DELETE FROM public.role_permissions;
    
    -- Loop through roles
    FOR role_key IN SELECT jsonb_object_keys(config->'roles')
    LOOP
        -- Loop through table groups for each role
        FOR table_group IN SELECT jsonb_object_keys(config->'roles'->role_key)
        LOOP
            IF table_group = 'all_tables' THEN
                -- Handle 'all_tables' case
                FOR table_name IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
                LOOP
                    permissions := ARRAY(SELECT jsonb_array_elements_text(config->'roles'->role_key->'all_tables'->'permissions'));
                    INSERT INTO public.role_permissions (role, table_name, permissions, conditions)
                    VALUES (
                        role_key::app_role_enum,
                        table_name,
                        permissions,
                        COALESCE(config->'roles'->role_key->'all_tables'->'conditions', '{}'::jsonb)
                    );
                END LOOP;
            ELSE
                -- Handle specific table groups
                FOR table_name IN SELECT jsonb_array_elements_text(config->'tables'->table_group)
                LOOP
                    permissions := ARRAY(SELECT jsonb_array_elements_text(config->'roles'->role_key->table_group->'permissions'));
                    INSERT INTO public.role_permissions (role, table_name, permissions, conditions)
                    VALUES (
                        role_key::app_role_enum,
                        table_name,
                        permissions,
                        COALESCE(config->'roles'->role_key->table_group->'conditions', '{}'::jsonb)
                    );
                END LOOP;
            END IF;
        END LOOP;
    END LOOP;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.authorize(requested_permission text)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
    user_role app_role_enum;
    v_table_name TEXT;
    operation TEXT;
    permission_record RECORD;
BEGIN
    -- Check for service role key in JWT and bypass authorization
    IF (auth.jwt() ->> 'role') = 'service_role' THEN
        RETURN TRUE;
    END IF;

    user_role := ((auth.jwt() -> 'app_metadata') ->> 'role')::app_role_enum;

    -- Check if user_role is present and valid
    IF user_role IS NULL THEN
        RAISE EXCEPTION 'No user role found in JWT';
    END IF;

    -- Immediately grant access if the user's role is super_admin
    IF user_role = 'super_admin' THEN
        RETURN TRUE;
    END IF;

    -- Parse requested_permission into table_name and operation
    v_table_name := split_part(requested_permission, '.', 1);
    operation := split_part(requested_permission, '.', 2);

    -- Check permissions
    SELECT * INTO permission_record
    FROM public.role_permissions
    WHERE role = user_role AND table_name = v_table_name;

    IF permission_record IS NULL THEN
        RETURN FALSE;
    END IF;

    IF NOT (operation = ANY(permission_record.permissions)) THEN
        RETURN FALSE;
    END IF;

    -- Check conditions if they exist
    IF permission_record.conditions ? operation THEN
        RETURN auth.check_condition(permission_record.conditions->operation);
    END IF;

    RETURN TRUE;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_user_metadata()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  -- Perform the update
  UPDATE auth.users
  SET raw_user_meta_data = raw_user_meta_data
    || jsonb_build_object(
         'given_name', NEW.given_name,
         'surname', NEW.surname,
         'avatar', COALESCE(NEW.avatar, ''),
         'username', NEW.username
       )
  WHERE id = NEW.id;
  RETURN NEW;
END;$function$
;



grant delete on table "public"."content_statuses" to "anon";

grant insert on table "public"."content_statuses" to "anon";

grant references on table "public"."content_statuses" to "anon";

grant select on table "public"."content_statuses" to "anon";

grant trigger on table "public"."content_statuses" to "anon";

grant truncate on table "public"."content_statuses" to "anon";

grant update on table "public"."content_statuses" to "anon";

grant delete on table "public"."content_statuses" to "authenticated";

grant insert on table "public"."content_statuses" to "authenticated";

grant references on table "public"."content_statuses" to "authenticated";

grant select on table "public"."content_statuses" to "authenticated";

grant trigger on table "public"."content_statuses" to "authenticated";

grant truncate on table "public"."content_statuses" to "authenticated";

grant update on table "public"."content_statuses" to "authenticated";

grant delete on table "public"."content_statuses" to "service_role";

grant insert on table "public"."content_statuses" to "service_role";

grant references on table "public"."content_statuses" to "service_role";

grant select on table "public"."content_statuses" to "service_role";

grant trigger on table "public"."content_statuses" to "service_role";

grant truncate on table "public"."content_statuses" to "service_role";

grant update on table "public"."content_statuses" to "service_role";

grant select on table "public"."news_summaries" to "anon";

grant select on table "public"."news_summaries" to "authenticated";

grant delete on table "public"."news_summaries" to "service_role";

grant insert on table "public"."news_summaries" to "service_role";

grant select on table "public"."news_summaries" to "service_role";

grant update on table "public"."news_summaries" to "service_role";

grant delete on table "public"."newsletters" to "anon";

grant insert on table "public"."newsletters" to "anon";

grant references on table "public"."newsletters" to "anon";

grant select on table "public"."newsletters" to "anon";

grant trigger on table "public"."newsletters" to "anon";

grant truncate on table "public"."newsletters" to "anon";

grant update on table "public"."newsletters" to "anon";

grant delete on table "public"."newsletters" to "authenticated";

grant insert on table "public"."newsletters" to "authenticated";

grant references on table "public"."newsletters" to "authenticated";

grant select on table "public"."newsletters" to "authenticated";

grant trigger on table "public"."newsletters" to "authenticated";

grant truncate on table "public"."newsletters" to "authenticated";

grant update on table "public"."newsletters" to "authenticated";

grant delete on table "public"."newsletters" to "service_role";

grant insert on table "public"."newsletters" to "service_role";

grant references on table "public"."newsletters" to "service_role";

grant select on table "public"."newsletters" to "service_role";

grant trigger on table "public"."newsletters" to "service_role";

grant truncate on table "public"."newsletters" to "service_role";

grant update on table "public"."newsletters" to "service_role";


create policy "delete_policy"
on "public"."news_summaries"
as permissive
for delete
to public
using (public.authorize('news_summaries.delete'::text));


create policy "select_policy"
on "public"."addresses"
as permissive
for select
to public
using (public.authorize('addresses.select'::text));


create policy "delete_policy"
on "public"."blacklisted_urls"
as permissive
for delete
to public
using (public.authorize('blacklisted_urls.delete'::text));


create policy "insert_policy"
on "public"."blacklisted_urls"
as permissive
for insert
to public
with check (public.authorize('blacklisted_urls.insert'::text));


create policy "select_policy"
on "public"."blacklisted_urls"
as permissive
for select
to public
using (public.authorize('blacklisted_urls.select'::text));


create policy "update_policy"
on "public"."blacklisted_urls"
as permissive
for update
to public
using (public.authorize('blacklisted_urls.update'::text));


create policy "select_policy"
on "public"."categories"
as permissive
for select
to public
using (public.authorize('categories.select'::text));


create policy "select_policy"
on "public"."cities"
as permissive
for select
to public
using (public.authorize('cities.select'::text));


create policy "select_policy"
on "public"."companies"
as permissive
for select
to public
using (public.authorize('companies.select'::text));


create policy "select_policy"
on "public"."company_contacts"
as permissive
for select
to public
using (public.authorize('company_contacts.select'::text));


create policy "select_policy"
on "public"."company_employees"
as permissive
for select
to public
using (public.authorize('company_employees.select'::text));


create policy "select_policy"
on "public"."company_extras"
as permissive
for select
to public
using (public.authorize('company_extras.select'::text));


create policy "select_policy"
on "public"."company_urls"
as permissive
for select
to public
using (public.authorize('company_urls.select'::text));


create policy "select_policy"
on "public"."contacts"
as permissive
for select
to public
using (public.authorize('contacts.select'::text));


create policy "delete_policy"
on "public"."content_categories"
as permissive
for delete
to public
using (public.authorize('content_categories.delete'::text));


create policy "insert_policy"
on "public"."content_categories"
as permissive
for insert
to public
with check (public.authorize('content_categories.insert'::text));


create policy "select_policy"
on "public"."content_categories"
as permissive
for select
to public
using (public.authorize('content_categories.select'::text));


create policy "update_policy"
on "public"."content_categories"
as permissive
for update
to public
using (public.authorize('content_categories.update'::text));


create policy "delete_policy"
on "public"."content_sources"
as permissive
for delete
to public
using (public.authorize('content_sources.delete'::text));


create policy "insert_policy"
on "public"."content_sources"
as permissive
for insert
to public
with check (public.authorize('content_sources.insert'::text));


create policy "select_policy"
on "public"."content_sources"
as permissive
for select
to public
using (public.authorize('content_sources.select'::text));


create policy "update_policy"
on "public"."content_sources"
as permissive
for update
to public
using (public.authorize('content_sources.update'::text));


create policy "delete_policy"
on "public"."content_statuses"
as permissive
for delete
to public
using (public.authorize('content_statuses.delete'::text));


create policy "insert_policy"
on "public"."content_statuses"
as permissive
for insert
to public
with check (public.authorize('content_statuses.insert'::text));


create policy "select_policy"
on "public"."content_statuses"
as permissive
for select
to public
using (public.authorize('content_statuses.select'::text));


create policy "update_policy"
on "public"."content_statuses"
as permissive
for update
to public
using (public.authorize('content_statuses.update'::text));


create policy "delete_policy"
on "public"."content_tags"
as permissive
for delete
to public
using (public.authorize('content_tags.delete'::text));


create policy "insert_policy"
on "public"."content_tags"
as permissive
for insert
to public
with check (public.authorize('content_tags.insert'::text));


create policy "select_policy"
on "public"."content_tags"
as permissive
for select
to public
using (public.authorize('content_tags.select'::text));


create policy "update_policy"
on "public"."content_tags"
as permissive
for update
to public
using (public.authorize('content_tags.update'::text));


create policy "delete_policy"
on "public"."contents"
as permissive
for delete
to public
using (public.authorize('contents.delete'::text));


create policy "insert_policy"
on "public"."contents"
as permissive
for insert
to public
with check (public.authorize('contents.insert'::text));


create policy "select_policy"
on "public"."contents"
as permissive
for select
to public
using (public.authorize('contents.select'::text));


create policy "update_policy"
on "public"."contents"
as permissive
for update
to public
using (public.authorize('contents.update'::text));


create policy "select_policy"
on "public"."countries"
as permissive
for select
to public
using (public.authorize('countries.select'::text));


create policy "select_policy"
on "public"."embedding_reviews"
as permissive
for select
to public
using (public.authorize('embedding_reviews.select'::text));


create policy "select_policy"
on "public"."feedbacks"
as permissive
for select
to public
using (public.authorize('feedbacks.select'::text));


create policy "select_policy"
on "public"."news"
as permissive
for select
to public
using (public.authorize('news.select'::text));


create policy "select_policy"
on "public"."news_summaries"
as permissive
for select
to public
using (public.authorize('news_summaries.select'::text));


create policy "select_policy"
on "public"."news_tags"
as permissive
for select
to public
using (public.authorize('news_tags.select'::text));


create policy "delete_policy"
on "public"."newsletters"
as permissive
for delete
to public
using (public.authorize('newsletters.delete'::text));


create policy "insert_policy"
on "public"."newsletters"
as permissive
for insert
to public
with check (public.authorize('newsletters.insert'::text));


create policy "select_policy"
on "public"."newsletters"
as permissive
for select
to public
using (public.authorize('newsletters.select'::text));


create policy "update_policy"
on "public"."newsletters"
as permissive
for update
to public
using (public.authorize('newsletters.update'::text));


create policy "select_policy"
on "public"."plan_permissions"
as permissive
for select
to public
using (public.authorize('plan_permissions.select'::text));


create policy "select_policy"
on "public"."research"
as permissive
for select
to public
using (public.authorize('research.select'::text));


create policy "select_policy"
on "public"."research_embeddings"
as permissive
for select
to public
using (public.authorize('research_embeddings.select'::text));


create policy "select_policy"
on "public"."responses"
as permissive
for select
to public
using (public.authorize('responses.select'::text));


create policy "select_policy"
on "public"."role_permissions"
as permissive
for select
to public
using (public.authorize('role_permissions.select'::text));


create policy "delete_policy"
on "public"."scraping_metrics"
as permissive
for delete
to public
using (public.authorize('scraping_metrics.delete'::text));


create policy "insert_policy"
on "public"."scraping_metrics"
as permissive
for insert
to public
with check (public.authorize('scraping_metrics.insert'::text));


create policy "select_policy"
on "public"."scraping_metrics"
as permissive
for select
to public
using (public.authorize('scraping_metrics.select'::text));


create policy "update_policy"
on "public"."scraping_metrics"
as permissive
for update
to public
using (public.authorize('scraping_metrics.update'::text));


create policy "select_policy"
on "public"."searches"
as permissive
for select
to public
using (public.authorize('searches.select'::text));


create policy "select_policy"
on "public"."social_media"
as permissive
for select
to public
using (public.authorize('social_media.select'::text));


create policy "select_policy"
on "public"."spider_metrics"
as permissive
for select
to public
using (public.authorize('spider_metrics.select'::text));


create policy "select_policy"
on "public"."tags"
as permissive
for select
to public
using (public.authorize('tags.select'::text));


create policy "select_policy"
on "public"."user_followers"
as permissive
for select
to public
using (public.authorize('user_followers.select'::text));


create policy "select_policy"
on "public"."user_profiles"
as permissive
for select
to public
using (public.authorize('user_profiles.select'::text));


create policy "delete_policy"
on "public"."embedding_reviews"
as permissive
for delete
to public
using (public.authorize('embedding_reviews.delete'::text));


create policy "insert_policy"
on "public"."embedding_reviews"
as permissive
for insert
to public
with check (public.authorize('embedding_reviews.insert'::text));


create policy "update_policy"
on "public"."embedding_reviews"
as permissive
for update
to public
using (public.authorize('embedding_reviews.update'::text));


create policy "insert_policy"
on "public"."feedbacks"
as permissive
for insert
to public
with check (public.authorize('feedbacks.insert'::text));


create policy "insert_policy"
on "public"."news_summaries"
as permissive
for insert
to public
with check (public.authorize('news_summaries.insert'::text));


create policy "update_policy"
on "public"."news_summaries"
as permissive
for update
to public
using (public.authorize('news_summaries.update'::text));

CREATE TRIGGER update_user_metadata_trigger AFTER INSERT OR UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_user_metadata();


