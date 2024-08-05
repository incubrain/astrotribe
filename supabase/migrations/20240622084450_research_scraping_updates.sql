create type "public"."content_type" as enum ('news', 'events', 'jobs', 'research');

create sequence "public"."companies_id_seq";

create sequence "public"."company_contacts_id_seq";

create sequence "public"."company_extras_id_seq";

create sequence "public"."company_urls_id_seq";

create sequence "public"."content_sources_id_seq";

create sequence "public"."scraper_configs_id_seq";

create sequence "public"."spider_metrics_id_seq";

alter table "public"."company_news" drop constraint "company_news_news_id_fkey";

alter table "public"."news_embeddings" drop constraint "news_embeddings_news_id_fkey";

alter table "public"."news_tags" drop constraint "news_tags_news_id_fkey";

alter table "public"."searches" drop constraint "searches_user_id_fkey";

alter table "public"."research_embeddings" drop constraint "public_research_embeddings_research_id_fkey";

create table "public"."company_contacts" (
    "id" integer not null default nextval('public.company_contacts_id_seq'::regclass),
    "company_id" integer not null,
    "contact_id" integer not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."company_contacts" enable row level security;

create table "public"."company_extras" (
    "id" integer not null default nextval('public.company_extras_id_seq'::regclass),
    "company_id" integer not null,
    "updated_at" timestamp with time zone not null default now(),
    "created_at" timestamp with time zone not null default now(),
    "url" text not null,
    "success" boolean not null,
    "category" text not null,
    "level" smallint not null
);


alter table "public"."company_extras" enable row level security;

create table "public"."company_urls" (
    "id" integer not null default nextval('public.company_urls_id_seq'::regclass),
    "company_id" integer not null,
    "updated_at" timestamp with time zone not null default now(),
    "created_at" timestamp with time zone not null default now(),
    "url" text not null,
    "success" boolean not null,
    "category" text not null,
    "level" smallint not null,
    "data" jsonb
);


alter table "public"."company_urls" enable row level security;

create table "public"."content_sources" (
    "id" integer not null default nextval('public.content_sources_id_seq'::regclass),
    "content_type" public.content_type not null,
    "name" character varying(255) not null,
    "description" text,
    "url" text not null,
    "scraper_id" integer,
    "scrape_frequency" public.scrape_frequency not null,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."content_sources" enable row level security;

create table "public"."scraper_configs" (
    "id" integer not null default nextval('public.scraper_configs_id_seq'::regclass),
    "scraper_type" character varying(255) not null,
    "config" jsonb not null,
    "frequency" public.scrape_frequency not null,
    "last_scraped_at" timestamp with time zone,
    "error" boolean default false,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."scraper_configs" enable row level security;

create table "public"."spider_metrics" (
    "id" integer not null default nextval('public.spider_metrics_id_seq'::regclass),
    "total_time" numeric not null,
    "average_time_per_url" numeric not null,
    "total_urls_scraped" integer not null,
    "total_urls_ignored" integer not null,
    "unique_domains" integer not null,
    "average_content_size" numeric not null,
    "total_content_size" numeric not null,
    "total_pages_attempted" integer not null,
    "error_count" integer not null,
    "ignored_count" integer not null,
    "category_counts" jsonb not null,
    "failed_urls" jsonb not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."spider_metrics" enable row level security;

alter table "public"."companies" drop column "last_scraped_at";

alter table "public"."companies" add column "category" text;

alter table "public"."companies" add column "keywords" text[];

alter table "public"."companies" alter column "id" set default nextval('public.companies_id_seq'::regclass);

alter table "public"."companies" alter column "logo_url" set data type text using "logo_url"::text;

alter table "public"."news" add column "hash" integer;

ALTER TABLE public.news DROP CONSTRAINT news_pkey;
ALTER TABLE public.news DROP COLUMN id;
ALTER TABLE public.news ADD COLUMN id UUID;
UPDATE public.news SET id = gen_random_uuid();
ALTER TABLE public.news ADD PRIMARY KEY (id);

alter table "public"."news_embeddings" add column "embedding" public.vector(1536);

alter table "public"."research" add column "is_flagged" boolean not null default false;

ALTER TABLE public.research DROP COLUMN authors;
ALTER TABLE public.research ADD COLUMN authors JSONB;

alter table "public"."searches" drop column "user_id";

alter table "public"."searches" add column "embedding" public.vector(1536);

alter table "public"."searches" add column "tokens_used" smallint;

alter table "public"."searches" add column "user_ids" uuid[];

alter sequence "public"."companies_id_seq" owned by "public"."companies"."id";

alter sequence "public"."company_contacts_id_seq" owned by "public"."company_contacts"."id";

alter sequence "public"."company_extras_id_seq" owned by "public"."company_extras"."id";

alter sequence "public"."company_urls_id_seq" owned by "public"."company_urls"."id";

alter sequence "public"."content_sources_id_seq" owned by "public"."content_sources"."id";

alter sequence "public"."scraper_configs_id_seq" owned by "public"."scraper_configs"."id";

alter sequence "public"."spider_metrics_id_seq" owned by "public"."spider_metrics"."id";

CREATE UNIQUE INDEX company_contacts_pkey ON public.company_contacts USING btree (id);

CREATE UNIQUE INDEX company_extras_pkey ON public.company_extras USING btree (id);

CREATE UNIQUE INDEX company_urls_pkey ON public.company_urls USING btree (id);

CREATE UNIQUE INDEX content_sources_pkey ON public.content_sources USING btree (id);

CREATE UNIQUE INDEX content_sources_url_key ON public.content_sources USING btree (url);

CREATE INDEX idx_cc_company_id ON public.company_contacts USING btree (company_id);

CREATE INDEX idx_cc_contact_id ON public.company_contacts USING btree (contact_id);

CREATE INDEX idx_ce_company_id ON public.company_extras USING btree (company_id);

CREATE UNIQUE INDEX idx_ce_unique_url ON public.company_extras USING btree (url);

CREATE INDEX idx_company_id ON public.company_urls USING btree (company_id);

CREATE UNIQUE INDEX idx_unique_company_contact ON public.company_contacts USING btree (company_id, contact_id);

CREATE UNIQUE INDEX idx_unique_url ON public.company_urls USING btree (url);

CREATE UNIQUE INDEX news_id_key ON public.news USING btree (id);

CREATE UNIQUE INDEX research_embeddings_id_key ON public.research_embeddings USING btree (id);

CREATE UNIQUE INDEX scraper_configs_pkey ON public.scraper_configs USING btree (id);

CREATE UNIQUE INDEX searches_input_key ON public.searches USING btree (input);

CREATE UNIQUE INDEX spider_metrics_pkey ON public.spider_metrics USING btree (id);

alter table "public"."company_contacts" add constraint "company_contacts_pkey" PRIMARY KEY using index "company_contacts_pkey";

alter table "public"."company_extras" add constraint "company_extras_pkey" PRIMARY KEY using index "company_extras_pkey";

alter table "public"."company_urls" add constraint "company_urls_pkey" PRIMARY KEY using index "company_urls_pkey";

alter table "public"."content_sources" add constraint "content_sources_pkey" PRIMARY KEY using index "content_sources_pkey";

alter table "public"."scraper_configs" add constraint "scraper_configs_pkey" PRIMARY KEY using index "scraper_configs_pkey";

alter table "public"."spider_metrics" add constraint "spider_metrics_pkey" PRIMARY KEY using index "spider_metrics_pkey";

alter table "public"."company_contacts" add constraint "fk_company" FOREIGN KEY (company_id) REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."company_contacts" validate constraint "fk_company";

alter table "public"."company_contacts" add constraint "fk_contact" FOREIGN KEY (contact_id) REFERENCES public.contacts(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."company_contacts" validate constraint "fk_contact";

alter table "public"."company_extras" add constraint "fk_company" FOREIGN KEY (company_id) REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."company_extras" validate constraint "fk_company";

alter table "public"."company_urls" add constraint "fk_company" FOREIGN KEY (company_id) REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."company_urls" validate constraint "fk_company";

alter table "public"."content_sources" add constraint "content_sources_scraper_id_fkey" FOREIGN KEY (scraper_id) REFERENCES public.scraper_configs(id) not valid;

alter table "public"."content_sources" validate constraint "content_sources_scraper_id_fkey";

alter table "public"."content_sources" add constraint "content_sources_url_key" UNIQUE using index "content_sources_url_key";

alter table "public"."news" add constraint "news_id_key" UNIQUE using index "news_id_key";

alter table "public"."research_embeddings" add constraint "research_embeddings_id_key" UNIQUE using index "research_embeddings_id_key";

alter table "public"."searches" add constraint "searches_input_key" UNIQUE using index "searches_input_key";

alter table "public"."research_embeddings" add constraint "public_research_embeddings_research_id_fkey" FOREIGN KEY (research_id) REFERENCES public.research(id) ON DELETE CASCADE not valid;

alter table "public"."research_embeddings" validate constraint "public_research_embeddings_research_id_fkey";

grant delete on table "public"."company_contacts" to "anon";

grant insert on table "public"."company_contacts" to "anon";

grant references on table "public"."company_contacts" to "anon";

grant select on table "public"."company_contacts" to "anon";

grant trigger on table "public"."company_contacts" to "anon";

grant truncate on table "public"."company_contacts" to "anon";

grant update on table "public"."company_contacts" to "anon";

grant delete on table "public"."company_contacts" to "authenticated";

grant insert on table "public"."company_contacts" to "authenticated";

grant references on table "public"."company_contacts" to "authenticated";

grant select on table "public"."company_contacts" to "authenticated";

grant trigger on table "public"."company_contacts" to "authenticated";

grant truncate on table "public"."company_contacts" to "authenticated";

grant update on table "public"."company_contacts" to "authenticated";

grant delete on table "public"."company_contacts" to "service_role";

grant insert on table "public"."company_contacts" to "service_role";

grant references on table "public"."company_contacts" to "service_role";

grant select on table "public"."company_contacts" to "service_role";

grant trigger on table "public"."company_contacts" to "service_role";

grant truncate on table "public"."company_contacts" to "service_role";

grant update on table "public"."company_contacts" to "service_role";

grant delete on table "public"."company_extras" to "anon";

grant insert on table "public"."company_extras" to "anon";

grant references on table "public"."company_extras" to "anon";

grant select on table "public"."company_extras" to "anon";

grant trigger on table "public"."company_extras" to "anon";

grant truncate on table "public"."company_extras" to "anon";

grant update on table "public"."company_extras" to "anon";

grant delete on table "public"."company_extras" to "authenticated";

grant insert on table "public"."company_extras" to "authenticated";

grant references on table "public"."company_extras" to "authenticated";

grant select on table "public"."company_extras" to "authenticated";

grant trigger on table "public"."company_extras" to "authenticated";

grant truncate on table "public"."company_extras" to "authenticated";

grant update on table "public"."company_extras" to "authenticated";

grant delete on table "public"."company_extras" to "service_role";

grant insert on table "public"."company_extras" to "service_role";

grant references on table "public"."company_extras" to "service_role";

grant select on table "public"."company_extras" to "service_role";

grant trigger on table "public"."company_extras" to "service_role";

grant truncate on table "public"."company_extras" to "service_role";

grant update on table "public"."company_extras" to "service_role";

grant delete on table "public"."company_urls" to "anon";

grant insert on table "public"."company_urls" to "anon";

grant references on table "public"."company_urls" to "anon";

grant select on table "public"."company_urls" to "anon";

grant trigger on table "public"."company_urls" to "anon";

grant truncate on table "public"."company_urls" to "anon";

grant update on table "public"."company_urls" to "anon";

grant delete on table "public"."company_urls" to "authenticated";

grant insert on table "public"."company_urls" to "authenticated";

grant references on table "public"."company_urls" to "authenticated";

grant select on table "public"."company_urls" to "authenticated";

grant trigger on table "public"."company_urls" to "authenticated";

grant truncate on table "public"."company_urls" to "authenticated";

grant update on table "public"."company_urls" to "authenticated";

grant delete on table "public"."company_urls" to "service_role";

grant insert on table "public"."company_urls" to "service_role";

grant references on table "public"."company_urls" to "service_role";

grant select on table "public"."company_urls" to "service_role";

grant trigger on table "public"."company_urls" to "service_role";

grant truncate on table "public"."company_urls" to "service_role";

grant update on table "public"."company_urls" to "service_role";

grant delete on table "public"."content_sources" to "anon";

grant insert on table "public"."content_sources" to "anon";

grant references on table "public"."content_sources" to "anon";

grant select on table "public"."content_sources" to "anon";

grant trigger on table "public"."content_sources" to "anon";

grant truncate on table "public"."content_sources" to "anon";

grant update on table "public"."content_sources" to "anon";

grant delete on table "public"."content_sources" to "authenticated";

grant insert on table "public"."content_sources" to "authenticated";

grant references on table "public"."content_sources" to "authenticated";

grant select on table "public"."content_sources" to "authenticated";

grant trigger on table "public"."content_sources" to "authenticated";

grant truncate on table "public"."content_sources" to "authenticated";

grant update on table "public"."content_sources" to "authenticated";

grant delete on table "public"."content_sources" to "service_role";

grant insert on table "public"."content_sources" to "service_role";

grant references on table "public"."content_sources" to "service_role";

grant select on table "public"."content_sources" to "service_role";

grant trigger on table "public"."content_sources" to "service_role";

grant truncate on table "public"."content_sources" to "service_role";

grant update on table "public"."content_sources" to "service_role";

grant delete on table "public"."scraper_configs" to "anon";

grant insert on table "public"."scraper_configs" to "anon";

grant references on table "public"."scraper_configs" to "anon";

grant select on table "public"."scraper_configs" to "anon";

grant trigger on table "public"."scraper_configs" to "anon";

grant truncate on table "public"."scraper_configs" to "anon";

grant update on table "public"."scraper_configs" to "anon";

grant delete on table "public"."scraper_configs" to "authenticated";

grant insert on table "public"."scraper_configs" to "authenticated";

grant references on table "public"."scraper_configs" to "authenticated";

grant select on table "public"."scraper_configs" to "authenticated";

grant trigger on table "public"."scraper_configs" to "authenticated";

grant truncate on table "public"."scraper_configs" to "authenticated";

grant update on table "public"."scraper_configs" to "authenticated";

grant delete on table "public"."scraper_configs" to "service_role";

grant insert on table "public"."scraper_configs" to "service_role";

grant references on table "public"."scraper_configs" to "service_role";

grant select on table "public"."scraper_configs" to "service_role";

grant trigger on table "public"."scraper_configs" to "service_role";

grant truncate on table "public"."scraper_configs" to "service_role";

grant update on table "public"."scraper_configs" to "service_role";

grant delete on table "public"."spider_metrics" to "anon";

grant insert on table "public"."spider_metrics" to "anon";

grant references on table "public"."spider_metrics" to "anon";

grant select on table "public"."spider_metrics" to "anon";

grant trigger on table "public"."spider_metrics" to "anon";

grant truncate on table "public"."spider_metrics" to "anon";

grant update on table "public"."spider_metrics" to "anon";

grant delete on table "public"."spider_metrics" to "authenticated";

grant insert on table "public"."spider_metrics" to "authenticated";

grant references on table "public"."spider_metrics" to "authenticated";

grant select on table "public"."spider_metrics" to "authenticated";

grant trigger on table "public"."spider_metrics" to "authenticated";

grant truncate on table "public"."spider_metrics" to "authenticated";

grant update on table "public"."spider_metrics" to "authenticated";

grant delete on table "public"."spider_metrics" to "service_role";

grant insert on table "public"."spider_metrics" to "service_role";

grant references on table "public"."spider_metrics" to "service_role";

grant select on table "public"."spider_metrics" to "service_role";

grant trigger on table "public"."spider_metrics" to "service_role";

grant truncate on table "public"."spider_metrics" to "service_role";

grant update on table "public"."spider_metrics" to "service_role";


