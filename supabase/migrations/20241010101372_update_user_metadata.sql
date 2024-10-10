CREATE TRIGGER update_user_metadata_trigger AFTER UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_user_metadata();


