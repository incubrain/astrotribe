# Seeder Files Breakdown Plan

## Files to Create

1. `types.ts` - Contains all TypeScript type definitions and enums
2. `helpers.ts` - Contains helper functions like randomEnum, formatTimeWithZone, etc.
3. `content_statuses.ts` - Contains content status related functions
4. `countries.ts` - Contains country seeding
5. `cities.ts` - Contains city seeding
6. `contents.ts` - Contains content seeding
7. `bookmark_folders.ts` - Contains bookmark folder seeding
8. `bookmarks.ts` - Contains bookmark seeding
9. `comments.ts` - Contains comment seeding
10. `votes.ts` - Contains vote seeding
11. `content_sources.ts` - Contains content source seeding
12. `company_employees.ts` - Contains company employee seeding
13. `contacts.ts` - Contains contact seeding
14. `addresses.ts` - Contains address seeding
15. `feedback.ts` - Contains feedback seeding
16. `follows.ts` - Contains follow seeding
17. `social_media.ts` - Contains social media seeding
18. `categories.ts` - Contains category seeding
19. `news_summaries.ts` - Contains news summary seeding
20. `news.ts` - Contains news seeding
21. `research.ts` - Contains research seeding
22. `companies.ts` - Contains company seeding
23. `newsletters.ts` - Contains newsletter seeding
24. `feed_categories.ts` - Contains feed category seeding
25. `feeds.ts` - Contains feed seeding
26. `content_categories.ts` - Contains content category seeding
27. `content_tags.ts` - Contains content tag seeding
28. `tags.ts` - Contains tag seeding
29. `news_tags.ts` - Contains news tag seeding
30. `feed_sources.ts` - Contains feed source seeding
31. `feature_requests.ts` - Contains feature request seeding
32. `feature_votes.ts` - Contains feature vote seeding
33. `content_source_visits.ts` - Contains content source visit seeding
34. `user_metrics.ts` - Contains user metric seeding
35. `error_logs.ts` - Contains error log seeding
36. `ad_packages.ts` - Contains ad package seeding
37. `ads.ts` - Contains ad seeding
38. `ad_variants.ts` - Contains ad variant seeding
39. `ad_daily_metrics.ts` - Contains ad daily metric seeding
40. `referrers.ts` - Contains referrer seeding
41. `referrals.ts` - Contains referral seeding
42. `blocked_ips.ts` - Contains blocked IP seeding
43. `referrer_blocks.ts` - Contains referrer block seeding

## Barrel File

Create `index.ts` to export all seeder functions

## Implementation Steps

1. Create all individual files
2. Move relevant code to each file
3. Update imports in each file
4. Create barrel file (index.ts)
5. Update main seeders.ts to use the new structure
6. Test each seeder individually
7. Test the entire seeding process

## Notes

- Each file should import necessary dependencies
- Each file should export its seeder function
- The barrel file should re-export all seeder functions
- Keep the existing jobs.seed.ts as is
- Ensure all type definitions are properly shared



companies:
column "website" of relation "companies" does not exist

ad_packages:
column "duration_days" of relation "ad_packages" does not exist

content_categories:
relation "content_categories" does not exist

news_tags:
relation "news_tags" does not exist

addresses:
Cannot get value from empty dataset.

news:
relation "news" does not exist

research:
relation "research" does not exist

bookmarks:
Cannot get value from empty dataset.

content_source_visits:
relation "content_source_visits" does not exist

comments:
Cannot get value from empty dataset.

votes:
Cannot get value from empty dataset.

feature_requests:
column "user_id" of relation "feature_requests" does not exist

jobs:
Not enough contents to create 100 jobs. Found: 0

feedbacks:
relation "feedbacks" does not exist

follows:
Cannot get value from empty dataset.

feeds:
Cannot get value from empty dataset.

feed_categories:
column "name" of relation "feed_categories" does not exist

feed_sources:
column "name" of relation "feed_sources" does not exist

error_logs:
null value in column "environment" of relation "error_logs" violates not-null constraint

ok here's the tables that are failing, please update the seeders with the correct data structure:

CREATE TABLE public.contents (
  id uuid NOT NULL DEFAULT undefined,
  content_type text NOT NULL,
  title text,
  created_at timestamp with time zone DEFAULT undefined,
  updated_at timestamp with time zone DEFAULT undefined,
  url text NOT NULL,
  hot_score double precision DEFAULT undefined,
  author text,
  company_id uuid,
  content_signature text,
  deleted_at timestamp with time zone,
  description text,
  details jsonb,
  featured_image text,
  hash text,
  is_active boolean DEFAULT undefined,
  published_at timestamp with time zone,
  source_id uuid
);

CREATE TABLE public.ad_packages (
  id uuid NOT NULL DEFAULT undefined,
  name character varying NOT NULL,
  position character varying NOT NULL,
  active boolean DEFAULT undefined,
  created_at timestamp with time zone DEFAULT undefined,
  updated_at timestamp with time zone DEFAULT undefined,
  description text NOT NULL,
  price numeric NOT NULL,
  features ARRAY NOT NULL,
  expected_ctr numeric,
  avg_roi numeric,
  view_frequency numeric DEFAULT undefined
);

CREATE TABLE public.content_categories (
  content_id uuid NOT NULL,
  category_id bigint NOT NULL,
  is_primary boolean NOT NULL
);

CREATE TABLE public.news_tags (
  id integer NOT NULL,
  tag_id integer NOT NULL,
  news_id uuid
);

CREATE TABLE public.addresses (
  id integer NOT NULL,
  street1 character varying NOT NULL,
  street2 character varying,
  city_id integer NOT NULL,
  country_id integer NOT NULL,
  country_id integer NOT NULL,
  country_id integer NOT NULL,
  country_id integer NOT NULL,
  name character varying,
  user_id uuid,
  is_primary boolean DEFAULT undefined,
  address_type USER-DEFINED,
  created_at timestamp with time zone DEFAULT undefined,
  updated_at timestamp with time zone DEFAULT undefined,
  company_id uuid
);

CREATE TABLE public.news (
  created_at timestamp with time zone NOT NULL DEFAULT undefined,
  updated_at timestamp with time zone NOT NULL DEFAULT undefined,
  title text,
  body text,
  category_id bigint DEFAULT undefined,
  author text,
  description text,
  featured_image text,
  has_summary boolean NOT NULL DEFAULT undefined,
  published_at timestamp with time zone,
  url text NOT NULL,
  hash bigint,
  id uuid NOT NULL,
  company_id uuid,
  failed_count smallint DEFAULT undefined,
  scrape_frequency USER-DEFINED NOT NULL DEFAULT undefined,
  scraped_at timestamp with time zone DEFAULT undefined,
  content_status USER-DEFINED NOT NULL DEFAULT undefined,
  keywords jsonb,
  content_source_id bigint
);
CREATE TABLE public.research (
  created_at timestamp with time zone NOT NULL DEFAULT undefined,
  updated_at timestamp with time zone,
  published_at timestamp with time zone,
  title text,
  version smallint,
  id uuid NOT NULL DEFAULT undefined,
  abstract text,
  keywords text,
  month character varying,
  year character varying,
  abstract_url text NOT NULL,
  category text,
  doi_url text,
  figure_count smallint,
  has_embedding boolean,
  page_count smallint,
  pdf_url text,
  published_in text,
  table_count smallint,
  comments text,
  is_flagged boolean NOT NULL DEFAULT undefined,
  authors jsonb,
  summary text,
  content_status USER-DEFINED NOT NULL DEFAULT undefined,
  affiliations jsonb
);

CREATE TABLE public.bookmarks (
  id uuid NOT NULL DEFAULT undefined,
  user_id uuid NOT NULL,
  content_id uuid NOT NULL,
  content_type character varying NOT NULL,
  created_at timestamp with time zone DEFAULT undefined,
  folder_id uuid,
  metadata jsonb,
  updated_at timestamp with time zone DEFAULT undefined
);

CREATE TABLE public.content_source_visits (
  id uuid NOT NULL DEFAULT undefined,
  content_id uuid NOT NULL,
  user_id uuid,
  created_at timestamp with time zone DEFAULT undefined
);

CREATE TABLE public.feature_requests (
  id uuid NOT NULL DEFAULT undefined,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT undefined,
  created_at timestamp with time zone DEFAULT undefined,
  updated_at timestamp with time zone DEFAULT undefined,
  downvotes integer DEFAULT undefined,
  engagement_score integer DEFAULT undefined,
  priority_score integer DEFAULT undefined,
  upvotes integer DEFAULT undefined
);

CREATE TABLE public.comments (
  id uuid NOT NULL DEFAULT undefined,
  user_id uuid NOT NULL,
  content_id uuid,
  parent_comment_id uuid,
  created_at timestamp with time zone DEFAULT undefined,
  updated_at timestamp with time zone DEFAULT undefined,
  comment_text text NOT NULL,
  deleted_at timestamp with time zone,
  is_active boolean DEFAULT undefined
);

CREATE TABLE public.votes (
  id uuid NOT NULL DEFAULT undefined,
  content_type text NOT NULL,
  content_id uuid NOT NULL,
  user_id uuid NOT NULL,
  vote_type smallint NOT NULL,
  created_at timestamp with time zone DEFAULT undefined
);

CREATE TABLE public.jobs (
  id uuid NOT NULL DEFAULT undefined,
  contents_id uuid NOT NULL,
  title text NOT NULL,
  company_id uuid,
  location text,
  description text,
  published_at timestamp with time zone,
  expires_at timestamp with time zone,
  scraped_at timestamp with time zone DEFAULT undefined,
  updated_at timestamp with time zone DEFAULT undefined,
  created_at timestamp with time zone DEFAULT undefined,
  content_status USER-DEFINED NOT NULL DEFAULT undefined,
  url text NOT NULL,
  hash bigint,
  metadata jsonb,
  employment_type text,
  content_source_id uuid
);

CREATE TABLE public.feedbacks (
  id integer NOT NULL DEFAULT undefined,
  user_id uuid,
  user_id uuid,
  user_id uuid,
  user_id uuid,
  page_identifier character varying NOT NULL,
  rating integer DEFAULT undefined,
  feedback_type USER-DEFINED,
  message text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT undefined,
  updated_at timestamp with time zone NOT NULL DEFAULT undefined,
  device_info text,
  resolution_comment text,
  feedback_status USER-DEFINED DEFAULT undefined
);

CREATE TABLE public.feed_categories (
  created_at timestamp with time zone NOT NULL DEFAULT undefined,
  feed_id uuid,
  category_id bigint,
  id uuid NOT NULL DEFAULT undefined
);

CREATE TABLE public.follows (
  id uuid NOT NULL DEFAULT undefined,
  followed_id uuid NOT NULL,
  followed_entity USER-DEFINED NOT NULL,
  created_at timestamp with time zone DEFAULT undefined,
  user_id uuid NOT NULL
);

CREATE TABLE public.feeds (
  id uuid NOT NULL DEFAULT undefined,
  created_at timestamp with time zone DEFAULT undefined,
  name text NOT NULL,
  user_id uuid NOT NULL,
  updated_at timestamp with time zone DEFAULT undefined
);

CREATE TABLE public.feed_sources (
  feed_id uuid,
  created_at timestamp with time zone DEFAULT undefined,
  content_source_id uuid DEFAULT undefined,
  id uuid NOT NULL DEFAULT undefined
);

CREATE TABLE public.error_logs (
  id uuid NOT NULL DEFAULT undefined,
  service_name character varying NOT NULL,
  error_type USER-DEFINED NOT NULL,
  severity USER-DEFINED NOT NULL,
  message text NOT NULL,
  stack_trace text,
  metadata jsonb DEFAULT undefined,
  context jsonb DEFAULT undefined,
  user_id uuid,
  request_id uuid,
  correlation_id uuid,
  environment character varying NOT NULL,
  created_at timestamp with time zone DEFAULT undefined,
  error_hash text,
  error_pattern text,
  is_new_pattern boolean DEFAULT undefined,
  github_repo text,
  related_errors jsonb,
  frequency_data jsonb,
  domain character varying
);