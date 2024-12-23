create type "public"."complexity_level" as enum ('beginner', 'intermediate', 'expert', 'undefined');

revoke select on table "public"."companies" from "authenticator";

revoke delete on table "public"."feed_categories" from "authenticator";

revoke insert on table "public"."feed_categories" from "authenticator";

revoke select on table "public"."feed_categories" from "authenticator";

revoke update on table "public"."feed_categories" from "authenticator";

revoke delete on table "public"."feeds" from "authenticator";

revoke insert on table "public"."feeds" from "authenticator";

revoke select on table "public"."feeds" from "authenticator";

revoke update on table "public"."feeds" from "authenticator";

revoke update on table "public"."news" from "authenticated";

revoke delete on table "public"."news" from "authenticator";

revoke insert on table "public"."news" from "authenticator";

revoke references on table "public"."news" from "authenticator";

revoke trigger on table "public"."news" from "authenticator";

revoke truncate on table "public"."news" from "authenticator";

revoke update on table "public"."news" from "authenticator";

revoke select on table "public"."news_summaries" from "authenticator";

revoke select on table "public"."role_permissions_materialized" from "authenticator";

alter table "public"."news_summaries" drop constraint "news_summaries_complexity_level_check";

alter table "public"."research_embeddings" drop constraint "research_embeddings_research_fk";

drop index if exists "public"."idx_news_score";



drop index if exists "public"."news_summaries_complexity_level_idx";

drop index if exists "public"."unique_current_complexity_per_news";

drop table "public"."maintenance_log";

create table "public"."scoring_weights" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "weight" double precision not null,
    "description" text,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."scoring_weights" enable row level security;

alter table "public"."feedbacks" add column "rating" integer default 0;

alter table "public"."news" drop column "score";

-- First drop the existing column
ALTER TABLE "public"."news_summaries" DROP COLUMN IF EXISTS "complexity_level";

-- Then add the new column with the desired type and default
ALTER TABLE "public"."news_summaries" 
  ADD COLUMN "complexity_level" public.complexity_level DEFAULT 'undefined'::public.complexity_level;

CREATE UNIQUE INDEX scoring_weights_name_key ON public.scoring_weights USING btree (name);

CREATE UNIQUE INDEX scoring_weights_pkey ON public.scoring_weights USING btree (id);

alter table "public"."scoring_weights" add constraint "scoring_weights_pkey" PRIMARY KEY using index "scoring_weights_pkey";

alter table "public"."scoring_weights" add constraint "scoring_weights_name_key" UNIQUE using index "scoring_weights_name_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.calculate_hot_score(vote_count bigint, bookmark_count bigint, created_timestamp timestamp with time zone, vote_weight_param double precision DEFAULT NULL::double precision, bookmark_weight_param double precision DEFAULT NULL::double precision, age_threshold_param double precision DEFAULT NULL::double precision, age_factor_param double precision DEFAULT NULL::double precision)
 RETURNS double precision
 LANGUAGE plpgsql
AS $function$
DECLARE
    base_score double precision;
    age_in_days double precision;
    vote_weight float;
    bookmark_weight float;
    age_penalty_threshold float;
    age_penalty_factor float;
BEGIN
    -- Get weights from table if not provided
    SELECT weight INTO vote_weight 
    FROM scoring_weights WHERE name = 'vote_weight' 
    AND vote_weight_param IS NULL;
    
    SELECT weight INTO bookmark_weight 
    FROM scoring_weights WHERE name = 'bookmark_weight'
    AND bookmark_weight_param IS NULL;
    
    SELECT weight INTO age_penalty_threshold 
    FROM scoring_weights WHERE name = 'age_penalty_threshold_days'
    AND age_threshold_param IS NULL;
    
    SELECT weight INTO age_penalty_factor 
    FROM scoring_weights WHERE name = 'age_penalty_factor'
    AND age_factor_param IS NULL;

    -- Use provided weights if they exist
    vote_weight := COALESCE(vote_weight_param, vote_weight, 100.0);
    bookmark_weight := COALESCE(bookmark_weight_param, bookmark_weight, 300.0);
    age_penalty_threshold := COALESCE(age_threshold_param, age_penalty_threshold, 30.0);
    age_penalty_factor := COALESCE(age_factor_param, age_penalty_factor, 0.1);
    
    -- Calculate base score using weights
    base_score := (COALESCE(vote_count, 0) * vote_weight) + 
                  (COALESCE(bookmark_count, 0) * bookmark_weight);
    
    -- Calculate age in days
    age_in_days := EXTRACT(EPOCH FROM (NOW() - created_timestamp)) / (24 * 3600.0);
    
    -- Apply age penalty if older than threshold
    IF age_in_days > age_penalty_threshold THEN
        RETURN base_score * age_penalty_factor;
    ELSE
        RETURN base_score;
    END IF;
END;
$function$
;

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
         SELECT public.votes.content_id,
            count(*) AS vote_count
           FROM public.votes
          GROUP BY votes.content_id
        ), bookmark_counts AS (
         SELECT public.bookmarks.content_id,
            count(*) AS bookmark_count
           FROM public.bookmarks
          GROUP BY bookmarks.content_id
        ), summary_levels AS (
         SELECT public.news_summaries.news_id,
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


CREATE OR REPLACE FUNCTION public.refresh_content_views(content_types text[] DEFAULT NULL::text[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Always refresh base view
    REFRESH MATERIALIZED VIEW CONCURRENTLY content_scores;
    
    -- Refresh specific content type views based on input
    IF content_types IS NULL OR 'news' = ANY(content_types) THEN
        REFRESH MATERIALIZED VIEW CONCURRENTLY public.news_details;
    END IF;
    
    -- Add more content types here as needed
    -- IF 'other_type' = ANY(content_types) THEN
    --     REFRESH MATERIALIZED VIEW CONCURRENTLY other_type_details;
    -- END IF;
END;
$function$
;



CREATE OR REPLACE FUNCTION public.update_hot_score_for_content()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_content_id uuid;
    v_votes_count bigint;
    v_bookmarks_count bigint;
    v_created_at timestamptz;
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_content_id := OLD.content_id;
    ELSE
        v_content_id := NEW.content_id;
    END IF;
    
    SELECT created_at INTO v_created_at 
    FROM public.contents 
    WHERE id = v_content_id;

    SELECT COUNT(*)::bigint INTO v_votes_count 
    FROM public.votes 
    WHERE content_id = v_content_id;
    
    SELECT COUNT(*)::bigint INTO v_bookmarks_count 
    FROM public.bookmarks 
    WHERE content_id = v_content_id;

    UPDATE public.contents
    SET hot_score = calculate_hot_score(v_votes_count, v_bookmarks_count, v_created_at)
    WHERE id = v_content_id;

    RETURN NEW;
END;
$function$
;

CREATE INDEX idx_content_scores_content_type ON public.content_scores USING btree (content_type);

CREATE INDEX idx_content_scores_created_at ON public.content_scores USING btree (created_at DESC);

CREATE INDEX idx_content_scores_hot_score ON public.content_scores USING btree (hot_score DESC);

CREATE UNIQUE INDEX idx_content_scores_id ON public.content_scores USING btree (id);

grant delete on table "public"."news_summaries" to "anon";

grant insert on table "public"."news_summaries" to "anon";

grant references on table "public"."news_summaries" to "anon";

grant trigger on table "public"."news_summaries" to "anon";

grant truncate on table "public"."news_summaries" to "anon";

grant update on table "public"."news_summaries" to "anon";

grant delete on table "public"."news_summaries" to "authenticated";

grant insert on table "public"."news_summaries" to "authenticated";

grant references on table "public"."news_summaries" to "authenticated";

grant trigger on table "public"."news_summaries" to "authenticated";

grant truncate on table "public"."news_summaries" to "authenticated";

grant update on table "public"."news_summaries" to "authenticated";

grant delete on table "public"."news_summaries" to "service_role";

grant insert on table "public"."news_summaries" to "service_role";

grant references on table "public"."news_summaries" to "service_role";

grant select on table "public"."news_summaries" to "service_role";

grant trigger on table "public"."news_summaries" to "service_role";

grant truncate on table "public"."news_summaries" to "service_role";

grant update on table "public"."news_summaries" to "service_role";

grant delete on table "public"."scoring_weights" to "anon";

grant insert on table "public"."scoring_weights" to "anon";

grant references on table "public"."scoring_weights" to "anon";

grant select on table "public"."scoring_weights" to "anon";

grant trigger on table "public"."scoring_weights" to "anon";

grant truncate on table "public"."scoring_weights" to "anon";

grant update on table "public"."scoring_weights" to "anon";

grant delete on table "public"."scoring_weights" to "authenticated";

grant insert on table "public"."scoring_weights" to "authenticated";

grant references on table "public"."scoring_weights" to "authenticated";

grant select on table "public"."scoring_weights" to "authenticated";

grant trigger on table "public"."scoring_weights" to "authenticated";

grant truncate on table "public"."scoring_weights" to "authenticated";

grant update on table "public"."scoring_weights" to "authenticated";

grant delete on table "public"."scoring_weights" to "service_role";

grant insert on table "public"."scoring_weights" to "service_role";

grant references on table "public"."scoring_weights" to "service_role";

grant select on table "public"."scoring_weights" to "service_role";

grant trigger on table "public"."scoring_weights" to "service_role";

grant truncate on table "public"."scoring_weights" to "service_role";

grant update on table "public"."scoring_weights" to "service_role";

create policy "delete_policy"
on "public"."scoring_weights"
as permissive
for delete
to public
using ((public.authorize('scoring_weights.delete'::text) AND false));


create policy "insert_policy"
on "public"."scoring_weights"
as permissive
for insert
to public
with check ((public.authorize('scoring_weights.insert'::text) AND false));


create policy "select_policy"
on "public"."scoring_weights"
as permissive
for select
to public
using ((public.authorize('scoring_weights.select'::text) AND true));


create policy "update_policy"
on "public"."scoring_weights"
as permissive
for update
to public
using ((public.authorize('scoring_weights.update'::text) AND false));

CREATE TRIGGER update_scoring_weights_timestamp BEFORE UPDATE ON public.scoring_weights FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


