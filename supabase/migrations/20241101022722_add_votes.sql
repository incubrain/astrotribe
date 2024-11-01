create table "public"."votes" (
    "id" uuid not null default gen_random_uuid(),
    "content_type" text not null,
    "content_id" uuid not null,
    "user_id" uuid not null,
    "vote_type" smallint not null,
    "created_at" timestamp with time zone default now()
);


alter table "public"."news" add column "score" integer default 0;

CREATE INDEX idx_news_score ON public.news USING btree (score DESC);

CREATE INDEX idx_votes_content ON public.votes USING btree (content_type, content_id);

CREATE INDEX idx_votes_user ON public.votes USING btree (user_id);

CREATE UNIQUE INDEX votes_content_type_content_id_user_id_key ON public.votes USING btree (content_type, content_id, user_id);

CREATE UNIQUE INDEX votes_pkey ON public.votes USING btree (id);

alter table "public"."votes" add constraint "votes_pkey" PRIMARY KEY using index "votes_pkey";

alter table "public"."votes" add constraint "votes_content_type_content_id_user_id_key" UNIQUE using index "votes_content_type_content_id_user_id_key";

alter table "public"."votes" add constraint "votes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."votes" validate constraint "votes_user_id_fkey";

alter table "public"."votes" add constraint "votes_vote_type_check" CHECK ((vote_type = ANY (ARRAY['-1'::integer, 1]))) not valid;

alter table "public"."votes" validate constraint "votes_vote_type_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_vote_score()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    IF NEW.content_type = 'news' THEN
        UPDATE news
        SET score = (
            SELECT COALESCE(SUM(vote_type), 0)
            FROM votes
            WHERE content_type = 'news'
            AND content_id = NEW.content_id
        )
        WHERE id = NEW.content_id;
    END IF;
    
    RETURN NEW;
END;
$function$
;

grant select on table "public"."news" to "authenticator";

grant delete on table "public"."votes" to "anon";

grant insert on table "public"."votes" to "anon";

grant references on table "public"."votes" to "anon";

grant select on table "public"."votes" to "anon";

grant trigger on table "public"."votes" to "anon";

grant truncate on table "public"."votes" to "anon";

grant update on table "public"."votes" to "anon";

grant delete on table "public"."votes" to "authenticated";

grant insert on table "public"."votes" to "authenticated";

grant references on table "public"."votes" to "authenticated";

grant select on table "public"."votes" to "authenticated";

grant trigger on table "public"."votes" to "authenticated";

grant truncate on table "public"."votes" to "authenticated";

grant update on table "public"."votes" to "authenticated";

grant delete on table "public"."votes" to "authenticator";

grant insert on table "public"."votes" to "authenticator";

grant select on table "public"."votes" to "authenticator";

grant update on table "public"."votes" to "authenticator";

grant delete on table "public"."votes" to "service_role";

grant insert on table "public"."votes" to "service_role";

grant references on table "public"."votes" to "service_role";

grant select on table "public"."votes" to "service_role";

grant trigger on table "public"."votes" to "service_role";

grant truncate on table "public"."votes" to "service_role";

grant update on table "public"."votes" to "service_role";

CREATE TRIGGER vote_score_trigger AFTER INSERT OR DELETE OR UPDATE ON public.votes FOR EACH ROW EXECUTE FUNCTION public.update_vote_score();


