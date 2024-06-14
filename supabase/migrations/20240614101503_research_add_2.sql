alter table "public"."research" drop column "facilities";

alter table "public"."research" add column "affiliations" text[];

alter table "public"."research" add column "comments" text;

alter table "public"."research" alter column "updated_at" drop default;


