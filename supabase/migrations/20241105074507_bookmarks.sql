create extension if not exists "ltree" with schema "extensions";

drop policy "delete_policy" on "public"."bookmarks";

drop policy "insert_policy" on "public"."bookmarks";

drop policy "select_policy" on "public"."bookmarks";

drop policy "update_policy" on "public"."bookmarks";

alter table "public"."bookmarks" drop constraint "bookmarks_user_id_content_id_content_type_key";

alter table "public"."bookmarks" drop constraint "bookmarks_user_id_fkey";

drop index if exists "public"."bookmarks_user_id_content_id_content_type_key";

drop index if exists "public"."idx_bookmarks_content";

drop index if exists "public"."idx_bookmarks_user";

create table "public"."bookmark_folders" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "name" character varying(255) not null,
    "color" character varying(7) default '#94A3B8'::character varying,
    "parent_id" uuid,
    "is_default" boolean default false,
    "is_favorite" boolean default false,
    "position" integer default 0,
    "path" extensions.ltree,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."bookmarks" add column "folder_id" uuid;

alter table "public"."bookmarks" add column "metadata" jsonb;

alter table "public"."bookmarks" add column "updated_at" timestamp with time zone default now();

alter table "public"."bookmarks" alter column "content_type" set data type character varying(50) using "content_type"::character varying(50);

alter table "public"."bookmarks" alter column "created_at" set default now();

alter table "public"."bookmarks" alter column "id" set default gen_random_uuid();

alter table "public"."bookmarks" disable row level security;

alter table "public"."role_permissions" add column "select" boolean not null default false;

alter table "public"."role_permissions" add column "update" boolean not null default false;

CREATE INDEX bookmark_folders_path_idx ON public.bookmark_folders USING gist (path);

CREATE UNIQUE INDEX bookmark_folders_pkey ON public.bookmark_folders USING btree (id);

CREATE UNIQUE INDEX bookmarks_user_id_content_type_content_id_key ON public.bookmarks USING btree (user_id, content_type, content_id);

CREATE INDEX idx_bookmarks_folder ON public.bookmarks USING btree (folder_id);

CREATE INDEX idx_bookmarks_news ON public.bookmarks USING btree (user_id, content_type) WHERE ((content_type)::text = 'news'::text);

CREATE INDEX idx_bookmarks_user_content ON public.bookmarks USING btree (user_id, content_type);

CREATE UNIQUE INDEX one_default_per_user ON public.bookmark_folders USING btree (user_id) WHERE (is_default = true);

alter table "public"."bookmark_folders" add constraint "bookmark_folders_pkey" PRIMARY KEY using index "bookmark_folders_pkey";

alter table "public"."bookmark_folders" add constraint "bookmark_folders_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES public.bookmark_folders(id) not valid;

alter table "public"."bookmark_folders" validate constraint "bookmark_folders_parent_id_fkey";

alter table "public"."bookmark_folders" add constraint "bookmark_folders_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) on delete cascade on update cascade not valid;

alter table "public"."bookmark_folders" validate constraint "bookmark_folders_user_id_fkey";

alter table "public"."bookmark_folders" add constraint "no_self_parent" CHECK ((id <> parent_id)) not valid;

alter table "public"."bookmark_folders" validate constraint "no_self_parent";

alter table "public"."bookmark_folders" add constraint "valid_color" CHECK (((color)::text ~* '^#[0-9A-F]{6}$'::text)) not valid;

alter table "public"."bookmark_folders" validate constraint "valid_color";

alter table "public"."bookmarks" add constraint "bookmarks_folder_id_fkey" FOREIGN KEY (folder_id) REFERENCES public.bookmark_folders(id) not valid;

alter table "public"."bookmarks" validate constraint "bookmarks_folder_id_fkey";

alter table "public"."bookmarks" add constraint "bookmarks_user_id_content_type_content_id_key" UNIQUE using index "bookmarks_user_id_content_type_content_id_key";

alter table "public"."bookmarks" add constraint "bookmarks_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) on delete cascade on update cascade not valid;

alter table "public"."bookmarks" validate constraint "bookmarks_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_user_profile()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$DECLARE
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

grant delete on table "public"."bookmark_folders" to "anon";

grant insert on table "public"."bookmark_folders" to "anon";

grant references on table "public"."bookmark_folders" to "anon";

grant select on table "public"."bookmark_folders" to "anon";

grant trigger on table "public"."bookmark_folders" to "anon";

grant truncate on table "public"."bookmark_folders" to "anon";

grant update on table "public"."bookmark_folders" to "anon";

grant delete on table "public"."bookmark_folders" to "authenticated";

grant insert on table "public"."bookmark_folders" to "authenticated";

grant references on table "public"."bookmark_folders" to "authenticated";

grant select on table "public"."bookmark_folders" to "authenticated";

grant trigger on table "public"."bookmark_folders" to "authenticated";

grant truncate on table "public"."bookmark_folders" to "authenticated";

grant update on table "public"."bookmark_folders" to "authenticated";

grant delete on table "public"."bookmark_folders" to "service_role";

grant insert on table "public"."bookmark_folders" to "service_role";

grant references on table "public"."bookmark_folders" to "service_role";

grant select on table "public"."bookmark_folders" to "service_role";

grant trigger on table "public"."bookmark_folders" to "service_role";

grant truncate on table "public"."bookmark_folders" to "service_role";

grant update on table "public"."bookmark_folders" to "service_role";


