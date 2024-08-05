alter table "public"."content_sources" drop constraint "content_sources_scraper_id_fkey";

alter table "public"."content_sources" drop column "scraper_id";

alter table "public"."content_sources" add column "is_outdated" boolean;

alter table "public"."content_sources" add column "last_scraped" timestamp with time zone default (now() - '1 day'::interval);

alter table "public"."content_sources" add column "link_scraper_id" integer;

alter table "public"."scraper_configs" drop column "config";

alter table "public"."scraper_configs" drop column "frequency";

alter table "public"."scraper_configs" drop column "last_scraped_at";

alter table "public"."scraper_configs" add column "base_selector" text;

alter table "public"."scraper_configs" add column "fields" jsonb not null;

alter table "public"."scraper_configs" add column "pagination" jsonb;

alter table "public"."content_sources" add constraint "public_content_sources_link_scraper_id_fkey" FOREIGN KEY (link_scraper_id) REFERENCES public.scraper_configs(id) not valid;

alter table "public"."content_sources" validate constraint "public_content_sources_link_scraper_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_is_outdated()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.is_outdated := CASE 
        WHEN NEW.scrape_frequency = 'four_times_daily' THEN NEW.last_scraped < now() - interval '6 hours'
        WHEN NEW.scrape_frequency = 'twice_daily' THEN NEW.last_scraped < now() - interval '12 hours'
        WHEN NEW.scrape_frequency = 'daily' THEN NEW.last_scraped < now() - interval '1 day'
        WHEN NEW.scrape_frequency = 'weekly' THEN NEW.last_scraped < now() - interval '7 days'
        WHEN NEW.scrape_frequency = 'bi_weekly' THEN NEW.last_scraped < now() - interval '14 days'
        WHEN NEW.scrape_frequency = 'monthly' THEN NEW.last_scraped < now() - interval '30 days'
        ELSE false
    END;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.add_authorize_rls_policies()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    table_info RECORD;
    policy_exists BOOLEAN;
BEGIN
    FOR table_info IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    LOOP
        -- Enable RLS on the table if not already enabled
        EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', 'public', table_info.tablename);

        -- Check and create INSERT policy if it does not exist
        SELECT EXISTS (
            SELECT 1
            FROM pg_policies
            WHERE schemaname = 'public'
              AND tablename = table_info.tablename
              AND policyname = 'insert_policy'
        ) INTO policy_exists;

        IF NOT policy_exists THEN
            EXECUTE format('CREATE POLICY insert_policy ON %I.%I FOR INSERT WITH CHECK (public.authorize(%L))', 
                'public', table_info.tablename, table_info.tablename || '.insert');
        END IF;

        -- Check and create UPDATE policy if it does not exist
        SELECT EXISTS (
            SELECT 1
            FROM pg_policies
            WHERE schemaname = 'public'
              AND tablename = table_info.tablename
              AND policyname = 'update_policy'
        ) INTO policy_exists;

        IF NOT policy_exists THEN
            EXECUTE format('CREATE POLICY update_policy ON %I.%I FOR UPDATE USING (public.authorize(%L))', 
                'public', table_info.tablename, table_info.tablename || '.update');
        END IF;

        -- Check and create DELETE policy if it does not exist
        SELECT EXISTS (
            SELECT 1
            FROM pg_policies
            WHERE schemaname = 'public'
              AND tablename = table_info.tablename
              AND policyname = 'delete_policy'
        ) INTO policy_exists;

        IF NOT policy_exists THEN
            EXECUTE format('CREATE POLICY delete_policy ON %I.%I FOR DELETE USING (public.authorize(%L))', 
                'public', table_info.tablename, table_info.tablename || '.delete');
        END IF;
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

    -- Check for service role key in JWT and bypass authorization
    IF (auth.jwt() ->> 'role') = 'service_role' THEN
        RAISE LOG 'Service role detected. Granting access.';
        RETURN TRUE;
    END IF;

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

create policy "delete_policy"
on "public"."company_contacts"
as permissive
for delete
to public
using (public.authorize('company_contacts.delete'::text));


create policy "insert_policy"
on "public"."company_contacts"
as permissive
for insert
to public
with check (public.authorize('company_contacts.insert'::text));


create policy "update_policy"
on "public"."company_contacts"
as permissive
for update
to public
using (public.authorize('company_contacts.update'::text));


create policy "Enable read access for all users"
on "public"."company_extras"
as permissive
for select
to public
using (true);


create policy "delete_policy"
on "public"."company_extras"
as permissive
for delete
to public
using (public.authorize('company_extras.delete'::text));


create policy "insert_policy"
on "public"."company_extras"
as permissive
for insert
to public
with check (public.authorize('company_extras.insert'::text));


create policy "update_policy"
on "public"."company_extras"
as permissive
for update
to public
using (public.authorize('company_extras.update'::text));


create policy "delete_policy"
on "public"."company_urls"
as permissive
for delete
to public
using (public.authorize('company_urls.delete'::text));


create policy "insert_policy"
on "public"."company_urls"
as permissive
for insert
to public
with check (public.authorize('company_urls.insert'::text));


create policy "update_policy"
on "public"."company_urls"
as permissive
for update
to public
using (public.authorize('company_urls.update'::text));


create policy "Enable read access for all users"
on "public"."content_sources"
as permissive
for select
to public
using (true);


create policy "delete_policy"
on "public"."content_sources"
as permissive
for delete
to public
using (public.authorize('content_sources.delete'::text));


create policy "insert_policy"
on "public"."content_sources"
as permissive
for insert
to public
with check (public.authorize('content_sources.insert'::text));


create policy "update_policy"
on "public"."content_sources"
as permissive
for update
to public
using (public.authorize('content_sources.update'::text));


create policy "delete_policy"
on "public"."embedding_review"
as permissive
for delete
to public
using (public.authorize('embedding_review.delete'::text));


create policy "insert_policy"
on "public"."embedding_review"
as permissive
for insert
to public
with check (public.authorize('embedding_review.insert'::text));


create policy "update_policy"
on "public"."embedding_review"
as permissive
for update
to public
using (public.authorize('embedding_review.update'::text));


create policy "delete_policy"
on "public"."research_authors"
as permissive
for delete
to public
using (public.authorize('research_authors.delete'::text));


create policy "insert_policy"
on "public"."research_authors"
as permissive
for insert
to public
with check (public.authorize('research_authors.insert'::text));


create policy "update_policy"
on "public"."research_authors"
as permissive
for update
to public
using (public.authorize('research_authors.update'::text));


create policy "delete_policy"
on "public"."research_citations"
as permissive
for delete
to public
using (public.authorize('research_citations.delete'::text));


create policy "insert_policy"
on "public"."research_citations"
as permissive
for insert
to public
with check (public.authorize('research_citations.insert'::text));


create policy "update_policy"
on "public"."research_citations"
as permissive
for update
to public
using (public.authorize('research_citations.update'::text));


create policy "delete_policy"
on "public"."research_embeddings"
as permissive
for delete
to public
using (public.authorize('research_embeddings.delete'::text));


create policy "insert_policy"
on "public"."research_embeddings"
as permissive
for insert
to public
with check (public.authorize('research_embeddings.insert'::text));


create policy "update_policy"
on "public"."research_embeddings"
as permissive
for update
to public
using (public.authorize('research_embeddings.update'::text));


create policy "delete_policy"
on "public"."research_figures"
as permissive
for delete
to public
using (public.authorize('research_figures.delete'::text));


create policy "insert_policy"
on "public"."research_figures"
as permissive
for insert
to public
with check (public.authorize('research_figures.insert'::text));


create policy "update_policy"
on "public"."research_figures"
as permissive
for update
to public
using (public.authorize('research_figures.update'::text));


create policy "delete_policy"
on "public"."research_math"
as permissive
for delete
to public
using (public.authorize('research_math.delete'::text));


create policy "insert_policy"
on "public"."research_math"
as permissive
for insert
to public
with check (public.authorize('research_math.insert'::text));


create policy "update_policy"
on "public"."research_math"
as permissive
for update
to public
using (public.authorize('research_math.update'::text));


create policy "delete_policy"
on "public"."research_metrics"
as permissive
for delete
to public
using (public.authorize('research_metrics.delete'::text));


create policy "insert_policy"
on "public"."research_metrics"
as permissive
for insert
to public
with check (public.authorize('research_metrics.insert'::text));


create policy "update_policy"
on "public"."research_metrics"
as permissive
for update
to public
using (public.authorize('research_metrics.update'::text));


create policy "delete_policy"
on "public"."research_notes"
as permissive
for delete
to public
using (public.authorize('research_notes.delete'::text));


create policy "insert_policy"
on "public"."research_notes"
as permissive
for insert
to public
with check (public.authorize('research_notes.insert'::text));


create policy "update_policy"
on "public"."research_notes"
as permissive
for update
to public
using (public.authorize('research_notes.update'::text));


create policy "delete_policy"
on "public"."research_tables"
as permissive
for delete
to public
using (public.authorize('research_tables.delete'::text));


create policy "insert_policy"
on "public"."research_tables"
as permissive
for insert
to public
with check (public.authorize('research_tables.insert'::text));


create policy "update_policy"
on "public"."research_tables"
as permissive
for update
to public
using (public.authorize('research_tables.update'::text));


create policy "delete_policy"
on "public"."research_tools"
as permissive
for delete
to public
using (public.authorize('research_tools.delete'::text));


create policy "insert_policy"
on "public"."research_tools"
as permissive
for insert
to public
with check (public.authorize('research_tools.insert'::text));


create policy "update_policy"
on "public"."research_tools"
as permissive
for update
to public
using (public.authorize('research_tools.update'::text));


create policy "Enable read access for all users"
on "public"."scraper_configs"
as permissive
for select
to public
using (true);


create policy "delete_policy"
on "public"."scraper_configs"
as permissive
for delete
to public
using (public.authorize('scraper_configs.delete'::text));


create policy "insert_policy"
on "public"."scraper_configs"
as permissive
for insert
to public
with check (public.authorize('scraper_configs.insert'::text));


create policy "update_policy"
on "public"."scraper_configs"
as permissive
for update
to public
using (public.authorize('scraper_configs.update'::text));


create policy "delete_policy"
on "public"."spider_metrics"
as permissive
for delete
to public
using (public.authorize('spider_metrics.delete'::text));


create policy "insert_policy"
on "public"."spider_metrics"
as permissive
for insert
to public
with check (public.authorize('spider_metrics.insert'::text));


create policy "update_policy"
on "public"."spider_metrics"
as permissive
for update
to public
using (public.authorize('spider_metrics.update'::text));


CREATE TRIGGER trg_update_is_outdated BEFORE INSERT OR UPDATE ON public.content_sources FOR EACH ROW EXECUTE FUNCTION public.update_is_outdated();


