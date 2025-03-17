create extension if not exists "wrappers" with schema "extensions";

revoke delete on table "public"."customer_subscription_offers" from "anon";

revoke delete on table "public"."customer_subscription_offers" from "anon";

revoke insert on table "public"."customer_subscription_offers" from "anon";

revoke insert on table "public"."customer_subscription_offers" from "anon";

revoke references on table "public"."customer_subscription_offers" from "anon";

revoke select on table "public"."customer_subscription_offers" from "anon";

revoke trigger on table "public"."customer_subscription_offers" from "anon";

revoke truncate on table "public"."customer_subscription_offers" from "anon";

revoke update on table "public"."customer_subscription_offers" from "anon";

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename = 'categorized_urls' 
    AND indexname = 'unique_url_found_on'
  ) THEN
    EXECUTE 'CREATE UNIQUE INDEX unique_url_found_on ON public.categorized_urls USING btree (url, found_on)';
  END IF;


  IF NOT EXISTS (SELECT FROM pg_constraint WHERE conname = 'jobs_content_source_id_fkey') THEN
    -- Add your constraint logic here
  END IF;
END;
$$;


DO $$
BEGIN
  -- Check and add jobs_content_source_id_fkey constraint if it doesn't exist
  IF NOT EXISTS (SELECT FROM pg_constraint WHERE conname = 'jobs_content_source_id_fkey') THEN
    -- First check if the columns are compatible before adding constraint
    IF EXISTS (
      SELECT 1 
      FROM information_schema.columns c1
      JOIN information_schema.columns c2 ON c2.table_schema = 'public' AND c2.table_name = 'content_sources' AND c2.column_name = 'id'
      WHERE c1.table_schema = 'public' AND c1.table_name = 'jobs' AND c1.column_name = 'content_source_id'
      AND c1.data_type = c2.data_type
    ) THEN
      ALTER TABLE "public"."jobs" 
      ADD CONSTRAINT "jobs_content_source_id_fkey" 
      FOREIGN KEY (content_source_id) REFERENCES public.content_sources(id) ON DELETE CASCADE;
    END IF;
  END IF;

  -- Check and add categorized_urls_company_id_fkey constraint if it doesn't exist
  IF NOT EXISTS (SELECT FROM pg_constraint WHERE conname = 'categorized_urls_company_id_fkey') THEN
    ALTER TABLE "public"."categorized_urls" 
    ADD CONSTRAINT "categorized_urls_company_id_fkey" 
    FOREIGN KEY (company_id) REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;
    
    -- Validate the constraint after adding it
    ALTER TABLE "public"."categorized_urls" 
    VALIDATE CONSTRAINT "categorized_urls_company_id_fkey";
  END IF;

  -- Check if unique_url_found_on index exists before trying to create the constraint
  IF EXISTS (SELECT FROM pg_indexes WHERE indexname = 'unique_url_found_on') 
     AND NOT EXISTS (SELECT FROM pg_constraint WHERE conname = 'unique_url_found_on') THEN
    ALTER TABLE "public"."categorized_urls" 
    ADD CONSTRAINT "unique_url_found_on" UNIQUE USING INDEX "unique_url_found_on";
  ELSIF NOT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'unique_url_found_on') 
        AND NOT EXISTS (SELECT FROM pg_constraint WHERE conname = 'unique_url_found_on') THEN
    -- Create both the index and constraint if neither exists
    CREATE UNIQUE INDEX unique_url_found_on ON public.categorized_urls USING btree (url, found_on);
    ALTER TABLE "public"."categorized_urls" 
    ADD CONSTRAINT "unique_url_found_on" UNIQUE USING INDEX "unique_url_found_on";
  END IF;
END;
$$;


-- First, add a new UUID column to jobs
ALTER TABLE "public"."jobs" ADD COLUMN "new_content_source_id" UUID;

-- Update the values (if you have a mapping table)
UPDATE "public"."jobs" j
SET "new_content_source_id" = (
  SELECT cs.id 
  FROM "public"."content_sources" cs 
  WHERE cs.id = j.content_source_id::text::uuid
);

-- Drop the old column and rename the new one
ALTER TABLE "public"."jobs" DROP COLUMN "content_source_id";
ALTER TABLE "public"."jobs" RENAME COLUMN "new_content_source_id" TO "content_source_id";

-- Now add the foreign key constraint
ALTER TABLE "public"."jobs" ADD CONSTRAINT "jobs_content_source_id_fkey" 
FOREIGN KEY (content_source_id) REFERENCES public.content_sources(id) ON DELETE CASCADE;

-- Revert 'alter table "public"."companies" drop column "job_url"'
ALTER TABLE "public"."companies" 
ADD COLUMN IF NOT EXISTS "job_url" TEXT;

-- Revert trigger permission revocations
GRANT ALL ON TABLE "public"."customer_subscription_offers" TO "service_role";
GRANT ALL ON TABLE "public"."customer_subscription_offers" TO "authenticated";

