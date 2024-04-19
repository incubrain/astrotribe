create type "public"."access_level" as enum ('Viewer', 'Editor', 'Admin', 'Super Admin');

create type "public"."news_importance_level" as enum ('High', 'Medium', 'Low');

create type "public"."news_relation_type" as enum ('Source', 'Topic', 'Mention');

create table "public"."company_employees" (
    "user_profile_id" uuid not null,
    "company_id" integer not null,
    "role" text not null,
    "job_description" text,
    "start_date" timestamp with time zone default CURRENT_TIMESTAMP,
    "end_date" timestamp with time zone,
    "status" boolean,
    "access_level" access_level not null default 'Viewer'::access_level,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."company_employees" enable row level security;

create table "public"."company_news" (
    "company_id" integer not null,
    "news_id" integer not null,
    "relation_type" news_relation_type not null,
    "importance_level" news_importance_level,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."company_news" enable row level security;

CREATE UNIQUE INDEX company_employees_pkey ON public.company_employees USING btree (user_profile_id, company_id);

CREATE UNIQUE INDEX company_news_pkey ON public.company_news USING btree (company_id, news_id);

alter table "public"."company_employees" add constraint "company_employees_pkey" PRIMARY KEY using index "company_employees_pkey";

alter table "public"."company_news" add constraint "company_news_pkey" PRIMARY KEY using index "company_news_pkey";

alter table "public"."company_employees" add constraint "company_employees_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) not valid;

alter table "public"."company_employees" validate constraint "company_employees_company_id_fkey";

alter table "public"."company_employees" add constraint "company_employees_user_profile_id_fkey" FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id) not valid;

alter table "public"."company_employees" validate constraint "company_employees_user_profile_id_fkey";

alter table "public"."company_news" add constraint "company_news_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) not valid;

alter table "public"."company_news" validate constraint "company_news_company_id_fkey";

alter table "public"."company_news" add constraint "company_news_news_id_fkey" FOREIGN KEY (news_id) REFERENCES news(id) not valid;

alter table "public"."company_news" validate constraint "company_news_news_id_fkey";

grant delete on table "public"."company_employees" to "anon";

grant insert on table "public"."company_employees" to "anon";

grant references on table "public"."company_employees" to "anon";

grant select on table "public"."company_employees" to "anon";

grant trigger on table "public"."company_employees" to "anon";

grant truncate on table "public"."company_employees" to "anon";

grant update on table "public"."company_employees" to "anon";

grant delete on table "public"."company_employees" to "authenticated";

grant insert on table "public"."company_employees" to "authenticated";

grant references on table "public"."company_employees" to "authenticated";

grant select on table "public"."company_employees" to "authenticated";

grant trigger on table "public"."company_employees" to "authenticated";

grant truncate on table "public"."company_employees" to "authenticated";

grant update on table "public"."company_employees" to "authenticated";

grant delete on table "public"."company_employees" to "service_role";

grant insert on table "public"."company_employees" to "service_role";

grant references on table "public"."company_employees" to "service_role";

grant select on table "public"."company_employees" to "service_role";

grant trigger on table "public"."company_employees" to "service_role";

grant truncate on table "public"."company_employees" to "service_role";

grant update on table "public"."company_employees" to "service_role";

grant delete on table "public"."company_news" to "anon";

grant insert on table "public"."company_news" to "anon";

grant references on table "public"."company_news" to "anon";

grant select on table "public"."company_news" to "anon";

grant trigger on table "public"."company_news" to "anon";

grant truncate on table "public"."company_news" to "anon";

grant update on table "public"."company_news" to "anon";

grant delete on table "public"."company_news" to "authenticated";

grant insert on table "public"."company_news" to "authenticated";

grant references on table "public"."company_news" to "authenticated";

grant select on table "public"."company_news" to "authenticated";

grant trigger on table "public"."company_news" to "authenticated";

grant truncate on table "public"."company_news" to "authenticated";

grant update on table "public"."company_news" to "authenticated";

grant delete on table "public"."company_news" to "service_role";

grant insert on table "public"."company_news" to "service_role";

grant references on table "public"."company_news" to "service_role";

grant select on table "public"."company_news" to "service_role";

grant trigger on table "public"."company_news" to "service_role";

grant truncate on table "public"."company_news" to "service_role";

grant update on table "public"."company_news" to "service_role";

create policy "Enable read access for all users"
on "public"."company_employees"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."company_news"
as permissive
for select
to public
using (true);



