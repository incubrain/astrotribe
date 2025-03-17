-- Convert jobs.content_source_id using the same mapping table
ALTER TABLE "public"."jobs" ADD COLUMN "new_content_source_id" UUID;
UPDATE "public"."jobs"
SET "new_content_source_id" = (SELECT new_id FROM public.content_sources_id_mapping WHERE old_id = public.jobs.content_source_id);

ALTER TABLE "public"."jobs" DROP COLUMN "content_source_id";
ALTER TABLE "public"."jobs" RENAME COLUMN "new_content_source_id" TO "content_source_id";

-- Re-add foreign key
ALTER TABLE "public"."jobs"
ADD CONSTRAINT jobs_content_source_id_fkey
FOREIGN KEY ("content_source_id") REFERENCES "public"."content_sources" ("id") ON DELETE CASCADE;

-- ✅ JOBS TABLE: Convert content_source_id from bigint → UUID
ALTER TABLE "public"."jobs" DROP CONSTRAINT IF EXISTS jobs_content_source_id_fkey;
