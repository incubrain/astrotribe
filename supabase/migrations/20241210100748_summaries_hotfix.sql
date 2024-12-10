alter table "public"."news_summaries" enable row level security;

create policy "delete_policy"
on "public"."news_summaries"
as permissive
for delete
to public
using (public.authorize('news_summaries.delete'::text));


create policy "insert_policy"
on "public"."news_summaries"
as permissive
for insert
to public
with check (public.authorize('news_summaries.insert'::text));


create policy "select_policy"
on "public"."news_summaries"
as permissive
for select
to public
using (public.authorize('news_summaries.select'::text));


create policy "update_policy"
on "public"."news_summaries"
as permissive
for update
to public
using (public.authorize('news_summaries.update'::text));





