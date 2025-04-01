-- =========================================
-- STEP 1: CREATE MAPPING TABLES & PREPARE COLUMNS
-- =========================================
BEGIN;

-- Categories mapping
CREATE TEMPORARY TABLE category_id_mapping AS
SELECT 
  id AS old_id_int,
  gen_random_uuid() AS new_id_uuid
FROM public.categories;

-- Addresses mapping
CREATE TEMPORARY TABLE address_id_mapping AS
SELECT 
  id AS old_id_int,
  gen_random_uuid() AS new_id_uuid
FROM public.addresses;

-- Social media mapping
CREATE TEMPORARY TABLE social_media_id_mapping AS
SELECT 
  id AS old_id_int,
  gen_random_uuid() AS new_id_uuid
FROM public.social_media;

-- Add new UUID columns
ALTER TABLE public.categories ADD COLUMN id_uuid uuid DEFAULT gen_random_uuid() NOT NULL;
ALTER TABLE public.addresses ADD COLUMN id_uuid uuid DEFAULT gen_random_uuid() NOT NULL;
ALTER TABLE public.social_media ADD COLUMN id_uuid uuid DEFAULT gen_random_uuid() NOT NULL;

-- Add new UUID columns to referencing tables
ALTER TABLE public.feed_categories ADD COLUMN category_id_uuid uuid;
ALTER TABLE public.companies ADD COLUMN social_media_id_uuid uuid;

-- Check if user_profiles has social_media_id and add UUID column if needed
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'social_media_id'
  ) THEN
    EXECUTE 'ALTER TABLE public.user_profiles ADD COLUMN social_media_id_uuid uuid';
  END IF;
END $$;

COMMIT;

-- =========================================
-- STEP 2: POPULATE UUID COLUMNS
-- =========================================
BEGIN;

-- Populate UUID columns in primary tables
UPDATE public.categories c
SET id_uuid = cm.new_id_uuid
FROM category_id_mapping cm
WHERE c.id = cm.old_id_int;

UPDATE public.addresses a
SET id_uuid = am.new_id_uuid
FROM address_id_mapping am
WHERE a.id = am.old_id_int;

UPDATE public.social_media sm
SET id_uuid = m.new_id_uuid
FROM social_media_id_mapping m
WHERE sm.id = m.old_id_int;

-- Populate UUID columns in referencing tables (using text cast to avoid type errors)
UPDATE public.feed_categories fc
SET category_id_uuid = cm.new_id_uuid
FROM category_id_mapping cm
WHERE fc.category_id::text = cm.old_id_int::text;

UPDATE public.companies c
SET social_media_id_uuid = m.new_id_uuid
FROM social_media_id_mapping m
WHERE c.social_media_id::text = m.old_id_int::text;

-- Update user_profiles if it has social_media_id
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'social_media_id'
    AND column_name = 'social_media_id_uuid'
  ) THEN
    EXECUTE '
      UPDATE public.user_profiles up
      SET social_media_id_uuid = m.new_id_uuid
      FROM social_media_id_mapping m
      WHERE up.social_media_id::text = m.old_id_int::text';
  END IF;
END $$;

COMMIT;

-- =========================================
-- STEP 3: DROP ALL CONSTRAINTS
-- =========================================
BEGIN;

-- Drop foreign key constraints
ALTER TABLE public.feed_categories DROP CONSTRAINT IF EXISTS fk_feed_categories_categories;
ALTER TABLE public.companies DROP CONSTRAINT IF EXISTS companies_social_media_id_fkey;

-- Drop other constraints referencing these tables
DO $$
DECLARE
  r RECORD;
BEGIN
  -- Find and drop all foreign keys referencing categories
  FOR r IN (
    SELECT 
      tc.constraint_name,
      tc.table_schema,
      tc.table_name
    FROM 
      information_schema.table_constraints tc
      JOIN information_schema.constraint_column_usage ccu 
        ON tc.constraint_catalog = ccu.constraint_catalog 
        AND tc.constraint_schema = ccu.constraint_schema
        AND tc.constraint_name = ccu.constraint_name
    WHERE 
      tc.constraint_type = 'FOREIGN KEY' 
      AND ccu.table_schema = 'public'
      AND ccu.table_name = 'categories'
  ) LOOP
    EXECUTE format('ALTER TABLE %I.%I DROP CONSTRAINT IF EXISTS %I', 
      r.table_schema, r.table_name, r.constraint_name);
  END LOOP;
  
  -- Find and drop all foreign keys referencing addresses
  FOR r IN (
    SELECT 
      tc.constraint_name,
      tc.table_schema,
      tc.table_name
    FROM 
      information_schema.table_constraints tc
      JOIN information_schema.constraint_column_usage ccu 
        ON tc.constraint_catalog = ccu.constraint_catalog 
        AND tc.constraint_schema = ccu.constraint_schema
        AND tc.constraint_name = ccu.constraint_name
    WHERE 
      tc.constraint_type = 'FOREIGN KEY' 
      AND ccu.table_schema = 'public'
      AND ccu.table_name = 'addresses'
  ) LOOP
    EXECUTE format('ALTER TABLE %I.%I DROP CONSTRAINT IF EXISTS %I', 
      r.table_schema, r.table_name, r.constraint_name);
  END LOOP;
  
  -- Find and drop all foreign keys referencing social_media
  FOR r IN (
    SELECT 
      tc.constraint_name,
      tc.table_schema,
      tc.table_name
    FROM 
      information_schema.table_constraints tc
      JOIN information_schema.constraint_column_usage ccu 
        ON tc.constraint_catalog = ccu.constraint_catalog 
        AND tc.constraint_schema = ccu.constraint_schema
        AND tc.constraint_name = ccu.constraint_name
    WHERE 
      tc.constraint_type = 'FOREIGN KEY' 
      AND ccu.table_schema = 'public'
      AND ccu.table_name = 'social_media'
  ) LOOP
    EXECUTE format('ALTER TABLE %I.%I DROP CONSTRAINT IF EXISTS %I', 
      r.table_schema, r.table_name, r.constraint_name);
  END LOOP;
END $$;

-- Drop primary key constraints last
ALTER TABLE public.categories DROP CONSTRAINT IF EXISTS categories_pkey;
ALTER TABLE public.addresses DROP CONSTRAINT IF EXISTS addresses_pkey;
ALTER TABLE public.social_media DROP CONSTRAINT IF EXISTS social_media_pkey;

COMMIT;

-- =========================================
-- STEP 4: RENAME COLUMNS AND ADD NEW PKs
-- =========================================
BEGIN;

-- Rename columns in primary tables
ALTER TABLE public.categories RENAME COLUMN id TO id_old;
ALTER TABLE public.categories RENAME COLUMN id_uuid TO id;

ALTER TABLE public.addresses RENAME COLUMN id TO id_old;
ALTER TABLE public.addresses RENAME COLUMN id_uuid TO id;

ALTER TABLE public.social_media RENAME COLUMN id TO id_old;
ALTER TABLE public.social_media RENAME COLUMN id_uuid TO id;

-- Rename columns in referencing tables
ALTER TABLE public.feed_categories RENAME COLUMN category_id TO category_id_old;
ALTER TABLE public.feed_categories RENAME COLUMN category_id_uuid TO category_id;

ALTER TABLE public.companies RENAME COLUMN social_media_id TO social_media_id_old;
ALTER TABLE public.companies RENAME COLUMN social_media_id_uuid TO social_media_id;

-- Rename in user_profiles if applicable
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'social_media_id_uuid'
  ) THEN
    EXECUTE 'ALTER TABLE public.user_profiles RENAME COLUMN social_media_id TO social_media_id_old';
    EXECUTE 'ALTER TABLE public.user_profiles RENAME COLUMN social_media_id_uuid TO social_media_id';
  END IF;
END $$;

-- Add new primary keys
ALTER TABLE public.categories ADD PRIMARY KEY (id);
ALTER TABLE public.addresses ADD PRIMARY KEY (id);
ALTER TABLE public.social_media ADD PRIMARY KEY (id);

COMMIT;

-- =========================================
-- STEP 5: ADD NEW FOREIGN KEY CONSTRAINTS
-- =========================================
BEGIN;

-- Add foreign key constraints with UUID columns
ALTER TABLE public.feed_categories 
ADD CONSTRAINT fk_feed_categories_categories
FOREIGN KEY (category_id) REFERENCES public.categories(id);

ALTER TABLE public.companies 
ADD CONSTRAINT companies_social_media_id_fkey 
FOREIGN KEY (social_media_id) REFERENCES public.social_media(id);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'social_media_id'
  ) THEN
    EXECUTE 'ALTER TABLE public.user_profiles 
             ADD CONSTRAINT user_profiles_social_media_id_fkey 
             FOREIGN KEY (social_media_id) REFERENCES public.social_media(id)';
  END IF;
END $$;

-- Reconstruct any other foreign keys that were dropped
-- This would need to be customized for your specific constraints

COMMIT;

-- =========================================
-- STEP 6: PRIORITY ENUM MIGRATION
-- =========================================
BEGIN;

-- Step 1: Create a temporary table to map current priority values to the new enum
CREATE TEMPORARY TABLE priority_mapping AS 
SELECT
  1 AS old_priority, 'very_low' AS new_priority
UNION SELECT
  2, 'low'
UNION SELECT
  3, 'medium'
UNION SELECT
  4, 'high'
UNION SELECT
  5, 'critical';

-- Step 2: Drop the existing constraint and index
ALTER TABLE public.categorized_urls DROP CONSTRAINT IF EXISTS valid_priority;
DROP INDEX IF EXISTS public.idx_categorized_urls_priority;

-- Step 3: Add a new column of the enum type
ALTER TABLE public.categorized_urls
ADD COLUMN new_priority public.priority;

-- Step 4: Update the new column with the corresponding enum values
UPDATE public.categorized_urls cu
SET new_priority = pm.new_priority::public.priority
FROM priority_mapping pm
WHERE cu.priority = pm.old_priority;

-- Handle any unmapped values (fallback to medium)
UPDATE public.categorized_urls
SET new_priority = 'medium'::public.priority
WHERE new_priority IS NULL;

-- Step 5: Drop the old column and rename the new one
ALTER TABLE public.categorized_urls
DROP COLUMN priority;

ALTER TABLE public.categorized_urls
RENAME COLUMN new_priority TO priority;

-- Step 6: Make the column NOT NULL if it was before
ALTER TABLE public.categorized_urls
ALTER COLUMN priority SET NOT NULL;

-- Add trigger for timestamp updates
CREATE OR REPLACE TRIGGER update_categorized_urls_timestamp 
  BEFORE UPDATE ON public.categorized_urls 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

COMMIT;

-- =========================================
-- STEP 7: CREATE JUNCTION TABLES
-- =========================================
BEGIN;

-- Create new junction tables
CREATE TABLE public.user_categories (
    user_id uuid NOT NULL,
    category_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.user_features (
    user_id uuid NOT NULL,
    feature_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.user_tags (
    user_id uuid NOT NULL,
    tag_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Add remaining columns to user_profiles
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS newsletter_opt_in boolean DEFAULT false;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS primary_address_id uuid;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS user_type text;

-- Create indices
CREATE INDEX idx_user_categories_category_id ON public.user_categories USING btree (category_id);
CREATE INDEX idx_user_categories_user_id ON public.user_categories USING btree (user_id);
CREATE INDEX idx_user_features_feature_id ON public.user_features USING btree (feature_id);
CREATE INDEX idx_user_features_user_id ON public.user_features USING btree (user_id);
CREATE INDEX idx_user_tags_tag_id ON public.user_tags USING btree (tag_id);
CREATE INDEX idx_user_tags_user_id ON public.user_tags USING btree (user_id);

CREATE UNIQUE INDEX user_categories_pkey ON public.user_categories USING btree (user_id, category_id);
CREATE UNIQUE INDEX user_features_pkey ON public.user_features USING btree (user_id, feature_id);
CREATE UNIQUE INDEX user_tags_pkey ON public.user_tags USING btree (user_id, tag_id);

-- Add primary key constraints
ALTER TABLE public.user_categories ADD CONSTRAINT user_categories_pkey PRIMARY KEY USING INDEX user_categories_pkey;
ALTER TABLE public.user_features ADD CONSTRAINT user_features_pkey PRIMARY KEY USING INDEX user_features_pkey;
ALTER TABLE public.user_tags ADD CONSTRAINT user_tags_pkey PRIMARY KEY USING INDEX user_tags_pkey;

-- Add foreign key constraints with not valid
ALTER TABLE public.user_categories ADD CONSTRAINT user_categories_category_id_fkey 
  FOREIGN KEY (category_id) REFERENCES public.categories(id) NOT VALID;

ALTER TABLE public.user_categories ADD CONSTRAINT user_categories_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) NOT VALID;

ALTER TABLE public.user_features ADD CONSTRAINT user_features_feature_id_fkey 
  FOREIGN KEY (feature_id) REFERENCES public.feature_requests(id) NOT VALID;

ALTER TABLE public.user_features ADD CONSTRAINT user_features_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) NOT VALID;

ALTER TABLE public.user_profiles ADD CONSTRAINT user_profiles_primary_address_id_fkey 
  FOREIGN KEY (primary_address_id) REFERENCES public.addresses(id) NOT VALID;

ALTER TABLE public.user_profiles ADD CONSTRAINT user_profiles_user_type_check 
  CHECK (user_type = ANY (ARRAY['professional'::text, 'hobbyist'::text, 'researcher'::text, 'student'::text, 'other'::text])) NOT VALID;

ALTER TABLE public.user_tags ADD CONSTRAINT user_tags_tag_id_fkey 
  FOREIGN KEY (tag_id) REFERENCES public.tags(id) NOT VALID;

ALTER TABLE public.user_tags ADD CONSTRAINT user_tags_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) NOT VALID;

-- Validate all constraints
ALTER TABLE public.user_categories VALIDATE CONSTRAINT user_categories_category_id_fkey;
ALTER TABLE public.user_categories VALIDATE CONSTRAINT user_categories_user_id_fkey;
ALTER TABLE public.user_features VALIDATE CONSTRAINT user_features_feature_id_fkey;
ALTER TABLE public.user_features VALIDATE CONSTRAINT user_features_user_id_fkey;
ALTER TABLE public.user_profiles VALIDATE CONSTRAINT user_profiles_primary_address_id_fkey;
ALTER TABLE public.user_profiles VALIDATE CONSTRAINT user_profiles_user_type_check;
ALTER TABLE public.user_tags VALIDATE CONSTRAINT user_tags_tag_id_fkey;
ALTER TABLE public.user_tags VALIDATE CONSTRAINT user_tags_user_id_fkey;

COMMIT;

-- =========================================
-- STEP 8: ADD PERMISSIONS
-- =========================================
BEGIN;

-- Add permissions
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE 
  ON TABLE public.user_categories TO anon, authenticated, service_role;

GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE 
  ON TABLE public.user_features TO anon, authenticated, service_role;

GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE 
  ON TABLE public.user_tags TO anon, authenticated, service_role;

COMMIT;