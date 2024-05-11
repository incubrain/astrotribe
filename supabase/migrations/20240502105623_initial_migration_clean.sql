SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE SCHEMA IF NOT EXISTS "public";

ALTER SCHEMA "public" OWNER TO "postgres";

create EXTENSION if not exists "vector" with schema "public";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

create type "public"."access_level" as enum ('viewer', 'editor', 'admin', 'super_admin');

create type "public"."app_plan_enum" as enum ('free', 'basic', 'intermediate', 'premium', 'enterprise', 'custom');

create type "public"."app_role_enum" as enum ('guest', 'user', 'astroguide', 'mentor', 'moderator', 'tenant_member', 'tenant_admin', 'tenant_super_admin', 'admin', 'super_admin');

create type "public"."contact_type" as enum ('personal', 'company', 'professional', 'recruitment', 'founder');

create type "public"."feedback_status" as enum ('new', 'under_review', 'backlog', 'working_on', 'resolved', 'rejected', 'deferred');

create type "public"."feedback_type" as enum ('bug_report', 'feature_request', 'user_interface_issue', 'performance_issue', 'documentation');

create type "public"."news_importance_level" as enum ('high', 'medium', 'low');

create type "public"."news_relation_type" as enum ('source', 'topic', 'mention');

create type "public"."privacy_level" as enum ('private', 'connected', 'public');

create type "public"."scrape_frequency" as enum ('four_times_daily', 'twice_daily', 'daily', 'weekly', 'bi_weekly', 'monthly');

create type "public"."user_status" as enum ('online', 'offline');

create type "public"."address_type" as enum ('residential', 'headquarters', 'office', 'factory', 'lab', 'warehouse', 'research', 'retail', 'showroom', 'branch');


CREATE TABLE "public"."categories" (
    "id" BIGINT GENERATED ALWAYS AS IDENTITY,
    "created_at" TIMESTAMP(6) WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "body" VARCHAR(255),
    "name" VARCHAR(255) NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
    PRIMARY KEY ("id"),
    UNIQUE ("name")
);

ALTER TABLE "public"."categories" OWNER TO "postgres";


-- Create tags table
CREATE TABLE "public"."tags" (
    "id" INT GENERATED ALWAYS AS IDENTITY,
    "body" TEXT,
    "created_at" TIME WITH TIME ZONE DEFAULT now(),
    "updated_at" TIME WITH TIME ZONE DEFAULT now(),
    "name" TEXT NOT NULL,
    PRIMARY KEY ("id"),
    UNIQUE ("name")
);

ALTER TABLE "public"."tags" OWNER TO "postgres";

-- Create news table
CREATE TABLE "public"."news" (
    "id" BIGINT GENERATED ALWAYS AS IDENTITY,
    "created_at" TIMESTAMP(6) WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) WITH TIME ZONE NOT NULL DEFAULT now(),
    "title" VARCHAR(255) NOT NULL,
    "body" TEXT NOT NULL,
    "category_id" BIGINT NOT NULL DEFAULT '31'::BIGINT,
    "author" TEXT,
    "description" TEXT,
    "featured_image" TEXT,
    "has_summary" BOOLEAN NOT NULL DEFAULT FALSE,
    "published_at" TIMESTAMP WITH TIME ZONE,
    "source" VARCHAR NOT NULL,
    "url" TEXT NOT NULL,
    PRIMARY KEY ("id"),
    UNIQUE ("url"),
    FOREIGN KEY ("category_id") REFERENCES "public"."categories" ("id") ON UPDATE CASCADE ON DELETE RESTRICT
);

ALTER TABLE "public"."news" OWNER TO "postgres";

-- Create countries table
CREATE TABLE "public"."countries" (
    "id" INT GENERATED ALWAYS AS IDENTITY,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(2) NOT NULL,
    PRIMARY KEY ("id"),
    UNIQUE ("name")
);

ALTER TABLE "public"."countries" OWNER TO "postgres";

CREATE TABLE "public"."cities" (
    "id" INT GENERATED ALWAYS AS IDENTITY,
    "name" VARCHAR(100) NOT NULL,
    "country_id" INTEGER NOT NULL,
    "state" VARCHAR,
    PRIMARY KEY ("id"),
    UNIQUE ("name"),
    FOREIGN KEY ("country_id") REFERENCES "public"."countries" ("id")
);

ALTER TABLE "public"."cities" OWNER TO "postgres";

-- Create social_media table
CREATE TABLE "public"."social_media" (
    "id" INT GENERATED ALWAYS AS IDENTITY,
    "facebook_url" VARCHAR(255),
    "twitter_url" VARCHAR(255),
    "linkedin_url" VARCHAR(255),
    "instagram_url" VARCHAR(255),
    "youtube_url" VARCHAR,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
    PRIMARY KEY ("id")
);
ALTER TABLE "public"."social_media" OWNER TO "postgres";


-- Create companies table
CREATE TABLE "public"."companies" (
    "id" INT GENERATED ALWAYS AS IDENTITY,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "logo_url" VARCHAR(255),
    "website_url" VARCHAR(255) NOT NULL,
    "social_media_id" INTEGER,
    "last_scraped_at" TIMESTAMP WITH TIME ZONE,
    "scrape_frequency" public.scrape_frequency,
    "category_id" INTEGER,
    "created_at" TIMESTAMP WITH TIME ZONE,
    "updated_at" TIMESTAMP WITH TIME ZONE,
    "founding_year" SMALLINT,
    "is_government" BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY ("id"),
    UNIQUE ("website_url"),
    FOREIGN KEY ("category_id") REFERENCES "public"."categories" ("id"),
    FOREIGN KEY ("social_media_id") REFERENCES "public"."social_media" ("id")
);

ALTER TABLE "public"."companies" OWNER TO "postgres";

-- Create user_profiles table
CREATE TABLE "public"."user_profiles" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "email" TEXT NOT NULL,
    "given_name" TEXT,
    "surname" TEXT,
    "username" VARCHAR,
    "dob" DATE,
    "gender_id" SMALLINT,
    "created_at" TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "last_seen" TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "avatar" TEXT,
    "cover_image" TEXT DEFAULT ''::TEXT,
    "introduction" TEXT,
    "quote" TEXT,
    "followed_count" INTEGER DEFAULT 0,
    "followers_count" INTEGER DEFAULT 0,
    "plan" public.app_plan_enum DEFAULT 'free'::public.app_plan_enum,
    "role" public.app_role_enum NOT NULL DEFAULT 'user'::public.app_role_enum,
    PRIMARY KEY ("id"),
    UNIQUE ("email"),
    FOREIGN KEY ("id") REFERENCES "auth"."users" ("id") ON UPDATE CASCADE ON DELETE CASCADE
);

ALTER TABLE "public"."user_profiles" OWNER TO "postgres";


-- Create addresses table
CREATE TABLE "public"."addresses" (
    "id" INT GENERATED ALWAYS AS IDENTITY,
    "street1" VARCHAR(255) NOT NULL,
    "street2" VARCHAR(255),
    "city_id" INTEGER NOT NULL,
    "country_id" INTEGER NOT NULL,
    "name" VARCHAR,
    "company_id" INTEGER,
    "user_id" UUID,
    "is_primary" BOOLEAN DEFAULT FALSE,
    "address_type" public.address_type,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
    PRIMARY KEY ("id"),
    FOREIGN KEY ("city_id") REFERENCES "public"."cities" ("id"),
    FOREIGN KEY ("country_id") REFERENCES "public"."countries" ("id"),
    FOREIGN KEY ("company_id") REFERENCES "public"."companies" ("id"),
    FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles" ("id")
);

ALTER TABLE "public"."addresses" OWNER TO "postgres";

-- Create user_followers table
CREATE TABLE "public"."user_followers" (
    "id" BIGINT GENERATED ALWAYS AS IDENTITY,
    "created_at" TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "follower_id" UUID NOT NULL,
    "followed_id" UUID NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("follower_id") REFERENCES "public"."user_profiles" ("id"),
    FOREIGN KEY ("followed_id") REFERENCES "public"."user_profiles" ("id")
);

ALTER TABLE "public"."user_followers" OWNER TO "postgres";

-- Create company_employees table
CREATE TABLE "public"."company_employees" (
    "id" BIGINT GENERATED ALWAYS AS IDENTITY,
    "user_profile_id" UUID NOT NULL,
    "company_id" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "job_description" TEXT,
    "start_date" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP WITH TIME ZONE,
    "status" BOOLEAN,
    "access_level" public.access_level NOT NULL DEFAULT 'viewer'::public.access_level,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles" ("id"),
    FOREIGN KEY ("company_id") REFERENCES "public"."companies" ("id")
);

ALTER TABLE "public"."company_employees" OWNER TO "postgres";

-- Create company_news table
CREATE TABLE "public"."company_news" (
    "id" BIGINT GENERATED ALWAYS AS IDENTITY,
    "company_id" INTEGER NOT NULL,
    "news_id" INTEGER NOT NULL,
    "relation_type" public.news_relation_type NOT NULL DEFAULT 'source'::public.news_relation_type,
    "importance_level" public.news_importance_level,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("company_id") REFERENCES "public"."companies" ("id"),
    FOREIGN KEY ("news_id") REFERENCES "public"."news" ("id")
);

ALTER TABLE "public"."company_news" OWNER TO "postgres";

-- Create contacts table
CREATE TABLE "public"."contacts" (
    "id" INT GENERATED ALWAYS AS IDENTITY,
    "title" VARCHAR(100),
    "is_primary" BOOLEAN DEFAULT FALSE,
    "email" VARCHAR(255),
    "contact_type" public.contact_type,
    "privacy_level" public.privacy_level,
    "user_id" UUID,
    "company_id" INTEGER,
    "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "phone" VARCHAR(50),
    PRIMARY KEY ("id"),
    FOREIGN KEY ("company_id") REFERENCES "public"."companies" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles" ("id") ON DELETE CASCADE
);

ALTER TABLE "public"."contacts" OWNER TO "postgres";

-- Create embeddings table
CREATE TABLE "public"."embeddings" (
    "id" BIGINT GENERATED ALWAYS AS IDENTITY,
    "vector" public.vector(1536),
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

ALTER TABLE "public"."embeddings" OWNER TO "postgres";

-- Create feedbacks table
CREATE TABLE "public"."feedbacks" (
    "id" INT GENERATED ALWAYS AS IDENTITY,
    "user_id" UUID,
    "page_identifier" VARCHAR(255) NOT NULL,
    "feedback_type" public.feedback_type,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "device_info" TEXT,
    "status" public.feedback_status DEFAULT 'new'::public.feedback_status,
    "resolution_comment" TEXT,
    PRIMARY KEY ("id"),
    UNIQUE ("id"),
    FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles" ("id")
);

ALTER TABLE "public"."feedbacks" OWNER TO "postgres";



-- Create news_embeddings table
CREATE TABLE "public"."news_embeddings" (
    "id" INT GENERATED ALWAYS AS IDENTITY,
    "news_id" BIGINT NOT NULL,
    "embedding_id" BIGINT NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("news_id") REFERENCES "public"."news" ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings" ("id") ON UPDATE CASCADE ON DELETE RESTRICT
);

ALTER TABLE "public"."news_embeddings" OWNER TO "postgres";

-- Create news_tags table
CREATE TABLE "public"."news_tags" (
    "id" INT GENERATED ALWAYS AS IDENTITY,
    "news_id" BIGINT NOT NULL,
    "tag_id" INTEGER NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("news_id") REFERENCES "public"."news" ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY ("tag_id") REFERENCES "public"."tags" ("id") ON UPDATE CASCADE ON DELETE RESTRICT
);

ALTER TABLE "public"."news_tags" OWNER TO "postgres";

-- Create plan_permissions table
CREATE TABLE "public"."plan_permissions" (
    "id" INT GENERATED ALWAYS AS IDENTITY,
    "plan" public.app_plan_enum NOT NULL,
    "feature" VARCHAR NOT NULL,
    PRIMARY KEY ("id")
);

ALTER TABLE "public"."plan_permissions" OWNER TO "postgres";

-- Create research table
CREATE TABLE "public"."research" (
    "id" BIGINT GENERATED ALWAYS AS IDENTITY,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
    "published_at" TIMESTAMP WITH TIME ZONE,
    "title" TEXT,
    "url" VARCHAR NOT NULL,
    "body" TEXT,
    "author" VARCHAR,
    "description" TEXT,
    "version" SMALLINT,
    PRIMARY KEY ("id"),
    UNIQUE ("url")
);

ALTER TABLE "public"."research" OWNER TO "postgres";


-- Create searches table
CREATE TABLE "public"."searches" (
    "id" BIGINT GENERATED ALWAYS AS IDENTITY,
    "user_id" UUID,
    "input" TEXT NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles" ("id")
);

ALTER TABLE "public"."searches" OWNER TO "postgres";

-- Create responses table
CREATE TABLE "public"."responses" (
    "id" BIGINT GENERATED ALWAYS AS IDENTITY,
    "search_id" BIGINT NOT NULL,
    "output" TEXT NOT NULL,
    "upvotes" INTEGER DEFAULT 0,
    "downvotes" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("search_id") REFERENCES "public"."searches" ("id")
);

ALTER TABLE "public"."responses" OWNER TO "postgres";

-- Create role_permissions table
CREATE TABLE "public"."role_permissions" (
    "id" INT GENERATED ALWAYS AS IDENTITY,
    "role" public.app_role_enum NOT NULL,
    "select" BOOLEAN DEFAULT FALSE,
    "insert" BOOLEAN DEFAULT FALSE,
    "update" BOOLEAN DEFAULT FALSE,
    "delete" BOOLEAN DEFAULT FALSE,
    "table_name" VARCHAR NOT NULL,
    PRIMARY KEY ("id"),
    UNIQUE ("role", "table_name")
);

ALTER TABLE "public"."role_permissions" OWNER TO "postgres";


CREATE INDEX idx_addresses_city_id ON public.addresses USING btree (city_id);
CREATE INDEX idx_addresses_country_id ON public.addresses USING btree (country_id);
CREATE INDEX idx_cities_country_id ON public.cities USING btree (country_id);
CREATE INDEX idx_companies_category ON public.companies USING btree (category_id);
CREATE INDEX idx_companies_name ON public.companies USING btree (name);

CREATE UNIQUE INDEX idx_unique_user_company ON public.company_employees USING btree (user_profile_id, company_id);
CREATE UNIQUE INDEX idx_unique_company_news ON public.company_news USING btree (company_id, news_id);

alter table "public"."addresses" add constraint "fk_city" FOREIGN KEY (city_id) REFERENCES public.cities(id) not valid;

alter table "public"."addresses" validate constraint "fk_city";

alter table "public"."addresses" add constraint "fk_country" FOREIGN KEY (country_id) REFERENCES public.countries(id) not valid;

alter table "public"."addresses" validate constraint "fk_country";

alter table "public"."addresses" add constraint "public_addresses_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."addresses" validate constraint "public_addresses_company_id_fkey";

alter table "public"."addresses" add constraint "public_addresses_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."addresses" validate constraint "public_addresses_user_id_fkey";

alter table "public"."cities" add constraint "fk_country" FOREIGN KEY (country_id) REFERENCES public.countries(id) not valid;

alter table "public"."cities" validate constraint "fk_country";

alter table "public"."companies" add constraint "fk_category" FOREIGN KEY (category_id) REFERENCES public.categories(id) not valid;

alter table "public"."companies" validate constraint "fk_category";

alter table "public"."companies" add constraint "fk_social_media" FOREIGN KEY (social_media_id) REFERENCES public.social_media(id) not valid;

alter table "public"."companies" validate constraint "fk_social_media";

alter table "public"."company_employees" validate constraint "company_employees_company_id_fkey";

alter table "public"."company_employees" validate constraint "company_employees_user_profile_id_fkey";

alter table "public"."company_news" validate constraint "company_news_company_id_fkey";

alter table "public"."company_news" validate constraint "company_news_news_id_fkey";

alter table "public"."contacts" add constraint "fk_company" FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE not valid;

alter table "public"."contacts" validate constraint "fk_company";

alter table "public"."contacts" add constraint "fk_user" FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."contacts" validate constraint "fk_user";

alter table "public"."feedbacks" add constraint "fk_user" FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) not valid;

alter table "public"."feedbacks" validate constraint "fk_user";

alter table "public"."news" validate constraint "news_category_id_fkey";

alter table "public"."news_embeddings" validate constraint "news_embeddings_embedding_id_fkey";

alter table "public"."news_embeddings" validate constraint "news_embeddings_news_id_fkey";

alter table "public"."news_tags" validate constraint "news_tags_news_id_fkey";

alter table "public"."news_tags" validate constraint "news_tags_tag_id_fkey";

alter table "public"."responses" validate constraint "responses_search_id_fkey";

alter table "public"."searches" validate constraint "searches_user_id_fkey";

alter table "public"."user_profiles" add constraint "public_user_profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_profiles" validate constraint "public_user_profiles_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_authorize_rls_policies()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    table_info RECORD;
BEGIN
    FOR table_info IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    LOOP
        -- Enable RLS on the table if not already enabled
        EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', 'public', table_info.tablename);

        -- Create or replace policies for INSERT
        EXECUTE format('CREATE POLICY insert_policy ON %I.%I FOR INSERT WITH CHECK (public.authorize(%L))', 
            'public', table_info.tablename, table_info.tablename || '.insert');

        -- Create or replace policies for UPDATE
        EXECUTE format('CREATE POLICY update_policy ON %I.%I FOR UPDATE USING (public.authorize(%L))', 
            'public', table_info.tablename, table_info.tablename || '.update');

        -- Create or replace policies for DELETE
        EXECUTE format('CREATE POLICY delete_policy ON %I.%I FOR DELETE USING (public.authorize(%L))', 
            'public', table_info.tablename, table_info.tablename || '.delete');
    END LOOP;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.assign_role_permissions_from_config(json_config json)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    config_element json;
    table_exists boolean;
BEGIN
    FOR config_element IN SELECT * FROM json_array_elements(json_config)
    LOOP
        -- Check if the table exists in the public schema
        SELECT EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_schema = 'public'
              AND table_name = config_element->>'table_name'
        ) INTO table_exists;

        IF table_exists THEN
            INSERT INTO role_permissions ("role", "table_name", "select", "insert", "update", "delete")
            VALUES (
                (config_element->>'role')::app_role_enum, 
                config_element->>'table_name', 
                (config_element->>'select')::boolean, 
                (config_element->>'insert')::boolean, 
                (config_element->>'update')::boolean, 
                (config_element->>'delete')::boolean
            )
            ON CONFLICT ON CONSTRAINT role_permission_unique DO UPDATE 
            SET 
                "select" = EXCLUDED."select",
                "insert" = EXCLUDED."insert",
                "update" = EXCLUDED."update",
                "delete" = EXCLUDED."delete";
        ELSE
            RAISE NOTICE 'Table "%" does not exist in the public schema.', config_element->>'table_name';
        END IF;
    END LOOP;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.authorize(requested_permission text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    user_role public.app_role_enum;
    v_table_name text;
    operation text;
    full_jwt json; -- Variable to store the entire JWT object for logging
BEGIN
    full_jwt := auth.jwt(); -- Get the full JWT object
    RAISE LOG 'JWT Object: %', full_jwt; -- Log the entire JWT object

    user_role := ((auth.jwt() -> 'app_metadata') ->> 'user_role')::public.app_role_enum;

    -- Check if user_role is present and valid
    IF user_role IS NULL THEN
        RAISE EXCEPTION 'No user role found in JWT';
    END IF;

    RAISE LOG 'Starting authorization check for user role: %', user_role;

    -- Immediately grant access if the user's role is super_admin
    IF user_role = 'super_admin' THEN
        RAISE LOG 'Super admin detected. Granting access.';
        RETURN TRUE;
    END IF;

    -- Parse requested_permission into table_name and operation
    v_table_name := split_part(requested_permission, '.', 1);
    operation := split_part(requested_permission, '.', 2);

    RAISE LOG 'Requested permission involves table: % and operation: %', v_table_name, operation;

    -- Check permissions for other roles based on the operation
    RETURN EXISTS (
        SELECT 1
        FROM public.role_permissions
        WHERE role = user_role
          AND table_name = v_table_name
          AND ((operation = 'select' AND role_permissions.select)
            OR (operation = 'insert' AND role_permissions.insert)
            OR (operation = 'update' AND role_permissions.update)
            OR (operation = 'delete' AND role_permissions.delete))
    );
END;
$function$
;

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
    NEW.raw_user_meta_data ->> 'nickname'             -- Possible key for other providers
  );

  -- Extract the given name (first name) from different keys
  _given_name := COALESCE(
    NEW.raw_user_meta_data ->> 'given_name',          -- Common key used by Google
    NEW.raw_user_meta_data ->> 'first_name',          -- Common key used by Facebook, LinkedIn
    (string_to_array(NEW.raw_user_meta_data ->> 'name', ' '))[1]  -- First element from 'name'
  );

  -- Extract the surname (last name) from different keys
  _surname := COALESCE(
    NEW.raw_user_meta_data ->> 'family_name',         -- Common key used by Google
    NEW.raw_user_meta_data ->> 'last_name',           -- Common key used by Facebook, LinkedIn
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
$function$
;

CREATE TRIGGER create_user_profile AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.create_user_profile();

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
AS $function$
DECLARE
    claims jsonb;
    input_user_id uuid;
    user_role public.app_role_enum;
    user_plan public.app_plan_enum;
BEGIN
    input_user_id := (event->>'user_id')::uuid;
    RAISE LOG 'custom_access_token_hook event user_id: %', input_user_id;
    RAISE LOG 'custom_access_token_hook event event: %', coalesce(event->'claims', '{}'::jsonb);

    -- Check if the user is marked as admin in the profiles table

    SELECT plan, role INTO user_plan, user_role FROM public.user_profiles WHERE id = input_user_id;
    RAISE LOG 'User plan fetch attempt for user_id %: % %', input_user_id, user_plan, user_role;

    claims := coalesce(event->'claims', '{}'::jsonb);

    -- Ensure app_metadata exists
    IF jsonb_typeof(claims->'app_metadata') IS NULL THEN
        claims := jsonb_set(claims, '{app_metadata}', '{}');
    END IF;

    -- Only update user_role and user_plan if not null
    IF user_role IS NOT NULL THEN
        claims := jsonb_set(claims, '{app_metadata,user_role}', to_jsonb(user_role::text));
    END IF;
    IF user_plan IS NOT NULL THEN
        claims := jsonb_set(claims, '{app_metadata,user_plan}', to_jsonb(user_plan::text));
    END IF;

    IF user_role IS NOT NULL OR user_plan IS NOT NULL THEN
        RAISE LOG 'Claims updated with role and/or plan: %', claims;
    ELSE
        RAISE LOG 'User role and plan are NULL, no updates made to claims.';
    END IF;

    event := jsonb_set(event, '{claims}', claims);
    RAISE LOG 'Event to be returned: %', event;

    RETURN event;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.users_columns_updateable()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    current_user_role public.app_role_enum;
BEGIN
    -- Example of fetching current user's role from JWT; adjust based on your setup
    current_user_role := (auth.jwt() ->> 'user_role')::public.app_role_enum;
    RAISE LOG 'User with role % attempted to change role or plan', current_user_role;


    -- Allow admins or super_admins to change roles and plans
    IF current_user_role IN ('admin', 'super_admin') THEN
        RETURN NEW;
    END IF;

    -- Prevent non-admin users from changing roles and plans
    IF NEW.role IS DISTINCT FROM OLD.role THEN
        RAISE EXCEPTION 'Changing "role" is not allowed.';
    END IF;
    IF NEW.plan IS DISTINCT FROM OLD.plan THEN
        RAISE EXCEPTION 'Changing "plan" is not allowed.';
    END IF;

    RETURN NEW; -- Return the updated row to allow the update to proceed
END;
$function$
;

grant delete on table "public"."addresses" to "anon";

grant insert on table "public"."addresses" to "anon";

grant references on table "public"."addresses" to "anon";

grant select on table "public"."addresses" to "anon";

grant trigger on table "public"."addresses" to "anon";

grant truncate on table "public"."addresses" to "anon";

grant update on table "public"."addresses" to "anon";

grant delete on table "public"."addresses" to "authenticated";

grant insert on table "public"."addresses" to "authenticated";

grant references on table "public"."addresses" to "authenticated";

grant select on table "public"."addresses" to "authenticated";

grant trigger on table "public"."addresses" to "authenticated";

grant truncate on table "public"."addresses" to "authenticated";

grant update on table "public"."addresses" to "authenticated";

grant delete on table "public"."addresses" to "service_role";

grant insert on table "public"."addresses" to "service_role";

grant references on table "public"."addresses" to "service_role";

grant select on table "public"."addresses" to "service_role";

grant trigger on table "public"."addresses" to "service_role";

grant truncate on table "public"."addresses" to "service_role";

grant update on table "public"."addresses" to "service_role";

grant select on table "public"."categories" to "anon";

grant select on table "public"."categories" to "authenticated";

grant insert on table "public"."categories" to "service_role";

grant select on table "public"."categories" to "service_role";

grant update on table "public"."categories" to "service_role";

grant delete on table "public"."cities" to "anon";

grant insert on table "public"."cities" to "anon";

grant references on table "public"."cities" to "anon";

grant select on table "public"."cities" to "anon";

grant trigger on table "public"."cities" to "anon";

grant truncate on table "public"."cities" to "anon";

grant update on table "public"."cities" to "anon";

grant delete on table "public"."cities" to "authenticated";

grant insert on table "public"."cities" to "authenticated";

grant references on table "public"."cities" to "authenticated";

grant select on table "public"."cities" to "authenticated";

grant trigger on table "public"."cities" to "authenticated";

grant truncate on table "public"."cities" to "authenticated";

grant update on table "public"."cities" to "authenticated";

grant delete on table "public"."cities" to "service_role";

grant insert on table "public"."cities" to "service_role";

grant references on table "public"."cities" to "service_role";

grant select on table "public"."cities" to "service_role";

grant trigger on table "public"."cities" to "service_role";

grant truncate on table "public"."cities" to "service_role";

grant update on table "public"."cities" to "service_role";

grant delete on table "public"."companies" to "anon";

grant insert on table "public"."companies" to "anon";

grant references on table "public"."companies" to "anon";

grant select on table "public"."companies" to "anon";

grant trigger on table "public"."companies" to "anon";

grant truncate on table "public"."companies" to "anon";

grant update on table "public"."companies" to "anon";

grant delete on table "public"."companies" to "authenticated";

grant insert on table "public"."companies" to "authenticated";

grant references on table "public"."companies" to "authenticated";

grant select on table "public"."companies" to "authenticated";

grant trigger on table "public"."companies" to "authenticated";

grant truncate on table "public"."companies" to "authenticated";

grant update on table "public"."companies" to "authenticated";

grant delete on table "public"."companies" to "service_role";

grant insert on table "public"."companies" to "service_role";

grant references on table "public"."companies" to "service_role";

grant select on table "public"."companies" to "service_role";

grant trigger on table "public"."companies" to "service_role";

grant truncate on table "public"."companies" to "service_role";

grant update on table "public"."companies" to "service_role";

grant delete on table "public"."company_employees" to "anon";

grant insert on table "public"."company_employees" to "anon";

grant references on table "public"."company_employees" to "anon";

grant select on table "public"."company_employees" to "anon";

grant trigger on table "public"."company_employees" to "anon";

grant truncate on table "public"."company_employees" to "anon";

grant update on table "public"."company_employees" to "anon";

grant delete on table "public"."company_employees" to "authenticated";

grant insert on table "public"."company_employees" to "authenticated";

grant references on table "public"."company_employees" to "authenticated";

grant select on table "public"."company_employees" to "authenticated";

grant trigger on table "public"."company_employees" to "authenticated";

grant truncate on table "public"."company_employees" to "authenticated";

grant update on table "public"."company_employees" to "authenticated";

grant delete on table "public"."company_employees" to "service_role";

grant insert on table "public"."company_employees" to "service_role";

grant references on table "public"."company_employees" to "service_role";

grant select on table "public"."company_employees" to "service_role";

grant trigger on table "public"."company_employees" to "service_role";

grant truncate on table "public"."company_employees" to "service_role";

grant update on table "public"."company_employees" to "service_role";

grant delete on table "public"."company_news" to "anon";

grant insert on table "public"."company_news" to "anon";

grant references on table "public"."company_news" to "anon";

grant select on table "public"."company_news" to "anon";

grant trigger on table "public"."company_news" to "anon";

grant truncate on table "public"."company_news" to "anon";

grant update on table "public"."company_news" to "anon";

grant delete on table "public"."company_news" to "authenticated";

grant insert on table "public"."company_news" to "authenticated";

grant references on table "public"."company_news" to "authenticated";

grant select on table "public"."company_news" to "authenticated";

grant trigger on table "public"."company_news" to "authenticated";

grant truncate on table "public"."company_news" to "authenticated";

grant update on table "public"."company_news" to "authenticated";

grant delete on table "public"."company_news" to "service_role";

grant insert on table "public"."company_news" to "service_role";

grant references on table "public"."company_news" to "service_role";

grant select on table "public"."company_news" to "service_role";

grant trigger on table "public"."company_news" to "service_role";

grant truncate on table "public"."company_news" to "service_role";

grant update on table "public"."company_news" to "service_role";

grant delete on table "public"."contacts" to "anon";

grant insert on table "public"."contacts" to "anon";

grant references on table "public"."contacts" to "anon";

grant select on table "public"."contacts" to "anon";

grant trigger on table "public"."contacts" to "anon";

grant truncate on table "public"."contacts" to "anon";

grant update on table "public"."contacts" to "anon";

grant delete on table "public"."contacts" to "authenticated";

grant insert on table "public"."contacts" to "authenticated";

grant references on table "public"."contacts" to "authenticated";

grant select on table "public"."contacts" to "authenticated";

grant trigger on table "public"."contacts" to "authenticated";

grant truncate on table "public"."contacts" to "authenticated";

grant update on table "public"."contacts" to "authenticated";

grant delete on table "public"."contacts" to "service_role";

grant insert on table "public"."contacts" to "service_role";

grant references on table "public"."contacts" to "service_role";

grant select on table "public"."contacts" to "service_role";

grant trigger on table "public"."contacts" to "service_role";

grant truncate on table "public"."contacts" to "service_role";

grant update on table "public"."contacts" to "service_role";

grant delete on table "public"."countries" to "anon";

grant insert on table "public"."countries" to "anon";

grant references on table "public"."countries" to "anon";

grant select on table "public"."countries" to "anon";

grant trigger on table "public"."countries" to "anon";

grant truncate on table "public"."countries" to "anon";

grant update on table "public"."countries" to "anon";

grant delete on table "public"."countries" to "authenticated";

grant insert on table "public"."countries" to "authenticated";

grant references on table "public"."countries" to "authenticated";

grant select on table "public"."countries" to "authenticated";

grant trigger on table "public"."countries" to "authenticated";

grant truncate on table "public"."countries" to "authenticated";

grant update on table "public"."countries" to "authenticated";

grant delete on table "public"."countries" to "service_role";

grant insert on table "public"."countries" to "service_role";

grant references on table "public"."countries" to "service_role";

grant select on table "public"."countries" to "service_role";

grant trigger on table "public"."countries" to "service_role";

grant truncate on table "public"."countries" to "service_role";

grant update on table "public"."countries" to "service_role";

grant select on table "public"."embeddings" to "anon";

grant select on table "public"."embeddings" to "authenticated";

grant insert on table "public"."embeddings" to "service_role";

grant select on table "public"."embeddings" to "service_role";

grant update on table "public"."embeddings" to "service_role";

grant delete on table "public"."feedbacks" to "anon";

grant insert on table "public"."feedbacks" to "anon";

grant references on table "public"."feedbacks" to "anon";

grant select on table "public"."feedbacks" to "anon";

grant trigger on table "public"."feedbacks" to "anon";

grant truncate on table "public"."feedbacks" to "anon";

grant update on table "public"."feedbacks" to "anon";

grant delete on table "public"."feedbacks" to "authenticated";

grant insert on table "public"."feedbacks" to "authenticated";

grant references on table "public"."feedbacks" to "authenticated";

grant select on table "public"."feedbacks" to "authenticated";

grant trigger on table "public"."feedbacks" to "authenticated";

grant truncate on table "public"."feedbacks" to "authenticated";

grant update on table "public"."feedbacks" to "authenticated";

grant delete on table "public"."feedbacks" to "service_role";

grant insert on table "public"."feedbacks" to "service_role";

grant references on table "public"."feedbacks" to "service_role";

grant select on table "public"."feedbacks" to "service_role";

grant trigger on table "public"."feedbacks" to "service_role";

grant truncate on table "public"."feedbacks" to "service_role";

grant update on table "public"."feedbacks" to "service_role";

grant select on table "public"."news" to "anon";

grant select on table "public"."news" to "authenticated";

grant insert on table "public"."news" to "service_role";

grant select on table "public"."news" to "service_role";

grant update on table "public"."news" to "service_role";

grant select on table "public"."news_embeddings" to "anon";

grant select on table "public"."news_embeddings" to "authenticated";

grant insert on table "public"."news_embeddings" to "service_role";

grant select on table "public"."news_embeddings" to "service_role";

grant update on table "public"."news_embeddings" to "service_role";

grant select on table "public"."news_tags" to "anon";

grant select on table "public"."news_tags" to "authenticated";

grant insert on table "public"."news_tags" to "service_role";

grant select on table "public"."news_tags" to "service_role";

grant update on table "public"."news_tags" to "service_role";

grant delete on table "public"."plan_permissions" to "anon";

grant insert on table "public"."plan_permissions" to "anon";

grant references on table "public"."plan_permissions" to "anon";

grant select on table "public"."plan_permissions" to "anon";

grant trigger on table "public"."plan_permissions" to "anon";

grant truncate on table "public"."plan_permissions" to "anon";

grant update on table "public"."plan_permissions" to "anon";

grant delete on table "public"."plan_permissions" to "authenticated";

grant insert on table "public"."plan_permissions" to "authenticated";

grant references on table "public"."plan_permissions" to "authenticated";

grant select on table "public"."plan_permissions" to "authenticated";

grant trigger on table "public"."plan_permissions" to "authenticated";

grant truncate on table "public"."plan_permissions" to "authenticated";

grant update on table "public"."plan_permissions" to "authenticated";

grant delete on table "public"."plan_permissions" to "service_role";

grant insert on table "public"."plan_permissions" to "service_role";

grant references on table "public"."plan_permissions" to "service_role";

grant select on table "public"."plan_permissions" to "service_role";

grant trigger on table "public"."plan_permissions" to "service_role";

grant truncate on table "public"."plan_permissions" to "service_role";

grant update on table "public"."plan_permissions" to "service_role";

grant delete on table "public"."research" to "anon";

grant insert on table "public"."research" to "anon";

grant references on table "public"."research" to "anon";

grant select on table "public"."research" to "anon";

grant trigger on table "public"."research" to "anon";

grant truncate on table "public"."research" to "anon";

grant update on table "public"."research" to "anon";

grant delete on table "public"."research" to "authenticated";

grant insert on table "public"."research" to "authenticated";

grant references on table "public"."research" to "authenticated";

grant select on table "public"."research" to "authenticated";

grant trigger on table "public"."research" to "authenticated";

grant truncate on table "public"."research" to "authenticated";

grant update on table "public"."research" to "authenticated";

grant delete on table "public"."research" to "service_role";

grant insert on table "public"."research" to "service_role";

grant references on table "public"."research" to "service_role";

grant select on table "public"."research" to "service_role";

grant trigger on table "public"."research" to "service_role";

grant truncate on table "public"."research" to "service_role";

grant update on table "public"."research" to "service_role";

grant delete on table "public"."responses" to "anon";

grant insert on table "public"."responses" to "anon";

grant references on table "public"."responses" to "anon";

grant select on table "public"."responses" to "anon";

grant trigger on table "public"."responses" to "anon";

grant truncate on table "public"."responses" to "anon";

grant update on table "public"."responses" to "anon";

grant delete on table "public"."responses" to "authenticated";

grant insert on table "public"."responses" to "authenticated";

grant references on table "public"."responses" to "authenticated";

grant select on table "public"."responses" to "authenticated";

grant trigger on table "public"."responses" to "authenticated";

grant truncate on table "public"."responses" to "authenticated";

grant update on table "public"."responses" to "authenticated";

grant delete on table "public"."responses" to "service_role";

grant insert on table "public"."responses" to "service_role";

grant references on table "public"."responses" to "service_role";

grant select on table "public"."responses" to "service_role";

grant trigger on table "public"."responses" to "service_role";

grant truncate on table "public"."responses" to "service_role";

grant update on table "public"."responses" to "service_role";

grant delete on table "public"."role_permissions" to "anon";

grant insert on table "public"."role_permissions" to "anon";

grant references on table "public"."role_permissions" to "anon";

grant select on table "public"."role_permissions" to "anon";

grant trigger on table "public"."role_permissions" to "anon";

grant truncate on table "public"."role_permissions" to "anon";

grant update on table "public"."role_permissions" to "anon";

grant delete on table "public"."role_permissions" to "authenticated";

grant insert on table "public"."role_permissions" to "authenticated";

grant references on table "public"."role_permissions" to "authenticated";

grant select on table "public"."role_permissions" to "authenticated";

grant trigger on table "public"."role_permissions" to "authenticated";

grant truncate on table "public"."role_permissions" to "authenticated";

grant update on table "public"."role_permissions" to "authenticated";

grant delete on table "public"."role_permissions" to "service_role";

grant insert on table "public"."role_permissions" to "service_role";

grant references on table "public"."role_permissions" to "service_role";

grant select on table "public"."role_permissions" to "service_role";

grant trigger on table "public"."role_permissions" to "service_role";

grant truncate on table "public"."role_permissions" to "service_role";

grant update on table "public"."role_permissions" to "service_role";

grant delete on table "public"."searches" to "anon";

grant insert on table "public"."searches" to "anon";

grant references on table "public"."searches" to "anon";

grant select on table "public"."searches" to "anon";

grant trigger on table "public"."searches" to "anon";

grant truncate on table "public"."searches" to "anon";

grant update on table "public"."searches" to "anon";

grant delete on table "public"."searches" to "authenticated";

grant insert on table "public"."searches" to "authenticated";

grant references on table "public"."searches" to "authenticated";

grant select on table "public"."searches" to "authenticated";

grant trigger on table "public"."searches" to "authenticated";

grant truncate on table "public"."searches" to "authenticated";

grant update on table "public"."searches" to "authenticated";

grant delete on table "public"."searches" to "service_role";

grant insert on table "public"."searches" to "service_role";

grant references on table "public"."searches" to "service_role";

grant select on table "public"."searches" to "service_role";

grant trigger on table "public"."searches" to "service_role";

grant truncate on table "public"."searches" to "service_role";

grant update on table "public"."searches" to "service_role";

grant delete on table "public"."social_media" to "anon";

grant insert on table "public"."social_media" to "anon";

grant references on table "public"."social_media" to "anon";

grant select on table "public"."social_media" to "anon";

grant trigger on table "public"."social_media" to "anon";

grant truncate on table "public"."social_media" to "anon";

grant update on table "public"."social_media" to "anon";

grant delete on table "public"."social_media" to "authenticated";

grant insert on table "public"."social_media" to "authenticated";

grant references on table "public"."social_media" to "authenticated";

grant select on table "public"."social_media" to "authenticated";

grant trigger on table "public"."social_media" to "authenticated";

grant truncate on table "public"."social_media" to "authenticated";

grant update on table "public"."social_media" to "authenticated";

grant delete on table "public"."social_media" to "service_role";

grant insert on table "public"."social_media" to "service_role";

grant references on table "public"."social_media" to "service_role";

grant select on table "public"."social_media" to "service_role";

grant trigger on table "public"."social_media" to "service_role";

grant truncate on table "public"."social_media" to "service_role";

grant update on table "public"."social_media" to "service_role";

grant select on table "public"."tags" to "anon";

grant select on table "public"."tags" to "authenticated";

grant insert on table "public"."tags" to "service_role";

grant select on table "public"."tags" to "service_role";

grant update on table "public"."tags" to "service_role";

grant select on table "public"."user_followers" to "anon";

grant select on table "public"."user_followers" to "authenticated";

grant insert on table "public"."user_followers" to "service_role";

grant select on table "public"."user_followers" to "service_role";

grant update on table "public"."user_followers" to "service_role";

grant delete on table "public"."user_profiles" to "anon";

grant insert on table "public"."user_profiles" to "anon";

grant references on table "public"."user_profiles" to "anon";

grant select on table "public"."user_profiles" to "anon";

grant trigger on table "public"."user_profiles" to "anon";

grant truncate on table "public"."user_profiles" to "anon";

grant update on table "public"."user_profiles" to "anon";

grant delete on table "public"."user_profiles" to "authenticated";

grant insert on table "public"."user_profiles" to "authenticated";

grant references on table "public"."user_profiles" to "authenticated";

grant select on table "public"."user_profiles" to "authenticated";

grant trigger on table "public"."user_profiles" to "authenticated";

grant truncate on table "public"."user_profiles" to "authenticated";

grant update on table "public"."user_profiles" to "authenticated";

grant update on table "public"."user_profiles" to "authenticator";

grant delete on table "public"."user_profiles" to "service_role";

grant insert on table "public"."user_profiles" to "service_role";

grant references on table "public"."user_profiles" to "service_role";

grant select on table "public"."user_profiles" to "service_role";

grant trigger on table "public"."user_profiles" to "service_role";

grant truncate on table "public"."user_profiles" to "service_role";

grant update on table "public"."user_profiles" to "service_role";

grant delete on table "public"."user_profiles" to "supabase_auth_admin";

grant insert on table "public"."user_profiles" to "supabase_auth_admin";

grant references on table "public"."user_profiles" to "supabase_auth_admin";

grant select on table "public"."user_profiles" to "supabase_auth_admin";

grant trigger on table "public"."user_profiles" to "supabase_auth_admin";

grant truncate on table "public"."user_profiles" to "supabase_auth_admin";

grant update on table "public"."user_profiles" to "supabase_auth_admin";

create policy "delete_policy"
on "public"."addresses"
as permissive
for delete
to public
using (public.authorize('addresses.delete'::text));


create policy "insert_policy"
on "public"."addresses"
as permissive
for insert
to public
with check (public.authorize('addresses.insert'::text));


create policy "read_all_policy"
on "public"."addresses"
as permissive
for select
to authenticated
using (true);


create policy "update_policy"
on "public"."addresses"
as permissive
for update
to public
using (public.authorize('addresses.update'::text));


create policy "delete_policy"
on "public"."categories"
as permissive
for delete
to public
using (public.authorize('categories.delete'::text));


create policy "insert_policy"
on "public"."categories"
as permissive
for insert
to public
with check (public.authorize('categories.insert'::text));


create policy "read_all_policy"
on "public"."categories"
as permissive
for select
to authenticated
using (true);


create policy "update_policy"
on "public"."categories"
as permissive
for update
to public
using (public.authorize('categories.update'::text));


create policy "delete_policy"
on "public"."cities"
as permissive
for delete
to public
using (public.authorize('cities.delete'::text));


create policy "insert_policy"
on "public"."cities"
as permissive
for insert
to public
with check (public.authorize('cities.insert'::text));


create policy "read_all_policy"
on "public"."cities"
as permissive
for select
to authenticated
using (true);


create policy "update_policy"
on "public"."cities"
as permissive
for update
to public
using (public.authorize('cities.update'::text));


create policy "delete_policy"
on "public"."companies"
as permissive
for delete
to public
using (public.authorize('companies.delete'::text));


create policy "insert_policy"
on "public"."companies"
as permissive
for insert
to public
with check (public.authorize('companies.insert'::text));


create policy "read_all_policy"
on "public"."companies"
as permissive
for select
to authenticated
using (true);


create policy "update_policy"
on "public"."companies"
as permissive
for update
to public
using (public.authorize('companies.update'::text));


create policy "delete_policy"
on "public"."company_employees"
as permissive
for delete
to public
using (public.authorize('company_employees.delete'::text));


create policy "insert_policy"
on "public"."company_employees"
as permissive
for insert
to public
with check (public.authorize('company_employees.insert'::text));


create policy "read_all_policy"
on "public"."company_employees"
as permissive
for select
to authenticated
using (true);


create policy "update_policy"
on "public"."company_employees"
as permissive
for update
to public
using (public.authorize('company_employees.update'::text));


create policy "delete_policy"
on "public"."company_news"
as permissive
for delete
to public
using (public.authorize('company_news.delete'::text));


create policy "insert_policy"
on "public"."company_news"
as permissive
for insert
to public
with check (public.authorize('company_news.insert'::text));


create policy "read_all_policy"
on "public"."company_news"
as permissive
for select
to authenticated
using (true);


create policy "update_policy"
on "public"."company_news"
as permissive
for update
to public
using (public.authorize('company_news.update'::text));


create policy "delete_policy"
on "public"."contacts"
as permissive
for delete
to public
using (public.authorize('contacts.delete'::text));


create policy "insert_policy"
on "public"."contacts"
as permissive
for insert
to public
with check (public.authorize('contacts.insert'::text));


create policy "read_all_policy"
on "public"."contacts"
as permissive
for select
to authenticated
using (true);


create policy "update_policy"
on "public"."contacts"
as permissive
for update
to public
using (public.authorize('contacts.update'::text));


create policy "delete_policy"
on "public"."countries"
as permissive
for delete
to public
using (public.authorize('countries.delete'::text));


create policy "insert_policy"
on "public"."countries"
as permissive
for insert
to public
with check (public.authorize('countries.insert'::text));


create policy "read_all_policy"
on "public"."countries"
as permissive
for select
to authenticated
using (true);


create policy "update_policy"
on "public"."countries"
as permissive
for update
to public
using (public.authorize('countries.update'::text));


create policy "delete_policy"
on "public"."embeddings"
as permissive
for delete
to public
using (public.authorize('embeddings.delete'::text));


create policy "insert_policy"
on "public"."embeddings"
as permissive
for insert
to public
with check (public.authorize('embeddings.insert'::text));


create policy "read_all_policy"
on "public"."embeddings"
as permissive
for select
to authenticated
using (true);


create policy "update_policy"
on "public"."embeddings"
as permissive
for update
to public
using (public.authorize('embeddings.update'::text));


create policy "delete_policy"
on "public"."feedbacks"
as permissive
for delete
to public
using (public.authorize('feedbacks.delete'::text));


create policy "insert_policy"
on "public"."feedbacks"
as permissive
for insert
to authenticated
with check (public.authorize('feedbacks.insert'::text));


create policy "read_all_policy"
on "public"."feedbacks"
as permissive
for select
to authenticated
using (true);


create policy "update_policy"
on "public"."feedbacks"
as permissive
for update
to public
using (public.authorize('feedbacks.update'::text));


create policy "delete_policy"
on "public"."news"
as permissive
for delete
to public
using (public.authorize('news.delete'::text));


create policy "insert_policy"
on "public"."news"
as permissive
for insert
to public
with check (public.authorize('news.insert'::text));


create policy "read_all_policy"
on "public"."news"
as permissive
for select
to authenticated
using (true);


create policy "update_policy"
on "public"."news"
as permissive
for update
to public
using (public.authorize('news.update'::text));


create policy "delete_policy"
on "public"."news_embeddings"
as permissive
for delete
to public
using (public.authorize('news_embeddings.delete'::text));


create policy "insert_policy"
on "public"."news_embeddings"
as permissive
for insert
to public
with check (public.authorize('news_embeddings.insert'::text));


create policy "read_all_policy"
on "public"."news_embeddings"
as permissive
for select
to authenticated
using (true);


create policy "update_policy"
on "public"."news_embeddings"
as permissive
for update
to public
using (public.authorize('news_embeddings.update'::text));


create policy "delete_policy"
on "public"."news_tags"
as permissive
for delete
to public
using (public.authorize('news_tags.delete'::text));


create policy "insert_policy"
on "public"."news_tags"
as permissive
for insert
to public
with check (public.authorize('news_tags.insert'::text));


create policy "read_all_policy"
on "public"."news_tags"
as permissive
for select
to authenticated
using (true);


create policy "update_policy"
on "public"."news_tags"
as permissive
for update
to public
using (public.authorize('news_tags.update'::text));


create policy "delete_policy"
on "public"."plan_permissions"
as permissive
for delete
to public
using (public.authorize('plan_permissions.delete'::text));


create policy "insert_policy"
on "public"."plan_permissions"
as permissive
for insert
to public
with check (public.authorize('plan_permissions.insert'::text));


create policy "read_all_policy"
on "public"."plan_permissions"
as permissive
for select
to authenticated
using (true);


create policy "update_policy"
on "public"."plan_permissions"
as permissive
for update
to public
using (public.authorize('plan_permissions.update'::text));


create policy "delete_policy"
on "public"."research"
as permissive
for delete
to public
using (public.authorize('research.delete'::text));


create policy "insert_policy"
on "public"."research"
as permissive
for insert
to public
with check (public.authorize('research.insert'::text));


create policy "read_all_policy"
on "public"."research"
as permissive
for select
to authenticated
using (true);


create policy "update_policy"
on "public"."research"
as permissive
for update
to public
using (public.authorize('research.update'::text));


create policy "delete_policy"
on "public"."responses"
as permissive
for delete
to public
using (public.authorize('responses.delete'::text));


create policy "insert_policy"
on "public"."responses"
as permissive
for insert
to public
with check (public.authorize('responses.insert'::text));


create policy "read_all_policy"
on "public"."responses"
as permissive
for select
to authenticated
using (true);


create policy "update_policy"
on "public"."responses"
as permissive
for update
to public
using (public.authorize('responses.update'::text));


create policy "delete_policy"
on "public"."role_permissions"
as permissive
for delete
to public
using (public.authorize('role_permissions.delete'::text));


create policy "insert_policy"
on "public"."role_permissions"
as permissive
for insert
to public
with check (public.authorize('role_permissions.insert'::text));


create policy "read_all_policy"
on "public"."role_permissions"
as permissive
for select
to authenticated
using (true);


create policy "update_policy"
on "public"."role_permissions"
as permissive
for update
to public
using (public.authorize('role_permissions.update'::text));


create policy "delete_policy"
on "public"."searches"
as permissive
for delete
to public
using (public.authorize('searches.delete'::text));


create policy "insert_policy"
on "public"."searches"
as permissive
for insert
to public
with check (public.authorize('searches.insert'::text));


create policy "read_all_policy"
on "public"."searches"
as permissive
for select
to authenticated
using (true);


create policy "update_policy"
on "public"."searches"
as permissive
for update
to public
using (public.authorize('searches.update'::text));


create policy "delete_policy"
on "public"."social_media"
as permissive
for delete
to public
using (public.authorize('social_media.delete'::text));


create policy "insert_policy"
on "public"."social_media"
as permissive
for insert
to public
with check (public.authorize('social_media.insert'::text));


create policy "read_all_policy"
on "public"."social_media"
as permissive
for select
to authenticated
using (true);


create policy "update_policy"
on "public"."social_media"
as permissive
for update
to public
using (public.authorize('social_media.update'::text));


create policy "delete_policy"
on "public"."tags"
as permissive
for delete
to public
using (public.authorize('tags.delete'::text));


create policy "insert_policy"
on "public"."tags"
as permissive
for insert
to public
with check (public.authorize('tags.insert'::text));


create policy "read_all_policy"
on "public"."tags"
as permissive
for select
to authenticated
using (true);


create policy "update_policy"
on "public"."tags"
as permissive
for update
to public
using (public.authorize('tags.update'::text));


create policy "delete_policy"
on "public"."user_followers"
as permissive
for delete
to public
using (public.authorize('user_followers.delete'::text));


create policy "insert_policy"
on "public"."user_followers"
as permissive
for insert
to public
with check (public.authorize('user_followers.insert'::text));


create policy "read_all_policy"
on "public"."user_followers"
as permissive
for select
to authenticated
using (true);


create policy "update_policy"
on "public"."user_followers"
as permissive
for update
to public
using (public.authorize('user_followers.update'::text));


create policy "Enable read access for all users"
on "public"."user_profiles"
as permissive
for select
to public
using (true);


create policy "auth_all"
on "public"."user_profiles"
as permissive
for all
to supabase_auth_admin
using (true);


create policy "delete_policy"
on "public"."user_profiles"
as permissive
for delete
to public
using (public.authorize('user_profiles.delete'::text));


create policy "insert_policy"
on "public"."user_profiles"
as permissive
for insert
to public
with check (public.authorize('user_profiles.insert'::text));


create policy "read_all_policy"
on "public"."user_profiles"
as permissive
for select
to authenticated
using (true);


create policy "update_policy"
on "public"."user_profiles"
as permissive
for update
to public
using (public.authorize('user_profiles.update'::text));


CREATE TRIGGER columns_updateable BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.users_columns_updateable();


create policy "Give users access to own folder yuafil_0"
on "storage"."objects"
as permissive
for select
to public
using (((bucket_id = 'profile-public'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give users access to own folder yuafil_1"
on "storage"."objects"
as permissive
for insert
to public
with check (((bucket_id = 'profile-public'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give users access to own folder yuafil_2"
on "storage"."objects"
as permissive
for update
to public
using (((bucket_id = 'profile-public'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give users access to own folder yuafil_3"
on "storage"."objects"
as permissive
for delete
to public
using (((bucket_id = 'profile-public'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));



