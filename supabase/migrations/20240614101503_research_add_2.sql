alter table "public"."research" drop column "facilities";

alter table "public"."research" add column "affiliations" text[];

alter table "public"."research" add column "comments" text;

alter table "public"."research" alter column "updated_at" drop default;

alter table "public"."research_metrics" drop constraint if exists "research_metrics_research_id_key";

drop index if exists "public"."research_metrics_research_id_key";

alter table "public"."research_embeddings" alter column "chunk" set not null;

alter table "public"."research_metrics" drop column "research_id";

alter table "public"."research_metrics" add column "token_usage" jsonb;

alter table "public"."research_metrics" add column "type" character varying default 'abstract'::character varying;

CREATE UNIQUE INDEX research_embeddings_research_id_key ON public.research_embeddings USING btree (research_id);

alter table "public"."research_embeddings" add constraint "research_embeddings_research_id_key" UNIQUE using index "research_embeddings_research_id_key";



