DO $$
BEGIN
  -- Check if the table exists before attempting to drop the trigger
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'categorized_urls'
  ) THEN
    DROP TRIGGER IF EXISTS "update_categorized_urls_timestamp" ON "public"."categorized_urls";
  ELSE
    RAISE NOTICE 'Table public.categorized_urls does not exist, skipping trigger drop';
  END IF;
END
$$;

-- SECTION 2: Revoke permissions from old tables (wrapped in DO blocks for safety)
DO $$
BEGIN
  -- Only attempt to revoke if the table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'blacklisted_domains') THEN
    REVOKE ALL ON TABLE "public"."blacklisted_domains" FROM "anon", "authenticated", "service_role";
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'blacklisted_urls') THEN
    REVOKE ALL ON TABLE "public"."blacklisted_urls" FROM "anon", "authenticated", "service_role";
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'categorized_urls') THEN
    REVOKE ALL ON TABLE "public"."categorized_urls" FROM "anon", "authenticated", "service_role";
  END IF;
END
$$;

-- SECTION 3: Drop constraints from old tables (wrapped in DO blocks for safety)
DO $$
BEGIN
  -- Check and drop constraints on blacklisted_domains if they exist
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'blacklisted_domains') THEN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_schema = 'public' AND table_name = 'blacklisted_domains' AND constraint_name = 'blacklisted_domains_url_key') THEN
      ALTER TABLE "public"."blacklisted_domains" DROP CONSTRAINT IF EXISTS "blacklisted_domains_url_key";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_schema = 'public' AND table_name = 'blacklisted_domains' AND constraint_name = 'blacklisted_domains_pkey') THEN
      ALTER TABLE "public"."blacklisted_domains" DROP CONSTRAINT IF EXISTS "blacklisted_domains_pkey";
    END IF;
  END IF;
  
  -- Check and drop constraints on blacklisted_urls if they exist
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'blacklisted_urls') THEN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_schema = 'public' AND table_name = 'blacklisted_urls' AND constraint_name = 'blacklisted_urls_url_key') THEN
      ALTER TABLE "public"."blacklisted_urls" DROP CONSTRAINT IF EXISTS "blacklisted_urls_url_key";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_schema = 'public' AND table_name = 'blacklisted_urls' AND constraint_name = 'public_blacklisted_urls_company_id_fkey') THEN
      ALTER TABLE "public"."blacklisted_urls" DROP CONSTRAINT IF EXISTS "public_blacklisted_urls_company_id_fkey";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_schema = 'public' AND table_name = 'blacklisted_urls' AND constraint_name = 'blacklisted_urls_pkey') THEN
      ALTER TABLE "public"."blacklisted_urls" DROP CONSTRAINT IF EXISTS "blacklisted_urls_pkey";
    END IF;
  END IF;
  
  -- Check and drop constraints on categorized_urls if they exist
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'categorized_urls') THEN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_schema = 'public' AND table_name = 'categorized_urls' AND constraint_name = 'categorized_urls_company_id_fkey') THEN
      ALTER TABLE "public"."categorized_urls" DROP CONSTRAINT IF EXISTS "categorized_urls_company_id_fkey";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_schema = 'public' AND table_name = 'categorized_urls' AND constraint_name = 'categorized_urls_domain_id_fkey') THEN
      ALTER TABLE "public"."categorized_urls" DROP CONSTRAINT IF EXISTS "categorized_urls_domain_id_fkey";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_schema = 'public' AND table_name = 'categorized_urls' AND constraint_name = 'unique_url_found_on') THEN
      ALTER TABLE "public"."categorized_urls" DROP CONSTRAINT IF EXISTS "unique_url_found_on";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_schema = 'public' AND table_name = 'categorized_urls' AND constraint_name = 'valid_confidence') THEN
      ALTER TABLE "public"."categorized_urls" DROP CONSTRAINT IF EXISTS "valid_confidence";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_schema = 'public' AND table_name = 'categorized_urls' AND constraint_name = 'categorized_urls_pkey') THEN
      ALTER TABLE "public"."categorized_urls" DROP CONSTRAINT IF EXISTS "categorized_urls_pkey";
    END IF;
  END IF;
END
$$;

-- SECTION 4: Drop indexes from old tables
DROP INDEX IF EXISTS "public"."blacklisted_domains_pkey";
DROP INDEX IF EXISTS "public"."blacklisted_domains_url_key";
DROP INDEX IF EXISTS "public"."blacklisted_urls_pkey";
DROP INDEX IF EXISTS "public"."blacklisted_urls_url_key";
DROP INDEX IF EXISTS "public"."categorized_urls_pkey";
DROP INDEX IF EXISTS "public"."idx_blacklisted_urls_url";
DROP INDEX IF EXISTS "public"."idx_categorized_urls_domain_id";
DROP INDEX IF EXISTS "public"."idx_categorized_urls_normalized_url";
DROP INDEX IF EXISTS "public"."unique_url_found_on";

-- SECTION 5: Drop old tables
DROP TABLE IF EXISTS "public"."blacklisted_domains";
DROP TABLE IF EXISTS "public"."blacklisted_urls";
DROP TABLE IF EXISTS "public"."categorized_urls";

-- SECTION 6: Update content_status enum
DO $$
BEGIN
  -- Temporarily remove defaults that depend on content_status enum
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'content_status') THEN
    ALTER TABLE "public"."companies" ALTER COLUMN "content_status" DROP DEFAULT;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_schema = 'public' AND table_name = 'jobs' AND column_name = 'content_status') THEN
    ALTER TABLE "public"."jobs" ALTER COLUMN "content_status" DROP DEFAULT;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_schema = 'public' AND table_name = 'newsletters' AND column_name = 'content_status') THEN
    ALTER TABLE "public"."newsletters" ALTER COLUMN "content_status" DROP DEFAULT;
  END IF;
  
  -- Only create the new enum if the old one exists
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_status') THEN
    -- Rename current enum to temporary name
    ALTER TYPE "public"."content_status" RENAME TO "content_status__old_version_to_be_dropped";
    
    -- Create new enum with additional values
    CREATE TYPE "public"."content_status" AS ENUM (
      'draft', 'pending_agent_action', 'pending_agent_review', 'pending_human_review', 
      'pending_relevance_check', 'irrelevant', 'scheduled', 'unpublished', 'archived', 
      'published', 'failed', 'pending_crawl', 'scraped', 'outdated', 'updated', 'new', 
      'processing', 'crawling', 'crawled'
    );
    
    -- Update columns to use new enum
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'content_status') THEN
      ALTER TABLE "public"."companies" 
      ALTER COLUMN content_status TYPE "public"."content_status" 
      USING content_status::text::"public"."content_status";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_schema = 'public' AND table_name = 'jobs' AND column_name = 'content_status') THEN
      ALTER TABLE "public"."jobs" 
      ALTER COLUMN content_status TYPE "public"."content_status" 
      USING content_status::text::"public"."content_status";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_schema = 'public' AND table_name = 'newsletters' AND column_name = 'content_status') THEN
      ALTER TABLE "public"."newsletters" 
      ALTER COLUMN content_status TYPE "public"."content_status" 
      USING content_status::text::"public"."content_status";
    END IF;
    
    -- Set defaults back
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'content_status') THEN
      ALTER TABLE "public"."companies" 
      ALTER COLUMN "content_status" SET DEFAULT 'draft'::public.content_status;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_schema = 'public' AND table_name = 'jobs' AND column_name = 'content_status') THEN
      ALTER TABLE "public"."jobs" 
      ALTER COLUMN "content_status" SET DEFAULT 'draft'::public.content_status;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_schema = 'public' AND table_name = 'newsletters' AND column_name = 'content_status') THEN
      ALTER TABLE "public"."newsletters" 
      ALTER COLUMN "content_status" SET DEFAULT 'draft'::public.content_status;
    END IF;
    
    -- Drop old enum
    DROP TYPE IF EXISTS "public"."content_status__old_version_to_be_dropped";
  ELSE
    -- If the old enum doesn't exist, just create the new one
    CREATE TYPE "public"."content_status" AS ENUM (
      'draft', 'pending_agent_action', 'pending_agent_review', 'pending_human_review', 
      'pending_relevance_check', 'irrelevant', 'scheduled', 'unpublished', 'archived', 
      'published', 'failed', 'pending_crawl', 'scraped', 'outdated', 'updated', 'new', 
      'processing', 'crawling', 'crawled'
    );
    
    -- Set defaults
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'content_status') THEN
      ALTER TABLE "public"."companies" 
      ALTER COLUMN "content_status" SET DEFAULT 'draft'::public.content_status;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_schema = 'public' AND table_name = 'jobs' AND column_name = 'content_status') THEN
      ALTER TABLE "public"."jobs" 
      ALTER COLUMN "content_status" SET DEFAULT 'draft'::public.content_status;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_schema = 'public' AND table_name = 'newsletters' AND column_name = 'content_status') THEN
      ALTER TABLE "public"."newsletters" 
      ALTER COLUMN "content_status" SET DEFAULT 'draft'::public.content_status;
    END IF;
  END IF;
END
$$;

-- Drop sequence if it exists
DROP SEQUENCE IF EXISTS "public"."blacklisted_urls_id_seq";

-- SECTION 7: Create new tables
CREATE TABLE IF NOT EXISTS "public"."domain_blacklist" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "domain_name" text NOT NULL,
    "reason" text,
    "created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "public"."domain_relationships" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "source_domain_root_id" uuid,
    "source_company_id" uuid,
    "source_url_id" uuid NOT NULL,
    "target_url_id" uuid NOT NULL,
    "target_domain_root_id" uuid,
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "public"."domain_roots" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "domain_name" text NOT NULL,
    "first_seen_at" timestamp with time zone DEFAULT now(),
    "last_seen_at" timestamp with time zone DEFAULT now(),
    "is_crawled" boolean DEFAULT false,
    "crawl_count" integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "public"."domain_urls" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "company_id" uuid,
    "domain_root_id" uuid,
    "url" text NOT NULL,
    "error_count" integer DEFAULT 0,
    "last_error" text,
    "content_hash" character varying,
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now(),
    "priority" public.priority NOT NULL DEFAULT 'low'::public.priority,
    "content" text
);

CREATE TABLE IF NOT EXISTS "public"."domain_whitelist" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "domain_name" text NOT NULL,
    "priority" public.priority NOT NULL DEFAULT 'low'::public.priority,
    "created_at" timestamp with time zone DEFAULT now()
);

-- SECTION 8: Create indexes (safely)
DO $$
BEGIN
  -- Create indexes only if they don't exist
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'domain_blacklist_domain_name_key') THEN
    CREATE UNIQUE INDEX domain_blacklist_domain_name_key ON public.domain_blacklist USING btree (domain_name);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'domain_blacklist_pkey') THEN
    CREATE UNIQUE INDEX domain_blacklist_pkey ON public.domain_blacklist USING btree (id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'domain_relationships_pkey') THEN
    CREATE UNIQUE INDEX domain_relationships_pkey ON public.domain_relationships USING btree (id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'domain_relationships_source_url_id_target_url_id_key') THEN
    CREATE UNIQUE INDEX domain_relationships_source_url_id_target_url_id_key ON public.domain_relationships USING btree (source_url_id, target_url_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'domain_roots_domain_name_key') THEN
    CREATE UNIQUE INDEX domain_roots_domain_name_key ON public.domain_roots USING btree (domain_name);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'domain_roots_pkey') THEN
    CREATE UNIQUE INDEX domain_roots_pkey ON public.domain_roots USING btree (id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'domain_urls_pkey') THEN
    CREATE UNIQUE INDEX domain_urls_pkey ON public.domain_urls USING btree (id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'domain_urls_url_domain_root_id_key') THEN
    CREATE UNIQUE INDEX domain_urls_url_domain_root_id_key ON public.domain_urls USING btree (url, domain_root_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'domain_whitelist_domain_name_key') THEN
    CREATE UNIQUE INDEX domain_whitelist_domain_name_key ON public.domain_whitelist USING btree (domain_name);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'domain_whitelist_pkey') THEN
    CREATE UNIQUE INDEX domain_whitelist_pkey ON public.domain_whitelist USING btree (id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_domain_relationships_source_company') THEN
    CREATE INDEX idx_domain_relationships_source_company ON public.domain_relationships USING btree (source_company_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_domain_roots_domain_name') THEN
    CREATE INDEX idx_domain_roots_domain_name ON public.domain_roots USING btree (domain_name);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_domain_urls_company_id') THEN
    CREATE INDEX idx_domain_urls_company_id ON public.domain_urls USING btree (company_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_domain_urls_url') THEN
    CREATE INDEX idx_domain_urls_url ON public.domain_urls USING btree (url);
  END IF;
END
$$;

-- SECTION 9: Add constraints to new tables (safely)
DO $$
BEGIN
  -- Only add primary key constraints if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_schema = 'public' 
    AND table_name = 'domain_blacklist' 
    AND constraint_name = 'domain_blacklist_pkey'
  ) THEN
    ALTER TABLE "public"."domain_blacklist" ADD CONSTRAINT "domain_blacklist_pkey" PRIMARY KEY USING INDEX "domain_blacklist_pkey";
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_schema = 'public' 
    AND table_name = 'domain_relationships' 
    AND constraint_name = 'domain_relationships_pkey'
  ) THEN
    ALTER TABLE "public"."domain_relationships" ADD CONSTRAINT "domain_relationships_pkey" PRIMARY KEY USING INDEX "domain_relationships_pkey";
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_schema = 'public' 
    AND table_name = 'domain_roots' 
    AND constraint_name = 'domain_roots_pkey'
  ) THEN
    ALTER TABLE "public"."domain_roots" ADD CONSTRAINT "domain_roots_pkey" PRIMARY KEY USING INDEX "domain_roots_pkey";
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_schema = 'public' 
    AND table_name = 'domain_urls' 
    AND constraint_name = 'domain_urls_pkey'
  ) THEN
    ALTER TABLE "public"."domain_urls" ADD CONSTRAINT "domain_urls_pkey" PRIMARY KEY USING INDEX "domain_urls_pkey";
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_schema = 'public' 
    AND table_name = 'domain_whitelist' 
    AND constraint_name = 'domain_whitelist_pkey'
  ) THEN
    ALTER TABLE "public"."domain_whitelist" ADD CONSTRAINT "domain_whitelist_pkey" PRIMARY KEY USING INDEX "domain_whitelist_pkey";
  END IF;

  -- Unique constraints
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_schema = 'public' 
    AND table_name = 'domain_blacklist' 
    AND constraint_name = 'domain_blacklist_domain_name_key'
  ) THEN
    ALTER TABLE "public"."domain_blacklist" ADD CONSTRAINT "domain_blacklist_domain_name_key" UNIQUE USING INDEX "domain_blacklist_domain_name_key";
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_schema = 'public' 
    AND table_name = 'domain_relationships' 
    AND constraint_name = 'domain_relationships_source_url_id_target_url_id_key'
  ) THEN
    ALTER TABLE "public"."domain_relationships" ADD CONSTRAINT "domain_relationships_source_url_id_target_url_id_key" UNIQUE USING INDEX "domain_relationships_source_url_id_target_url_id_key";
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_schema = 'public' 
    AND table_name = 'domain_roots' 
    AND constraint_name = 'domain_roots_domain_name_key'
  ) THEN
    ALTER TABLE "public"."domain_roots" ADD CONSTRAINT "domain_roots_domain_name_key" UNIQUE USING INDEX "domain_roots_domain_name_key";
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_schema = 'public' 
    AND table_name = 'domain_urls' 
    AND constraint_name = 'domain_urls_url_domain_root_id_key'
  ) THEN
    ALTER TABLE "public"."domain_urls" ADD CONSTRAINT "domain_urls_url_domain_root_id_key" UNIQUE USING INDEX "domain_urls_url_domain_root_id_key";
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_schema = 'public' 
    AND table_name = 'domain_whitelist' 
    AND constraint_name = 'domain_whitelist_domain_name_key'
  ) THEN
    ALTER TABLE "public"."domain_whitelist" ADD CONSTRAINT "domain_whitelist_domain_name_key" UNIQUE USING INDEX "domain_whitelist_domain_name_key";
  END IF;

  -- Foreign key constraints with not valid and validate pattern for safety
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_schema = 'public' 
    AND table_name = 'domain_relationships' 
    AND constraint_name = 'domain_relationships_source_company_id_fkey'
  ) THEN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'companies') THEN
      ALTER TABLE "public"."domain_relationships" ADD CONSTRAINT "domain_relationships_source_company_id_fkey" 
      FOREIGN KEY (source_company_id) REFERENCES public.companies(id) NOT VALID;
      
      ALTER TABLE "public"."domain_relationships" VALIDATE CONSTRAINT "domain_relationships_source_company_id_fkey";
    END IF;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_schema = 'public' 
    AND table_name = 'domain_relationships' 
    AND constraint_name = 'domain_relationships_source_domain_root_id_fkey'
  ) THEN
    ALTER TABLE "public"."domain_relationships" ADD CONSTRAINT "domain_relationships_source_domain_root_id_fkey" 
    FOREIGN KEY (source_domain_root_id) REFERENCES public.domain_roots(id) NOT VALID;
    
    ALTER TABLE "public"."domain_relationships" VALIDATE CONSTRAINT "domain_relationships_source_domain_root_id_fkey";
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_schema = 'public' 
    AND table_name = 'domain_relationships' 
    AND constraint_name = 'domain_relationships_source_url_id_fkey'
  ) THEN
    ALTER TABLE "public"."domain_relationships" ADD CONSTRAINT "domain_relationships_source_url_id_fkey" 
    FOREIGN KEY (source_url_id) REFERENCES public.domain_urls(id) NOT VALID;
    
    ALTER TABLE "public"."domain_relationships" VALIDATE CONSTRAINT "domain_relationships_source_url_id_fkey";
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_schema = 'public' 
    AND table_name = 'domain_relationships' 
    AND constraint_name = 'domain_relationships_target_domain_root_id_fkey'
  ) THEN
    ALTER TABLE "public"."domain_relationships" ADD CONSTRAINT "domain_relationships_target_domain_root_id_fkey" 
    FOREIGN KEY (target_domain_root_id) REFERENCES public.domain_roots(id) NOT VALID;
    
    ALTER TABLE "public"."domain_relationships" VALIDATE CONSTRAINT "domain_relationships_target_domain_root_id_fkey";
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_schema = 'public' 
    AND table_name = 'domain_relationships' 
    AND constraint_name = 'domain_relationships_target_url_id_fkey'
  ) THEN
    ALTER TABLE "public"."domain_relationships" ADD CONSTRAINT "domain_relationships_target_url_id_fkey" 
    FOREIGN KEY (target_url_id) REFERENCES public.domain_urls(id) NOT VALID;
    
    ALTER TABLE "public"."domain_relationships" VALIDATE CONSTRAINT "domain_relationships_target_url_id_fkey";
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_schema = 'public' 
    AND table_name = 'domain_urls' 
    AND constraint_name = 'domain_urls_company_id_fkey'
  ) THEN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'companies') THEN
      ALTER TABLE "public"."domain_urls" ADD CONSTRAINT "domain_urls_company_id_fkey" 
      FOREIGN KEY (company_id) REFERENCES public.companies(id) NOT VALID;
      
      ALTER TABLE "public"."domain_urls" VALIDATE CONSTRAINT "domain_urls_company_id_fkey";
    END IF;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_schema = 'public' 
    AND table_name = 'domain_urls' 
    AND constraint_name = 'domain_urls_domain_root_id_fkey'
  ) THEN
    ALTER TABLE "public"."domain_urls" ADD CONSTRAINT "domain_urls_domain_root_id_fkey" 
    FOREIGN KEY (domain_root_id) REFERENCES public.domain_roots(id) NOT VALID;
    
    ALTER TABLE "public"."domain_urls" VALIDATE CONSTRAINT "domain_urls_domain_root_id_fkey";
  END IF;
END
$$;

-- SECTION 10: Grant permissions on new tables
-- Simplified grants using DO block for better readability
DO $$
BEGIN
  -- Grant all permissions to all roles on all domain tables
  GRANT ALL ON TABLE "public"."domain_blacklist" TO "anon", "authenticated", "service_role";
  GRANT ALL ON TABLE "public"."domain_relationships" TO "anon", "authenticated", "service_role";
  GRANT ALL ON TABLE "public"."domain_roots" TO "anon", "authenticated", "service_role";
  GRANT ALL ON TABLE "public"."domain_urls" TO "anon", "authenticated", "service_role";
  GRANT ALL ON TABLE "public"."domain_whitelist" TO "anon", "authenticated", "service_role";
END
$$;

-- SECTION 11: Create triggers for new tables
DO $$
BEGIN
  -- Check if the function update_updated_at_column exists before creating triggers
  IF EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'update_updated_at_column' 
    AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    -- Create update_domain_relationships_timestamp trigger if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger 
      WHERE tgname = 'update_domain_relationships_timestamp'
      AND tgrelid = 'public.domain_relationships'::regclass
    ) THEN
      CREATE TRIGGER update_domain_relationships_timestamp 
      BEFORE UPDATE ON public.domain_relationships 
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    END IF;

    -- Create update_domain_urls_timestamp trigger if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger 
      WHERE tgname = 'update_domain_urls_timestamp'
      AND tgrelid = 'public.domain_urls'::regclass
    ) THEN
      CREATE TRIGGER update_domain_urls_timestamp 
      BEFORE UPDATE ON public.domain_urls 
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
  ELSE
    RAISE NOTICE 'Function update_updated_at_column does not exist - skipping trigger creation';
  END IF;
END
$$;