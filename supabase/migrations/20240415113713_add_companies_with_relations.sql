create type "public"."address_type" as enum ('Residential', 'Headquarters', 'Office', 'Factory', 'Lab', 'Warehouse', 'R&D', 'Retail', 'Showroom', 'Branch');

create type "public"."contact_type" as enum ('Personal', 'Company', 'Professional', 'Recruitment', 'Founder');

create type "public"."privacy_level" as enum ('Private', 'Connected', 'Public');

create type "public"."scrape_frequency" as enum ('FourTimesDaily', 'TwiceDaily', 'Daily', 'Weekly', 'BiWeekly', 'Monthly');

create sequence "public"."addresses_id_seq";

create sequence "public"."cities_id_seq";

create sequence "public"."companies_id_seq";

create sequence "public"."contacts_id_seq";

create sequence "public"."countries_id_seq";

create sequence "public"."social_media_id_seq";

drop policy "Enable read access for all users" on "public"."papers";

drop policy "service_role_all_permissions" on "public"."papers";

revoke select on table "public"."papers" from PUBLIC;

revoke delete on table "public"."papers" from anon;

revoke insert on table "public"."papers" from anon;

revoke references on table "public"."papers" from anon;

revoke select on table "public"."papers" from anon;

revoke trigger on table "public"."papers" from anon;

revoke truncate on table "public"."papers" from anon;

revoke update on table "public"."papers" from anon;

revoke delete on table "public"."papers" from authenticated;

revoke insert on table "public"."papers" from authenticated;

revoke references on table "public"."papers" from authenticated;

revoke select on table "public"."papers" from authenticated;

revoke trigger on table "public"."papers" from authenticated;

revoke truncate on table "public"."papers" from authenticated;

revoke update on table "public"."papers" from authenticated;

revoke delete on table "public"."papers" from service_role;

revoke insert on table "public"."papers" from service_role;

revoke references on table "public"."papers" from service_role;

revoke select on table "public"."papers" from service_role;

revoke trigger on table "public"."papers" from service_role;

revoke truncate on table "public"."papers" from service_role;

revoke update on table "public"."papers" from service_role;

alter table "public"."papers" drop constraint "research_url_key";

alter table "public"."papers" drop constraint "research_pkey";

drop index if exists "public"."research_pkey";

drop index if exists "public"."research_url_key";

drop table "public"."papers";

create table "public"."addresses" (
    "id" integer not null default nextval('addresses_id_seq'::regclass),
    "street1" character varying(255) not null,
    "street2" character varying(255),
    "city_id" integer not null,
    "state" character varying(100),
    "postal_code" character varying(20),
    "country_id" integer not null,
    "name" character varying,
    "company_id" integer,
    "user_id" uuid,
    "is_primary" boolean default false,
    "address_type" address_type
);


alter table "public"."addresses" enable row level security;

create table "public"."cities" (
    "id" integer not null default nextval('cities_id_seq'::regclass),
    "name" character varying(100) not null,
    "country_id" integer not null
);


alter table "public"."cities" enable row level security;

create table "public"."companies" (
    "id" integer not null default nextval('companies_id_seq'::regclass),
    "name" character varying(255) not null,
    "description" text,
    "logo_url" character varying(255),
    "website_url" character varying(255),
    "email" character varying(255),
    "phone" character varying(20),
    "address_id" integer,
    "social_media_id" integer,
    "jobs_page_url" character varying(255),
    "events_page_url" character varying(255),
    "blog_url" character varying(255),
    "last_scraped_at" timestamp without time zone,
    "scrape_frequency" scrape_frequency,
    "category_id" integer,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "founding_year" smallint,
    "is_government" boolean not null default false
);


alter table "public"."companies" enable row level security;

create table "public"."contacts" (
    "id" integer not null default nextval('contacts_id_seq'::regclass),
    "given_name" character varying(100),
    "surname" character varying(100),
    "title" character varying(100),
    "is_primary" boolean not null default false,
    "email" character varying(255),
    "phone_number" character varying(50),
    "contact_type" contact_type,
    "privacy_level" privacy_level,
    "user_id" uuid,
    "company_id" integer,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone default CURRENT_TIMESTAMP
);


alter table "public"."contacts" enable row level security;

create table "public"."countries" (
    "id" integer not null default nextval('countries_id_seq'::regclass),
    "name" character varying(100) not null
);


alter table "public"."countries" enable row level security;

create table "public"."research" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now(),
    "published_at" timestamp with time zone,
    "title" text,
    "url" character varying not null,
    "body" text,
    "author" character varying,
    "description" text,
    "version" smallint
);


alter table "public"."research" enable row level security;

create table "public"."social_media" (
    "id" integer not null default nextval('social_media_id_seq'::regclass),
    "facebook_url" character varying(255),
    "twitter_url" character varying(255),
    "linkedin_url" character varying(255),
    "instagram_url" character varying(255),
    "youtube_url" character varying,
    "company_id" integer
);


alter table "public"."social_media" enable row level security;

alter table "public"."news" alter column "body" set not null;

alter table "public"."user_profiles" alter column "avatar" drop default;

alter table "public"."user_profiles" alter column "id" set not null;

alter sequence "public"."addresses_id_seq" owned by "public"."addresses"."id";

alter sequence "public"."cities_id_seq" owned by "public"."cities"."id";

alter sequence "public"."companies_id_seq" owned by "public"."companies"."id";

alter sequence "public"."contacts_id_seq" owned by "public"."contacts"."id";

alter sequence "public"."countries_id_seq" owned by "public"."countries"."id";

alter sequence "public"."social_media_id_seq" owned by "public"."social_media"."id";

CREATE UNIQUE INDEX addresses_pkey ON public.addresses USING btree (id);

CREATE UNIQUE INDEX cities_pkey ON public.cities USING btree (id);

CREATE UNIQUE INDEX companies_pkey ON public.companies USING btree (id);

CREATE UNIQUE INDEX contacts_pkey ON public.contacts USING btree (id);

CREATE UNIQUE INDEX countries_name_key ON public.countries USING btree (name);

CREATE UNIQUE INDEX countries_pkey ON public.countries USING btree (id);

CREATE INDEX idx_addresses_city_id ON public.addresses USING btree (city_id);

CREATE INDEX idx_addresses_country_id ON public.addresses USING btree (country_id);

CREATE INDEX idx_cities_country_id ON public.cities USING btree (country_id);

CREATE INDEX idx_companies_category ON public.companies USING btree (category_id);

CREATE INDEX idx_companies_name ON public.companies USING btree (name);

CREATE UNIQUE INDEX social_media_pkey ON public.social_media USING btree (id);

CREATE UNIQUE INDEX user_profiles_pkey ON public.user_profiles USING btree (id);

CREATE UNIQUE INDEX research_pkey ON public.research USING btree (id);

CREATE UNIQUE INDEX research_url_key ON public.research USING btree (url);

alter table "public"."addresses" add constraint "addresses_pkey" PRIMARY KEY using index "addresses_pkey";

alter table "public"."cities" add constraint "cities_pkey" PRIMARY KEY using index "cities_pkey";

alter table "public"."companies" add constraint "companies_pkey" PRIMARY KEY using index "companies_pkey";

alter table "public"."contacts" add constraint "contacts_pkey" PRIMARY KEY using index "contacts_pkey";

alter table "public"."countries" add constraint "countries_pkey" PRIMARY KEY using index "countries_pkey";

alter table "public"."research" add constraint "research_pkey" PRIMARY KEY using index "research_pkey";

alter table "public"."social_media" add constraint "social_media_pkey" PRIMARY KEY using index "social_media_pkey";

alter table "public"."user_profiles" add constraint "user_profiles_pkey" PRIMARY KEY using index "user_profiles_pkey";

alter table "public"."addresses" add constraint "fk_city" FOREIGN KEY (city_id) REFERENCES cities(id) not valid;

alter table "public"."addresses" validate constraint "fk_city";

alter table "public"."addresses" add constraint "fk_country" FOREIGN KEY (country_id) REFERENCES countries(id) not valid;

alter table "public"."addresses" validate constraint "fk_country";

alter table "public"."addresses" add constraint "public_addresses_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."addresses" validate constraint "public_addresses_company_id_fkey";

alter table "public"."addresses" add constraint "public_addresses_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."addresses" validate constraint "public_addresses_user_id_fkey";

alter table "public"."cities" add constraint "fk_country" FOREIGN KEY (country_id) REFERENCES countries(id) not valid;

alter table "public"."cities" validate constraint "fk_country";

alter table "public"."companies" add constraint "fk_address" FOREIGN KEY (address_id) REFERENCES addresses(id) not valid;

alter table "public"."companies" validate constraint "fk_address";

alter table "public"."companies" add constraint "fk_category" FOREIGN KEY (category_id) REFERENCES categories(id) not valid;

alter table "public"."companies" validate constraint "fk_category";

alter table "public"."companies" add constraint "fk_social_media" FOREIGN KEY (social_media_id) REFERENCES social_media(id) not valid;

alter table "public"."companies" validate constraint "fk_social_media";

alter table "public"."contacts" add constraint "fk_company" FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE not valid;

alter table "public"."contacts" validate constraint "fk_company";

alter table "public"."contacts" add constraint "fk_user" FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."contacts" validate constraint "fk_user";

alter table "public"."countries" add constraint "countries_name_key" UNIQUE using index "countries_name_key";

alter table "public"."research" add constraint "research_url_key" UNIQUE using index "research_url_key";

alter table "public"."social_media" add constraint "public_social_media_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."social_media" validate constraint "public_social_media_company_id_fkey";

grant delete on table "public"."addresses" to "anon";

grant insert on table "public"."addresses" to "anon";

grant references on table "public"."addresses" to "anon";

grant select on table "public"."addresses" to "anon";

grant trigger on table "public"."addresses" to "anon";

grant truncate on table "public"."addresses" to "anon";

grant update on table "public"."addresses" to "anon";

grant delete on table "public"."addresses" to "authenticated";

grant insert on table "public"."addresses" to "authenticated";

grant references on table "public"."addresses" to "authenticated";

grant select on table "public"."addresses" to "authenticated";

grant trigger on table "public"."addresses" to "authenticated";

grant truncate on table "public"."addresses" to "authenticated";

grant update on table "public"."addresses" to "authenticated";

grant delete on table "public"."addresses" to "service_role";

grant insert on table "public"."addresses" to "service_role";

grant references on table "public"."addresses" to "service_role";

grant select on table "public"."addresses" to "service_role";

grant trigger on table "public"."addresses" to "service_role";

grant truncate on table "public"."addresses" to "service_role";

grant update on table "public"."addresses" to "service_role";

grant delete on table "public"."cities" to "anon";

grant insert on table "public"."cities" to "anon";

grant references on table "public"."cities" to "anon";

grant select on table "public"."cities" to "anon";

grant trigger on table "public"."cities" to "anon";

grant truncate on table "public"."cities" to "anon";

grant update on table "public"."cities" to "anon";

grant delete on table "public"."cities" to "authenticated";

grant insert on table "public"."cities" to "authenticated";

grant references on table "public"."cities" to "authenticated";

grant select on table "public"."cities" to "authenticated";

grant trigger on table "public"."cities" to "authenticated";

grant truncate on table "public"."cities" to "authenticated";

grant update on table "public"."cities" to "authenticated";

grant delete on table "public"."cities" to "service_role";

grant insert on table "public"."cities" to "service_role";

grant references on table "public"."cities" to "service_role";

grant select on table "public"."cities" to "service_role";

grant trigger on table "public"."cities" to "service_role";

grant truncate on table "public"."cities" to "service_role";

grant update on table "public"."cities" to "service_role";

grant delete on table "public"."companies" to "anon";

grant insert on table "public"."companies" to "anon";

grant references on table "public"."companies" to "anon";

grant select on table "public"."companies" to "anon";

grant trigger on table "public"."companies" to "anon";

grant truncate on table "public"."companies" to "anon";

grant update on table "public"."companies" to "anon";

grant delete on table "public"."companies" to "authenticated";

grant insert on table "public"."companies" to "authenticated";

grant references on table "public"."companies" to "authenticated";

grant select on table "public"."companies" to "authenticated";

grant trigger on table "public"."companies" to "authenticated";

grant truncate on table "public"."companies" to "authenticated";

grant update on table "public"."companies" to "authenticated";

grant delete on table "public"."companies" to "service_role";

grant insert on table "public"."companies" to "service_role";

grant references on table "public"."companies" to "service_role";

grant select on table "public"."companies" to "service_role";

grant trigger on table "public"."companies" to "service_role";

grant truncate on table "public"."companies" to "service_role";

grant update on table "public"."companies" to "service_role";

grant delete on table "public"."contacts" to "anon";

grant insert on table "public"."contacts" to "anon";

grant references on table "public"."contacts" to "anon";

grant select on table "public"."contacts" to "anon";

grant trigger on table "public"."contacts" to "anon";

grant truncate on table "public"."contacts" to "anon";

grant update on table "public"."contacts" to "anon";

grant delete on table "public"."contacts" to "authenticated";

grant insert on table "public"."contacts" to "authenticated";

grant references on table "public"."contacts" to "authenticated";

grant select on table "public"."contacts" to "authenticated";

grant trigger on table "public"."contacts" to "authenticated";

grant truncate on table "public"."contacts" to "authenticated";

grant update on table "public"."contacts" to "authenticated";

grant delete on table "public"."contacts" to "service_role";

grant insert on table "public"."contacts" to "service_role";

grant references on table "public"."contacts" to "service_role";

grant select on table "public"."contacts" to "service_role";

grant trigger on table "public"."contacts" to "service_role";

grant truncate on table "public"."contacts" to "service_role";

grant update on table "public"."contacts" to "service_role";

grant delete on table "public"."countries" to "anon";

grant insert on table "public"."countries" to "anon";

grant references on table "public"."countries" to "anon";

grant select on table "public"."countries" to "anon";

grant trigger on table "public"."countries" to "anon";

grant truncate on table "public"."countries" to "anon";

grant update on table "public"."countries" to "anon";

grant delete on table "public"."countries" to "authenticated";

grant insert on table "public"."countries" to "authenticated";

grant references on table "public"."countries" to "authenticated";

grant select on table "public"."countries" to "authenticated";

grant trigger on table "public"."countries" to "authenticated";

grant truncate on table "public"."countries" to "authenticated";

grant update on table "public"."countries" to "authenticated";

grant delete on table "public"."countries" to "service_role";

grant insert on table "public"."countries" to "service_role";

grant references on table "public"."countries" to "service_role";

grant select on table "public"."countries" to "service_role";

grant trigger on table "public"."countries" to "service_role";

grant truncate on table "public"."countries" to "service_role";

grant update on table "public"."countries" to "service_role";

grant select on table "public"."research" to "anon";

grant delete on table "public"."research" to "anon";

grant insert on table "public"."research" to "anon";

grant references on table "public"."research" to "anon";

grant select on table "public"."research" to "anon";

grant trigger on table "public"."research" to "anon";

grant truncate on table "public"."research" to "anon";

grant update on table "public"."research" to "anon";

grant delete on table "public"."research" to "authenticated";

grant insert on table "public"."research" to "authenticated";

grant references on table "public"."research" to "authenticated";

grant select on table "public"."research" to "authenticated";

grant trigger on table "public"."research" to "authenticated";

grant truncate on table "public"."research" to "authenticated";

grant update on table "public"."research" to "authenticated";

grant delete on table "public"."research" to "service_role";

grant insert on table "public"."research" to "service_role";

grant references on table "public"."research" to "service_role";

grant select on table "public"."research" to "service_role";

grant trigger on table "public"."research" to "service_role";

grant truncate on table "public"."research" to "service_role";

grant update on table "public"."research" to "service_role";

grant delete on table "public"."social_media" to "anon";

grant insert on table "public"."social_media" to "anon";

grant references on table "public"."social_media" to "anon";

grant select on table "public"."social_media" to "anon";

grant trigger on table "public"."social_media" to "anon";

grant truncate on table "public"."social_media" to "anon";

grant update on table "public"."social_media" to "anon";

grant delete on table "public"."social_media" to "authenticated";

grant insert on table "public"."social_media" to "authenticated";

grant references on table "public"."social_media" to "authenticated";

grant select on table "public"."social_media" to "authenticated";

grant trigger on table "public"."social_media" to "authenticated";

grant truncate on table "public"."social_media" to "authenticated";

grant update on table "public"."social_media" to "authenticated";

grant delete on table "public"."social_media" to "service_role";

grant insert on table "public"."social_media" to "service_role";

grant references on table "public"."social_media" to "service_role";

grant select on table "public"."social_media" to "service_role";

grant trigger on table "public"."social_media" to "service_role";

grant truncate on table "public"."social_media" to "service_role";

grant update on table "public"."social_media" to "service_role";

create policy "Enable read access for all users"
on "public"."addresses"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."cities"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."companies"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."contacts"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."countries"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."research"
as permissive
for select
to public
using (true);


create policy "service_role_all_permissions"
on "public"."research"
as permissive
for all
to service_role;


create policy "Enable read access for all users"
on "public"."social_media"
as permissive
for select
to public
using (true);



