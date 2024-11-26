create sequence "public"."social_media_id_seq";

alter table "public"."follows" drop constraint "follows_follower_id_followed_id_followed_entity_key";

alter table "public"."votes" drop constraint "votes_content_type_content_id_user_id_key";

drop index if exists "public"."follows_follower_id_followed_id_followed_entity_key";

drop index if exists "public"."votes_content_type_content_id_user_id_key";

alter table "public"."contents" alter column "content_type" drop default;

alter type "public"."content_type" rename to "content_type__old_version_to_be_dropped";

create type "public"."content_type" as enum ('news', 'events', 'jobs', 'research', 'companies', 'contact', 'people', 'newsletters', 'unknown');

create table "public"."feed_sources" (
    "id" bigint generated always as identity not null,
    "feed_id" uuid,
    "source_id" uuid,
    "created_at" timestamp with time zone not null default now()
);


create table "public"."role_permissions_materialized" (
    "role" public.app_role_enum not null,
    "permissions" jsonb not null,
    "last_updated" timestamp with time zone default now()
);


alter table "public"."role_permissions_materialized" enable row level security;

alter table "public"."classified_urls" alter column actual_category type "public"."content_type" using actual_category::text::"public"."content_type";

alter table "public"."classified_urls" alter column predicted_category type "public"."content_type" using predicted_category::text::"public"."content_type";

alter table "public"."comments" alter column content_type type "public"."content_type" using content_type::text::"public"."content_type";

alter table "public"."content_sources" alter column content_type type "public"."content_type" using content_type::text::"public"."content_type";

alter table "public"."contents" alter column content_type type "public"."content_type" using content_type::text::"public"."content_type";

alter table "public"."contents" alter column "content_type" set default 'companies'::public.content_type;

drop type "public"."content_type__old_version_to_be_dropped";

alter table "public"."social_media" alter column "id" set default nextval('public.social_media_id_seq'::regclass);

alter table "public"."tags" alter column "created_at" set default CURRENT_TIMESTAMP;

-- First, add a new column with the correct type
ALTER TABLE public.tags 
ADD COLUMN created_at_new timestamp with time zone;

-- Update the new column with the converted values
UPDATE public.tags 
SET created_at_new = created_at::text::timestamp with time zone;

-- Drop the old column
ALTER TABLE public.tags 
DROP COLUMN created_at;

-- Rename the new column
ALTER TABLE public.tags 
RENAME COLUMN created_at_new TO created_at;

-- Set the default value
ALTER TABLE public.tags 
ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;

alter table "public"."tags" alter column "updated_at" set default CURRENT_TIMESTAMP;

-- First, add a new column with the correct type
ALTER TABLE public.tags 
ADD COLUMN updated_at_new timestamp with time zone;

-- Update the new column with the converted values
UPDATE public.tags 
SET updated_at_new = updated_at::text::timestamp with time zone;

-- Drop the old column
ALTER TABLE public.tags 
DROP COLUMN updated_at;

-- Rename the new column
ALTER TABLE public.tags 
RENAME COLUMN updated_at_new TO updated_at;

-- Set the default value
ALTER TABLE public.tags 
ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX feed_sources_feed_id_idx ON public.feed_sources USING btree (feed_id);

CREATE UNIQUE INDEX feed_sources_feed_source_unique_idx ON public.feed_sources USING btree (feed_id, source_id);

CREATE INDEX feed_sources_source_id_idx ON public.feed_sources USING btree (source_id);

CREATE UNIQUE INDEX follows_unique_follower_following_idx ON public.follows USING btree (follower_id, followed_id, followed_entity);

CREATE UNIQUE INDEX role_permissions_materialized_pkey ON public.role_permissions_materialized USING btree (role);

CREATE UNIQUE INDEX votes_unique_user_content_vote_idx ON public.votes USING btree (content_type, content_id, user_id);

alter table "public"."role_permissions_materialized" add constraint "role_permissions_materialized_pkey" PRIMARY KEY using index "role_permissions_materialized_pkey";

alter table "public"."feed_sources" add constraint "feed_sources_feed_id_fkey" FOREIGN KEY (feed_id) REFERENCES public.feeds(id) ON DELETE CASCADE not valid;

alter table "public"."feed_sources" validate constraint "feed_sources_feed_id_fkey";

alter table "public"."feed_sources" add constraint "feed_sources_source_id_fkey" FOREIGN KEY (source_id) REFERENCES public.contents(id) ON DELETE CASCADE not valid;

alter table "public"."feed_sources" validate constraint "feed_sources_source_id_fkey";

alter table "public"."follows" add constraint "follows_unique_follower_following_idx" UNIQUE using index "follows_unique_follower_following_idx";

alter table "public"."votes" add constraint "votes_unique_user_content_vote_idx" UNIQUE using index "votes_unique_user_content_vote_idx";

set check_function_bodies = off;

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
        FROM role_permissions
        ORDER BY role, table_name, id DESC
    ) flattened
    GROUP BY role;
END;
$function$
;


CREATE OR REPLACE FUNCTION public.refresh_materialized_permissions_trigger()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    PERFORM refresh_materialized_permissions();
    RETURN NEW;
END;
$function$
;

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
$function$
;

grant delete on table "public"."feed_sources" to "anon";

grant insert on table "public"."feed_sources" to "anon";

grant references on table "public"."feed_sources" to "anon";

grant select on table "public"."feed_sources" to "anon";

grant trigger on table "public"."feed_sources" to "anon";

grant truncate on table "public"."feed_sources" to "anon";

grant update on table "public"."feed_sources" to "anon";

grant delete on table "public"."feed_sources" to "authenticated";

grant insert on table "public"."feed_sources" to "authenticated";

grant references on table "public"."feed_sources" to "authenticated";

grant select on table "public"."feed_sources" to "authenticated";

grant trigger on table "public"."feed_sources" to "authenticated";

grant truncate on table "public"."feed_sources" to "authenticated";

grant update on table "public"."feed_sources" to "authenticated";

grant delete on table "public"."feed_sources" to "service_role";

grant insert on table "public"."feed_sources" to "service_role";

grant references on table "public"."feed_sources" to "service_role";

grant select on table "public"."feed_sources" to "service_role";

grant trigger on table "public"."feed_sources" to "service_role";

grant truncate on table "public"."feed_sources" to "service_role";

grant update on table "public"."feed_sources" to "service_role";

grant delete on table "public"."role_permissions_materialized" to "anon";

grant insert on table "public"."role_permissions_materialized" to "anon";

grant references on table "public"."role_permissions_materialized" to "anon";

grant select on table "public"."role_permissions_materialized" to "anon";

grant trigger on table "public"."role_permissions_materialized" to "anon";

grant truncate on table "public"."role_permissions_materialized" to "anon";

grant update on table "public"."role_permissions_materialized" to "anon";

grant delete on table "public"."role_permissions_materialized" to "authenticated";

grant insert on table "public"."role_permissions_materialized" to "authenticated";

grant references on table "public"."role_permissions_materialized" to "authenticated";

grant select on table "public"."role_permissions_materialized" to "authenticated";

grant trigger on table "public"."role_permissions_materialized" to "authenticated";

grant truncate on table "public"."role_permissions_materialized" to "authenticated";

grant update on table "public"."role_permissions_materialized" to "authenticated";

grant delete on table "public"."role_permissions_materialized" to "service_role";

grant insert on table "public"."role_permissions_materialized" to "service_role";

grant references on table "public"."role_permissions_materialized" to "service_role";

grant select on table "public"."role_permissions_materialized" to "service_role";

grant trigger on table "public"."role_permissions_materialized" to "service_role";

grant truncate on table "public"."role_permissions_materialized" to "service_role";

grant update on table "public"."role_permissions_materialized" to "service_role";

create policy "delete_policy"
on "public"."role_permissions_materialized"
as permissive
for delete
to public
using (public.authorize('role_permissions_materialized.delete'::text));


create policy "insert_policy"
on "public"."role_permissions_materialized"
as permissive
for insert
to public
with check (public.authorize('role_permissions_materialized.insert'::text));


create policy "select_policy"
on "public"."role_permissions_materialized"
as permissive
for select
to public
using (public.authorize('role_permissions_materialized.select'::text));


create policy "update_policy"
on "public"."role_permissions_materialized"
as permissive
for update
to public
using (public.authorize('role_permissions_materialized.update'::text));


CREATE TRIGGER refresh_materialized_permissions_trigger AFTER INSERT OR DELETE OR UPDATE ON public.role_permissions FOR EACH STATEMENT EXECUTE FUNCTION public.refresh_materialized_permissions_trigger();

