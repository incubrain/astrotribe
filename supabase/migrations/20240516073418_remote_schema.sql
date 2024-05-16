drop policy "Enable read access for all users" on "public"."user_profiles";

drop policy "auth_all" on "public"."user_profiles";

drop policy "read_all_policy" on "public"."categories";

drop policy "read_all_policy" on "public"."countries";

drop policy "read_all_policy" on "public"."news";

drop policy "read_all_policy" on "public"."news_tags";

drop policy "read_all_policy" on "public"."plan_permissions";

drop policy "read_all_policy" on "public"."role_permissions";

drop policy "read_all_policy" on "public"."tags";

drop policy "read_all_policy" on "public"."user_profiles";

alter table "public"."addresses" enable row level security;

alter table "public"."categories" enable row level security;

alter table "public"."cities" enable row level security;

alter table "public"."companies" enable row level security;

alter table "public"."company_employees" enable row level security;

alter table "public"."company_news" enable row level security;

alter table "public"."contacts" enable row level security;

alter table "public"."countries" enable row level security;

alter table "public"."embeddings" enable row level security;

alter table "public"."feedbacks" enable row level security;

alter table "public"."news" alter column "category_id" set default '16'::integer;

alter table "public"."news" enable row level security;

alter table "public"."news_embeddings" enable row level security;

alter table "public"."news_tags" enable row level security;

alter table "public"."plan_permissions" enable row level security;

alter table "public"."research" enable row level security;

alter table "public"."responses" enable row level security;

alter table "public"."role_permissions" enable row level security;

alter table "public"."searches" enable row level security;

alter table "public"."social_media" enable row level security;

alter table "public"."tags" enable row level security;

alter table "public"."user_followers" enable row level security;

alter table "public"."user_profiles" alter column "cover_image" set default ''::text;

alter table "public"."user_profiles" enable row level security;

CREATE UNIQUE INDEX categories_title_key ON public.categories USING btree (name);

CREATE UNIQUE INDEX feedback_pkey ON public.feedbacks USING btree (id);

CREATE UNIQUE INDEX responses_id_key ON public.responses USING btree (id);

CREATE UNIQUE INDEX role_permission_unique ON public.role_permissions USING btree (role, table_name);

CREATE UNIQUE INDEX users_auth_id_key ON public.user_profiles USING btree (id);

CREATE UNIQUE INDEX users_email_key ON public.user_profiles USING btree (email);

grant select on table "auth"."users" to "authenticator";

grant update on table "auth"."users" to "authenticator";

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

CREATE OR REPLACE FUNCTION public.authorize(requested_permission text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$DECLARE
    user_role public.app_role_enum;
    v_table_name text;
    operation text;
    full_jwt json; -- Variable to store the entire JWT object for logging
BEGIN
    full_jwt := auth.jwt(); -- Get the full JWT object
    RAISE LOG 'JWT Object: %', full_jwt; -- Log the entire JWT object

    user_role := ((auth.jwt() -> 'app_metadata') ->> 'role')::public.app_role_enum;

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
END;$function$
;

CREATE OR REPLACE FUNCTION public.update_user_app_metadata()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
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
 SECURITY DEFINER
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

CREATE OR REPLACE FUNCTION public.update_user_metadata()
RETURNS TRIGGER AS $$
BEGIN
  -- Log the function call and the values being updated
  RAISE NOTICE 'update_user_meta_data() called: id=%, given_name=%, surname=%, avatar=%, cover_image=%',
               NEW.id, NEW.given_name, NEW.surname, NEW.avatar, NEW.cover_image;
               
  -- Perform the update
  UPDATE auth.users
  SET raw_user_meta_data = raw_user_meta_data
    || jsonb_build_object(
         'given_name', NEW.given_name,
         'surname', NEW.surname,
         'avatar', NEW.avatar,
         'cover_image', NEW.cover_image
       )
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE OR REPLACE FUNCTION public.set_user_plan_and_role()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  NEW.raw_app_meta_data = jsonb_set(
    jsonb_set(NEW.raw_app_meta_data, '{plan}', to_jsonb('free'::public.app_plan_enum), true),
    '{role}', to_jsonb('user'::public.app_role_enum), true
  );
  RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.users_columns_updateable()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$DECLARE
    current_user_role public.app_role_enum;
BEGIN
    -- Example of fetching current user's role from JWT; adjust based on your setup
    current_user_role := ((auth.jwt() -> 'app_metadata') ->> 'role')::public.app_role_enum;
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
END;$function$
;

grant select on table "public"."categories" to "authenticator";

grant select on table "public"."role_permissions" to "authenticator";

grant select on table "public"."user_profiles" to "authenticator";

create policy "supabase_auth_admin update"
on "public"."user_profiles"
as permissive
for update
to supabase_auth_admin
using (true);


create policy "read_all_policy"
on "public"."categories"
as permissive
for select
to anon, authenticated, authenticator
using (true);


create policy "read_all_policy"
on "public"."countries"
as permissive
for select
to authenticated, anon
using (true);


create policy "read_all_policy"
on "public"."news"
as permissive
for select
to authenticated, anon
using (true);


create policy "read_all_policy"
on "public"."news_tags"
as permissive
for select
to authenticated, anon
using (true);


create policy "read_all_policy"
on "public"."plan_permissions"
as permissive
for select
to authenticated, authenticator
using (true);


create policy "read_all_policy"
on "public"."role_permissions"
as permissive
for select
to authenticated, authenticator
using (true);


create policy "read_all_policy"
on "public"."tags"
as permissive
for select
to authenticated, anon
using (true);


create policy "read_all_policy"
on "public"."user_profiles"
as permissive
for select
to authenticated, authenticator
using (true);



