revoke delete on table "public"."news_summaries" from "anon";

revoke insert on table "public"."news_summaries" from "anon";

revoke references on table "public"."news_summaries" from "anon";

revoke trigger on table "public"."news_summaries" from "anon";

revoke truncate on table "public"."news_summaries" from "anon";

revoke update on table "public"."news_summaries" from "anon";

revoke delete on table "public"."news_summaries" from "authenticated";

revoke insert on table "public"."news_summaries" from "authenticated";

revoke references on table "public"."news_summaries" from "authenticated";

revoke trigger on table "public"."news_summaries" from "authenticated";

revoke truncate on table "public"."news_summaries" from "authenticated";

revoke update on table "public"."news_summaries" from "authenticated";

revoke delete on table "public"."news_summaries" from "service_role";

revoke insert on table "public"."news_summaries" from "service_role";

revoke references on table "public"."news_summaries" from "service_role";

revoke select on table "public"."news_summaries" from "service_role";

revoke trigger on table "public"."news_summaries" from "service_role";

revoke truncate on table "public"."news_summaries" from "service_role";

revoke update on table "public"."news_summaries" from "service_role";

alter table "public"."research" drop constraint "research_content_fk";

alter table "public"."user_metrics" drop constraint "user_metrics_user_id_fkey";

CREATE SEQUENCE IF NOT EXISTS public.maintenance_log_id_seq;

CREATE TABLE IF NOT EXISTS public.maintenance_log (
    id integer NOT NULL DEFAULT nextval('public.maintenance_log_id_seq'),
    operation text,
    detail text,
    logged_at timestamp with time zone DEFAULT now()
);

alter table "public"."maintenance_log" enable row level security;

alter sequence "public"."maintenance_log_id_seq" owned by "public"."maintenance_log"."id";

drop index if exists "public"."idx_permissions_jsonb";

drop index if exists "public"."idx_role_permissions_composite";

CREATE UNIQUE INDEX maintenance_log_pkey ON public.maintenance_log USING btree (id);

alter table "public"."research" add constraint "research_content_fk" FOREIGN KEY (id) REFERENCES public.contents(id) ON DELETE CASCADE not valid;

alter table "public"."research" validate constraint "research_content_fk";

alter table "public"."user_metrics" add constraint "user_metrics_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_metrics" validate constraint "user_metrics_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.array_to_object(arr text[])
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN (
        SELECT jsonb_object_agg(elem, true)
        FROM unnest(arr) AS elem
    );
END;
$function$
;
-- Drop function with single parameter (timestamp)
DROP FUNCTION IF EXISTS public.get_contents(timestamp without time zone);

-- Drop function with both parameters (timestamp and text)
DROP FUNCTION IF EXISTS public.get_contents(timestamp without time zone, text);

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
END;$function$
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

    RAISE LOG 'users_columns_updateable: user with role % attempted to change role or plan', current_user_role;

    -- Allow admins, super_admins, or service_role to change roles and plans
    IF current_user_role IN ('admin', 'super_admin') OR (auth.jwt() ->> 'role') = 'service_role' THEN
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

grant select on table "public"."companies" to "authenticator";

grant delete on table "public"."feed_categories" to "authenticator";

grant insert on table "public"."feed_categories" to "authenticator";

grant select on table "public"."feed_categories" to "authenticator";

grant update on table "public"."feed_categories" to "authenticator";

grant delete on table "public"."feeds" to "authenticator";

grant insert on table "public"."feeds" to "authenticator";

grant select on table "public"."feeds" to "authenticator";

grant update on table "public"."feeds" to "authenticator";

grant delete on table "public"."maintenance_log" to "anon";

grant insert on table "public"."maintenance_log" to "anon";

grant references on table "public"."maintenance_log" to "anon";

grant select on table "public"."maintenance_log" to "anon";

grant trigger on table "public"."maintenance_log" to "anon";

grant truncate on table "public"."maintenance_log" to "anon";

grant update on table "public"."maintenance_log" to "anon";

grant delete on table "public"."maintenance_log" to "authenticated";

grant insert on table "public"."maintenance_log" to "authenticated";

grant references on table "public"."maintenance_log" to "authenticated";

grant select on table "public"."maintenance_log" to "authenticated";

grant trigger on table "public"."maintenance_log" to "authenticated";

grant truncate on table "public"."maintenance_log" to "authenticated";

grant update on table "public"."maintenance_log" to "authenticated";

grant delete on table "public"."maintenance_log" to "service_role";

grant insert on table "public"."maintenance_log" to "service_role";

grant references on table "public"."maintenance_log" to "service_role";

grant select on table "public"."maintenance_log" to "service_role";

grant trigger on table "public"."maintenance_log" to "service_role";

grant truncate on table "public"."maintenance_log" to "service_role";

grant update on table "public"."maintenance_log" to "service_role";

grant update on table "public"."news" to "authenticated";

grant delete on table "public"."news" to "authenticator";

grant insert on table "public"."news" to "authenticator";

grant references on table "public"."news" to "authenticator";

grant trigger on table "public"."news" to "authenticator";

grant truncate on table "public"."news" to "authenticator";

grant update on table "public"."news" to "authenticator";

grant select on table "public"."news_summaries" to "authenticator";


grant select on table "public"."role_permissions_materialized" to "authenticator";

-- First drop the trigger
DROP TRIGGER IF EXISTS vote_score_trigger ON public.votes;

-- Then drop the function
DROP FUNCTION IF EXISTS public.update_vote_score();


DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'user_profiles' 
        AND policyname = 'insert_own_profile'
    ) THEN
        create policy "insert_own_profile"
        on "public"."user_profiles"
        as permissive
        for insert
        to public
        with check ((auth.uid() = id));
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'user_profiles' 
        AND policyname = 'read_own_profile'
    ) THEN
        create policy "read_own_profile"
        on "public"."user_profiles"
        as permissive
        for select
        to public
        using ((auth.uid() = id));
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'user_profiles' 
        AND policyname = 'update_own_profile'
    ) THEN
        create policy "update_own_profile"
        on "public"."user_profiles"
        as permissive
        for update
        to public
        using ((auth.uid() = id))
        with check ((auth.uid() = id));
    END IF;
END
$$;



