-- Wrap the entire migration in a DO block to allow for PL/pgSQL error handling
DO $$
BEGIN
    -- Drop indexes if they exist
    BEGIN
        DROP INDEX IF EXISTS "public"."idx_content_sources_details";
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error dropping idx_content_sources_details: %', SQLERRM;
    END;

    BEGIN
        DROP INDEX IF EXISTS "public"."idx_contents_is_active";
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error dropping idx_contents_is_active: %', SQLERRM;
    END;

    BEGIN
        DROP INDEX IF EXISTS "public"."idx_contents_signature";
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error dropping idx_contents_signature: %', SQLERRM;
    END;

    -- Dropping columns
    BEGIN
        ALTER TABLE "public"."content_sources" DROP COLUMN IF EXISTS "details";
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error dropping content_sources.details: %', SQLERRM;
    END;

    BEGIN
        ALTER TABLE "public"."content_sources" DROP COLUMN IF EXISTS "expected_count";
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error dropping content_sources.expected_count: %', SQLERRM;
    END;

    BEGIN
        ALTER TABLE "public"."content_sources" DROP COLUMN IF EXISTS "is_rss";
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error dropping content_sources.is_rss: %', SQLERRM;
    END;

    BEGIN
        ALTER TABLE "public"."content_sources" DROP COLUMN IF EXISTS "rss_url";
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error dropping content_sources.rss_url: %', SQLERRM;
    END;

    -- Adding columns
    BEGIN
        -- Check if column already exists before adding
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'content_sources' 
            AND column_name = 'item_count'
        ) THEN
            ALTER TABLE "public"."content_sources" ADD COLUMN "item_count" integer;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error adding content_sources.item_count: %', SQLERRM;
    END;

    BEGIN
        -- Check if column already exists before adding
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'content_sources' 
            AND column_name = 'parser_type'
        ) THEN
            ALTER TABLE "public"."content_sources" ADD COLUMN "parser_type" text NOT NULL DEFAULT 'rss'::text;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error adding content_sources.parser_type: %', SQLERRM;
    END;

    BEGIN
        ALTER TABLE "public"."contents" DROP COLUMN IF EXISTS "content_signature";
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error dropping contents.content_signature: %', SQLERRM;
    END;

    BEGIN
        ALTER TABLE "public"."contents" DROP COLUMN IF EXISTS "is_active";
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error dropping contents.is_active: %', SQLERRM;
    END;

    BEGIN
        -- Check if column already exists before adding
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'contents' 
            AND column_name = 'guid'
        ) THEN
            ALTER TABLE "public"."contents" ADD COLUMN "guid" text;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error adding contents.guid: %', SQLERRM;
    END;

    BEGIN
        -- Check if column already exists before adding generated column
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'contents' 
            AND column_name = 'is_active'
        ) THEN
            ALTER TABLE "public"."contents" ADD COLUMN "is_active" boolean GENERATED ALWAYS AS (
                ((COALESCE(description, ''::text) <> ''::text) AND (COALESCE(summary, ''::text) <> ''::text))
            ) STORED;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error adding contents.is_active generated column: %', SQLERRM;
    END;

    -- Creating indexes
    BEGIN
        -- Check if index already exists before creating
        IF NOT EXISTS (
            SELECT 1 
            FROM pg_indexes 
            WHERE schemaname = 'public' 
            AND tablename = 'content_tags' 
            AND indexname = 'content_tags_content_id_tag_id_unique'
        ) THEN
            CREATE UNIQUE INDEX content_tags_content_id_tag_id_unique ON public.content_tags USING btree (content_id, tag_id);
        END IF;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error creating content_tags_content_id_tag_id_unique index: %', SQLERRM;
    END;

    BEGIN
        -- Check if index already exists before creating
        IF NOT EXISTS (
            SELECT 1 
            FROM pg_indexes 
            WHERE schemaname = 'public' 
            AND tablename = 'contents' 
            AND indexname = 'contents_guid_key'
        ) THEN
            CREATE UNIQUE INDEX contents_guid_key ON public.contents USING btree (guid);
        END IF;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error creating contents_guid_key index: %', SQLERRM;
    END;

    -- Adding constraints
    BEGIN
        -- First check if constraint already exists
        IF NOT EXISTS (
            SELECT 1 
            FROM pg_constraint 
            WHERE conname = 'content_sources_parser_type_check'
        ) THEN
            ALTER TABLE "public"."content_sources" ADD CONSTRAINT "content_sources_parser_type_check" 
                CHECK ((parser_type = ANY (ARRAY['rss'::text, 'atom'::text, 'rdf'::text, 'cheerio'::text, 'podcast'::text, 'youtube'::text]))) NOT VALID;
            
            -- Validate constraint separately
            ALTER TABLE "public"."content_sources" VALIDATE CONSTRAINT "content_sources_parser_type_check";
        END IF;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error adding/validating content_sources_parser_type_check constraint: %', SQLERRM;
    END;

    BEGIN
        -- Check if constraint already exists before adding
        IF NOT EXISTS (
            SELECT 1 
            FROM pg_constraint 
            WHERE conname = 'content_tags_content_id_tag_id_unique'
        ) THEN
            -- The unique constraint using an existing index might error if the index doesn't exist
            -- Try to add it safely
            ALTER TABLE "public"."content_tags" ADD CONSTRAINT "content_tags_content_id_tag_id_unique" 
                UNIQUE USING INDEX "content_tags_content_id_tag_id_unique";
        END IF;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error adding content_tags_content_id_tag_id_unique constraint: %', SQLERRM;
    END;

    BEGIN
        -- Check if constraint already exists before adding
        IF NOT EXISTS (
            SELECT 1 
            FROM pg_constraint 
            WHERE conname = 'contents_guid_key'
        ) THEN
            ALTER TABLE "public"."contents" ADD CONSTRAINT "contents_guid_key" 
                UNIQUE USING INDEX "contents_guid_key";
        END IF;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error adding contents_guid_key constraint: %', SQLERRM;
    END;

END $$;