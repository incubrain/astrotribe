drop trigger if exists "update_metrics_after_vote" on "public"."votes";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.ensure_user_metrics()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    INSERT INTO public.user_metrics (user_id)
    VALUES (NEW.user_id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
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
    -- Get last vote date
    SELECT (last_vote_date AT TIME ZONE 'UTC')::date, achievements 
    INTO _last_vote_date, _achievements
    FROM user_metrics 
    WHERE user_id = NEW.user_id;

    -- Update core voting metrics
    UPDATE public.user_metrics
    SET 
        total_votes = total_votes + 1,
        upvote_count = CASE WHEN NEW.vote_type > 0 
            THEN upvote_count + 1 
            ELSE upvote_count 
        END,
        downvote_count = CASE WHEN NEW.vote_type < 0 
            THEN downvote_count + 1 
            ELSE downvote_count 
        END,
        -- Reset or increment today's count based on date
        today_vote_count = CASE 
            WHEN _last_vote_date = _current_date THEN today_vote_count + 1
            ELSE 1
        END,
        -- Update streak
        current_streak = CASE 
            WHEN _last_vote_date = _current_date - INTERVAL '1 day' 
            THEN current_streak + 1
            WHEN _last_vote_date != _current_date THEN 1
            ELSE current_streak
        END,
        -- Update best streak if current is higher
        best_streak = GREATEST(
            best_streak, 
            CASE 
                WHEN _last_vote_date = _current_date - INTERVAL '1 day' 
                THEN current_streak + 1
                WHEN _last_vote_date != _current_date THEN 1
                ELSE current_streak
            END
        ),
        last_vote_date = NEW.created_at,
        -- Increment points (base point + streak bonus)
        points = points + CASE 
            WHEN current_streak >= 3 THEN 
                1 + LEAST(FLOOR(current_streak / 3), 5)
            ELSE 1
        END
    WHERE user_id = NEW.user_id;

    RETURN NEW;
END;
$function$
;

CREATE TRIGGER update_metrics_after_vote AFTER INSERT ON public.votes FOR EACH ROW EXECUTE FUNCTION public.update_vote_metrics();


