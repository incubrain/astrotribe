drop trigger if exists "update_categorized_urls_timestamp" on "public"."categorized_urls";

revoke delete on table "public"."blacklisted_domains" from "anon";

revoke insert on table "public"."blacklisted_domains" from "anon";

revoke references on table "public"."blacklisted_domains" from "anon";

revoke select on table "public"."blacklisted_domains" from "anon";

revoke trigger on table "public"."blacklisted_domains" from "anon";

revoke truncate on table "public"."blacklisted_domains" from "anon";

revoke update on table "public"."blacklisted_domains" from "anon";

revoke delete on table "public"."blacklisted_domains" from "authenticated";

revoke insert on table "public"."blacklisted_domains" from "authenticated";

revoke references on table "public"."blacklisted_domains" from "authenticated";

revoke select on table "public"."blacklisted_domains" from "authenticated";

revoke trigger on table "public"."blacklisted_domains" from "authenticated";

revoke truncate on table "public"."blacklisted_domains" from "authenticated";

revoke update on table "public"."blacklisted_domains" from "authenticated";

revoke delete on table "public"."blacklisted_domains" from "service_role";

revoke insert on table "public"."blacklisted_domains" from "service_role";

revoke references on table "public"."blacklisted_domains" from "service_role";

revoke select on table "public"."blacklisted_domains" from "service_role";

revoke trigger on table "public"."blacklisted_domains" from "service_role";

revoke truncate on table "public"."blacklisted_domains" from "service_role";

revoke update on table "public"."blacklisted_domains" from "service_role";

revoke delete on table "public"."blacklisted_urls" from "anon";

revoke insert on table "public"."blacklisted_urls" from "anon";

revoke references on table "public"."blacklisted_urls" from "anon";

revoke select on table "public"."blacklisted_urls" from "anon";

revoke trigger on table "public"."blacklisted_urls" from "anon";

revoke truncate on table "public"."blacklisted_urls" from "anon";

revoke update on table "public"."blacklisted_urls" from "anon";

revoke delete on table "public"."blacklisted_urls" from "authenticated";

revoke insert on table "public"."blacklisted_urls" from "authenticated";

revoke references on table "public"."blacklisted_urls" from "authenticated";

revoke select on table "public"."blacklisted_urls" from "authenticated";

revoke trigger on table "public"."blacklisted_urls" from "authenticated";

revoke truncate on table "public"."blacklisted_urls" from "authenticated";

revoke update on table "public"."blacklisted_urls" from "authenticated";

revoke delete on table "public"."blacklisted_urls" from "service_role";

revoke insert on table "public"."blacklisted_urls" from "service_role";

revoke references on table "public"."blacklisted_urls" from "service_role";

revoke select on table "public"."blacklisted_urls" from "service_role";

revoke trigger on table "public"."blacklisted_urls" from "service_role";

revoke truncate on table "public"."blacklisted_urls" from "service_role";

revoke update on table "public"."blacklisted_urls" from "service_role";

revoke delete on table "public"."categorized_urls" from "anon";

revoke insert on table "public"."categorized_urls" from "anon";

revoke references on table "public"."categorized_urls" from "anon";

revoke select on table "public"."categorized_urls" from "anon";

revoke trigger on table "public"."categorized_urls" from "anon";

revoke truncate on table "public"."categorized_urls" from "anon";

revoke update on table "public"."categorized_urls" from "anon";

revoke delete on table "public"."categorized_urls" from "authenticated";

revoke insert on table "public"."categorized_urls" from "authenticated";

revoke references on table "public"."categorized_urls" from "authenticated";

revoke select on table "public"."categorized_urls" from "authenticated";

revoke trigger on table "public"."categorized_urls" from "authenticated";

revoke truncate on table "public"."categorized_urls" from "authenticated";

revoke update on table "public"."categorized_urls" from "authenticated";

revoke delete on table "public"."categorized_urls" from "service_role";

revoke insert on table "public"."categorized_urls" from "service_role";

revoke references on table "public"."categorized_urls" from "service_role";

revoke select on table "public"."categorized_urls" from "service_role";

revoke trigger on table "public"."categorized_urls" from "service_role";

revoke truncate on table "public"."categorized_urls" from "service_role";

revoke update on table "public"."categorized_urls" from "service_role";

alter table "public"."blacklisted_domains" drop constraint "blacklisted_domains_url_key";

alter table "public"."blacklisted_urls" drop constraint "blacklisted_urls_url_key";

alter table "public"."blacklisted_urls" drop constraint "public_blacklisted_urls_company_id_fkey";

alter table "public"."categorized_urls" drop constraint "categorized_urls_company_id_fkey";

alter table "public"."categorized_urls" drop constraint "categorized_urls_domain_id_fkey";

alter table "public"."categorized_urls" drop constraint "unique_url_found_on";

alter table "public"."categorized_urls" drop constraint "valid_confidence";

alter table "public"."blacklisted_domains" drop constraint "blacklisted_domains_pkey";

alter table "public"."blacklisted_urls" drop constraint "blacklisted_urls_pkey";

alter table "public"."categorized_urls" drop constraint "categorized_urls_pkey";

drop index if exists "public"."blacklisted_domains_pkey";

drop index if exists "public"."blacklisted_domains_url_key";

drop index if exists "public"."blacklisted_urls_pkey";

drop index if exists "public"."blacklisted_urls_url_key";

drop index if exists "public"."categorized_urls_pkey";

drop index if exists "public"."idx_blacklisted_urls_url";

drop index if exists "public"."idx_categorized_urls_domain_id";

drop index if exists "public"."idx_categorized_urls_normalized_url";

drop index if exists "public"."unique_url_found_on";

drop table "public"."blacklisted_domains";

drop table "public"."blacklisted_urls";

drop table "public"."categorized_urls";

alter table "public"."companies" alter column "content_status" drop default;

alter table "public"."jobs" alter column "content_status" drop default;

alter table "public"."newsletters" alter column "content_status" drop default;

alter type "public"."content_status" rename to "content_status__old_version_to_be_dropped";

create type "public"."content_status" as enum ('draft', 'pending_agent_action', 'pending_agent_review', 'pending_human_review', 'pending_relevance_check', 'irrelevant', 'scheduled', 'unpublished', 'archived', 'published', 'failed', 'pending_crawl', 'scraped', 'outdated', 'updated', 'new', 'processing', 'crawling', 'crawled');

create table "public"."domain_blacklist" (
    "id" uuid not null default gen_random_uuid(),
    "domain_name" text not null,
    "reason" text,
    "created_at" timestamp with time zone default now()
);

create table "public"."domain_relationships" (
    "id" uuid not null default gen_random_uuid(),
    "source_domain_root_id" uuid,
    "source_company_id" uuid,
    "source_url_id" uuid not null,
    "target_url_id" uuid not null,
    "target_domain_root_id" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);

create table "public"."domain_roots" (
    "id" uuid not null default gen_random_uuid(),
    "domain_name" text not null,
    "first_seen_at" timestamp with time zone default now(),
    "last_seen_at" timestamp with time zone default now(),
    "is_crawled" boolean default false,
    "crawl_count" integer default 0
);

create table "public"."domain_urls" (
    "id" uuid not null default gen_random_uuid(),
    "company_id" uuid,
    "domain_root_id" uuid,
    "url" text not null,
    "error_count" integer default 0,
    "last_error" text,
    "content_hash" character varying,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "priority" public.priority not null default 'low'::public.priority,
    "content" text
);

create table "public"."domain_whitelist" (
    "id" uuid not null default gen_random_uuid(),
    "domain_name" text not null,
    "priority" public.priority not null default 'low'::public.priority,
    "created_at" timestamp with time zone default now()
);

alter table "public"."companies" alter column content_status type "public"."content_status" using content_status::text::"public"."content_status";

alter table "public"."jobs" alter column content_status type "public"."content_status" using content_status::text::"public"."content_status";

alter table "public"."newsletters" alter column content_status type "public"."content_status" using content_status::text::"public"."content_status";

alter table "public"."companies" alter column "content_status" set default 'draft'::public.content_status;

alter table "public"."jobs" alter column "content_status" set default 'draft'::public.content_status;

alter table "public"."newsletters" alter column "content_status" set default 'draft'::public.content_status;

drop type "public"."content_status__old_version_to_be_dropped";

drop sequence if exists "public"."blacklisted_urls_id_seq";

CREATE UNIQUE INDEX domain_blacklist_domain_name_key ON public.domain_blacklist USING btree (domain_name);

CREATE UNIQUE INDEX domain_blacklist_pkey ON public.domain_blacklist USING btree (id);

CREATE UNIQUE INDEX domain_relationships_pkey ON public.domain_relationships USING btree (id);

CREATE UNIQUE INDEX domain_relationships_source_url_id_target_url_id_key ON public.domain_relationships USING btree (source_url_id, target_url_id);

CREATE UNIQUE INDEX domain_roots_domain_name_key ON public.domain_roots USING btree (domain_name);

CREATE UNIQUE INDEX domain_roots_pkey ON public.domain_roots USING btree (id);

CREATE UNIQUE INDEX domain_urls_pkey ON public.domain_urls USING btree (id);

CREATE UNIQUE INDEX domain_urls_url_domain_root_id_key ON public.domain_urls USING btree (url, domain_root_id);

CREATE UNIQUE INDEX domain_whitelist_domain_name_key ON public.domain_whitelist USING btree (domain_name);

CREATE UNIQUE INDEX domain_whitelist_pkey ON public.domain_whitelist USING btree (id);

CREATE INDEX idx_domain_relationships_source_company ON public.domain_relationships USING btree (source_company_id);

CREATE INDEX idx_domain_roots_domain_name ON public.domain_roots USING btree (domain_name);

CREATE INDEX idx_domain_urls_company_id ON public.domain_urls USING btree (company_id);

CREATE INDEX idx_domain_urls_url ON public.domain_urls USING btree (url);

alter table "public"."domain_blacklist" add constraint "domain_blacklist_pkey" PRIMARY KEY using index "domain_blacklist_pkey";

alter table "public"."domain_relationships" add constraint "domain_relationships_pkey" PRIMARY KEY using index "domain_relationships_pkey";

alter table "public"."domain_roots" add constraint "domain_roots_pkey" PRIMARY KEY using index "domain_roots_pkey";

alter table "public"."domain_urls" add constraint "domain_urls_pkey" PRIMARY KEY using index "domain_urls_pkey";

alter table "public"."domain_whitelist" add constraint "domain_whitelist_pkey" PRIMARY KEY using index "domain_whitelist_pkey";

alter table "public"."domain_blacklist" add constraint "domain_blacklist_domain_name_key" UNIQUE using index "domain_blacklist_domain_name_key";

alter table "public"."domain_relationships" add constraint "domain_relationships_source_company_id_fkey" FOREIGN KEY (source_company_id) REFERENCES public.companies(id) not valid;

alter table "public"."domain_relationships" validate constraint "domain_relationships_source_company_id_fkey";

alter table "public"."domain_relationships" add constraint "domain_relationships_source_domain_root_id_fkey" FOREIGN KEY (source_domain_root_id) REFERENCES public.domain_roots(id) not valid;

alter table "public"."domain_relationships" validate constraint "domain_relationships_source_domain_root_id_fkey";

alter table "public"."domain_relationships" add constraint "domain_relationships_source_url_id_fkey" FOREIGN KEY (source_url_id) REFERENCES public.domain_urls(id) not valid;

alter table "public"."domain_relationships" validate constraint "domain_relationships_source_url_id_fkey";

alter table "public"."domain_relationships" add constraint "domain_relationships_source_url_id_target_url_id_key" UNIQUE using index "domain_relationships_source_url_id_target_url_id_key";

alter table "public"."domain_relationships" add constraint "domain_relationships_target_domain_root_id_fkey" FOREIGN KEY (target_domain_root_id) REFERENCES public.domain_roots(id) not valid;

alter table "public"."domain_relationships" validate constraint "domain_relationships_target_domain_root_id_fkey";

alter table "public"."domain_relationships" add constraint "domain_relationships_target_url_id_fkey" FOREIGN KEY (target_url_id) REFERENCES public.domain_urls(id) not valid;

alter table "public"."domain_relationships" validate constraint "domain_relationships_target_url_id_fkey";

alter table "public"."domain_roots" add constraint "domain_roots_domain_name_key" UNIQUE using index "domain_roots_domain_name_key";

alter table "public"."domain_urls" add constraint "domain_urls_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id) not valid;

alter table "public"."domain_urls" validate constraint "domain_urls_company_id_fkey";

alter table "public"."domain_urls" add constraint "domain_urls_domain_root_id_fkey" FOREIGN KEY (domain_root_id) REFERENCES public.domain_roots(id) not valid;

alter table "public"."domain_urls" validate constraint "domain_urls_domain_root_id_fkey";

alter table "public"."domain_urls" add constraint "domain_urls_url_domain_root_id_key" UNIQUE using index "domain_urls_url_domain_root_id_key";

alter table "public"."domain_whitelist" add constraint "domain_whitelist_domain_name_key" UNIQUE using index "domain_whitelist_domain_name_key";

grant delete on table "public"."domain_blacklist" to "anon";

grant insert on table "public"."domain_blacklist" to "anon";

grant references on table "public"."domain_blacklist" to "anon";

grant select on table "public"."domain_blacklist" to "anon";

grant trigger on table "public"."domain_blacklist" to "anon";

grant truncate on table "public"."domain_blacklist" to "anon";

grant update on table "public"."domain_blacklist" to "anon";

grant delete on table "public"."domain_blacklist" to "authenticated";

grant insert on table "public"."domain_blacklist" to "authenticated";

grant references on table "public"."domain_blacklist" to "authenticated";

grant select on table "public"."domain_blacklist" to "authenticated";

grant trigger on table "public"."domain_blacklist" to "authenticated";

grant truncate on table "public"."domain_blacklist" to "authenticated";

grant update on table "public"."domain_blacklist" to "authenticated";

grant delete on table "public"."domain_blacklist" to "service_role";

grant insert on table "public"."domain_blacklist" to "service_role";

grant references on table "public"."domain_blacklist" to "service_role";

grant select on table "public"."domain_blacklist" to "service_role";

grant trigger on table "public"."domain_blacklist" to "service_role";

grant truncate on table "public"."domain_blacklist" to "service_role";

grant update on table "public"."domain_blacklist" to "service_role";

grant delete on table "public"."domain_relationships" to "anon";

grant insert on table "public"."domain_relationships" to "anon";

grant references on table "public"."domain_relationships" to "anon";

grant select on table "public"."domain_relationships" to "anon";

grant trigger on table "public"."domain_relationships" to "anon";

grant truncate on table "public"."domain_relationships" to "anon";

grant update on table "public"."domain_relationships" to "anon";

grant delete on table "public"."domain_relationships" to "authenticated";

grant insert on table "public"."domain_relationships" to "authenticated";

grant references on table "public"."domain_relationships" to "authenticated";

grant select on table "public"."domain_relationships" to "authenticated";

grant trigger on table "public"."domain_relationships" to "authenticated";

grant truncate on table "public"."domain_relationships" to "authenticated";

grant update on table "public"."domain_relationships" to "authenticated";

grant delete on table "public"."domain_relationships" to "service_role";

grant insert on table "public"."domain_relationships" to "service_role";

grant references on table "public"."domain_relationships" to "service_role";

grant select on table "public"."domain_relationships" to "service_role";

grant trigger on table "public"."domain_relationships" to "service_role";

grant truncate on table "public"."domain_relationships" to "service_role";

grant update on table "public"."domain_relationships" to "service_role";

grant delete on table "public"."domain_roots" to "anon";

grant insert on table "public"."domain_roots" to "anon";

grant references on table "public"."domain_roots" to "anon";

grant select on table "public"."domain_roots" to "anon";

grant trigger on table "public"."domain_roots" to "anon";

grant truncate on table "public"."domain_roots" to "anon";

grant update on table "public"."domain_roots" to "anon";

grant delete on table "public"."domain_roots" to "authenticated";

grant insert on table "public"."domain_roots" to "authenticated";

grant references on table "public"."domain_roots" to "authenticated";

grant select on table "public"."domain_roots" to "authenticated";

grant trigger on table "public"."domain_roots" to "authenticated";

grant truncate on table "public"."domain_roots" to "authenticated";

grant update on table "public"."domain_roots" to "authenticated";

grant delete on table "public"."domain_roots" to "service_role";

grant insert on table "public"."domain_roots" to "service_role";

grant references on table "public"."domain_roots" to "service_role";

grant select on table "public"."domain_roots" to "service_role";

grant trigger on table "public"."domain_roots" to "service_role";

grant truncate on table "public"."domain_roots" to "service_role";

grant update on table "public"."domain_roots" to "service_role";

grant delete on table "public"."domain_urls" to "anon";

grant insert on table "public"."domain_urls" to "anon";

grant references on table "public"."domain_urls" to "anon";

grant select on table "public"."domain_urls" to "anon";

grant trigger on table "public"."domain_urls" to "anon";

grant truncate on table "public"."domain_urls" to "anon";

grant update on table "public"."domain_urls" to "anon";

grant delete on table "public"."domain_urls" to "authenticated";

grant insert on table "public"."domain_urls" to "authenticated";

grant references on table "public"."domain_urls" to "authenticated";

grant select on table "public"."domain_urls" to "authenticated";

grant trigger on table "public"."domain_urls" to "authenticated";

grant truncate on table "public"."domain_urls" to "authenticated";

grant update on table "public"."domain_urls" to "authenticated";

grant delete on table "public"."domain_urls" to "service_role";

grant insert on table "public"."domain_urls" to "service_role";

grant references on table "public"."domain_urls" to "service_role";

grant select on table "public"."domain_urls" to "service_role";

grant trigger on table "public"."domain_urls" to "service_role";

grant truncate on table "public"."domain_urls" to "service_role";

grant update on table "public"."domain_urls" to "service_role";

grant delete on table "public"."domain_whitelist" to "anon";

grant insert on table "public"."domain_whitelist" to "anon";

grant references on table "public"."domain_whitelist" to "anon";

grant select on table "public"."domain_whitelist" to "anon";

grant trigger on table "public"."domain_whitelist" to "anon";

grant truncate on table "public"."domain_whitelist" to "anon";

grant update on table "public"."domain_whitelist" to "anon";

grant delete on table "public"."domain_whitelist" to "authenticated";

grant insert on table "public"."domain_whitelist" to "authenticated";

grant references on table "public"."domain_whitelist" to "authenticated";

grant select on table "public"."domain_whitelist" to "authenticated";

grant trigger on table "public"."domain_whitelist" to "authenticated";

grant truncate on table "public"."domain_whitelist" to "authenticated";

grant update on table "public"."domain_whitelist" to "authenticated";

grant delete on table "public"."domain_whitelist" to "service_role";

grant insert on table "public"."domain_whitelist" to "service_role";

grant references on table "public"."domain_whitelist" to "service_role";

grant select on table "public"."domain_whitelist" to "service_role";

grant trigger on table "public"."domain_whitelist" to "service_role";

grant truncate on table "public"."domain_whitelist" to "service_role";

grant update on table "public"."domain_whitelist" to "service_role";

CREATE TRIGGER update_domain_relationships_timestamp BEFORE UPDATE ON public.domain_relationships FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_domain_urls_timestamp BEFORE UPDATE ON public.domain_urls FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
