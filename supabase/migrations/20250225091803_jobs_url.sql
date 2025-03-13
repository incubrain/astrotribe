ALTER TABLE public.companies
ADD COLUMN job_url text;

ALTER TABLE public.jobs
RENAME COLUMN employment_details to employment_type;