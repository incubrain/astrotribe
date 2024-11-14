alter table "public"."bookmark_folders" drop constraint "valid_color";

alter table "public"."bookmark_folders" add constraint "valid_color" CHECK (((color)::text ~ '^#[0-9A-Fa-f]{6}$'::text)) not valid;

alter table "public"."bookmark_folders" validate constraint "valid_color";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_default_folder()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- If setting a new default folder, unset any existing ones for the same user
  IF NEW.is_default = true THEN
    UPDATE bookmark_folders
    SET is_default = false
    WHERE user_id = NEW.user_id 
    AND id != NEW.id 
    AND is_default = true;
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE TRIGGER ensure_single_default_folder BEFORE INSERT OR UPDATE OF is_default ON public.bookmark_folders FOR EACH ROW WHEN ((new.is_default = true)) EXECUTE FUNCTION public.update_default_folder();
