revoke select on table "public"."register_interest" from public;

revoke select on table "public"."register_interest" from anon;

revoke insert on table "public"."register_interest" from service_role;

revoke select on table "public"."register_interest" from service_role;

revoke update on table "public"."register_interest" from service_role;

alter table "public"."register_interest" drop constraint "register_interest_pkey";

drop index if exists "public"."register_interest_pkey";

drop table "public"."register_interest";

alter table "public"."embeddings" enable row level security;

alter table "public"."news_embeddings" enable row level security;

alter table "public"."news_tags" enable row level security;

alter table "public"."tags" enable row level security;

drop sequence if exists "public"."register_interest_id_seq";

create policy "Enable read access for all users"
on "public"."embeddings"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."news_embeddings"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."news_tags"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."tags"
as permissive
for select
to public
using (true);



