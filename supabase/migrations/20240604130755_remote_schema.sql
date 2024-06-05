-- 1. Create sequences
CREATE SEQUENCE IF NOT EXISTS "public"."addresses_id_seq";
CREATE SEQUENCE IF NOT EXISTS "public"."categories_id_seq";
CREATE SEQUENCE IF NOT EXISTS "public"."cities_id_seq";
CREATE SEQUENCE IF NOT EXISTS "public"."companies_id_seq";
CREATE SEQUENCE IF NOT EXISTS "public"."contacts_id_seq";
CREATE SEQUENCE IF NOT EXISTS "public"."countries_id_seq";
CREATE SEQUENCE IF NOT EXISTS "public"."embeddings_id_seq";
CREATE SEQUENCE IF NOT EXISTS "public"."feedback_id_seq";
CREATE SEQUENCE IF NOT EXISTS "public"."news_embeddings_id_seq";
CREATE SEQUENCE IF NOT EXISTS "public"."news_id_seq";
CREATE SEQUENCE IF NOT EXISTS "public"."news_tags_id_seq";
CREATE SEQUENCE IF NOT EXISTS "public"."responses_id_seq";
CREATE SEQUENCE IF NOT EXISTS "public"."searches_id_seq";
CREATE SEQUENCE IF NOT EXISTS "public"."social_media_id_seq";
CREATE SEQUENCE IF NOT EXISTS "public"."tags_id_seq";


-- 2. Drop constraints
alter table "public"."addresses" drop constraint "fk_company_id";
alter table "public"."addresses" drop constraint "fk_user_id";
alter table "public"."categories" drop constraint "categories_name_key";
alter table "public"."companies" drop constraint "fk_category_id";
alter table "public"."companies" drop constraint "fk_social_media_id";
alter table "public"."company_employees" drop constraint "fk_company_id";
alter table "public"."company_employees" drop constraint "fk_user_id";
alter table "public"."company_news" drop constraint "fk_company_id";
alter table "public"."company_news" drop constraint "fk_news_id";
alter table "public"."contacts" drop constraint "fk_company_id";
alter table "public"."contacts" drop constraint "fk_user_id";
alter table "public"."feedbacks" drop constraint "fk_user_id";
alter table "public"."news" drop constraint "fk_category_id";
alter table "public"."news_embeddings" drop constraint "fk_embedding_id";
alter table "public"."news_embeddings" drop constraint "fk_news_id";
alter table "public"."news_tags" drop constraint "fk_news_id";
alter table "public"."news_tags" drop constraint "fk_tag_id";
alter table "public"."responses" drop constraint "fk_search_id";
alter table "public"."role_permissions" drop constraint "role_permissions_role_table_name_key";
alter table "public"."searches" drop constraint "fk_user_id";
alter table "public"."tags" drop constraint "tags_name_key";
alter table "public"."user_followers" drop constraint "user_followers_followed_id_fkey";
alter table "public"."user_followers" drop constraint "user_followers_follower_id_fkey";
alter table "public"."user_profiles" drop constraint "fk_auth_id";
alter table "public"."user_profiles" drop constraint "user_profiles_email_key";
alter table "public"."feedbacks" drop constraint "feedbacks_pkey";
alter table "public"."plan_permissions" drop constraint "plan_permissions_pkey";

-- 3. Drop indexes
drop index if exists "public"."categories_name_key";
drop index if exists "public"."feedbacks_pkey";
drop index if exists "public"."idx_unique_company_news";
drop index if exists "public"."idx_unique_user_company";
drop index if exists "public"."plan_permissions_pkey";
drop index if exists "public"."role_permissions_role_table_name_key";
drop index if exists "public"."user_profiles_email_key";

-- alter table "public"."company_employees" drop column "id";
-- alter table "public"."company_news" drop column "id";

-- Addresses

-- Categories
ALTER TABLE "public"."categories" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "public"."categories" ALTER COLUMN "created_at" SET NOT NULL;
ALTER TABLE "public"."categories" ALTER COLUMN "created_at" SET DATA TYPE timestamp(6) with time zone USING "created_at"::timestamp(6) with time zone;


-- Company Employees
ALTER TABLE "public"."company_employees" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "public"."company_employees" ALTER COLUMN "start_date" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "public"."company_employees" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- Company News
ALTER TABLE "public"."company_news" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "public"."company_news" ALTER COLUMN "relation_type" DROP DEFAULT;
ALTER TABLE "public"."company_news" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- Contacts
ALTER TABLE "public"."contacts" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "public"."contacts" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- Feedbacks
ALTER TABLE "public"."feedbacks" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "public"."feedbacks" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- News
ALTER TABLE "public"."news" ALTER COLUMN "category_id" SET DATA TYPE bigint USING "category_id"::bigint;
ALTER TABLE "public"."news" ALTER COLUMN "category_id" SET DEFAULT '16'::bigint;
ALTER TABLE "public"."news" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "public"."news" ALTER COLUMN "created_at" SET DATA TYPE timestamp(6) with time zone USING "created_at"::timestamp(6) with time zone;
ALTER TABLE "public"."news" ALTER COLUMN "created_at" SET NOT NULL;
ALTER TABLE "public"."news" ALTER COLUMN "updated_at" SET DATA TYPE timestamp(6) with time zone USING "updated_at"::timestamp(6) with time zone;
ALTER TABLE "public"."news" ALTER COLUMN "updated_at" SET NOT NULL;

-- News Embeddings
ALTER TABLE "public"."news_embeddings" ALTER COLUMN "id" SET DATA TYPE bigint USING "id"::bigint;


-- Research
ALTER TABLE "public"."research" ALTER COLUMN "id" DROP IDENTITY IF EXISTS;
ALTER TABLE "public"."research" ADD COLUMN "uuid_id" UUID;
ALTER TABLE "public"."research" DROP COLUMN "id";
ALTER TABLE "public"."research" RENAME COLUMN "uuid_id" TO "id";
ALTER TABLE "public"."research" ADD PRIMARY KEY ("id");



ALTER TABLE "public"."research" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;

-- Responses
ALTER TABLE "public"."responses" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- Role Permissions

-- Searches
ALTER TABLE "public"."searches" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- User Followers
ALTER TABLE "public"."user_followers" ALTER COLUMN "id" DROP IDENTITY IF EXISTS;
ALTER TABLE "public"."user_followers" ADD COLUMN "uuid_id" UUID;
ALTER TABLE "public"."user_followers" DROP COLUMN "id";
ALTER TABLE "public"."user_followers" RENAME COLUMN "uuid_id" TO "id";
ALTER TABLE "public"."user_followers" ADD PRIMARY KEY ("id");
ALTER TABLE "public"."user_followers" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "public"."user_followers" ALTER COLUMN "created_at" SET DATA TYPE timestamp(6) with time zone USING "created_at"::timestamp(6) with time zone;

-- User Profiles
ALTER TABLE "public"."user_profiles" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "public"."user_profiles" ALTER COLUMN "created_at" SET DATA TYPE timestamp(6) with time zone USING "created_at"::timestamp(6) with time zone;
ALTER TABLE "public"."user_profiles" ALTER COLUMN "last_seen" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "public"."user_profiles" ALTER COLUMN "last_seen" SET DATA TYPE timestamp(6) with time zone USING "last_seen"::timestamp(6) with time zone;
ALTER TABLE "public"."user_profiles" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "public"."user_profiles" ALTER COLUMN "updated_at" SET DATA TYPE timestamp(6) with time zone USING "updated_at"::timestamp(6) with time zone;


-- 8. Create functions and triggers
set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_user_app_metadata()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = jsonb_set(
    jsonb_set(raw_app_meta_data, '{plan}', to_jsonb(NEW.plan), true),
    '{role}', to_jsonb(NEW.role), true
  )
  WHERE id = NEW.id;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_user_metadata()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_set(
    jsonb_set(
      jsonb_set(raw_user_meta_data, '{given_name}', to_jsonb(NEW.given_name), true),
      '{surname}', to_jsonb(NEW.surname), true
    ),
    '{avatar}', to_jsonb(NEW.avatar), true
  )
  WHERE id = NEW.id;
  RETURN NEW;
END;
$function$
;

CREATE TRIGGER insert_user_metadata_trigger AFTER INSERT ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_user_metadata();