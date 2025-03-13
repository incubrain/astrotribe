
ALTER TABLE jobs ADD COLUMN employment_type_text TEXT;

UPDATE jobs 
SET employment_type_text = employment_type #>> '{}';

ALTER TABLE jobs DROP COLUMN employment_type;

ALTER TABLE jobs RENAME COLUMN employment_type_text TO employment_type;

CREATE VIEW job_filters AS
SELECT DISTINCT j.location,
  c.name AS company_name,
  j.company_id,
  j.employment_type
  FROM jobs j
    INNER JOIN companies c ON c.id = j.company_id
ORDER BY c.name, j.company_id, j.location, j.employment_type;

-- Change the owner of the view to "postgres"
ALTER VIEW public.job_filters OWNER TO postgres;

-- Grants for "authenticated" role
GRANT DELETE ON public.job_filters TO authenticated;
GRANT INSERT ON public.job_filters TO authenticated;
GRANT REFERENCES ON public.job_filters TO authenticated;
GRANT SELECT ON public.job_filters TO authenticated;
GRANT TRUNCATE ON public.job_filters TO authenticated;
GRANT UPDATE ON public.job_filters TO authenticated;

-- Grants for "authenticator" role
GRANT UPDATE ON public.job_filters TO authenticator;

-- Grants for "service_role"
GRANT DELETE ON public.job_filters TO service_role;
GRANT INSERT ON public.job_filters TO service_role;
GRANT REFERENCES ON public.job_filters TO service_role;
GRANT SELECT ON public.job_filters TO service_role;
GRANT TRUNCATE ON public.job_filters TO service_role;
GRANT UPDATE ON public.job_filters TO service_role;

-- Grants for "supabase_auth_admin"
GRANT DELETE ON public.job_filters TO supabase_auth_admin;
GRANT INSERT ON public.job_filters TO supabase_auth_admin;
GRANT REFERENCES ON public.job_filters TO supabase_auth_admin;
GRANT SELECT ON public.job_filters TO supabase_auth_admin;
GRANT TRUNCATE ON public.job_filters TO supabase_auth_admin;
GRANT UPDATE ON public.job_filters TO supabase_auth_admin;
