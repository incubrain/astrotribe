drop trigger if exists "update_classified_urls_timestamp" on "public"."classified_urls";

drop trigger if exists "update_company_urls_timestamp" on "public"."company_urls";

drop trigger if exists "update_job_configs_timestamp" on "public"."job_configs";

drop trigger if exists "update_job_metrics_timestamp" on "public"."job_metrics";

drop trigger if exists "update_job_queue_stats_timestamp" on "public"."job_queue_stats";

drop trigger if exists "update_job_versions_timestamp" on "public"."job_versions";

drop trigger if exists "update_workflow_jobs_timestamp" on "public"."workflow_jobs";

revoke delete on table "public"."classified_urls" from "anon";

revoke insert on table "public"."classified_urls" from "anon";

revoke references on table "public"."classified_urls" from "anon";

revoke select on table "public"."classified_urls" from "anon";

revoke trigger on table "public"."classified_urls" from "anon";

revoke truncate on table "public"."classified_urls" from "anon";

revoke update on table "public"."classified_urls" from "anon";

revoke delete on table "public"."classified_urls" from "authenticated";

revoke insert on table "public"."classified_urls" from "authenticated";

revoke references on table "public"."classified_urls" from "authenticated";

revoke select on table "public"."classified_urls" from "authenticated";

revoke trigger on table "public"."classified_urls" from "authenticated";

revoke truncate on table "public"."classified_urls" from "authenticated";

revoke update on table "public"."classified_urls" from "authenticated";

revoke delete on table "public"."classified_urls" from "service_role";

revoke insert on table "public"."classified_urls" from "service_role";

revoke references on table "public"."classified_urls" from "service_role";

revoke select on table "public"."classified_urls" from "service_role";

revoke trigger on table "public"."classified_urls" from "service_role";

revoke truncate on table "public"."classified_urls" from "service_role";

revoke update on table "public"."classified_urls" from "service_role";

revoke delete on table "public"."company_urls" from "anon";

revoke insert on table "public"."company_urls" from "anon";

revoke references on table "public"."company_urls" from "anon";

revoke select on table "public"."company_urls" from "anon";

revoke trigger on table "public"."company_urls" from "anon";

revoke truncate on table "public"."company_urls" from "anon";

revoke update on table "public"."company_urls" from "anon";

revoke delete on table "public"."company_urls" from "authenticated";

revoke insert on table "public"."company_urls" from "authenticated";

revoke references on table "public"."company_urls" from "authenticated";

revoke select on table "public"."company_urls" from "authenticated";

revoke trigger on table "public"."company_urls" from "authenticated";

revoke truncate on table "public"."company_urls" from "authenticated";

revoke update on table "public"."company_urls" from "authenticated";

revoke delete on table "public"."company_urls" from "service_role";

revoke insert on table "public"."company_urls" from "service_role";

revoke references on table "public"."company_urls" from "service_role";

revoke select on table "public"."company_urls" from "service_role";

revoke trigger on table "public"."company_urls" from "service_role";

revoke truncate on table "public"."company_urls" from "service_role";

revoke update on table "public"."company_urls" from "service_role";

revoke delete on table "public"."job_configs" from "anon";

revoke insert on table "public"."job_configs" from "anon";

revoke references on table "public"."job_configs" from "anon";

revoke select on table "public"."job_configs" from "anon";

revoke trigger on table "public"."job_configs" from "anon";

revoke truncate on table "public"."job_configs" from "anon";

revoke update on table "public"."job_configs" from "anon";

revoke delete on table "public"."job_configs" from "authenticated";

revoke insert on table "public"."job_configs" from "authenticated";

revoke references on table "public"."job_configs" from "authenticated";

revoke select on table "public"."job_configs" from "authenticated";

revoke trigger on table "public"."job_configs" from "authenticated";

revoke truncate on table "public"."job_configs" from "authenticated";

revoke update on table "public"."job_configs" from "authenticated";

revoke delete on table "public"."job_configs" from "service_role";

revoke insert on table "public"."job_configs" from "service_role";

revoke references on table "public"."job_configs" from "service_role";

revoke select on table "public"."job_configs" from "service_role";

revoke trigger on table "public"."job_configs" from "service_role";

revoke truncate on table "public"."job_configs" from "service_role";

revoke update on table "public"."job_configs" from "service_role";

revoke delete on table "public"."job_locks" from "anon";

revoke insert on table "public"."job_locks" from "anon";

revoke references on table "public"."job_locks" from "anon";

revoke select on table "public"."job_locks" from "anon";

revoke trigger on table "public"."job_locks" from "anon";

revoke truncate on table "public"."job_locks" from "anon";

revoke update on table "public"."job_locks" from "anon";

revoke delete on table "public"."job_locks" from "authenticated";

revoke insert on table "public"."job_locks" from "authenticated";

revoke references on table "public"."job_locks" from "authenticated";

revoke select on table "public"."job_locks" from "authenticated";

revoke trigger on table "public"."job_locks" from "authenticated";

revoke truncate on table "public"."job_locks" from "authenticated";

revoke update on table "public"."job_locks" from "authenticated";

revoke delete on table "public"."job_locks" from "service_role";

revoke insert on table "public"."job_locks" from "service_role";

revoke references on table "public"."job_locks" from "service_role";

revoke select on table "public"."job_locks" from "service_role";

revoke trigger on table "public"."job_locks" from "service_role";

revoke truncate on table "public"."job_locks" from "service_role";

revoke update on table "public"."job_locks" from "service_role";

revoke delete on table "public"."job_metrics" from "anon";

revoke insert on table "public"."job_metrics" from "anon";

revoke references on table "public"."job_metrics" from "anon";

revoke select on table "public"."job_metrics" from "anon";

revoke trigger on table "public"."job_metrics" from "anon";

revoke truncate on table "public"."job_metrics" from "anon";

revoke update on table "public"."job_metrics" from "anon";

revoke delete on table "public"."job_metrics" from "authenticated";

revoke insert on table "public"."job_metrics" from "authenticated";

revoke references on table "public"."job_metrics" from "authenticated";

revoke select on table "public"."job_metrics" from "authenticated";

revoke trigger on table "public"."job_metrics" from "authenticated";

revoke truncate on table "public"."job_metrics" from "authenticated";

revoke update on table "public"."job_metrics" from "authenticated";

revoke delete on table "public"."job_metrics" from "service_role";

revoke insert on table "public"."job_metrics" from "service_role";

revoke references on table "public"."job_metrics" from "service_role";

revoke select on table "public"."job_metrics" from "service_role";

revoke trigger on table "public"."job_metrics" from "service_role";

revoke truncate on table "public"."job_metrics" from "service_role";

revoke update on table "public"."job_metrics" from "service_role";

revoke delete on table "public"."job_queue_stats" from "anon";

revoke insert on table "public"."job_queue_stats" from "anon";

revoke references on table "public"."job_queue_stats" from "anon";

revoke select on table "public"."job_queue_stats" from "anon";

revoke trigger on table "public"."job_queue_stats" from "anon";

revoke truncate on table "public"."job_queue_stats" from "anon";

revoke update on table "public"."job_queue_stats" from "anon";

revoke delete on table "public"."job_queue_stats" from "authenticated";

revoke insert on table "public"."job_queue_stats" from "authenticated";

revoke references on table "public"."job_queue_stats" from "authenticated";

revoke select on table "public"."job_queue_stats" from "authenticated";

revoke trigger on table "public"."job_queue_stats" from "authenticated";

revoke truncate on table "public"."job_queue_stats" from "authenticated";

revoke update on table "public"."job_queue_stats" from "authenticated";

revoke delete on table "public"."job_queue_stats" from "service_role";

revoke insert on table "public"."job_queue_stats" from "service_role";

revoke references on table "public"."job_queue_stats" from "service_role";

revoke select on table "public"."job_queue_stats" from "service_role";

revoke trigger on table "public"."job_queue_stats" from "service_role";

revoke truncate on table "public"."job_queue_stats" from "service_role";

revoke update on table "public"."job_queue_stats" from "service_role";

revoke delete on table "public"."job_versions" from "anon";

revoke insert on table "public"."job_versions" from "anon";

revoke references on table "public"."job_versions" from "anon";

revoke select on table "public"."job_versions" from "anon";

revoke trigger on table "public"."job_versions" from "anon";

revoke truncate on table "public"."job_versions" from "anon";

revoke update on table "public"."job_versions" from "anon";

revoke delete on table "public"."job_versions" from "authenticated";

revoke insert on table "public"."job_versions" from "authenticated";

revoke references on table "public"."job_versions" from "authenticated";

revoke select on table "public"."job_versions" from "authenticated";

revoke trigger on table "public"."job_versions" from "authenticated";

revoke truncate on table "public"."job_versions" from "authenticated";

revoke update on table "public"."job_versions" from "authenticated";

revoke delete on table "public"."job_versions" from "service_role";

revoke insert on table "public"."job_versions" from "service_role";

revoke references on table "public"."job_versions" from "service_role";

revoke select on table "public"."job_versions" from "service_role";

revoke trigger on table "public"."job_versions" from "service_role";

revoke truncate on table "public"."job_versions" from "service_role";

revoke update on table "public"."job_versions" from "service_role";

revoke delete on table "public"."workflow_jobs" from "anon";

revoke insert on table "public"."workflow_jobs" from "anon";

revoke references on table "public"."workflow_jobs" from "anon";

revoke select on table "public"."workflow_jobs" from "anon";

revoke trigger on table "public"."workflow_jobs" from "anon";

revoke truncate on table "public"."workflow_jobs" from "anon";

revoke update on table "public"."workflow_jobs" from "anon";

revoke delete on table "public"."workflow_jobs" from "authenticated";

revoke insert on table "public"."workflow_jobs" from "authenticated";

revoke references on table "public"."workflow_jobs" from "authenticated";

revoke select on table "public"."workflow_jobs" from "authenticated";

revoke trigger on table "public"."workflow_jobs" from "authenticated";

revoke truncate on table "public"."workflow_jobs" from "authenticated";

revoke update on table "public"."workflow_jobs" from "authenticated";

revoke delete on table "public"."workflow_jobs" from "service_role";

revoke insert on table "public"."workflow_jobs" from "service_role";

revoke references on table "public"."workflow_jobs" from "service_role";

revoke select on table "public"."workflow_jobs" from "service_role";

revoke trigger on table "public"."workflow_jobs" from "service_role";

revoke truncate on table "public"."workflow_jobs" from "service_role";

revoke update on table "public"."workflow_jobs" from "service_role";

alter table "public"."classified_urls" drop constraint "classified_urls_url_key";

alter table "public"."company_urls" drop constraint "company_urls_url_key";

alter table "public"."company_urls" drop constraint "public_company_urls_company_id_fkey";

alter table "public"."job_configs" drop constraint "job_configs_name_key";

alter table "public"."job_locks" drop constraint "job_locks_job_name_lock_key_key";

alter table "public"."job_queue_stats" drop constraint "job_queue_stats_queue_name_key";

alter table "public"."job_versions" drop constraint "job_versions_job_name_version_key";

alter table "public"."workflow_jobs" drop constraint "workflow_jobs_workflow_id_fkey";

alter table "public"."workflow_jobs" drop constraint "workflow_jobs_workflow_id_job_name_key";

alter table "public"."classified_urls" drop constraint "classified_urls_pkey";

alter table "public"."company_urls" drop constraint "company_urls_pkey";

alter table "public"."job_configs" drop constraint "job_configs_pkey";

alter table "public"."job_locks" drop constraint "job_locks_pkey";

alter table "public"."job_metrics" drop constraint "job_metrics_pkey";

alter table "public"."job_queue_stats" drop constraint "job_queue_stats_pkey";

alter table "public"."job_versions" drop constraint "job_versions_pkey";

alter table "public"."workflow_jobs" drop constraint "workflow_jobs_pkey";

drop index if exists "public"."classified_urls_pkey";

drop index if exists "public"."classified_urls_url_key";

drop index if exists "public"."company_urls_pkey";

drop index if exists "public"."company_urls_url_key";

drop index if exists "public"."idx_job_locks_expires_at";

drop index if exists "public"."idx_job_metrics_created_at";

drop index if exists "public"."idx_job_metrics_job_name";

drop index if exists "public"."idx_job_metrics_status";

drop index if exists "public"."idx_job_queue_stats_queue_name";

drop index if exists "public"."idx_job_versions_created_at";

drop index if exists "public"."idx_job_versions_job_name";

drop index if exists "public"."idx_unique_url";

drop index if exists "public"."idx_workflow_jobs_status";

drop index if exists "public"."idx_workflow_jobs_workflow_id";

drop index if exists "public"."job_configs_name_key";

drop index if exists "public"."job_configs_pkey";

drop index if exists "public"."job_locks_job_name_lock_key_key";

drop index if exists "public"."job_locks_pkey";

drop index if exists "public"."job_metrics_pkey";

drop index if exists "public"."job_queue_stats_pkey";

drop index if exists "public"."job_queue_stats_queue_name_key";

drop index if exists "public"."job_versions_job_name_version_key";

drop index if exists "public"."job_versions_pkey";

drop index if exists "public"."workflow_jobs_pkey";

drop index if exists "public"."workflow_jobs_workflow_id_job_name_key";

drop table "public"."classified_urls";

drop table "public"."company_urls";

drop table "public"."job_configs";

drop table "public"."job_locks";

drop table "public"."job_metrics";

drop table "public"."job_queue_stats";

drop table "public"."job_versions";

drop table "public"."workflow_jobs";

create table "public"."business_domains" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "name" character varying(100) not null,
    "slug" character varying(100) not null,
    "description" text,
    "parent_id" uuid,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);

create table "public"."categorized_urls" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "original_url" text not null,
    "normalized_url" text not null,
    "domain_id" uuid not null,
    "priority" character varying(20) not null,
    "confidence" numeric(5,4) not null,
    "categorizer_version" character varying(20) not null,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP
);

drop sequence if exists "public"."classified_urls_id_seq";

drop sequence if exists "public"."company_urls_id_seq";

CREATE UNIQUE INDEX business_domains_pkey ON public.business_domains USING btree (id);

CREATE UNIQUE INDEX categorized_urls_pkey ON public.categorized_urls USING btree (id);

CREATE INDEX idx_business_domains_parent_id ON public.business_domains USING btree (parent_id);

CREATE INDEX idx_categorized_urls_domain_id ON public.categorized_urls USING btree (domain_id);

CREATE INDEX idx_categorized_urls_normalized_url ON public.categorized_urls USING btree (normalized_url);

CREATE INDEX idx_categorized_urls_priority ON public.categorized_urls USING btree (priority);

CREATE INDEX idx_companies_content_status ON public.companies USING btree (content_status);

CREATE INDEX idx_companies_failed_count ON public.companies USING btree (failed_count);

CREATE INDEX idx_companies_scraped_at ON public.companies USING btree (scraped_at NULLS FIRST);

CREATE INDEX idx_companies_url_null ON public.companies USING btree (url) WHERE (url IS NOT NULL);

CREATE UNIQUE INDEX unique_domain_name ON public.business_domains USING btree (name);

CREATE UNIQUE INDEX unique_domain_slug ON public.business_domains USING btree (slug);

CREATE UNIQUE INDEX unique_normalized_url ON public.categorized_urls USING btree (normalized_url);

alter table "public"."business_domains" add constraint "business_domains_pkey" PRIMARY KEY using index "business_domains_pkey";

alter table "public"."categorized_urls" add constraint "categorized_urls_pkey" PRIMARY KEY using index "categorized_urls_pkey";

alter table "public"."business_domains" add constraint "business_domains_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES public.business_domains(id) not valid;

alter table "public"."business_domains" validate constraint "business_domains_parent_id_fkey";

alter table "public"."business_domains" add constraint "unique_domain_name" UNIQUE using index "unique_domain_name";

alter table "public"."business_domains" add constraint "unique_domain_slug" UNIQUE using index "unique_domain_slug";

alter table "public"."categorized_urls" add constraint "categorized_urls_domain_id_fkey" FOREIGN KEY (domain_id) REFERENCES public.business_domains(id) not valid;

alter table "public"."categorized_urls" validate constraint "categorized_urls_domain_id_fkey";

alter table "public"."categorized_urls" add constraint "unique_normalized_url" UNIQUE using index "unique_normalized_url";

alter table "public"."categorized_urls" add constraint "valid_confidence" CHECK (((confidence >= (0)::numeric) AND (confidence <= (1)::numeric))) not valid;

alter table "public"."categorized_urls" validate constraint "valid_confidence";

alter table "public"."categorized_urls" add constraint "valid_priority" CHECK (((priority)::text = ANY ((ARRAY['not_important'::character varying, 'low'::character varying, 'medium'::character varying, 'high'::character varying])::text[]))) not valid;

alter table "public"."categorized_urls" validate constraint "valid_priority";

set check_function_bodies = off;

DROP FUNCTION IF EXISTS public.get_active_ads();

CREATE OR REPLACE FUNCTION public.get_active_ads()
 RETURNS TABLE(id uuid, package_id uuid, variants jsonb, start_date timestamp with time zone, end_date timestamp with time zone, active boolean)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.package_id,
        jsonb_agg(
            jsonb_build_object(
                'id', v.id,
                'content', v.content,
                'is_control', v.is_control,
                'active', v.active
            )
        ) as variants,
        a.start_date,
        a.end_date,
        a.active
    FROM public.ads a
    JOIN public.ad_variants v ON v.ad_id = a.id
    WHERE a.active = true
    AND a.end_date >= CURRENT_TIMESTAMP
    AND a.start_date <= CURRENT_TIMESTAMP
    GROUP BY a.id, a.package_id, a.company_id;

END;

$function$;

CREATE OR REPLACE FUNCTION public.update_user_plan()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Check if the 'status' field was updated and is either 'active' or 'completed'
  IF NEW.status <> OLD.status AND (NEW.status = 'active' OR NEW.status = 'completed') THEN
    -- Update the 'plan' field in the 'user_profiles' table based on the 'plan_id' from 'customer_subscriptions'
    UPDATE public.user_profiles
    SET plan = LOWER((SELECT name FROM public.customer_subscription_plans WHERE id = NEW.plan_id))::public.app_plan_enum
    WHERE id = NEW.user_id;

END IF;

-- Return the new record (required for the trigger)
  RETURN NEW;

END;

$function$;

grant delete on table "public"."business_domains" to "anon";

grant insert on table "public"."business_domains" to "anon";

grant references on table "public"."business_domains" to "anon";

grant select on table "public"."business_domains" to "anon";

grant trigger on table "public"."business_domains" to "anon";

grant truncate on table "public"."business_domains" to "anon";

grant update on table "public"."business_domains" to "anon";

grant delete on table "public"."business_domains" to "authenticated";

grant insert on table "public"."business_domains" to "authenticated";

grant references on table "public"."business_domains" to "authenticated";

grant select on table "public"."business_domains" to "authenticated";

grant trigger on table "public"."business_domains" to "authenticated";

grant truncate on table "public"."business_domains" to "authenticated";

grant update on table "public"."business_domains" to "authenticated";

grant delete on table "public"."business_domains" to "service_role";

grant insert on table "public"."business_domains" to "service_role";

grant references on table "public"."business_domains" to "service_role";

grant select on table "public"."business_domains" to "service_role";

grant trigger on table "public"."business_domains" to "service_role";

grant truncate on table "public"."business_domains" to "service_role";

grant update on table "public"."business_domains" to "service_role";

grant delete on table "public"."categorized_urls" to "anon";

grant insert on table "public"."categorized_urls" to "anon";

grant references on table "public"."categorized_urls" to "anon";

grant select on table "public"."categorized_urls" to "anon";

grant trigger on table "public"."categorized_urls" to "anon";

grant truncate on table "public"."categorized_urls" to "anon";

grant update on table "public"."categorized_urls" to "anon";

grant delete on table "public"."categorized_urls" to "authenticated";

grant insert on table "public"."categorized_urls" to "authenticated";

grant references on table "public"."categorized_urls" to "authenticated";

grant select on table "public"."categorized_urls" to "authenticated";

grant trigger on table "public"."categorized_urls" to "authenticated";

grant truncate on table "public"."categorized_urls" to "authenticated";

grant update on table "public"."categorized_urls" to "authenticated";

grant delete on table "public"."categorized_urls" to "service_role";

grant insert on table "public"."categorized_urls" to "service_role";

grant references on table "public"."categorized_urls" to "service_role";

grant select on table "public"."categorized_urls" to "service_role";

grant trigger on table "public"."categorized_urls" to "service_role";

grant truncate on table "public"."categorized_urls" to "service_role";

grant update on table "public"."categorized_urls" to "service_role";

CREATE TRIGGER update_business_domains_timestamp BEFORE UPDATE ON public.business_domains FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
