DROP TABLE IF EXISTS
  public.cities,
  public.countries,
  public.feature_votes,
  public.user_features
CASCADE;

CREATE TABLE public.features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'planned',
  type varchar,
  visibility boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.feature_engagements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_id uuid NOT NULL REFERENCES public.features(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  engagement_type text NOT NULL,
  feedback text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_feature_engagement UNIQUE (user_id, feature_id, engagement_type)
);

GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER, TRUNCATE
ON public.features, public.feature_engagements
TO anon, authenticated, service_role;

CREATE TRIGGER update_features_timestamp BEFORE UPDATE ON public.features FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
