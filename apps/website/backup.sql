INSERT INTO public.content_sources (
  id, 
  url, 
  content_type, 
  scrape_frequency, 
  created_at, 
  updated_at, 
  has_failed, 
  failed_count, 
  priority, 
  expected_count, 
  is_rss, 
  name, 
  rss_url,
  details
) VALUES 
-- Spaceflight Now
(gen_random_uuid(), 'https://spaceflightnow.com/category/news-archive/feed/', 'news', '86400', NOW(), NOW(), false, 0, 'medium', 10, true, 'Spaceflight Now', 'https://spaceflightnow.com/category/news-archive/feed/', 
  '{"id": "spaceflight-now", "refreshInterval": 86400, "maxItems": 10}'::jsonb),

-- Dark Sky
(gen_random_uuid(), 'https://darksky.org/news/feed/', 'news', '86400', NOW(), NOW(), false, 0, 'medium', 10, true, 'Dark Sky', 'https://darksky.org/news/feed/', 
  '{"id": "dark-sky", "refreshInterval": 86400, "maxItems": 10}'::jsonb),

-- Astronomy Now
(gen_random_uuid(), 'https://astronomynow.com/2024/feed/', 'news', '86400', NOW(), NOW(), false, 0, 'medium', 10, true, 'Astronomy Now', 'https://astronomynow.com/2024/feed/', 
  '{"id": "astronomy-now", "refreshInterval": 86400, "maxItems": 10}'::jsonb),

-- Space.com
(gen_random_uuid(), 'https://www.space.com/feeds/all', 'news', '3600', NOW(), NOW(), false, 0, 'high', 20, true, 'Space.com', 'https://www.space.com/feeds/all', 
  '{"id": "space-com", "refreshInterval": 3600, "maxItems": 20}'::jsonb),

-- The Planetary Society
(gen_random_uuid(), 'https://www.planetary.org/rss/articles', 'news', '86400', NOW(), NOW(), false, 0, 'medium', 10, true, 'The Planetary Society', 'https://www.planetary.org/rss/articles', 
  '{"id": "planetary-org", "refreshInterval": 86400, "maxItems": 10}'::jsonb),

-- Sky & Telescope
(gen_random_uuid(), 'https://skyandtelescope.com/astronomy-news/feed/', 'news', '86400', NOW(), NOW(), false, 0, 'medium', 10, true, 'Sky & Telescope', 'https://skyandtelescope.com/astronomy-news/feed/', 
  '{"id": "sky-and-telescope", "refreshInterval": 86400, "maxItems": 10}'::jsonb),

-- EarthSky - Space Feed
(gen_random_uuid(), 'https://earthsky.org/space/feed/', 'news', '86400', NOW(), NOW(), false, 0, 'medium', 10, true, 'EarthSky - Space', 'https://earthsky.org/space/feed/', 
  '{"id": "earth-sky", "refreshInterval": 86400, "maxItems": 10}'::jsonb),

-- EarthSky - Astronomy Essentials Feed
(gen_random_uuid(), 'https://earthsky.org/astronomy-essentials/feed/', 'news', '86400', NOW(), NOW(), false, 0, 'medium', 10, true, 'EarthSky - Astronomy Essentials', 'https://earthsky.org/astronomy-essentials/feed/', 
  '{"id": "earth-sky", "refreshInterval": 86400, "maxItems": 10}'::jsonb),

-- Space News
(gen_random_uuid(), 'https://spacenews.com/section/news-archive/feed/', 'news', '3600', NOW(), NOW(), false, 0, 'high', 20, true, 'Space News', 'https://spacenews.com/section/news-archive/feed/', 
  '{"id": "space-news", "refreshInterval": 3600, "maxItems": 20}'::jsonb),

-- NASA News
(gen_random_uuid(), 'https://www.nasa.gov/news-release/feed/', 'news', '3600', NOW(), NOW(), false, 0, 'high', 20, true, 'NASA News', 'https://www.nasa.gov/news-release/feed/', 
  '{"id": "nasa-news", "refreshInterval": 3600, "maxItems": 20}'::jsonb);