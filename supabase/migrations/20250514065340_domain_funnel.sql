-- ============================================
-- MIGRATION: Content and Domain Restructuring
-- ============================================

-- Ensure migration runs only once
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'news'
    ) THEN
        RAISE EXCEPTION 'Migration appears to have already been applied';
    END IF;
END $$;

-- ============================================
-- 1. PREPARATION - DROP PHASE
-- ============================================

-- Revoke all permissions for domain_url_processing_history
DO $$
DECLARE
    role_name text;
BEGIN
    FOREACH role_name IN ARRAY ARRAY['anon', 'authenticated', 'service_role']
    LOOP
        EXECUTE format('REVOKE ALL ON TABLE public.domain_url_processing_history FROM %I', role_name);
    END LOOP;
END $$;

DROP VIEW IF EXISTS public.job_filters;

-- Drop non-table constraints first
ALTER TABLE public.contents DROP CONSTRAINT IF EXISTS contents_url_key;
ALTER TABLE public.opportunities DROP CONSTRAINT IF EXISTS opportunities_contents_id_fkey;
ALTER TABLE public.opportunities DROP CONSTRAINT IF EXISTS opportunities_contents_id_key;
ALTER TABLE public.content_sources DROP CONSTRAINT IF EXISTS content_sources_parser_type_check;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'domain_relationships') THEN
    ALTER TABLE public.domain_relationships DROP CONSTRAINT IF EXISTS domain_relationships_source_domain_root_id_fkey;
    ALTER TABLE public.domain_relationships DROP CONSTRAINT IF EXISTS domain_relationships_source_url_id_target_url_id_key;
    ALTER TABLE public.domain_relationships DROP CONSTRAINT IF EXISTS domain_relationships_target_domain_root_id_fkey;
    ALTER TABLE public.domain_relationships DROP CONSTRAINT IF EXISTS domain_relationships_source_url_id_fkey;
    ALTER TABLE public.domain_relationships DROP CONSTRAINT IF EXISTS domain_relationships_target_url_id_fkey;
  END IF;
END $$;



-- Drop indexes that aren't tied to constraints
DROP INDEX IF EXISTS public.contents_url_key;
DROP INDEX IF EXISTS public.domain_relationships_source_url_id_target_url_id_key;
DROP INDEX IF EXISTS public.idx_companies_content_status;
DROP INDEX IF EXISTS public.opportunities_content_status_idx;
DROP INDEX IF EXISTS public.idx_contents_details;
DROP INDEX IF EXISTS public.idx_domain_relationships_source_company;
DROP INDEX IF EXISTS public.idx_dr_created_at;
DROP INDEX IF EXISTS public.idx_dr_source_domain;
DROP INDEX IF EXISTS public.idx_dr_source_url;
DROP INDEX IF EXISTS public.idx_dr_target_domain;
DROP INDEX IF EXISTS public.idx_dr_target_url;
DROP INDEX IF EXISTS public.opportunities_contents_id_key;

-- Drop table with CASCADE to automatically handle related constraints and indexes
DROP TABLE IF EXISTS public.domain_url_processing_history CASCADE;
DROP TABLE IF EXISTS public.domain_relationships CASCADE;

-- ============================================
-- 2. ENUM MIGRATION
-- ============================================

-- Migrate content_status enum
ALTER TABLE public.companies ALTER COLUMN content_status DROP DEFAULT;
ALTER TABLE public.opportunities ALTER COLUMN content_status DROP DEFAULT;
ALTER TABLE public.newsletters ALTER COLUMN content_status DROP DEFAULT;

-- Create new enum
ALTER TYPE public.content_status RENAME TO content_status__old_version_to_be_dropped;
CREATE TYPE public.content_status AS ENUM (
  'pending_crawl', 'scraped', 'processing', 'indexing', 
  'pending_review', 'irrelevant', 'retracted', 'draft', 
  'scheduled', 'published', 'archived', 'failed', 'flagged', 'unpublished', 'crawled'
);

-- Update tables to use new enum
ALTER TABLE public.companies 
  ALTER COLUMN content_status TYPE public.content_status 
  USING content_status::text::public.content_status;
  
ALTER TABLE public.opportunities 
  ALTER COLUMN content_status TYPE public.content_status 
  USING content_status::text::public.content_status;
  
ALTER TABLE public.newsletters 
  ALTER COLUMN content_status TYPE public.content_status 
  USING content_status::text::public.content_status;

-- Drop old enum
DROP TYPE public.content_status__old_version_to_be_dropped;

-- Make content_status nullable in companies
ALTER TABLE public.companies ALTER COLUMN content_status DROP NOT NULL;

-- ============================================
-- 3. MODIFY EXISTING TABLES
-- ============================================

-- Modify companies table
ALTER TABLE public.companies DROP COLUMN IF EXISTS keywords;

-- Modify contents table
ALTER TABLE public.contents 
  DROP COLUMN IF EXISTS author,
  DROP COLUMN IF EXISTS details,
  DROP COLUMN IF EXISTS featured_image,
  DROP COLUMN IF EXISTS is_active,
  DROP COLUMN IF EXISTS summary,
  ADD COLUMN uri text,
  ADD COLUMN content_status public.content_status DEFAULT 'scraped';

-- Create URL+URI unique constraint
CREATE UNIQUE INDEX contents_url_uri_unique ON public.contents USING btree (url, uri);
ALTER TABLE public.contents ADD CONSTRAINT contents_url_uri_unique UNIQUE USING INDEX contents_url_uri_unique;

-- Modify domain_relationships table

CREATE TABLE IF NOT EXISTS public.domain_relationships (
  id uuid NOT NULL DEFAULT extensions.gen_random_uuid(),
  source_company_id uuid NOT NULL,
  source_url_id uuid,
  target_url_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  target_company_id uuid NOT NULL
);

-- Create unique constraint on source/target company
CREATE UNIQUE INDEX domain_relationships_source_company_id_target_company_id_key 
  ON public.domain_relationships USING btree (source_company_id, target_company_id);
ALTER TABLE public.domain_relationships 
  ADD CONSTRAINT domain_relationships_source_company_id_target_company_id_key 
  UNIQUE USING INDEX domain_relationships_source_company_id_target_company_id_key;

-- Add foreign key constraint
ALTER TABLE public.domain_relationships 
  ADD CONSTRAINT domain_relationships_target_company_id_fkey 
  FOREIGN KEY (target_company_id) REFERENCES public.companies(id) ON DELETE CASCADE;

-- Modify domain_roots table
ALTER TABLE public.domain_roots 
  DROP COLUMN IF EXISTS is_crawled,
  ADD COLUMN has_crawled boolean DEFAULT false;

-- Modify opportunities table
ALTER TABLE public.opportunities 
  DROP COLUMN IF EXISTS contents_id,
  ADD COLUMN content_id uuid NOT NULL,
  ADD COLUMN featured boolean NOT NULL DEFAULT false;

-- Add foreign key constraint
ALTER TABLE public.opportunities 
  ADD CONSTRAINT opportunities_content_id_fkey 
  FOREIGN KEY (content_id) REFERENCES public.contents(id) ON DELETE CASCADE;

-- ============================================
-- 4. CREATE NEW TABLES WITH CONSTRAINTS & INDEXES
-- ============================================

-- Content Categories Table
CREATE TABLE public.content_categories (
    content_id uuid NOT NULL REFERENCES public.contents(id) ON DELETE CASCADE,
    category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    role text NOT NULL CHECK (role IN (
        'primary', 'secondary', 'inferred', 'editorial',
        'sponsored', 'archival', 'suppressed', 'test'
    )),
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (content_id, category_id, role)
);

CREATE INDEX content_categories_category_id_idx ON public.content_categories(category_id);
CREATE INDEX content_categories_role_idx ON public.content_categories(role);
COMMENT ON TABLE public.content_categories IS 'Maps content to categories with relationship types';
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_categories TO anon, authenticated, service_role;

-- Crawl Stats Table
CREATE TABLE public.crawl_stats (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES public.companies(id),
    seed_url text NOT NULL,
    domain text NOT NULL,
    start_time timestamptz NOT NULL,
    end_time timestamptz,
    duration_ms bigint NOT NULL,
    total_urls integer NOT NULL DEFAULT 0,
    processed_urls integer NOT NULL DEFAULT 0,
    failed_urls integer NOT NULL DEFAULT 0,
    skipped_urls integer NOT NULL DEFAULT 0,
    pending_urls integer NOT NULL DEFAULT 0,
    batches_processed integer NOT NULL DEFAULT 0,
    fetches_completed integer NOT NULL DEFAULT 0,
    storage_time bigint NOT NULL DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_crawl_stats_company_id ON public.crawl_stats(company_id);
CREATE INDEX idx_crawl_stats_start_time ON public.crawl_stats(start_time);

CREATE TRIGGER update_crawl_stats_timestamp
BEFORE UPDATE ON public.crawl_stats
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.crawl_stats IS 'Tracks metrics for website crawling operations';
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crawl_stats TO anon, authenticated, service_role;

-- Domain Assets Table
CREATE TABLE public.domain_assets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_root_id uuid REFERENCES public.domain_roots(id),
    company_id uuid REFERENCES public.companies(id),
    url text NOT NULL,
    asset_type text CHECK (asset_type IN ('image', 'video', 'icon', 'embed')),
    asset_url text NOT NULL,
    usage text,
    crawl_id uuid,
    captured_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.domain_assets IS 'Tracks media assets found during web crawling';
GRANT SELECT, INSERT, UPDATE, DELETE ON public.domain_assets TO anon, authenticated, service_role;

-- Domain Contacts Table
CREATE TABLE public.domain_contacts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_root_id uuid REFERENCES public.domain_roots(id) ON DELETE CASCADE,
    company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
    url text NOT NULL,
    contact_type text CHECK (contact_type IN ('email', 'phone', 'social', 'messenger', 'unknown')),
    value text NOT NULL,
    confidence numeric DEFAULT 0.8,
    source_plugin text,
    crawl_id uuid,
    captured_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.domain_contacts IS 'Contact information extracted from websites';
GRANT SELECT, INSERT, UPDATE, DELETE ON public.domain_contacts TO anon, authenticated, service_role;

-- Domain Content Table
CREATE TABLE public.domain_content (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_root_id uuid NOT NULL REFERENCES public.domain_roots(id),
    company_id uuid NOT NULL REFERENCES public.companies(id),
    url text NOT NULL,
    content_type text CHECK (content_type IN (
        'opportunities', 'products', 'news', 'events', 'research', 'unknown'
    )),
    confidence numeric DEFAULT 0.8,
    source_plugin text,
    crawl_id uuid NOT NULL,
    captured_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.domain_content IS 'Content types identified during crawling';
GRANT SELECT, INSERT, UPDATE, DELETE ON public.domain_content TO anon, authenticated, service_role;

-- Domain Content Sources Table
CREATE TABLE public.domain_content_sources (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_root_id uuid REFERENCES public.domain_roots(id) ON DELETE CASCADE,
    company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
    url text NOT NULL,
    proposed_type text CHECK (proposed_type IN (
        'opportunities', 'products', 'news', 'events', 'research', 'unknown'
    )),
    confidence numeric DEFAULT 0.7 CHECK (confidence BETWEEN 0 AND 1),
    reason text,
    captured_at timestamptz DEFAULT now(),
    crawl_id uuid
);

COMMENT ON TABLE public.domain_content_sources IS 'Potential content sources found during crawling';
GRANT SELECT, INSERT, UPDATE, DELETE ON public.domain_content_sources TO anon, authenticated, service_role;

-- Domain Documents Table
CREATE TABLE public.domain_documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_root_id uuid REFERENCES public.domain_roots(id) ON DELETE CASCADE,
    company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
    url text NOT NULL,
    file_type text CHECK (file_type IN ('pdf', 'doc', 'ppt', 'xls', 'other')),
    file_url text NOT NULL,
    content_hash text,
    crawl_id uuid,
    captured_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.domain_documents IS 'Document files identified during crawling';
GRANT SELECT, INSERT, UPDATE, DELETE ON public.domain_documents TO anon, authenticated, service_role;

-- News Table
CREATE TABLE public.news (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id uuid NOT NULL REFERENCES public.contents(id) ON DELETE CASCADE,
    organization_id uuid REFERENCES public.companies(id),
    source_id uuid REFERENCES public.content_sources(id),
    title text NOT NULL,
    description text,
    url text NOT NULL CHECK (url ~* '^https?://'),
    author_name_fallback text,
    published_at timestamptz,
    featured_image text,
    news_type text CHECK (news_type IN ('article', 'podcast', 'video', 'press_release')),
    is_featured boolean DEFAULT false,
    is_active boolean DEFAULT true,
    primary_category_id uuid REFERENCES public.categories(id),
    content_text text,
    title_vector tsvector,
    language_code text CHECK (char_length(language_code) = 2),
    change_hash text,
    graph_migrated_at timestamptz,
    removed_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX news_content_id_idx ON public.news(content_id);
CREATE INDEX news_news_type_idx ON public.news(news_type);
CREATE INDEX news_organization_id_idx ON public.news(organization_id);
CREATE INDEX news_primary_category_id_idx ON public.news(primary_category_id);
CREATE INDEX news_published_at_idx ON public.news(published_at);
CREATE INDEX news_source_id_idx ON public.news(source_id);
CREATE INDEX news_title_vector_idx ON public.news USING gin(title_vector);

CREATE TRIGGER update_news_timestamp
BEFORE UPDATE ON public.news
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.news IS 'News articles and media from sources';
GRANT SELECT, INSERT, UPDATE, DELETE ON public.news TO anon, authenticated, service_role;

-- Research Table
CREATE TABLE public.research (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id uuid NOT NULL REFERENCES public.contents(id) ON DELETE CASCADE,
    organization_id uuid REFERENCES public.companies(id),
    source_id uuid REFERENCES public.content_sources(id),
    title text NOT NULL,
    abstract text,
    url text NOT NULL CHECK (url ~* '^https?://'),
    doi text,
    arxiv_id text,
    journal_name text,
    journal_ref text,
    published_at timestamptz,
    primary_category_id uuid REFERENCES public.categories(id),
    featured_image text,
    content_text text,
    is_open_access boolean DEFAULT false,
    is_peer_reviewed boolean DEFAULT true,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    title_vector tsvector,
    language_code text CHECK (char_length(language_code) = 2),
    change_hash text,
    graph_migrated_at timestamptz,
    removed_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX research_arxiv_id_idx ON public.research(arxiv_id);
CREATE INDEX research_content_id_idx ON public.research(content_id);
CREATE INDEX research_doi_idx ON public.research(doi);
CREATE INDEX research_organization_id_idx ON public.research(organization_id);
CREATE INDEX research_primary_category_id_idx ON public.research(primary_category_id);
CREATE INDEX research_published_at_idx ON public.research(published_at);
CREATE INDEX research_source_id_idx ON public.research(source_id);
CREATE INDEX research_title_vector_idx ON public.research USING gin(title_vector);

CREATE TRIGGER update_research_timestamp
BEFORE UPDATE ON public.research
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.research IS 'Research papers and academic publications';
GRANT SELECT, INSERT, UPDATE, DELETE ON public.research TO anon, authenticated, service_role;

-- 

-- Needed for directional link analysis
CREATE INDEX IF NOT EXISTS idx_dr_source_url ON public.domain_relationships(source_url_id);
CREATE INDEX IF NOT EXISTS idx_dr_target_url ON public.domain_relationships(target_url_id);

-- If you're querying recent relationships
CREATE INDEX IF NOT EXISTS idx_dr_created_at ON public.domain_relationships(created_at DESC);


-- ============================================
-- 5. RESTORE CONSTRAINTS ON EXISTING TABLES
-- ============================================

-- Re-add content_sources parser_type constraint
ALTER TABLE public.content_sources 
  ADD CONSTRAINT content_sources_parser_type_check 
  CHECK (parser_type IN (
    'rss', 'atom', 'rdf', 'cheerio', 'podcast', 'youtube', 'playwright', 'firecrawl'
  ));

-- Re-add domain_relationships constraints
ALTER TABLE public.domain_relationships 
  ADD CONSTRAINT domain_relationships_source_url_id_fkey 
  FOREIGN KEY (source_url_id) REFERENCES public.domain_urls(id) ON DELETE CASCADE;

ALTER TABLE public.domain_relationships 
  ADD CONSTRAINT domain_relationships_target_url_id_fkey 
  FOREIGN KEY (target_url_id) REFERENCES public.domain_urls(id) ON DELETE CASCADE;

-- ============================================
-- 6. VIEWS & FUNCTIONS
-- ============================================

-- Recreate job_filters view
CREATE OR REPLACE VIEW public.job_filters AS
SELECT DISTINCT
  j.location,
  c.name AS company_name,
  j.company_id,
  j.employment_type
FROM public.opportunities j
JOIN public.companies c ON c.id = j.company_id
ORDER BY c.name, j.company_id, j.location, j.employment_type;

-- Function to determine if site should be rescraped
CREATE OR REPLACE FUNCTION public.should_rescrape(
  frequency text, 
  last_scraped timestamp with time zone, 
  reference_time timestamp with time zone DEFAULT now()
)
RETURNS boolean
LANGUAGE sql
AS $function$
  select
    last_scraped is null
    or (
      frequency = 'four_times_daily' and last_scraped < reference_time - interval '6 hours'
      or frequency = 'twice_daily'    and last_scraped < reference_time - interval '12 hours'
      or frequency = 'daily'          and last_scraped < reference_time - interval '1 day'
      or frequency = 'twice_weekly'   and last_scraped < reference_time - interval '3 days'
      or frequency = 'weekly'         and last_scraped < reference_time - interval '7 days'
      or frequency = 'bi_weekly'      and last_scraped < reference_time - interval '14 days'
      or frequency = 'monthly'        and last_scraped < reference_time - interval '1 month'
      or frequency = 'quarterly'      and last_scraped < reference_time - interval '3 months'
      or frequency = 'biannual'       and last_scraped < reference_time - interval '6 months'
      or frequency = 'annually'       and last_scraped < reference_time - interval '1 year'
      or frequency = 'never'
    )
$function$;

-- Function to find sites to crawl
CREATE OR REPLACE FUNCTION public.get_sites_to_crawl(fetch_limit integer)
RETURNS SETOF public.companies
LANGUAGE sql
AS $function$
  SELECT *
  FROM public.companies c
  WHERE
    c.url IS NOT NULL
    AND c.url != ''
    AND (c.content_status IS NULL OR c.content_status != 'pending_crawl')
    AND public.should_rescrape(c.scrape_frequency::text, c.scraped_at::timestamp with time zone, now()::timestamp with time zone)
  ORDER BY COALESCE(c.scraped_at, '1970-01-01'::timestamp) ASC
  LIMIT fetch_limit
$function$;

-- Webhook determination function
CREATE OR REPLACE FUNCTION public.should_send_webhook(
  table_name text,
  operation text,
  old_record record,
  new_record record
)
RETURNS boolean
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Logic for contents table
  IF table_name = 'contents' THEN
    IF operation = 'INSERT' THEN
      IF new_record.content_status = 'scraped' THEN
        RETURN TRUE;
      END IF;
    ELSIF operation = 'UPDATE' THEN
      IF old_record IS NULL THEN
        RETURN FALSE; -- safety check
      END IF;

      -- Trigger if URI changes
      IF old_record.uri IS DISTINCT FROM new_record.uri THEN
        RETURN TRUE;
      END IF;

      -- Trigger if status becomes scraped
      IF old_record.content_status IS DISTINCT FROM new_record.content_status
         AND new_record.content_status = 'scraped' THEN
        RETURN TRUE;
      END IF;
    END IF;

  -- Logic for articles table
  ELSIF table_name = 'articles' THEN
    IF operation = 'INSERT' THEN
      RETURN TRUE;
    ELSIF operation = 'UPDATE' THEN
      IF old_record IS NULL THEN
        RETURN FALSE;
      END IF;

      IF old_record.content IS DISTINCT FROM new_record.content THEN
        RETURN TRUE;
      END IF;
    END IF;

  -- Logic for documents table
  ELSIF table_name = 'documents' THEN
    IF operation = 'UPDATE' THEN
      IF old_record IS NULL THEN
        RETURN FALSE;
      END IF;

      IF old_record.status != 'processed' AND new_record.status = 'processed' THEN
        RETURN TRUE;
      END IF;
    END IF;
  END IF;

  -- Default: don't send webhook
  RETURN FALSE;
END;
$function$;

-- Company relationships function
CREATE OR REPLACE FUNCTION public.compute_company_relationships()
RETURNS void AS $$
BEGIN
  INSERT INTO public.domain_relationships (
    source_company_id,
    target_company_id,
    source_url_id,
    target_url_id,
    created_at,
    updated_at
  )
  SELECT
    source.company_id AS source_company_id,
    target_comp.id AS target_company_id,
    source.id AS source_url_id,
    target.id AS target_url_id,
    NOW(), NOW()
  FROM public.domain_urls source
  JOIN public.domain_urls target ON source.id <> target.id
  JOIN public.companies target_comp
    ON POSITION(target_comp.url IN target.url) > 0
  WHERE source.company_id IS NOT NULL
    AND target_comp.id IS DISTINCT FROM source.company_id
    AND target.company_id IS NOT NULL
  ON CONFLICT (source_company_id, target_company_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7. SCHEDULED JOBS
-- ============================================

DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM cron.job 
    WHERE command = 'CALL public.compute_company_relationships()'
  ) THEN
    PERFORM cron.schedule(
      'call_public_compute_company_relationships',
      '30 2 * * *',
      'CALL public.compute_company_relationships()'
    );
  END IF;
END $$;

-- ============================================
-- 8. VALIDATION & COMPLETION
-- ============================================

-- Verify critical objects exist
DO $$
DECLARE
  missing_objects text := '';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'news') THEN
    missing_objects := missing_objects || 'news table, ';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'research') THEN
    missing_objects := missing_objects || 'research table, ';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'content_categories') THEN
    missing_objects := missing_objects || 'content_categories table, ';
  END IF;
  
  IF missing_objects <> '' THEN
    RAISE WARNING 'Migration incomplete. Missing objects: %', missing_objects;
  ELSE
    RAISE NOTICE 'Migration completed successfully at %', NOW();
  END IF;
END $$;
