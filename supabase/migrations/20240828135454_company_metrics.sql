create sequence "public"."company_metrics_id_seq";

create sequence "public"."metrics_spider_id_seq";

drop policy "delete_policy" on "public"."spider_metrics";

drop policy "insert_policy" on "public"."spider_metrics";

drop policy "select_policy" on "public"."spider_metrics";

drop policy "update_policy" on "public"."spider_metrics";

revoke delete on table "public"."spider_metrics" from "anon";

revoke insert on table "public"."spider_metrics" from "anon";

revoke references on table "public"."spider_metrics" from "anon";

revoke select on table "public"."spider_metrics" from "anon";

revoke trigger on table "public"."spider_metrics" from "anon";

revoke truncate on table "public"."spider_metrics" from "anon";

revoke update on table "public"."spider_metrics" from "anon";

revoke delete on table "public"."spider_metrics" from "authenticated";

revoke insert on table "public"."spider_metrics" from "authenticated";

revoke references on table "public"."spider_metrics" from "authenticated";

revoke select on table "public"."spider_metrics" from "authenticated";

revoke trigger on table "public"."spider_metrics" from "authenticated";

revoke truncate on table "public"."spider_metrics" from "authenticated";

revoke update on table "public"."spider_metrics" from "authenticated";

revoke delete on table "public"."spider_metrics" from "service_role";

revoke insert on table "public"."spider_metrics" from "service_role";

revoke references on table "public"."spider_metrics" from "service_role";

revoke select on table "public"."spider_metrics" from "service_role";

revoke trigger on table "public"."spider_metrics" from "service_role";

revoke truncate on table "public"."spider_metrics" from "service_role";

revoke update on table "public"."spider_metrics" from "service_role";

alter table "public"."spider_metrics" drop constraint "spider_metrics_pkey";

drop index if exists "public"."spider_metrics_pkey";

drop table "public"."spider_metrics";

alter table "public"."companies" alter column "content_status" drop default;

alter table "public"."news" alter column "content_status" drop default;

alter table "public"."newsletters" alter column "content_status" drop default;

alter table "public"."research" alter column "content_status" drop default;

alter type "public"."content_status" rename to "content_status__old_version_to_be_dropped";

create type "public"."content_status" as enum ('draft', 'pending_agent_action', 'pending_agent_review', 'pending_human_review', 'pending_relevance_check', 'irrelevant', 'scheduled', 'unpublished', 'archived', 'published', 'failed', 'pending_crawl', 'scraped', 'outdated', 'updated', 'new');

create table "public"."company_metrics" (
    "id" integer not null default nextval('public.company_metrics_id_seq'::regclass),
    "domain" character varying(255) not null,
    "crawl_id" uuid not null,
    "total_urls" integer not null,
    "internal_urls" integer not null,
    "external_urls" integer not null,
    "max_depth" integer not null,
    "url_depth_distribution" jsonb not null,
    "file_type_distribution" jsonb not null,
    "protocol_distribution" jsonb not null,
    "linked_domains" jsonb not null,
    "product_service_patterns" jsonb not null,
    "job_listings" integer not null,
    "investor_relations_presence" boolean not null,
    "press_releases" integer not null,
    "research_papers" integer not null,
    "patent_pages" integer not null,
    "event_pages" integer not null,
    "recent_dates_mentioned" integer,
    "modern_tech_usage" jsonb,
    "partnership_mentions" integer,
    "language_versions" jsonb,
    "user_forums" boolean,
    "social_media_profiles" jsonb,
    "certification_mentions" integer,
    "sustainability_mentions" integer,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "filtered_urls" integer not null default 0,
    "allowed_urls" integer not null default 0,
    "disallowed_urls" integer not null default 0,
    "category_distribution" jsonb,
    "url_lengths" integer[],
    "keyword_presence_in_urls" jsonb,
    "discovery_timestamps" bigint[]
);


alter table "public"."company_metrics" enable row level security;

create table "public"."metrics_spider" (
    "id" integer not null default nextval('public.metrics_spider_id_seq'::regclass),
    "crawl_id" uuid not null,
    "start_time" timestamp with time zone not null,
    "end_time" timestamp with time zone not null,
    "total_urls_crawled" integer not null,
    "unique_domains_discovered" integer not null,
    "average_crawl_speed" double precision not null,
    "error_rate" double precision not null,
    "average_response_time" double precision not null,
    "robots_txt_disallowed" integer not null,
    "memory_usage_peak" double precision,
    "cpu_usage_average" double precision,
    "bandwidth_used" double precision,
    "crawl_depth_reached" integer not null,
    "crawl_frontier_size" integer not null default 0
);


alter table "public"."metrics_spider" enable row level security;

alter table "public"."companies" alter column content_status type "public"."content_status" using content_status::text::"public"."content_status";

alter table "public"."content_statuses" alter column content_status type "public"."content_status" using content_status::text::"public"."content_status";

alter table "public"."news" alter column content_status type "public"."content_status" using content_status::text::"public"."content_status";

alter table "public"."newsletters" alter column content_status type "public"."content_status" using content_status::text::"public"."content_status";

alter table "public"."research" alter column content_status type "public"."content_status" using content_status::text::"public"."content_status";

alter table "public"."companies" alter column "content_status" set default 'draft'::public.content_status;

alter table "public"."news" alter column "content_status" set default 'draft'::public.content_status;

alter table "public"."newsletters" alter column "content_status" set default 'draft'::public.content_status;

alter table "public"."research" alter column "content_status" set default 'draft'::public.content_status;

drop type "public"."content_status__old_version_to_be_dropped";

alter sequence "public"."company_metrics_id_seq" owned by "public"."company_metrics"."id";

alter sequence "public"."metrics_spider_id_seq" owned by "public"."metrics_spider"."id";

drop sequence if exists "public"."spider_metrics_id_seq";

CREATE UNIQUE INDEX company_metrics_pkey ON public.company_metrics USING btree (id);

CREATE INDEX idx_company_metrics_crawl_id ON public.company_metrics USING btree (crawl_id);

CREATE INDEX idx_company_metrics_domain ON public.company_metrics USING btree (domain);

CREATE UNIQUE INDEX metrics_spider_pkey ON public.metrics_spider USING btree (id);

alter table "public"."company_metrics" add constraint "company_metrics_pkey" PRIMARY KEY using index "company_metrics_pkey";

alter table "public"."metrics_spider" add constraint "metrics_spider_pkey" PRIMARY KEY using index "metrics_spider_pkey";

grant delete on table "public"."company_metrics" to "anon";

grant insert on table "public"."company_metrics" to "anon";

grant references on table "public"."company_metrics" to "anon";

grant select on table "public"."company_metrics" to "anon";

grant trigger on table "public"."company_metrics" to "anon";

grant truncate on table "public"."company_metrics" to "anon";

grant update on table "public"."company_metrics" to "anon";

grant delete on table "public"."company_metrics" to "authenticated";

grant insert on table "public"."company_metrics" to "authenticated";

grant references on table "public"."company_metrics" to "authenticated";

grant select on table "public"."company_metrics" to "authenticated";

grant trigger on table "public"."company_metrics" to "authenticated";

grant truncate on table "public"."company_metrics" to "authenticated";

grant update on table "public"."company_metrics" to "authenticated";

grant delete on table "public"."company_metrics" to "service_role";

grant insert on table "public"."company_metrics" to "service_role";

grant references on table "public"."company_metrics" to "service_role";

grant select on table "public"."company_metrics" to "service_role";

grant trigger on table "public"."company_metrics" to "service_role";

grant truncate on table "public"."company_metrics" to "service_role";

grant update on table "public"."company_metrics" to "service_role";

grant delete on table "public"."metrics_spider" to "anon";

grant insert on table "public"."metrics_spider" to "anon";

grant references on table "public"."metrics_spider" to "anon";

grant select on table "public"."metrics_spider" to "anon";

grant trigger on table "public"."metrics_spider" to "anon";

grant truncate on table "public"."metrics_spider" to "anon";

grant update on table "public"."metrics_spider" to "anon";

grant delete on table "public"."metrics_spider" to "authenticated";

grant insert on table "public"."metrics_spider" to "authenticated";

grant references on table "public"."metrics_spider" to "authenticated";

grant select on table "public"."metrics_spider" to "authenticated";

grant trigger on table "public"."metrics_spider" to "authenticated";

grant truncate on table "public"."metrics_spider" to "authenticated";

grant update on table "public"."metrics_spider" to "authenticated";

grant delete on table "public"."metrics_spider" to "service_role";

grant insert on table "public"."metrics_spider" to "service_role";

grant references on table "public"."metrics_spider" to "service_role";

grant select on table "public"."metrics_spider" to "service_role";

grant trigger on table "public"."metrics_spider" to "service_role";

grant truncate on table "public"."metrics_spider" to "service_role";

grant update on table "public"."metrics_spider" to "service_role";

create policy "delete_policy"
on "public"."company_metrics"
as permissive
for delete
to public
using (public.authorize('company_metrics.delete'::text));


create policy "insert_policy"
on "public"."company_metrics"
as permissive
for insert
to public
with check (public.authorize('company_metrics.insert'::text));


create policy "select_policy"
on "public"."company_metrics"
as permissive
for select
to public
using (public.authorize('company_metrics.select'::text));


create policy "update_policy"
on "public"."company_metrics"
as permissive
for update
to public
using (public.authorize('company_metrics.update'::text));


create policy "delete_policy"
on "public"."metrics_spider"
as permissive
for delete
to public
using (public.authorize('metrics_spider.delete'::text));


create policy "insert_policy"
on "public"."metrics_spider"
as permissive
for insert
to public
with check (public.authorize('metrics_spider.insert'::text));


create policy "select_policy"
on "public"."metrics_spider"
as permissive
for select
to public
using (public.authorize('metrics_spider.select'::text));


create policy "update_policy"
on "public"."metrics_spider"
as permissive
for update
to public
using (public.authorize('metrics_spider.update'::text));



