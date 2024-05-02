create policy "Enable read access for all users"
on "public"."user_profiles"
as permissive
for select
to public
using (true);

drop policy "insert_policy" on "public"."feedbacks";

drop function if exists "public"."assign_default_role"();
alter table "public"."user_profiles" alter column "cover_image" set default ''::text;

create policy "insert_policy"
on "public"."feedbacks"
as permissive
for insert
to authenticated
with check (authorize('feedbacks.insert'::text));



