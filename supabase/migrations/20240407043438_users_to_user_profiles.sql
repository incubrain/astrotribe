drop policy "Enable read access for all users" on "public"."users";

drop policy "Enable update for users based on email" on "public"."users";

revoke select on table "public"."users" from PUBLIC;

revoke select on table "public"."users" from anon;

revoke update on table "public"."users" from authenticator;

revoke insert on table "public"."users" from service_role;

revoke select on table "public"."users" from service_role;

revoke update on table "public"."users" from service_role;

revoke insert on table "public"."users" from supabase_auth_admin;

alter table "public"."users" drop constraint "users_email_key";

alter table "public"."users" drop constraint "users_id_fkey";

alter table "public"."users" drop constraint "users_role_id_fkey";

drop index if exists "public"."users_auth_id_key";

drop index if exists "public"."users_email_key";

drop table "public"."users";

create table "public"."user_profiles" (
    "email" text not null,
    "given_name" text,
    "surname" text,
    "username" character varying,
    "dob" date,
    "gender_id" smallint,
    "created_at" timestamp(6) with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp(6) with time zone default CURRENT_TIMESTAMP,
    "last_seen" timestamp(6) with time zone default CURRENT_TIMESTAMP,
    "avatar" text default ''::text,
    "cover_image" text default '''default.jpg''::text'::text,
    "introduction" text,
    "quote" text,
    "followed_count" integer default 0,
    "role_id" bigint not null default 1,
    "followers_count" integer default 0,
    "id" uuid default uuid_generate_v4()
);


alter table "public"."user_profiles" enable row level security;

CREATE UNIQUE INDEX users_auth_id_key ON public.user_profiles USING btree (id);

CREATE UNIQUE INDEX users_email_key ON public.user_profiles USING btree (email);

alter table "public"."user_profiles" add constraint "users_email_key" UNIQUE using index "users_email_key";

alter table "public"."user_profiles" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."user_profiles" validate constraint "users_id_fkey";

alter table "public"."user_profiles" add constraint "users_role_id_fkey" FOREIGN KEY (role_id) REFERENCES roles(id) not valid;

alter table "public"."user_profiles" validate constraint "users_role_id_fkey";

grant select on table "public"."user_profiles" to PUBLIC;

grant select on table "public"."user_profiles" to anon;

grant update on table "public"."user_profiles" to authenticator;

grant insert on table "public"."user_profiles" to service_role;

grant select on table "public"."user_profiles" to service_role;

grant update on table "public"."user_profiles" to service_role;

grant insert on table "public"."user_profiles" to supabase_auth_admin;

create policy "Enable read access for all users"
on "public"."user_profiles"
as permissive
for select
to public
using (true);


create policy "Enable update for users based on email"
on "public"."user_profiles"
as permissive
for update
to public
using (((auth.jwt() ->> 'email'::text) = email))
with check (((auth.jwt() ->> 'email'::text) = email));



