ALTER TABLE companies
ADD COLUMN job_url text;

ALTER TABLE jobs
RENAME COLUMN employment_details to employment_type;