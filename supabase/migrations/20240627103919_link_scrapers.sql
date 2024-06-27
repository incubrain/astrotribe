alter table "public"."content_sources" add column "has_errors" boolean not null default false;

alter table "public"."content_sources" add column "paginated_url" text;

alter table "public"."scraper_configs" drop column "error";

alter table "public"."scraper_configs" drop column "pagination";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_latest_articles(base_urls text[], return_limit integer)
 RETURNS TABLE(id uuid, title text, url text, created_at timestamp without time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  WITH base_url_matches AS (
    SELECT
      n.id,
      n.title,
      n.url,
      n.created_at::timestamp without time zone as created_at,
      b.base_url
    FROM
      news n,
      unnest(base_urls) AS b(base_url)
    WHERE
      n.url LIKE b.base_url || '%'
  ),
  latest_articles AS (
    SELECT DISTINCT ON (n.base_url)
      n.id,
      n.title,
      n.url,
      n.created_at,
      n.base_url
    FROM
      base_url_matches n
    ORDER BY
      n.base_url, n.created_at DESC
  )
  SELECT
    n.id,
    n.title,
    n.url,
    n.created_at
  FROM
    latest_articles n
  ORDER BY
    n.created_at DESC
  LIMIT return_limit;
END;
$function$
;


