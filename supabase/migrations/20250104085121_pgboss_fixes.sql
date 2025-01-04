drop function if exists "pgboss"."create_queue"(queue_name text, options json);

drop function if exists "pgboss"."delete_queue"(queue_name text);

drop index if exists "pgboss"."j20788af773a02005129d5a3172b430fdf5b800cca039037057dfc111_i1";

drop index if exists "pgboss"."j20788af773a02005129d5a3172b430fdf5b800cca039037057dfc111_i2";

drop index if exists "pgboss"."j20788af773a02005129d5a3172b430fdf5b800cca039037057dfc111_i3";

drop index if exists "pgboss"."j20788af773a02005129d5a3172b430fdf5b800cca039037057dfc111_i4";

drop index if exists "pgboss"."j20788af773a02005129d5a3172b430fdf5b800cca039037057dfc111_i5";

drop index if exists "pgboss"."j3f168501ed9816b51a9f5765e0742e1eb034ab6bf72c9ae3f3a975e3_i1";

drop index if exists "pgboss"."j3f168501ed9816b51a9f5765e0742e1eb034ab6bf72c9ae3f3a975e3_i2";

drop index if exists "pgboss"."j3f168501ed9816b51a9f5765e0742e1eb034ab6bf72c9ae3f3a975e3_i3";

drop index if exists "pgboss"."j3f168501ed9816b51a9f5765e0742e1eb034ab6bf72c9ae3f3a975e3_i4";

drop index if exists "pgboss"."j3f168501ed9816b51a9f5765e0742e1eb034ab6bf72c9ae3f3a975e3_i5";

grant delete on table "pgboss"."archive" to "anon";

grant insert on table "pgboss"."archive" to "anon";

grant references on table "pgboss"."archive" to "anon";

grant select on table "pgboss"."archive" to "anon";

grant trigger on table "pgboss"."archive" to "anon";

grant truncate on table "pgboss"."archive" to "anon";

grant update on table "pgboss"."archive" to "anon";

grant delete on table "pgboss"."archive" to "authenticated";

grant insert on table "pgboss"."archive" to "authenticated";

grant references on table "pgboss"."archive" to "authenticated";

grant select on table "pgboss"."archive" to "authenticated";

grant trigger on table "pgboss"."archive" to "authenticated";

grant truncate on table "pgboss"."archive" to "authenticated";

grant update on table "pgboss"."archive" to "authenticated";

grant delete on table "pgboss"."archive" to "service_role";

grant insert on table "pgboss"."archive" to "service_role";

grant references on table "pgboss"."archive" to "service_role";

grant select on table "pgboss"."archive" to "service_role";

grant trigger on table "pgboss"."archive" to "service_role";

grant truncate on table "pgboss"."archive" to "service_role";

grant update on table "pgboss"."archive" to "service_role";

grant delete on table "pgboss"."job" to "anon";

grant insert on table "pgboss"."job" to "anon";

grant references on table "pgboss"."job" to "anon";

grant select on table "pgboss"."job" to "anon";

grant trigger on table "pgboss"."job" to "anon";

grant truncate on table "pgboss"."job" to "anon";

grant update on table "pgboss"."job" to "anon";

grant delete on table "pgboss"."job" to "authenticated";

grant insert on table "pgboss"."job" to "authenticated";

grant references on table "pgboss"."job" to "authenticated";

grant select on table "pgboss"."job" to "authenticated";

grant trigger on table "pgboss"."job" to "authenticated";

grant truncate on table "pgboss"."job" to "authenticated";

grant update on table "pgboss"."job" to "authenticated";

grant delete on table "pgboss"."job" to "service_role";

grant insert on table "pgboss"."job" to "service_role";

grant references on table "pgboss"."job" to "service_role";

grant select on table "pgboss"."job" to "service_role";

grant trigger on table "pgboss"."job" to "service_role";

grant truncate on table "pgboss"."job" to "service_role";

grant update on table "pgboss"."job" to "service_role";

grant delete on table "pgboss"."queue" to "anon";

grant insert on table "pgboss"."queue" to "anon";

grant references on table "pgboss"."queue" to "anon";

grant select on table "pgboss"."queue" to "anon";

grant trigger on table "pgboss"."queue" to "anon";

grant truncate on table "pgboss"."queue" to "anon";

grant update on table "pgboss"."queue" to "anon";

grant delete on table "pgboss"."queue" to "authenticated";

grant insert on table "pgboss"."queue" to "authenticated";

grant references on table "pgboss"."queue" to "authenticated";

grant select on table "pgboss"."queue" to "authenticated";

grant trigger on table "pgboss"."queue" to "authenticated";

grant truncate on table "pgboss"."queue" to "authenticated";

grant update on table "pgboss"."queue" to "authenticated";

grant delete on table "pgboss"."queue" to "service_role";

grant insert on table "pgboss"."queue" to "service_role";

grant references on table "pgboss"."queue" to "service_role";

grant select on table "pgboss"."queue" to "service_role";

grant trigger on table "pgboss"."queue" to "service_role";

grant truncate on table "pgboss"."queue" to "service_role";

grant update on table "pgboss"."queue" to "service_role";

grant delete on table "pgboss"."schedule" to "anon";

grant insert on table "pgboss"."schedule" to "anon";

grant references on table "pgboss"."schedule" to "anon";

grant select on table "pgboss"."schedule" to "anon";

grant trigger on table "pgboss"."schedule" to "anon";

grant truncate on table "pgboss"."schedule" to "anon";

grant update on table "pgboss"."schedule" to "anon";

grant delete on table "pgboss"."schedule" to "authenticated";

grant insert on table "pgboss"."schedule" to "authenticated";

grant references on table "pgboss"."schedule" to "authenticated";

grant select on table "pgboss"."schedule" to "authenticated";

grant trigger on table "pgboss"."schedule" to "authenticated";

grant truncate on table "pgboss"."schedule" to "authenticated";

grant update on table "pgboss"."schedule" to "authenticated";

grant delete on table "pgboss"."schedule" to "service_role";

grant insert on table "pgboss"."schedule" to "service_role";

grant references on table "pgboss"."schedule" to "service_role";

grant select on table "pgboss"."schedule" to "service_role";

grant trigger on table "pgboss"."schedule" to "service_role";

grant truncate on table "pgboss"."schedule" to "service_role";

grant update on table "pgboss"."schedule" to "service_role";

grant delete on table "pgboss"."subscription" to "anon";

grant insert on table "pgboss"."subscription" to "anon";

grant references on table "pgboss"."subscription" to "anon";

grant select on table "pgboss"."subscription" to "anon";

grant trigger on table "pgboss"."subscription" to "anon";

grant truncate on table "pgboss"."subscription" to "anon";

grant update on table "pgboss"."subscription" to "anon";

grant delete on table "pgboss"."subscription" to "authenticated";

grant insert on table "pgboss"."subscription" to "authenticated";

grant references on table "pgboss"."subscription" to "authenticated";

grant select on table "pgboss"."subscription" to "authenticated";

grant trigger on table "pgboss"."subscription" to "authenticated";

grant truncate on table "pgboss"."subscription" to "authenticated";

grant update on table "pgboss"."subscription" to "authenticated";

grant delete on table "pgboss"."subscription" to "service_role";

grant insert on table "pgboss"."subscription" to "service_role";

grant references on table "pgboss"."subscription" to "service_role";

grant select on table "pgboss"."subscription" to "service_role";

grant trigger on table "pgboss"."subscription" to "service_role";

grant truncate on table "pgboss"."subscription" to "service_role";

grant update on table "pgboss"."subscription" to "service_role";

grant delete on table "pgboss"."version" to "anon";

grant insert on table "pgboss"."version" to "anon";

grant references on table "pgboss"."version" to "anon";

grant select on table "pgboss"."version" to "anon";

grant trigger on table "pgboss"."version" to "anon";

grant truncate on table "pgboss"."version" to "anon";

grant update on table "pgboss"."version" to "anon";

grant delete on table "pgboss"."version" to "authenticated";

grant insert on table "pgboss"."version" to "authenticated";

grant references on table "pgboss"."version" to "authenticated";

grant select on table "pgboss"."version" to "authenticated";

grant trigger on table "pgboss"."version" to "authenticated";

grant truncate on table "pgboss"."version" to "authenticated";

grant update on table "pgboss"."version" to "authenticated";

grant delete on table "pgboss"."version" to "service_role";

grant insert on table "pgboss"."version" to "service_role";

grant references on table "pgboss"."version" to "service_role";

grant select on table "pgboss"."version" to "service_role";

grant trigger on table "pgboss"."version" to "service_role";

grant truncate on table "pgboss"."version" to "service_role";

grant update on table "pgboss"."version" to "service_role";

alter table "public"."customer_subscription_plans" drop constraint if exists "unique_plan_id";

drop index if exists "public"."unique_plan_id";

ALTER TABLE public.customer_subscription_plans 
ALTER COLUMN features 
SET DATA TYPE jsonb 
USING to_jsonb(features);

alter table "public"."customer_subscriptions" alter column "current_end" set not null;

alter table "public"."customer_subscriptions" alter column "current_start" set not null;

ALTER TABLE public.customer_subscriptions 
ALTER COLUMN notes 
SET DATA TYPE jsonb 
USING to_jsonb(notes);

CREATE UNIQUE INDEX idx_query_performance_unique ON public.table_query_performance USING btree (query, capture_time) WHERE ((query IS NOT NULL) AND (capture_time IS NOT NULL));

CREATE UNIQUE INDEX idx_sequence_usage_unique ON public.table_sequence_usage USING btree (sequence_name, capture_time) WHERE ((sequence_name IS NOT NULL) AND (capture_time IS NOT NULL));


set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.pgboss_send(job_name text, job_data jsonb DEFAULT NULL::jsonb, job_options jsonb DEFAULT NULL::jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pgboss', 'public'
AS $function$
DECLARE
  v_job_id uuid;

BEGIN
  -- Generate UUID for job
  v_job_id := gen_random_uuid();

-- Insert job with proper schema
  INSERT INTO pgboss.job (
    id,
    name,
    priority,
    data,
    retry_limit,
    retry_delay,
    retry_backoff,
    start_after,
    expire_in,
    keep_until,
    policy
  )
  VALUES (
    v_job_id,
    job_name,
    COALESCE((job_options->>'priority')::integer, 0),
    job_data,
    COALESCE((job_options->>'retry_limit')::integer, 2),
    COALESCE((job_options->>'retry_delay')::integer, 0),
    COALESCE((job_options->>'retry_backoff')::boolean, false),
    COALESCE((job_options->>'start_after')::timestamp with time zone, now()),
    COALESCE((job_options->>'expire_in')::interval, interval '15 minutes'),
    COALESCE((job_options->>'keep_until')::timestamp with time zone, now() + interval '14 days'),
    job_options->>'policy'
  );

RETURN v_job_id;

EXCEPTION 
  WHEN others THEN
    RAISE EXCEPTION 'Failed to create job: %', SQLERRM;

END;

$function$;


