create extension pg_cron with schema extensions;

grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

create type "public"."followed_entity" as enum ('company', 'user');

alter table "public"."company_urls" drop constraint "fk_company";

drop function if exists "public"."perform_weekly_maintenance"();

create table "public"."bookmarks" (
    "id" uuid not null default extensions.gen_random_uuid(),
    "user_id" uuid not null,
    "content_id" uuid not null,
    "content_type" public.content_type not null,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."bookmarks" enable row level security;

create table "public"."comments" (
    "id" uuid not null default extensions.gen_random_uuid(),
    "content" text not null,
    "user_id" uuid not null,
    "content_id" uuid not null,
    "content_type" public.content_type not null,
    "parent_comment_id" uuid,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."comments" enable row level security;

create table "public"."follows" (
    "id" uuid not null default extensions.gen_random_uuid(),
    "follower_id" uuid not null,
    "followed_id" uuid not null,
    "followed_entity" public.followed_entity not null,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."follows" enable row level security;

CREATE UNIQUE INDEX bookmarks_pkey ON public.bookmarks USING btree (id);

CREATE UNIQUE INDEX bookmarks_user_id_content_id_content_type_key ON public.bookmarks USING btree (user_id, content_id, content_type);

CREATE UNIQUE INDEX comments_pkey ON public.comments USING btree (id);

CREATE UNIQUE INDEX follows_follower_id_followed_id_followed_entity_key ON public.follows USING btree (follower_id, followed_id, followed_entity);

CREATE UNIQUE INDEX follows_pkey ON public.follows USING btree (id);

CREATE INDEX idx_bookmarks_content ON public.bookmarks USING btree (content_id, content_type);

CREATE INDEX idx_bookmarks_user ON public.bookmarks USING btree (user_id);

CREATE INDEX idx_comments_content ON public.comments USING btree (content_id, content_type);

CREATE INDEX idx_follows_followed ON public.follows USING btree (followed_id, followed_entity);

CREATE INDEX idx_follows_follower ON public.follows USING btree (follower_id);

alter table "public"."bookmarks" add constraint "bookmarks_pkey" PRIMARY KEY using index "bookmarks_pkey";

alter table "public"."comments" add constraint "comments_pkey" PRIMARY KEY using index "comments_pkey";

alter table "public"."follows" add constraint "follows_pkey" PRIMARY KEY using index "follows_pkey";

alter table "public"."bookmarks" add constraint "bookmarks_user_id_content_id_content_type_key" UNIQUE using index "bookmarks_user_id_content_id_content_type_key";

alter table "public"."bookmarks" add constraint "bookmarks_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) not valid;

alter table "public"."bookmarks" validate constraint "bookmarks_user_id_fkey";

alter table "public"."comments" add constraint "comments_parent_comment_id_fkey" FOREIGN KEY (parent_comment_id) REFERENCES public.comments(id) not valid;

alter table "public"."comments" validate constraint "comments_parent_comment_id_fkey";

alter table "public"."comments" add constraint "comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) not valid;

alter table "public"."comments" validate constraint "comments_user_id_fkey";

alter table "public"."company_urls" add constraint "public_company_urls_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."company_urls" validate constraint "public_company_urls_company_id_fkey";

alter table "public"."follows" add constraint "follows_follower_id_fkey" FOREIGN KEY (follower_id) REFERENCES public.user_profiles(id) not valid;

alter table "public"."follows" validate constraint "follows_follower_id_fkey";

alter table "public"."follows" add constraint "follows_follower_id_followed_id_followed_entity_key" UNIQUE using index "follows_follower_id_followed_id_followed_entity_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.execute_weekly_maintenance()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    r RECORD;
BEGIN
    -- Execute VACUUM ANALYZE and REINDEX
    FOR r IN (SELECT * FROM public.perform_weekly_maintenance() WHERE operation IN ('VACUUM ANALYZE', 'REINDEX'))
    LOOP
        EXECUTE r.operation || ' ' || r.detail;
        RAISE NOTICE '% on %', r.operation, r.detail;
    END LOOP;

    -- Log other maintenance results
    INSERT INTO public.table_maintenance_log (operation, detail)
    SELECT operation, detail 
    FROM public.perform_weekly_maintenance() 
    WHERE operation NOT IN ('VACUUM ANALYZE', 'REINDEX');

    RAISE NOTICE 'Weekly maintenance completed';
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
        -- Explicitly qualify the column name with the table name
        SELECT COALESCE(table_statistics.row_count, 0) INTO v_current_count
        FROM public.table_statistics
        WHERE table_statistics.table_name = p_table_name
          AND table_statistics.capture_time <= v_period_start_time
        ORDER BY table_statistics.capture_time DESC
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

CREATE OR REPLACE FUNCTION public.perform_weekly_maintenance()
 RETURNS TABLE(operation text, detail text)
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_table RECORD;
    v_statement TEXT;
    v_db_size BIGINT;
    v_free_space BIGINT;
BEGIN
    -- 1. Create a list of tables to be vacuumed
    FOR v_table IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public')
    LOOP
        operation := 'VACUUM ANALYZE';
        detail := 'public.' || quote_ident(v_table.tablename);
        RETURN NEXT;
    END LOOP;

    -- 2. Create a list of indexes to be reindexed
    FOR v_table IN (SELECT indexname FROM pg_indexes WHERE schemaname = 'public')
    LOOP
        operation := 'REINDEX';
        detail := 'public.' || quote_ident(v_table.indexname);
        RETURN NEXT;
    END LOOP;

    -- 3. Identify queries with suboptimal plans
    FOR v_statement IN (
        SELECT query
        FROM pg_stat_statements
        WHERE (total_exec_time / calls) > 1000  -- queries taking on average more than 1 second
        AND calls > 100  -- executed more than 100 times
        ORDER BY (total_exec_time / calls) DESC
        LIMIT 5
    ) LOOP
        operation := 'Suboptimal query plan';
        detail := v_statement;
        RETURN NEXT;
    END LOOP;

    -- 4. Check for duplicate indexes
    FOR v_statement IN (
        SELECT format('%I and %I on %I.%I', idx1.indexname, idx2.indexname, idx1.tablename, idx1.schemaname) AS detail
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
               AND idx1.columns <@ idx2.columns
    ) LOOP
        operation := 'Duplicate index found';
        detail := v_statement;
        RETURN NEXT;
    END LOOP;

    -- 5. Monitor table and index fragmentation
FOR v_statement IN (
    SELECT relname || ' (fragmentation: ' || 
           round(
               (100 * pg_stat_get_live_tuples(c.oid)::numeric / 
               GREATEST(pg_stat_get_live_tuples(c.oid) + pg_stat_get_dead_tuples(c.oid), 1)
               )::numeric, 
           2
           )::text || '%)'
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE relkind IN ('r', 'i')
    AND n.nspname = 'public'
    AND pg_stat_get_live_tuples(c.oid) + pg_stat_get_dead_tuples(c.oid) > 10000
    AND (100 * pg_stat_get_live_tuples(c.oid)::numeric / 
         GREATEST(pg_stat_get_live_tuples(c.oid) + pg_stat_get_dead_tuples(c.oid), 1)) < 70
) LOOP
    operation := 'High fragmentation';
    detail := v_statement;
    RETURN NEXT;
END LOOP;

    -- 6. Monitor connection pool usage
    IF (current_setting('max_connections')::float - (SELECT count(*) FROM pg_stat_activity WHERE NOT pid = pg_backend_pid())) / current_setting('max_connections')::float < 0.2 THEN
        operation := 'High connection usage';
        detail := 'Current connections: ' || (current_setting('max_connections')::int - (SELECT count(*) FROM pg_stat_activity WHERE NOT pid = pg_backend_pid())) || 
                  ' out of ' || current_setting('max_connections');
        RETURN NEXT;
    END IF;

    -- 7. Monitor sequence usage
    FOR v_statement IN (
        SELECT sequencename || ' (' || 
              round(100.0 * COALESCE(last_value, 0)::numeric / 9223372036854775807::numeric, 2)::text || '% used)'
        FROM pg_sequences
        WHERE schemaname = 'public'
          AND COALESCE(last_value, 0)::numeric / 9223372036854775807::numeric > 0.75
    ) LOOP
        operation := 'Sequence near max value';
        detail := v_statement;
        RETURN NEXT;
    END LOOP;

    -- 8. Monitor for long-running transactions
    FOR v_statement IN (
        SELECT 'PID: ' || pid || ', Duration: ' || age(now(), xact_start)::text || 
               ', Query: ' || substring(query from 1 for 50) || '...'
        FROM pg_stat_activity
        WHERE state = 'active'
        AND xact_start < now() - interval '1 hour'
        ORDER BY age(now(), xact_start) DESC
        LIMIT 5
    ) LOOP
        operation := 'Long-running transaction';
        detail := v_statement;
        RETURN NEXT;
    END LOOP;

    -- 9. Monitor autovacuum performance
    FOR v_statement IN (
        SELECT relname || ' (dead tuples: ' || n_dead_tup || ', threshold: ' || threshold || ')'
        FROM (
            SELECT c.oid::regclass as relname,
                   s.n_dead_tup,
                   current_setting('autovacuum_vacuum_threshold')::integer + 
                   current_setting('autovacuum_vacuum_scale_factor')::float * c.reltuples AS threshold
            FROM pg_class c
            JOIN pg_stat_user_tables s ON s.relid = c.oid
            WHERE c.relkind = 'r'
        ) AS av
        WHERE n_dead_tup > threshold
    ) LOOP
        operation := 'Autovacuum needed';
        detail := v_statement;
        RETURN NEXT;
    END LOOP;

    RETURN;
END;
$function$
;

grant delete on table "public"."bookmarks" to "anon";

grant insert on table "public"."bookmarks" to "anon";

grant references on table "public"."bookmarks" to "anon";

grant select on table "public"."bookmarks" to "anon";

grant trigger on table "public"."bookmarks" to "anon";

grant truncate on table "public"."bookmarks" to "anon";

grant update on table "public"."bookmarks" to "anon";

grant delete on table "public"."bookmarks" to "authenticated";

grant insert on table "public"."bookmarks" to "authenticated";

grant references on table "public"."bookmarks" to "authenticated";

grant select on table "public"."bookmarks" to "authenticated";

grant trigger on table "public"."bookmarks" to "authenticated";

grant truncate on table "public"."bookmarks" to "authenticated";

grant update on table "public"."bookmarks" to "authenticated";

grant delete on table "public"."bookmarks" to "service_role";

grant insert on table "public"."bookmarks" to "service_role";

grant references on table "public"."bookmarks" to "service_role";

grant select on table "public"."bookmarks" to "service_role";

grant trigger on table "public"."bookmarks" to "service_role";

grant truncate on table "public"."bookmarks" to "service_role";

grant update on table "public"."bookmarks" to "service_role";

grant delete on table "public"."comments" to "anon";

grant insert on table "public"."comments" to "anon";

grant references on table "public"."comments" to "anon";

grant select on table "public"."comments" to "anon";

grant trigger on table "public"."comments" to "anon";

grant truncate on table "public"."comments" to "anon";

grant update on table "public"."comments" to "anon";

grant delete on table "public"."comments" to "authenticated";

grant insert on table "public"."comments" to "authenticated";

grant references on table "public"."comments" to "authenticated";

grant select on table "public"."comments" to "authenticated";

grant trigger on table "public"."comments" to "authenticated";

grant truncate on table "public"."comments" to "authenticated";

grant update on table "public"."comments" to "authenticated";

grant delete on table "public"."comments" to "service_role";

grant insert on table "public"."comments" to "service_role";

grant references on table "public"."comments" to "service_role";

grant select on table "public"."comments" to "service_role";

grant trigger on table "public"."comments" to "service_role";

grant truncate on table "public"."comments" to "service_role";

grant update on table "public"."comments" to "service_role";

grant delete on table "public"."follows" to "anon";

grant insert on table "public"."follows" to "anon";

grant references on table "public"."follows" to "anon";

grant select on table "public"."follows" to "anon";

grant trigger on table "public"."follows" to "anon";

grant truncate on table "public"."follows" to "anon";

grant update on table "public"."follows" to "anon";

grant delete on table "public"."follows" to "authenticated";

grant insert on table "public"."follows" to "authenticated";

grant references on table "public"."follows" to "authenticated";

grant select on table "public"."follows" to "authenticated";

grant trigger on table "public"."follows" to "authenticated";

grant truncate on table "public"."follows" to "authenticated";

grant update on table "public"."follows" to "authenticated";

grant delete on table "public"."follows" to "service_role";

grant insert on table "public"."follows" to "service_role";

grant references on table "public"."follows" to "service_role";

grant select on table "public"."follows" to "service_role";

grant trigger on table "public"."follows" to "service_role";

grant truncate on table "public"."follows" to "service_role";

grant update on table "public"."follows" to "service_role";

create policy "delete_policy"
on "public"."bookmarks"
as permissive
for delete
to public
using (public.authorize('bookmarks.delete'::text));


create policy "insert_policy"
on "public"."bookmarks"
as permissive
for insert
to public
with check (public.authorize('bookmarks.insert'::text));


create policy "select_policy"
on "public"."bookmarks"
as permissive
for select
to public
using (public.authorize('bookmarks.select'::text));


create policy "update_policy"
on "public"."bookmarks"
as permissive
for update
to public
using (public.authorize('bookmarks.update'::text));


create policy "delete_policy"
on "public"."comments"
as permissive
for delete
to public
using (public.authorize('comments.delete'::text));


create policy "insert_policy"
on "public"."comments"
as permissive
for insert
to public
with check (public.authorize('comments.insert'::text));


create policy "select_policy"
on "public"."comments"
as permissive
for select
to public
using (public.authorize('comments.select'::text));


create policy "update_policy"
on "public"."comments"
as permissive
for update
to public
using (public.authorize('comments.update'::text));


create policy "delete_policy"
on "public"."follows"
as permissive
for delete
to public
using (public.authorize('follows.delete'::text));


create policy "insert_policy"
on "public"."follows"
as permissive
for insert
to public
with check (public.authorize('follows.insert'::text));


create policy "select_policy"
on "public"."follows"
as permissive
for select
to public
using (public.authorize('follows.select'::text));


create policy "update_policy"
on "public"."follows"
as permissive
for update
to public
using (public.authorize('follows.update'::text));

SELECT cron.schedule('Weekly Maintenance', '0 0 * * 0', 'SELECT public.execute_weekly_maintenance()');

