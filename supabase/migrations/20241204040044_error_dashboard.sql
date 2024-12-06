

ALTER DATABASE postgres SET search_path TO public;

create type "public"."error_severity" as enum ('low', 'medium', 'high', 'critical');

create type "public"."error_type" as enum ('UPLOAD_ERROR', 'CONNECTION_ERROR', 'AUTHENTICATION_ERROR', 'VALIDATION_ERROR', 'NOT_FOUND_ERROR', 'SERVER_ERROR', 'NETWORK_ERROR', 'DATABASE_ERROR', 'UNKNOWN_ERROR');

alter table "public"."companies" drop constraint "public_companies_id_fkey";

alter table "public"."feed_sources" drop constraint "fk_feed_sources_content_sources";

drop index if exists "public"."idx_feed_sources_source_id";

create table "public"."error_logs" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "service_name" character varying(100) not null,
    "error_type" public.error_type not null,
    "severity" public.error_severity not null,
    "message" text not null,
    "stack_trace" text,
    "metadata" jsonb default '{}'::jsonb,
    "context" jsonb default '{}'::jsonb,
    "user_id" uuid,
    "request_id" uuid,
    "correlation_id" uuid,
    "environment" character varying(50) not null,
    "created_at" timestamp with time zone default now(),
    "error_hash" text,
    "error_pattern" text,
    "is_new_pattern" boolean default true,
    "github_repo" text,
    "related_errors" jsonb,
    "frequency_data" jsonb
);


alter table "public"."error_logs" enable row level security;

alter table "public"."feed_sources" drop column "source_id";

alter table "public"."feed_sources" add column "content_source_id" bigint;

CREATE INDEX error_logs_created_at_idx ON public.error_logs USING btree (created_at DESC);

CREATE INDEX error_logs_error_type_idx ON public.error_logs USING btree (error_type);

CREATE UNIQUE INDEX error_logs_pkey ON public.error_logs USING btree (id);

CREATE INDEX error_logs_service_name_idx ON public.error_logs USING btree (service_name);

CREATE INDEX error_logs_severity_idx ON public.error_logs USING btree (severity);

CREATE INDEX idx_error_hash ON public.error_logs USING btree (error_hash);

CREATE INDEX idx_error_pattern ON public.error_logs USING btree (error_pattern);

CREATE INDEX idx_feed_sources_source_id ON public.feed_sources USING btree (content_source_id);

alter table "public"."error_logs" add constraint "error_logs_pkey" PRIMARY KEY using index "error_logs_pkey";

alter table "public"."feed_sources" add constraint "fk_feed_sources_content_sources" FOREIGN KEY (content_source_id) REFERENCES public.content_sources(id) not valid;

alter table "public"."feed_sources" validate constraint "fk_feed_sources_content_sources";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_default_bookmark_folder()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    INSERT INTO public.bookmark_folders (
        name,
        user_id,
        is_default,
        is_favorite,
        color
    ) VALUES (
        'Default',
        NEW.id,
        true,
        false,
        '#94A3B8'
    );
    RETURN NEW;
END;
$function$
;

create materialized view "public"."error_correlations" as  WITH error_sequences AS (
         SELECT e1.service_name AS source_service,
            e1.error_pattern AS source_pattern,
            e2.service_name AS target_service,
            e2.error_pattern AS target_pattern,
            count(*) AS correlation_count,
            avg(EXTRACT(epoch FROM (e2.created_at - e1.created_at))) AS avg_time_difference
           FROM (public.error_logs e1
             JOIN public.error_logs e2 ON (((e2.created_at > e1.created_at) AND (e2.created_at < (e1.created_at + '00:05:00'::interval)) AND (e2.id <> e1.id))))
          WHERE (e1.created_at > (now() - '7 days'::interval))
          GROUP BY e1.service_name, e1.error_pattern, e2.service_name, e2.error_pattern
         HAVING (count(*) >= 3)
        )
 SELECT error_sequences.source_service,
    error_sequences.source_pattern,
    error_sequences.target_service,
    error_sequences.target_pattern,
    error_sequences.correlation_count,
    error_sequences.avg_time_difference
   FROM error_sequences;


create or replace view "public"."error_metrics" as  SELECT date_trunc('hour'::text, public.error_logs.created_at) AS time_bucket,
    public.error_logs.service_name,
    public.error_logs.error_type,
    public.error_logs.severity,
    count(*) AS error_count
   FROM public.error_logs
  GROUP BY (date_trunc('hour'::text, public.error_logs.created_at)), public.error_logs.service_name, public.error_logs.error_type, public.error_logs.severity;


create materialized view "public"."error_patterns" as  WITH pattern_stats AS (
         SELECT public.error_logs.error_hash,
            public.error_logs.error_pattern,
            public.error_logs.service_name,
            count(*) AS occurrence_count,
            min(public.error_logs.created_at) AS first_seen,
            max(public.error_logs.created_at) AS last_seen,
            array_agg(DISTINCT public.error_logs.severity) AS severity_levels,
            jsonb_agg(DISTINCT public.error_logs.context) AS contexts,
            count(DISTINCT date_trunc('day'::text, public.error_logs.created_at)) AS days_active
           FROM public.error_logs
          WHERE (public.error_logs.created_at > (now() - '7 days'::interval))
          GROUP BY public.error_logs.error_hash, public.error_logs.error_pattern, public.error_logs.service_name
        )
 SELECT pattern_stats.error_hash,
    pattern_stats.error_pattern,
    pattern_stats.service_name,
    pattern_stats.occurrence_count,
    pattern_stats.first_seen,
    pattern_stats.last_seen,
    pattern_stats.severity_levels,
    pattern_stats.contexts,
    pattern_stats.days_active,
    ((pattern_stats.occurrence_count)::double precision / (GREATEST(pattern_stats.days_active, (1)::bigint))::double precision) AS daily_frequency,
        CASE
            WHEN (pattern_stats.first_seen > (now() - '24:00:00'::interval)) THEN true
            ELSE false
        END AS is_new
   FROM pattern_stats;


CREATE OR REPLACE FUNCTION public.refresh_error_views()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY error_patterns;
  REFRESH MATERIALIZED VIEW CONCURRENTLY error_correlations;
END;
$function$
;

grant delete on table "public"."error_logs" to "anon";

grant insert on table "public"."error_logs" to "anon";

grant references on table "public"."error_logs" to "anon";

grant select on table "public"."error_logs" to "anon";

grant trigger on table "public"."error_logs" to "anon";

grant truncate on table "public"."error_logs" to "anon";

grant update on table "public"."error_logs" to "anon";

grant delete on table "public"."error_logs" to "authenticated";

grant insert on table "public"."error_logs" to "authenticated";

grant references on table "public"."error_logs" to "authenticated";

grant select on table "public"."error_logs" to "authenticated";

grant trigger on table "public"."error_logs" to "authenticated";

grant truncate on table "public"."error_logs" to "authenticated";

grant update on table "public"."error_logs" to "authenticated";

grant delete on table "public"."error_logs" to "service_role";

grant insert on table "public"."error_logs" to "service_role";

grant references on table "public"."error_logs" to "service_role";

grant select on table "public"."error_logs" to "service_role";

grant trigger on table "public"."error_logs" to "service_role";

grant truncate on table "public"."error_logs" to "service_role";

grant update on table "public"."error_logs" to "service_role";

create policy "delete_policy"
on "public"."error_logs"
as permissive
for delete
to public
using (public.authorize('error_logs.delete'::text));


create policy "insert_policy"
on "public"."error_logs"
as permissive
for insert
to public
with check (public.authorize('error_logs.insert'::text));


create policy "select_policy"
on "public"."error_logs"
as permissive
for select
to public
using (public.authorize('error_logs.select'::text));


create policy "update_policy"
on "public"."error_logs"
as permissive
for update
to public
using (public.authorize('error_logs.update'::text));

CREATE TRIGGER ensure_default_bookmark_folder AFTER INSERT ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.create_default_bookmark_folder();


