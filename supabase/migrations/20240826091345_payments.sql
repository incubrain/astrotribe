create sequence "public"."customer_payments_id_seq";

create sequence "public"."customer_refunds_id_seq";

create sequence "public"."customer_subscription_plans_id_seq";

create sequence "public"."customer_subscriptions_id_seq";

create sequence "public"."customers_processed_webhooks_id_seq";

create sequence "public"."payment_providers_id_seq";

create sequence "public"."table_maintenance_log_id_seq";

alter table "public"."news" drop constraint "news_category_id_fkey";

alter table "public"."companies" alter column "content_status" drop default;

alter table "public"."news" alter column "content_status" drop default;

alter table "public"."newsletters" alter column "content_status" drop default;

alter table "public"."research" alter column "content_status" drop default;

alter type "public"."content_status" rename to "content_status__old_version_to_be_dropped";

create type "public"."content_status" as enum ('draft', 'agent_action', 'agent_review', 'human_review', 'trash', 'ready', 'scheduled', 'unpublished', 'archived', 'published', 'failed', 'crawled', 'scraped', 'outdated');

create table "public"."blacklisted_domains" (
    "id" uuid not null default extensions.gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "url" text not null,
    "reason" text
);


alter table "public"."blacklisted_domains" enable row level security;

create table "public"."customer_payments" (
    "id" integer not null default nextval('public.customer_payments_id_seq'::regclass),
    "user_id" uuid not null,
    "subscription_id" integer,
    "payment_provider_id" integer not null,
    "external_payment_id" character varying(255) not null,
    "external_order_id" character varying(255),
    "amount" numeric(10,2) not null,
    "currency" character varying(3) not null,
    "status" character varying(50) not null,
    "method" character varying(50),
    "description" text,
    "fee" numeric(10,2),
    "tax" numeric(10,2),
    "error_code" character varying(50),
    "error_description" text,
    "acquirer_data" jsonb,
    "notes" jsonb,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "order_id" text,
    "invoice_id" text,
    "international" boolean,
    "amount_refunded" numeric(10,2),
    "amount_transferred" numeric(10,2),
    "refund_status" text,
    "captured" boolean,
    "bank" text,
    "wallet" text,
    "vpa" text,
    "error_source" text,
    "error_step" text,
    "error_reason" text
);


alter table "public"."customer_payments" enable row level security;

create table "public"."customer_processed_webhooks" (
    "id" integer not null default nextval('public.customers_processed_webhooks_id_seq'::regclass),
    "event_id" text not null,
    "event_type" text not null,
    "processed_at" timestamp with time zone not null
);


alter table "public"."customer_processed_webhooks" enable row level security;

create table "public"."customer_refunds" (
    "id" integer not null default nextval('public.customer_refunds_id_seq'::regclass),
    "payment_id" integer not null,
    "external_refund_id" character varying(255) not null,
    "amount" numeric(10,2) not null,
    "status" character varying(50) not null,
    "speed_processed" character varying(20),
    "speed_requested" character varying(20),
    "notes" jsonb,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "currency" text,
    "receipt" text,
    "acquirer_data" jsonb,
    "batch_id" text
);


alter table "public"."customer_refunds" enable row level security;

create table "public"."customer_subscription_plans" (
    "id" integer not null default nextval('public.customer_subscription_plans_id_seq'::regclass),
    "external_plan_id" character varying(255),
    "name" character varying(100) not null,
    "description" text,
    "interval" integer not null,
    "interval_type" character varying(20) not null,
    "monthly_amount" numeric(10,2) not null,
    "annual_amount" numeric(10,2) not null,
    "currency" character varying(3) not null,
    "features" jsonb,
    "is_active" boolean default true,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone
);


alter table "public"."customer_subscription_plans" enable row level security;

create table "public"."customer_subscriptions" (
    "id" integer not null default nextval('public.customer_subscriptions_id_seq'::regclass),
    "user_id" uuid not null,
    "plan_id" integer not null,
    "payment_provider_id" integer not null,
    "external_subscription_id" character varying(255) not null,
    "status" character varying(50) not null,
    "quantity" integer default 1,
    "current_start" timestamp with time zone not null,
    "current_end" timestamp with time zone not null,
    "ended_at" timestamp with time zone,
    "cancel_at_period_end" boolean default false,
    "total_count" integer,
    "paid_count" integer,
    "remaining_count" integer,
    "auth_attempts" integer default 0,
    "notes" jsonb,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "type" integer,
    "charge_at" timestamp with time zone,
    "start_at" timestamp with time zone,
    "end_at" timestamp with time zone,
    "customer_notify" boolean,
    "expire_by" timestamp with time zone,
    "short_url" text,
    "has_scheduled_changes" boolean,
    "change_scheduled_at" timestamp with time zone,
    "source" text,
    "offer_id" text,
    "pause_initiated_by" text,
    "cancel_initiated_by" text
);


alter table "public"."customer_subscriptions" enable row level security;

create table "public"."payment_providers" (
    "id" integer not null default nextval('public.payment_providers_id_seq'::regclass),
    "name" character varying(50) not null,
    "is_active" boolean default true,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."payment_providers" enable row level security;

create table "public"."table_maintenance_log" (
    "id" integer not null default nextval('public.table_maintenance_log_id_seq'::regclass),
    "operation" text,
    "detail" text,
    "logged_at" timestamp with time zone default now()
);


alter table "public"."table_maintenance_log" enable row level security;

create table "public"."table_query_performance" (
    "query" text,
    "avg_duration" interval,
    "execution_count" bigint,
    "capture_time" timestamp with time zone
);


alter table "public"."table_query_performance" enable row level security;

create table "public"."table_sequence_usage" (
    "sequence_name" text,
    "current_value" bigint,
    "max_value" bigint,
    "capture_time" timestamp with time zone default now()
);


alter table "public"."table_sequence_usage" enable row level security;

create table "public"."table_statistics" (
    "table_name" text not null,
    "row_count" bigint,
    "table_size" bigint,
    "index_size" bigint,
    "live_tuples" bigint,
    "dead_tuples" bigint,
    "last_vacuum" timestamp with time zone,
    "last_analyze" timestamp with time zone,
    "estimated_bloat_ratio" double precision,
    "buffer_cache_hit_ratio" double precision,
    "index_usage" jsonb,
    "seq_scan_count" bigint,
    "index_scan_count" bigint,
    "capture_time" timestamp with time zone not null
);


alter table "public"."table_statistics" enable row level security;

alter table "public"."companies" alter column content_status type "public"."content_status" using content_status::text::"public"."content_status";

alter table "public"."content_statuses" alter column content_status type "public"."content_status" using content_status::text::"public"."content_status";

alter table "public"."news" alter column content_status type "public"."content_status" using content_status::text::"public"."content_status";

alter table "public"."newsletters" alter column content_status type "public"."content_status" using content_status::text::"public"."content_status";

alter table "public"."research" alter column content_status type "public"."content_status" using content_status::text::"public"."content_status";

alter table "public"."companies" alter column "content_status" set default 'draft'::public.content_status;

alter table "public"."news" alter column "content_status" set default 'draft'::public.content_status;

alter table "public"."newsletters" alter column "content_status" set default 'draft'::public.content_status;

alter table "public"."research" alter column "content_status" set default 'draft'::public.content_status;

drop type "public"."content_status__old_version_to_be_dropped";

alter table "public"."blacklisted_urls" add column "company_id" uuid;

alter table "public"."companies" drop column "is_valid";

alter table "public"."user_profiles" drop column "quote";

alter sequence "public"."customer_payments_id_seq" owned by "public"."customer_payments"."id";

alter sequence "public"."customer_refunds_id_seq" owned by "public"."customer_refunds"."id";

alter sequence "public"."customer_subscription_plans_id_seq" owned by "public"."customer_subscription_plans"."id";

alter sequence "public"."customer_subscriptions_id_seq" owned by "public"."customer_subscriptions"."id";

alter sequence "public"."customers_processed_webhooks_id_seq" owned by "public"."customer_processed_webhooks"."id";

alter sequence "public"."payment_providers_id_seq" owned by "public"."payment_providers"."id";

alter sequence "public"."table_maintenance_log_id_seq" owned by "public"."table_maintenance_log"."id";

CREATE UNIQUE INDEX blacklisted_domains_pkey ON public.blacklisted_domains USING btree (id);

CREATE UNIQUE INDEX blacklisted_domains_url_key ON public.blacklisted_domains USING btree (url);

CREATE UNIQUE INDEX customer_payments_pkey ON public.customer_payments USING btree (id);

CREATE UNIQUE INDEX customer_refunds_pkey ON public.customer_refunds USING btree (id);

CREATE UNIQUE INDEX customer_subscription_plans_external_plan_id_key ON public.customer_subscription_plans USING btree (external_plan_id);

CREATE UNIQUE INDEX customer_subscription_plans_pkey ON public.customer_subscription_plans USING btree (id);

CREATE UNIQUE INDEX customer_subscriptions_pkey ON public.customer_subscriptions USING btree (id);

CREATE UNIQUE INDEX customers_processed_webhooks_event_id_key ON public.customer_processed_webhooks USING btree (event_id);

CREATE UNIQUE INDEX customers_processed_webhooks_pkey ON public.customer_processed_webhooks USING btree (id);

CREATE UNIQUE INDEX payment_providers_name_key ON public.payment_providers USING btree (name);

CREATE UNIQUE INDEX payment_providers_pkey ON public.payment_providers USING btree (id);

CREATE UNIQUE INDEX table_maintenance_log_pkey ON public.table_maintenance_log USING btree (id);

CREATE UNIQUE INDEX table_statistics_pkey ON public.table_statistics USING btree (table_name, capture_time);

alter table "public"."blacklisted_domains" add constraint "blacklisted_domains_pkey" PRIMARY KEY using index "blacklisted_domains_pkey";

alter table "public"."customer_payments" add constraint "customer_payments_pkey" PRIMARY KEY using index "customer_payments_pkey";

alter table "public"."customer_processed_webhooks" add constraint "customers_processed_webhooks_pkey" PRIMARY KEY using index "customers_processed_webhooks_pkey";

alter table "public"."customer_refunds" add constraint "customer_refunds_pkey" PRIMARY KEY using index "customer_refunds_pkey";

alter table "public"."customer_subscription_plans" add constraint "customer_subscription_plans_pkey" PRIMARY KEY using index "customer_subscription_plans_pkey";

alter table "public"."customer_subscriptions" add constraint "customer_subscriptions_pkey" PRIMARY KEY using index "customer_subscriptions_pkey";

alter table "public"."payment_providers" add constraint "payment_providers_pkey" PRIMARY KEY using index "payment_providers_pkey";

alter table "public"."table_maintenance_log" add constraint "table_maintenance_log_pkey" PRIMARY KEY using index "table_maintenance_log_pkey";

alter table "public"."table_statistics" add constraint "table_statistics_pkey" PRIMARY KEY using index "table_statistics_pkey";

alter table "public"."blacklisted_domains" add constraint "blacklisted_domains_url_key" UNIQUE using index "blacklisted_domains_url_key";

alter table "public"."blacklisted_urls" add constraint "public_blacklisted_urls_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."blacklisted_urls" validate constraint "public_blacklisted_urls_company_id_fkey";

alter table "public"."customer_payments" add constraint "customer_payments_payment_provider_id_fkey" FOREIGN KEY (payment_provider_id) REFERENCES public.payment_providers(id) not valid;

alter table "public"."customer_payments" validate constraint "customer_payments_payment_provider_id_fkey";

alter table "public"."customer_payments" add constraint "customer_payments_subscription_id_fkey" FOREIGN KEY (subscription_id) REFERENCES public.customer_subscriptions(id) not valid;

alter table "public"."customer_payments" validate constraint "customer_payments_subscription_id_fkey";

alter table "public"."customer_payments" add constraint "customer_payments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) not valid;

alter table "public"."customer_payments" validate constraint "customer_payments_user_id_fkey";

alter table "public"."customer_processed_webhooks" add constraint "customers_processed_webhooks_event_id_key" UNIQUE using index "customers_processed_webhooks_event_id_key";

alter table "public"."customer_refunds" add constraint "customer_refunds_payment_id_fkey" FOREIGN KEY (payment_id) REFERENCES public.customer_payments(id) not valid;

alter table "public"."customer_refunds" validate constraint "customer_refunds_payment_id_fkey";

alter table "public"."customer_subscription_plans" add constraint "customer_subscription_plans_external_plan_id_key" UNIQUE using index "customer_subscription_plans_external_plan_id_key";

alter table "public"."customer_subscriptions" add constraint "customer_subscriptions_payment_provider_id_fkey" FOREIGN KEY (payment_provider_id) REFERENCES public.payment_providers(id) not valid;

alter table "public"."customer_subscriptions" validate constraint "customer_subscriptions_payment_provider_id_fkey";

alter table "public"."customer_subscriptions" add constraint "customer_subscriptions_plan_id_fkey" FOREIGN KEY (plan_id) REFERENCES public.customer_subscription_plans(id) not valid;

alter table "public"."customer_subscriptions" validate constraint "customer_subscriptions_plan_id_fkey";

alter table "public"."customer_subscriptions" add constraint "customer_subscriptions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) not valid;

alter table "public"."customer_subscriptions" validate constraint "customer_subscriptions_user_id_fkey";

alter table "public"."news" add constraint "public_news_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."news" validate constraint "public_news_category_id_fkey";

alter table "public"."payment_providers" add constraint "payment_providers_name_key" UNIQUE using index "payment_providers_name_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.calculate_table_growth(p_table_name text, p_time_period interval, p_num_periods integer)
 RETURNS TABLE(period_end_time timestamp with time zone, row_count bigint, growth_count bigint, growth_percentage numeric)
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_end_time TIMESTAMP WITH TIME ZONE;
    v_period_start_time TIMESTAMP WITH TIME ZONE;
    v_previous_count BIGINT := 0;
BEGIN
    -- Get the most recent capture time
    SELECT MAX(capture_time) INTO v_end_time
    FROM table_statistics
    WHERE table_name = p_table_name;

    -- Loop through the periods
    FOR i IN 0..(p_num_periods - 1) LOOP
        v_period_start_time := v_end_time - (i * p_time_period);
        
        RETURN QUERY
        WITH period_data AS (
            SELECT row_count
            FROM table_statistics
            WHERE table_name = p_table_name
              AND capture_time <= v_period_start_time
            ORDER BY capture_time DESC
            LIMIT 1
        )
        SELECT 
            v_period_start_time AS period_end_time,
            COALESCE(pd.row_count, 0) AS row_count,
            CASE 
                WHEN i = 0 THEN 0
                ELSE COALESCE(pd.row_count, 0) - v_previous_count
            END AS growth_count,
            CASE 
                WHEN i = 0 THEN 0
                ELSE ROUND(((COALESCE(pd.row_count, 0) - v_previous_count)::NUMERIC / NULLIF(v_previous_count, 0)) * 100, 2)
            END AS growth_percentage
        FROM period_data pd;

        -- Store the current count for the next iteration
        SELECT COALESCE(pd.row_count, 0) INTO v_previous_count
        FROM period_data pd;
    END LOOP;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.cleanup_table_stats()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    DELETE FROM table_statistics WHERE capture_time < (now() - interval '180 days');
    DELETE FROM slow_queries WHERE capture_time < (now() - interval '180 days');
END;
$function$
;

CREATE OR REPLACE FUNCTION public.gather_database_stats()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_capture_time timestamp with time zone := now();
    v_table record;
BEGIN
    -- Gather statistics for each table in the public schema
    FOR v_table IN 
        SELECT relname
        FROM pg_stat_user_tables
        WHERE schemaname = 'public'
    LOOP
        -- This part uses exception handling to catch any issues with specific tables
        BEGIN
            INSERT INTO table_statistics
            SELECT
                v_table.relname,
                reltuples::bigint AS row_count,
                pg_total_relation_size(v_table.relname::regclass) AS table_size,
                (pg_total_relation_size(v_table.relname::regclass) - pg_relation_size(v_table.relname::regclass)) AS index_size,
                n_live_tup::bigint,
                n_dead_tup::bigint,
                last_vacuum,
                last_analyze,
                (CASE WHEN n_live_tup > 0
                    THEN (1 - (pg_relation_size(v_table.relname::regclass) / (n_live_tup * (24 + 8))))::float
                    ELSE 0
                END) AS estimated_bloat_ratio,
                (
                    COALESCE(heap_blks_hit, 0) / (COALESCE(heap_blks_hit, 0) + COALESCE(heap_blks_read, 0) + 0.000001)
                )::float AS buffer_cache_hit_ratio,
                (
                    SELECT jsonb_object_agg(indexrelname, COALESCE(idx_scan, 0))
                    FROM pg_stat_user_indexes
                    WHERE schemaname = 'public' AND relname = v_table.relname
                ) AS index_usage,
                seq_scan::bigint,
                idx_scan::bigint,
                v_capture_time
            FROM pg_stat_user_tables
            LEFT JOIN pg_class ON pg_class.relname = v_table.relname
            WHERE schemaname = 'public' AND relname = v_table.relname;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'Error gathering statistics for table %: %', v_table.relname, SQLERRM;
        END;
    END LOOP;

    -- Log slow queries with average duration and execution count
    INSERT INTO table_query_performance (query, avg_duration, execution_count, capture_time)
    SELECT query, 
           AVG(now() - query_start) AS avg_duration, 
           COUNT(*) AS execution_count,
           v_capture_time
    FROM pg_stat_activity
    WHERE state = 'active'
      AND (now() - query_start) > interval '1 second'
      AND query NOT ILIKE '%pg_stat_activity%'
    GROUP BY query;

END;
$function$
;

CREATE OR REPLACE FUNCTION public.perform_weekly_maintenance()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_table RECORD;
    v_statement TEXT;
    v_db_size BIGINT;
    v_free_space BIGINT;
BEGIN
    -- 1. Vacuum analyze all tables in the public schema
    FOR v_table IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public')
    LOOP
        v_statement := 'VACUUM ANALYZE public.' || quote_ident(v_table.tablename);
        EXECUTE v_statement;
        RAISE NOTICE 'Vacuumed and analyzed %', v_table.tablename;
    END LOOP;

    -- 2. Reindex all indexes in the public schema
    FOR v_table IN (SELECT indexname FROM pg_indexes WHERE schemaname = 'public')
    LOOP
        v_statement := 'REINDEX INDEX public.' || quote_ident(v_table.indexname);
        EXECUTE v_statement;
        RAISE NOTICE 'Reindexed %', v_table.indexname;
    END LOOP;

    -- 3. Identify and log queries with suboptimal plans
    INSERT INTO public.table_maintenance_log (operation, detail)
    SELECT 'Suboptimal query plan', query
    FROM pg_stat_statements
    WHERE (total_time / calls) > 1000  -- queries taking on average more than 1 second
    AND calls > 100  -- executed more than 100 times
    ORDER BY (total_time / calls) DESC
    LIMIT 5;

    -- 4. Check for duplicate indexes
    INSERT INTO public.table_maintenance_log (operation, detail)
    SELECT 'Duplicate index found', 
           format('%I and %I on %I.%I', idx1.indexname, idx2.indexname, idx1.tablename, idx1.schemaname)
    FROM (
        SELECT schemaname, tablename, indexname, 
               (array_agg(attname ORDER BY attnum))[1:indexdef_array_len] AS columns
        FROM pg_indexes
        JOIN pg_attribute ON attrelid = (schemaname || '.' || tablename)::regclass
        JOIN unnest(string_to_array(substr(indexdef, strpos(indexdef, '(')+1, strpos(indexdef, ')')-strpos(indexdef, '(')-1), ', ')) WITH ORDINALITY As idxcols(col, ord)
            ON attname = col
        GROUP BY schemaname, tablename, indexname
    ) idx1
    JOIN (
        SELECT schemaname, tablename, indexname, 
               (array_agg(attname ORDER BY attnum))[1:indexdef_array_len] AS columns
        FROM pg_indexes
        JOIN pg_attribute ON attrelid = (schemaname || '.' || tablename)::regclass
        JOIN unnest(string_to_array(substr(indexdef, strpos(indexdef, '(')+1, strpos(indexdef, ')')-strpos(indexdef, '(')-1), ', ')) WITH ORDINALITY As idxcols(col, ord)
            ON attname = col
        GROUP BY schemaname, tablename, indexname
    ) idx2 ON idx1.schemaname = idx2.schemaname 
           AND idx1.tablename = idx2.tablename 
           AND idx1.indexname < idx2.indexname
           AND idx1.columns @> idx2.columns 
           AND idx1.columns <@ idx2.columns;

    -- 5. Monitor table and index fragmentation
    INSERT INTO public.table_maintenance_log (operation, detail)
    SELECT 'High fragmentation', 
           relname || ' (fragmentation: ' || round(100 * (pg_stat_get_live_tuples(c.oid)::float / GREATEST(pg_stat_get_live_tuples(c.oid) + pg_stat_get_dead_tuples(c.oid), 1)), 2) || '%)'
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE relkind IN ('r', 'i')
    AND n.nspname = 'public'
    AND pg_stat_get_live_tuples(c.oid) + pg_stat_get_dead_tuples(c.oid) > 10000
    AND 100 * (pg_stat_get_live_tuples(c.oid)::float / GREATEST(pg_stat_get_live_tuples(c.oid) + pg_stat_get_dead_tuples(c.oid), 1)) < 70;

    -- 6. Monitor connection pool usage
    INSERT INTO public.table_maintenance_log (operation, detail)
    SELECT 'High connection usage', 
           'Current connections: ' || current_setting('max_connections')::int - count(*) || 
           ' out of ' || current_setting('max_connections')
    FROM pg_stat_activity
    WHERE NOT pid = pg_backend_pid()
    HAVING (current_setting('max_connections')::float - count(*)) / current_setting('max_connections')::float < 0.2;

    -- 7. Monitor disk space
    SELECT pg_database_size(current_database()) INTO v_db_size;
    SELECT CAST(split_part(system_free, ' ', 1) AS BIGINT) * 1024 * 1024 INTO v_free_space 
    FROM pg_settings WHERE name = 'data_directory_free';
    
    IF v_free_space < v_db_size * 0.2 THEN  -- Less than 20% free space
        INSERT INTO public.table_maintenance_log (operation, detail)
        VALUES ('Low disk space', format('Free space: %s MB, DB size: %s MB', v_free_space / (1024 * 1024), v_db_size / (1024 * 1024)));
    END IF;

    -- 8. Monitor sequence usage
    INSERT INTO public.table_sequence_usage (sequence_name, current_value, max_value)
    SELECT sequence_name, 
           COALESCE(last_value, 0) as current_value,
           CASE WHEN data_type = 'bigint' THEN 9223372036854775807
                ELSE 2147483647 
           END as max_value
    FROM information_schema.sequences;

    -- Alert if any sequence is close to max value
    INSERT INTO public.table_maintenance_log (operation, detail)
    SELECT 'Sequence near max value', 
           sequence_name || ' (' || round(100.0 * current_value / max_value, 2) || '% used)'
    FROM public.table_sequence_usage
    WHERE (current_value::float / max_value::float) > 0.75;

    -- 9. Monitor for long-running transactions
    INSERT INTO public.table_maintenance_log (operation, detail)
    SELECT 'Long-running transaction', 
           'PID: ' || pid || ', Duration: ' || age(now(), xact_start)::text || 
           ', Query: ' || substring(query from 1 for 50) || '...'
    FROM pg_stat_activity
    WHERE state = 'active'
    AND xact_start < now() - interval '1 hour'
    ORDER BY age(now(), xact_start) DESC
    LIMIT 5;

    -- 10. Monitor autovacuum performance
    INSERT INTO public.table_maintenance_log (operation, detail)
    SELECT 'Autovacuum needed', 
           relname || ' (dead tuples: ' || n_dead_tup || ', threshold: ' || threshold || ')'
    FROM (
        SELECT c.oid::regclass as relname,
               s.n_dead_tup,
               current_setting('autovacuum_vacuum_threshold')::integer + 
               current_setting('autovacuum_vacuum_scale_factor')::float * c.reltuples AS threshold
        FROM pg_class c
        JOIN pg_stat_user_tables s ON s.relid = c.oid
        WHERE c.relkind = 'r'
    ) AS av
    WHERE n_dead_tup > threshold;

    RAISE NOTICE 'Weekly maintenance and monitoring completed';
END;
$function$
;

grant delete on table "public"."blacklisted_domains" to "anon";

grant insert on table "public"."blacklisted_domains" to "anon";

grant references on table "public"."blacklisted_domains" to "anon";

grant select on table "public"."blacklisted_domains" to "anon";

grant trigger on table "public"."blacklisted_domains" to "anon";

grant truncate on table "public"."blacklisted_domains" to "anon";

grant update on table "public"."blacklisted_domains" to "anon";

grant delete on table "public"."blacklisted_domains" to "authenticated";

grant insert on table "public"."blacklisted_domains" to "authenticated";

grant references on table "public"."blacklisted_domains" to "authenticated";

grant select on table "public"."blacklisted_domains" to "authenticated";

grant trigger on table "public"."blacklisted_domains" to "authenticated";

grant truncate on table "public"."blacklisted_domains" to "authenticated";

grant update on table "public"."blacklisted_domains" to "authenticated";

grant delete on table "public"."blacklisted_domains" to "service_role";

grant insert on table "public"."blacklisted_domains" to "service_role";

grant references on table "public"."blacklisted_domains" to "service_role";

grant select on table "public"."blacklisted_domains" to "service_role";

grant trigger on table "public"."blacklisted_domains" to "service_role";

grant truncate on table "public"."blacklisted_domains" to "service_role";

grant update on table "public"."blacklisted_domains" to "service_role";

grant delete on table "public"."customer_payments" to "anon";

grant insert on table "public"."customer_payments" to "anon";

grant references on table "public"."customer_payments" to "anon";

grant select on table "public"."customer_payments" to "anon";

grant trigger on table "public"."customer_payments" to "anon";

grant truncate on table "public"."customer_payments" to "anon";

grant update on table "public"."customer_payments" to "anon";

grant delete on table "public"."customer_payments" to "authenticated";

grant insert on table "public"."customer_payments" to "authenticated";

grant references on table "public"."customer_payments" to "authenticated";

grant select on table "public"."customer_payments" to "authenticated";

grant trigger on table "public"."customer_payments" to "authenticated";

grant truncate on table "public"."customer_payments" to "authenticated";

grant update on table "public"."customer_payments" to "authenticated";

grant delete on table "public"."customer_payments" to "service_role";

grant insert on table "public"."customer_payments" to "service_role";

grant references on table "public"."customer_payments" to "service_role";

grant select on table "public"."customer_payments" to "service_role";

grant trigger on table "public"."customer_payments" to "service_role";

grant truncate on table "public"."customer_payments" to "service_role";

grant update on table "public"."customer_payments" to "service_role";

grant delete on table "public"."customer_processed_webhooks" to "anon";

grant insert on table "public"."customer_processed_webhooks" to "anon";

grant references on table "public"."customer_processed_webhooks" to "anon";

grant select on table "public"."customer_processed_webhooks" to "anon";

grant trigger on table "public"."customer_processed_webhooks" to "anon";

grant truncate on table "public"."customer_processed_webhooks" to "anon";

grant update on table "public"."customer_processed_webhooks" to "anon";

grant delete on table "public"."customer_processed_webhooks" to "authenticated";

grant insert on table "public"."customer_processed_webhooks" to "authenticated";

grant references on table "public"."customer_processed_webhooks" to "authenticated";

grant select on table "public"."customer_processed_webhooks" to "authenticated";

grant trigger on table "public"."customer_processed_webhooks" to "authenticated";

grant truncate on table "public"."customer_processed_webhooks" to "authenticated";

grant update on table "public"."customer_processed_webhooks" to "authenticated";

grant delete on table "public"."customer_processed_webhooks" to "service_role";

grant insert on table "public"."customer_processed_webhooks" to "service_role";

grant references on table "public"."customer_processed_webhooks" to "service_role";

grant select on table "public"."customer_processed_webhooks" to "service_role";

grant trigger on table "public"."customer_processed_webhooks" to "service_role";

grant truncate on table "public"."customer_processed_webhooks" to "service_role";

grant update on table "public"."customer_processed_webhooks" to "service_role";

grant delete on table "public"."customer_refunds" to "anon";

grant insert on table "public"."customer_refunds" to "anon";

grant references on table "public"."customer_refunds" to "anon";

grant select on table "public"."customer_refunds" to "anon";

grant trigger on table "public"."customer_refunds" to "anon";

grant truncate on table "public"."customer_refunds" to "anon";

grant update on table "public"."customer_refunds" to "anon";

grant delete on table "public"."customer_refunds" to "authenticated";

grant insert on table "public"."customer_refunds" to "authenticated";

grant references on table "public"."customer_refunds" to "authenticated";

grant select on table "public"."customer_refunds" to "authenticated";

grant trigger on table "public"."customer_refunds" to "authenticated";

grant truncate on table "public"."customer_refunds" to "authenticated";

grant update on table "public"."customer_refunds" to "authenticated";

grant delete on table "public"."customer_refunds" to "service_role";

grant insert on table "public"."customer_refunds" to "service_role";

grant references on table "public"."customer_refunds" to "service_role";

grant select on table "public"."customer_refunds" to "service_role";

grant trigger on table "public"."customer_refunds" to "service_role";

grant truncate on table "public"."customer_refunds" to "service_role";

grant update on table "public"."customer_refunds" to "service_role";

grant delete on table "public"."customer_subscription_plans" to "anon";

grant insert on table "public"."customer_subscription_plans" to "anon";

grant references on table "public"."customer_subscription_plans" to "anon";

grant select on table "public"."customer_subscription_plans" to "anon";

grant trigger on table "public"."customer_subscription_plans" to "anon";

grant truncate on table "public"."customer_subscription_plans" to "anon";

grant update on table "public"."customer_subscription_plans" to "anon";

grant delete on table "public"."customer_subscription_plans" to "authenticated";

grant insert on table "public"."customer_subscription_plans" to "authenticated";

grant references on table "public"."customer_subscription_plans" to "authenticated";

grant select on table "public"."customer_subscription_plans" to "authenticated";

grant trigger on table "public"."customer_subscription_plans" to "authenticated";

grant truncate on table "public"."customer_subscription_plans" to "authenticated";

grant update on table "public"."customer_subscription_plans" to "authenticated";

grant delete on table "public"."customer_subscription_plans" to "service_role";

grant insert on table "public"."customer_subscription_plans" to "service_role";

grant references on table "public"."customer_subscription_plans" to "service_role";

grant select on table "public"."customer_subscription_plans" to "service_role";

grant trigger on table "public"."customer_subscription_plans" to "service_role";

grant truncate on table "public"."customer_subscription_plans" to "service_role";

grant update on table "public"."customer_subscription_plans" to "service_role";

grant delete on table "public"."customer_subscriptions" to "anon";

grant insert on table "public"."customer_subscriptions" to "anon";

grant references on table "public"."customer_subscriptions" to "anon";

grant select on table "public"."customer_subscriptions" to "anon";

grant trigger on table "public"."customer_subscriptions" to "anon";

grant truncate on table "public"."customer_subscriptions" to "anon";

grant update on table "public"."customer_subscriptions" to "anon";

grant delete on table "public"."customer_subscriptions" to "authenticated";

grant insert on table "public"."customer_subscriptions" to "authenticated";

grant references on table "public"."customer_subscriptions" to "authenticated";

grant select on table "public"."customer_subscriptions" to "authenticated";

grant trigger on table "public"."customer_subscriptions" to "authenticated";

grant truncate on table "public"."customer_subscriptions" to "authenticated";

grant update on table "public"."customer_subscriptions" to "authenticated";

grant delete on table "public"."customer_subscriptions" to "service_role";

grant insert on table "public"."customer_subscriptions" to "service_role";

grant references on table "public"."customer_subscriptions" to "service_role";

grant select on table "public"."customer_subscriptions" to "service_role";

grant trigger on table "public"."customer_subscriptions" to "service_role";

grant truncate on table "public"."customer_subscriptions" to "service_role";

grant update on table "public"."customer_subscriptions" to "service_role";

grant delete on table "public"."payment_providers" to "anon";

grant insert on table "public"."payment_providers" to "anon";

grant references on table "public"."payment_providers" to "anon";

grant select on table "public"."payment_providers" to "anon";

grant trigger on table "public"."payment_providers" to "anon";

grant truncate on table "public"."payment_providers" to "anon";

grant update on table "public"."payment_providers" to "anon";

grant delete on table "public"."payment_providers" to "authenticated";

grant insert on table "public"."payment_providers" to "authenticated";

grant references on table "public"."payment_providers" to "authenticated";

grant select on table "public"."payment_providers" to "authenticated";

grant trigger on table "public"."payment_providers" to "authenticated";

grant truncate on table "public"."payment_providers" to "authenticated";

grant update on table "public"."payment_providers" to "authenticated";

grant delete on table "public"."payment_providers" to "service_role";

grant insert on table "public"."payment_providers" to "service_role";

grant references on table "public"."payment_providers" to "service_role";

grant select on table "public"."payment_providers" to "service_role";

grant trigger on table "public"."payment_providers" to "service_role";

grant truncate on table "public"."payment_providers" to "service_role";

grant update on table "public"."payment_providers" to "service_role";

grant delete on table "public"."table_maintenance_log" to "anon";

grant insert on table "public"."table_maintenance_log" to "anon";

grant references on table "public"."table_maintenance_log" to "anon";

grant select on table "public"."table_maintenance_log" to "anon";

grant trigger on table "public"."table_maintenance_log" to "anon";

grant truncate on table "public"."table_maintenance_log" to "anon";

grant update on table "public"."table_maintenance_log" to "anon";

grant delete on table "public"."table_maintenance_log" to "authenticated";

grant insert on table "public"."table_maintenance_log" to "authenticated";

grant references on table "public"."table_maintenance_log" to "authenticated";

grant select on table "public"."table_maintenance_log" to "authenticated";

grant trigger on table "public"."table_maintenance_log" to "authenticated";

grant truncate on table "public"."table_maintenance_log" to "authenticated";

grant update on table "public"."table_maintenance_log" to "authenticated";

grant delete on table "public"."table_maintenance_log" to "service_role";

grant insert on table "public"."table_maintenance_log" to "service_role";

grant references on table "public"."table_maintenance_log" to "service_role";

grant select on table "public"."table_maintenance_log" to "service_role";

grant trigger on table "public"."table_maintenance_log" to "service_role";

grant truncate on table "public"."table_maintenance_log" to "service_role";

grant update on table "public"."table_maintenance_log" to "service_role";

grant delete on table "public"."table_query_performance" to "anon";

grant insert on table "public"."table_query_performance" to "anon";

grant references on table "public"."table_query_performance" to "anon";

grant select on table "public"."table_query_performance" to "anon";

grant trigger on table "public"."table_query_performance" to "anon";

grant truncate on table "public"."table_query_performance" to "anon";

grant update on table "public"."table_query_performance" to "anon";

grant delete on table "public"."table_query_performance" to "authenticated";

grant insert on table "public"."table_query_performance" to "authenticated";

grant references on table "public"."table_query_performance" to "authenticated";

grant select on table "public"."table_query_performance" to "authenticated";

grant trigger on table "public"."table_query_performance" to "authenticated";

grant truncate on table "public"."table_query_performance" to "authenticated";

grant update on table "public"."table_query_performance" to "authenticated";

grant delete on table "public"."table_query_performance" to "service_role";

grant insert on table "public"."table_query_performance" to "service_role";

grant references on table "public"."table_query_performance" to "service_role";

grant select on table "public"."table_query_performance" to "service_role";

grant trigger on table "public"."table_query_performance" to "service_role";

grant truncate on table "public"."table_query_performance" to "service_role";

grant update on table "public"."table_query_performance" to "service_role";

grant delete on table "public"."table_sequence_usage" to "anon";

grant insert on table "public"."table_sequence_usage" to "anon";

grant references on table "public"."table_sequence_usage" to "anon";

grant select on table "public"."table_sequence_usage" to "anon";

grant trigger on table "public"."table_sequence_usage" to "anon";

grant truncate on table "public"."table_sequence_usage" to "anon";

grant update on table "public"."table_sequence_usage" to "anon";

grant delete on table "public"."table_sequence_usage" to "authenticated";

grant insert on table "public"."table_sequence_usage" to "authenticated";

grant references on table "public"."table_sequence_usage" to "authenticated";

grant select on table "public"."table_sequence_usage" to "authenticated";

grant trigger on table "public"."table_sequence_usage" to "authenticated";

grant truncate on table "public"."table_sequence_usage" to "authenticated";

grant update on table "public"."table_sequence_usage" to "authenticated";

grant delete on table "public"."table_sequence_usage" to "service_role";

grant insert on table "public"."table_sequence_usage" to "service_role";

grant references on table "public"."table_sequence_usage" to "service_role";

grant select on table "public"."table_sequence_usage" to "service_role";

grant trigger on table "public"."table_sequence_usage" to "service_role";

grant truncate on table "public"."table_sequence_usage" to "service_role";

grant update on table "public"."table_sequence_usage" to "service_role";

grant delete on table "public"."table_statistics" to "anon";

grant insert on table "public"."table_statistics" to "anon";

grant references on table "public"."table_statistics" to "anon";

grant select on table "public"."table_statistics" to "anon";

grant trigger on table "public"."table_statistics" to "anon";

grant truncate on table "public"."table_statistics" to "anon";

grant update on table "public"."table_statistics" to "anon";

grant delete on table "public"."table_statistics" to "authenticated";

grant insert on table "public"."table_statistics" to "authenticated";

grant references on table "public"."table_statistics" to "authenticated";

grant select on table "public"."table_statistics" to "authenticated";

grant trigger on table "public"."table_statistics" to "authenticated";

grant truncate on table "public"."table_statistics" to "authenticated";

grant update on table "public"."table_statistics" to "authenticated";

grant delete on table "public"."table_statistics" to "service_role";

grant insert on table "public"."table_statistics" to "service_role";

grant references on table "public"."table_statistics" to "service_role";

grant select on table "public"."table_statistics" to "service_role";

grant trigger on table "public"."table_statistics" to "service_role";

grant truncate on table "public"."table_statistics" to "service_role";

grant update on table "public"."table_statistics" to "service_role";

create policy "delete_policy"
on "public"."blacklisted_domains"
as permissive
for delete
to public
using (public.authorize('blacklisted_domains.delete'::text));


create policy "insert_policy"
on "public"."blacklisted_domains"
as permissive
for insert
to public
with check (public.authorize('blacklisted_domains.insert'::text));


create policy "select_policy"
on "public"."blacklisted_domains"
as permissive
for select
to public
using (public.authorize('blacklisted_domains.select'::text));


create policy "update_policy"
on "public"."blacklisted_domains"
as permissive
for update
to public
using (public.authorize('blacklisted_domains.update'::text));


create policy "delete_policy"
on "public"."customer_payments"
as permissive
for delete
to public
using (public.authorize('customer_payments.delete'::text));


create policy "insert_policy"
on "public"."customer_payments"
as permissive
for insert
to public
with check (public.authorize('customer_payments.insert'::text));


create policy "select_policy"
on "public"."customer_payments"
as permissive
for select
to public
using (public.authorize('customer_payments.select'::text));


create policy "update_policy"
on "public"."customer_payments"
as permissive
for update
to public
using (public.authorize('customer_payments.update'::text));


create policy "delete_policy"
on "public"."customer_processed_webhooks"
as permissive
for delete
to public
using (public.authorize('customer_processed_webhooks.delete'::text));


create policy "insert_policy"
on "public"."customer_processed_webhooks"
as permissive
for insert
to public
with check (public.authorize('customer_processed_webhooks.insert'::text));


create policy "select_policy"
on "public"."customer_processed_webhooks"
as permissive
for select
to public
using (public.authorize('customer_processed_webhooks.select'::text));


create policy "update_policy"
on "public"."customer_processed_webhooks"
as permissive
for update
to public
using (public.authorize('customer_processed_webhooks.update'::text));


create policy "delete_policy"
on "public"."customer_refunds"
as permissive
for delete
to public
using (public.authorize('customer_refunds.delete'::text));


create policy "insert_policy"
on "public"."customer_refunds"
as permissive
for insert
to public
with check (public.authorize('customer_refunds.insert'::text));


create policy "select_policy"
on "public"."customer_refunds"
as permissive
for select
to public
using (public.authorize('customer_refunds.select'::text));


create policy "update_policy"
on "public"."customer_refunds"
as permissive
for update
to public
using (public.authorize('customer_refunds.update'::text));


create policy "delete_policy"
on "public"."customer_subscription_plans"
as permissive
for delete
to public
using (public.authorize('customer_subscription_plans.delete'::text));


create policy "insert_policy"
on "public"."customer_subscription_plans"
as permissive
for insert
to public
with check (public.authorize('customer_subscription_plans.insert'::text));


create policy "select_policy"
on "public"."customer_subscription_plans"
as permissive
for select
to public
using (public.authorize('customer_subscription_plans.select'::text));


create policy "update_policy"
on "public"."customer_subscription_plans"
as permissive
for update
to public
using (public.authorize('customer_subscription_plans.update'::text));


create policy "delete_policy"
on "public"."customer_subscriptions"
as permissive
for delete
to public
using (public.authorize('customer_subscriptions.delete'::text));


create policy "insert_policy"
on "public"."customer_subscriptions"
as permissive
for insert
to public
with check (public.authorize('customer_subscriptions.insert'::text));


create policy "select_policy"
on "public"."customer_subscriptions"
as permissive
for select
to public
using (public.authorize('customer_subscriptions.select'::text));


create policy "update_policy"
on "public"."customer_subscriptions"
as permissive
for update
to public
using (public.authorize('customer_subscriptions.update'::text));


create policy "delete_policy"
on "public"."payment_providers"
as permissive
for delete
to public
using (public.authorize('payment_providers.delete'::text));


create policy "insert_policy"
on "public"."payment_providers"
as permissive
for insert
to public
with check (public.authorize('payment_providers.insert'::text));


create policy "select_policy"
on "public"."payment_providers"
as permissive
for select
to public
using (public.authorize('payment_providers.select'::text));


create policy "update_policy"
on "public"."payment_providers"
as permissive
for update
to public
using (public.authorize('payment_providers.update'::text));


create policy "delete_policy"
on "public"."table_maintenance_log"
as permissive
for delete
to public
using (public.authorize('table_maintenance_log.delete'::text));


create policy "insert_policy"
on "public"."table_maintenance_log"
as permissive
for insert
to public
with check (public.authorize('table_maintenance_log.insert'::text));


create policy "select_policy"
on "public"."table_maintenance_log"
as permissive
for select
to public
using (public.authorize('table_maintenance_log.select'::text));


create policy "update_policy"
on "public"."table_maintenance_log"
as permissive
for update
to public
using (public.authorize('table_maintenance_log.update'::text));


create policy "delete_policy"
on "public"."table_query_performance"
as permissive
for delete
to public
using (public.authorize('table_query_performance.delete'::text));


create policy "insert_policy"
on "public"."table_query_performance"
as permissive
for insert
to public
with check (public.authorize('table_query_performance.insert'::text));


create policy "select_policy"
on "public"."table_query_performance"
as permissive
for select
to public
using (public.authorize('table_query_performance.select'::text));


create policy "update_policy"
on "public"."table_query_performance"
as permissive
for update
to public
using (public.authorize('table_query_performance.update'::text));


create policy "delete_policy"
on "public"."table_sequence_usage"
as permissive
for delete
to public
using (public.authorize('table_sequence_usage.delete'::text));


create policy "insert_policy"
on "public"."table_sequence_usage"
as permissive
for insert
to public
with check (public.authorize('table_sequence_usage.insert'::text));


create policy "select_policy"
on "public"."table_sequence_usage"
as permissive
for select
to public
using (public.authorize('table_sequence_usage.select'::text));


create policy "update_policy"
on "public"."table_sequence_usage"
as permissive
for update
to public
using (public.authorize('table_sequence_usage.update'::text));


create policy "delete_policy"
on "public"."table_statistics"
as permissive
for delete
to public
using (public.authorize('table_statistics.delete'::text));


create policy "insert_policy"
on "public"."table_statistics"
as permissive
for insert
to public
with check (public.authorize('table_statistics.insert'::text));


create policy "select_policy"
on "public"."table_statistics"
as permissive
for select
to public
using (public.authorize('table_statistics.select'::text));


create policy "update_policy"
on "public"."table_statistics"
as permissive
for update
to public
using (public.authorize('table_statistics.update'::text));



