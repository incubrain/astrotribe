CREATE TABLE IF NOT EXISTS "public"."content_source_visits" (
    "id" uuid not null default gen_random_uuid(),
    "content_id" uuid not null,
    "user_id" uuid,
    "created_at" timestamp with time zone default now()
);


alter table "public"."content_source_visits" enable row level security;

CREATE TABLE IF NOT EXISTS "public"."feature_rankings" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "rankings" jsonb not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."feature_rankings" enable row level security;

CREATE TABLE IF NOT EXISTS "public"."feature_requests" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "description" text,
    "status" text not null default 'planned'::text,
    "priority" integer default 0,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."feature_requests" enable row level security;

CREATE TABLE IF NOT EXISTS "public"."user_metrics" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "total_votes" integer default 0,
    "upvote_count" integer default 0,
    "downvote_count" integer default 0,
    "vote_accuracy" numeric(5,2) default 0,
    "current_streak" integer default 0,
    "best_streak" integer default 0,
    "today_vote_count" integer default 0,
    "total_reading_time" integer default 0,
    "last_vote_date" timestamp with time zone,
    "points" integer default 0,
    "points_breakdown" jsonb default '{"votes": 0, "streaks": 0, "bookmarks": 0, "achievements": 0, "perfect_days": 0, "source_visits": 0}'::jsonb,
    "interaction_stats" jsonb default '{"articles_read": 0, "source_visits": 0, "total_comments": 0, "articles_shared": 0, "comment_upvotes": 0, "total_bookmarks": 0, "favorite_sources": [], "categories_engaged": [], "peak_activity_hours": []}'::jsonb,
    "achievements" jsonb default '{"time": {"night_owl": false, "full_cycle": false, "dawn_patrol": false, "lunch_break": false, "weekend_warrior": false}, "voting": {"vote_sage": false, "vote_expert": false, "vote_legend": false, "vote_master": false, "vote_initiate": false, "vote_enthusiast": false}, "sharing": {"sharer_i": false, "sharer_ii": false, "sharer_iii": false, "influence_i": false, "influence_ii": false, "viral_spreader": false}, "special": {"beta_tester": false, "trend_setter": false, "early_adopter": false, "daily_complete": false, "weekly_complete": false, "prediction_master": false}, "streaks": {"streak_legend": false, "streak_runner": false, "streak_starter": false, "streak_champion": false, "streak_sprinter": false, "streak_marathoner": false}, "accuracy": {"perfect_day": false, "perfect_week": false, "accurate_voter_i": false, "accurate_voter_ii": false, "accurate_voter_iii": false}, "beginner": {"first_vote": false, "first_share": false, "first_comment": false, "first_bookmark": false, "first_source_visit": false}, "explorer": {"global_viewer": false, "source_seeker_i": false, "source_seeker_ii": false, "source_seeker_iii": false, "category_explorer_i": false, "category_explorer_ii": false}, "bookmarks": {"curator": false, "collector_i": false, "organizer_i": false, "collector_ii": false, "organizer_ii": false, "collector_iii": false}, "engagement": {"viral_voice": false, "commentator_i": false, "commentator_ii": false, "commentator_iii": false, "discussion_starter": false, "conversation_master": false}}'::jsonb,
    "titles" jsonb default '{"current_title": "Stargazer", "title_progress": {}, "unlocked_titles": ["Stargazer"]}'::jsonb,
    "multipliers" jsonb default '{"streak_bonus": 0, "accuracy_bonus": 0, "time_of_day_bonus": 0, "current_multiplier": 1}'::jsonb,
    "current_level" integer default 1,
    "current_xp" integer default 0,
    "xp_to_next_level" integer default 100,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."user_metrics" enable row level security;

alter table "public"."strapi_migrations" enable row level security;

alter table "public"."strapi_migrations_internal" enable row level security;

CREATE UNIQUE INDEX IF NOT EXISTS  feature_rankings_user_id_key ON public.feature_rankings USING btree (user_id);

CREATE INDEX IF NOT EXISTS  idx_content_source_visits_content_id ON public.content_source_visits USING btree (content_id);

CREATE INDEX IF NOT EXISTS  idx_content_source_visits_created_at ON public.content_source_visits USING btree (created_at);

CREATE INDEX IF NOT EXISTS  idx_content_source_visits_user_id ON public.content_source_visits USING btree (user_id);

CREATE INDEX IF NOT EXISTS  idx_user_metrics_current_streak ON public.user_metrics USING btree (current_streak);

CREATE INDEX IF NOT EXISTS  idx_user_metrics_points ON public.user_metrics USING btree (points);

CREATE INDEX IF NOT EXISTS  idx_user_metrics_total_votes ON public.user_metrics USING btree (total_votes);

CREATE INDEX IF NOT EXISTS  idx_user_metrics_user_id ON public.user_metrics USING btree (user_id);

CREATE UNIQUE INDEX IF NOT EXISTS  user_metrics_pkey ON public.user_metrics USING btree (id);

CREATE UNIQUE INDEX IF NOT EXISTS  user_metrics_user_id_key ON public.user_metrics USING btree (user_id);

DO $$ 
BEGIN
   -- user_metrics primary key
   IF NOT EXISTS (
       SELECT 1 FROM pg_constraint 
       WHERE conname = 'user_metrics_pkey' 
       AND conrelid = 'public.user_metrics'::regclass
   ) THEN
       alter table "public"."user_metrics" 
       add constraint "user_metrics_pkey" 
       PRIMARY KEY using index "user_metrics_pkey";
   END IF;

   -- content_source_visits foreign keys
   IF NOT EXISTS (
       SELECT 1 FROM pg_constraint 
       WHERE conname = 'content_source_visits_content_id_fkey' 
       AND conrelid = 'public.content_source_visits'::regclass
   ) THEN
       alter table "public"."content_source_visits" 
       add constraint "content_source_visits_content_id_fkey" 
       FOREIGN KEY (content_id) REFERENCES public.contents(id) not valid;

       alter table "public"."content_source_visits" 
       validate constraint "content_source_visits_content_id_fkey";
   END IF;

   IF NOT EXISTS (
       SELECT 1 FROM pg_constraint 
       WHERE conname = 'content_source_visits_user_id_fkey' 
       AND conrelid = 'public.content_source_visits'::regclass
   ) THEN
       alter table "public"."content_source_visits" 
       add constraint "content_source_visits_user_id_fkey" 
       FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) not valid;

       alter table "public"."content_source_visits" 
       validate constraint "content_source_visits_user_id_fkey";
   END IF;

   -- feature_rankings constraints
   IF NOT EXISTS (
       SELECT 1 FROM pg_constraint 
       WHERE conname = 'feature_rankings_user_id_fkey' 
       AND conrelid = 'public.feature_rankings'::regclass
   ) THEN
       alter table "public"."feature_rankings" 
       add constraint "feature_rankings_user_id_fkey" 
       FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) not valid;

       alter table "public"."feature_rankings" 
       validate constraint "feature_rankings_user_id_fkey";
   END IF;

   IF NOT EXISTS (
       SELECT 1 FROM pg_constraint 
       WHERE conname = 'feature_rankings_user_id_key' 
       AND conrelid = 'public.feature_rankings'::regclass
   ) THEN
       alter table "public"."feature_rankings" 
       add constraint "feature_rankings_user_id_key" 
       UNIQUE using index "feature_rankings_user_id_key";
   END IF;

   -- user_metrics constraints
   IF NOT EXISTS (
       SELECT 1 FROM pg_constraint 
       WHERE conname = 'user_metrics_user_id_fkey' 
       AND conrelid = 'public.user_metrics'::regclass
   ) THEN
       alter table "public"."user_metrics" 
       add constraint "user_metrics_user_id_fkey" 
       FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) not valid;

       alter table "public"."user_metrics" 
       validate constraint "user_metrics_user_id_fkey";
   END IF;

   IF NOT EXISTS (
       SELECT 1 FROM pg_constraint 
       WHERE conname = 'user_metrics_user_id_key' 
       AND conrelid = 'public.user_metrics'::regclass
   ) THEN
       alter table "public"."user_metrics" 
       add constraint "user_metrics_user_id_key" 
       UNIQUE using index "user_metrics_user_id_key";
   END IF;
END $$;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.ensure_user_metrics()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    INSERT INTO public.user_metrics (user_id)
    VALUES (NEW.user_id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.maintain_user_metrics()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    _user_record RECORD;
BEGIN
    -- Reset today's vote count for users who haven't voted today
    UPDATE public.user_metrics
    SET today_vote_count = 0
    WHERE DATE(last_vote_date) < CURRENT_DATE;

    -- Reset streaks for users who missed a day
    UPDATE public.user_metrics
    SET current_streak = 0
    WHERE DATE(last_vote_date) < (CURRENT_DATE - INTERVAL '1 day');

    -- Update accuracy for all users
    FOR _user_record IN SELECT id FROM user_metrics LOOP
        PERFORM update_vote_accuracy(_user_record.id);
    END LOOP;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_bookmark_metrics()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Update user metrics
    UPDATE public.user_metrics
    SET 
        interaction_stats = jsonb_set(
            jsonb_set(
                interaction_stats,
                '{total_bookmarks}',
                (COALESCE((interaction_stats->>'total_bookmarks')::integer, 0) + 1)::text::jsonb
            ),
            '{categories_engaged}',
            CASE 
                WHEN NOT interaction_stats->'categories_engaged' ? (
                    SELECT c.name 
                    FROM news n 
                    JOIN categories c ON n.category_id = c.id 
                    WHERE n.id = NEW.content_id
                )
                THEN jsonb_insert(
                    COALESCE(interaction_stats->'categories_engaged', '[]'::jsonb),
                    '{0}',
                    to_jsonb((
                        SELECT c.name 
                        FROM news n 
                        JOIN categories c ON n.category_id = c.id 
                        WHERE n.id = NEW.content_id
                    ))
                )
                ELSE interaction_stats->'categories_engaged'
            END
        ),
        points = points + 2  -- Base points for bookmarking
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_source_visit_metrics()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    _content_type content_type;
    _content_category text;
    _points integer;
BEGIN
    -- Get content type and category
    SELECT 
        c.content_type,
        COALESCE(
            (SELECT cat.name FROM categories cat 
             JOIN content_categories cc ON cc.category_id = cat.id 
             WHERE cc.content_id = c.id AND cc.is_primary = true),
            'uncategorized'
        )
    INTO _content_type, _content_category
    FROM contents c
    WHERE c.id = NEW.content_id;

    -- Calculate points based on content type
    _points := CASE _content_type
        WHEN 'news' THEN 2         -- News articles
        WHEN 'research' THEN 5     -- Research papers (higher value)
        WHEN 'companies' THEN 3    -- Company profiles
        WHEN 'events' THEN 2       -- Events
        WHEN 'jobs' THEN 1         -- Job listings
        WHEN 'newsletters' THEN 3   -- Newsletters
        WHEN 'people' THEN 2       -- People profiles
        WHEN 'contact' THEN 1      -- Contact pages
        ELSE 1                     -- Unknown/default
    END;

    -- Update user metrics
    UPDATE public.user_metrics
    SET 
        interaction_stats = jsonb_set(
            jsonb_set(
                jsonb_set(
                    interaction_stats,
                    '{source_visits}',
                    ((interaction_stats->>'source_visits')::integer + 1)::text::jsonb
                ),
                '{categories_engaged}',
                CASE 
                    WHEN NOT interaction_stats->'categories_engaged' ? _content_category
                    THEN jsonb_insert(
                        COALESCE(interaction_stats->'categories_engaged', '[]'::jsonb),
                        '{0}',
                        to_jsonb(_content_category)
                    )
                    ELSE interaction_stats->'categories_engaged'
                END
            ),
            '{content_type_visits}',
            jsonb_set(
                COALESCE(interaction_stats->'content_type_visits', '{}'::jsonb),
                '{' || _content_type::text || '}',
                (COALESCE((interaction_stats->'content_type_visits'->(_content_type::text))::integer, 0) + 1)::text::jsonb
            )
        ),
        points = points + _points,
        points_breakdown = jsonb_set(
            points_breakdown,
            '{source_visits}',
            (COALESCE((points_breakdown->>'source_visits')::integer, 0) + _points)::text::jsonb
        )
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_vote_accuracy(user_id_param uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    correct_votes integer;
    total_votes integer;
    accuracy numeric(5,2);
BEGIN
    -- Calculate accuracy based on news scores
    WITH vote_accuracy AS (
        SELECT 
            COUNT(*) FILTER (WHERE 
                (v.vote_type > 0 AND n.score > 0) OR 
                (v.vote_type < 0 AND n.score < 0)
            ) as correct,
            COUNT(*) as total
        FROM votes v
        JOIN news n ON v.content_id = n.id
        WHERE v.user_id = user_id_param
        AND v.content_type = 'news'
        AND n.score IS NOT NULL
    )
    SELECT 
        correct, 
        total,
        CASE 
            WHEN total > 0 THEN (correct::numeric / total * 100)
            ELSE 0
        END
    INTO correct_votes, total_votes, accuracy
    FROM vote_accuracy;

    -- Update accuracy in public.user_metrics
    UPDATE public.user_metrics
    SET vote_accuracy = accuracy
    WHERE user_id = user_id_param;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_vote_metrics()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    _current_date date := CURRENT_DATE;
    _last_vote_date date;
    _achievements jsonb;
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Get last vote date and achievements
        SELECT (last_vote_date AT TIME ZONE 'UTC')::date, achievements
        INTO _last_vote_date, _achievements
        FROM user_metrics
        WHERE user_id = NEW.user_id;

        -- Update core voting metrics
        UPDATE public.user_metrics
        SET 
            total_votes = total_votes + 1,
            upvote_count = CASE WHEN NEW.vote_type > 0 THEN upvote_count + 1 ELSE upvote_count END,
            downvote_count = CASE WHEN NEW.vote_type < 0 THEN downvote_count + 1 ELSE downvote_count END,
            -- Reset or increment today's count based on date
            today_vote_count = CASE 
                WHEN _last_vote_date = _current_date THEN today_vote_count + 1
                ELSE 1
            END,
            -- Update streak
            current_streak = CASE 
                WHEN _last_vote_date = _current_date - INTERVAL '1 day' THEN current_streak + 1
                WHEN _last_vote_date != _current_date THEN 1
                ELSE current_streak
            END,
            -- Update best streak if current streak is higher
            best_streak = GREATEST(
                best_streak, 
                CASE 
                    WHEN _last_vote_date = _current_date - INTERVAL '1 day' THEN current_streak + 1
                    WHEN _last_vote_date != _current_date THEN 1
                    ELSE current_streak
                END
            ),
            last_vote_date = NEW.created_at,
            -- Increment points (base points + streak bonus)
            points = points + CASE 
                WHEN current_streak >= 3 THEN 
                    1 + LEAST(FLOOR(current_streak / 3), 5)
                ELSE 1
            END
        WHERE user_id = NEW.user_id;

        RETURN NEW;
    END IF;

    IF TG_OP = 'DELETE' THEN
        -- Update metrics for DELETE operation
        UPDATE public.user_metrics
        SET
            total_votes = total_votes - 1,
            upvote_count = CASE WHEN OLD.vote_type > 0 THEN upvote_count - 1 ELSE upvote_count END,
            downvote_count = CASE WHEN OLD.vote_type < 0 THEN downvote_count - 1 ELSE downvote_count END,
            today_vote_count = today_vote_count - 1
        WHERE user_id = OLD.user_id;

        RETURN NULL;
    END IF;

    IF TG_OP = 'UPDATE' THEN
        UPDATE public.user_metrics
        SET
            upvote_count = CASE WHEN NEW.vote_type > 0 THEN upvote_count + 1 ELSE upvote_count - 1 END,
            downvote_count = CASE WHEN NEW.vote_type < 0 THEN downvote_count + 1 ELSE downvote_count - 1 END,
            today_vote_count = today_vote_count + 1,
            -- Update streak
            current_streak = CASE 
                WHEN _last_vote_date = _current_date - INTERVAL '1 day' THEN current_streak + 1
                WHEN _last_vote_date != _current_date THEN 1
                ELSE current_streak
            END,
            -- Update best streak if current streak is higher
            best_streak = GREATEST(
                best_streak, 
                CASE 
                    WHEN _last_vote_date = _current_date - INTERVAL '1 day' THEN current_streak + 1
                    WHEN _last_vote_date != _current_date THEN 1
                    ELSE current_streak
                END
            ),
            last_vote_date = NEW.created_at,
            -- Increment points (base points + streak bonus)
            points = points + CASE 
                WHEN current_streak >= 3 THEN 
                    1 + LEAST(FLOOR(current_streak / 3), 5)
                ELSE 1
            END
        WHERE user_id = NEW.user_id;
        RETURN NEW;
    END IF;
END;
$function$
;

grant delete on table "public"."content_source_visits" to "anon";

grant insert on table "public"."content_source_visits" to "anon";

grant references on table "public"."content_source_visits" to "anon";

grant select on table "public"."content_source_visits" to "anon";

grant trigger on table "public"."content_source_visits" to "anon";

grant truncate on table "public"."content_source_visits" to "anon";

grant update on table "public"."content_source_visits" to "anon";

grant delete on table "public"."content_source_visits" to "authenticated";

grant insert on table "public"."content_source_visits" to "authenticated";

grant references on table "public"."content_source_visits" to "authenticated";

grant select on table "public"."content_source_visits" to "authenticated";

grant trigger on table "public"."content_source_visits" to "authenticated";

grant truncate on table "public"."content_source_visits" to "authenticated";

grant update on table "public"."content_source_visits" to "authenticated";

grant delete on table "public"."content_source_visits" to "service_role";

grant insert on table "public"."content_source_visits" to "service_role";

grant references on table "public"."content_source_visits" to "service_role";

grant select on table "public"."content_source_visits" to "service_role";

grant trigger on table "public"."content_source_visits" to "service_role";

grant truncate on table "public"."content_source_visits" to "service_role";

grant update on table "public"."content_source_visits" to "service_role";

grant delete on table "public"."feature_rankings" to "anon";

grant insert on table "public"."feature_rankings" to "anon";

grant references on table "public"."feature_rankings" to "anon";

grant select on table "public"."feature_rankings" to "anon";

grant trigger on table "public"."feature_rankings" to "anon";

grant truncate on table "public"."feature_rankings" to "anon";

grant update on table "public"."feature_rankings" to "anon";

grant delete on table "public"."feature_rankings" to "authenticated";

grant insert on table "public"."feature_rankings" to "authenticated";

grant references on table "public"."feature_rankings" to "authenticated";

grant select on table "public"."feature_rankings" to "authenticated";

grant trigger on table "public"."feature_rankings" to "authenticated";

grant truncate on table "public"."feature_rankings" to "authenticated";

grant update on table "public"."feature_rankings" to "authenticated";

grant delete on table "public"."feature_rankings" to "service_role";

grant insert on table "public"."feature_rankings" to "service_role";

grant references on table "public"."feature_rankings" to "service_role";

grant select on table "public"."feature_rankings" to "service_role";

grant trigger on table "public"."feature_rankings" to "service_role";

grant truncate on table "public"."feature_rankings" to "service_role";

grant update on table "public"."feature_rankings" to "service_role";

grant delete on table "public"."feature_requests" to "anon";

grant insert on table "public"."feature_requests" to "anon";

grant references on table "public"."feature_requests" to "anon";

grant select on table "public"."feature_requests" to "anon";

grant trigger on table "public"."feature_requests" to "anon";

grant truncate on table "public"."feature_requests" to "anon";

grant update on table "public"."feature_requests" to "anon";

grant delete on table "public"."feature_requests" to "authenticated";

grant insert on table "public"."feature_requests" to "authenticated";

grant references on table "public"."feature_requests" to "authenticated";

grant select on table "public"."feature_requests" to "authenticated";

grant trigger on table "public"."feature_requests" to "authenticated";

grant truncate on table "public"."feature_requests" to "authenticated";

grant update on table "public"."feature_requests" to "authenticated";

grant delete on table "public"."feature_requests" to "service_role";

grant insert on table "public"."feature_requests" to "service_role";

grant references on table "public"."feature_requests" to "service_role";

grant select on table "public"."feature_requests" to "service_role";

grant trigger on table "public"."feature_requests" to "service_role";

grant truncate on table "public"."feature_requests" to "service_role";

grant update on table "public"."feature_requests" to "service_role";

grant delete on table "public"."user_metrics" to "anon";

grant insert on table "public"."user_metrics" to "anon";

grant references on table "public"."user_metrics" to "anon";

grant select on table "public"."user_metrics" to "anon";

grant trigger on table "public"."user_metrics" to "anon";

grant truncate on table "public"."user_metrics" to "anon";

grant update on table "public"."user_metrics" to "anon";

grant delete on table "public"."user_metrics" to "authenticated";

grant insert on table "public"."user_metrics" to "authenticated";

grant references on table "public"."user_metrics" to "authenticated";

grant select on table "public"."user_metrics" to "authenticated";

grant trigger on table "public"."user_metrics" to "authenticated";

grant truncate on table "public"."user_metrics" to "authenticated";

grant update on table "public"."user_metrics" to "authenticated";

grant delete on table "public"."user_metrics" to "service_role";

grant insert on table "public"."user_metrics" to "service_role";

grant references on table "public"."user_metrics" to "service_role";

grant select on table "public"."user_metrics" to "service_role";

grant trigger on table "public"."user_metrics" to "service_role";

grant truncate on table "public"."user_metrics" to "service_role";

grant update on table "public"."user_metrics" to "service_role";

DO $$ 
BEGIN
   -- content_source_visits policies
   IF NOT EXISTS (
       SELECT 1 FROM pg_policies 
       WHERE schemaname = 'public' 
       AND tablename = 'content_source_visits' 
       AND policyname = 'delete_policy'
   ) THEN
       create policy "delete_policy"
       on "public"."content_source_visits"
       as permissive
       for delete
       to public
       using (public.authorize('content_source_visits.delete'::text));
   END IF;

   IF NOT EXISTS (
       SELECT 1 FROM pg_policies 
       WHERE schemaname = 'public' 
       AND tablename = 'content_source_visits' 
       AND policyname = 'insert_policy'
   ) THEN
       create policy "insert_policy"
       on "public"."content_source_visits"
       as permissive
       for insert
       to public
       with check (public.authorize('content_source_visits.insert'::text));
   END IF;

   IF NOT EXISTS (
       SELECT 1 FROM pg_policies 
       WHERE schemaname = 'public' 
       AND tablename = 'content_source_visits' 
       AND policyname = 'select_policy'
   ) THEN
       create policy "select_policy"
       on "public"."content_source_visits"
       as permissive
       for select
       to public
       using (public.authorize('content_source_visits.select'::text));
   END IF;

   IF NOT EXISTS (
       SELECT 1 FROM pg_policies 
       WHERE schemaname = 'public' 
       AND tablename = 'content_source_visits' 
       AND policyname = 'update_policy'
   ) THEN
       create policy "update_policy"
       on "public"."content_source_visits"
       as permissive
       for update
       to public
       using (public.authorize('content_source_visits.update'::text));
   END IF;
END $$;


DO $$ 
BEGIN
   -- feature_rankings policies
   IF NOT EXISTS (
       SELECT 1 FROM pg_policies 
       WHERE schemaname = 'public' 
       AND tablename = 'feature_rankings' 
       AND policyname = 'delete_policy'
   ) THEN
       create policy "delete_policy"
       on "public"."feature_rankings"
       as permissive
       for delete
       to public
       using (public.authorize('feature_rankings.delete'::text));
   END IF;

   IF NOT EXISTS (
       SELECT 1 FROM pg_policies 
       WHERE schemaname = 'public' 
       AND tablename = 'feature_rankings' 
       AND policyname = 'insert_policy'
   ) THEN
       create policy "insert_policy"
       on "public"."feature_rankings"
       as permissive
       for insert
       to public
       with check (public.authorize('feature_rankings.insert'::text));
   END IF;

   IF NOT EXISTS (
       SELECT 1 FROM pg_policies 
       WHERE schemaname = 'public' 
       AND tablename = 'feature_rankings' 
       AND policyname = 'select_policy'
   ) THEN
       create policy "select_policy"
       on "public"."feature_rankings"
       as permissive
       for select
       to public
       using (public.authorize('feature_rankings.select'::text));
   END IF;

   IF NOT EXISTS (
       SELECT 1 FROM pg_policies 
       WHERE schemaname = 'public' 
       AND tablename = 'feature_rankings' 
       AND policyname = 'update_policy'
   ) THEN
       create policy "update_policy"
       on "public"."feature_rankings"
       as permissive
       for update
       to public
       using (public.authorize('feature_rankings.update'::text));
   END IF;

   -- feature_requests policies
   IF NOT EXISTS (
       SELECT 1 FROM pg_policies 
       WHERE schemaname = 'public' 
       AND tablename = 'feature_requests' 
       AND policyname = 'delete_policy'
   ) THEN
       create policy "delete_policy"
       on "public"."feature_requests"
       as permissive
       for delete
       to public
       using (public.authorize('feature_requests.delete'::text));
   END IF;

   IF NOT EXISTS (
       SELECT 1 FROM pg_policies 
       WHERE schemaname = 'public' 
       AND tablename = 'feature_requests' 
       AND policyname = 'insert_policy'
   ) THEN
       create policy "insert_policy"
       on "public"."feature_requests"
       as permissive
       for insert
       to public
       with check (public.authorize('feature_requests.insert'::text));
   END IF;

   IF NOT EXISTS (
       SELECT 1 FROM pg_policies 
       WHERE schemaname = 'public' 
       AND tablename = 'feature_requests' 
       AND policyname = 'select_policy'
   ) THEN
       create policy "select_policy"
       on "public"."feature_requests"
       as permissive
       for select
       to public
       using (public.authorize('feature_requests.select'::text));
   END IF;

   IF NOT EXISTS (
       SELECT 1 FROM pg_policies 
       WHERE schemaname = 'public' 
       AND tablename = 'feature_requests' 
       AND policyname = 'update_policy'
   ) THEN
       create policy "update_policy"
       on "public"."feature_requests"
       as permissive
       for update
       to public
       using (public.authorize('feature_requests.update'::text));
   END IF;

   -- feed_categories policies
   IF NOT EXISTS (
       SELECT 1 FROM pg_policies 
       WHERE schemaname = 'public' 
       AND tablename = 'feed_categories' 
       AND policyname = 'delete_policy'
   ) THEN
       create policy "delete_policy"
       on "public"."feed_categories"
       as permissive
       for delete
       to public
       using (public.authorize('feed_categories.delete'::text));
   END IF;

   IF NOT EXISTS (
       SELECT 1 FROM pg_policies 
       WHERE schemaname = 'public' 
       AND tablename = 'feed_categories' 
       AND policyname = 'insert_policy'
   ) THEN
       create policy "insert_policy"
       on "public"."feed_categories"
       as permissive
       for insert
       to public
       with check (public.authorize('feed_categories.insert'::text));
   END IF;

   IF NOT EXISTS (
       SELECT 1 FROM pg_policies 
       WHERE schemaname = 'public' 
       AND tablename = 'feed_categories' 
       AND policyname = 'select_policy'
   ) THEN
       create policy "select_policy"
       on "public"."feed_categories"
       as permissive
       for select
       to public
       using (public.authorize('feed_categories.select'::text));
   END IF;

   IF NOT EXISTS (
       SELECT 1 FROM pg_policies 
       WHERE schemaname = 'public' 
       AND tablename = 'feed_categories' 
       AND policyname = 'update_policy'
   ) THEN
       create policy "update_policy"
       on "public"."feed_categories"
       as permissive
       for update
       to public
       using (public.authorize('feed_categories.update'::text));
   END IF;
END $$;


DO $$ 
BEGIN
   -- feeds policies
   IF NOT EXISTS (
       SELECT 1 FROM pg_policies 
       WHERE schemaname = 'public' 
       AND tablename = 'feeds' 
       AND policyname = 'delete_policy'
   ) THEN
       create policy "delete_policy"
       on "public"."feeds"
       as permissive
       for delete
       to public
       using (public.authorize('feeds.delete'::text));
   END IF;

   IF NOT EXISTS (
       SELECT 1 FROM pg_policies 
       WHERE schemaname = 'public' 
       AND tablename = 'feeds' 
       AND policyname = 'insert_policy'
   ) THEN
       create policy "insert_policy"
       on "public"."feeds"
       as permissive
       for insert
       to public
       with check (public.authorize('feeds.insert'::text));
   END IF;

   IF NOT EXISTS (
       SELECT 1 FROM pg_policies 
       WHERE schemaname = 'public' 
       AND tablename = 'feeds' 
       AND policyname = 'select_policy'
   ) THEN
       create policy "select_policy"
       on "public"."feeds"
       as permissive
       for select
       to public
       using (public.authorize('feeds.select'::text));
   END IF;

   IF NOT EXISTS (
       SELECT 1 FROM pg_policies 
       WHERE schemaname = 'public' 
       AND tablename = 'feeds' 
       AND policyname = 'update_policy'
   ) THEN
       create policy "update_policy"
       on "public"."feeds"
       as permissive
       for update
       to public
       using (public.authorize('feeds.update'::text));
   END IF;
END $$;

DO $$ 
BEGIN
   -- user_metrics policies
   IF NOT EXISTS (
       SELECT 1 FROM pg_policies 
       WHERE schemaname = 'public' 
       AND tablename = 'user_metrics' 
       AND policyname = 'delete_policy'
   ) THEN
       create policy "delete_policy"
       on "public"."user_metrics"
       as permissive
       for delete
       to public
       using (public.authorize('user_metrics.delete'::text));
   END IF;

   IF NOT EXISTS (
       SELECT 1 FROM pg_policies 
       WHERE schemaname = 'public' 
       AND tablename = 'user_metrics' 
       AND policyname = 'insert_policy'
   ) THEN
       create policy "insert_policy"
       on "public"."user_metrics"
       as permissive
       for insert
       to public
       with check (public.authorize('user_metrics.insert'::text));
   END IF;

   IF NOT EXISTS (
       SELECT 1 FROM pg_policies 
       WHERE schemaname = 'public' 
       AND tablename = 'user_metrics' 
       AND policyname = 'select_policy'
   ) THEN
       create policy "select_policy"
       on "public"."user_metrics"
       as permissive
       for select
       to public
       using (public.authorize('user_metrics.select'::text));
   END IF;

   IF NOT EXISTS (
       SELECT 1 FROM pg_policies 
       WHERE schemaname = 'public' 
       AND tablename = 'user_metrics' 
       AND policyname = 'update_policy'
   ) THEN
       create policy "update_policy"
       on "public"."user_metrics"
       as permissive
       for update
       to public
       using (public.authorize('user_metrics.update'::text));
   END IF;
END $$;


DO $$ 
BEGIN
   -- Check and create bookmark metrics trigger
   IF NOT EXISTS (
       SELECT 1 FROM pg_trigger 
       WHERE tgname = 'update_metrics_after_bookmark'
       AND tgrelid = 'public.bookmarks'::regclass
   ) THEN
       CREATE TRIGGER update_metrics_after_bookmark 
       AFTER INSERT ON public.bookmarks 
       FOR EACH ROW 
       EXECUTE FUNCTION public.update_bookmark_metrics();
   END IF;

   -- Check and create vote metrics triggers
   IF NOT EXISTS (
       SELECT 1 FROM pg_trigger 
       WHERE tgname = 'ensure_metrics_before_vote'
       AND tgrelid = 'public.votes'::regclass
   ) THEN
       CREATE TRIGGER ensure_metrics_before_vote 
       BEFORE INSERT ON public.votes 
       FOR EACH ROW 
       EXECUTE FUNCTION public.ensure_user_metrics();
   END IF;

   IF NOT EXISTS (
       SELECT 1 FROM pg_trigger 
       WHERE tgname = 'update_metrics_after_vote'
       AND tgrelid = 'public.votes'::regclass
   ) THEN
       CREATE TRIGGER update_metrics_after_vote 
       AFTER DELETE OR INSERT OR UPDATE ON public.votes 
       FOR EACH ROW 
       EXECUTE FUNCTION public.update_vote_metrics();
   END IF;
END $$;