create extension if not exists "http" with schema "public" version '1.5';

alter table "public"."customer_subscriptions" alter column "current_end" drop not null;

alter table "public"."customer_subscriptions" alter column "current_start" drop not null;

drop type "public"."content_type";

set check_function_bodies = off;

create type "public"."http_header" as ("field" character varying, "value" character varying);

create type "public"."http_request" as ("method" http_method, "uri" character varying, "headers" http_header[], "content_type" character varying, "content" character varying);

create type "public"."http_response" as ("status" integer, "content_type" character varying, "headers" http_header[], "content" character varying);

CREATE OR REPLACE FUNCTION public.summarize()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
RAISE INFO 'TRIGGER FIRED FOR SUMMARIZE';
perform http((
  'POST',
  'https://idsifamzvzlpgnmlnldw.supabase.co/functions/v1/openai/summarize',
  ARRAY[http_header('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlkc2lmYW16dnpscGdubWxubGR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3MTExMDU2NiwiZXhwIjoxOTg2Njg2NTY2fQ.yt0PqEUx6vxbaRkLBuJ5cmt35qohp3Oq84ZCuzFetOo'),
        http_header('Content-Type', 'application/json')],
  'application/json',
  jsonb_build_object(
    'id', NEW.id,
    'data', NEW.details::text
  )::text
));

  return NEW;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.test()
 RETURNS text
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN auth.jwt();
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_subscription_trigger()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM pg_trigger
        JOIN pg_proc ON pg_trigger.tgfoid = pg_proc.oid
        WHERE tgname = 'customer_subscription_status_update'
        AND proname = 'update_user_plan'
    );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.users_columns_updateable()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    current_user_role public.app_role_enum;
BEGIN
    -- Example of fetching current user's role from JWT; adjust based on your setup
    current_user_role := (auth.jwt() ->> 'user_role')::public.app_role_enum;

    RAISE LOG 'users_columns_updateable: user with role % attempted to change role or plan', current_user_role;

    -- Allow updates if they're coming from our subscription trigger
    IF TG_OP = 'UPDATE' AND public.is_subscription_trigger() THEN
        RETURN NEW;
    END IF;

    -- Allow admins, super_admins, or service_role to change roles and plans
    IF current_user_role IN ('admin', 'super_admin') OR (auth.jwt() ->> 'role') = 'service_role' THEN
        RETURN NEW;
    END IF;

    -- Prevent non-admin users from changing roles and plans
    IF NEW.role IS DISTINCT FROM OLD.role THEN
        RAISE EXCEPTION 'Changing "role" is not allowed.';
    END IF;
    IF NEW.plan IS DISTINCT FROM OLD.plan THEN
        RAISE EXCEPTION 'Changing "plan" is not allowed.';
    END IF;

    RETURN NEW;
END;
$function$
;

CREATE TRIGGER contents_summarize_webhook AFTER INSERT ON public.contents FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://idsifamzvzlpgnmlnldw.supabase.co/functions/v1/openai', 'POST', '{"Content-type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlkc2lmYW16dnpscGdubWxubGR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3MTExMDU2NiwiZXhwIjoxOTg2Njg2NTY2fQ.yt0PqEUx6vxbaRkLBuJ5cmt35qohp3Oq84ZCuzFetOo"}', '{"operation":"summarize","column":"details"}', '5000');

CREATE TRIGGER contents_vectorization_webhook AFTER INSERT OR DELETE OR UPDATE ON public.contents FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://idsifamzvzlpgnmlnldw.supabase.co/functions/v1/zilliz', 'POST', '{"Content-type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlkc2lmYW16dnpscGdubWxubGR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3MTExMDU2NiwiZXhwIjoxOTg2Njg2NTY2fQ.yt0PqEUx6vxbaRkLBuJ5cmt35qohp3Oq84ZCuzFetOo"}', '{"collection_name":"Contents","inputColumns":"summary","outputColumn":"content_vector"}', '5000');


