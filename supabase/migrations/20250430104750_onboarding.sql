DROP TABLE IF EXISTS
  public.cities,
  public.countries,
  public.feature_votes,
  public.addresses,
  public.user_features
CASCADE;

CREATE TABLE if not exists public.features (
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

CREATE TABLE if not exists public.feature_engagements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_id uuid NOT NULL REFERENCES public.features(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  engagement_type text NOT NULL,
  feedback text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_feature_engagement UNIQUE (user_id, feature_id, engagement_type)
);

CREATE TABLE if not exists public.addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  address_type TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  name TEXT,
  full_address TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  country_code TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER, TRUNCATE
ON public.features, public.feature_engagements
TO anon, authenticated, service_role;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_features_timestamp'
  ) THEN
    CREATE TRIGGER update_features_timestamp
    BEFORE UPDATE ON public.features
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END;
$$;
