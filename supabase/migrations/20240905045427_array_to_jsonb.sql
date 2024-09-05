ALTER TABLE public.companies ADD COLUMN keywords_jsonb jsonb;
UPDATE public.companies SET keywords_jsonb = COALESCE(to_jsonb(keywords), '[]'::jsonb);
ALTER TABLE public.companies DROP COLUMN keywords;
ALTER TABLE public.companies RENAME COLUMN keywords_jsonb TO keywords;

-- For news table
ALTER TABLE public.news ADD COLUMN keywords_jsonb jsonb;
UPDATE public.news SET keywords_jsonb = COALESCE(to_jsonb(keywords), '[]'::jsonb);
ALTER TABLE public.news DROP COLUMN keywords;
ALTER TABLE public.news RENAME COLUMN keywords_jsonb TO keywords;

-- For research table
ALTER TABLE public.research ADD COLUMN affiliations_jsonb jsonb;
UPDATE public.research SET affiliations_jsonb = COALESCE(to_jsonb(affiliations), '[]'::jsonb);
ALTER TABLE public.research DROP COLUMN affiliations;
ALTER TABLE public.research RENAME COLUMN affiliations_jsonb TO affiliations;

-- For role_permissions table
ALTER TABLE public.role_permissions ADD COLUMN permissions_jsonb jsonb;
UPDATE public.role_permissions SET permissions_jsonb = COALESCE(to_jsonb(permissions), '[]'::jsonb);
ALTER TABLE public.role_permissions DROP COLUMN permissions;
ALTER TABLE public.role_permissions RENAME COLUMN permissions_jsonb TO permissions;