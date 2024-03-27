create table "public"."papers" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now(),
    "published_at" timestamp with time zone,
    "title" text,
    "url" character varying not null,
    "body" text,
    "author" character varying,
    "description" text
);


alter table "public"."papers" enable row level security;

CREATE UNIQUE INDEX research_pkey ON public.papers USING btree (id);

CREATE UNIQUE INDEX research_url_key ON public.papers USING btree (url);

alter table "public"."papers" add constraint "research_pkey" PRIMARY KEY using index "research_pkey";

alter table "public"."papers" add constraint "research_url_key" UNIQUE using index "research_url_key";

grant select on table "public"."news" to "anon";

grant delete on table "public"."papers" to "anon";

grant insert on table "public"."papers" to "anon";

grant references on table "public"."papers" to "anon";

grant select on table "public"."papers" to "anon";

grant trigger on table "public"."papers" to "anon";

grant truncate on table "public"."papers" to "anon";

grant update on table "public"."papers" to "anon";

grant delete on table "public"."papers" to "authenticated";

grant insert on table "public"."papers" to "authenticated";

grant references on table "public"."papers" to "authenticated";

grant select on table "public"."papers" to "authenticated";

grant trigger on table "public"."papers" to "authenticated";

grant truncate on table "public"."papers" to "authenticated";

grant update on table "public"."papers" to "authenticated";

grant delete on table "public"."papers" to "service_role";

grant insert on table "public"."papers" to "service_role";

grant references on table "public"."papers" to "service_role";

grant select on table "public"."papers" to "service_role";

grant trigger on table "public"."papers" to "service_role";

grant truncate on table "public"."papers" to "service_role";

grant update on table "public"."papers" to "service_role";


