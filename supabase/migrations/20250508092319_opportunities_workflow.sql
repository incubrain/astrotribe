-- Create type if not exists (more fault tolerant)
DO $$ BEGIN
    CREATE TYPE public.remote_status AS ENUM ('on_site', 'remote', 'hybrid', 'unknown');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS update_jobs_timestamp ON public.jobs;

-- Revoke all privileges for anon, authenticated, service_role
REVOKE ALL PRIVILEGES ON TABLE public.jobs FROM anon, authenticated, service_role;

-- Drop constraints + view + indexes + table (use CASCADE to avoid index drops separately)
ALTER TABLE public.jobs
  DROP CONSTRAINT IF EXISTS jobs_company_id_fkey,
  DROP CONSTRAINT IF EXISTS jobs_content_source_id_fkey,
  DROP CONSTRAINT IF EXISTS jobs_contents_id_fkey,
  DROP CONSTRAINT IF EXISTS jobs_url_hash_key,
  DROP CONSTRAINT IF EXISTS jobs_pkey
  CASCADE;

ALTER TABLE public.content_sources DROP CONSTRAINT IF EXISTS content_sources_parser_type_check CASCADE;
ALTER TABLE public.domain_urls DROP CONSTRAINT IF EXISTS domain_urls_domain_root_id_fkey CASCADE;

DROP VIEW IF EXISTS public.job_filters;

DROP TABLE IF EXISTS public.jobs CASCADE;

-- Create new opportunities table
CREATE TABLE public.opportunities (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    contents_id uuid NOT NULL UNIQUE,
    title text NOT NULL,
    company_id uuid,
    location text,
    description text,
    expires_at timestamptz,
    checked_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT current_timestamp,
    content_status public.content_status NOT NULL DEFAULT 'draft',
    url text NOT NULL,
    metadata jsonb,
    employment_type text,
    source_id uuid,
    uri text UNIQUE,
    requirements jsonb DEFAULT '[]',
    benefits jsonb DEFAULT '[]',
    application_url text,
    change_hash text,
    removed_at timestamptz,
    published_at timestamptz,
    remote_status public.remote_status NOT NULL DEFAULT 'on_site'
);

-- Adjust content_sources
ALTER TABLE public.content_sources DROP COLUMN IF EXISTS last_scraped_at;
ALTER TABLE public.content_sources ADD COLUMN IF NOT EXISTS scraped_at timestamptz;

-- Enforce onboarding completed
ALTER TABLE public.user_profiles
  ALTER COLUMN onboarding_completed SET DEFAULT true,
  ALTER COLUMN onboarding_completed SET NOT NULL;

-- Add FK constraints (use NOT VALID to defer validation)
ALTER TABLE public.opportunities ADD CONSTRAINT opportunities_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) NOT VALID;
ALTER TABLE public.opportunities VALIDATE CONSTRAINT opportunities_company_id_fkey;

ALTER TABLE public.opportunities ADD CONSTRAINT opportunities_contents_id_fkey FOREIGN KEY (contents_id) REFERENCES public.contents(id) NOT VALID;
ALTER TABLE public.opportunities VALIDATE CONSTRAINT opportunities_contents_id_fkey;

ALTER TABLE public.opportunities ADD CONSTRAINT opportunities_source_id_fkey FOREIGN KEY (source_id) REFERENCES public.content_sources(id) ON DELETE CASCADE NOT VALID;
ALTER TABLE public.opportunities VALIDATE CONSTRAINT opportunities_source_id_fkey;

-- Parser type enum constraint
ALTER TABLE public.content_sources ADD CONSTRAINT content_sources_parser_type_check CHECK ((parser_type = ANY (ARRAY['rss','atom','rdf','cheerio','podcast','youtube','playwright']))) NOT VALID;
ALTER TABLE public.content_sources VALIDATE CONSTRAINT content_sources_parser_type_check;

-- Domain urls FK
ALTER TABLE public.domain_urls ADD CONSTRAINT domain_urls_domain_root_id_fkey FOREIGN KEY (domain_root_id) REFERENCES public.domain_roots(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
ALTER TABLE public.domain_urls VALIDATE CONSTRAINT domain_urls_domain_root_id_fkey;

-- Add required indexes
CREATE INDEX IF NOT EXISTS opportunities_company_id_idx ON public.opportunities (company_id);
CREATE INDEX IF NOT EXISTS opportunities_content_status_idx ON public.opportunities (content_status);

-- Create view
CREATE OR REPLACE VIEW public.job_filters AS
SELECT DISTINCT j.location, c.name AS company_name, j.company_id, j.employment_type
FROM public.opportunities j
JOIN public.companies c ON c.id = j.company_id
ORDER BY c.name, j.company_id, j.location, j.employment_type;

-- Grant privileges
GRANT ALL PRIVILEGES ON TABLE public.opportunities TO anon, authenticated, service_role;

-- Triggers
CREATE TRIGGER update_addresses_timestamp BEFORE UPDATE ON public.addresses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_opportunities_timestamp BEFORE UPDATE ON public.opportunities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

drop view if exists "public"."job_filters";

alter table "public"."contents" drop column "hash";

create or replace view "public"."job_filters" as  SELECT DISTINCT j.location,
    c.name AS company_name,
    j.company_id,
    j.employment_type
   FROM (public.opportunities j
     JOIN public.companies c ON ((c.id = j.company_id)))
  ORDER BY c.name, j.company_id, j.location, j.employment_type;


-- Needed for directional link analysis
CREATE INDEX IF NOT EXISTS idx_dr_source_url ON public.domain_relationships(source_url_id);
CREATE INDEX IF NOT EXISTS idx_dr_target_url ON public.domain_relationships(target_url_id);

-- Needed for domain-level aggregation
CREATE INDEX IF NOT EXISTS idx_dr_source_domain ON public.domain_relationships(source_domain_root_id);
CREATE INDEX IF NOT EXISTS idx_dr_target_domain ON public.domain_relationships(target_domain_root_id);

-- If you're querying recent relationships
CREATE INDEX IF NOT EXISTS idx_dr_created_at ON public.domain_relationships(created_at DESC);
