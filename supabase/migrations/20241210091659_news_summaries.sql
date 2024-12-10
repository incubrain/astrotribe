-- Drop existing table and its dependencies
DROP TABLE IF EXISTS public.news_summaries CASCADE;

-- Create the table with all required columns
CREATE TABLE public.news_summaries (
  id uuid NOT NULL,
  news_id uuid NOT NULL,
  summary text,
  embedding public.vector(1536),
  complexity_level text,
  version integer NOT NULL DEFAULT 1,
  is_current boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Set the UUID default after table creation
ALTER TABLE public.news_summaries ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Create all the indexes
CREATE INDEX news_summaries_complexity_level_idx ON public.news_summaries USING btree (complexity_level);
CREATE INDEX news_summaries_is_current_idx ON public.news_summaries USING btree (is_current);
CREATE INDEX news_summaries_news_id_idx ON public.news_summaries USING btree (news_id);
CREATE UNIQUE INDEX news_summaries_pkey ON public.news_summaries USING btree (id);
CREATE UNIQUE INDEX unique_current_complexity_per_news ON public.news_summaries USING btree (news_id, complexity_level) WHERE (is_current = true);

-- Add primary key constraint
ALTER TABLE public.news_summaries ADD CONSTRAINT news_summaries_pkey PRIMARY KEY USING INDEX news_summaries_pkey;

-- Add check constraint for complexity_level
ALTER TABLE public.news_summaries ADD CONSTRAINT news_summaries_complexity_level_check 
  CHECK (complexity_level = ANY (ARRAY['beginner'::text, 'intermediate'::text, 'expert'::text])) NOT VALID;
ALTER TABLE public.news_summaries VALIDATE CONSTRAINT news_summaries_complexity_level_check;

-- Add foreign key constraint
ALTER TABLE public.news_summaries ADD CONSTRAINT news_summaries_news_fk 
  FOREIGN KEY (news_id) REFERENCES public.news(id) ON DELETE CASCADE NOT VALID;

ALTER TABLE public.news_summaries VALIDATE CONSTRAINT news_summaries_news_fk;


CREATE TRIGGER update_news_summaries_timestamp BEFORE UPDATE ON public.news_summaries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


