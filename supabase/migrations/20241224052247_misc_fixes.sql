drop policy "insert_own_profile" on "public"."user_profiles";

drop policy "read_own_profile" on "public"."user_profiles";

drop policy "update_own_profile" on "public"."user_profiles";

drop policy "delete_policy" on "public"."table_maintenance_log";

drop policy "insert_policy" on "public"."table_maintenance_log";

drop policy "select_policy" on "public"."table_maintenance_log";

drop policy "update_policy" on "public"."table_maintenance_log";

alter table "public"."ads" alter column "company_id" drop not null;

alter table "public"."ads" alter column "package_id" drop not null;

set check_function_bodies = off;

create or replace view "public"."error_metrics" as  SELECT error_metrics.time_bucket,
    error_metrics.service_name,
    error_metrics.error_type,
    error_metrics.severity,
    error_metrics.error_count
   FROM public.error_metrics;

create or replace view "public"."security_metrics" as  SELECT security_metrics.time_bucket,
    security_metrics.total_attempts,
    security_metrics.suspicious_attempts,
    security_metrics.unique_ips,
    security_metrics.unique_referrers,
    security_metrics.high_attempt_count,
    security_metrics.max_attempts
   FROM public.security_metrics;

CREATE OR REPLACE FUNCTION public.setup_role_hierarchy()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Clear existing hierarchy
    DELETE FROM public.role_hierarchy;

-- Insert role hierarchy relationships
    INSERT INTO public.role_hierarchy (parent_role, child_role) VALUES
    ('super_admin', 'admin'),
    ('admin', 'moderator'),
    ('moderator', 'user'),
    ('user', 'guest');

-- Log the setup
    RAISE NOTICE 'Role hierarchy setup completed';

END;

$function$;

create policy "delete_policy"
on "public"."table_maintenance_log"
as permissive
for delete
to public
using ((public.authorize('table_maintenance_log.delete'::text) AND false));

create policy "insert_policy"
on "public"."table_maintenance_log"
as permissive
for insert
to public
with check ((public.authorize('table_maintenance_log.insert'::text) AND false));

create policy "select_policy"
on "public"."table_maintenance_log"
as permissive
for select
to public
using ((public.authorize('table_maintenance_log.select'::text) AND true));

create policy "update_policy"
on "public"."table_maintenance_log"
as permissive
for update
to public
using ((public.authorize('table_maintenance_log.update'::text) AND false));
