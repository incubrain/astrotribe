set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_role_permissions(config jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    role_key TEXT;
    table_group TEXT;
    table_name TEXT;
    permissions JSONB;
BEGIN
    -- Clear existing permissions
    DELETE FROM public.role_permissions;
    
    -- Loop through roles
    FOR role_key IN SELECT jsonb_object_keys(config->'roles')
    LOOP
        -- Loop through table groups for each role
        FOR table_group IN SELECT jsonb_object_keys(config->'roles'->role_key)
        LOOP
            IF table_group = 'all_tables' THEN
                -- Handle 'all_tables' case
                FOR table_name IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
                LOOP
                    permissions := jsonb_object_agg(
                        perm, 
                        true
                    ) FROM jsonb_array_elements_text(config->'roles'->role_key->'all_tables'->'permissions') AS perm;
                    
                    INSERT INTO public.role_permissions (role, table_name, permissions, conditions)
                    VALUES (
                        role_key::app_role_enum,
                        table_name,
                        permissions,
                        COALESCE(config->'roles'->role_key->'all_tables'->'conditions', '{}'::jsonb)
                    );
                END LOOP;
            ELSE
                -- Handle specific table groups
                FOR table_name IN SELECT jsonb_array_elements_text(config->'tables'->table_group)
                LOOP
                    permissions := jsonb_object_agg(
                        perm, 
                        true
                    ) FROM jsonb_array_elements_text(config->'roles'->role_key->table_group->'permissions') AS perm;
                    
                    INSERT INTO public.role_permissions (role, table_name, permissions, conditions)
                    VALUES (
                        role_key::app_role_enum,
                        table_name,
                        permissions,
                        COALESCE(config->'roles'->role_key->table_group->'conditions', '{}'::jsonb)
                    );
                END LOOP;
            END IF;
        END LOOP;
    END LOOP;
END;
$function$
;


