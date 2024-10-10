create sequence "public"."metric_definitions_id_seq";
create sequence "public"."spider_metrics_id_seq";

drop policy "delete_policy" on "public"."metrics_spider";

drop policy "insert_policy" on "public"."metrics_spider";

drop policy "select_policy" on "public"."metrics_spider";

drop policy "update_policy" on "public"."metrics_spider";

drop policy "Enable read access for all users" on "public"."scraping_metrics";

drop policy "delete_policy" on "public"."scraping_metrics";

drop policy "insert_policy" on "public"."scraping_metrics";

drop policy "select_policy" on "public"."scraping_metrics";

drop policy "update_policy" on "public"."scraping_metrics";

revoke delete on table "public"."metrics_spider" from "anon";

revoke insert on table "public"."metrics_spider" from "anon";

revoke references on table "public"."metrics_spider" from "anon";

revoke select on table "public"."metrics_spider" from "anon";

revoke trigger on table "public"."metrics_spider" from "anon";

revoke truncate on table "public"."metrics_spider" from "anon";

revoke update on table "public"."metrics_spider" from "anon";

revoke delete on table "public"."metrics_spider" from "authenticated";

revoke insert on table "public"."metrics_spider" from "authenticated";

revoke references on table "public"."metrics_spider" from "authenticated";

revoke select on table "public"."metrics_spider" from "authenticated";

revoke trigger on table "public"."metrics_spider" from "authenticated";

revoke truncate on table "public"."metrics_spider" from "authenticated";

revoke update on table "public"."metrics_spider" from "authenticated";

revoke delete on table "public"."metrics_spider" from "service_role";

revoke insert on table "public"."metrics_spider" from "service_role";

revoke references on table "public"."metrics_spider" from "service_role";

revoke select on table "public"."metrics_spider" from "service_role";

revoke trigger on table "public"."metrics_spider" from "service_role";

revoke truncate on table "public"."metrics_spider" from "service_role";

revoke update on table "public"."metrics_spider" from "service_role";

revoke delete on table "public"."scraping_metrics" from "anon";

revoke insert on table "public"."scraping_metrics" from "anon";

revoke references on table "public"."scraping_metrics" from "anon";

revoke select on table "public"."scraping_metrics" from "anon";

revoke trigger on table "public"."scraping_metrics" from "anon";

revoke truncate on table "public"."scraping_metrics" from "anon";

revoke update on table "public"."scraping_metrics" from "anon";

revoke delete on table "public"."scraping_metrics" from "authenticated";

revoke insert on table "public"."scraping_metrics" from "authenticated";

revoke references on table "public"."scraping_metrics" from "authenticated";

revoke select on table "public"."scraping_metrics" from "authenticated";

revoke trigger on table "public"."scraping_metrics" from "authenticated";

revoke truncate on table "public"."scraping_metrics" from "authenticated";

revoke update on table "public"."scraping_metrics" from "authenticated";

revoke delete on table "public"."scraping_metrics" from "service_role";

revoke insert on table "public"."scraping_metrics" from "service_role";

revoke references on table "public"."scraping_metrics" from "service_role";

revoke select on table "public"."scraping_metrics" from "service_role";

revoke trigger on table "public"."scraping_metrics" from "service_role";

revoke truncate on table "public"."scraping_metrics" from "service_role";

revoke update on table "public"."scraping_metrics" from "service_role";

alter table "public"."metrics_spider" drop constraint "metrics_spider_pkey";

alter table "public"."scraping_metrics" drop constraint "scraping_metrics_pkey";

drop index if exists "public"."idx_company_metrics_crawl_id";

drop index if exists "public"."idx_company_metrics_domain";

drop index if exists "public"."idx_scraping_metrics_scraper_name";

drop index if exists "public"."idx_scraping_metrics_start_time";

drop index if exists "public"."metrics_spider_pkey";

drop index if exists "public"."scraping_metrics_pkey";

drop table "public"."metrics_spider";

drop table "public"."scraping_metrics";

create table "public"."metric_definitions" (
    "id" integer not null default nextval('public.metric_definitions_id_seq'::regclass),
    "name" character varying(255) not null,
    "description" text,
    "category" character varying(50),
    "type" character varying(50) not null,
    "unit" character varying(50),
    "is_dimensional" boolean default false
);


alter table "public"."metric_definitions" enable row level security;

create table "public"."spider_metrics" (
    "id" bigint not null default nextval('public.spider_metrics_id_seq'::regclass),
    "crawl_id" uuid not null,
    "metric_id" integer,
    "timestamp" timestamp with time zone not null,
    "value" jsonb not null
);


alter table "public"."spider_metrics" enable row level security;

alter table "public"."company_metrics" drop column "allowed_urls";

alter table "public"."company_metrics" drop column "category_distribution";

alter table "public"."company_metrics" drop column "certification_mentions";

alter table "public"."company_metrics" drop column "created_at";

alter table "public"."company_metrics" drop column "disallowed_urls";

alter table "public"."company_metrics" drop column "discovery_timestamps";

alter table "public"."company_metrics" drop column "domain";

alter table "public"."company_metrics" drop column "event_pages";

alter table "public"."company_metrics" drop column "external_urls";

alter table "public"."company_metrics" drop column "file_type_distribution";

alter table "public"."company_metrics" drop column "filtered_urls";

alter table "public"."company_metrics" drop column "internal_urls";

alter table "public"."company_metrics" drop column "investor_relations_presence";

alter table "public"."company_metrics" drop column "job_listings";

alter table "public"."company_metrics" drop column "keyword_presence_in_urls";

alter table "public"."company_metrics" drop column "language_versions";

alter table "public"."company_metrics" drop column "linked_domains";

alter table "public"."company_metrics" drop column "max_depth";

alter table "public"."company_metrics" drop column "modern_tech_usage";

alter table "public"."company_metrics" drop column "partnership_mentions";

alter table "public"."company_metrics" drop column "patent_pages";

alter table "public"."company_metrics" drop column "press_releases";

alter table "public"."company_metrics" drop column "product_service_patterns";

alter table "public"."company_metrics" drop column "protocol_distribution";

alter table "public"."company_metrics" drop column "recent_dates_mentioned";

alter table "public"."company_metrics" drop column "research_papers";

alter table "public"."company_metrics" drop column "social_media_profiles";

alter table "public"."company_metrics" drop column "sustainability_mentions";

alter table "public"."company_metrics" drop column "total_urls";

alter table "public"."company_metrics" drop column "url_depth_distribution";

alter table "public"."company_metrics" drop column "url_lengths";

alter table "public"."company_metrics" drop column "user_forums";

alter table "public"."company_metrics" add column "company_id" uuid not null;

alter table "public"."company_metrics" add column "metric_id" integer;

alter table "public"."company_metrics" add column "timestamp" timestamp with time zone not null;

alter table "public"."company_metrics" add column "value" jsonb not null;

alter table "public"."company_metrics" alter column "id" set data type bigint using "id"::bigint;

alter sequence "public"."metric_definitions_id_seq" owned by "public"."metric_definitions"."id";

alter sequence "public"."spider_metrics_id_seq" owned by "public"."spider_metrics"."id";

drop sequence if exists "public"."metrics_spider_id_seq";

drop sequence if exists "public"."scraping_metrics_id_seq";

CREATE INDEX idx_company_metrics_company ON public.company_metrics USING btree (company_id, crawl_id, metric_id, "timestamp");

CREATE INDEX idx_spider_metrics_crawl ON public.spider_metrics USING btree (crawl_id, metric_id, "timestamp");

CREATE UNIQUE INDEX metric_definitions_name_key ON public.metric_definitions USING btree (name);

CREATE UNIQUE INDEX metric_definitions_pkey ON public.metric_definitions USING btree (id);

CREATE UNIQUE INDEX spider_metrics_pkey ON public.spider_metrics USING btree (id);

alter table "public"."metric_definitions" add constraint "metric_definitions_pkey" PRIMARY KEY using index "metric_definitions_pkey";

alter table "public"."spider_metrics" add constraint "spider_metrics_pkey" PRIMARY KEY using index "spider_metrics_pkey";

alter table "public"."company_metrics" add constraint "company_metrics_metric_id_fkey" FOREIGN KEY (metric_id) REFERENCES public.metric_definitions(id) not valid;

alter table "public"."company_metrics" validate constraint "company_metrics_metric_id_fkey";

alter table "public"."metric_definitions" add constraint "metric_definitions_name_key" UNIQUE using index "metric_definitions_name_key";

alter table "public"."spider_metrics" add constraint "spider_metrics_metric_id_fkey" FOREIGN KEY (metric_id) REFERENCES public.metric_definitions(id) not valid;

alter table "public"."spider_metrics" validate constraint "spider_metrics_metric_id_fkey";

grant delete on table "public"."metric_definitions" to "anon";

grant insert on table "public"."metric_definitions" to "anon";

grant references on table "public"."metric_definitions" to "anon";

grant select on table "public"."metric_definitions" to "anon";

grant trigger on table "public"."metric_definitions" to "anon";

grant truncate on table "public"."metric_definitions" to "anon";

grant update on table "public"."metric_definitions" to "anon";

grant delete on table "public"."metric_definitions" to "authenticated";

grant insert on table "public"."metric_definitions" to "authenticated";

grant references on table "public"."metric_definitions" to "authenticated";

grant select on table "public"."metric_definitions" to "authenticated";

grant trigger on table "public"."metric_definitions" to "authenticated";

grant truncate on table "public"."metric_definitions" to "authenticated";

grant update on table "public"."metric_definitions" to "authenticated";

grant delete on table "public"."metric_definitions" to "service_role";

grant insert on table "public"."metric_definitions" to "service_role";

grant references on table "public"."metric_definitions" to "service_role";

grant select on table "public"."metric_definitions" to "service_role";

grant trigger on table "public"."metric_definitions" to "service_role";

grant truncate on table "public"."metric_definitions" to "service_role";

grant update on table "public"."metric_definitions" to "service_role";

grant delete on table "public"."spider_metrics" to "anon";

grant insert on table "public"."spider_metrics" to "anon";

grant references on table "public"."spider_metrics" to "anon";

grant select on table "public"."spider_metrics" to "anon";

grant trigger on table "public"."spider_metrics" to "anon";

grant truncate on table "public"."spider_metrics" to "anon";

grant update on table "public"."spider_metrics" to "anon";

grant delete on table "public"."spider_metrics" to "authenticated";

grant insert on table "public"."spider_metrics" to "authenticated";

grant references on table "public"."spider_metrics" to "authenticated";

grant select on table "public"."spider_metrics" to "authenticated";

grant trigger on table "public"."spider_metrics" to "authenticated";

grant truncate on table "public"."spider_metrics" to "authenticated";

grant update on table "public"."spider_metrics" to "authenticated";

grant delete on table "public"."spider_metrics" to "service_role";

grant insert on table "public"."spider_metrics" to "service_role";

grant references on table "public"."spider_metrics" to "service_role";

grant select on table "public"."spider_metrics" to "service_role";

grant trigger on table "public"."spider_metrics" to "service_role";

grant truncate on table "public"."spider_metrics" to "service_role";

grant update on table "public"."spider_metrics" to "service_role";

create policy "delete_policy"
on "public"."metric_definitions"
as permissive
for delete
to public
using (public.authorize('metric_definitions.delete'::text));


create policy "insert_policy"
on "public"."metric_definitions"
as permissive
for insert
to public
with check (public.authorize('metric_definitions.insert'::text));


create policy "select_policy"
on "public"."metric_definitions"
as permissive
for select
to public
using (public.authorize('metric_definitions.select'::text));


create policy "update_policy"
on "public"."metric_definitions"
as permissive
for update
to public
using (public.authorize('metric_definitions.update'::text));


create policy "delete_policy"
on "public"."spider_metrics"
as permissive
for delete
to public
using (public.authorize('spider_metrics.delete'::text));


create policy "insert_policy"
on "public"."spider_metrics"
as permissive
for insert
to public
with check (public.authorize('spider_metrics.insert'::text));


create policy "select_policy"
on "public"."spider_metrics"
as permissive
for select
to public
using (public.authorize('spider_metrics.select'::text));


create policy "update_policy"
on "public"."spider_metrics"
as permissive
for update
to public
using (public.authorize('spider_metrics.update'::text));



