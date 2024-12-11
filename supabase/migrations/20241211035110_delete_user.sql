
create function delete_user(user_id uuid)
returns void
language plpgsql
security definer
as $function$
begin
delete from auth.users
where id = user_id;
end;
$function$;