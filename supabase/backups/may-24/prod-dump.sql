
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE SCHEMA IF NOT EXISTS "public";

ALTER SCHEMA "public" OWNER TO "postgres";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA "public";

CREATE OR REPLACE FUNCTION "public"."create_user_in_public"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;

ALTER FUNCTION "public"."create_user_in_public"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" bigint NOT NULL,
    "created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "title" character varying(255) NOT NULL,
    "body" character varying(255)
);

ALTER TABLE "public"."categories" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."categories_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."categories_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."categories_id_seq" OWNED BY "public"."categories"."id";

CREATE TABLE IF NOT EXISTS "public"."embeddings" (
    "id" bigint NOT NULL,
    "vector" "public"."vector"(1536),
    "type" "text" NOT NULL,
    "created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "public"."embeddings" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."embeddings_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."embeddings_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."embeddings_id_seq" OWNED BY "public"."embeddings"."id";

CREATE TABLE IF NOT EXISTS "public"."news" (
    "id" bigint NOT NULL,
    "created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(6) with time zone DEFAULT "now"() NOT NULL,
    "title" character varying(255) NOT NULL,
    "category_id" bigint DEFAULT '31'::bigint NOT NULL,
    "has_summary" boolean DEFAULT false NOT NULL,
    "description" "text",
    "published_at" timestamp with time zone,
    "author" "text",
    "featured_image" "text",
    "source" character varying NOT NULL,
    "url" "text" NOT NULL,
    "body" "text"
);

ALTER TABLE "public"."news" OWNER TO "postgres";

COMMENT ON COLUMN "public"."news"."has_summary" IS 'toggle true when we have a summary';

CREATE TABLE IF NOT EXISTS "public"."news_embeddings" (
    "id" bigint NOT NULL,
    "news_id" bigint NOT NULL,
    "embedding_id" bigint NOT NULL
);

ALTER TABLE "public"."news_embeddings" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."news_embeddings_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."news_embeddings_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."news_embeddings_id_seq" OWNED BY "public"."news_embeddings"."id";

CREATE SEQUENCE IF NOT EXISTS "public"."news_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."news_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."news_id_seq" OWNED BY "public"."news"."id";

CREATE TABLE IF NOT EXISTS "public"."news_tags" (
    "id" integer NOT NULL,
    "news_id" bigint NOT NULL,
    "tag_id" integer NOT NULL
);

ALTER TABLE "public"."news_tags" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."news_tags_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."news_tags_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."news_tags_id_seq" OWNED BY "public"."news_tags"."id";

CREATE TABLE IF NOT EXISTS "public"."register_interest" (
    "id" bigint NOT NULL,
    "created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "name" character varying(255) NOT NULL,
    "email" character varying(255) NOT NULL,
    "referral" character varying(255),
    "interest" character varying(255)
);

ALTER TABLE "public"."register_interest" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."register_interest_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."register_interest_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."register_interest_id_seq" OWNED BY "public"."register_interest"."id";

CREATE TABLE IF NOT EXISTS "public"."roles" (
    "id" bigint NOT NULL,
    "created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "name" character varying(255) NOT NULL,
    "body" character varying(255)
);

ALTER TABLE "public"."roles" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."roles_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."roles_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."roles_id_seq" OWNED BY "public"."roles"."id";

CREATE TABLE IF NOT EXISTS "public"."seo_data" (
    "id" integer NOT NULL,
    "keyword" "text" NOT NULL,
    "country" "text" NOT NULL,
    "scrape_date" timestamp(3) without time zone NOT NULL,
    "general" "jsonb" NOT NULL,
    "organic" "jsonb" NOT NULL,
    "ads" "jsonb" NOT NULL,
    "domain" "text" NOT NULL
);

ALTER TABLE "public"."seo_data" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."seo_data_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."seo_data_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."seo_data_id_seq" OWNED BY "public"."seo_data"."id";

CREATE TABLE IF NOT EXISTS "public"."statuses" (
    "id" smallint NOT NULL,
    "created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "title" character varying(255)
);

ALTER TABLE "public"."statuses" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."statuses_id_seq"
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."statuses_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."statuses_id_seq" OWNED BY "public"."statuses"."id";

CREATE TABLE IF NOT EXISTS "public"."tags" (
    "id" integer NOT NULL,
    "title" "text" NOT NULL,
    "created_at" time with time zone DEFAULT "now"(),
    "updated_at" time with time zone DEFAULT "now"(),
    "body" "text"
);

ALTER TABLE "public"."tags" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."tags_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."tags_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."tags_id_seq" OWNED BY "public"."tags"."id";

CREATE TABLE IF NOT EXISTS "public"."user_followers" (
    "id" "uuid" NOT NULL,
    "created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    "follower_id" "uuid" NOT NULL,
    "followed_id" "uuid" NOT NULL
);

ALTER TABLE "public"."user_followers" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."users" (
    "email" "text" NOT NULL,
    "given_name" "text",
    "surname" "text",
    "username" character varying,
    "dob" "date",
    "gender_id" smallint,
    "created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    "last_seen" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    "avatar" "text" DEFAULT ''::"text",
    "cover_image" "text" DEFAULT '''default.jpg''::text'::"text",
    "introduction" "text",
    "quote" "text",
    "followers_count" integer DEFAULT 0,
    "followed_count" integer DEFAULT 0,
    "role_id" bigint DEFAULT 1 NOT NULL,
    "id" "uuid" NOT NULL
);

ALTER TABLE "public"."users" OWNER TO "postgres";

ALTER TABLE ONLY "public"."categories" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."categories_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."embeddings" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."embeddings_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."news" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."news_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."news_embeddings" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."news_embeddings_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."news_tags" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."news_tags_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."register_interest" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."register_interest_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."roles" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."roles_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."seo_data" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."seo_data_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."statuses" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."statuses_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."tags" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."tags_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."embeddings"
    ADD CONSTRAINT "embeddings_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."news_embeddings"
    ADD CONSTRAINT "news_embeddings_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."news"
    ADD CONSTRAINT "news_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."news_tags"
    ADD CONSTRAINT "news_tags_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."news"
    ADD CONSTRAINT "news_url_key" UNIQUE ("url");

ALTER TABLE ONLY "public"."register_interest"
    ADD CONSTRAINT "register_interest_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."seo_data"
    ADD CONSTRAINT "seo_data_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."statuses"
    ADD CONSTRAINT "statuses_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."user_followers"
    ADD CONSTRAINT "user_followers_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

CREATE UNIQUE INDEX "categories_title_key" ON "public"."categories" USING "btree" ("title");

CREATE INDEX "idx_seodata_country" ON "public"."seo_data" USING "btree" ("country");

CREATE INDEX "idx_seodata_date" ON "public"."seo_data" USING "btree" ("scrape_date");

CREATE INDEX "idx_seodata_domain" ON "public"."seo_data" USING "btree" ("domain");

CREATE INDEX "idx_seodata_keyword" ON "public"."seo_data" USING "btree" ("keyword");

CREATE UNIQUE INDEX "roles_title_key" ON "public"."roles" USING "btree" ("name");

CREATE UNIQUE INDEX "tags_name_key" ON "public"."tags" USING "btree" ("title");

CREATE UNIQUE INDEX "users_auth_id_key" ON "public"."users" USING "btree" ("id");

ALTER TABLE ONLY "public"."news"
    ADD CONSTRAINT "news_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."news_embeddings"
    ADD CONSTRAINT "news_embeddings_embedding_id_fkey" FOREIGN KEY ("embedding_id") REFERENCES "public"."embeddings"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."news_embeddings"
    ADD CONSTRAINT "news_embeddings_news_id_fkey" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."news_tags"
    ADD CONSTRAINT "news_tags_news_id_fkey" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."news_tags"
    ADD CONSTRAINT "news_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id");

CREATE POLICY "Enable read access for all users" ON "public"."roles" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."users" FOR SELECT USING (true);

CREATE POLICY "Enable update for users based on email" ON "public"."users" FOR UPDATE USING ((("auth"."jwt"() ->> 'email'::"text") = "email")) WITH CHECK ((("auth"."jwt"() ->> 'email'::"text") = "email"));

ALTER TABLE "public"."roles" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT SELECT ON TABLE "public"."categories" TO PUBLIC;
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."categories" TO "service_role";

GRANT SELECT ON TABLE "public"."embeddings" TO PUBLIC;
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."embeddings" TO "service_role";

GRANT SELECT ON TABLE "public"."news" TO PUBLIC;
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."news" TO "service_role";

GRANT SELECT ON TABLE "public"."news_embeddings" TO PUBLIC;
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."news_embeddings" TO "service_role";

GRANT SELECT,USAGE ON SEQUENCE "public"."news_id_seq" TO "service_role";

GRANT SELECT ON TABLE "public"."news_tags" TO PUBLIC;
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."news_tags" TO "service_role";

GRANT SELECT ON TABLE "public"."register_interest" TO PUBLIC;
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."register_interest" TO "service_role";

GRANT SELECT ON TABLE "public"."roles" TO PUBLIC;
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."roles" TO "service_role";

GRANT SELECT ON TABLE "public"."seo_data" TO PUBLIC;
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."seo_data" TO "service_role";

GRANT SELECT ON TABLE "public"."statuses" TO PUBLIC;
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."statuses" TO "service_role";

GRANT SELECT ON TABLE "public"."tags" TO PUBLIC;
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."tags" TO "service_role";

GRANT SELECT ON TABLE "public"."user_followers" TO PUBLIC;
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."user_followers" TO "service_role";

GRANT SELECT ON TABLE "public"."users" TO PUBLIC;
GRANT INSERT ON TABLE "public"."users" TO "supabase_auth_admin";
GRANT UPDATE ON TABLE "public"."users" TO "authenticator";
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."users" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
