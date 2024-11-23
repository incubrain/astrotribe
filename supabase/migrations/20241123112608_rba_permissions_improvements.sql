create sequence "public"."categories_id_seq";

drop policy "read_all_policy" on "public"."addresses";

drop policy "read_all_policy" on "public"."categories";

drop policy "read_all_policy" on "public"."cities";

drop policy "read_all_policy" on "public"."companies";

drop policy "read_all_policy" on "public"."company_employees";

drop policy "Enable read access for all users" on "public"."company_extras";

drop policy "read_all_policy" on "public"."contacts";

drop policy "read_all_policy" on "public"."countries";

drop policy "read_all_policy" on "public"."feedbacks";

drop policy "read_all_policy" on "public"."news";

drop policy "read_all_policy" on "public"."news_tags";

drop policy "read_all_policy" on "public"."plan_permissions";

drop policy "read_all_policy" on "public"."research";

drop policy "Enable read access for all users" on "public"."research_embeddings";

drop policy "admin_delete" on "public"."research_embeddings";

drop policy "super_admin_update" on "public"."research_embeddings";

drop policy "read_all_policy" on "public"."responses";

drop policy "read_all_policy" on "public"."searches";

drop policy "read_all_policy" on "public"."social_media";

drop policy "read_all_policy" on "public"."tags";

drop policy "read_all_policy" on "public"."user_followers";

drop policy "read_all_policy" on "public"."user_profiles";

alter table "public"."user_profiles" alter column "role" drop default;

alter type "public"."app_role_enum" rename to "app_role_enum__old_version_to_be_dropped";

create type "public"."app_role_enum" as enum ('guest', 'user', 'astroguide', 'mentor', 'moderator', 'tenant_member', 'tenant_admin', 'tenant_super_admin', 'admin', 'super_admin', 'service_role');

create table "public"."role_hierarchy" (
    "parent_role" public.app_role_enum not null,
    "child_role" public.app_role_enum not null
);


alter table "public"."role_hierarchy" enable row level security;

alter table "public"."role_permissions" alter column role type "public"."app_role_enum" using role::text::"public"."app_role_enum";

alter table "public"."user_profiles" alter column role type "public"."app_role_enum" using role::text::"public"."app_role_enum";

alter table "public"."user_profiles" alter column "role" set default 'user'::public.app_role_enum;

drop type "public"."app_role_enum__old_version_to_be_dropped";

alter table "public"."bookmark_folders" enable row level security;

alter table "public"."bookmarks" enable row level security;

alter table "public"."categories" alter column "id" set default nextval('public.categories_id_seq'::regclass);

alter table "public"."feed_categories" enable row level security;

alter table "public"."feeds" enable row level security;

alter table "public"."role_permissions" add column "cached_permissions" jsonb;

alter table "public"."role_permissions" add column "inherit_from" public.app_role_enum[];

alter table "public"."role_permissions" add column "last_updated" timestamp with time zone default now();

alter table "public"."strapi_migrations" enable row level security;

alter table "public"."strapi_migrations_internal" enable row level security;

alter table "public"."user_followers" alter column "id" set default extensions.uuid_generate_v4();

alter table "public"."votes" enable row level security;

alter sequence "public"."categories_id_seq" owned by "public"."categories"."id";

CREATE UNIQUE INDEX role_hierarchy_pkey ON public.role_hierarchy USING btree (parent_role, child_role);

alter table "public"."role_hierarchy" add constraint "role_hierarchy_pkey" PRIMARY KEY using index "role_hierarchy_pkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.cache_role_permissions()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Update cached permissions for all roles
    UPDATE role_permissions rp
    SET cached_permissions = (
        SELECT jsonb_object_agg(
            table_name,
            jsonb_build_object(
                'permissions', permissions,
                'conditions', conditions
            )
        )
        FROM get_inherited_permissions(rp.role)
    ),
    last_updated = now();
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_inherited_permissions(p_role public.app_role_enum)
 RETURNS TABLE(table_name text, permissions jsonb, conditions jsonb)
 LANGUAGE sql
AS $function$
WITH RECURSIVE role_tree AS (
    -- Base case: direct permissions
    SELECT rp.table_name, rp.permissions, rp.conditions, ARRAY[rp.role] as role_path
    FROM role_permissions rp
    WHERE rp.role = p_role
    
    UNION ALL
    
    -- Recursive case: inherited permissions
    SELECT rp.table_name, rp.permissions, rp.conditions, rt.role_path || rp.role
    FROM role_permissions rp
    JOIN role_hierarchy rh ON rh.parent_role = rp.role
    JOIN role_tree rt ON rt.role_path[array_length(rt.role_path, 1)] = rh.child_role
    WHERE NOT rp.role = ANY(rt.role_path) -- Prevent cycles
)
SELECT DISTINCT ON (table_name)
    table_name,
    permissions,
    conditions
FROM role_tree
ORDER BY table_name, array_length(role_path, 1);
$function$
;

CREATE OR REPLACE FUNCTION public.get_inherited_roles(p_role public.app_role_enum)
 RETURNS public.app_role_enum[]
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_inherited_roles public.app_role_enum[];
BEGIN
    WITH RECURSIVE role_tree AS (
        -- Base case: direct parent
        SELECT rh.parent_role, rh.child_role, 1 AS level
        FROM role_hierarchy rh
        WHERE rh.child_role = p_role
        
        UNION
        
        -- Recursive case: parent's parents
        SELECT rh.parent_role, rt.child_role, rt.level + 1
        FROM role_hierarchy rh
        JOIN role_tree rt ON rh.child_role = rt.parent_role
    )
    SELECT array_agg(rt.parent_role) INTO v_inherited_roles
    FROM role_tree rt;
    
    RETURN v_inherited_roles;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.insert_role_permission(p_role public.app_role_enum, p_table_name text, p_permissions jsonb, p_conditions jsonb, p_inherited_roles public.app_role_enum[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    INSERT INTO public.role_permissions (
        role,
        table_name,
        permissions,
        conditions,
        inherit_from
    )
    VALUES (
        p_role,
        p_table_name,
        p_permissions,
        COALESCE(p_conditions, '{}'::jsonb),
        p_inherited_roles
    );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.process_direct_permissions(p_config jsonb, p_role_key text, p_inherited_roles public.app_role_enum[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_table_group text;
    v_table_name text;
    v_permissions jsonb;
BEGIN
    FOR v_table_group IN SELECT jsonb_object_keys(p_config->'roles'->p_role_key)
    LOOP
        IF v_table_group = 'inherit_from' THEN
            CONTINUE;
        END IF;

        IF v_table_group = 'all_tables' THEN
            -- Handle 'all_tables' case
            FOR v_table_name IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
            LOOP
                SELECT jsonb_object_agg(perm, true)
                INTO v_permissions
                FROM jsonb_array_elements_text(p_config->'roles'->p_role_key->'all_tables'->'permissions') AS perm;
                
                PERFORM insert_role_permission(
                    p_role_key::public.app_role_enum,
                    v_table_name,
                    v_permissions,
                    p_config->'roles'->p_role_key->'all_tables'->'conditions',
                    p_inherited_roles
                );
            END LOOP;
        ELSE
            -- Handle specific table groups
            FOR v_table_name IN SELECT jsonb_array_elements_text(p_config->'table_groups'->v_table_group->'tables')
            LOOP
                SELECT jsonb_object_agg(perm, true)
                INTO v_permissions
                FROM jsonb_array_elements_text(p_config->'roles'->p_role_key->v_table_group->'permissions') AS perm;
                
                PERFORM insert_role_permission(
                    p_role_key::public.app_role_enum,
                    v_table_name,
                    v_permissions,
                    p_config->'roles'->p_role_key->v_table_group->'conditions',
                    p_inherited_roles
                );
            END LOOP;
        END IF;
    END LOOP;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.process_inherited_permissions(p_config jsonb, p_role_key text, p_parent_role public.app_role_enum, p_inherited_roles public.app_role_enum[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_table_group text;
    v_table_name text;
    v_permissions jsonb;
BEGIN
    FOR v_table_group IN SELECT jsonb_object_keys(p_config->'roles'->(p_parent_role::text))
    LOOP
        IF v_table_group = 'inherit_from' THEN
            CONTINUE;
        END IF;

        IF v_table_group = 'all_tables' THEN
            FOR v_table_name IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
            LOOP
                IF NOT EXISTS (
                    SELECT 1 FROM public.role_permissions rp
                    WHERE rp.role = p_role_key::public.app_role_enum
                    AND rp.table_name = v_table_name
                ) THEN
                    SELECT jsonb_object_agg(perm, true)
                    INTO v_permissions
                    FROM jsonb_array_elements_text(p_config->'roles'->(p_parent_role::text)->'all_tables'->'permissions') AS perm;
                    
                    PERFORM insert_role_permission(
                        p_role_key::public.app_role_enum,
                        v_table_name,
                        v_permissions,
                        p_config->'roles'->(p_parent_role::text)->'all_tables'->'conditions',
                        p_inherited_roles
                    );
                END IF;
            END LOOP;
        ELSE
            FOR v_table_name IN SELECT jsonb_array_elements_text(p_config->'table_groups'->v_table_group->'tables')
            LOOP
                IF NOT EXISTS (
                    SELECT 1 FROM public.role_permissions rp
                    WHERE rp.role = p_role_key::public.app_role_enum
                    AND rp.table_name = v_table_name
                ) THEN
                    SELECT jsonb_object_agg(perm, true)
                    INTO v_permissions
                    FROM jsonb_array_elements_text(p_config->'roles'->(p_parent_role::text)->v_table_group->'permissions') AS perm;
                    
                    PERFORM insert_role_permission(
                        p_role_key::public.app_role_enum,
                        v_table_name,
                        v_permissions,
                        p_config->'roles'->(p_parent_role::text)->v_table_group->'conditions',
                        p_inherited_roles
                    );
                END IF;
            END LOOP;
        END IF;
    END LOOP;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.setup_role_hierarchy()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Clear existing hierarchy
    DELETE FROM public.role_hierarchy;
    
    -- Insert role hierarchy relationships
    INSERT INTO public.role_hierarchy (parent_role, child_role) VALUES
        ('super_admin', 'admin'),
        ('admin', 'moderator'),
        ('moderator', 'user'),
        ('user', 'guest');

    -- Log the setup
    RAISE NOTICE 'Role hierarchy setup completed';
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
BEGIN
    -- Service role bypass remains unchanged
    IF (auth.jwt() ->> 'role') = 'service_role' THEN
        RETURN TRUE;
    END IF;

    user_role := ((auth.jwt() -> 'app_metadata') ->> 'role')::public.app_role_enum;
    
    -- Check cache age and refresh if needed
    IF EXISTS (
        SELECT 1 FROM role_permissions 
        WHERE role = user_role 
        AND last_updated < now() - interval '1 hour'
    ) THEN
        PERFORM cache_role_permissions();
    END IF;

    -- Use cached permissions
    SELECT cached_permissions INTO cached_perms
    FROM role_permissions
    WHERE role = user_role;

    -- Parse permission request
    v_table_name := split_part(requested_permission, '.', 1);
    operation := split_part(requested_permission, '.', 2);

    -- Check permissions from cache
    IF cached_perms ? v_table_name AND 
       cached_perms -> v_table_name -> 'permissions' ? operation THEN
        -- Check conditions if they exist
        IF cached_perms -> v_table_name -> 'conditions' ? operation THEN
            RETURN auth.check_condition(
                cached_perms -> v_table_name -> 'conditions' -> operation
            );
        END IF;
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_role_permissions(config jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    role_key text;
    inherited_roles public.app_role_enum[];
    parent_role public.app_role_enum;
BEGIN
    -- Clear existing permissions
    DELETE FROM public.role_permissions;
    
    -- First ensure role hierarchy is set up
    PERFORM setup_role_hierarchy();
    
    -- Loop through roles
    FOR role_key IN SELECT jsonb_object_keys(config->'roles')
    LOOP
        -- Get inherited roles
        inherited_roles := get_inherited_roles(role_key::public.app_role_enum);
        
        -- Process direct permissions
        PERFORM process_direct_permissions(config, role_key, inherited_roles);
        
        -- Process inherited permissions
        IF inherited_roles IS NOT NULL THEN
            FOREACH parent_role IN ARRAY inherited_roles
            LOOP
                PERFORM process_inherited_permissions(
                    config,
                    role_key,
                    parent_role,
                    inherited_roles
                );
            END LOOP;
        END IF;
    END LOOP;
END;
$function$
;

grant delete on table "public"."role_hierarchy" to "anon";

grant insert on table "public"."role_hierarchy" to "anon";

grant references on table "public"."role_hierarchy" to "anon";

grant select on table "public"."role_hierarchy" to "anon";

grant trigger on table "public"."role_hierarchy" to "anon";

grant truncate on table "public"."role_hierarchy" to "anon";

grant update on table "public"."role_hierarchy" to "anon";

grant delete on table "public"."role_hierarchy" to "authenticated";

grant insert on table "public"."role_hierarchy" to "authenticated";

grant references on table "public"."role_hierarchy" to "authenticated";

grant select on table "public"."role_hierarchy" to "authenticated";

grant trigger on table "public"."role_hierarchy" to "authenticated";

grant truncate on table "public"."role_hierarchy" to "authenticated";

grant update on table "public"."role_hierarchy" to "authenticated";

grant delete on table "public"."role_hierarchy" to "service_role";

grant insert on table "public"."role_hierarchy" to "service_role";

grant references on table "public"."role_hierarchy" to "service_role";

grant select on table "public"."role_hierarchy" to "service_role";

grant trigger on table "public"."role_hierarchy" to "service_role";

grant truncate on table "public"."role_hierarchy" to "service_role";

grant update on table "public"."role_hierarchy" to "service_role";

create policy "delete_policy"
on "public"."bookmark_folders"
as permissive
for delete
to public
using (public.authorize('bookmark_folders.delete'::text));


create policy "insert_policy"
on "public"."bookmark_folders"
as permissive
for insert
to public
with check (public.authorize('bookmark_folders.insert'::text));


create policy "select_policy"
on "public"."bookmark_folders"
as permissive
for select
to public
using (public.authorize('bookmark_folders.select'::text));


create policy "update_policy"
on "public"."bookmark_folders"
as permissive
for update
to public
using (public.authorize('bookmark_folders.update'::text));


create policy "delete_policy"
on "public"."bookmarks"
as permissive
for delete
to public
using (public.authorize('bookmarks.delete'::text));


create policy "insert_policy"
on "public"."bookmarks"
as permissive
for insert
to public
with check (public.authorize('bookmarks.insert'::text));


create policy "select_policy"
on "public"."bookmarks"
as permissive
for select
to public
using (public.authorize('bookmarks.select'::text));


create policy "update_policy"
on "public"."bookmarks"
as permissive
for update
to public
using (public.authorize('bookmarks.update'::text));


create policy "delete_policy"
on "public"."feed_categories"
as permissive
for delete
to public
using (public.authorize('feed_categories.delete'::text));


create policy "insert_policy"
on "public"."feed_categories"
as permissive
for insert
to public
with check (public.authorize('feed_categories.insert'::text));


create policy "select_policy"
on "public"."feed_categories"
as permissive
for select
to public
using (public.authorize('feed_categories.select'::text));


create policy "update_policy"
on "public"."feed_categories"
as permissive
for update
to public
using (public.authorize('feed_categories.update'::text));


create policy "delete_policy"
on "public"."feeds"
as permissive
for delete
to public
using (public.authorize('feeds.delete'::text));


create policy "insert_policy"
on "public"."feeds"
as permissive
for insert
to public
with check (public.authorize('feeds.insert'::text));


create policy "select_policy"
on "public"."feeds"
as permissive
for select
to public
using (public.authorize('feeds.select'::text));


create policy "update_policy"
on "public"."feeds"
as permissive
for update
to public
using (public.authorize('feeds.update'::text));


create policy "delete_policy"
on "public"."role_hierarchy"
as permissive
for delete
to public
using (public.authorize('role_hierarchy.delete'::text));


create policy "insert_policy"
on "public"."role_hierarchy"
as permissive
for insert
to public
with check (public.authorize('role_hierarchy.insert'::text));


create policy "select_policy"
on "public"."role_hierarchy"
as permissive
for select
to public
using (public.authorize('role_hierarchy.select'::text));


create policy "update_policy"
on "public"."role_hierarchy"
as permissive
for update
to public
using (public.authorize('role_hierarchy.update'::text));


create policy "delete_policy"
on "public"."strapi_migrations"
as permissive
for delete
to public
using (public.authorize('strapi_migrations.delete'::text));


create policy "insert_policy"
on "public"."strapi_migrations"
as permissive
for insert
to public
with check (public.authorize('strapi_migrations.insert'::text));


create policy "select_policy"
on "public"."strapi_migrations"
as permissive
for select
to public
using (public.authorize('strapi_migrations.select'::text));


create policy "update_policy"
on "public"."strapi_migrations"
as permissive
for update
to public
using (public.authorize('strapi_migrations.update'::text));


create policy "delete_policy"
on "public"."strapi_migrations_internal"
as permissive
for delete
to public
using (public.authorize('strapi_migrations_internal.delete'::text));


create policy "insert_policy"
on "public"."strapi_migrations_internal"
as permissive
for insert
to public
with check (public.authorize('strapi_migrations_internal.insert'::text));


create policy "select_policy"
on "public"."strapi_migrations_internal"
as permissive
for select
to public
using (public.authorize('strapi_migrations_internal.select'::text));


create policy "update_policy"
on "public"."strapi_migrations_internal"
as permissive
for update
to public
using (public.authorize('strapi_migrations_internal.update'::text));


create policy "delete_policy"
on "public"."votes"
as permissive
for delete
to public
using (public.authorize('votes.delete'::text));


create policy "insert_policy"
on "public"."votes"
as permissive
for insert
to public
with check (public.authorize('votes.insert'::text));


create policy "select_policy"
on "public"."votes"
as permissive
for select
to public
using (public.authorize('votes.select'::text));


create policy "update_policy"
on "public"."votes"
as permissive
for update
to public
using (public.authorize('votes.update'::text));



