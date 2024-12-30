SELECT
  error_logs.service_name,
  error_logs.error_type,
  error_logs.severity,
  date_trunc('hour' :: text, error_logs.created_at) AS time_bucket,
  count(*) AS error_count
FROM
  error_logs
GROUP BY
  error_logs.service_name,
  error_logs.error_type,
  error_logs.severity,
  (date_trunc('hour' :: text, error_logs.created_at))
ORDER BY
  (date_trunc('hour' :: text, error_logs.created_at)) DESC;