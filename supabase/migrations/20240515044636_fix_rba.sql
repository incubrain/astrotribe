
drop function if exists "public"."custom_access_token_hook"(event jsonb);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.set_user_plan_and_role()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.raw_app_meta_data = jsonb_set(
    jsonb_set(NEW.raw_app_meta_data, '{plan}', to_jsonb('free'::app_plan_enum), true),
    '{role}', to_jsonb('user'::app_role_enum), true
  );
  RETURN NEW;
END;
$function$
;

CREATE TRIGGER set_user_plan_and_role_trigger BEFORE INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.set_user_plan_and_role();

CREATE OR REPLACE FUNCTION public.update_user_app_metadata()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = jsonb_set(
    jsonb_set(raw_app_meta_data, '{plan}', to_jsonb(NEW.plan), true),
    '{role}', to_jsonb(NEW.role), true
  )
  WHERE id = NEW.id;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_user_metadata()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_set(
    jsonb_set(
      jsonb_set(raw_user_meta_data, '{given_name}', to_jsonb(NEW.given_name), true),
      '{surname}', to_jsonb(NEW.surname), true
    ),
    '{avatar}', to_jsonb(NEW.avatar), true
  )
  WHERE id = NEW.id;
  RETURN NEW;
END;
$function$
;

CREATE TRIGGER update_user_app_metadata_trigger AFTER UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_user_app_metadata();

CREATE TRIGGER update_user_metadata_trigger AFTER UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_user_metadata();

GRANT EXECUTE ON FUNCTION public.update_user_metadata() TO authenticator;
GRANT EXECUTE ON FUNCTION public.update_user_app_metadata() TO authenticator;

