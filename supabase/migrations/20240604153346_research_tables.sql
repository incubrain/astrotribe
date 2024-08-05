CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

grant delete on table "auth"."audit_log_entries" to "service_role";

grant insert on table "auth"."audit_log_entries" to "service_role";

grant select on table "auth"."audit_log_entries" to "service_role";

grant update on table "auth"."audit_log_entries" to "service_role";

grant delete on table "auth"."flow_state" to "service_role";

grant insert on table "auth"."flow_state" to "service_role";

grant select on table "auth"."flow_state" to "service_role";

grant update on table "auth"."flow_state" to "service_role";

grant delete on table "auth"."identities" to "service_role";

grant insert on table "auth"."identities" to "service_role";

grant select on table "auth"."identities" to "service_role";

grant update on table "auth"."identities" to "service_role";

grant delete on table "auth"."instances" to "service_role";

grant insert on table "auth"."instances" to "service_role";

grant select on table "auth"."instances" to "service_role";

grant update on table "auth"."instances" to "service_role";

grant delete on table "auth"."mfa_amr_claims" to "service_role";

grant insert on table "auth"."mfa_amr_claims" to "service_role";

grant select on table "auth"."mfa_amr_claims" to "service_role";

grant update on table "auth"."mfa_amr_claims" to "service_role";

grant delete on table "auth"."mfa_challenges" to "service_role";

grant insert on table "auth"."mfa_challenges" to "service_role";

grant select on table "auth"."mfa_challenges" to "service_role";

grant update on table "auth"."mfa_challenges" to "service_role";

grant delete on table "auth"."mfa_factors" to "service_role";

grant insert on table "auth"."mfa_factors" to "service_role";

grant select on table "auth"."mfa_factors" to "service_role";

grant update on table "auth"."mfa_factors" to "service_role";

grant delete on table "auth"."one_time_tokens" to "service_role";

grant insert on table "auth"."one_time_tokens" to "service_role";

grant select on table "auth"."one_time_tokens" to "service_role";

grant update on table "auth"."one_time_tokens" to "service_role";

grant delete on table "auth"."refresh_tokens" to "service_role";

grant insert on table "auth"."refresh_tokens" to "service_role";

grant select on table "auth"."refresh_tokens" to "service_role";

grant update on table "auth"."refresh_tokens" to "service_role";

grant delete on table "auth"."saml_providers" to "service_role";

grant insert on table "auth"."saml_providers" to "service_role";

grant select on table "auth"."saml_providers" to "service_role";

grant update on table "auth"."saml_providers" to "service_role";

grant delete on table "auth"."saml_relay_states" to "service_role";

grant insert on table "auth"."saml_relay_states" to "service_role";

grant select on table "auth"."saml_relay_states" to "service_role";

grant update on table "auth"."saml_relay_states" to "service_role";

grant delete on table "auth"."schema_migrations" to "service_role";

grant insert on table "auth"."schema_migrations" to "service_role";

grant select on table "auth"."schema_migrations" to "service_role";

grant update on table "auth"."schema_migrations" to "service_role";

grant delete on table "auth"."sessions" to "service_role";

grant insert on table "auth"."sessions" to "service_role";

grant select on table "auth"."sessions" to "service_role";

grant update on table "auth"."sessions" to "service_role";

grant delete on table "auth"."sso_domains" to "service_role";

grant insert on table "auth"."sso_domains" to "service_role";

grant select on table "auth"."sso_domains" to "service_role";

grant update on table "auth"."sso_domains" to "service_role";

grant delete on table "auth"."sso_providers" to "service_role";

grant insert on table "auth"."sso_providers" to "service_role";

grant select on table "auth"."sso_providers" to "service_role";

grant update on table "auth"."sso_providers" to "service_role";

grant delete on table "auth"."users" to "service_role";

grant insert on table "auth"."users" to "service_role";

grant select on table "auth"."users" to "service_role";

grant update on table "auth"."users" to "service_role";


create sequence "public"."research_embeddings_id_seq";
create sequence "public"."research_metrics_id_seq";

drop trigger if exists "update_user_metadata_trigger" on "public"."user_profiles";

drop policy "delete_policy" on "public"."embeddings";

drop policy "insert_policy" on "public"."embeddings";

drop policy "read_all_policy" on "public"."embeddings";

drop policy "update_policy" on "public"."embeddings";

revoke select on table "public"."embeddings" from "anon";

revoke select on table "public"."embeddings" from "authenticated";

revoke insert on table "public"."embeddings" from "service_role";

revoke select on table "public"."embeddings" from "service_role";

revoke update on table "public"."embeddings" from "service_role";

alter table "public"."embeddings" drop constraint "embeddings_pkey" CASCADE;

drop index if exists "public"."embeddings_pkey";

drop table "public"."embeddings";

create table "public"."embedding_review" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now(),
    "agent_review" boolean default false,
    "human_review" boolean default false,
    "notes" text
);


alter table "public"."embedding_review" enable row level security;

create table "public"."research_authors" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "name" character varying not null,
    "url" character varying not null,
    "email" character varying,
    "affiliations" text[],
    "created_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "is_flagged" boolean default false,
    "research_urls" text[]
);


alter table "public"."research_authors" enable row level security;

create table "public"."research_citations" (
    "url" character varying not null,
    "author" text,
    "title" text,
    "created_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "id" uuid not null,
    "is_flagged" boolean default false,
    "research_urls" text[]
);


alter table "public"."research_citations" enable row level security;

create table "public"."research_embeddings" (
    "id" integer not null default nextval('public.research_embeddings_id_seq'::regclass),
    "research_id" uuid not null,
    "chunk" text,
    "url" character varying,
    "embedding" public.vector(1536),
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "is_flagged" boolean default false,
    "updated_at" timestamp with time zone not null default now(),
    "embedding_review_id" bigint
);

alter sequence "public"."research_embeddings_id_seq" owned by "public"."research_embeddings"."id";

alter table "public"."research_embeddings" enable row level security;

create table "public"."research_figures" (
    "caption" text,
    "src" character varying not null,
    "created_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "id" uuid not null,
    "is_flagged" boolean default false,
    "research_url" text
);


alter table "public"."research_figures" enable row level security;

create table "public"."research_math" (
    "latex" text not null,
    "description" text,
    "created_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "id" uuid not null,
    "is_flagged" boolean default false,
    "research_urls" text[]
);


alter table "public"."research_math" enable row level security;

create table "public"."research_metrics" (
    "id" bigint not null default nextval('public.research_metrics_id_seq'::regclass),
    "research_id" uuid not null,
    "chunks" jsonb not null,
    "created_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "performance" jsonb,
    "count" jsonb,
    "length" jsonb,
    "error_count" smallint,
    "errors" jsonb
);

alter table "public"."research_metrics" add constraint "research_metrics_research_id_fkey" FOREIGN KEY (research_id) REFERENCES public.research(id) on delete cascade not valid;
alter table "public"."research_metrics" validate constraint "research_metrics_research_id_fkey";


alter sequence "public"."research_metrics_id_seq" owned by "public"."research_metrics"."id";

alter table "public"."research_metrics" enable row level security;

create table "public"."research_notes" (
    "body" text not null,
    "created_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "id" uuid not null,
    "is_flagged" boolean default false,
    "research_url" text
);


alter table "public"."research_notes" enable row level security;

create table "public"."research_tables" (
    "caption" text,
    "created_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "id" uuid not null,
    "hash" text,
    "is_flagged" boolean default false,
    "research_urls" text[],
    "rows" jsonb not null,
    "columns" jsonb not null
);


alter table "public"."research_tables" enable row level security;

create table "public"."research_tools" (
    "name" character varying,
    "url" character varying not null,
    "created_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "id" uuid not null default extensions.uuid_generate_v4(),
    "is_flagged" boolean default false,
    "research_urls" text[]
);


alter table "public"."research_tools" enable row level security;

alter table "public"."companies" alter column "created_at" set default now();

alter table "public"."companies" alter column "updated_at" set default now();

alter table "public"."news_embeddings" drop column "embedding_id";

alter table "public"."news_embeddings" add column "chunk" text;

alter table "public"."research" drop column "author";

alter table "public"."research" drop column "body";

alter table "public"."research" drop column "description";

alter table "public"."research" add column "abstract" text;

alter table "public"."research" add column "chunk_success" boolean;

alter table "public"."research" add column "facilities" text;

alter table "public"."research" add column "journal" text;

alter table "public"."research" add column "keywords" text;

alter table "public"."research" add column "month" character varying;

alter table "public"."research" add column "year" character varying;

alter table "public"."research" alter column "url" set data type text using "url"::text;


CREATE UNIQUE INDEX authors_pkey ON public.research_authors USING btree (id);

CREATE UNIQUE INDEX citations_pkey ON public.research_citations USING btree (id);

CREATE UNIQUE INDEX citations_url_key ON public.research_citations USING btree (url);

CREATE UNIQUE INDEX data_tables_pkey ON public.research_tables USING btree (id);

CREATE UNIQUE INDEX embedding_review_pkey ON public.embedding_review USING btree (id);

CREATE UNIQUE INDEX figures_pkey ON public.research_figures USING btree (id);

CREATE UNIQUE INDEX figures_srcs_key ON public.research_figures USING btree (src);

CREATE UNIQUE INDEX math_id_key ON public.research_math USING btree (id);

CREATE UNIQUE INDEX math_latex_key ON public.research_math USING btree (latex);

CREATE UNIQUE INDEX math_pkey ON public.research_math USING btree (id);

CREATE UNIQUE INDEX notes_body_key ON public.research_notes USING btree (body);

CREATE UNIQUE INDEX notes_pkey ON public.research_notes USING btree (id);

CREATE UNIQUE INDEX research_authors_url_key ON public.research_authors USING btree (url);

CREATE UNIQUE INDEX research_embeddings_pkey ON public.research_embeddings USING btree (id);

CREATE UNIQUE INDEX research_metrics_pkey ON public.research_metrics USING btree (id);

CREATE UNIQUE INDEX research_metrics_research_id_key ON public.research_metrics USING btree (research_id);

CREATE UNIQUE INDEX research_tables_hash_key ON public.research_tables USING btree (hash);

CREATE UNIQUE INDEX tools_url_key ON public.research_tools USING btree (url);

CREATE UNIQUE INDEX toolss_pkey ON public.research_tools USING btree (id);

CREATE UNIQUE INDEX unique_id_latex ON public.research_math USING btree (id, latex);

CREATE UNIQUE INDEX unique_id_url ON public.research_citations USING btree (id, url);

alter table "public"."embedding_review" add constraint "embedding_review_pkey" PRIMARY KEY using index "embedding_review_pkey";

alter table "public"."research_authors" add constraint "authors_pkey" PRIMARY KEY using index "authors_pkey";

alter table "public"."research_citations" add constraint "citations_pkey" PRIMARY KEY using index "citations_pkey";

alter table "public"."research_embeddings" add constraint "research_embeddings_pkey" PRIMARY KEY using index "research_embeddings_pkey";

alter table "public"."research_figures" add constraint "figures_pkey" PRIMARY KEY using index "figures_pkey";

alter table "public"."research_math" add constraint "math_pkey" PRIMARY KEY using index "math_pkey";

alter table "public"."research_metrics" add constraint "research_metrics_pkey" PRIMARY KEY using index "research_metrics_pkey";

alter table "public"."research_notes" add constraint "notes_pkey" PRIMARY KEY using index "notes_pkey";

alter table "public"."research_tables" add constraint "data_tables_pkey" PRIMARY KEY using index "data_tables_pkey";

alter table "public"."research_tools" add constraint "toolss_pkey" PRIMARY KEY using index "toolss_pkey";

alter table "public"."research_authors" add constraint "research_authors_url_key" UNIQUE using index "research_authors_url_key";

alter table "public"."research_citations" add constraint "citations_url_key" UNIQUE using index "citations_url_key";

alter table "public"."research_citations" add constraint "unique_id_url" UNIQUE using index "unique_id_url";

alter table "public"."research_figures" add constraint "figures_srcs_key" UNIQUE using index "figures_srcs_key";

alter table "public"."research_math" add constraint "math_id_key" UNIQUE using index "math_id_key";

alter table "public"."research_math" add constraint "math_latex_key" UNIQUE using index "math_latex_key";

alter table "public"."research_math" add constraint "unique_id_latex" UNIQUE using index "unique_id_latex";

alter table "public"."research_metrics" add constraint "research_metrics_research_id_key" UNIQUE using index "research_metrics_research_id_key";

alter table "public"."research_notes" add constraint "notes_body_key" UNIQUE using index "notes_body_key";

alter table "public"."research_tables" add constraint "research_tables_hash_key" UNIQUE using index "research_tables_hash_key";

alter table "public"."research_tools" add constraint "tools_url_key" UNIQUE using index "tools_url_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.calculate_monthly_research_metrics_totals()
 RETURNS TABLE(month_start date, row_count integer, total_chunks numeric, avg_chunk_length double precision, smallest_chunk_length integer, largest_chunk_length integer, total_citations numeric, total_figures numeric, total_math numeric, total_tables numeric, total_notes numeric, total_tools numeric, total_authors numeric, total_chunk_length numeric, total_math_length numeric, total_tools_length numeric, total_authors_length numeric, total_notes_length numeric, total_tables_length numeric, total_abstract_length numeric, total_citations_length numeric, total_figures_length numeric)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        DATE_TRUNC('month', created_at)::DATE AS month_start,
        COUNT(*)::INTEGER AS row_count,
        SUM((count->>'chunks')::NUMERIC) AS total_chunks,
        AVG((chunks->>'avg_length')::FLOAT) AS avg_chunk_length,
        MIN((chunks->>'smallest')::INTEGER) AS smallest_chunk_length,
        MAX((chunks->>'largest')::INTEGER) AS largest_chunk_length,
        SUM((count->>'citations')::NUMERIC) AS total_citations,
        SUM((count->>'figures')::NUMERIC) AS total_figures,
        SUM((count->>'math')::NUMERIC) AS total_math,
        SUM((count->>'tables')::NUMERIC) AS total_tables,
        SUM((count->>'notes')::NUMERIC) AS total_notes,
        SUM((count->>'tools')::NUMERIC) AS total_tools,
        SUM((count->>'authors')::NUMERIC) AS total_authors,
        SUM((length->>'chunks')::NUMERIC) AS total_chunk_length,
        SUM((length->>'math')::NUMERIC) AS total_math_length,
        SUM((length->>'tools')::NUMERIC) AS total_tools_length,
        SUM((length->>'authors')::NUMERIC) AS total_authors_length,
        SUM((length->>'notes')::NUMERIC) AS total_notes_length,
        SUM((length->>'tables')::NUMERIC) AS total_tables_length,
        SUM((length->>'abstract')::NUMERIC) AS total_abstract_length,
        SUM((length->>'citations')::NUMERIC) AS total_citations_length,
        SUM((length->>'figures')::NUMERIC) AS total_figures_length
    FROM research_metrics
    GROUP BY month_start
    ORDER BY month_start;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.calculate_research_metrics_totals()
 RETURNS TABLE(row_count integer, total_chunks numeric, avg_chunk_length double precision, smallest_chunk_length integer, largest_chunk_length integer, total_citations numeric, total_figures numeric, total_math numeric, total_tables numeric, total_notes numeric, total_tools numeric, total_authors numeric, total_chunk_length numeric, total_math_length numeric, total_tools_length numeric, total_authors_length numeric, total_notes_length numeric, total_tables_length numeric, total_abstract_length numeric, total_citations_length numeric, total_figures_length numeric)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER AS row_count,
        SUM((count->>'chunks')::NUMERIC) AS total_chunks,
        AVG((chunks->>'avg_length')::FLOAT) AS avg_chunk_length,
        MIN((chunks->>'smallest')::INTEGER) AS smallest_chunk_length,
        MAX((chunks->>'largest')::INTEGER) AS largest_chunk_length,
        SUM((count->>'citations')::NUMERIC) AS total_citations,
        SUM((count->>'figures')::NUMERIC) AS total_figures,
        SUM((count->>'math')::NUMERIC) AS total_math,
        SUM((count->>'tables')::NUMERIC) AS total_tables,
        SUM((count->>'notes')::NUMERIC) AS total_notes,
        SUM((count->>'tools')::NUMERIC) AS total_tools,
        SUM((count->>'authors')::NUMERIC) AS total_authors,
        SUM((length->>'chunks')::NUMERIC) AS total_chunk_length,
        SUM((length->>'math')::NUMERIC) AS total_math_length,
        SUM((length->>'tools')::NUMERIC) AS total_tools_length,
        SUM((length->>'authors')::NUMERIC) AS total_authors_length,
        SUM((length->>'notes')::NUMERIC) AS total_notes_length,
        SUM((length->>'tables')::NUMERIC) AS total_tables_length,
        SUM((length->>'abstract')::NUMERIC) AS total_abstract_length,
        SUM((length->>'citations')::NUMERIC) AS total_citations_length,
        SUM((length->>'figures')::NUMERIC) AS total_figures_length
    FROM research_metrics;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_citation_ids_by_url(urls character varying[])
 RETURNS TABLE(id uuid, url character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT c.id, c.url
  FROM research_citations c
  WHERE c.url = ANY(urls);
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_citation_ids_by_url(urls text[])
 RETURNS TABLE(id uuid, url text)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT c.id, c.url
  FROM research_citations c
  WHERE c.url = ANY(urls);
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_math_ids_by_latex(latexes text[])
 RETURNS TABLE(id uuid, latex text)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT m.id, m.latex
  FROM research_math m
  WHERE m.latex = ANY(latexes);
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_note_ids_by_body(bodies text[])
 RETURNS TABLE(id uuid, body text)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT n.id, n.body
  FROM research_notes n
  WHERE n.body = ANY(bodies);
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_table_ids_by_hashes(hashes text[])
 RETURNS TABLE(id uuid, hash text)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT t.id, t.hash
  FROM research_tables t
  WHERE t.hash = ANY(hashes);
END;
$function$
;

CREATE OR REPLACE FUNCTION public.insert_company_news_by_source(p_company_id integer, p_source text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Insert into company_news for each news article with the given source
  INSERT INTO company_news (company_id, news_id)
  SELECT p_company_id, n.id
  FROM news n
  WHERE n.source = p_source
  ON CONFLICT DO NOTHING;  -- Avoid duplicate entries
END;
$function$
;

CREATE OR REPLACE FUNCTION public.match_research(query_embedding public.vector, match_threshold double precision, match_count integer)
 RETURNS SETOF public.research_embeddings
 LANGUAGE sql
AS $function$
  select *
  from public.research_embeddings
  where research_embeddings.embedding <=> query_embedding < 1 - match_threshold
  order by research_embeddings.embedding <=> query_embedding asc
  limit least(match_count, 200);
$function$
;

CREATE OR REPLACE FUNCTION public.remove_placeholders(text_array text[])
 RETURNS text[]
 LANGUAGE plpgsql
AS $function$
DECLARE
    -- Variable to store the resulting text array
    result TEXT[];
    -- Variable to store each individual text item
    text_item TEXT;
    -- Regular expression to match placeholders
    regex_pattern TEXT := '\\[\\w+\\([a-zA-Z0-9|]+\\)\\]';
BEGIN
    -- Initialize the result array
    result := ARRAY[]::TEXT[];
    
    -- Loop through each text item in the input array
    FOREACH text_item IN ARRAY text_array LOOP
        -- Replace placeholders with an empty string
        text_item := REGEXP_REPLACE(text_item, regex_pattern, '', 'g');
        -- Append the cleaned text item to the result array
        result := array_append(result, text_item);
    END LOOP;
    
    -- Return the cleaned text array
    RETURN result;
END;
$function$
;

create or replace view "public"."research_metrics_monthly_totals" as  SELECT calculate_monthly_research_metrics_totals.month_start,
    calculate_monthly_research_metrics_totals.row_count,
    calculate_monthly_research_metrics_totals.total_chunks,
    calculate_monthly_research_metrics_totals.avg_chunk_length,
    calculate_monthly_research_metrics_totals.smallest_chunk_length,
    calculate_monthly_research_metrics_totals.largest_chunk_length,
    calculate_monthly_research_metrics_totals.total_citations,
    calculate_monthly_research_metrics_totals.total_figures,
    calculate_monthly_research_metrics_totals.total_math,
    calculate_monthly_research_metrics_totals.total_tables,
    calculate_monthly_research_metrics_totals.total_notes,
    calculate_monthly_research_metrics_totals.total_tools,
    calculate_monthly_research_metrics_totals.total_authors,
    calculate_monthly_research_metrics_totals.total_chunk_length,
    calculate_monthly_research_metrics_totals.total_math_length,
    calculate_monthly_research_metrics_totals.total_tools_length,
    calculate_monthly_research_metrics_totals.total_authors_length,
    calculate_monthly_research_metrics_totals.total_notes_length,
    calculate_monthly_research_metrics_totals.total_tables_length,
    calculate_monthly_research_metrics_totals.total_abstract_length,
    calculate_monthly_research_metrics_totals.total_citations_length,
    calculate_monthly_research_metrics_totals.total_figures_length
   FROM public.calculate_monthly_research_metrics_totals() calculate_monthly_research_metrics_totals(month_start, row_count, total_chunks, avg_chunk_length, smallest_chunk_length, largest_chunk_length, total_citations, total_figures, total_math, total_tables, total_notes, total_tools, total_authors, total_chunk_length, total_math_length, total_tools_length, total_authors_length, total_notes_length, total_tables_length, total_abstract_length, total_citations_length, total_figures_length);


create or replace view "public"."research_metrics_totals" as  SELECT calculate_research_metrics_totals.row_count,
    calculate_research_metrics_totals.total_chunks,
    calculate_research_metrics_totals.avg_chunk_length,
    calculate_research_metrics_totals.smallest_chunk_length,
    calculate_research_metrics_totals.largest_chunk_length,
    calculate_research_metrics_totals.total_citations,
    calculate_research_metrics_totals.total_figures,
    calculate_research_metrics_totals.total_math,
    calculate_research_metrics_totals.total_tables,
    calculate_research_metrics_totals.total_notes,
    calculate_research_metrics_totals.total_tools,
    calculate_research_metrics_totals.total_authors,
    calculate_research_metrics_totals.total_chunk_length,
    calculate_research_metrics_totals.total_math_length,
    calculate_research_metrics_totals.total_tools_length,
    calculate_research_metrics_totals.total_authors_length,
    calculate_research_metrics_totals.total_notes_length,
    calculate_research_metrics_totals.total_tables_length,
    calculate_research_metrics_totals.total_abstract_length,
    calculate_research_metrics_totals.total_citations_length,
    calculate_research_metrics_totals.total_figures_length
   FROM public.calculate_research_metrics_totals() calculate_research_metrics_totals(row_count, total_chunks, avg_chunk_length, smallest_chunk_length, largest_chunk_length, total_citations, total_figures, total_math, total_tables, total_notes, total_tools, total_authors, total_chunk_length, total_math_length, total_tools_length, total_authors_length, total_notes_length, total_tables_length, total_abstract_length, total_citations_length, total_figures_length);


CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.authorize(requested_permission text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    user_role public.app_role_enum;
    v_table_name text;
    operation text;
    full_jwt json; -- Variable to store the entire JWT object for logging
BEGIN
    full_jwt := auth.jwt(); -- Get the full JWT object
    RAISE LOG 'JWT Object: %', full_jwt; -- Log the entire JWT object

    -- Check for service role key in JWT and bypass authorization
    IF (auth.jwt() ->> 'role') = 'service_role' THEN
        RAISE LOG 'Service role detected. Granting access.';
        RETURN TRUE;
    END IF;

    user_role := ((auth.jwt() -> 'app_metadata') ->> 'user_role')::public.app_role_enum;

    -- Check if user_role is present and valid
    IF user_role IS NULL THEN
        RAISE EXCEPTION 'No user role found in JWT';
    END IF;

    RAISE LOG 'Starting authorization check for user role: %', user_role;

    -- Immediately grant access if the user's role is super_admin
    IF user_role = 'super_admin' THEN
        RAISE LOG 'Super admin detected. Granting access.';
        RETURN TRUE;
    END IF;

    -- Parse requested_permission into table_name and operation
    v_table_name := split_part(requested_permission, '.', 1);
    operation := split_part(requested_permission, '.', 2);

    RAISE LOG 'Requested permission involves table: % and operation: %', v_table_name, operation;

    -- Check permissions for other roles based on the operation
    RETURN EXISTS (
        SELECT 1
        FROM public.role_permissions
        WHERE role = user_role
          AND table_name = v_table_name
          AND ((operation = 'select' AND role_permissions.select)
            OR (operation = 'insert' AND role_permissions.insert)
            OR (operation = 'update' AND role_permissions.update)
            OR (operation = 'delete' AND role_permissions.delete))
    );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_user_profile()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$DECLARE
  _username TEXT;
  _given_name TEXT;
  _surname TEXT;
  _avatar TEXT;
BEGIN
  -- Assign username from different potential keys
  _username := COALESCE(
    NEW.raw_user_meta_data ->> 'preferred_username',  -- Used by Twitter, Google, etc.
    NEW.raw_user_meta_data ->> 'user_name',           -- Alternate Twitter key
    NEW.raw_user_meta_data ->> 'nickname',             -- Possible key for other providers
    LOWER(CONCAT(NEW.raw_user_meta_data ->> 'given_name', '_', NEW.raw_user_meta_data ->> 'given_name')) -- email signup
  );

  -- Extract the given name (first name) from different keys
  _given_name := COALESCE(
    NEW.raw_user_meta_data ->> 'given_name',          -- Common key used by Google / email signup
    NEW.raw_user_meta_data ->> 'first_name',          -- Common key used by Facebook, LinkedIn
    (string_to_array(NEW.raw_user_meta_data ->> 'name', ' '))[1]  -- First element from 'name'
  );

  -- Extract the surname (last name) from different keys
  _surname := COALESCE(
    NEW.raw_user_meta_data ->> 'family_name',         -- Common key used by Google
    NEW.raw_user_meta_data ->> 'last_name',           -- Common key used by Facebook, LinkedIn
    NEW.raw_user_meta_data ->> 'surname',           -- email signup
    (string_to_array(NEW.raw_user_meta_data ->> 'name', ' '))[2]  -- Second element from 'name'
  );

  -- Assign avatar URL from different potential keys
  _avatar := COALESCE(
    NEW.raw_user_meta_data ->> 'avatar_url',          -- Used by Twitter
    NEW.raw_user_meta_data ->> 'picture',             -- Common key used by Google, Facebook
    NEW.raw_user_meta_data ->> 'image_url'            -- Possible key for other providers
  );

  -- Insert a new profile record using the new user's ID and email, along with extracted metadata.
  INSERT INTO public.user_profiles (id, email, username, given_name, surname, avatar)
  VALUES (
    NEW.id,
    NEW.email,
    _username,
    _given_name,
    _surname,
    _avatar
  );

  RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.update_user_metadata()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Perform the update
  UPDATE auth.users
  SET raw_user_meta_data = raw_user_meta_data
    || jsonb_build_object(
         'given_name', NEW.given_name,
         'surname', NEW.surname,
         'avatar', COALESCE(NEW.avatar, ''),
         'cover_image', COALESCE(NEW.cover_image, ''),
         'username', NEW.username
       )
  WHERE id = NEW.id;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.users_columns_updateable()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    current_user_role public.app_role_enum;
BEGIN
    -- Example of fetching current user's role from JWT; adjust based on your setup
    current_user_role := (auth.jwt() ->> 'user_role')::public.app_role_enum;

    RAISE LOG 'users_columns_updateable: user with role % attempted to change role or plan', current_user_role;

    -- Allow admins, super_admins, or service_role to change roles and plans
    IF current_user_role IN ('admin', 'super_admin') OR (auth.jwt() ->> 'role') = 'service_role' THEN
        RETURN NEW;
    END IF;

    -- Prevent non-admin users from changing roles and plans
    IF NEW.role IS DISTINCT FROM OLD.role THEN
        RAISE EXCEPTION 'Changing "role" is not allowed.';
    END IF;
    IF NEW.plan IS DISTINCT FROM OLD.plan THEN
        RAISE EXCEPTION 'Changing "plan" is not allowed.';
    END IF;

    RETURN NEW; -- Return the updated row to allow the update to proceed
END;
$function$
;


alter table "public"."research_embeddings" add constraint "public_research_embeddings_embedding_review_id_fkey" FOREIGN KEY (embedding_review_id) REFERENCES public.embedding_review(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;
alter table "public"."research_embeddings" validate constraint "public_research_embeddings_embedding_review_id_fkey";


alter table "public"."research_embeddings" add constraint "research_embeddings_research_id_fkey" FOREIGN KEY (research_id) REFERENCES public.research(id) not valid;
alter table "public"."research_embeddings" validate constraint "research_embeddings_research_id_fkey";

grant delete on table "public"."categories" to "service_role";

grant delete on table "public"."embedding_review" to "anon";

grant insert on table "public"."embedding_review" to "anon";

grant references on table "public"."embedding_review" to "anon";

grant select on table "public"."embedding_review" to "anon";

grant trigger on table "public"."embedding_review" to "anon";

grant truncate on table "public"."embedding_review" to "anon";

grant update on table "public"."embedding_review" to "anon";

grant delete on table "public"."embedding_review" to "authenticated";

grant insert on table "public"."embedding_review" to "authenticated";

grant references on table "public"."embedding_review" to "authenticated";

grant select on table "public"."embedding_review" to "authenticated";

grant trigger on table "public"."embedding_review" to "authenticated";

grant truncate on table "public"."embedding_review" to "authenticated";

grant update on table "public"."embedding_review" to "authenticated";

grant delete on table "public"."embedding_review" to "service_role";

grant insert on table "public"."embedding_review" to "service_role";

grant references on table "public"."embedding_review" to "service_role";

grant select on table "public"."embedding_review" to "service_role";

grant trigger on table "public"."embedding_review" to "service_role";

grant truncate on table "public"."embedding_review" to "service_role";

grant update on table "public"."embedding_review" to "service_role";

grant delete on table "public"."news" to "service_role";

grant delete on table "public"."news_embeddings" to "service_role";

grant delete on table "public"."news_tags" to "service_role";

grant delete on table "public"."research_authors" to "anon";

grant insert on table "public"."research_authors" to "anon";

grant references on table "public"."research_authors" to "anon";

grant select on table "public"."research_authors" to "anon";

grant trigger on table "public"."research_authors" to "anon";

grant truncate on table "public"."research_authors" to "anon";

grant update on table "public"."research_authors" to "anon";

grant delete on table "public"."research_authors" to "authenticated";

grant insert on table "public"."research_authors" to "authenticated";

grant references on table "public"."research_authors" to "authenticated";

grant select on table "public"."research_authors" to "authenticated";

grant trigger on table "public"."research_authors" to "authenticated";

grant truncate on table "public"."research_authors" to "authenticated";

grant update on table "public"."research_authors" to "authenticated";

grant delete on table "public"."research_authors" to "service_role";

grant insert on table "public"."research_authors" to "service_role";

grant references on table "public"."research_authors" to "service_role";

grant select on table "public"."research_authors" to "service_role";

grant trigger on table "public"."research_authors" to "service_role";

grant truncate on table "public"."research_authors" to "service_role";

grant update on table "public"."research_authors" to "service_role";

grant delete on table "public"."research_citations" to "anon";

grant insert on table "public"."research_citations" to "anon";

grant references on table "public"."research_citations" to "anon";

grant select on table "public"."research_citations" to "anon";

grant trigger on table "public"."research_citations" to "anon";

grant truncate on table "public"."research_citations" to "anon";

grant update on table "public"."research_citations" to "anon";

grant delete on table "public"."research_citations" to "authenticated";

grant insert on table "public"."research_citations" to "authenticated";

grant references on table "public"."research_citations" to "authenticated";

grant select on table "public"."research_citations" to "authenticated";

grant trigger on table "public"."research_citations" to "authenticated";

grant truncate on table "public"."research_citations" to "authenticated";

grant update on table "public"."research_citations" to "authenticated";

grant delete on table "public"."research_citations" to "service_role";

grant insert on table "public"."research_citations" to "service_role";

grant references on table "public"."research_citations" to "service_role";

grant select on table "public"."research_citations" to "service_role";

grant trigger on table "public"."research_citations" to "service_role";

grant truncate on table "public"."research_citations" to "service_role";

grant update on table "public"."research_citations" to "service_role";

grant delete on table "public"."research_embeddings" to "anon";

grant insert on table "public"."research_embeddings" to "anon";

grant references on table "public"."research_embeddings" to "anon";

grant select on table "public"."research_embeddings" to "anon";

grant trigger on table "public"."research_embeddings" to "anon";

grant truncate on table "public"."research_embeddings" to "anon";

grant update on table "public"."research_embeddings" to "anon";

grant delete on table "public"."research_embeddings" to "authenticated";

grant insert on table "public"."research_embeddings" to "authenticated";

grant references on table "public"."research_embeddings" to "authenticated";

grant select on table "public"."research_embeddings" to "authenticated";

grant trigger on table "public"."research_embeddings" to "authenticated";

grant truncate on table "public"."research_embeddings" to "authenticated";

grant update on table "public"."research_embeddings" to "authenticated";

grant delete on table "public"."research_embeddings" to "service_role";

grant insert on table "public"."research_embeddings" to "service_role";

grant references on table "public"."research_embeddings" to "service_role";

grant select on table "public"."research_embeddings" to "service_role";

grant trigger on table "public"."research_embeddings" to "service_role";

grant truncate on table "public"."research_embeddings" to "service_role";

grant update on table "public"."research_embeddings" to "service_role";

grant delete on table "public"."research_figures" to "anon";

grant insert on table "public"."research_figures" to "anon";

grant references on table "public"."research_figures" to "anon";

grant select on table "public"."research_figures" to "anon";

grant trigger on table "public"."research_figures" to "anon";

grant truncate on table "public"."research_figures" to "anon";

grant update on table "public"."research_figures" to "anon";

grant delete on table "public"."research_figures" to "authenticated";

grant insert on table "public"."research_figures" to "authenticated";

grant references on table "public"."research_figures" to "authenticated";

grant select on table "public"."research_figures" to "authenticated";

grant trigger on table "public"."research_figures" to "authenticated";

grant truncate on table "public"."research_figures" to "authenticated";

grant update on table "public"."research_figures" to "authenticated";

grant delete on table "public"."research_figures" to "service_role";

grant insert on table "public"."research_figures" to "service_role";

grant references on table "public"."research_figures" to "service_role";

grant select on table "public"."research_figures" to "service_role";

grant trigger on table "public"."research_figures" to "service_role";

grant truncate on table "public"."research_figures" to "service_role";

grant update on table "public"."research_figures" to "service_role";

grant delete on table "public"."research_math" to "anon";

grant insert on table "public"."research_math" to "anon";

grant references on table "public"."research_math" to "anon";

grant select on table "public"."research_math" to "anon";

grant trigger on table "public"."research_math" to "anon";

grant truncate on table "public"."research_math" to "anon";

grant update on table "public"."research_math" to "anon";

grant delete on table "public"."research_math" to "authenticated";

grant insert on table "public"."research_math" to "authenticated";

grant references on table "public"."research_math" to "authenticated";

grant select on table "public"."research_math" to "authenticated";

grant trigger on table "public"."research_math" to "authenticated";

grant truncate on table "public"."research_math" to "authenticated";

grant update on table "public"."research_math" to "authenticated";

grant delete on table "public"."research_math" to "service_role";

grant insert on table "public"."research_math" to "service_role";

grant references on table "public"."research_math" to "service_role";

grant select on table "public"."research_math" to "service_role";

grant trigger on table "public"."research_math" to "service_role";

grant truncate on table "public"."research_math" to "service_role";

grant update on table "public"."research_math" to "service_role";

grant delete on table "public"."research_metrics" to "anon";

grant insert on table "public"."research_metrics" to "anon";

grant references on table "public"."research_metrics" to "anon";

grant select on table "public"."research_metrics" to "anon";

grant trigger on table "public"."research_metrics" to "anon";

grant truncate on table "public"."research_metrics" to "anon";

grant update on table "public"."research_metrics" to "anon";

grant delete on table "public"."research_metrics" to "authenticated";

grant insert on table "public"."research_metrics" to "authenticated";

grant references on table "public"."research_metrics" to "authenticated";

grant select on table "public"."research_metrics" to "authenticated";

grant trigger on table "public"."research_metrics" to "authenticated";

grant truncate on table "public"."research_metrics" to "authenticated";

grant update on table "public"."research_metrics" to "authenticated";

grant delete on table "public"."research_metrics" to "service_role";

grant insert on table "public"."research_metrics" to "service_role";

grant references on table "public"."research_metrics" to "service_role";

grant select on table "public"."research_metrics" to "service_role";

grant trigger on table "public"."research_metrics" to "service_role";

grant truncate on table "public"."research_metrics" to "service_role";

grant update on table "public"."research_metrics" to "service_role";

grant delete on table "public"."research_notes" to "anon";

grant insert on table "public"."research_notes" to "anon";

grant references on table "public"."research_notes" to "anon";

grant select on table "public"."research_notes" to "anon";

grant trigger on table "public"."research_notes" to "anon";

grant truncate on table "public"."research_notes" to "anon";

grant update on table "public"."research_notes" to "anon";

grant delete on table "public"."research_notes" to "authenticated";

grant insert on table "public"."research_notes" to "authenticated";

grant references on table "public"."research_notes" to "authenticated";

grant select on table "public"."research_notes" to "authenticated";

grant trigger on table "public"."research_notes" to "authenticated";

grant truncate on table "public"."research_notes" to "authenticated";

grant update on table "public"."research_notes" to "authenticated";

grant delete on table "public"."research_notes" to "service_role";

grant insert on table "public"."research_notes" to "service_role";

grant references on table "public"."research_notes" to "service_role";

grant select on table "public"."research_notes" to "service_role";

grant trigger on table "public"."research_notes" to "service_role";

grant truncate on table "public"."research_notes" to "service_role";

grant update on table "public"."research_notes" to "service_role";

grant delete on table "public"."research_tables" to "anon";

grant insert on table "public"."research_tables" to "anon";

grant references on table "public"."research_tables" to "anon";

grant select on table "public"."research_tables" to "anon";

grant trigger on table "public"."research_tables" to "anon";

grant truncate on table "public"."research_tables" to "anon";

grant update on table "public"."research_tables" to "anon";

grant delete on table "public"."research_tables" to "authenticated";

grant insert on table "public"."research_tables" to "authenticated";

grant references on table "public"."research_tables" to "authenticated";

grant select on table "public"."research_tables" to "authenticated";

grant trigger on table "public"."research_tables" to "authenticated";

grant truncate on table "public"."research_tables" to "authenticated";

grant update on table "public"."research_tables" to "authenticated";

grant delete on table "public"."research_tables" to "service_role";

grant insert on table "public"."research_tables" to "service_role";

grant references on table "public"."research_tables" to "service_role";

grant select on table "public"."research_tables" to "service_role";

grant trigger on table "public"."research_tables" to "service_role";

grant truncate on table "public"."research_tables" to "service_role";

grant update on table "public"."research_tables" to "service_role";

grant delete on table "public"."research_tools" to "anon";

grant insert on table "public"."research_tools" to "anon";

grant references on table "public"."research_tools" to "anon";

grant select on table "public"."research_tools" to "anon";

grant trigger on table "public"."research_tools" to "anon";

grant truncate on table "public"."research_tools" to "anon";

grant update on table "public"."research_tools" to "anon";

grant delete on table "public"."research_tools" to "authenticated";

grant insert on table "public"."research_tools" to "authenticated";

grant references on table "public"."research_tools" to "authenticated";

grant select on table "public"."research_tools" to "authenticated";

grant trigger on table "public"."research_tools" to "authenticated";

grant truncate on table "public"."research_tools" to "authenticated";

grant update on table "public"."research_tools" to "authenticated";

grant delete on table "public"."research_tools" to "service_role";

grant insert on table "public"."research_tools" to "service_role";

grant references on table "public"."research_tools" to "service_role";

grant select on table "public"."research_tools" to "service_role";

grant trigger on table "public"."research_tools" to "service_role";

grant truncate on table "public"."research_tools" to "service_role";

grant update on table "public"."research_tools" to "service_role";

grant delete on table "public"."tags" to "service_role";

grant delete on table "public"."user_followers" to "service_role";

create policy "Allow read access to all users"
on "public"."research_authors"
as permissive
for select
to public
using (true);


create policy "Allow read access to all users"
on "public"."research_citations"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."research_embeddings"
as permissive
for select
to public
using (true);


create policy "admin_delete"
on "public"."research_embeddings"
as permissive
for delete
to public
using ((((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = ANY (ARRAY['admin'::text, 'super_admin'::text])));


create policy "super_admin_update"
on "public"."research_embeddings"
as permissive
for update
to public
using ((((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = ANY (ARRAY['admin'::text, 'super_admin'::text])))
with check ((((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = ANY (ARRAY['admin'::text, 'super_admin'::text])));


create policy "Allow read access to all users"
on "public"."research_figures"
as permissive
for select
to public
using (true);


create policy "Allow read access to all users"
on "public"."research_math"
as permissive
for select
to public
using (true);


create policy "Allow read access to all users"
on "public"."research_metrics"
as permissive
for select
to public
using (true);


create policy "Allow read access to all users"
on "public"."research_notes"
as permissive
for select
to public
using (true);


create policy "Allow read access to all users"
on "public"."research_tables"
as permissive
for select
to public
using (true);


create policy "Allow read access to all users"
on "public"."research_tools"
as permissive
for select
to public
using (true);


CREATE TRIGGER update_authors_updated_at BEFORE UPDATE ON public.research_authors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_citations_updated_at BEFORE UPDATE ON public.research_citations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_figures_updated_at BEFORE UPDATE ON public.research_figures FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_math_updated_at BEFORE UPDATE ON public.research_math FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_research_metrics_updated_at BEFORE UPDATE ON public.research_metrics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON public.research_notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_data_tables_updated_at BEFORE UPDATE ON public.research_tables FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tools_updated_at BEFORE UPDATE ON public.research_tools FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_metadata_trigger AFTER UPDATE ON public.user_profiles FOR EACH ROW WHEN (((old.given_name IS DISTINCT FROM new.given_name) OR (old.surname IS DISTINCT FROM new.surname) OR (old.avatar IS DISTINCT FROM new.avatar) OR (old.cover_image IS DISTINCT FROM new.cover_image))) EXECUTE FUNCTION public.update_user_metadata();


