drop trigger if exists "update_feature_rankings_timestamp" on "public"."feature_rankings";

drop policy "delete_policy" on "public"."feature_rankings";

drop policy "insert_policy" on "public"."feature_rankings";

drop policy "select_policy" on "public"."feature_rankings";

drop policy "update_policy" on "public"."feature_rankings";

revoke delete on table "public"."feature_rankings" from "anon";

revoke insert on table "public"."feature_rankings" from "anon";

revoke references on table "public"."feature_rankings" from "anon";

revoke select on table "public"."feature_rankings" from "anon";

revoke trigger on table "public"."feature_rankings" from "anon";

revoke truncate on table "public"."feature_rankings" from "anon";

revoke update on table "public"."feature_rankings" from "anon";

revoke delete on table "public"."feature_rankings" from "authenticated";

revoke insert on table "public"."feature_rankings" from "authenticated";

revoke references on table "public"."feature_rankings" from "authenticated";

revoke select on table "public"."feature_rankings" from "authenticated";

revoke trigger on table "public"."feature_rankings" from "authenticated";

revoke truncate on table "public"."feature_rankings" from "authenticated";

revoke update on table "public"."feature_rankings" from "authenticated";

revoke delete on table "public"."feature_rankings" from "service_role";

revoke insert on table "public"."feature_rankings" from "service_role";

revoke references on table "public"."feature_rankings" from "service_role";

revoke select on table "public"."feature_rankings" from "service_role";

revoke trigger on table "public"."feature_rankings" from "service_role";

revoke truncate on table "public"."feature_rankings" from "service_role";

revoke update on table "public"."feature_rankings" from "service_role";

alter table "public"."feature_rankings" drop constraint "feature_rankings_user_id_fkey";

alter table "public"."feature_rankings" drop constraint "feature_rankings_user_id_key";

drop index if exists "public"."feature_rankings_user_id_key";

drop table "public"."feature_rankings";

create table "public"."feature_votes" (
    "id" uuid not null default gen_random_uuid(),
    "feature_id" uuid not null,
    "user_id" uuid not null,
    "vote_type" smallint not null,
    "feedback" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."feature_votes" enable row level security;

alter table "public"."feature_requests" drop column "priority";

alter table "public"."feature_requests" add column "downvotes" integer default 0;

alter table "public"."feature_requests" add column "engagement_score" integer default 0;

alter table "public"."feature_requests" add column "priority_score" integer default 0;

alter table "public"."feature_requests" add column "upvotes" integer default 0;

CREATE UNIQUE INDEX feature_requests_pkey ON public.feature_requests USING btree (id);

CREATE UNIQUE INDEX feature_votes_pkey ON public.feature_votes USING btree (id);

CREATE UNIQUE INDEX feature_votes_user_feature_unique ON public.feature_votes USING btree (user_id, feature_id);

alter table "public"."feature_requests" add constraint "feature_requests_pkey" PRIMARY KEY using index "feature_requests_pkey";

alter table "public"."feature_votes" add constraint "feature_votes_pkey" PRIMARY KEY using index "feature_votes_pkey";

alter table "public"."feature_requests" add constraint "status_check" CHECK ((status = ANY (ARRAY['planned'::text, 'in_progress'::text, 'completed'::text]))) not valid;

alter table "public"."feature_requests" validate constraint "status_check";

alter table "public"."feature_votes" add constraint "feature_votes_feature_id_fkey" FOREIGN KEY (feature_id) REFERENCES public.feature_requests(id) ON DELETE CASCADE not valid;

alter table "public"."feature_votes" validate constraint "feature_votes_feature_id_fkey";

alter table "public"."feature_votes" add constraint "feature_votes_user_feature_unique" UNIQUE using index "feature_votes_user_feature_unique";

alter table "public"."feature_votes" add constraint "feature_votes_vote_type_check" CHECK ((vote_type = ANY (ARRAY['-1'::integer, 1]))) not valid;

alter table "public"."feature_votes" validate constraint "feature_votes_vote_type_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_feature_vote_counts()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Update upvotes and downvotes counts
    UPDATE public.feature_requests
    SET 
        upvotes = (
            SELECT COUNT(*) 
            FROM public.feature_votes 
            WHERE feature_id = NEW.feature_id AND vote_type = 1
        ),
        downvotes = (
            SELECT COUNT(*) 
            FROM public.feature_votes 
            WHERE feature_id = NEW.feature_id AND vote_type = -1
        ),
        updated_at = now()
    WHERE id = NEW.feature_id;
    
    RETURN NEW;
END;
$function$
;

grant delete on table "public"."feature_votes" to "anon";

grant insert on table "public"."feature_votes" to "anon";

grant references on table "public"."feature_votes" to "anon";

grant select on table "public"."feature_votes" to "anon";

grant trigger on table "public"."feature_votes" to "anon";

grant truncate on table "public"."feature_votes" to "anon";

grant update on table "public"."feature_votes" to "anon";

grant delete on table "public"."feature_votes" to "authenticated";

grant insert on table "public"."feature_votes" to "authenticated";

grant references on table "public"."feature_votes" to "authenticated";

grant select on table "public"."feature_votes" to "authenticated";

grant trigger on table "public"."feature_votes" to "authenticated";

grant truncate on table "public"."feature_votes" to "authenticated";

grant update on table "public"."feature_votes" to "authenticated";

grant delete on table "public"."feature_votes" to "service_role";

grant insert on table "public"."feature_votes" to "service_role";

grant references on table "public"."feature_votes" to "service_role";

grant select on table "public"."feature_votes" to "service_role";

grant trigger on table "public"."feature_votes" to "service_role";

grant truncate on table "public"."feature_votes" to "service_role";

grant update on table "public"."feature_votes" to "service_role";

create policy "delete_policy"
on "public"."feature_votes"
as permissive
for delete
to public
using ((public.authorize('feature_votes.delete'::text) AND (auth.uid() = user_id)));


create policy "insert_policy"
on "public"."feature_votes"
as permissive
for insert
to public
with check ((public.authorize('feature_votes.insert'::text) AND (auth.uid() = user_id)));


create policy "select_policy"
on "public"."feature_votes"
as permissive
for select
to public
using ((public.authorize('feature_votes.select'::text) AND (auth.uid() = user_id)));


create policy "update_policy"
on "public"."feature_votes"
as permissive
for update
to public
using ((public.authorize('feature_votes.update'::text) AND (auth.uid() = user_id)));


create policy "delete_policy"
on "public"."strapi_migrations"
as permissive
for delete
to public
using ((public.authorize('strapi_migrations.delete'::text) AND false));


create policy "insert_policy"
on "public"."strapi_migrations"
as permissive
for insert
to public
with check ((public.authorize('strapi_migrations.insert'::text) AND false));


create policy "select_policy"
on "public"."strapi_migrations"
as permissive
for select
to public
using ((public.authorize('strapi_migrations.select'::text) AND true));


create policy "update_policy"
on "public"."strapi_migrations"
as permissive
for update
to public
using ((public.authorize('strapi_migrations.update'::text) AND false));


create policy "delete_policy"
on "public"."strapi_migrations_internal"
as permissive
for delete
to public
using ((public.authorize('strapi_migrations_internal.delete'::text) AND false));


create policy "insert_policy"
on "public"."strapi_migrations_internal"
as permissive
for insert
to public
with check ((public.authorize('strapi_migrations_internal.insert'::text) AND false));


create policy "select_policy"
on "public"."strapi_migrations_internal"
as permissive
for select
to public
using ((public.authorize('strapi_migrations_internal.select'::text) AND true));


create policy "update_policy"
on "public"."strapi_migrations_internal"
as permissive
for update
to public
using ((public.authorize('strapi_migrations_internal.update'::text) AND false));


CREATE TRIGGER feature_votes_update_counts AFTER INSERT OR DELETE OR UPDATE ON public.feature_votes FOR EACH ROW EXECUTE FUNCTION public.update_feature_vote_counts();

CREATE TRIGGER update_feature_votes_timestamp BEFORE UPDATE ON public.feature_votes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


