alter table "public"."companies" drop constraint "fk_address";

alter table "public"."social_media" drop constraint "public_social_media_company_id_fkey";

alter table "public"."addresses" drop column "postal_code";

alter table "public"."addresses" drop column "state";

alter table "public"."addresses" add column "created_at" timestamp with time zone default now();

alter table "public"."addresses" add column "updated_at" timestamp with time zone default now();

alter table "public"."cities" add column "state" character varying;

alter table "public"."companies" drop column "address_id";

alter table "public"."companies" drop column "blog_url";

alter table "public"."companies" drop column "email";

alter table "public"."companies" drop column "events_page_url";

alter table "public"."companies" drop column "jobs_page_url";

alter table "public"."companies" drop column "phone";

alter table "public"."companies" alter column "created_at" drop default;

alter table "public"."companies" alter column "created_at" set data type timestamp with time zone using "created_at"::timestamp with time zone;

alter table "public"."companies" alter column "last_scraped_at" set data type timestamp with time zone using "last_scraped_at"::timestamp with time zone;

alter table "public"."companies" alter column "updated_at" drop default;

alter table "public"."companies" alter column "updated_at" set data type timestamp with time zone using "updated_at"::timestamp with time zone;

alter table "public"."companies" alter column "website_url" set not null;

alter table "public"."contacts" drop column "given_name";

alter table "public"."contacts" drop column "phone_number";

alter table "public"."contacts" drop column "surname";

alter table "public"."contacts" add column "phone" character varying(50);

alter table "public"."contacts" alter column "is_primary" drop not null;

alter table "public"."social_media" drop column "company_id";

alter table "public"."social_media" add column "created_at" timestamp with time zone default now();

alter table "public"."social_media" add column "updated_at" timestamp with time zone default now();

CREATE UNIQUE INDEX cities_name_key ON public.cities USING btree (name);

CREATE UNIQUE INDEX companies_website_url_key ON public.companies USING btree (website_url);

alter table "public"."cities" add constraint "cities_name_key" UNIQUE using index "cities_name_key";

alter table "public"."companies" add constraint "companies_website_url_key" UNIQUE using index "companies_website_url_key";


