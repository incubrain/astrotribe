alter table "public"."contents" add column "processed_by_webhook" boolean default false;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_send_webhook()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
 token_text TEXT := NULL;
 webhook_url TEXT := NULL;
 should_send BOOLEAN := FALSE;
BEGIN
    -- Return early if the record has already been processed by a webhook
    IF NEW.processed_by_webhook = TRUE THEN
        RETURN NEW;
    END IF;

-- Determine if we should send a webhook based on table-specific conditions
    should_send := public.should_send_webhook(TG_TABLE_NAME, TG_OP, OLD, NEW);

    IF should_send THEN
        -- Get secrets from vault
        BEGIN
            SELECT decrypted_secret INTO token_text
            FROM vault.decrypted_secrets
            WHERE name = 'service_key';

        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to retrieve JWT secret: %', SQLERRM;
    END;

    BEGIN
        SELECT decrypted_secret INTO webhook_url
        FROM vault.decrypted_secrets
        WHERE name = 'webhook_mastra_agents';

        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to retrieve webhook URL: %', SQLERRM;
    END;

-- Validate that we have the required values
        IF webhook_url IS NULL THEN
            RAISE NOTICE 'Cannot send webhook: webhook_url is NULL';
            RETURN NEW;
        END IF;

-- Set a default token if not found
        IF token_text IS NULL THEN
            RAISE NOTICE 'JWT token not found, using a placeholder';
            token_text := 'placeholder_for_development';
        END IF;

-- Perform webhook call via pg_net extension
        BEGIN
            PERFORM net.http_post(
                url := webhook_url,
                headers := jsonb_build_object(
                    'Content-Type', 'application/json',
                    'X-API-Key', token_text
                ),
                body := jsonb_build_object(
                    'event', TG_OP,
                    'table', TG_TABLE_NAME,
                    'schema', TG_TABLE_SCHEMA,
                    'record', to_jsonb(NEW),
                    'old_record', CASE WHEN TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
                    'webhook_id', gen_random_uuid()
                )
            );

            RAISE NOTICE 'Sent webhook for table % record %', TG_TABLE_NAME, NEW.id;

            EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to send webhook: %', SQLERRM;
        END;

    END IF;
RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.should_send_webhook(table_name text, operation text, old_record record, new_record record)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Logic for contents table
    IF table_name = 'contents' THEN
        -- Check if details changed from NULL to NOT NULL
        IF (operation = 'UPDATE' AND old_record.details IS NULL AND new_record.details IS NOT NULL) THEN
            RETURN TRUE;

-- Check for new record with details
        ELSIF (operation = 'INSERT' AND new_record.details IS NOT NULL) THEN
            RETURN TRUE;
    END IF;

-- Logic for other tables
    ELSIF table_name = 'articles' THEN
        -- Example: only trigger when content changes
        IF (operation = 'UPDATE' AND old_record.content IS DISTINCT FROM new_record.content) THEN
            RETURN TRUE;

    ELSIF (operation = 'INSERT') THEN
            RETURN TRUE;
    END IF;

-- Add more table conditions as needed
    ELSIF table_name = 'documents' THEN
        -- Custom logic for documents table
        IF (operation = 'UPDATE' AND old_record.status != 'processed' AND new_record.status = 'processed') THEN
            RETURN TRUE;
    END IF;

END IF;

-- Default: don't send webhook
RETURN FALSE;
END;
$function$;

CREATE TRIGGER contents_webhook_trigger AFTER INSERT OR UPDATE ON public.contents FOR EACH ROW EXECUTE FUNCTION public.handle_send_webhook();
