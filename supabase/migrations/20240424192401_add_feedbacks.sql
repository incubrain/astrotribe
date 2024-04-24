create type "public"."feedback_status" as enum ('new', 'under_review', 'backlog', 'working_on', 'resolved', 'rejected', 'deferred');

create type "public"."feedback_type" as enum ('bug_report', 'feature_request', 'user_interface_issue', 'performance_issue', 'documentation');

create sequence "public"."feedback_id_seq";

create table "public"."feedbacks" (
    "id" integer not null default nextval('feedback_id_seq'::regclass),
    "user_id" uuid,
    "page_identifier" character varying(255) not null,
    "feedback_type" feedback_type,
    "message" text not null,
    "created_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "device_info" text,
    "status" feedback_status default 'new'::feedback_status,
    "resolution_comment" text
);


alter table "public"."feedbacks" enable row level security;

alter sequence "public"."feedback_id_seq" owned by "public"."feedbacks"."id";

CREATE UNIQUE INDEX feedback_pkey ON public.feedbacks USING btree (id);

alter table "public"."feedbacks" add constraint "feedback_pkey" PRIMARY KEY using index "feedback_pkey";

alter table "public"."feedbacks" add constraint "fk_user" FOREIGN KEY (user_id) REFERENCES user_profiles(id) not valid;

alter table "public"."feedbacks" validate constraint "fk_user";

grant delete on table "public"."feedbacks" to "anon";

grant insert on table "public"."feedbacks" to "anon";

grant references on table "public"."feedbacks" to "anon";

grant select on table "public"."feedbacks" to "anon";

grant trigger on table "public"."feedbacks" to "anon";

grant truncate on table "public"."feedbacks" to "anon";

grant update on table "public"."feedbacks" to "anon";

grant delete on table "public"."feedbacks" to "authenticated";

grant insert on table "public"."feedbacks" to "authenticated";

grant references on table "public"."feedbacks" to "authenticated";

grant select on table "public"."feedbacks" to "authenticated";

grant trigger on table "public"."feedbacks" to "authenticated";

grant truncate on table "public"."feedbacks" to "authenticated";

grant update on table "public"."feedbacks" to "authenticated";

grant delete on table "public"."feedbacks" to "service_role";

grant insert on table "public"."feedbacks" to "service_role";

grant references on table "public"."feedbacks" to "service_role";

grant select on table "public"."feedbacks" to "service_role";

grant trigger on table "public"."feedbacks" to "service_role";

grant truncate on table "public"."feedbacks" to "service_role";

grant update on table "public"."feedbacks" to "service_role";

create policy "Enable delete for users based on user_id"
on "public"."feedbacks"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Enable insert for authenticated users only"
on "public"."feedbacks"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."feedbacks"
as permissive
for select
to public
using (true);


create policy "Enable update for users based on user_id"
on "public"."feedbacks"
as permissive
for update
to public
using ((auth.uid() = user_id));



