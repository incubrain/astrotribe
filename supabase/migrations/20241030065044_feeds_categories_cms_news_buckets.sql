CREATE EXTENSION IF NOT EXISTS vector;

-- First create the sequences with fully qualified names
CREATE SEQUENCE public.strapi_migrations_id_seq AS integer;
CREATE SEQUENCE public.strapi_migrations_internal_id_seq AS integer;

-- Then create the migrations tables that depend on the sequences
CREATE TABLE public.strapi_migrations (
    id integer NOT NULL DEFAULT nextval('public.strapi_migrations_id_seq'),
    name character varying(255),
    time timestamp without time zone
);

CREATE TABLE public.strapi_migrations_internal (
    id integer NOT NULL DEFAULT nextval('public.strapi_migrations_internal_id_seq'),
    name character varying(255),
    time timestamp without time zone
);

-- Create the feeds table (needs to exist before feed_categories)
CREATE TABLE public.feeds (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    name text,
    user_id uuid
);

-- Create the feed_categories table
CREATE TABLE public.feed_categories (
    id bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    feed_id uuid,
    category_id bigint
);

-- Add columns to existing tables
ALTER TABLE public.categories ADD COLUMN document_id character varying(255);
ALTER TABLE public.categories ADD COLUMN locale character varying(255);
ALTER TABLE public.categories ADD COLUMN published_at character varying(255);

ALTER TABLE public.companies ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.companies ALTER COLUMN url SET DATA TYPE text USING url::text;

ALTER TABLE public.content_sources ADD COLUMN rss_urls text[];
ALTER TABLE public.contents ADD COLUMN rss_url text;

ALTER TABLE public.tags ADD COLUMN document_id character varying(255);
ALTER TABLE public.tags ADD COLUMN locale character varying(255);
ALTER TABLE public.tags ADD COLUMN published_at character varying(255);

-- Set sequence ownership
ALTER SEQUENCE public.strapi_migrations_id_seq OWNED BY public.strapi_migrations.id;
ALTER SEQUENCE public.strapi_migrations_internal_id_seq OWNED BY public.strapi_migrations_internal.id;

-- Create indices
CREATE UNIQUE INDEX feed_categories_pkey ON public.feed_categories USING btree (id);
CREATE UNIQUE INDEX feeds_pkey ON public.feeds USING btree (id);
CREATE UNIQUE INDEX strapi_migrations_internal_pkey ON public.strapi_migrations_internal USING btree (id);
CREATE UNIQUE INDEX strapi_migrations_pkey ON public.strapi_migrations USING btree (id);

-- Add primary key constraints
ALTER TABLE public.feed_categories ADD CONSTRAINT feed_categories_pkey PRIMARY KEY USING INDEX feed_categories_pkey;
ALTER TABLE public.feeds ADD CONSTRAINT feeds_pkey PRIMARY KEY USING INDEX feeds_pkey;
ALTER TABLE public.strapi_migrations ADD CONSTRAINT strapi_migrations_pkey PRIMARY KEY USING INDEX strapi_migrations_pkey;
ALTER TABLE public.strapi_migrations_internal ADD CONSTRAINT strapi_migrations_internal_pkey PRIMARY KEY USING INDEX strapi_migrations_internal_pkey;

-- Add foreign key constraints
ALTER TABLE public.feed_categories ADD CONSTRAINT feed_categories_category_id_fkey 
    FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
ALTER TABLE public.feed_categories VALIDATE CONSTRAINT feed_categories_category_id_fkey;

ALTER TABLE public.feed_categories ADD CONSTRAINT feed_categories_feed_id_fkey 
    FOREIGN KEY (feed_id) REFERENCES public.feeds(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
ALTER TABLE public.feed_categories VALIDATE CONSTRAINT feed_categories_feed_id_fkey;

ALTER TABLE public.feeds ADD CONSTRAINT feeds_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
ALTER TABLE public.feeds VALIDATE CONSTRAINT feeds_user_id_fkey;

-- Set function configuration
SET check_function_bodies = off;

-- Create functions
CREATE OR REPLACE FUNCTION public.create_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _username TEXT;
  _given_name TEXT;
  _surname TEXT;
  _avatar TEXT;
BEGIN
  -- Assign username from different potential keys
  _username := COALESCE(
    NEW.raw_user_meta_data ->> 'preferred_username',  -- Used by Twitter, Google, etc.
    NEW.raw_user_meta_data ->> 'user_name',           -- Alternate Twitter key
    NEW.raw_user_meta_data ->> 'nickname',             -- Possible key for other providers
    LOWER(CONCAT(NEW.raw_user_meta_data ->> 'given_name', '_', NEW.raw_user_meta_data ->> 'given_name')) -- email signup
  );

  -- Extract the given name (first name) from different keys
  _given_name := COALESCE(
    NEW.raw_user_meta_data ->> 'given_name',          -- Common key used by Google / email signup
    NEW.raw_user_meta_data ->> 'first_name',          -- Common key used by Facebook, LinkedIn
    (string_to_array(NEW.raw_user_meta_data ->> 'name', ' '))[1]  -- First element from 'name'
  );

  -- Extract the surname (last name) from different keys
  _surname := COALESCE(
    NEW.raw_user_meta_data ->> 'family_name',         -- Common key used by Google
    NEW.raw_user_meta_data ->> 'last_name',           -- Common key used by Facebook, LinkedIn
    NEW.raw_user_meta_data ->> 'surname',           -- email signup
    (string_to_array(NEW.raw_user_meta_data ->> 'name', ' '))[2]  -- Second element from 'name'
  );

  -- Assign avatar URL from different potential keys
  _avatar := COALESCE(
    NEW.raw_user_meta_data ->> 'avatar_url',          -- Used by Twitter
    NEW.raw_user_meta_data ->> 'picture',             -- Common key used by Google, Facebook
    NEW.raw_user_meta_data ->> 'image_url'            -- Possible key for other providers
  );

  -- Insert a new profile record using the new user's ID and email, along with extracted metadata.
  INSERT INTO public.user_profiles (id, email, username, given_name, surname, avatar)
  VALUES (
    NEW.id,
    NEW.email,
    _username,
    _given_name,
    _surname,
    _avatar
  );

  RETURN NEW;
END;
$function$;

-- Grant permissions
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.feed_categories TO anon, authenticated, service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.feeds TO anon, authenticated, service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.strapi_migrations TO anon, authenticated, service_role;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.strapi_migrations_internal TO anon, authenticated, service_role;