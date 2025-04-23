create extension if not exists "http" with schema "extensions" version '1.5';

alter table "public"."customer_subscriptions" alter column "current_end" drop not null;
alter table "public"."customer_subscriptions" alter column "current_start" drop not null;

DROP TYPE IF EXISTS public.http_header;
DROP table if exists "public"."token_text";

set check_function_bodies = off;

DROP FUNCTION IF EXISTS public.summarize();
DROP FUNCTION IF EXISTS public.test();

CREATE OR REPLACE FUNCTION public.summarize_webhook()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    token_text TEXT;
    webhook_url TEXT;
    inputColumn TEXT;
BEGIN
    -- Retrieve the token from Supabase Vault
    SELECT decrypted_secret INTO token_text
    FROM vault.decrypted_secrets
    WHERE name = 'service_key';
   
    SELECT decrypted_secret INTO webhook_url
    FROM vault.decrypted_secrets
    WHERE name = 'edge_url_openai';

    IF webhook_url IS NULL OR webhook_url = '' THEN
        RAISE EXCEPTION 'Webhook URL (edge_url_openai) not found or empty in vault';
    END IF;
    
    -- Check if the token exists
    IF token_text IS NULL THEN
        RAISE EXCEPTION 'Token not found in vault';
    END IF;

    inputColumn := TG_ARGV[0];

    RAISE NOTICE 'DEBUG summarize_webhook: Attempting to use webhook_url: >>%<<', webhook_url;
    RAISE NOTICE 'DEBUG summarize_webhook: Attempting to use webhook_url: >>%<<', inputColumn;

    set statement_timeout = '30s';

    perform extensions.http((
      'POST',
      webhook_url,
      ARRAY[extensions.http_header('Authorization', 'Bearer ' || token_text),
            extensions.http_header('Content-Type', 'application/json')],
      'application/json',
      jsonb_build_object(
        'record', NEW,
        'operation', 'summarize',
        'column', inputColumn
      )::text
    ));
    RETURN NEW;
END;
$function$
;


CREATE OR REPLACE FUNCTION public.vectorize_webhook()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    token_text TEXT;
    webhook_url TEXT;
    collection_name TEXT;
    inputColumns TEXT;
    outputColumn TEXT;
    record jsonb;
BEGIN
    -- Retrieve the token from Supabase Vault
    SELECT decrypted_secret INTO token_text
    FROM vault.decrypted_secrets
    WHERE name = 'service_key';

    SELECT decrypted_secret INTO webhook_url
    FROM vault.decrypted_secrets
    WHERE name = 'edge_url_zilliz';

    IF webhook_url IS NULL OR webhook_url = '' THEN
        RAISE EXCEPTION 'Webhook URL (edge_url_openai) not found or empty in vault';
    END IF;
    
    -- Check if the token exists
    IF token_text IS NULL THEN
        RAISE EXCEPTION 'Token not found in vault';
    END IF;

    record := to_jsonb(NEW);

    IF TG_TABLE_NAME = 'contents' then
      record := jsonb_set(
        to_jsonb(NEW),
        '{published_at}',
        to_jsonb(extract(epoch from NEW.published_at)::bigint));
    END IF;

    collection_name := TG_ARGV[0];
    inputColumns := TG_ARGV[1];
    outputColumn := TG_ARGV[2];


    RAISE NOTICE 'DEBUG summarize_webhook: Attempting to use webhook_url: >>%<<', webhook_url;
    RAISE NOTICE 'DEBUG summarize_webhook: Attempting to use collection_name: >>%<<', collection_name;
    RAISE NOTICE 'DEBUG summarize_webhook: Attempting to use inputColumns: >>%<<', inputColumns;
    RAISE NOTICE 'DEBUG summarize_webhook: Attempting to use webhooutputColumnok_url: >>%<<', outputColumn;

    set statement_timeout = '30s';

    perform extensions.http((
      'POST',
      webhook_url,
      ARRAY[extensions.http_header('Authorization', 'Bearer ' || token_text),
            extensions.http_header('Content-Type', 'application/json')],
      'application/json',
      jsonb_build_object(
        'collection_name', collection_name,
        'inputColumns', inputColumns,
        'outputColumn', outputColumn,
        'record', record,
        'operation', TG_OP
      )::text
    ));
    RETURN NEW;
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

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'contents_summarize_webhook'
  ) THEN
    CREATE TRIGGER contents_summarize_webhook
    AFTER INSERT OR UPDATE OF details
    ON public.contents
    FOR EACH ROW
    EXECUTE FUNCTION public.summarize_webhook('details');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'contents_vectorization_webhook'
  ) THEN
    CREATE TRIGGER contents_vectorization_webhook
    AFTER INSERT OR UPDATE OF summary
    ON public.contents
    FOR EACH ROW
    EXECUTE FUNCTION public.vectorize_webhook('Contents', 'summary', 'content_vector');
  END IF;
END
$$;
