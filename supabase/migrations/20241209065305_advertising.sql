create table "public"."ad_daily_metrics" (
    "id" uuid not null default gen_random_uuid(),
    "variant_id" uuid,
    "date" date not null,
    "views" integer default 0,
    "clicks" integer default 0,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."ad_daily_metrics" enable row level security;

create table "public"."ad_packages" (
    "id" uuid not null default gen_random_uuid(),
    "name" character varying(255) not null,
    "position" character varying(50) not null,
    "active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "description" text not null,
    "price" numeric(10,2) not null,
    "features" text[] not null,
    "expected_ctr" numeric(5,2),
    "avg_roi" numeric(5,2),
    "view_frequency" numeric(4,2) default 1.0
);


alter table "public"."ad_packages" enable row level security;

create table "public"."ad_variants" (
    "id" uuid not null default gen_random_uuid(),
    "ad_id" uuid not null,
    "content" jsonb not null,
    "is_control" boolean default false,
    "active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "performance_metrics" jsonb default '{"ctr": null, "bounceRate": null, "avgEngagementTime": null}'::jsonb
);


alter table "public"."ad_variants" enable row level security;

create table "public"."ads" (
    "id" uuid not null default gen_random_uuid(),
    "company_id" uuid not null,
    "package_id" uuid not null,
    "start_date" timestamp with time zone not null,
    "end_date" timestamp with time zone not null,
    "active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."ads" enable row level security;

CREATE UNIQUE INDEX ad_daily_metrics_pkey ON public.ad_daily_metrics USING btree (id);

CREATE UNIQUE INDEX ad_daily_metrics_variant_id_date_key ON public.ad_daily_metrics USING btree (variant_id, date);

CREATE UNIQUE INDEX ad_packages_pkey ON public.ad_packages USING btree (id);

CREATE UNIQUE INDEX ad_variants_pkey ON public.ad_variants USING btree (id);

CREATE UNIQUE INDEX ads_pkey ON public.ads USING btree (id);

CREATE INDEX idx_ad_metrics_date ON public.ad_daily_metrics USING btree (variant_id, date);

CREATE INDEX idx_ads_dates ON public.ads USING btree (start_date, end_date);

alter table "public"."ad_daily_metrics" add constraint "ad_daily_metrics_pkey" PRIMARY KEY using index "ad_daily_metrics_pkey";

alter table "public"."ad_packages" add constraint "ad_packages_pkey" PRIMARY KEY using index "ad_packages_pkey";

alter table "public"."ad_variants" add constraint "ad_variants_pkey" PRIMARY KEY using index "ad_variants_pkey";

alter table "public"."ads" add constraint "ads_pkey" PRIMARY KEY using index "ads_pkey";

alter table "public"."ad_daily_metrics" add constraint "ad_daily_metrics_variant_id_date_key" UNIQUE using index "ad_daily_metrics_variant_id_date_key";

alter table "public"."ad_daily_metrics" add constraint "ad_daily_metrics_variant_id_fkey" FOREIGN KEY (variant_id) REFERENCES public.ad_variants(id) not valid;

alter table "public"."ad_daily_metrics" validate constraint "ad_daily_metrics_variant_id_fkey";

alter table "public"."ad_variants" add constraint "ad_variants_ad_id_fkey" FOREIGN KEY (ad_id) REFERENCES public.ads(id) not valid;

alter table "public"."ad_variants" validate constraint "ad_variants_ad_id_fkey";

alter table "public"."ads" add constraint "ads_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id) not valid;

alter table "public"."ads" validate constraint "ads_company_id_fkey";

alter table "public"."ads" add constraint "ads_package_id_fkey" FOREIGN KEY (package_id) REFERENCES public.ad_packages(id) not valid;

alter table "public"."ads" validate constraint "ads_package_id_fkey";

alter table "public"."ads" add constraint "valid_dates" CHECK ((end_date > start_date)) not valid;

alter table "public"."ads" validate constraint "valid_dates";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_missing_updated_at_triggers()
 RETURNS TABLE(checked_table_name text, action_taken text)
 LANGUAGE plpgsql
AS $function$
DECLARE
    t record;
    current_trigger_name text;
    trigger_exists boolean;
BEGIN
    -- First ensure our update_updated_at_column() function exists
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_proc 
        WHERE proname = 'update_updated_at_column'
    ) THEN
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $func$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $func$ LANGUAGE plpgsql;
    END IF;

    -- Loop through all tables in public schema that have updated_at column
    FOR t IN 
        SELECT c.table_schema, c.table_name 
        FROM information_schema.columns c
        WHERE c.column_name = 'updated_at' 
        AND c.table_schema = 'public'
    LOOP
        -- Construct trigger name
        current_trigger_name := 'update_' || t.table_name || '_timestamp';
        
        -- Check if trigger already exists
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.triggers trig
            WHERE trig.trigger_schema = t.table_schema
            AND trig.event_object_table = t.table_name
            AND trig.trigger_name = current_trigger_name
        ) INTO trigger_exists;

        -- If trigger doesn't exist, create it
        IF NOT trigger_exists THEN
            EXECUTE format(
                'CREATE TRIGGER %I
                BEFORE UPDATE ON %I.%I
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column()',
                current_trigger_name,
                t.table_schema,
                t.table_name
            );
            
            checked_table_name := t.table_name;
            action_taken := 'Added trigger';
            RETURN NEXT;
        ELSE
            checked_table_name := t.table_name;
            action_taken := 'Trigger already exists';
            RETURN NEXT;
        END IF;
    END LOOP;

    RETURN;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_active_ads()
 RETURNS TABLE(id uuid, package_id uuid, company_id uuid, company jsonb, variants jsonb, start_date timestamp with time zone, end_date timestamp with time zone, active boolean)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.package_id,
        a.company_id,
        jsonb_build_object(
            'id', c.id,
            'name', c.name,
            'logo_url', c.logo_url
        ) as company,
        jsonb_agg(
            jsonb_build_object(
                'id', v.id,
                'content', v.content,
                'is_control', v.is_control,
                'active', v.active
            )
        ) as variants,
        a.start_date,
        a.end_date,
        a.active
    FROM ads a
    JOIN companies c ON a.company_id = c.id
    JOIN ad_variants v ON v.ad_id = a.id
    WHERE a.active = true
    AND a.end_date >= CURRENT_TIMESTAMP
    AND a.start_date <= CURRENT_TIMESTAMP
    GROUP BY a.id, a.package_id, a.company_id, c.id, c.name, c.logo_url;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_active_ads(position_type text)
 RETURNS TABLE(id uuid, company_name character varying, company_logo_url text, variant_id uuid, content jsonb)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        c.name as company_name,
        c.logo_url as company_logo_url,
        v.id as variant_id,
        v.content
    FROM ads a
    JOIN companies c ON a.company_id = c.id
    JOIN ad_packages p ON a.package_id = p.id
    JOIN ad_variants v ON v.ad_id = a.id
    WHERE p.position = position_type
    AND a.active = true
    AND v.active = true
    AND c.content_status = 'published'
    AND CURRENT_TIMESTAMP BETWEEN a.start_date AND a.end_date;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_ad_analytics(start_date timestamp with time zone)
 RETURNS TABLE(id uuid, package_name character varying, ad_position character varying, company_name character varying, logo_url text, title text, total_views bigint, total_clicks bigint, ctr numeric, ad_start_date timestamp with time zone, ad_end_date timestamp with time zone, days_tracked bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    WITH metrics AS (
        SELECT 
            v.ad_id AS ad_id,
            SUM(md.views) AS total_views,
            SUM(md.clicks) AS total_clicks,
            ROUND(CAST(SUM(md.clicks) AS decimal) / NULLIF(SUM(md.views), 0) * 100, 2) AS ctr,
            COUNT(DISTINCT md.date) AS days_tracked
        FROM ad_daily_metrics md
        JOIN public.ad_variants v ON md.variant_id = v.id
        WHERE md.date >= start_date
        GROUP BY v.ad_id
    )
    SELECT 
        a.id,
        p.name AS package_name,
        p.position AS ad_position,
        c.name AS company_name,
        c.logo_url,
        v.content->>'title' AS title,
        m.total_views,
        m.total_clicks,
        m.ctr,
        a.start_date AS ad_start_date,
        a.end_date AS ad_end_date,
        m.days_tracked
    FROM ads a
    JOIN public.ad_packages p ON a.package_id = p.id
    JOIN public.companies c ON a.company_id = c.id
    JOIN public.ad_variants v ON v.ad_id = a.id
    LEFT JOIN metrics m ON m.ad_id = a.id
    WHERE v.is_control = true
      AND a.active = true
    ORDER BY m.total_views DESC NULLS LAST;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_ad_daily_trends(ad_uuid uuid, start_date timestamp with time zone)
 RETURNS TABLE(date date, views bigint, clicks bigint, ctr numeric)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        md.date,
        SUM(md.views) AS views,
        SUM(md.clicks) AS clicks,
        ROUND(CAST(SUM(md.clicks) AS decimal) / NULLIF(SUM(md.views),0) * 100, 2) AS ctr
    FROM public.ad_daily_metrics md
    JOIN public.ad_variants v ON md.variant_id = v.id
    WHERE v.ad_id = ad_uuid
      AND md.date >= start_date
    GROUP BY md.date
    ORDER BY md.date ASC;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_ad_variant_metrics(ad_uuid uuid)
 RETURNS TABLE(variant_id uuid, is_control boolean, content jsonb, total_views bigint, total_clicks bigint, ctr numeric, daily_metrics jsonb)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    WITH daily AS (
        SELECT 
            v.id AS vid,
            json_agg(
                json_build_object(
                    'date', m.date,
                    'views', m.views,
                    'clicks', m.clicks
                ) ORDER BY m.date
            )::jsonb AS metrics
        FROM public.ad_variants v
        LEFT JOIN public.ad_daily_metrics m ON m.variant_id = v.id
        WHERE v.ad_id = $1
        GROUP BY v.id
    )
    SELECT 
        v.id AS variant_id,
        v.is_control,
        v.content,
        COALESCE(SUM(m.views), 0) AS total_views,
        COALESCE(SUM(m.clicks), 0) AS total_clicks,
        ROUND(CAST(SUM(m.clicks) AS decimal) / NULLIF(SUM(m.views), 0) * 100, 2) AS ctr,
        d.metrics AS daily_metrics
    FROM ad_variants v
    LEFT JOIN public.ad_daily_metrics m ON m.variant_id = v.id
    LEFT JOIN daily d ON d.vid = v.id
    WHERE v.ad_id = $1
    GROUP BY v.id, v.is_control, v.content, d.metrics;
END;
$function$
;

grant delete on table "public"."ad_daily_metrics" to "anon";

grant insert on table "public"."ad_daily_metrics" to "anon";

grant references on table "public"."ad_daily_metrics" to "anon";

grant select on table "public"."ad_daily_metrics" to "anon";

grant trigger on table "public"."ad_daily_metrics" to "anon";

grant truncate on table "public"."ad_daily_metrics" to "anon";

grant update on table "public"."ad_daily_metrics" to "anon";

grant delete on table "public"."ad_daily_metrics" to "authenticated";

grant insert on table "public"."ad_daily_metrics" to "authenticated";

grant references on table "public"."ad_daily_metrics" to "authenticated";

grant select on table "public"."ad_daily_metrics" to "authenticated";

grant trigger on table "public"."ad_daily_metrics" to "authenticated";

grant truncate on table "public"."ad_daily_metrics" to "authenticated";

grant update on table "public"."ad_daily_metrics" to "authenticated";

grant delete on table "public"."ad_daily_metrics" to "service_role";

grant insert on table "public"."ad_daily_metrics" to "service_role";

grant references on table "public"."ad_daily_metrics" to "service_role";

grant select on table "public"."ad_daily_metrics" to "service_role";

grant trigger on table "public"."ad_daily_metrics" to "service_role";

grant truncate on table "public"."ad_daily_metrics" to "service_role";

grant update on table "public"."ad_daily_metrics" to "service_role";

grant delete on table "public"."ad_packages" to "anon";

grant insert on table "public"."ad_packages" to "anon";

grant references on table "public"."ad_packages" to "anon";

grant select on table "public"."ad_packages" to "anon";

grant trigger on table "public"."ad_packages" to "anon";

grant truncate on table "public"."ad_packages" to "anon";

grant update on table "public"."ad_packages" to "anon";

grant delete on table "public"."ad_packages" to "authenticated";

grant insert on table "public"."ad_packages" to "authenticated";

grant references on table "public"."ad_packages" to "authenticated";

grant select on table "public"."ad_packages" to "authenticated";

grant trigger on table "public"."ad_packages" to "authenticated";

grant truncate on table "public"."ad_packages" to "authenticated";

grant update on table "public"."ad_packages" to "authenticated";

grant delete on table "public"."ad_packages" to "service_role";

grant insert on table "public"."ad_packages" to "service_role";

grant references on table "public"."ad_packages" to "service_role";

grant select on table "public"."ad_packages" to "service_role";

grant trigger on table "public"."ad_packages" to "service_role";

grant truncate on table "public"."ad_packages" to "service_role";

grant update on table "public"."ad_packages" to "service_role";

grant delete on table "public"."ad_variants" to "anon";

grant insert on table "public"."ad_variants" to "anon";

grant references on table "public"."ad_variants" to "anon";

grant select on table "public"."ad_variants" to "anon";

grant trigger on table "public"."ad_variants" to "anon";

grant truncate on table "public"."ad_variants" to "anon";

grant update on table "public"."ad_variants" to "anon";

grant delete on table "public"."ad_variants" to "authenticated";

grant insert on table "public"."ad_variants" to "authenticated";

grant references on table "public"."ad_variants" to "authenticated";

grant select on table "public"."ad_variants" to "authenticated";

grant trigger on table "public"."ad_variants" to "authenticated";

grant truncate on table "public"."ad_variants" to "authenticated";

grant update on table "public"."ad_variants" to "authenticated";

grant delete on table "public"."ad_variants" to "service_role";

grant insert on table "public"."ad_variants" to "service_role";

grant references on table "public"."ad_variants" to "service_role";

grant select on table "public"."ad_variants" to "service_role";

grant trigger on table "public"."ad_variants" to "service_role";

grant truncate on table "public"."ad_variants" to "service_role";

grant update on table "public"."ad_variants" to "service_role";

grant delete on table "public"."ads" to "anon";

grant insert on table "public"."ads" to "anon";

grant references on table "public"."ads" to "anon";

grant select on table "public"."ads" to "anon";

grant trigger on table "public"."ads" to "anon";

grant truncate on table "public"."ads" to "anon";

grant update on table "public"."ads" to "anon";

grant delete on table "public"."ads" to "authenticated";

grant insert on table "public"."ads" to "authenticated";

grant references on table "public"."ads" to "authenticated";

grant select on table "public"."ads" to "authenticated";

grant trigger on table "public"."ads" to "authenticated";

grant truncate on table "public"."ads" to "authenticated";

grant update on table "public"."ads" to "authenticated";

grant delete on table "public"."ads" to "service_role";

grant insert on table "public"."ads" to "service_role";

grant references on table "public"."ads" to "service_role";

grant select on table "public"."ads" to "service_role";

grant trigger on table "public"."ads" to "service_role";

grant truncate on table "public"."ads" to "service_role";

grant update on table "public"."ads" to "service_role";

create policy "delete_policy"
on "public"."ad_daily_metrics"
as permissive
for delete
to public
using (public.authorize('ad_daily_metrics.delete'::text));


create policy "insert_policy"
on "public"."ad_daily_metrics"
as permissive
for insert
to public
with check (public.authorize('ad_daily_metrics.insert'::text));


create policy "select_policy"
on "public"."ad_daily_metrics"
as permissive
for select
to public
using (public.authorize('ad_daily_metrics.select'::text));


create policy "update_policy"
on "public"."ad_daily_metrics"
as permissive
for update
to public
using (public.authorize('ad_daily_metrics.update'::text));


create policy "delete_policy"
on "public"."ad_packages"
as permissive
for delete
to public
using (public.authorize('ad_packages.delete'::text));


create policy "insert_policy"
on "public"."ad_packages"
as permissive
for insert
to public
with check (public.authorize('ad_packages.insert'::text));


create policy "select_policy"
on "public"."ad_packages"
as permissive
for select
to public
using (public.authorize('ad_packages.select'::text));


create policy "update_policy"
on "public"."ad_packages"
as permissive
for update
to public
using (public.authorize('ad_packages.update'::text));


create policy "delete_policy"
on "public"."ad_variants"
as permissive
for delete
to public
using (public.authorize('ad_variants.delete'::text));


create policy "insert_policy"
on "public"."ad_variants"
as permissive
for insert
to public
with check (public.authorize('ad_variants.insert'::text));


create policy "select_policy"
on "public"."ad_variants"
as permissive
for select
to public
using (public.authorize('ad_variants.select'::text));


create policy "update_policy"
on "public"."ad_variants"
as permissive
for update
to public
using (public.authorize('ad_variants.update'::text));


create policy "delete_policy"
on "public"."ads"
as permissive
for delete
to public
using (public.authorize('ads.delete'::text));


create policy "insert_policy"
on "public"."ads"
as permissive
for insert
to public
with check (public.authorize('ads.insert'::text));


create policy "select_policy"
on "public"."ads"
as permissive
for select
to public
using (public.authorize('ads.select'::text));


create policy "update_policy"
on "public"."ads"
as permissive
for update
to public
using (public.authorize('ads.update'::text));


CREATE TRIGGER update_ad_daily_metrics_timestamp BEFORE UPDATE ON public.ad_daily_metrics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ad_packages_timestamp BEFORE UPDATE ON public.ad_packages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ad_variants_timestamp BEFORE UPDATE ON public.ad_variants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_addresses_timestamp BEFORE UPDATE ON public.addresses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ads_timestamp BEFORE UPDATE ON public.ads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookmark_folders_timestamp BEFORE UPDATE ON public.bookmark_folders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookmarks_timestamp BEFORE UPDATE ON public.bookmarks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_categories_timestamp BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_classified_urls_timestamp BEFORE UPDATE ON public.classified_urls FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comments_timestamp BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_companies_timestamp BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_contacts_timestamp BEFORE UPDATE ON public.company_contacts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_employees_timestamp BEFORE UPDATE ON public.company_employees FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_extras_timestamp BEFORE UPDATE ON public.company_extras FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_urls_timestamp BEFORE UPDATE ON public.company_urls FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contacts_timestamp BEFORE UPDATE ON public.contacts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_sources_timestamp BEFORE UPDATE ON public.content_sources FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contents_timestamp BEFORE UPDATE ON public.contents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_subscription_plans_timestamp BEFORE UPDATE ON public.customer_subscription_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_subscriptions_timestamp BEFORE UPDATE ON public.customer_subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_embedding_reviews_timestamp BEFORE UPDATE ON public.embedding_reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_feature_rankings_timestamp BEFORE UPDATE ON public.feature_rankings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_feature_requests_timestamp BEFORE UPDATE ON public.feature_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_feedbacks_timestamp BEFORE UPDATE ON public.feedbacks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_news_timestamp BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_newsletters_timestamp BEFORE UPDATE ON public.newsletters FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_providers_timestamp BEFORE UPDATE ON public.payment_providers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_research_timestamp BEFORE UPDATE ON public.research FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_research_embeddings_timestamp BEFORE UPDATE ON public.research_embeddings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_social_media_timestamp BEFORE UPDATE ON public.social_media FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tags_timestamp BEFORE UPDATE ON public.tags FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_metrics_timestamp BEFORE UPDATE ON public.user_metrics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_profiles_timestamp BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


