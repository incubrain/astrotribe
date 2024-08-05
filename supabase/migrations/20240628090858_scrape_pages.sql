create sequence "public"."scrapers_pages_id_seq";

drop trigger if exists "trg_update_is_outdated" on "public"."content_sources";

drop policy "Enable read access for all users" on "public"."content_sources";

drop policy "delete_policy" on "public"."content_sources";

drop policy "insert_policy" on "public"."content_sources";

drop policy "update_policy" on "public"."content_sources";

drop policy "Enable read access for all users" on "public"."scraper_configs";

drop policy "delete_policy" on "public"."scraper_configs";

drop policy "insert_policy" on "public"."scraper_configs";

drop policy "update_policy" on "public"."scraper_configs";

revoke delete on table "public"."content_sources" from "anon";

revoke insert on table "public"."content_sources" from "anon";

revoke references on table "public"."content_sources" from "anon";

revoke select on table "public"."content_sources" from "anon";

revoke trigger on table "public"."content_sources" from "anon";

revoke truncate on table "public"."content_sources" from "anon";

revoke update on table "public"."content_sources" from "anon";

revoke delete on table "public"."content_sources" from "authenticated";

revoke insert on table "public"."content_sources" from "authenticated";

revoke references on table "public"."content_sources" from "authenticated";

revoke select on table "public"."content_sources" from "authenticated";

revoke trigger on table "public"."content_sources" from "authenticated";

revoke truncate on table "public"."content_sources" from "authenticated";

revoke update on table "public"."content_sources" from "authenticated";

revoke delete on table "public"."content_sources" from "service_role";

revoke insert on table "public"."content_sources" from "service_role";

revoke references on table "public"."content_sources" from "service_role";

revoke select on table "public"."content_sources" from "service_role";

revoke trigger on table "public"."content_sources" from "service_role";

revoke truncate on table "public"."content_sources" from "service_role";

revoke update on table "public"."content_sources" from "service_role";

revoke delete on table "public"."scraper_configs" from "anon";

revoke insert on table "public"."scraper_configs" from "anon";

revoke references on table "public"."scraper_configs" from "anon";

revoke select on table "public"."scraper_configs" from "anon";

revoke trigger on table "public"."scraper_configs" from "anon";

revoke truncate on table "public"."scraper_configs" from "anon";

revoke update on table "public"."scraper_configs" from "anon";

revoke delete on table "public"."scraper_configs" from "authenticated";

revoke insert on table "public"."scraper_configs" from "authenticated";

revoke references on table "public"."scraper_configs" from "authenticated";

revoke select on table "public"."scraper_configs" from "authenticated";

revoke trigger on table "public"."scraper_configs" from "authenticated";

revoke truncate on table "public"."scraper_configs" from "authenticated";

revoke update on table "public"."scraper_configs" from "authenticated";

revoke delete on table "public"."scraper_configs" from "service_role";

revoke insert on table "public"."scraper_configs" from "service_role";

revoke references on table "public"."scraper_configs" from "service_role";

revoke select on table "public"."scraper_configs" from "service_role";

revoke trigger on table "public"."scraper_configs" from "service_role";

revoke truncate on table "public"."scraper_configs" from "service_role";

revoke update on table "public"."scraper_configs" from "service_role";

alter table "public"."content_sources" drop constraint "content_sources_url_key";

alter table "public"."content_sources" drop constraint "public_content_sources_link_scraper_id_fkey";

alter table "public"."content_sources" drop constraint "content_sources_pkey";

alter table "public"."scraper_configs" drop constraint "scraper_configs_pkey";

drop index if exists "public"."scraper_configs_pkey";

drop index if exists "public"."content_sources_pkey";

drop index if exists "public"."content_sources_url_key";

drop table "public"."content_sources";

drop table "public"."scraper_configs";

alter type "public"."scrape_frequency" rename to "scrape_frequency__old_version_to_be_dropped";
create type "public"."scrape_frequency" as enum ('four_times_daily', 'twice_daily', 'daily', 'twice_weekly', 'weekly', 'bi_weekly', 'monthly', 'quarterly', 'biannual', 'annually', 'never');



alter table "public"."companies" alter column scrape_frequency type "public"."scrape_frequency" using scrape_frequency::text::"public"."scrape_frequency";
drop type "public"."scrape_frequency__old_version_to_be_dropped";


drop sequence if exists "public"."scraper_configs_id_seq";


set check_function_bodies = off;

drop trigger if exists "trg_update_is_outdated" on "public"."scrapers_links";
drop function if exists "public"."update_is_outdated"();


alter table "public"."companies" alter column scrape_frequency type "public"."scrape_frequency" using scrape_frequency::text::"public"."scrape_frequency";

alter table "public"."news" add column "keywords" text;
alter table "public"."news" add column "last_scraped" timestamp with time zone default now();
alter table "public"."news" alter column "hash" set data type bigint using "hash"::bigint;
