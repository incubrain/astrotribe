alter table "public"."papers" add column "version" smallint;

create policy "Enable read access for all users"
on "public"."papers"
as permissive
for select
to public
using (true);


create policy "service_role_all_permissions"
on "public"."papers"
as permissive
for all
to service_role;



