SELECT
  (error_logs.metadata ->> 'query_id' :: text) AS query_id,
  count(*) AS occurrence_count,
  avg(
    (
      (
        error_logs.metadata ->> 'execution_time_ms' :: text
      )
    ) :: double precision
  ) AS avg_exec_time,
  max(
    (
      (
        error_logs.metadata ->> 'execution_time_ms' :: text
      )
    ) :: double precision
  ) AS max_exec_time,
  min(error_logs.created_at) AS first_seen,
  max(error_logs.created_at) AS last_seen
FROM
  error_logs
WHERE
  (error_logs.error_type = 'SLOW_QUERY' :: error_type)
GROUP BY
  (error_logs.metadata ->> 'query_id' :: text)
HAVING
  (count(*) > 1)
ORDER BY
  (
    avg(
      (
        (
          error_logs.metadata ->> 'execution_time_ms' :: text
        )
      ) :: double precision
    )
  ) DESC;