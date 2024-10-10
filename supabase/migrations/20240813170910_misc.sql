alter table "public"."companies" drop column "status";

alter table "public"."companies" add column "content_status" public.content_status not null default 'draft'::public.content_status;

alter table "public"."companies" alter column "failed_count" set default '0'::smallint;

alter table "public"."content_statuses" drop column "status";

alter table "public"."content_statuses" add column "content_status" public.content_status not null;

alter table "public"."contents" alter column "content_type" set default 'companies'::public.content_type;

alter table "public"."feedbacks" drop column "status";

alter table "public"."feedbacks" add column "feedback_status" public.feedback_status default 'new'::public.feedback_status;

alter table "public"."news" drop column "status";

alter table "public"."news" add column "content_status" public.content_status not null default 'draft'::public.content_status;

alter table "public"."news" alter column "id" drop default;

alter table "public"."newsletters" drop column "status";

alter table "public"."newsletters" add column "content_status" public.content_status not null default 'draft'::public.content_status;

alter table "public"."research" drop column "status";

alter table "public"."research" add column "content_status" public.content_status not null default 'draft'::public.content_status;


