create table "public"."astronomy_events" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "title" text not null,
    "description" text,
    "date" text,
    "time" text,
    "category" text,
    "updated_at" timestamp with time zone default now(),
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX astronomy_events_pkey ON public.astronomy_events USING btree (id);

alter table "public"."astronomy_events" add constraint "astronomy_events_pkey" PRIMARY KEY using index "astronomy_events_pkey";

grant delete on table "public"."astronomy_events" to "anon";

grant insert on table "public"."astronomy_events" to "anon";

grant references on table "public"."astronomy_events" to "anon";

grant select on table "public"."astronomy_events" to "anon";

grant trigger on table "public"."astronomy_events" to "anon";

grant truncate on table "public"."astronomy_events" to "anon";

grant update on table "public"."astronomy_events" to "anon";

grant delete on table "public"."astronomy_events" to "authenticated";

grant insert on table "public"."astronomy_events" to "authenticated";

grant references on table "public"."astronomy_events" to "authenticated";

grant select on table "public"."astronomy_events" to "authenticated";

grant trigger on table "public"."astronomy_events" to "authenticated";

grant truncate on table "public"."astronomy_events" to "authenticated";

grant update on table "public"."astronomy_events" to "authenticated";

grant delete on table "public"."astronomy_events" to "service_role";

grant insert on table "public"."astronomy_events" to "service_role";

grant references on table "public"."astronomy_events" to "service_role";

grant select on table "public"."astronomy_events" to "service_role";

grant trigger on table "public"."astronomy_events" to "service_role";

grant truncate on table "public"."astronomy_events" to "service_role";

grant update on table "public"."astronomy_events" to "service_role";
