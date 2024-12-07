drop materialized view if exists "public"."error_correlations";

drop materialized view if exists "public"."error_patterns";

alter table "public"."contents" add column "hot_score" double precision default 0;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_available_tables()
 RETURNS TABLE(table_name text, description text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    tables.table_name::text,
    pg_catalog.obj_description(
      (quote_ident(tables.table_schema) || '.' || 
       quote_ident(tables.table_name))::regclass, 
      'pg_class'
    )::text as description
  FROM information_schema.tables
  WHERE table_schema = current_schema()
  AND table_type = 'BASE TABLE'
  AND tables.table_name NOT IN ('migrations', 'schema_migrations')
  ORDER BY tables.table_name;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_column_metadata(target_table_name text)
 RETURNS TABLE(column_name text, constraints jsonb, foreign_key_info jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY
    WITH constraints_info AS (
        SELECT 
            c.column_name,
            jsonb_agg(
                jsonb_build_object(
                    'constraint_type', tc.constraint_type,
                    'constraint_name', tc.constraint_name,
                    'check_clause', cc.check_clause
                )
            ) as constraints
        FROM information_schema.columns c
        LEFT JOIN information_schema.constraint_column_usage ccu 
            ON c.table_name = ccu.table_name 
            AND c.column_name = ccu.column_name
        LEFT JOIN information_schema.table_constraints tc 
            ON ccu.constraint_name = tc.constraint_name
        LEFT JOIN information_schema.check_constraints cc 
            ON tc.constraint_name = cc.constraint_name
        WHERE c.table_name = target_table_name
        AND c.table_schema = current_schema()
        GROUP BY c.column_name
    ),
    foreign_keys AS (
        SELECT
            kcu.column_name,
            jsonb_build_object(
                'foreign_table', ccu.table_name,
                'foreign_column', ccu.column_name,
                'foreign_schema', ccu.table_schema
            ) as fk_info
        FROM information_schema.key_column_usage kcu
        JOIN information_schema.constraint_column_usage ccu 
            ON kcu.constraint_name = ccu.constraint_name
        JOIN information_schema.table_constraints tc 
            ON kcu.constraint_name = tc.constraint_name
        WHERE kcu.table_name = target_table_name
        AND tc.constraint_type = 'FOREIGN KEY'
        AND kcu.table_schema = current_schema()
    )
    SELECT 
        c.column_name::text,
        COALESCE(ci.constraints, '[]'::jsonb),
        COALESCE(fk.fk_info, '{}'::jsonb)
    FROM information_schema.columns c
    LEFT JOIN constraints_info ci ON c.column_name = ci.column_name
    LEFT JOIN foreign_keys fk ON c.column_name = fk.column_name
    WHERE c.table_name = target_table_name
    AND c.table_schema = current_schema()
    ORDER BY c.ordinal_position;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_table_structure(target_table_name text)
 RETURNS TABLE(column_name text, data_type text, is_nullable boolean, column_default text, is_identity boolean, is_generated boolean, character_maximum_length integer, numeric_precision integer, numeric_scale integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY
    WITH typed_columns AS (
        SELECT 
            c.column_name::text AS t_column_name,
            c.data_type::text AS t_data_type,
            (c.is_nullable = 'YES')::boolean AS t_is_nullable,
            COALESCE(c.column_default, '')::text AS t_column_default,
            (c.is_identity = 'YES')::boolean AS t_is_identity,
            (c.generation_expression IS NOT NULL)::boolean AS t_is_generated,
            c.character_maximum_length::int AS t_character_maximum_length,
            c.numeric_precision::int AS t_numeric_precision,
            c.numeric_scale::int AS t_numeric_scale
        FROM information_schema.columns c
        WHERE c.table_name = target_table_name
          AND c.table_schema = 'public'
    )
    SELECT
        t_column_name AS column_name,
        t_data_type AS data_type,
        t_is_nullable AS is_nullable,
        t_column_default AS column_default,
        t_is_identity AS is_identity,
        t_is_generated AS is_generated,
        t_character_maximum_length AS character_maximum_length,
        t_numeric_precision AS numeric_precision,
        t_numeric_scale AS numeric_scale
    FROM typed_columns
    ORDER BY column_name;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_hot_score_for_content()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_content_id uuid;
    v_votes_count int;
    v_bookmarks_count int;
    v_created_at timestamp with time zone;
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_content_id := OLD.content_id;
    ELSE
        v_content_id := NEW.content_id;
    END IF;
    
    SELECT created_at INTO v_created_at 
    FROM contents 
    WHERE id = v_content_id;

    SELECT COUNT(*) INTO v_votes_count FROM votes WHERE content_id = v_content_id;
    SELECT COUNT(*) INTO v_bookmarks_count FROM bookmarks WHERE content_id = v_content_id;

    UPDATE contents
    SET hot_score = LOG(10, 1 + v_votes_count + (3 * v_bookmarks_count))
                    + 1.0
                    - (EXTRACT(EPOCH FROM (NOW() - v_created_at)) / 450000)
    WHERE id = v_content_id;

    RETURN NEW;
END;
$function$
;

create materialized view "public"."error_correlations" as  WITH error_sequences AS (
         SELECT row_number() OVER (ORDER BY e1.service_name, e1.error_pattern, e2.service_name, e2.error_pattern) AS id,
            e1.service_name AS source_service,
            e1.error_pattern AS source_pattern,
            e2.service_name AS target_service,
            e2.error_pattern AS target_pattern,
            count(*) AS correlation_count,
            avg(EXTRACT(epoch FROM (e2.created_at - e1.created_at))) AS avg_time_difference
           FROM (public.error_logs e1
             JOIN public.error_logs e2 ON (((e2.created_at > e1.created_at) AND (e2.created_at < (e1.created_at + '00:05:00'::interval)) AND (e2.id <> e1.id))))
          WHERE (e1.created_at > (now() - '7 days'::interval))
          GROUP BY e1.service_name, e1.error_pattern, e2.service_name, e2.error_pattern
         HAVING (count(*) >= 3)
        )
 SELECT error_sequences.id,
    error_sequences.source_service,
    error_sequences.source_pattern,
    error_sequences.target_service,
    error_sequences.target_pattern,
    error_sequences.correlation_count,
    error_sequences.avg_time_difference
   FROM error_sequences;


create materialized view "public"."error_patterns" as  WITH pattern_stats AS (
         SELECT error_logs.error_hash,
            error_logs.error_pattern,
            error_logs.service_name,
            count(*) AS occurrence_count,
            min(error_logs.created_at) AS first_seen,
            max(error_logs.created_at) AS last_seen,
            array_agg(DISTINCT error_logs.severity) AS severity_levels,
            jsonb_agg(DISTINCT error_logs.context) AS contexts,
            count(DISTINCT date_trunc('day'::text, error_logs.created_at)) AS days_active
           FROM public.error_logs
          WHERE (error_logs.created_at > (now() - '7 days'::interval))
          GROUP BY error_logs.error_hash, error_logs.error_pattern, error_logs.service_name
        )
 SELECT row_number() OVER (ORDER BY pattern_stats.error_hash, pattern_stats.service_name) AS id,
    pattern_stats.error_hash,
    pattern_stats.error_pattern,
    pattern_stats.service_name,
    pattern_stats.occurrence_count,
    pattern_stats.first_seen,
    pattern_stats.last_seen,
    pattern_stats.severity_levels,
    pattern_stats.contexts,
    pattern_stats.days_active,
    ((pattern_stats.occurrence_count)::double precision / (GREATEST(pattern_stats.days_active, (1)::bigint))::double precision) AS daily_frequency,
        CASE
            WHEN (pattern_stats.first_seen > (now() - '24:00:00'::interval)) THEN true
            ELSE false
        END AS is_new
   FROM pattern_stats;


CREATE OR REPLACE FUNCTION public.refresh_error_views()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    BEGIN
        REFRESH MATERIALIZED VIEW CONCURRENTLY error_patterns;
        RAISE NOTICE 'Successfully refreshed error_patterns view';
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Failed to refresh error_patterns: %', SQLERRM;
    END;

    BEGIN
        REFRESH MATERIALIZED VIEW CONCURRENTLY error_correlations;
        RAISE NOTICE 'Successfully refreshed error_correlations view';
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Failed to refresh error_correlations: %', SQLERRM;
    END;
END;
$function$
;

CREATE UNIQUE INDEX error_correlations_unique_idx ON public.error_correlations USING btree (id);

CREATE UNIQUE INDEX error_patterns_unique_idx ON public.error_patterns USING btree (id);


CREATE TRIGGER update_hot_score_bookmarks AFTER INSERT OR DELETE OR UPDATE ON public.bookmarks FOR EACH ROW EXECUTE FUNCTION public.update_hot_score_for_content();

CREATE TRIGGER update_hot_score_votes AFTER INSERT OR DELETE OR UPDATE ON public.votes FOR EACH ROW EXECUTE FUNCTION public.update_hot_score_for_content();


