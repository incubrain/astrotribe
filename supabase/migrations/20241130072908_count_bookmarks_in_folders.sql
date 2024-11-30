alter table "public"."bookmarks" drop constraint "bookmarks_folder_id_fkey";

alter table "public"."bookmarks" add constraint "bookmarks_content_fk" FOREIGN KEY (content_id) REFERENCES public.contents(id) not valid;

alter table "public"."bookmarks" validate constraint "bookmarks_content_fk";

alter table "public"."bookmarks" add constraint "bookmarks_folder_id_fkey" FOREIGN KEY (folder_id) REFERENCES public.bookmark_folders(id) ON DELETE SET NULL not valid;

alter table "public"."bookmarks" validate constraint "bookmarks_folder_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_bookmark_counts_by_folder(user_id_param uuid)
 RETURNS TABLE(folder_id uuid, count bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    b.folder_id,
    COUNT(*)::BIGINT as count
  FROM public.bookmarks b
  INNER JOIN public.bookmark_folders f ON b.folder_id = f.id
  WHERE b.user_id = user_id_param
    AND f.user_id = user_id_param  -- Make sure folders belong to user
  GROUP BY b.folder_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_folder_deletion(p_folder_id uuid, p_user_id uuid, p_strategy text, p_default_folder_id uuid DEFAULT NULL::uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Verify ownership and not default folder
  IF NOT EXISTS (
    SELECT 1 FROM public.bookmark_folders 
    WHERE id = p_folder_id 
    AND user_id = p_user_id 
    AND is_default = false
  ) THEN
    RAISE EXCEPTION 'Folder not found or cannot be deleted';
  END IF;

  IF p_strategy = 'delete_all' THEN
    -- Delete all bookmarks in the folder first
    DELETE FROM public.bookmarks 
    WHERE folder_id = p_folder_id 
    AND user_id = p_user_id;
  ELSIF p_strategy = 'move_to_default' THEN
    -- Move bookmarks to default folder
    IF p_default_folder_id IS NULL THEN
      RAISE EXCEPTION 'Default folder ID is required for move strategy';
    END IF;
    
    UPDATE public.bookmarks 
    SET folder_id = p_default_folder_id
    WHERE folder_id = p_folder_id 
    AND user_id = p_user_id;
  ELSE
    RAISE EXCEPTION 'Invalid deletion strategy';
  END IF;

  -- Now delete the folder
  DELETE FROM public.bookmark_folders 
  WHERE id = p_folder_id 
  AND user_id = p_user_id;

  -- If no rows were deleted, the folder might have been deleted by another session
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Folder not found or already deleted';
  END IF;
END;
$function$
;
