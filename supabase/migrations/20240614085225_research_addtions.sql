alter table "public"."research_embeddings" drop constraint "research_embeddings_research_id_fkey";

alter table "public"."research" drop constraint "research_url_key";

drop index if exists "public"."research_url_key";

alter table "public"."research" drop column "chunk_success";

alter table "public"."research" drop column "journal";

alter table "public"."research" drop column "url";

alter table "public"."research" add column "abstract_url" text not null;

alter table "public"."research" add column "authors" text[];

alter table "public"."research" add column "category" text;

alter table "public"."research" add column "doi_url" text;

alter table "public"."research" add column "figure_count" smallint;

alter table "public"."research" add column "has_embedding" boolean;

alter table "public"."research" add column "page_count" smallint;

alter table "public"."research" add column "pdf_url" text;

alter table "public"."research" add column "published_in" text;

alter table "public"."research" add column "table_count" smallint;

CREATE UNIQUE INDEX research_pdf_url_key ON public.research USING btree (pdf_url);

CREATE UNIQUE INDEX research_url_key ON public.research USING btree (abstract_url);

alter table "public"."research" add constraint "research_pdf_url_key" UNIQUE using index "research_pdf_url_key";

alter table "public"."research_embeddings" add constraint "public_research_embeddings_research_id_fkey" FOREIGN KEY (research_id) REFERENCES public.research(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."research_embeddings" validate constraint "public_research_embeddings_research_id_fkey";

alter table "public"."research" add constraint "research_url_key" UNIQUE using index "research_url_key";


