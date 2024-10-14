drop trigger if exists "update_user_metadata_trigger" on "public"."user_profiles";

drop policy "supabase_auth_admin update" on "public"."user_profiles";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.authorize(requested_permission text)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
    user_role app_role_enum;
    v_table_name TEXT;
    operation TEXT;
    permission_record RECORD;
BEGIN
    -- Check for service role key in JWT and bypass authorization
    IF (auth.jwt() ->> 'role') = 'service_role' THEN
        RETURN TRUE;
    END IF;

    user_role := ((auth.jwt() -> 'app_metadata') ->> 'role')::app_role_enum;

    -- Check if user_role is present and valid
    IF user_role IS NULL THEN
        RAISE EXCEPTION 'No user role found in JWT';
    END IF;

    -- Immediately grant access if the user's role is super_admin
    IF user_role = 'super_admin' THEN
        RETURN TRUE;
    END IF;

    -- Parse requested_permission into table_name and operation
    v_table_name := split_part(requested_permission, '.', 1);
    operation := split_part(requested_permission, '.', 2);

    -- Check permissions
    SELECT * INTO permission_record
    FROM public.role_permissions
    WHERE role = user_role AND table_name = v_table_name;

    IF permission_record IS NULL THEN
        RETURN FALSE;
    END IF;

    IF NOT (operation = ANY(permission_record.permissions)) THEN
        RETURN FALSE;
    END IF;

    -- Check conditions if they exist
    IF permission_record.conditions ? operation THEN
        RETURN auth.check_condition(permission_record.conditions->operation);
    END IF;

    RETURN TRUE;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.calculate_table_growth(p_table_name text, p_end_date timestamp with time zone DEFAULT now())
 RETURNS TABLE(period text, start_date timestamp with time zone, end_date timestamp with time zone, start_row_count bigint, end_row_count bigint, row_growth bigint, growth_percentage numeric)
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_periods interval[] := ARRAY[
        interval '1 day',
        interval '7 days',
        interval '30 days',
        interval '90 days'
    ];
    v_period interval;
BEGIN
    FOR v_period IN SELECT unnest(v_periods)
    LOOP
        RETURN QUERY
        WITH start_stats AS (
            SELECT row_count, capture_time
            FROM table_statistics
            WHERE table_name = p_table_name
              AND capture_time <= p_end_date - v_period
            ORDER BY capture_time DESC
            LIMIT 1
        ),
        end_stats AS (
            SELECT row_count, capture_time
            FROM table_statistics
            WHERE table_name = p_table_name
              AND capture_time <= p_end_date
            ORDER BY capture_time DESC
            LIMIT 1
        )
        SELECT
            CASE
                WHEN v_period = interval '1 day' THEN 'Daily'
                WHEN v_period = interval '7 days' THEN 'Weekly'
                WHEN v_period = interval '30 days' THEN 'Monthly'
                WHEN v_period = interval '90 days' THEN 'Quarterly'
            END::text AS period,
            start_stats.capture_time AS start_date,
            end_stats.capture_time AS end_date,
            start_stats.row_count AS start_row_count,
            end_stats.row_count AS end_row_count,
            end_stats.row_count - start_stats.row_count AS row_growth,
            CASE
                WHEN start_stats.row_count > 0 THEN
                    ROUND(((end_stats.row_count - start_stats.row_count)::numeric / start_stats.row_count * 100), 2)
                ELSE
                    NULL
            END AS growth_percentage
        FROM start_stats, end_stats
        WHERE start_stats.capture_time < end_stats.capture_time;
    END LOOP;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.calculate_table_growth(p_table_name text, p_time_period interval, p_num_periods integer)
 RETURNS TABLE(period_end_time timestamp with time zone, row_count bigint, growth_count bigint, growth_percentage numeric)
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_end_time TIMESTAMP WITH TIME ZONE;
    v_period_start_time TIMESTAMP WITH TIME ZONE;
    v_previous_count BIGINT := 0;
    v_current_count BIGINT;
BEGIN
    -- Get the most recent capture time
    SELECT MAX(capture_time) INTO v_end_time
    FROM public.table_statistics
    WHERE table_name = p_table_name;

    -- Loop through the periods
    FOR i IN 0..(p_num_periods - 1) LOOP
        v_period_start_time := v_end_time - (i * p_time_period);
        
        -- Get the row count for this period
        -- Use table alias to avoid ambiguity
        SELECT COALESCE(ts.row_count, 0) INTO v_current_count
        FROM public.table_statistics ts
        WHERE ts.table_name = p_table_name
          AND ts.capture_time <= v_period_start_time
        ORDER BY ts.capture_time DESC
        LIMIT 1;

        RETURN QUERY
        SELECT 
            v_period_start_time AS period_end_time,
            v_current_count AS row_count,
            CASE 
                WHEN i = 0 THEN 0
                ELSE v_current_count - v_previous_count
            END AS growth_count,
            CASE 
                WHEN i = 0 THEN 0::numeric
                ELSE ROUND(((v_current_count - v_previous_count)::NUMERIC / NULLIF(v_previous_count, 0)) * 100, 2)
            END AS growth_percentage;

        -- Store the current count for the next iteration
        v_previous_count := v_current_count;
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
    DELETE FROM table_query_performance WHERE capture_time < (now() - interval '180 days');
END;
$function$
;

CREATE OR REPLACE FUNCTION public.enable_rls_on_all_tables()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    schema_name text := 'public';  -- or your specific schema
    table_name text;
BEGIN
    FOR table_name IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = schema_name
    LOOP
        EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', schema_name, table_name);
        RAISE NOTICE 'Enabled RLS on table: %.%', schema_name, table_name;
    END LOOP;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.execute_weekly_maintenance()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    r RECORD;
BEGIN
    -- Log start of maintenance
    INSERT INTO public.maintenance_log (operation, detail) VALUES ('Maintenance Start', 'Weekly maintenance started');

    -- Execute VACUUM ANALYZE and REINDEX
    FOR r IN (SELECT * FROM public.perform_weekly_maintenance() WHERE operation IN ('TABLE', 'INDEX'))
    LOOP
        BEGIN
            IF r.operation = 'TABLE' THEN
                EXECUTE 'VACUUM ANALYZE ' || quote_ident(r.detail);
            ELSE
                EXECUTE 'REINDEX INDEX CONCURRENTLY ' || quote_ident(r.detail);
            END IF;
            INSERT INTO public.maintenance_log (operation, detail) VALUES (r.operation, 'Completed on ' || r.detail);
        EXCEPTION WHEN OTHERS THEN
            INSERT INTO public.maintenance_log (operation, detail) VALUES (r.operation, 'Failed on ' || r.detail || ': ' || SQLERRM);
        END;
    END LOOP;

    -- Log other maintenance results
    INSERT INTO public.maintenance_log (operation, detail)
    SELECT operation, detail 
    FROM public.perform_weekly_maintenance() 
    WHERE operation NOT IN ('TABLE', 'INDEX');

    -- Log end of maintenance
    INSERT INTO public.maintenance_log (operation, detail) VALUES ('Maintenance End', 'Weekly maintenance completed');

    RAISE NOTICE 'Weekly maintenance completed';
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
    v_row_count integer := 0;
    v_error_count integer := 0;
BEGIN
    -- Create a temporary log table
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_log (
        log_time timestamp with time zone DEFAULT now(),
        message text
    );

    -- Log function start
    INSERT INTO temp_log (message) VALUES ('gather_database_stats started');

    -- Gather statistics for each table in the public schema
    FOR v_table IN 
        SELECT relname
        FROM pg_stat_user_tables
        WHERE schemaname = 'public'
    LOOP
        BEGIN
            INSERT INTO table_statistics (
                table_name,
                row_count,
                table_size,
                index_size,
                live_tuples,
                dead_tuples,
                last_vacuum,
                last_analyze,
                estimated_bloat_ratio,
                buffer_cache_hit_ratio,
                index_usage,
                seq_scan_count,
                index_scan_count,
                capture_time
            )
            SELECT
                stat.relname,
                pg_class.reltuples::bigint AS row_count,
                pg_total_relation_size(stat.relid) AS table_size,
                pg_indexes_size(stat.relid) AS index_size,
                stat.n_live_tup::bigint,
                stat.n_dead_tup::bigint,
                stat.last_vacuum,
                stat.last_analyze,
                CASE 
                    WHEN stat.n_live_tup > 0 THEN
                        (1 - (pg_relation_size(stat.relid) / (stat.n_live_tup * (24 + 8))))::float
                    ELSE 0
                END AS estimated_bloat_ratio,
                CASE 
                    WHEN (statio.heap_blks_read + statio.heap_blks_hit) > 0 THEN
                        (statio.heap_blks_hit::float / (statio.heap_blks_read + statio.heap_blks_hit))::float
                    ELSE 0
                END AS buffer_cache_hit_ratio,
                (
                    SELECT jsonb_object_agg(indexrelname, COALESCE(idx_scan, 0))
                    FROM pg_stat_user_indexes
                    WHERE schemaname = 'public' AND relname = stat.relname
                ) AS index_usage,
                stat.seq_scan::bigint,
                stat.idx_scan::bigint,
                v_capture_time
            FROM pg_stat_user_tables stat
            JOIN pg_statio_user_tables statio ON stat.relid = statio.relid
            JOIN pg_class ON stat.relid = pg_class.oid
            WHERE stat.schemaname = 'public' AND stat.relname = v_table.relname;

            v_row_count := v_row_count + 1;
            
            -- Log successful insertion
            INSERT INTO temp_log (message) VALUES ('Successfully gathered stats for table: ' || v_table.relname);
        EXCEPTION
            WHEN OTHERS THEN
                v_error_count := v_error_count + 1;
                INSERT INTO temp_log (message) VALUES ('Error gathering statistics for table ' || v_table.relname || ': ' || SQLERRM);
        END;
    END LOOP;

    -- Log function completion
    INSERT INTO temp_log (message) VALUES ('gather_database_stats completed. Rows inserted: ' || v_row_count || ', Errors: ' || v_error_count);

    -- Output log to console
    RAISE NOTICE '%', string_agg(log_time || ': ' || message, E'\n') FROM temp_log;

    -- Clean up temporary log table
    DROP TABLE IF EXISTS temp_log;

    -- Log slow queries (unchanged)
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

CREATE OR REPLACE FUNCTION public.get_autovacuum_candidates()
 RETURNS TABLE(table_name text, dead_tuples bigint, threshold bigint)
 LANGUAGE sql
AS $function$
    SELECT c.oid::regclass::text as table_name,
           s.n_dead_tup as dead_tuples,
           (current_setting('autovacuum_vacuum_threshold')::bigint + 
           current_setting('autovacuum_vacuum_scale_factor')::float * c.reltuples)::bigint AS threshold
    FROM pg_class c
    JOIN pg_stat_user_tables s ON s.relid = c.oid
    WHERE c.relkind = 'r'
    AND s.n_dead_tup > (current_setting('autovacuum_vacuum_threshold')::bigint + 
                        current_setting('autovacuum_vacuum_scale_factor')::float * c.reltuples)::bigint;
$function$
;

CREATE OR REPLACE FUNCTION public.get_connection_stats()
 RETURNS TABLE(max_connections integer, used_connections integer, available_connections integer, connection_ratio numeric)
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
    WITH connection_counts AS (
        SELECT COUNT(*) as active_connections,
               COUNT(*) FILTER (WHERE state = 'active') as active_queries
        FROM pg_stat_activity
        WHERE datname = current_database()
    )
    SELECT 
        current_setting('max_connections')::integer as max_connections,
        cc.active_connections as used_connections,
        (current_setting('max_connections')::integer - cc.active_connections) as available_connections,
        ROUND((cc.active_connections::numeric / current_setting('max_connections')::numeric) * 100, 2) as connection_ratio
    FROM connection_counts cc;
$function$
;

CREATE OR REPLACE FUNCTION public.get_connection_usage()
 RETURNS TABLE(usage_percentage numeric, current_connections integer, max_connections integer)
 LANGUAGE sql
AS $function$
    SELECT 
        round((1 - (current_setting('max_connections')::float - (SELECT count(*) FROM pg_stat_activity WHERE NOT pid = pg_backend_pid())) / current_setting('max_connections')::float)::numeric * 100, 2) as usage_percentage,
        (current_setting('max_connections')::int - (SELECT count(*) FROM pg_stat_activity WHERE NOT pid = pg_backend_pid())) as current_connections,
        current_setting('max_connections')::int as max_connections;
$function$
;

CREATE OR REPLACE FUNCTION public.get_duplicate_indexes()
 RETURNS TABLE(index1 text, index2 text, table_name text)
 LANGUAGE sql
AS $function$
    SELECT idx1.indexname as index1, idx2.indexname as index2, idx1.tablename as table_name
    FROM (
        SELECT schemaname, tablename, indexname, 
               (array_agg(attname ORDER BY attnum))[1:array_length(string_to_array(substr(indexdef, strpos(indexdef, '(')+1, strpos(indexdef, ')')-strpos(indexdef, '(')-1), ', '), 1)] AS columns
        FROM pg_indexes
        JOIN pg_attribute ON attrelid = (schemaname || '.' || tablename)::regclass
        JOIN unnest(string_to_array(substr(indexdef, strpos(indexdef, '(')+1, strpos(indexdef, ')')-strpos(indexdef, '(')-1), ', ')) WITH ORDINALITY As idxcols(col, ord)
            ON attname = col
        GROUP BY schemaname, tablename, indexname, indexdef
    ) idx1
    JOIN (
        SELECT schemaname, tablename, indexname, 
               (array_agg(attname ORDER BY attnum))[1:array_length(string_to_array(substr(indexdef, strpos(indexdef, '(')+1, strpos(indexdef, ')')-strpos(indexdef, '(')-1), ', '), 1)] AS columns
        FROM pg_indexes
        JOIN pg_attribute ON attrelid = (schemaname || '.' || tablename)::regclass
        JOIN unnest(string_to_array(substr(indexdef, strpos(indexdef, '(')+1, strpos(indexdef, ')')-strpos(indexdef, '(')-1), ', ')) WITH ORDINALITY As idxcols(col, ord)
            ON attname = col
        GROUP BY schemaname, tablename, indexname, indexdef
    ) idx2 ON idx1.schemaname = idx2.schemaname 
           AND idx1.tablename = idx2.tablename 
           AND idx1.indexname < idx2.indexname
           AND idx1.columns @> idx2.columns 
           AND idx1.columns <@ idx2.columns;
$function$
;

CREATE OR REPLACE FUNCTION public.get_fragmented_objects()
 RETURNS TABLE(object_name text, fragmentation numeric)
 LANGUAGE sql
AS $function$
    SELECT relname as object_name, 
           round(
               (100 * pg_stat_get_live_tuples(c.oid)::numeric / 
               GREATEST(pg_stat_get_live_tuples(c.oid) + pg_stat_get_dead_tuples(c.oid), 1)
               )::numeric, 
           2
           ) as fragmentation
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE relkind IN ('r', 'i')
    AND n.nspname = 'public'
    AND pg_stat_get_live_tuples(c.oid) + pg_stat_get_dead_tuples(c.oid) > 10000
    AND (100 * pg_stat_get_live_tuples(c.oid)::numeric / 
         GREATEST(pg_stat_get_live_tuples(c.oid) + pg_stat_get_dead_tuples(c.oid), 1)) < 70;
$function$
;

CREATE OR REPLACE FUNCTION public.get_high_sequence_usage()
 RETURNS TABLE(sequence_name text, usage_percentage numeric)
 LANGUAGE sql
AS $function$
    SELECT sequencename as sequence_name, 
           round(100.0 * COALESCE(last_value, 0)::numeric / 9223372036854775807::numeric, 2) as usage_percentage
    FROM pg_sequences
    WHERE schemaname = 'public'
      AND COALESCE(last_value, 0)::numeric / 9223372036854775807::numeric > 0.75;
$function$
;

CREATE OR REPLACE FUNCTION public.get_indexes_to_reindex()
 RETURNS TABLE(indexname text, tablename text, index_size bigint)
 LANGUAGE sql
AS $function$
    SELECT i.indexrelid::regclass::text AS indexname,
           i.indrelid::regclass::text AS tablename,
           pg_relation_size(i.indexrelid) AS index_size
    FROM pg_index i
    JOIN pg_class c ON c.oid = i.indexrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
    AND pg_relation_size(i.indexrelid) > 10 * 1024 * 1024; -- Only indexes larger than 10MB
$function$
;

CREATE OR REPLACE FUNCTION public.get_long_running_transactions()
 RETURNS TABLE(pid integer, duration interval, query text)
 LANGUAGE sql
AS $function$
    SELECT pid, 
           age(now(), xact_start) as duration, 
           substring(query from 1 for 50) || '...' as query
    FROM pg_stat_activity
    WHERE state = 'active'
    AND xact_start < now() - interval '1 hour'
    ORDER BY age(now(), xact_start) DESC
    LIMIT 5;
$function$
;

CREATE OR REPLACE FUNCTION public.get_maintenance_objects()
 RETURNS TABLE(object_type text, object_name text)
 LANGUAGE sql
AS $function$
    SELECT 'TABLE' as object_type, tablename as object_name
    FROM pg_tables
    WHERE schemaname = 'public'
    UNION ALL
    SELECT 'INDEX' as object_type, indexname as object_name
    FROM pg_indexes
    WHERE schemaname = 'public';
$function$
;

CREATE OR REPLACE FUNCTION public.get_suboptimal_queries()
 RETURNS TABLE(query_detail text)
 LANGUAGE sql
AS $function$
    SELECT 'Query: ' || query || ' (Avg execution time: ' || round((total_exec_time / calls)::numeric, 2) || 'ms)' as query_detail
    FROM pg_stat_statements
    WHERE (total_exec_time / calls) > 1000  -- queries taking on average more than 1 second
    AND calls > 100  -- executed more than 100 times
    ORDER BY (total_exec_time / calls) DESC
    LIMIT 5;
$function$
;

CREATE OR REPLACE FUNCTION public.get_tables_to_vacuum()
 RETURNS TABLE(tablename text, dead_tuples bigint, live_tuples bigint)
 LANGUAGE sql
AS $function$
    SELECT n.nspname || '.' || c.relname::text AS tablename,
           pg_stat_get_dead_tuples(c.oid) AS dead_tuples,
           pg_stat_get_live_tuples(c.oid) AS live_tuples
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind = 'r'
    AND n.nspname = 'public'
    AND pg_stat_get_dead_tuples(c.oid) > 0;
$function$
;

CREATE OR REPLACE FUNCTION public.perform_weekly_maintenance()
 RETURNS TABLE(operation text, detail text, additional_info jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    r RECORD;
    conn_stats RECORD;
BEGIN
    -- 1. Tables to be vacuumed
    FOR r IN SELECT * FROM public.get_tables_to_vacuum()
    LOOP
        operation := 'VACUUM ANALYZE';
        detail := r.tablename;
        additional_info := jsonb_build_object('dead_tuples', r.dead_tuples, 'live_tuples', r.live_tuples);
        RETURN NEXT;
    END LOOP;

    -- 2. Indexes to be reindexed
    FOR r IN SELECT * FROM public.get_indexes_to_reindex()
    LOOP
        operation := 'REINDEX';
        detail := r.indexname;
        additional_info := jsonb_build_object('table_name', r.tablename, 'index_size', r.index_size);
        RETURN NEXT;
    END LOOP;

    -- 3. Identify queries with suboptimal plans
    FOR r IN SELECT * FROM public.get_suboptimal_queries()
    LOOP
        operation := 'Suboptimal query plan';
        detail := substring(r.query_detail from 1 for 50) || '...';
        additional_info := jsonb_build_object('full_detail', r.query_detail);
        RETURN NEXT;
    END LOOP;

    FOR r IN SELECT * FROM public.get_duplicate_indexes()
    LOOP
        operation := 'Duplicate index found';
        -- Adjust these field names based on what get_duplicate_indexes actually returns
        detail := r.index1 || ' and ' || r.index2 || ' on ' || r.table_name;
        additional_info := jsonb_build_object('table_name', r.table_name, 'index1', r.index1, 'index2', r.index2);
        RETURN NEXT;
    END LOOP;

    -- 5. Monitor table and index fragmentation
    FOR r IN SELECT * FROM public.get_fragmented_objects()
    LOOP
        operation := 'High fragmentation';
        detail := r.object_name;
        additional_info := jsonb_build_object('object_type', r.object_type, 'fragmentation', r.fragmentation);
        RETURN NEXT;
    END LOOP;

    -- 6. Monitor for long-running transactions
    FOR r IN SELECT * FROM public.get_long_running_transactions()
    LOOP
        operation := 'Long-running transaction';
        detail := 'PID: ' || r.pid::text;
        additional_info := jsonb_build_object('duration', r.duration, 'query', r.query);
        RETURN NEXT;
    END LOOP;

    -- 7. Monitor connection pool usage
    SELECT * INTO conn_stats FROM public.get_connection_stats();
    IF conn_stats.available_connections::float / conn_stats.max_connections::float < 0.2 THEN
        operation := 'High connection usage';
        detail := format('Used: %s, Available: %s, Max: %s', 
                         conn_stats.used_connections, 
                         conn_stats.available_connections, 
                         conn_stats.max_connections);
        additional_info := to_jsonb(conn_stats);
        RETURN NEXT;
    END IF;

    RETURN;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_role_permissions(config jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    role_key TEXT;
    table_group TEXT;
    table_name TEXT;
    permissions JSONB;
BEGIN
    -- Clear existing permissions
    DELETE FROM public.role_permissions;
    
    -- Loop through roles
    FOR role_key IN SELECT jsonb_object_keys(config->'roles')
    LOOP
        -- Loop through table groups for each role
        FOR table_group IN SELECT jsonb_object_keys(config->'roles'->role_key)
        LOOP
            IF table_group = 'all_tables' THEN
                -- Handle 'all_tables' case
                FOR table_name IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
                LOOP
                    permissions := jsonb_object_agg(
                        perm, 
                        true
                    ) FROM jsonb_array_elements_text(config->'roles'->role_key->'all_tables'->'permissions') AS perm;
                    
                    INSERT INTO public.role_permissions (role, table_name, permissions, conditions)
                    VALUES (
                        role_key::app_role_enum,
                        table_name,
                        permissions,
                        COALESCE(config->'roles'->role_key->'all_tables'->'conditions', '{}'::jsonb)
                    );
                END LOOP;
            ELSE
                -- Handle specific table groups
                FOR table_name IN SELECT jsonb_array_elements_text(config->'tables'->table_group)
                LOOP
                    permissions := jsonb_object_agg(
                        perm, 
                        true
                    ) FROM jsonb_array_elements_text(config->'roles'->role_key->table_group->'permissions') AS perm;
                    
                    INSERT INTO public.role_permissions (role, table_name, permissions, conditions)
                    VALUES (
                        role_key::app_role_enum,
                        table_name,
                        permissions,
                        COALESCE(config->'roles'->role_key->table_group->'conditions', '{}'::jsonb)
                    );
                END LOOP;
            END IF;
        END LOOP;
    END LOOP;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_user_app_metadata()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = jsonb_set(
    jsonb_set(raw_app_meta_data, '{plan}', to_jsonb(NEW.plan), true),
    '{role}', to_jsonb(NEW.role), true
  )
  WHERE id = NEW.id;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_user_metadata()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  -- Perform the update
  UPDATE auth.users
  SET raw_user_meta_data = raw_user_meta_data
    || jsonb_build_object(
         'given_name', NEW.given_name,
         'surname', NEW.surname,
         'avatar', COALESCE(NEW.avatar, ''),
         'username', NEW.username
       )
  WHERE id = NEW.id;
  RETURN NEW;
END;$function$
;


