-- Create sequence for categories_id_seq
CREATE SEQUENCE IF NOT EXISTS "public"."categories_id_seq";

-- Drop existing policies on tables
DROP POLICY IF EXISTS "read_all_policy" ON "public"."addresses";
DROP POLICY IF EXISTS "read_all_policy" ON "public"."categories";
DROP POLICY IF EXISTS "read_all_policy" ON "public"."cities";
DROP POLICY IF EXISTS "read_all_policy" ON "public"."companies";
DROP POLICY IF EXISTS "read_all_policy" ON "public"."company_employees";
DROP POLICY IF EXISTS "read_all_policy" ON "public"."contacts";
DROP POLICY IF EXISTS "read_all_policy" ON "public"."countries";
DROP POLICY IF EXISTS "read_all_policy" ON "public"."feedbacks";
DROP POLICY IF EXISTS "read_all_policy" ON "public"."news";
DROP POLICY IF EXISTS "read_all_policy" ON "public"."news_tags";
DROP POLICY IF EXISTS "read_all_policy" ON "public"."plan_permissions";
DROP POLICY IF EXISTS "read_all_policy" ON "public"."research";
DROP POLICY IF EXISTS "read_all_policy" ON "public"."responses";
DROP POLICY IF EXISTS "read_all_policy" ON "public"."searches";
DROP POLICY IF EXISTS "read_all_policy" ON "public"."social_media";
DROP POLICY IF EXISTS "read_all_policy" ON "public"."tags";
DROP POLICY IF EXISTS "read_all_policy" ON "public"."user_followers";
DROP POLICY IF EXISTS "read_all_policy" ON "public"."user_profiles";
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."company_extras";
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."research_embeddings";
DROP POLICY IF EXISTS "admin_delete" ON "public"."research_embeddings";
DROP POLICY IF EXISTS "super_admin_update" ON "public"."research_embeddings";

-- Alter user_profiles table
ALTER TABLE "public"."user_profiles" ALTER COLUMN "role" DROP DEFAULT;

-- Rename old app_role_enum type
ALTER TYPE "public"."app_role_enum" RENAME TO "app_role_enum__old_version_to_be_dropped";

-- Create new app_role_enum type
CREATE TYPE "public"."app_role_enum" AS ENUM (
    'guest',
    'user',
    'astroguide',
    'mentor',
    'moderator',
    'tenant_member',
    'tenant_admin',
    'tenant_super_admin',
    'admin',
    'super_admin',
    'service_role'
);

-- Create role_hierarchy table
CREATE TABLE IF NOT EXISTS "public"."role_hierarchy" (
    "parent_role" public.app_role_enum NOT NULL,
    "child_role" public.app_role_enum NOT NULL,
    PRIMARY KEY (parent_role, child_role)
);

-- Enable RLS on role_hierarchy
ALTER TABLE "public"."role_hierarchy" ENABLE ROW LEVEL SECURITY;

-- Update role column types
ALTER TABLE "public"."role_permissions"
ALTER COLUMN role TYPE public.app_role_enum USING role::text::public.app_role_enum;

ALTER TABLE "public"."user_profiles"
ALTER COLUMN role TYPE public.app_role_enum USING role::text::public.app_role_enum;

ALTER TABLE "public"."user_profiles" ALTER COLUMN "role" SET DEFAULT 'user'::public.app_role_enum;

-- Drop old app_role_enum type
DROP TYPE "public"."app_role_enum__old_version_to_be_dropped";

-- Enable RLS on various tables
ALTER TABLE "public"."bookmark_folders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."bookmarks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."feed_categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."feeds" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."votes" ENABLE ROW LEVEL SECURITY;

-- Alter columns and sequences
ALTER TABLE "public"."categories" ALTER COLUMN "id" SET DEFAULT nextval('public.categories_id_seq'::regclass);
CREATE SEQUENCE IF NOT EXISTS "public"."categories_id_seq";

-- Finally set the sequence ownership
ALTER SEQUENCE "public"."categories_id_seq"
    OWNED BY "public"."categories"."id";

ALTER TABLE "public"."user_followers" ALTER COLUMN "id" SET DEFAULT extensions.uuid_generate_v4();

-- Add columns to public.role_permissions
ALTER TABLE "public"."role_permissions"
ADD COLUMN "cached_permissions" jsonb,
ADD COLUMN "inherit_from" public.app_role_enum[],
ADD COLUMN "last_updated" TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create unique index and primary key on role_hierarchy
-- Drop the existing constraint if it exists (since we'll recreate it)
ALTER TABLE IF EXISTS "public"."role_hierarchy" 
    DROP CONSTRAINT IF EXISTS "role_hierarchy_pkey";

-- Drop the existing index if it exists
DROP INDEX IF EXISTS "public"."role_hierarchy_pkey";

-- Create the unique index
CREATE UNIQUE INDEX role_hierarchy_pkey 
    ON public.role_hierarchy 
    USING btree (parent_role, child_role);

-- Add the primary key constraint using the index
ALTER TABLE "public"."role_hierarchy" 
    ADD CONSTRAINT "role_hierarchy_pkey" 
    PRIMARY KEY USING INDEX "role_hierarchy_pkey";

-- Set check_function_bodies to off
SET check_function_bodies = off;

-- Create the public.role_permissions table
CREATE TABLE IF NOT EXISTS "public"."role_permissions" (
    id SERIAL PRIMARY KEY,
    role public.app_role_enum NOT NULL,
    table_name TEXT NOT NULL,
    permissions JSONB,
    conditions JSONB,
    inherit_from public.app_role_enum[],
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    cached_permissions JSONB
);

-- Alter columns if necessary
ALTER TABLE "public"."role_permissions"
ALTER COLUMN role TYPE public.app_role_enum USING role::text::public.app_role_enum;

-- Function: cache_role_permissions()
CREATE OR REPLACE FUNCTION public.cache_role_permissions()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Update cached permissions for all roles
    UPDATE public.role_permissions rp
    SET cached_permissions = (
        SELECT jsonb_object_agg(
            table_name,
            jsonb_build_object(
                'permissions', permissions,
                'conditions', conditions
            )
        )
        FROM public.get_inherited_permissions(rp.role)
    ),
    last_updated = now();
END;
$function$;

-- Function: get_inherited_permissions(p_role public.app_role_enum)
CREATE OR REPLACE FUNCTION public.get_inherited_permissions(p_role public.app_role_enum)
 RETURNS TABLE(table_name text, permissions jsonb, conditions jsonb)
 LANGUAGE sql
AS $function$
WITH RECURSIVE role_tree AS (
    -- Base case: direct permissions
    SELECT rp.table_name, rp.permissions, rp.conditions, ARRAY[rp.role] as role_path
    FROM public.role_permissions rp
    WHERE rp.role = p_role
    
    UNION ALL
    
    -- Recursive case: inherited permissions
    SELECT rp.table_name, rp.permissions, rp.conditions, rt.role_path || rp.role
    FROM public.role_permissions rp
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
$function$;

-- Function: get_inherited_roles(p_role public.app_role_enum)
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
$function$;

-- Function: insert_role_permission(...)
CREATE OR REPLACE FUNCTION public.insert_role_permission(
    p_role public.app_role_enum, 
    p_table_name text, 
    p_permissions jsonb, 
    p_conditions jsonb, 
    p_inherited_roles public.app_role_enum[]
)
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
$function$;

-- Function: process_direct_permissions(...)
CREATE OR REPLACE FUNCTION public.process_direct_permissions(
    p_config jsonb, 
    p_role_key text, 
    p_inherited_roles public.app_role_enum[]
)
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
$function$;

-- Function: process_inherited_permissions(...)
CREATE OR REPLACE FUNCTION public.process_inherited_permissions(
    p_config jsonb, 
    p_role_key text, 
    p_parent_role public.app_role_enum, 
    p_inherited_roles public.app_role_enum[]
)
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
$function$;

-- Function: setup_role_hierarchy()
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
$function$;

-- Function: update_role_permissions(config jsonb)
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
$function$;

-- Function: authorize(requested_permission text)
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
        SELECT 1 FROM public.role_permissions 
        WHERE role = user_role 
        AND last_updated < now() - interval '1 hour'
    ) THEN
        PERFORM cache_role_permissions();
    END IF;

    -- Use cached permissions
    SELECT cached_permissions INTO cached_perms
    FROM public.role_permissions
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
$function$;

-- Grants on role_hierarchy
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."role_hierarchy" TO "anon";
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."role_hierarchy" TO "authenticated";
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."role_hierarchy" TO "service_role";

-- Policies on role_hierarchy
CREATE POLICY "delete_policy"
ON "public"."role_hierarchy"
AS permissive
FOR DELETE
TO public
USING (public.authorize('role_hierarchy.delete'::text));

CREATE POLICY "insert_policy"
ON "public"."role_hierarchy"
AS permissive
FOR INSERT
TO public
WITH CHECK (public.authorize('role_hierarchy.insert'::text));

CREATE POLICY "select_policy"
ON "public"."role_hierarchy"
AS permissive
FOR SELECT
TO public
USING (public.authorize('role_hierarchy.select'::text));

CREATE POLICY "update_policy"
ON "public"."role_hierarchy"
AS permissive
FOR UPDATE
TO public
USING (public.authorize('role_hierarchy.update'::text));

-- Grants and policies on other tables (as per original migration)

-- Create policies on "bookmark_folders"
CREATE POLICY "delete_policy"
ON "public"."bookmark_folders"
AS permissive
FOR DELETE
TO public
USING (public.authorize('bookmark_folders.delete'::text));

CREATE POLICY "insert_policy"
ON "public"."bookmark_folders"
AS permissive
FOR INSERT
TO public
WITH CHECK (public.authorize('bookmark_folders.insert'::text));

CREATE POLICY "select_policy"
ON "public"."bookmark_folders"
AS permissive
FOR SELECT
TO public
USING (public.authorize('bookmark_folders.select'::text));

CREATE POLICY "update_policy"
ON "public"."bookmark_folders"
AS permissive
FOR UPDATE
TO public
USING (public.authorize('bookmark_folders.update'::text));

-- Repeat similar policies for "bookmarks", "feed_categories", "feeds", "votes", etc., as per the original migration.

-- Refresh cached permissions after setup
SELECT public.cache_role_permissions();
