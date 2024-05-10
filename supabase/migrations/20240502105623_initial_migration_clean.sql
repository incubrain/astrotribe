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

create EXTENSION if not exists "vector" with schema "public" version '0.6.2';

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

create type "public"."access_level" as enum ('Viewer', 'Editor', 'Admin', 'Super Admin');

create type "public"."address_type" as enum ('residential', 'headquarters', 'office', 'factory', 'lab', 'warehouse', 'research', 'retail', 'showroom', 'branch');

create type "public"."app_plan_enum" as enum ('free', 'basic', 'intermediate', 'premium', 'enterprise', 'custom');

create type "public"."app_role_enum" as enum ('guest', 'user', 'astroguide', 'mentor', 'moderator', 'tenant_member', 'tenant_admin', 'tenant_super_admin', 'admin', 'super_admin');

create type "public"."contact_type" as enum ('Personal', 'Company', 'Professional', 'Recruitment', 'Founder');

create type "public"."feedback_status" as enum ('new', 'under_review', 'backlog', 'working_on', 'resolved', 'rejected', 'deferred');

create type "public"."feedback_type" as enum ('bug_report', 'feature_request', 'user_interface_issue', 'performance_issue', 'documentation');

create type "public"."news_importance_level" as enum ('High', 'Medium', 'Low');

create type "public"."news_relation_type" as enum ('source', 'topic', 'mention');

create type "public"."privacy_level" as enum ('Private', 'Connected', 'Public');

create type "public"."scrape_frequency" as enum ('FourTimesDaily', 'TwiceDaily', 'Daily', 'Weekly', 'BiWeekly', 'Monthly');

create type "public"."user_status" as enum ('ONLINE', 'OFFLINE');

create sequence "public"."addresses_id_seq";

create sequence "public"."categories_id_seq";

create sequence "public"."cities_id_seq";

create sequence "public"."companies_id_seq";

create sequence "public"."contacts_id_seq";

create sequence "public"."countries_id_seq";

create sequence "public"."embeddings_id_seq";

create sequence "public"."feedback_id_seq";

create sequence "public"."news_embeddings_id_seq";

create sequence "public"."news_id_seq";

create sequence "public"."news_tags_id_seq";

create sequence "public"."responses_id_seq";

create sequence "public"."searches_id_seq";

create sequence "public"."social_media_id_seq";

create sequence "public"."tags_id_seq";

create table "public"."addresses" (
    "id" integer not null default nextval('addresses_id_seq'::regclass),
    "street1" character varying(255) not null,
    "street2" character varying(255),
    "city_id" integer not null,
    "country_id" integer not null,
    "name" character varying,
    "company_id" integer,
    "user_id" uuid,
    "is_primary" boolean default false,
    "address_type" address_type,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."addresses" enable row level security;

create table "public"."categories" (
    "id" bigint not null default nextval('categories_id_seq'::regclass),
    "created_at" timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    "body" character varying(255),
    "name" character varying(255) not null,
    "updated_at" timestamp with time zone default now()
);


alter table "public"."categories" enable row level security;

create table "public"."cities" (
    "id" integer not null default nextval('cities_id_seq'::regclass),
    "name" character varying(100) not null,
    "country_id" integer not null,
    "state" character varying
);


alter table "public"."cities" enable row level security;

create table "public"."companies" (
    "id" integer not null default nextval('companies_id_seq'::regclass),
    "name" character varying(255) not null,
    "description" text,
    "logo_url" character varying(255),
    "website_url" character varying(255) not null,
    "social_media_id" integer,
    "last_scraped_at" timestamp with time zone,
    "scrape_frequency" scrape_frequency,
    "category_id" integer,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "founding_year" smallint,
    "is_government" boolean not null default false
);


alter table "public"."companies" enable row level security;

create table "public"."company_employees" (
    "user_profile_id" uuid not null,
    "company_id" integer not null,
    "role" text not null,
    "job_description" text,
    "start_date" timestamp with time zone default CURRENT_TIMESTAMP,
    "end_date" timestamp with time zone,
    "status" boolean,
    "access_level" access_level not null default 'Viewer'::access_level,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."company_employees" enable row level security;

create table "public"."company_news" (
    "company_id" integer not null,
    "news_id" integer not null,
    "relation_type" news_relation_type not null,
    "importance_level" news_importance_level,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."company_news" enable row level security;

create table "public"."contacts" (
    "id" integer not null default nextval('contacts_id_seq'::regclass),
    "title" character varying(100),
    "is_primary" boolean default false,
    "email" character varying(255),
    "contact_type" contact_type,
    "privacy_level" privacy_level,
    "user_id" uuid,
    "company_id" integer,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "phone" character varying(50)
);


alter table "public"."contacts" enable row level security;

create table "public"."countries" (
    "id" integer not null default nextval('countries_id_seq'::regclass),
    "name" character varying(100) not null,
    "code" character varying(2) not null
);


alter table "public"."countries" enable row level security;

create table "public"."embeddings" (
    "id" bigint not null default nextval('embeddings_id_seq'::regclass),
    "vector" vector(1536),
    "type" text not null,
    "created_at" timestamp(6) with time zone default CURRENT_TIMESTAMP
);


alter table "public"."embeddings" enable row level security;

create table "public"."feedbacks" (
    "id" integer not null default nextval('feedback_id_seq'::regclass),
    "user_id" uuid,
    "page_identifier" character varying(255) not null,
    "feedback_type" feedback_type,
    "message" text not null,
    "created_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "device_info" text,
    "status" feedback_status default 'new'::feedback_status,
    "resolution_comment" text
);


alter table "public"."feedbacks" enable row level security;

create table "public"."news" (
    "id" bigint not null default nextval('news_id_seq'::regclass),
    "created_at" timestamp(6) with time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp(6) with time zone not null default now(),
    "title" character varying(255) not null,
    "body" text not null,
    "category_id" bigint not null default '31'::bigint,
    "author" text,
    "description" text,
    "featured_image" text,
    "has_summary" boolean not null default false,
    "published_at" timestamp with time zone,
    "source" character varying not null,
    "url" text not null
);


alter table "public"."news" enable row level security;

create table "public"."news_embeddings" (
    "id" bigint not null default nextval('news_embeddings_id_seq'::regclass),
    "news_id" bigint not null,
    "embedding_id" bigint not null
);


alter table "public"."news_embeddings" enable row level security;

create table "public"."news_tags" (
    "id" integer not null default nextval('news_tags_id_seq'::regclass),
    "news_id" bigint not null,
    "tag_id" integer not null
);


alter table "public"."news_tags" enable row level security;

create table "public"."plan_permissions" (
    "id" integer generated by default as identity not null,
    "plan" app_plan_enum not null,
    "feature" character varying not null
);


alter table "public"."plan_permissions" enable row level security;

create table "public"."research" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now(),
    "published_at" timestamp with time zone,
    "title" text,
    "url" character varying not null,
    "body" text,
    "author" character varying,
    "description" text,
    "version" smallint
);


alter table "public"."research" enable row level security;

create table "public"."responses" (
    "id" bigint generated by default as identity not null,
    "search_id" bigint not null,
    "output" text not null,
    "upvotes" integer default 0,
    "downvotes" integer default 0,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."responses" enable row level security;

create table "public"."role_permissions" (
    "id" integer generated by default as identity not null,
    "role" app_role_enum not null,
    "select" boolean default false,
    "insert" boolean default false,
    "update" boolean default false,
    "delete" boolean default false,
    "table_name" character varying not null
);


alter table "public"."role_permissions" enable row level security;

create table "public"."searches" (
    "id" bigint generated by default as identity not null,
    "user_id" uuid,
    "input" text not null,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."searches" enable row level security;

create table "public"."social_media" (
    "id" integer not null default nextval('social_media_id_seq'::regclass),
    "facebook_url" character varying(255),
    "twitter_url" character varying(255),
    "linkedin_url" character varying(255),
    "instagram_url" character varying(255),
    "youtube_url" character varying,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."social_media" enable row level security;

create table "public"."tags" (
    "id" integer not null default nextval('tags_id_seq'::regclass),
    "body" text,
    "created_at" time with time zone default now(),
    "updated_at" time with time zone default now(),
    "name" text not null
);


alter table "public"."tags" enable row level security;

create table "public"."user_followers" (
    "id" uuid not null,
    "created_at" timestamp(6) with time zone default CURRENT_TIMESTAMP,
    "follower_id" uuid not null,
    "followed_id" uuid not null
);


alter table "public"."user_followers" enable row level security;

create table "public"."user_profiles" (
    "email" text not null,
    "given_name" text,
    "surname" text,
    "username" character varying,
    "dob" date,
    "gender_id" smallint,
    "created_at" timestamp(6) with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp(6) with time zone default CURRENT_TIMESTAMP,
    "last_seen" timestamp(6) with time zone default CURRENT_TIMESTAMP,
    "avatar" text,
    "cover_image" text default ''::text,
    "introduction" text,
    "quote" text,
    "followed_count" integer default 0,
    "followers_count" integer default 0,
    "id" uuid not null default uuid_generate_v4(),
    "plan" app_plan_enum default 'free'::app_plan_enum,
    "role" app_role_enum not null default 'user'::app_role_enum
);


alter table "public"."user_profiles" enable row level security;

alter sequence "public"."addresses_id_seq" owned by "public"."addresses"."id";

alter sequence "public"."categories_id_seq" owned by "public"."categories"."id";

alter sequence "public"."cities_id_seq" owned by "public"."cities"."id";

alter sequence "public"."companies_id_seq" owned by "public"."companies"."id";

alter sequence "public"."contacts_id_seq" owned by "public"."contacts"."id";

alter sequence "public"."countries_id_seq" owned by "public"."countries"."id";

alter sequence "public"."embeddings_id_seq" owned by "public"."embeddings"."id";

alter sequence "public"."feedback_id_seq" owned by "public"."feedbacks"."id";

alter sequence "public"."news_embeddings_id_seq" owned by "public"."news_embeddings"."id";

alter sequence "public"."news_id_seq" owned by "public"."news"."id";

alter sequence "public"."news_tags_id_seq" owned by "public"."news_tags"."id";

alter sequence "public"."responses_id_seq" owned by "public"."responses"."id";

alter sequence "public"."searches_id_seq" owned by "public"."searches"."id";

alter sequence "public"."social_media_id_seq" owned by "public"."social_media"."id";

alter sequence "public"."tags_id_seq" owned by "public"."tags"."id";

CREATE UNIQUE INDEX addresses_pkey ON public.addresses USING btree (id);

CREATE UNIQUE INDEX categories_pkey ON public.categories USING btree (id);

CREATE UNIQUE INDEX categories_title_key ON public.categories USING btree (name);

CREATE UNIQUE INDEX cities_name_key ON public.cities USING btree (name);

CREATE UNIQUE INDEX cities_pkey ON public.cities USING btree (id);

CREATE UNIQUE INDEX companies_pkey ON public.companies USING btree (id);

CREATE UNIQUE INDEX companies_website_url_key ON public.companies USING btree (website_url);

CREATE UNIQUE INDEX company_employees_pkey ON public.company_employees USING btree (user_profile_id, company_id);

CREATE UNIQUE INDEX company_news_pkey ON public.company_news USING btree (company_id, news_id);

CREATE UNIQUE INDEX contacts_pkey ON public.contacts USING btree (id);

CREATE UNIQUE INDEX countries_name_key ON public.countries USING btree (name);

CREATE UNIQUE INDEX countries_pkey ON public.countries USING btree (id);

CREATE UNIQUE INDEX embeddings_pkey ON public.embeddings USING btree (id);

CREATE UNIQUE INDEX feedback_pkey ON public.feedbacks USING btree (id);

CREATE INDEX idx_addresses_city_id ON public.addresses USING btree (city_id);

CREATE INDEX idx_addresses_country_id ON public.addresses USING btree (country_id);

CREATE INDEX idx_cities_country_id ON public.cities USING btree (country_id);

CREATE INDEX idx_companies_category ON public.companies USING btree (category_id);

CREATE INDEX idx_companies_name ON public.companies USING btree (name);

CREATE UNIQUE INDEX news_embeddings_pkey ON public.news_embeddings USING btree (id);

CREATE UNIQUE INDEX news_pkey ON public.news USING btree (id);

CREATE UNIQUE INDEX news_tags_pkey ON public.news_tags USING btree (id);

CREATE UNIQUE INDEX news_url_key ON public.news USING btree (url);

CREATE UNIQUE INDEX research_pkey ON public.research USING btree (id);

CREATE UNIQUE INDEX research_url_key ON public.research USING btree (url);

CREATE UNIQUE INDEX responses_id_key ON public.responses USING btree (id);

CREATE UNIQUE INDEX responses_pkey ON public.responses USING btree (id);

CREATE UNIQUE INDEX role_permission_unique ON public.role_permissions USING btree (role, table_name);

CREATE UNIQUE INDEX role_permissions_pkey ON public.role_permissions USING btree (id);

CREATE UNIQUE INDEX searches_pkey ON public.searches USING btree (id);

CREATE UNIQUE INDEX social_media_pkey ON public.social_media USING btree (id);

CREATE UNIQUE INDEX tags_name_key ON public.tags USING btree (name);

CREATE UNIQUE INDEX tags_pkey ON public.tags USING btree (id);

CREATE UNIQUE INDEX user_followers_pkey ON public.user_followers USING btree (id);

CREATE UNIQUE INDEX user_profiles_pkey ON public.user_profiles USING btree (id);

CREATE UNIQUE INDEX users_auth_id_key ON public.user_profiles USING btree (id);

CREATE UNIQUE INDEX users_email_key ON public.user_profiles USING btree (email);

alter table "public"."addresses" add constraint "addresses_pkey" PRIMARY KEY using index "addresses_pkey";

alter table "public"."categories" add constraint "categories_pkey" PRIMARY KEY using index "categories_pkey";

alter table "public"."cities" add constraint "cities_pkey" PRIMARY KEY using index "cities_pkey";

alter table "public"."companies" add constraint "companies_pkey" PRIMARY KEY using index "companies_pkey";

alter table "public"."company_employees" add constraint "company_employees_pkey" PRIMARY KEY using index "company_employees_pkey";

alter table "public"."company_news" add constraint "company_news_pkey" PRIMARY KEY using index "company_news_pkey";

alter table "public"."contacts" add constraint "contacts_pkey" PRIMARY KEY using index "contacts_pkey";

alter table "public"."countries" add constraint "countries_pkey" PRIMARY KEY using index "countries_pkey";

alter table "public"."embeddings" add constraint "embeddings_pkey" PRIMARY KEY using index "embeddings_pkey";

alter table "public"."feedbacks" add constraint "feedback_pkey" PRIMARY KEY using index "feedback_pkey";

alter table "public"."news" add constraint "news_pkey" PRIMARY KEY using index "news_pkey";

alter table "public"."news_embeddings" add constraint "news_embeddings_pkey" PRIMARY KEY using index "news_embeddings_pkey";

alter table "public"."news_tags" add constraint "news_tags_pkey" PRIMARY KEY using index "news_tags_pkey";

alter table "public"."research" add constraint "research_pkey" PRIMARY KEY using index "research_pkey";

alter table "public"."responses" add constraint "responses_pkey" PRIMARY KEY using index "responses_pkey";

alter table "public"."role_permissions" add constraint "role_permissions_pkey" PRIMARY KEY using index "role_permissions_pkey";

alter table "public"."searches" add constraint "searches_pkey" PRIMARY KEY using index "searches_pkey";

alter table "public"."social_media" add constraint "social_media_pkey" PRIMARY KEY using index "social_media_pkey";

alter table "public"."tags" add constraint "tags_pkey" PRIMARY KEY using index "tags_pkey";

alter table "public"."user_followers" add constraint "user_followers_pkey" PRIMARY KEY using index "user_followers_pkey";

alter table "public"."user_profiles" add constraint "user_profiles_pkey" PRIMARY KEY using index "user_profiles_pkey";

alter table "public"."addresses" add constraint "fk_city" FOREIGN KEY (city_id) REFERENCES cities(id) not valid;

alter table "public"."addresses" validate constraint "fk_city";

alter table "public"."addresses" add constraint "fk_country" FOREIGN KEY (country_id) REFERENCES countries(id) not valid;

alter table "public"."addresses" validate constraint "fk_country";

alter table "public"."addresses" add constraint "public_addresses_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."addresses" validate constraint "public_addresses_company_id_fkey";

alter table "public"."addresses" add constraint "public_addresses_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."addresses" validate constraint "public_addresses_user_id_fkey";

alter table "public"."cities" add constraint "cities_name_key" UNIQUE using index "cities_name_key";

alter table "public"."cities" add constraint "fk_country" FOREIGN KEY (country_id) REFERENCES countries(id) not valid;

alter table "public"."cities" validate constraint "fk_country";

alter table "public"."companies" add constraint "companies_website_url_key" UNIQUE using index "companies_website_url_key";

alter table "public"."companies" add constraint "fk_category" FOREIGN KEY (category_id) REFERENCES categories(id) not valid;

alter table "public"."companies" validate constraint "fk_category";

alter table "public"."companies" add constraint "fk_social_media" FOREIGN KEY (social_media_id) REFERENCES social_media(id) not valid;

alter table "public"."companies" validate constraint "fk_social_media";

alter table "public"."company_employees" add constraint "company_employees_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) not valid;

alter table "public"."company_employees" validate constraint "company_employees_company_id_fkey";

alter table "public"."company_employees" add constraint "company_employees_user_profile_id_fkey" FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id) not valid;

alter table "public"."company_employees" validate constraint "company_employees_user_profile_id_fkey";

alter table "public"."company_news" add constraint "company_news_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) not valid;

alter table "public"."company_news" validate constraint "company_news_company_id_fkey";

alter table "public"."company_news" add constraint "company_news_news_id_fkey" FOREIGN KEY (news_id) REFERENCES news(id) not valid;

alter table "public"."company_news" validate constraint "company_news_news_id_fkey";

alter table "public"."contacts" add constraint "fk_company" FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE not valid;

alter table "public"."contacts" validate constraint "fk_company";

alter table "public"."contacts" add constraint "fk_user" FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."contacts" validate constraint "fk_user";

alter table "public"."countries" add constraint "countries_name_key" UNIQUE using index "countries_name_key";

alter table "public"."feedbacks" add constraint "fk_user" FOREIGN KEY (user_id) REFERENCES user_profiles(id) not valid;

alter table "public"."feedbacks" validate constraint "fk_user";

alter table "public"."news" add constraint "news_category_id_fkey" FOREIGN KEY (category_id) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."news" validate constraint "news_category_id_fkey";

alter table "public"."news" add constraint "news_url_key" UNIQUE using index "news_url_key";

alter table "public"."news_embeddings" add constraint "news_embeddings_embedding_id_fkey" FOREIGN KEY (embedding_id) REFERENCES embeddings(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."news_embeddings" validate constraint "news_embeddings_embedding_id_fkey";

alter table "public"."news_embeddings" add constraint "news_embeddings_news_id_fkey" FOREIGN KEY (news_id) REFERENCES news(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."news_embeddings" validate constraint "news_embeddings_news_id_fkey";

alter table "public"."news_tags" add constraint "news_tags_news_id_fkey" FOREIGN KEY (news_id) REFERENCES news(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."news_tags" validate constraint "news_tags_news_id_fkey";

alter table "public"."news_tags" add constraint "news_tags_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES tags(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."news_tags" validate constraint "news_tags_tag_id_fkey";

alter table "public"."research" add constraint "research_url_key" UNIQUE using index "research_url_key";

alter table "public"."responses" add constraint "responses_id_key" UNIQUE using index "responses_id_key";

alter table "public"."responses" add constraint "responses_search_id_fkey" FOREIGN KEY (search_id) REFERENCES searches(id) not valid;

alter table "public"."responses" validate constraint "responses_search_id_fkey";

alter table "public"."role_permissions" add constraint "role_permission_unique" UNIQUE using index "role_permission_unique";

alter table "public"."searches" add constraint "searches_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles(id) not valid;

alter table "public"."searches" validate constraint "searches_user_id_fkey";

alter table "public"."user_profiles" add constraint "public_user_profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_profiles" validate constraint "public_user_profiles_id_fkey";

alter table "public"."user_profiles" add constraint "users_email_key" UNIQUE using index "users_email_key";

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
        EXECUTE format('CREATE POLICY insert_policy ON %I.%I FOR INSERT WITH CHECK (authorize(%L))', 
            'public', table_info.tablename, table_info.tablename || '.insert');

        -- Create or replace policies for UPDATE
        EXECUTE format('CREATE POLICY update_policy ON %I.%I FOR UPDATE USING (authorize(%L))', 
            'public', table_info.tablename, table_info.tablename || '.update');

        -- Create or replace policies for DELETE
        EXECUTE format('CREATE POLICY delete_policy ON %I.%I FOR DELETE USING (authorize(%L))', 
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

CREATE TRIGGER create_user_profile AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION create_user_profile();

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
using (authorize('addresses.delete'::text));


create policy "insert_policy"
on "public"."addresses"
as permissive
for insert
to public
with check (authorize('addresses.insert'::text));


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
using (authorize('addresses.update'::text));


create policy "delete_policy"
on "public"."categories"
as permissive
for delete
to public
using (authorize('categories.delete'::text));


create policy "insert_policy"
on "public"."categories"
as permissive
for insert
to public
with check (authorize('categories.insert'::text));


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
using (authorize('categories.update'::text));


create policy "delete_policy"
on "public"."cities"
as permissive
for delete
to public
using (authorize('cities.delete'::text));


create policy "insert_policy"
on "public"."cities"
as permissive
for insert
to public
with check (authorize('cities.insert'::text));


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
using (authorize('cities.update'::text));


create policy "delete_policy"
on "public"."companies"
as permissive
for delete
to public
using (authorize('companies.delete'::text));


create policy "insert_policy"
on "public"."companies"
as permissive
for insert
to public
with check (authorize('companies.insert'::text));


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
using (authorize('companies.update'::text));


create policy "delete_policy"
on "public"."company_employees"
as permissive
for delete
to public
using (authorize('company_employees.delete'::text));


create policy "insert_policy"
on "public"."company_employees"
as permissive
for insert
to public
with check (authorize('company_employees.insert'::text));


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
using (authorize('company_employees.update'::text));


create policy "delete_policy"
on "public"."company_news"
as permissive
for delete
to public
using (authorize('company_news.delete'::text));


create policy "insert_policy"
on "public"."company_news"
as permissive
for insert
to public
with check (authorize('company_news.insert'::text));


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
using (authorize('company_news.update'::text));


create policy "delete_policy"
on "public"."contacts"
as permissive
for delete
to public
using (authorize('contacts.delete'::text));


create policy "insert_policy"
on "public"."contacts"
as permissive
for insert
to public
with check (authorize('contacts.insert'::text));


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
using (authorize('contacts.update'::text));


create policy "delete_policy"
on "public"."countries"
as permissive
for delete
to public
using (authorize('countries.delete'::text));


create policy "insert_policy"
on "public"."countries"
as permissive
for insert
to public
with check (authorize('countries.insert'::text));


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
using (authorize('countries.update'::text));


create policy "delete_policy"
on "public"."embeddings"
as permissive
for delete
to public
using (authorize('embeddings.delete'::text));


create policy "insert_policy"
on "public"."embeddings"
as permissive
for insert
to public
with check (authorize('embeddings.insert'::text));


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
using (authorize('embeddings.update'::text));


create policy "delete_policy"
on "public"."feedbacks"
as permissive
for delete
to public
using (authorize('feedbacks.delete'::text));


create policy "insert_policy"
on "public"."feedbacks"
as permissive
for insert
to authenticated
with check (authorize('feedbacks.insert'::text));


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
using (authorize('feedbacks.update'::text));


create policy "delete_policy"
on "public"."news"
as permissive
for delete
to public
using (authorize('news.delete'::text));


create policy "insert_policy"
on "public"."news"
as permissive
for insert
to public
with check (authorize('news.insert'::text));


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
using (authorize('news.update'::text));


create policy "delete_policy"
on "public"."news_embeddings"
as permissive
for delete
to public
using (authorize('news_embeddings.delete'::text));


create policy "insert_policy"
on "public"."news_embeddings"
as permissive
for insert
to public
with check (authorize('news_embeddings.insert'::text));


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
using (authorize('news_embeddings.update'::text));


create policy "delete_policy"
on "public"."news_tags"
as permissive
for delete
to public
using (authorize('news_tags.delete'::text));


create policy "insert_policy"
on "public"."news_tags"
as permissive
for insert
to public
with check (authorize('news_tags.insert'::text));


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
using (authorize('news_tags.update'::text));


create policy "delete_policy"
on "public"."plan_permissions"
as permissive
for delete
to public
using (authorize('plan_permissions.delete'::text));


create policy "insert_policy"
on "public"."plan_permissions"
as permissive
for insert
to public
with check (authorize('plan_permissions.insert'::text));


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
using (authorize('plan_permissions.update'::text));


create policy "delete_policy"
on "public"."research"
as permissive
for delete
to public
using (authorize('research.delete'::text));


create policy "insert_policy"
on "public"."research"
as permissive
for insert
to public
with check (authorize('research.insert'::text));


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
using (authorize('research.update'::text));


create policy "delete_policy"
on "public"."responses"
as permissive
for delete
to public
using (authorize('responses.delete'::text));


create policy "insert_policy"
on "public"."responses"
as permissive
for insert
to public
with check (authorize('responses.insert'::text));


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
using (authorize('responses.update'::text));


create policy "delete_policy"
on "public"."role_permissions"
as permissive
for delete
to public
using (authorize('role_permissions.delete'::text));


create policy "insert_policy"
on "public"."role_permissions"
as permissive
for insert
to public
with check (authorize('role_permissions.insert'::text));


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
using (authorize('role_permissions.update'::text));


create policy "delete_policy"
on "public"."searches"
as permissive
for delete
to public
using (authorize('searches.delete'::text));


create policy "insert_policy"
on "public"."searches"
as permissive
for insert
to public
with check (authorize('searches.insert'::text));


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
using (authorize('searches.update'::text));


create policy "delete_policy"
on "public"."social_media"
as permissive
for delete
to public
using (authorize('social_media.delete'::text));


create policy "insert_policy"
on "public"."social_media"
as permissive
for insert
to public
with check (authorize('social_media.insert'::text));


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
using (authorize('social_media.update'::text));


create policy "delete_policy"
on "public"."tags"
as permissive
for delete
to public
using (authorize('tags.delete'::text));


create policy "insert_policy"
on "public"."tags"
as permissive
for insert
to public
with check (authorize('tags.insert'::text));


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
using (authorize('tags.update'::text));


create policy "delete_policy"
on "public"."user_followers"
as permissive
for delete
to public
using (authorize('user_followers.delete'::text));


create policy "insert_policy"
on "public"."user_followers"
as permissive
for insert
to public
with check (authorize('user_followers.insert'::text));


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
using (authorize('user_followers.update'::text));


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
using (authorize('user_profiles.delete'::text));


create policy "insert_policy"
on "public"."user_profiles"
as permissive
for insert
to public
with check (authorize('user_profiles.insert'::text));


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
using (authorize('user_profiles.update'::text));


CREATE TRIGGER columns_updateable BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION users_columns_updateable();


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



