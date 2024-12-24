-- Check and create sequence if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'table_maintenance_log_id_seq') THEN
    CREATE SEQUENCE "public"."table_maintenance_log_id_seq";
  END IF;
END $$;

-- Check and create table if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'table_maintenance_log') THEN
    CREATE TABLE "public"."table_maintenance_log" (
      "id" integer not null default nextval('public.table_maintenance_log_id_seq'::regclass),
      "operation" text,
      "detail" text,
      "logged_at" timestamp with time zone default now()
    );

    -- Enable RLS
    ALTER TABLE "public"."table_maintenance_log" ENABLE ROW LEVEL SECURITY;

    -- Set sequence ownership
    ALTER SEQUENCE "public"."table_maintenance_log_id_seq" OWNED BY "public"."table_maintenance_log"."id";

    -- Create primary key
    ALTER TABLE "public"."table_maintenance_log" ADD CONSTRAINT "table_maintenance_log_pkey" PRIMARY KEY (id);
  END IF;
END $$;

-- Drop existing policies if they exist and create new ones
DO $$ 
BEGIN 
  -- Delete policy
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'table_maintenance_log' AND policyname = 'delete_policy') THEN
    DROP POLICY "delete_policy" ON "public"."table_maintenance_log";
  END IF;
  CREATE POLICY "delete_policy" ON "public"."table_maintenance_log" AS permissive FOR DELETE TO public
    USING ((public.authorize('table_maintenance_log.delete'::text) AND false));

  -- Insert policy
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'table_maintenance_log' AND policyname = 'insert_policy') THEN
    DROP POLICY "insert_policy" ON "public"."table_maintenance_log";
  END IF;
  CREATE POLICY "insert_policy" ON "public"."table_maintenance_log" AS permissive FOR INSERT TO public
    WITH CHECK ((public.authorize('table_maintenance_log.insert'::text) AND false));

  -- Select policy
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'table_maintenance_log' AND policyname = 'select_policy') THEN
    DROP POLICY "select_policy" ON "public"."table_maintenance_log";
  END IF;
  CREATE POLICY "select_policy" ON "public"."table_maintenance_log" AS permissive FOR SELECT TO public
    USING ((public.authorize('table_maintenance_log.select'::text) AND true));

  -- Update policy
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'table_maintenance_log' AND policyname = 'update_policy') THEN
    DROP POLICY "update_policy" ON "public"."table_maintenance_log";
  END IF;
  CREATE POLICY "update_policy" ON "public"."table_maintenance_log" AS permissive FOR UPDATE TO public
    USING ((public.authorize('table_maintenance_log.update'::text) AND false));
END $$;

-- Cron Jobs
DO $$ 
BEGIN 
  -- Weekly maintenance
  IF NOT EXISTS (
    SELECT 1 FROM cron.job 
    WHERE command = 'SELECT public.execute_weekly_maintenance()'
  ) THEN
    PERFORM cron.schedule(
      'execute_weekly_maintenance',
      '0 0 * * 0',
      'SELECT public.execute_weekly_maintenance()'
    );
  END IF;

  -- Database stats
  IF NOT EXISTS (
    SELECT 1 FROM cron.job 
    WHERE command = 'SELECT public.gather_database_stats()'
  ) THEN
    PERFORM cron.schedule(
      'gather_database_stats',
      '0 0 * * 0',
      'SELECT public.gather_database_stats()'
    );
  END IF;

  -- Monthly cleanup
  IF NOT EXISTS (
    SELECT 1 FROM cron.job 
    WHERE command = 'SELECT public.cleanup_table_stats()'
  ) THEN
    PERFORM cron.schedule(
      'cleanup_table_stats',
      '0 3 1 * *',
      'SELECT public.cleanup_table_stats()'
    );
  END IF;

  -- Weekly maintenance (alternative)
  IF NOT EXISTS (
    SELECT 1 FROM cron.job 
    WHERE command = 'SELECT public.perform_weekly_maintenance()'
  ) THEN
    PERFORM cron.schedule(
      'perform_weekly_maintenance',
      '0 1 * * 0',
      'SELECT public.perform_weekly_maintenance()'
    );
  END IF;
END $$;

DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM cron.job 
    WHERE command = 'SELECT public.refresh_content_views()'
  ) THEN
    PERFORM cron.schedule(
      'refresh_content_views',        -- job_name
      '*/20 * * * *',                -- schedule
      'SELECT public.refresh_content_views()'  -- command
    );
  END IF;
END $$;