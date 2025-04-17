create table public.query_user (
  created_at timestamp with time zone not null default now(),
  query_id uuid not null,
  user_id uuid not null,
  timestamps timestamp with time zone [] not null,
  frequency bigint not null default 1::bigint,
  failure_count bigint not null default '0'::bigint,
  constraint query_user_pkey primary key (query_id, user_id),
  constraint query_user_query_id_fkey foreign KEY (query_id) references queries (id),
  constraint query_user_user_id_fkey foreign KEY (user_id) references user_profiles (id)
) TABLESPACE pg_default;

grant delete on table "public"."query_user" to "anon";

grant insert on table "public"."query_user" to "anon";

grant references on table "public"."query_user" to "anon";

grant select on table "public"."query_user" to "anon";

grant trigger on table "public"."query_user" to "anon";

grant truncate on table "public"."query_user" to "anon";

grant update on table "public"."query_user" to "anon";

grant delete on table "public"."query_user" to "authenticated";

grant insert on table "public"."query_user" to "authenticated";

grant references on table "public"."query_user" to "authenticated";

grant select on table "public"."query_user" to "authenticated";

grant trigger on table "public"."query_user" to "authenticated";

grant truncate on table "public"."query_user" to "authenticated";

grant update on table "public"."query_user" to "authenticated";

grant delete on table "public"."query_user" to "service_role";

grant insert on table "public"."query_user" to "service_role";

grant references on table "public"."query_user" to "service_role";

grant select on table "public"."query_user" to "service_role";

grant trigger on table "public"."query_user" to "service_role";

grant truncate on table "public"."query_user" to "service_role";

grant update on table "public"."query_user" to "service_role";

create or replace function update_query_user_fields()
returns trigger as $$
begin 
  update public.query_user
  set
    frequency = query_user.frequency + 1,
    failure_count = query_user.failure_count + NEW.failure_count,
    timestamps = array_append(query_user.timestamps, NEW.timestamps[1])
  where query_user.query_id = NEW.query_id and query_user.user_id = NEW.user_id;
  
  IF NOT FOUND THEN
    INSERT INTO public.query_user
    VALUES (NEW.*);
  END IF;
  
  RETURN NULL;
end;

$$ language plpgsql;
CREATE TRIGGER query_user_trigger
BEFORE INSERT ON public.query_user
FOR EACH ROW
EXECUTE FUNCTION update_query_user_fields();

alter table "public"."queries"
add column created_at timestamp with time zone not null default now();
