-- Safely create http extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA "extensions" VERSION '1.5';

-- Safely alter columns by checking if they are not null first
DO $$
BEGIN
  -- Check if current_end column is NOT NULL
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'customer_subscriptions'
    AND column_name = 'current_end'
    AND is_nullable = 'NO'
  ) THEN
    -- Alter column only if it's NOT NULL
    ALTER TABLE "public"."customer_subscriptions" ALTER COLUMN "current_end" DROP NOT NULL;
  END IF;

  -- Check if current_start column is NOT NULL
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'customer_subscriptions'
    AND column_name = 'current_start'
    AND is_nullable = 'NO'
  ) THEN
    -- Alter column only if it's NOT NULL
    ALTER TABLE "public"."customer_subscriptions" ALTER COLUMN "current_start" DROP NOT NULL;
  END IF;
END $$;

-- Safely drop type and table
DROP TYPE IF EXISTS public.http_header;
DROP TABLE IF EXISTS "public"."token_text";

-- Turn off checking function bodies
SET check_function_bodies = off;

-- Drop functions if they exist
DROP FUNCTION IF EXISTS public.summarize();
DROP FUNCTION IF EXISTS public.test();

-- Create or replace function for summarize_webhook (this is idempotent by default)
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
$function$;

-- Create or replace function for vectorize_webhook (this is idempotent by default)
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
$function$;

-- Create or replace function for is_subscription_trigger (this is idempotent by default)
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
$function$;

-- Create or replace function for users_columns_updateable (this is idempotent by default)
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
$function$;

-- Safely create triggers only if they don't exist
DO $$
BEGIN
  -- Check if contents_summarize_webhook trigger exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'contents_summarize_webhook'
    AND tgrelid = 'public.contents'::regclass
  ) THEN
    -- Only try to create trigger if the contents table exists
    IF EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'contents'
    ) THEN
      CREATE TRIGGER contents_summarize_webhook
      AFTER INSERT OR UPDATE OF details
      ON public.contents
      FOR EACH ROW
      EXECUTE FUNCTION public.summarize_webhook('details');
    ELSE
      RAISE NOTICE 'Skipping creation of contents_summarize_webhook trigger: contents table does not exist';
    END IF;
  END IF;

  -- Check if contents_vectorization_webhook trigger exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'contents_vectorization_webhook'
    AND tgrelid = 'public.contents'::regclass
  ) THEN
    -- Only try to create trigger if the contents table exists
    IF EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'contents'
    ) THEN
      CREATE TRIGGER contents_vectorization_webhook
      AFTER INSERT OR UPDATE OF summary
      ON public.contents
      FOR EACH ROW
      EXECUTE FUNCTION public.vectorize_webhook('Contents', 'summary', 'content_vector');
    ELSE
      RAISE NOTICE 'Skipping creation of contents_vectorization_webhook trigger: contents table does not exist';
    END IF;
  END IF;
END
$$;