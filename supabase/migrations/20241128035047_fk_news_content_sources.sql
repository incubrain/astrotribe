alter table "public"."feed_sources" drop constraint "feed_sources_source_id_fkey";

drop index if exists "public"."feed_sources_feed_source_unique_idx";

drop index if exists "public"."feed_sources_source_id_idx";

ALTER TABLE "public"."feed_sources" 
DROP CONSTRAINT IF EXISTS feed_sources_source_id_fkey;

-- Drop the existing column
ALTER TABLE "public"."feed_sources" 
DROP COLUMN "source_id";

-- Add the new column with correct data type
ALTER TABLE "public"."feed_sources" 
ADD COLUMN "source_id" bigint;

-- Enable RLS
ALTER TABLE "public"."feed_sources" 
ENABLE ROW LEVEL SECURITY;

alter table "public"."news" add column "content_source_id" bigint;

ALTER TABLE "public"."news_tags" 
DROP CONSTRAINT IF EXISTS news_tags_news_id_fkey;

-- Drop the existing column
ALTER TABLE "public"."news_tags" 
DROP COLUMN "news_id";

-- Add the new column with correct data type
ALTER TABLE "public"."news_tags" 
ADD COLUMN "news_id" uuid;

CREATE INDEX idx_feed_sources_source_id ON public.feed_sources USING btree (source_id);

CREATE INDEX idx_news_content_source_id ON public.news USING btree (content_source_id);

alter table "public"."feed_sources" add constraint "fk_feed_sources_content_sources" FOREIGN KEY (source_id) REFERENCES public.content_sources(id) not valid;

alter table "public"."feed_sources" validate constraint "fk_feed_sources_content_sources";

alter table "public"."news" add constraint "news_content_source_id_fkey" FOREIGN KEY (content_source_id) REFERENCES public.content_sources(id) not valid;

alter table "public"."news" validate constraint "news_content_source_id_fkey";

set check_function_bodies = off;

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
$function$
;

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
$function$
;

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
$function$
;

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



