set check_function_bodies = off;

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


