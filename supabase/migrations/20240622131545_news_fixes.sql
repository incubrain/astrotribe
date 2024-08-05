alter table "public"."news" alter column "body" drop not null;

alter table "public"."news" alter column "id" set default extensions.uuid_generate_v4();

alter table "public"."news" alter column "title" set data type text using "title"::text;


