alter table "public"."research_embeddings" drop constraint if exists "research_embeddings_research_id_fkey";
alter table "public"."research_embeddings" drop constraint if exists "public_research_embeddings_research_id_fkey";

alter table "public"."companies" alter column "category_id" set data type bigint using "category_id"::bigint;

alter table "public"."company_employees" add column "id" uuid not null default gen_random_uuid();

alter table "public"."content_categories" alter column "category_id" set data type bigint using "category_id"::bigint;

alter table "public"."news" alter column "category_id" drop not null;

alter table "public"."role_permissions" drop column "select";

alter table "public"."role_permissions" drop column "update";

alter table "public"."user_profiles" add column "is_active" boolean default false;

CREATE UNIQUE INDEX addresses_pkey ON public.addresses USING btree (id);

CREATE UNIQUE INDEX company_employees_pkey ON public.company_employees USING btree (id);

CREATE UNIQUE INDEX content_source_visits_pkey ON public.content_source_visits USING btree (id);

CREATE UNIQUE INDEX feed_sources_pkey ON public.feed_sources USING btree (id);

CREATE UNIQUE INDEX plan_permissions_pkey ON public.plan_permissions USING btree (id);

alter table "public"."addresses" add constraint "addresses_pkey" PRIMARY KEY using index "addresses_pkey";

alter table "public"."company_employees" add constraint "company_employees_pkey" PRIMARY KEY using index "company_employees_pkey";

alter table "public"."content_source_visits" add constraint "content_source_visits_pkey" PRIMARY KEY using index "content_source_visits_pkey";

alter table "public"."feed_sources" add constraint "feed_sources_pkey" PRIMARY KEY using index "feed_sources_pkey";

alter table "public"."plan_permissions" add constraint "plan_permissions_pkey" PRIMARY KEY using index "plan_permissions_pkey";

alter table "public"."research_embeddings" add constraint "research_embeddings_research_id_fkey" FOREIGN KEY (research_id) REFERENCES public.research(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."research_embeddings" validate constraint "research_embeddings_research_id_fkey";
