-- Create sequence for social_media_id_seq
CREATE SEQUENCE "public"."social_media_id_seq";

-- Alter tables and drop constraints
ALTER TABLE "public"."follows" DROP CONSTRAINT IF EXISTS "follows_follower_id_followed_id_followed_entity_key";
ALTER TABLE "public"."votes" DROP CONSTRAINT IF EXISTS "votes_content_type_content_id_user_id_key";

-- Drop indexes if they exist
DROP INDEX IF EXISTS "public"."follows_follower_id_followed_id_followed_entity_key";
DROP INDEX IF EXISTS "public"."votes_content_type_content_id_user_id_key";

-- Alter content_type enum
ALTER TABLE "public"."contents" ALTER COLUMN "content_type" DROP DEFAULT;
ALTER TYPE "public"."content_type" RENAME TO "content_type__old_version_to_be_dropped";

-- Create new content_type enum
CREATE TYPE "public"."content_type" AS ENUM ('news', 'events', 'jobs', 'research', 'companies', 'contact', 'people', 'newsletters', 'unknown');

-- Create feed_sources table
CREATE TABLE "public"."feed_sources" (
    "id" BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    "feed_id" UUID,
    "source_id" UUID,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create public.role_permissions_materialized table
CREATE TABLE "public"."role_permissions_materialized" (
    "role" public.app_role_enum NOT NULL,
    "permissions" JSONB NOT NULL,
    "last_updated" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (role)
);

-- Enable RLS on public.role_permissions_materialized
ALTER TABLE "public"."role_permissions_materialized" ENABLE ROW LEVEL SECURITY;

-- Alter columns to use new content_type
ALTER TABLE "public"."classified_urls" ALTER COLUMN actual_category TYPE "public"."content_type" USING actual_category::text::"public"."content_type";
ALTER TABLE "public"."classified_urls" ALTER COLUMN predicted_category TYPE "public"."content_type" USING predicted_category::text::"public"."content_type";
ALTER TABLE "public"."comments" ALTER COLUMN content_type TYPE "public"."content_type" USING content_type::text::"public"."content_type";
ALTER TABLE "public"."content_sources" ALTER COLUMN content_type TYPE "public"."content_type" USING content_type::text::"public"."content_type";
ALTER TABLE "public"."contents" ALTER COLUMN content_type TYPE "public"."content_type" USING content_type::text::"public"."content_type";
ALTER TABLE "public"."contents" ALTER COLUMN "content_type" SET DEFAULT 'companies'::public.content_type;

-- Drop old content_type enum
DROP TYPE "public"."content_type__old_version_to_be_dropped";

-- Alter social_media table
ALTER TABLE "public"."social_media" ALTER COLUMN "id" SET DEFAULT nextval('public.social_media_id_seq'::regclass);

-- Drop the existing columns
ALTER TABLE public.tags 
DROP COLUMN IF EXISTS created_at,
DROP COLUMN IF EXISTS updated_at;

-- Add new columns with correct types and defaults
ALTER TABLE public.tags 
ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Create indexes
CREATE INDEX feed_sources_feed_id_idx ON public.feed_sources USING btree (feed_id);
CREATE UNIQUE INDEX feed_sources_feed_source_unique_idx ON public.feed_sources USING btree (feed_id, source_id);
CREATE INDEX feed_sources_source_id_idx ON public.feed_sources USING btree (source_id);
CREATE UNIQUE INDEX follows_unique_follower_following_idx ON public.follows USING btree (follower_id, followed_id, followed_entity);
CREATE UNIQUE INDEX votes_unique_user_content_vote_idx ON public.votes USING btree (content_type, content_id, user_id);

-- Add constraints using indexes
ALTER TABLE "public"."feed_sources" ADD CONSTRAINT "feed_sources_feed_id_fkey" FOREIGN KEY (feed_id) REFERENCES public.feeds(id) ON DELETE CASCADE NOT VALID;
ALTER TABLE "public"."feed_sources" VALIDATE CONSTRAINT "feed_sources_feed_id_fkey";

ALTER TABLE "public"."feed_sources" ADD CONSTRAINT "feed_sources_source_id_fkey" FOREIGN KEY (source_id) REFERENCES public.contents(id) ON DELETE CASCADE NOT VALID;
ALTER TABLE "public"."feed_sources" VALIDATE CONSTRAINT "feed_sources_source_id_fkey";

ALTER TABLE "public"."follows" ADD CONSTRAINT "follows_unique_follower_following_idx" UNIQUE USING INDEX "follows_unique_follower_following_idx";

ALTER TABLE "public"."votes" ADD CONSTRAINT "votes_unique_user_content_vote_idx" UNIQUE USING INDEX "votes_unique_user_content_vote_idx";

-- Set check_function_bodies to off
SET check_function_bodies = off;

-- Define functions related to materialized permissions
-- Function: refresh_materialized_permissions()
CREATE OR REPLACE FUNCTION public.refresh_materialized_permissions()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Clear existing materialized permissions
    DELETE FROM public.role_permissions_materialized;
    
    -- Insert flattened permissions for each role
    INSERT INTO public.role_permissions_materialized (role, permissions)
    SELECT 
        role,
        jsonb_object_agg(
            table_name,
            jsonb_build_object(
                'select', COALESCE(permissions->>'select', 'false')::boolean,
                'insert', COALESCE(permissions->>'insert', 'false')::boolean,
                'update', COALESCE(permissions->>'update', 'false')::boolean,
                'delete', COALESCE(permissions->>'delete', 'false')::boolean
            )
        ) as permissions
    FROM (
        SELECT DISTINCT ON (role, table_name)
            role,
            table_name,
            permissions
        FROM public.role_permissions
        ORDER BY role, table_name, id DESC
    ) flattened
    GROUP BY role;
END;
$function$;

-- Function: refresh_materialized_permissions_trigger()
CREATE OR REPLACE FUNCTION public.refresh_materialized_permissions_trigger()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    PERFORM refresh_materialized_permissions();
    RETURN NEW;
END;
$function$;

-- Updated authorize function
CREATE OR REPLACE FUNCTION public.authorize(requested_permission text)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
    user_role public.app_role_enum;
    v_table_name TEXT;
    operation TEXT;
    cached_perms jsonb;
    check_result boolean;
BEGIN
    -- Service role bypass
    IF (auth.jwt() ->> 'role') = 'service_role' THEN
        RETURN TRUE;
    END IF;

    -- Get user role once
    user_role := ((auth.jwt() -> 'app_metadata') ->> 'role')::public.app_role_enum;
    IF user_role IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Parse permission request once
    v_table_name := split_part(requested_permission, '.', 1);
    operation := split_part(requested_permission, '.', 2);
    
    -- Quick lookups for common cases
    IF user_role = 'super_admin' THEN
        RETURN TRUE;
    END IF;

    -- Use materialized permissions instead of recursive lookups
    SELECT permissions -> v_table_name -> operation INTO check_result
    FROM public.role_permissions_materialized
    WHERE role = user_role;

    -- If no explicit permission found, return false
    RETURN COALESCE(check_result, FALSE);
END;
$function$;

-- Create trigger to refresh materialized permissions
CREATE TRIGGER refresh_materialized_permissions_trigger
AFTER INSERT OR DELETE OR UPDATE ON public.role_permissions
FOR EACH STATEMENT EXECUTE FUNCTION public.refresh_materialized_permissions_trigger();

-- Grants on feed_sources
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."feed_sources" TO "anon";
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."feed_sources" TO "authenticated";
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."feed_sources" TO "service_role";

-- Grants on public.role_permissions_materialized
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."role_permissions_materialized" TO "anon";
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."role_permissions_materialized" TO "authenticated";
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."role_permissions_materialized" TO "service_role";

-- Policies on public.role_permissions_materialized
CREATE POLICY "delete_policy"
ON "public"."role_permissions_materialized"
AS permissive
FOR DELETE
TO public
USING (public.authorize('role_permissions_materialized.delete'::text));

CREATE POLICY "insert_policy"
ON "public"."role_permissions_materialized"
AS permissive
FOR INSERT
TO public
WITH CHECK (public.authorize('role_permissions_materialized.insert'::text));

CREATE POLICY "select_policy"
ON "public"."role_permissions_materialized"
AS permissive
FOR SELECT
TO public
USING (public.authorize('role_permissions_materialized.select'::text));

CREATE POLICY "update_policy"
ON "public"."role_permissions_materialized"
AS permissive
FOR UPDATE
TO public
USING (public.authorize('role_permissions_materialized.update'::text));

-- Create policies on feed_sources
CREATE POLICY "delete_policy"
ON "public"."feed_sources"
AS permissive
FOR DELETE
TO public
USING (public.authorize('feed_sources.delete'::text));

CREATE POLICY "insert_policy"
ON "public"."feed_sources"
AS permissive
FOR INSERT
TO public
WITH CHECK (public.authorize('feed_sources.insert'::text));

CREATE POLICY "select_policy"
ON "public"."feed_sources"
AS permissive
FOR SELECT
TO public
USING (public.authorize('feed_sources.select'::text));

CREATE POLICY "update_policy"
ON "public"."feed_sources"
AS permissive
FOR UPDATE
TO public
USING (public.authorize('feed_sources.update'::text));

-- Refresh materialized permissions after setup
SELECT public.refresh_materialized_permissions();
