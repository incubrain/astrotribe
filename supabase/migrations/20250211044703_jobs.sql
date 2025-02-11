create table "public"."jobs" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "contents_id" uuid not null,
    "title" text not null,
    "company_id" uuid,
    "location" text,
    "description" text,
    "published_at" timestamp with time zone,
    "expires_at" timestamp with time zone,
    "scraped_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "content_status" public.content_status not null default 'draft'::public.content_status,
    "content_source_id" bigint,
    "url" text not null,
    "hash" bigint,
    "employment_details" jsonb,
    "metadata" jsonb
);

alter table "public"."categorized_urls" alter column "priority" set not null;

CREATE INDEX idx_categorized_urls_priority ON public.categorized_urls USING btree (priority);

CREATE INDEX jobs_company_id_idx ON public.jobs USING btree (company_id);

CREATE INDEX jobs_content_status_idx ON public.jobs USING btree (content_status);

CREATE UNIQUE INDEX jobs_pkey ON public.jobs USING btree (contents_id);

CREATE INDEX jobs_published_at_idx ON public.jobs USING btree (published_at);

CREATE UNIQUE INDEX jobs_url_hash_key ON public.jobs USING btree (url, hash);

alter table "public"."jobs" add constraint "jobs_pkey" PRIMARY KEY using index "jobs_pkey";

alter table "public"."categorized_urls" add constraint "valid_priority" CHECK (((priority)::text = ANY (ARRAY[('not_important'::character varying)::text, ('low'::character varying)::text, ('medium'::character varying)::text, ('high'::character varying)::text]))) not valid;

alter table "public"."categorized_urls" validate constraint "valid_priority";

alter table "public"."jobs" add constraint "jobs_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id) not valid;

alter table "public"."jobs" validate constraint "jobs_company_id_fkey";

alter table "public"."jobs" add constraint "jobs_content_source_id_fkey" FOREIGN KEY (content_source_id) REFERENCES public.content_sources(id) not valid;

alter table "public"."jobs" validate constraint "jobs_content_source_id_fkey";

alter table "public"."jobs" add constraint "jobs_contents_id_fkey" FOREIGN KEY (contents_id) REFERENCES public.contents(id) not valid;

alter table "public"."jobs" validate constraint "jobs_contents_id_fkey";

alter table "public"."jobs" add constraint "jobs_url_hash_key" UNIQUE using index "jobs_url_hash_key";

grant delete on table "public"."jobs" to "anon";

grant insert on table "public"."jobs" to "anon";

grant references on table "public"."jobs" to "anon";

grant select on table "public"."jobs" to "anon";

grant trigger on table "public"."jobs" to "anon";

grant truncate on table "public"."jobs" to "anon";

grant update on table "public"."jobs" to "anon";

grant delete on table "public"."jobs" to "authenticated";

grant insert on table "public"."jobs" to "authenticated";

grant references on table "public"."jobs" to "authenticated";

grant select on table "public"."jobs" to "authenticated";

grant trigger on table "public"."jobs" to "authenticated";

grant truncate on table "public"."jobs" to "authenticated";

grant update on table "public"."jobs" to "authenticated";

grant delete on table "public"."jobs" to "service_role";

grant insert on table "public"."jobs" to "service_role";

grant references on table "public"."jobs" to "service_role";

grant select on table "public"."jobs" to "service_role";

grant trigger on table "public"."jobs" to "service_role";

grant truncate on table "public"."jobs" to "service_role";

grant update on table "public"."jobs" to "service_role";

CREATE TRIGGER update_jobs_timestamp BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
