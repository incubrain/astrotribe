alter table "public"."categorized_urls" drop constraint "categorized_urls_company_id_fkey";

alter table "public"."categorized_urls" drop constraint "categorized_urls_original_url_key";

alter table "public"."customer_payments" drop constraint "customer_payments_external_payment_id_key";

alter table "public"."customer_subscriptions" drop constraint "customer_subscriptions_external_subscription_id_key";

alter table "public"."customer_subscriptions" drop constraint "unique_user_plan";

drop materialized view if exists "public"."content_scores";

drop materialized view if exists "public"."news_details";

drop index if exists "public"."categorized_urls_original_url_key";

drop index if exists "public"."customer_payments_external_payment_id_key";

drop index if exists "public"."customer_subscriptions_external_subscription_id_key";

drop index if exists "public"."idx_categorized_urls_company_id";

drop index if exists "public"."unique_user_plan";

alter table "public"."categorized_urls" drop column "company_id";

alter table "public"."categorized_urls" drop column if exists "original_url";

alter table "public"."categorized_urls" add column if not exists "found_on" text not null;

alter table "public"."categorized_urls" add column if not exists "url" text not null;

-- Step 1: Add a new column with smallint type
ALTER TABLE "public"."categorized_urls" ADD COLUMN "priority_int" SMALLINT;

-- Step 2: Update existing rows with mapped values
UPDATE "public"."categorized_urls"
SET "priority_int" = 
    CASE 
        WHEN "priority" = 'low' THEN 1
        WHEN "priority" = 'medium' THEN 2
        WHEN "priority" = 'high' THEN 3
        ELSE NULL -- Handle unexpected values safely
    END;

-- Step 3: Drop the old column
ALTER TABLE "public"."categorized_urls" DROP COLUMN "priority";

-- Step 4: Rename the new column to "priority"
ALTER TABLE "public"."categorized_urls" RENAME COLUMN "priority_int" TO "priority";

alter table "public"."contents" add column "rss_url" text;

UPDATE "public"."customer_subscriptions"
SET "current_end" = NOW() + INTERVAL '1 year'
WHERE "current_end" IS NULL;


alter table "public"."customer_subscriptions" alter column "current_end" set not null;

UPDATE "public"."customer_subscriptions"
SET "current_start" = NOW()
WHERE "current_start" IS NULL;

alter table "public"."customer_subscriptions" alter column "current_start" set not null;

CREATE INDEX idx_categorized_urls_normalized_url ON public.categorized_urls USING btree (found_on);

CREATE UNIQUE INDEX unique_normalized_url ON public.categorized_urls USING btree (found_on);

CREATE UNIQUE INDEX uq_payment_id ON public.customer_payments USING btree (external_payment_id);

CREATE UNIQUE INDEX uq_subscription_id ON public.customer_subscriptions USING btree (external_subscription_id);


alter table "public"."categorized_urls" add constraint "unique_normalized_url" UNIQUE using index "unique_normalized_url";

alter table "public"."customer_payments" add constraint "uq_payment_id" UNIQUE using index "uq_payment_id";

alter table "public"."customer_subscriptions" add constraint "uq_subscription_id" UNIQUE using index "uq_subscription_id";

create materialized view "public"."content_scores" as  SELECT c.id,
    c.content_type,
    c.title,
    c.url,
    c.hot_score,
    c.created_at,
    c.updated_at,
    ( SELECT jsonb_agg(jsonb_build_object('name', cat.name, 'isPrimary', cc.is_primary)) AS jsonb_agg
           FROM (public.content_categories cc
             JOIN public.categories cat ON ((cat.id = cc.category_id)))
          WHERE (cc.content_id = c.id)) AS categories,
    ( SELECT jsonb_agg(t.name) AS jsonb_agg
           FROM (public.content_tags ct
             JOIN public.tags t ON ((t.id = ct.tag_id)))
          WHERE (ct.content_id = c.id)) AS tags,
    ( SELECT cs.content_status
           FROM public.content_statuses cs
          WHERE (cs.content_id = c.id)
          ORDER BY cs.created_at DESC
         LIMIT 1) AS status
   FROM public.contents c
  WHERE (EXISTS ( SELECT 1
           FROM public.content_statuses cs
          WHERE ((cs.content_id = c.id) AND (cs.content_status = 'published'::public.content_status))));

create materialized view "public"."news_details" as  WITH vote_counts AS (
         SELECT votes.content_id,
            count(*) AS vote_count
           FROM public.votes
          GROUP BY votes.content_id
        ), bookmark_counts AS (
         SELECT bookmarks.content_id,
            count(*) AS bookmark_count
           FROM public.bookmarks
          GROUP BY bookmarks.content_id
        ), summary_levels AS (
         SELECT news_summaries.news_id,
            jsonb_build_object('beginner', jsonb_agg(json_build_object('id', news_summaries.id, 'summary', news_summaries.summary, 'version', news_summaries.version)) FILTER (WHERE (news_summaries.complexity_level = 'beginner'::public.complexity_level)), 'intermediate', jsonb_agg(json_build_object('id', news_summaries.id, 'summary', news_summaries.summary, 'version', news_summaries.version)) FILTER (WHERE (news_summaries.complexity_level = 'intermediate'::public.complexity_level)), 'expert', jsonb_agg(json_build_object('id', news_summaries.id, 'summary', news_summaries.summary, 'version', news_summaries.version)) FILTER (WHERE (news_summaries.complexity_level = 'expert'::public.complexity_level)), 'undefined', jsonb_agg(json_build_object('id', news_summaries.id, 'summary', news_summaries.summary, 'version', news_summaries.version)) FILTER (WHERE (news_summaries.complexity_level = 'undefined'::public.complexity_level))) AS summaries
           FROM public.news_summaries
          WHERE (news_summaries.is_current = true)
          GROUP BY news_summaries.news_id
        )
 SELECT c.id,
    n.title,
    c.url,
    c.hot_score,
    c.created_at,
    c.updated_at,
    n.published_at,
    n.featured_image,
    n.author,
    n.description,
    comp.name AS company_name,
    comp.logo_url AS company_logo,
    s.summaries,
    COALESCE(v.vote_count, (0)::bigint) AS vote_count,
    COALESCE(b.bookmark_count, (0)::bigint) AS bookmark_count,
    ( SELECT jsonb_agg(jsonb_build_object('name', cat.name, 'isPrimary', cc.is_primary)) AS jsonb_agg
           FROM (public.content_categories cc
             JOIN public.categories cat ON ((cat.id = cc.category_id)))
          WHERE (cc.content_id = c.id)) AS categories,
    ( SELECT jsonb_agg(t.name) AS jsonb_agg
           FROM (public.content_tags ct
             JOIN public.tags t ON ((t.id = ct.tag_id)))
          WHERE (ct.content_id = c.id)) AS tags
   FROM (((((public.contents c
     JOIN public.news n ON ((n.id = c.id)))
     LEFT JOIN public.companies comp ON ((comp.id = n.company_id)))
     LEFT JOIN summary_levels s ON ((s.news_id = n.id)))
     LEFT JOIN vote_counts v ON ((v.content_id = c.id)))
     LEFT JOIN bookmark_counts b ON ((b.content_id = c.id)));

CREATE INDEX idx_content_scores_content_type ON public.content_scores USING btree (content_type);

CREATE INDEX idx_content_scores_created_at ON public.content_scores USING btree (created_at DESC);

CREATE INDEX idx_content_scores_hot_score ON public.content_scores USING btree (hot_score DESC);

CREATE UNIQUE INDEX idx_content_scores_id ON public.content_scores USING btree (id);

CREATE UNIQUE INDEX news_details_id_idx ON public.news_details USING btree (id);

grant delete on table "public"."table_maintenance_log" to "anon";

grant insert on table "public"."table_maintenance_log" to "anon";

grant references on table "public"."table_maintenance_log" to "anon";

grant select on table "public"."table_maintenance_log" to "anon";

grant trigger on table "public"."table_maintenance_log" to "anon";

grant truncate on table "public"."table_maintenance_log" to "anon";

grant update on table "public"."table_maintenance_log" to "anon";

grant delete on table "public"."table_maintenance_log" to "authenticated";

grant insert on table "public"."table_maintenance_log" to "authenticated";

grant references on table "public"."table_maintenance_log" to "authenticated";

grant select on table "public"."table_maintenance_log" to "authenticated";

grant trigger on table "public"."table_maintenance_log" to "authenticated";

grant truncate on table "public"."table_maintenance_log" to "authenticated";

grant update on table "public"."table_maintenance_log" to "authenticated";

grant delete on table "public"."table_maintenance_log" to "service_role";

grant insert on table "public"."table_maintenance_log" to "service_role";

grant references on table "public"."table_maintenance_log" to "service_role";

grant select on table "public"."table_maintenance_log" to "service_role";

grant trigger on table "public"."table_maintenance_log" to "service_role";

grant truncate on table "public"."table_maintenance_log" to "service_role";

grant update on table "public"."table_maintenance_log" to "service_role";
