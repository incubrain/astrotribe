create type "public"."referral_status" as enum ('pending', 'converted', 'abandoned');

alter table "public"."bookmark_folders" drop constraint if exists "no_duplicate_folder_name";

drop index if exists "public"."no_duplicate_folder_name";

create table "public"."blocked_ips" (
    "id" uuid not null default gen_random_uuid(),
    "ip_address" inet not null,
    "blocked_at" timestamp with time zone default now(),
    "blocked_until" timestamp with time zone not null,
    "failed_attempts" integer default 1,
    "reason" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."blocked_ips" enable row level security;

create table "public"."referrals" (
    "id" uuid not null default gen_random_uuid(),
    "referrer_code" character varying(50) not null,
    "visitor_id" uuid not null,
    "created_at" timestamp with time zone default now(),
    "converted_at" timestamp with time zone,
    "status" public.referral_status default 'pending'::public.referral_status,
    "conversion_value" numeric(10,2),
    "user_agent" text,
    "ip_address" inet,
    "landing_page" text,
    "utm_source" character varying(100),
    "utm_medium" character varying(100),
    "utm_campaign" character varying(100),
    "device_type" character varying(50),
    "browser" character varying(50),
    "country_code" character varying(2),
    "region" character varying(100),
    "is_suspicious" boolean default false,
    "security_flags" jsonb default '[]'::jsonb,
    "validation_attempts" integer default 0,
    "last_failed_attempt" timestamp with time zone,
    "client_fingerprint" text
);


alter table "public"."referrals" enable row level security;

create table "public"."referrer_blocks" (
    "id" uuid not null default gen_random_uuid(),
    "referrer_code" character varying(50) not null,
    "blocked_at" timestamp with time zone default now(),
    "blocked_by" character varying(100) not null,
    "reason" text,
    "is_permanent" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."referrer_blocks" enable row level security;

CREATE UNIQUE INDEX blocked_ips_pkey ON public.blocked_ips USING btree (id);

CREATE INDEX idx_blocked_ips_ip ON public.blocked_ips USING btree (ip_address);

CREATE INDEX idx_blocked_until ON public.blocked_ips USING btree (blocked_until);

CREATE INDEX idx_created_at ON public.referrals USING btree (created_at);

CREATE UNIQUE INDEX idx_referrer_blocks_code ON public.referrer_blocks USING btree (referrer_code);

CREATE INDEX idx_referrer_code ON public.referrals USING btree (referrer_code);

CREATE INDEX idx_status ON public.referrals USING btree (status);

CREATE UNIQUE INDEX referrals_pkey ON public.referrals USING btree (id);

CREATE UNIQUE INDEX referrer_blocks_pkey ON public.referrer_blocks USING btree (id);

alter table "public"."blocked_ips" add constraint "blocked_ips_pkey" PRIMARY KEY using index "blocked_ips_pkey";

alter table "public"."referrals" add constraint "referrals_pkey" PRIMARY KEY using index "referrals_pkey";

alter table "public"."referrer_blocks" add constraint "referrer_blocks_pkey" PRIMARY KEY using index "referrer_blocks_pkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.clear_ip_reputation_cache(ip_address inet)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- This function can be expanded based on your caching strategy
    -- For now, it just ensures the IP is removed from blocked_ips
    DELETE FROM public.blocked_ips WHERE ip_address = $1;
END;
$function$
;

create materialized view "public"."referral_stats" as  SELECT public.referrals.referrer_code,
    count(*) AS total_referrals,
    count(
        CASE
            WHEN (public.referrals.status = 'converted'::public.referral_status) THEN 1
            ELSE NULL::integer
        END) AS conversions,
    round((((count(
        CASE
            WHEN (public.referrals.status = 'converted'::public.referral_status) THEN 1
            ELSE NULL::integer
        END))::numeric / (count(*))::numeric) * (100)::numeric), 2) AS conversion_rate,
    sum(public.referrals.conversion_value) AS total_value,
    avg((EXTRACT(epoch FROM (public.referrals.converted_at - public.referrals.created_at)) / (3600)::numeric)) AS avg_conversion_time_hours,
    count(DISTINCT date_trunc('day'::text, public.referrals.created_at)) AS active_days,
    count(DISTINCT public.referrals.visitor_id) AS unique_visitors
   FROM public.referrals
  GROUP BY public.referrals.referrer_code;


create materialized view "public"."referrer_risk_metrics" as  SELECT public.referrals.referrer_code,
    count(*) AS total_referrals,
    count(
        CASE
            WHEN public.referrals.is_suspicious THEN 1
            ELSE NULL::integer
        END) AS suspicious_count,
    round((((count(
        CASE
            WHEN public.referrals.is_suspicious THEN 1
            ELSE NULL::integer
        END))::numeric / (count(*))::numeric) * (100)::numeric), 2) AS suspicious_percentage,
    count(DISTINCT public.referrals.ip_address) AS unique_ips,
    count(DISTINCT date_trunc('day'::text, public.referrals.created_at)) AS active_days,
    max(public.referrals.validation_attempts) AS max_validation_attempts,
    count(
        CASE
            WHEN (public.referrals.validation_attempts > 3) THEN 1
            ELSE NULL::integer
        END) AS high_attempt_instances
   FROM public.referrals
  GROUP BY public.referrals.referrer_code;


CREATE OR REPLACE FUNCTION public.refresh_referral_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  REFRESH MATERIALIZED VIEW public.referral_stats;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.refresh_risk_metrics()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    REFRESH MATERIALIZED VIEW public.referrer_risk_metrics;
    RETURN NULL;
END;
$function$
;

create or replace view "public"."security_metrics" as  SELECT date_trunc('hour'::text, public.referrals.created_at) AS time_bucket,
    count(*) AS total_attempts,
    count(
        CASE
            WHEN public.referrals.is_suspicious THEN 1
            ELSE NULL::integer
        END) AS suspicious_attempts,
    count(DISTINCT public.referrals.ip_address) AS unique_ips,
    count(DISTINCT public.referrals.referrer_code) AS unique_referrers,
    count(
        CASE
            WHEN (public.referrals.validation_attempts > 3) THEN 1
            ELSE NULL::integer
        END) AS high_attempt_count,
    max(public.referrals.validation_attempts) AS max_attempts
   FROM public.referrals
  GROUP BY (date_trunc('hour'::text, public.referrals.created_at))
  ORDER BY (date_trunc('hour'::text, public.referrals.created_at)) DESC;



CREATE INDEX idx_referral_stats_referrer_code ON public.referral_stats USING btree (referrer_code);
CREATE INDEX idx_referrer_risk_metrics_referrer_code ON public.referrer_risk_metrics USING btree (referrer_code);


grant delete on table "public"."blocked_ips" to "anon";

grant insert on table "public"."blocked_ips" to "anon";

grant references on table "public"."blocked_ips" to "anon";

grant select on table "public"."blocked_ips" to "anon";

grant trigger on table "public"."blocked_ips" to "anon";

grant truncate on table "public"."blocked_ips" to "anon";

grant update on table "public"."blocked_ips" to "anon";

grant delete on table "public"."blocked_ips" to "authenticated";

grant insert on table "public"."blocked_ips" to "authenticated";

grant references on table "public"."blocked_ips" to "authenticated";

grant select on table "public"."blocked_ips" to "authenticated";

grant trigger on table "public"."blocked_ips" to "authenticated";

grant truncate on table "public"."blocked_ips" to "authenticated";

grant update on table "public"."blocked_ips" to "authenticated";

grant delete on table "public"."blocked_ips" to "service_role";

grant insert on table "public"."blocked_ips" to "service_role";

grant references on table "public"."blocked_ips" to "service_role";

grant select on table "public"."blocked_ips" to "service_role";

grant trigger on table "public"."blocked_ips" to "service_role";

grant truncate on table "public"."blocked_ips" to "service_role";

grant update on table "public"."blocked_ips" to "service_role";

grant delete on table "public"."referrals" to "anon";

grant insert on table "public"."referrals" to "anon";

grant references on table "public"."referrals" to "anon";

grant select on table "public"."referrals" to "anon";

grant trigger on table "public"."referrals" to "anon";

grant truncate on table "public"."referrals" to "anon";

grant update on table "public"."referrals" to "anon";

grant delete on table "public"."referrals" to "authenticated";

grant insert on table "public"."referrals" to "authenticated";

grant references on table "public"."referrals" to "authenticated";

grant select on table "public"."referrals" to "authenticated";

grant trigger on table "public"."referrals" to "authenticated";

grant truncate on table "public"."referrals" to "authenticated";

grant update on table "public"."referrals" to "authenticated";

grant delete on table "public"."referrals" to "service_role";

grant insert on table "public"."referrals" to "service_role";

grant references on table "public"."referrals" to "service_role";

grant select on table "public"."referrals" to "service_role";

grant trigger on table "public"."referrals" to "service_role";

grant truncate on table "public"."referrals" to "service_role";

grant update on table "public"."referrals" to "service_role";

grant delete on table "public"."referrer_blocks" to "anon";

grant insert on table "public"."referrer_blocks" to "anon";

grant references on table "public"."referrer_blocks" to "anon";

grant select on table "public"."referrer_blocks" to "anon";

grant trigger on table "public"."referrer_blocks" to "anon";

grant truncate on table "public"."referrer_blocks" to "anon";

grant update on table "public"."referrer_blocks" to "anon";

grant delete on table "public"."referrer_blocks" to "authenticated";

grant insert on table "public"."referrer_blocks" to "authenticated";

grant references on table "public"."referrer_blocks" to "authenticated";

grant select on table "public"."referrer_blocks" to "authenticated";

grant trigger on table "public"."referrer_blocks" to "authenticated";

grant truncate on table "public"."referrer_blocks" to "authenticated";

grant update on table "public"."referrer_blocks" to "authenticated";

grant delete on table "public"."referrer_blocks" to "service_role";

grant insert on table "public"."referrer_blocks" to "service_role";

grant references on table "public"."referrer_blocks" to "service_role";

grant select on table "public"."referrer_blocks" to "service_role";

grant trigger on table "public"."referrer_blocks" to "service_role";

grant truncate on table "public"."referrer_blocks" to "service_role";

grant update on table "public"."referrer_blocks" to "service_role";

create policy "delete_policy"
on "public"."blocked_ips"
as permissive
for delete
to public
using ((public.authorize('blocked_ips.delete'::text) AND false));


create policy "insert_policy"
on "public"."blocked_ips"
as permissive
for insert
to public
with check ((public.authorize('blocked_ips.insert'::text) AND false));


create policy "select_policy"
on "public"."blocked_ips"
as permissive
for select
to public
using ((public.authorize('blocked_ips.select'::text) AND true));


create policy "update_policy"
on "public"."blocked_ips"
as permissive
for update
to public
using ((public.authorize('blocked_ips.update'::text) AND false));


create policy "delete_policy"
on "public"."referrals"
as permissive
for delete
to public
using ((public.authorize('referrals.delete'::text) AND false));


create policy "insert_policy"
on "public"."referrals"
as permissive
for insert
to public
with check ((public.authorize('referrals.insert'::text) AND false));


create policy "select_policy"
on "public"."referrals"
as permissive
for select
to public
using ((public.authorize('referrals.select'::text) AND true));


create policy "update_policy"
on "public"."referrals"
as permissive
for update
to public
using ((public.authorize('referrals.update'::text) AND false));


create policy "delete_policy"
on "public"."referrer_blocks"
as permissive
for delete
to public
using ((public.authorize('referrer_blocks.delete'::text) AND false));


create policy "insert_policy"
on "public"."referrer_blocks"
as permissive
for insert
to public
with check ((public.authorize('referrer_blocks.insert'::text) AND false));


create policy "select_policy"
on "public"."referrer_blocks"
as permissive
for select
to public
using ((public.authorize('referrer_blocks.select'::text) AND true));


create policy "update_policy"
on "public"."referrer_blocks"
as permissive
for update
to public
using ((public.authorize('referrer_blocks.update'::text) AND false));


CREATE TRIGGER update_blocked_ips_timestamp BEFORE UPDATE ON public.blocked_ips FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER refresh_referral_stats_trigger AFTER INSERT OR DELETE OR UPDATE ON public.referrals FOR EACH STATEMENT EXECUTE FUNCTION public.refresh_referral_stats();

CREATE TRIGGER refresh_risk_metrics_trigger AFTER INSERT OR DELETE OR UPDATE ON public.referrals FOR EACH STATEMENT EXECUTE FUNCTION public.refresh_risk_metrics();

CREATE TRIGGER update_referrer_blocks_timestamp BEFORE UPDATE ON public.referrer_blocks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


