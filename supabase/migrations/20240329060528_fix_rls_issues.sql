drop policy "Enable read access for all users" on "public"."users";
drop policy "Enable read access for all users" on "public"."roles";

-- Enable RLS on necessary tables
ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."user_followers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."roles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."news" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "storage"."buckets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;

-- Define or redefine policies for public, anon, and authenticated roles across relevant tables
CREATE POLICY "Enable read access for all users" ON "public"."categories" AS PERMISSIVE FOR SELECT TO public, anon, authenticated USING (true);
CREATE POLICY "Enable read access for all users" ON "public"."user_followers" AS PERMISSIVE FOR SELECT TO public, anon, authenticated USING (true);
CREATE POLICY "Enable read access for all users" ON "public"."users" AS PERMISSIVE FOR SELECT TO public, anon, authenticated USING (true);
CREATE POLICY "Enable read access for all users" ON "public"."roles" AS PERMISSIVE FOR SELECT TO public, anon, authenticated USING (true);
CREATE POLICY "Enable read access for all users" ON "public"."news" AS PERMISSIVE FOR SELECT TO public USING (true);

-- Service role specific policies
CREATE POLICY "enable all for service role" ON "public"."news" AS PERMISSIVE FOR ALL TO service_role;

-- Storage bucket and object policies for public and anon access
CREATE POLICY "Enable read access for all users" ON "storage"."buckets" AS PERMISSIVE FOR SELECT TO public, anon USING (true);
CREATE POLICY "Enable read access for all users" ON "storage"."objects" AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Enable select for anon on profile-public" ON "storage"."objects" AS PERMISSIVE FOR SELECT TO anon USING ((bucket_id = 'profile-public'::text));

-- Grant statements for SELECT access, ensuring they align with RLS policies and desired access levels
GRANT SELECT ON TABLE "public"."categories", "public"."embeddings", "public"."news", "public"."news_embeddings", "public"."news_tags", "public"."papers", "public"."register_interest", "public"."roles", "public"."tags", "public"."user_followers", "public"."users" TO public, anon;
