revoke delete on table "public"."error_logs" from "anon";

revoke insert on table "public"."error_logs" from "anon";

revoke references on table "public"."error_logs" from "anon";

revoke select on table "public"."error_logs" from "anon";

revoke trigger on table "public"."error_logs" from "anon";

revoke truncate on table "public"."error_logs" from "anon";

revoke update on table "public"."error_logs" from "anon";

revoke delete on table "public"."error_logs" from "authenticated";

revoke insert on table "public"."error_logs" from "authenticated";

revoke references on table "public"."error_logs" from "authenticated";

revoke select on table "public"."error_logs" from "authenticated";

revoke trigger on table "public"."error_logs" from "authenticated";

revoke truncate on table "public"."error_logs" from "authenticated";

revoke update on table "public"."error_logs" from "authenticated";

revoke delete on table "public"."error_logs" from "service_role";

revoke insert on table "public"."error_logs" from "service_role";

revoke references on table "public"."error_logs" from "service_role";

revoke select on table "public"."error_logs" from "service_role";

revoke trigger on table "public"."error_logs" from "service_role";

revoke truncate on table "public"."error_logs" from "service_role";

revoke update on table "public"."error_logs" from "service_role";

revoke delete on table "public"."errors" from "anon";

revoke insert on table "public"."errors" from "anon";

revoke references on table "public"."errors" from "anon";

revoke select on table "public"."errors" from "anon";

revoke trigger on table "public"."errors" from "anon";

revoke truncate on table "public"."errors" from "anon";

revoke update on table "public"."errors" from "anon";

revoke delete on table "public"."errors" from "authenticated";

revoke insert on table "public"."errors" from "authenticated";

revoke references on table "public"."errors" from "authenticated";

revoke select on table "public"."errors" from "authenticated";

revoke trigger on table "public"."errors" from "authenticated";

revoke truncate on table "public"."errors" from "authenticated";

revoke update on table "public"."errors" from "authenticated";

revoke delete on table "public"."errors" from "service_role";

revoke insert on table "public"."errors" from "service_role";

revoke references on table "public"."errors" from "service_role";

revoke select on table "public"."errors" from "service_role";

revoke trigger on table "public"."errors" from "service_role";

revoke truncate on table "public"."errors" from "service_role";

revoke update on table "public"."errors" from "service_role";

drop index if exists "public"."error_correlations_unique_idx";

drop index if exists "public"."error_patterns_unique_idx";

drop materialized view if exists "public"."error_correlations";

drop view if exists "public"."error_frequency";

drop view if exists "public"."error_metrics";

drop materialized view if exists "public"."error_patterns";

drop view if exists "public"."error_stats";

drop view if exists "public"."recent_errors";

drop function if exists "public"."sync_all_logs"();

alter table "public"."error_logs" drop constraint "error_logs_pkey";

alter table "public"."errors" drop constraint "errors_pkey";

drop index if exists "public"."error_logs_created_at_idx";

drop index if exists "public"."error_logs_error_type_idx";

drop index if exists "public"."error_logs_pkey";

drop index if exists "public"."error_logs_service_name_idx";

drop index if exists "public"."error_logs_severity_idx";

drop index if exists "public"."errors_pkey";

drop index if exists "public"."idx_error_hash";

drop index if exists "public"."idx_error_pattern";

drop index if exists "public"."idx_errors_created_at";

drop index if exists "public"."idx_errors_table_record";

DROP TABLE IF EXISTS public.error_logs CASCADE;
DROP TABLE IF EXISTS public.errors CASCADE;

SELECT cron.unschedule(5);
SELECT cron.unschedule(6);

DROP FUNCTION IF EXISTS public.refresh_content_views();
DROP FUNCTION IF EXISTS public.refresh_error_views();
DROP FUNCTION IF EXISTS public.sync_all_logs();
DROP FUNCTION IF EXISTS public.get_errors_by_timerange();

DROP SCHEMA IF EXISTS pgboss CASCADE;

