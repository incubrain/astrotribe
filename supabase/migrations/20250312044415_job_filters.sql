
ALTER TABLE jobs ADD COLUMN employment_type_text TEXT;

UPDATE jobs 
SET employment_type_text = employment_type #>> '{}';

ALTER TABLE jobs DROP COLUMN employment_type;

CREATE VIEW job_filters AS
SELECT DISTINCT j.location,
  c.name AS company_name,
  j.employment_type
  FROM jobs j
    JOIN companies c ON c.id = j.company_id
ORDER BY c.name, j.location, j.employment_type;
ALTER TABLE jobs RENAME COLUMN employment_type_text TO employment_type;