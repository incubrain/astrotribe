drop policy "delete_policy" on public.role_permissions_materialized;

drop policy "insert_policy" on public.role_permissions_materialized;

drop policy "select_policy" on public.role_permissions_materialized;

drop policy "update_policy" on public.role_permissions_materialized;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.authorize(requested_permission text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    user_role public.app_role_enum;
    v_table_name TEXT;
    operation TEXT;
    check_result boolean;
    jwt jsonb;
BEGIN
    -- Early exit for public.role_permissions_materialized table to prevent recursion
    IF split_part(requested_permission, '.', 1) = 'public.role_permissions_materialized' THEN
        RETURN true;
    END IF;

    jwt := auth.jwt();
    
    -- Service role bypass
    IF (jwt ->> 'role') = 'service_role' THEN
        RETURN TRUE;
    END IF;

    -- Get user role once
    user_role := ((jwt -> 'app_metadata') ->> 'role')::public.app_role_enum;
    IF user_role IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Parse permission request
    v_table_name := split_part(requested_permission, '.', 1);
    operation := split_part(requested_permission, '.', 2);
    
    -- Super admin bypass
    IF user_role = 'super_admin' THEN
        RETURN TRUE;
    END IF;

    -- Direct permission lookup without RLS triggering
    SELECT permissions -> v_table_name -> operation INTO check_result
    FROM public.role_permissions_materialized
    WHERE role = user_role;
    
    RETURN COALESCE(check_result, FALSE);
END;
$function$
;

create policy "allow_read_permissions"
on public.role_permissions_materialized
as permissive
for select
to authenticated
using (true);