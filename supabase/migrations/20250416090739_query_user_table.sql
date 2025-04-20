-- Add summary column to contents table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'contents' 
        AND column_name = 'summary'
    ) THEN
        ALTER TABLE "public"."contents" ADD COLUMN summary text;
        RAISE NOTICE 'Added summary column to contents table';
    ELSE
        RAISE NOTICE 'Summary column already exists in contents table';
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error adding summary column: %', SQLERRM;
END $$;

-- Create query_user table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'query_user'
    ) THEN
        CREATE TABLE public.query_user (
            created_at timestamp with time zone NOT NULL DEFAULT now(),
            query_id uuid NOT NULL,
            user_id uuid NOT NULL,
            timestamps timestamp with time zone[] NOT NULL,
            frequency bigint NOT NULL DEFAULT 1::bigint,
            failure_count bigint NOT NULL DEFAULT '0'::bigint,
            CONSTRAINT query_user_pkey PRIMARY KEY (query_id, user_id),
            CONSTRAINT query_user_query_id_fkey FOREIGN KEY (query_id) REFERENCES public.queries (id),
            CONSTRAINT query_user_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles (id)
        ) TABLESPACE pg_default;
        
        -- Grant permissions on query_user table
        GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."query_user" TO "anon";
        GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."query_user" TO "authenticated";
        GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."query_user" TO "service_role";
        
        RAISE NOTICE 'Created query_user table with permissions';
    ELSE
        RAISE NOTICE 'query_user table already exists';
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating query_user table: %', SQLERRM;
END $$;

-- Create or replace function and trigger only if table exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'query_user'
    ) THEN
        -- Create or replace function using a different delimiter
        EXECUTE $func$
        CREATE OR REPLACE FUNCTION public.update_query_user_fields()
        RETURNS trigger AS $function$
        BEGIN 
            UPDATE public.query_user
            SET
                frequency = query_user.frequency + 1,
                failure_count = query_user.failure_count + NEW.failure_count,
                timestamps = array_append(query_user.timestamps, NEW.timestamps[1])
            WHERE query_user.query_id = NEW.query_id AND query_user.user_id = NEW.user_id;
            
            IF NOT FOUND THEN
                INSERT INTO public.query_user
                VALUES (NEW.*);
            END IF;
            
            RETURN NULL;
        END;
        $function$ LANGUAGE plpgsql;
        $func$;
        
        -- Drop trigger if it exists to avoid conflicts
        DROP TRIGGER IF EXISTS query_user_trigger ON public.query_user;
        
        -- Create trigger
        CREATE TRIGGER query_user_trigger
        BEFORE INSERT ON public.query_user
        FOR EACH ROW
        EXECUTE FUNCTION public.update_query_user_fields();
        
        RAISE NOTICE 'Created/replaced function and trigger for query_user table';
    ELSE
        RAISE NOTICE 'Skipping function and trigger creation as query_user table does not exist';
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating function or trigger: %', SQLERRM;
END $$;

-- Add created_at column to queries table if it doesn't exist
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'queries'
    ) AND NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'queries' 
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE "public"."queries" ADD COLUMN created_at timestamp with time zone NOT NULL DEFAULT now();
        RAISE NOTICE 'Added created_at column to queries table';
    ELSE
        RAISE NOTICE 'queries table does not exist or created_at column already exists';
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error adding created_at column to queries table: %', SQLERRM;
END $$;