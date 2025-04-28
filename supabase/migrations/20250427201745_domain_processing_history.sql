drop trigger if exists "contents_summarize_webhook" on "public"."contents";
drop trigger if exists "contents_vectorization_webhook" on "public"."contents";

revoke delete on table "public"."responses" from "anon";
revoke insert on table "public"."responses" from "anon";
revoke references on table "public"."responses" from "anon";
revoke select on table "public"."responses" from "anon";

revoke trigger on table "public"."responses" from "anon";

revoke truncate on table "public"."responses" from "anon";

revoke update on table "public"."responses" from "anon";

revoke delete on table "public"."responses" from "authenticated";

revoke insert on table "public"."responses" from "authenticated";

revoke references on table "public"."responses" from "authenticated";

revoke select on table "public"."responses" from "authenticated";

revoke trigger on table "public"."responses" from "authenticated";

revoke truncate on table "public"."responses" from "authenticated";

revoke update on table "public"."responses" from "authenticated";

revoke delete on table "public"."responses" from "service_role";

revoke insert on table "public"."responses" from "service_role";

revoke references on table "public"."responses" from "service_role";

revoke select on table "public"."responses" from "service_role";

revoke trigger on table "public"."responses" from "service_role";

revoke truncate on table "public"."responses" from "service_role";

revoke update on table "public"."responses" from "service_role";

revoke delete on table "public"."searches" from "anon";

revoke insert on table "public"."searches" from "anon";

revoke references on table "public"."searches" from "anon";

revoke select on table "public"."searches" from "anon";

revoke trigger on table "public"."searches" from "anon";

revoke truncate on table "public"."searches" from "anon";

revoke update on table "public"."searches" from "anon";

revoke delete on table "public"."searches" from "authenticated";

revoke insert on table "public"."searches" from "authenticated";

revoke references on table "public"."searches" from "authenticated";

revoke select on table "public"."searches" from "authenticated";

revoke trigger on table "public"."searches" from "authenticated";

revoke truncate on table "public"."searches" from "authenticated";

revoke update on table "public"."searches" from "authenticated";

revoke delete on table "public"."searches" from "service_role";

revoke insert on table "public"."searches" from "service_role";

revoke references on table "public"."searches" from "service_role";

revoke select on table "public"."searches" from "service_role";

revoke trigger on table "public"."searches" from "service_role";

revoke truncate on table "public"."searches" from "service_role";

revoke update on table "public"."searches" from "service_role";

alter table "public"."responses" drop constraint "responses_id_key";

alter table "public"."responses" drop constraint "responses_search_id_fkey";

alter table "public"."searches" drop constraint "searches_input_key";

alter table "public"."domain_relationships" drop constraint "domain_relationships_source_company_id_fkey";

alter table "public"."domain_urls" drop constraint "domain_urls_company_id_fkey";

drop function if exists "public"."summarize_webhook"();

drop function if exists "public"."vectorize_webhook"();

alter table "public"."responses" drop constraint "responses_pkey";

alter table "public"."searches" drop constraint "searches_pkey";

drop index if exists "public"."idx_companies_failed_count";

drop index if exists "public"."responses_id_key";

drop index if exists "public"."responses_pkey";

drop index if exists "public"."searches_input_key";

drop index if exists "public"."searches_pkey";

drop table "public"."responses";
drop table "public"."searches";

create table "public"."domain_url_processing_history" (
    "id" uuid not null default gen_random_uuid(),
    "url_id" uuid,
    "crawl_id" uuid not null,
    "processing_timestamp" timestamp with time zone default now(),
    "input_url" text not null,
    "normalized_url" text,
    "classification" text not null,
    "processor_decisions" jsonb,
    "classification_decisions" jsonb
);


alter table "public"."companies" drop column "category";

alter table "public"."companies" drop column "failed_count";

alter table "public"."companies" drop column "is_english";

alter table "public"."companies" drop column "scrape_rating";

alter table "public"."companies" drop column "social_media_id_old";

alter table "public"."domain_urls" add column "classification" text;

CREATE UNIQUE INDEX domain_url_processing_history_pkey ON public.domain_url_processing_history USING btree (id);

CREATE INDEX idx_domain_url_processing_history_classification ON public.domain_url_processing_history USING btree (classification);

CREATE INDEX idx_domain_url_processing_history_crawl_id ON public.domain_url_processing_history USING btree (crawl_id);

CREATE INDEX idx_domain_url_processing_history_url_id ON public.domain_url_processing_history USING btree (url_id);

CREATE INDEX idx_domain_urls_classification ON public.domain_urls USING btree (classification);

alter table "public"."domain_url_processing_history" add constraint "domain_url_processing_history_pkey" PRIMARY KEY using index "domain_url_processing_history_pkey";

alter table "public"."domain_url_processing_history" add constraint "domain_url_processing_history_url_id_fkey" FOREIGN KEY (url_id) REFERENCES public.domain_urls(id) not valid;

alter table "public"."domain_url_processing_history" validate constraint "domain_url_processing_history_url_id_fkey";

alter table "public"."domain_relationships" add constraint "domain_relationships_source_company_id_fkey" FOREIGN KEY (source_company_id) REFERENCES public.companies(id) ON DELETE CASCADE not valid;

alter table "public"."domain_relationships" validate constraint "domain_relationships_source_company_id_fkey";

alter table "public"."domain_urls" add constraint "domain_urls_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE not valid;

alter table "public"."domain_urls" validate constraint "domain_urls_company_id_fkey";

grant delete on table "public"."domain_url_processing_history" to "anon";

grant insert on table "public"."domain_url_processing_history" to "anon";

grant references on table "public"."domain_url_processing_history" to "anon";

grant select on table "public"."domain_url_processing_history" to "anon";

grant trigger on table "public"."domain_url_processing_history" to "anon";

grant truncate on table "public"."domain_url_processing_history" to "anon";

grant update on table "public"."domain_url_processing_history" to "anon";

grant delete on table "public"."domain_url_processing_history" to "authenticated";

grant insert on table "public"."domain_url_processing_history" to "authenticated";

grant references on table "public"."domain_url_processing_history" to "authenticated";

grant select on table "public"."domain_url_processing_history" to "authenticated";

grant trigger on table "public"."domain_url_processing_history" to "authenticated";

grant truncate on table "public"."domain_url_processing_history" to "authenticated";

grant update on table "public"."domain_url_processing_history" to "authenticated";

grant delete on table "public"."domain_url_processing_history" to "service_role";

grant insert on table "public"."domain_url_processing_history" to "service_role";

grant references on table "public"."domain_url_processing_history" to "service_role";

grant select on table "public"."domain_url_processing_history" to "service_role";

grant trigger on table "public"."domain_url_processing_history" to "service_role";

grant truncate on table "public"."domain_url_processing_history" to "service_role";

grant update on table "public"."domain_url_processing_history" to "service_role";
