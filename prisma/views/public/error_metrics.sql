SELECT
  date_trunc('hour' :: text, error_logs.created_at) AS time_bucket,
  error_logs.service_name,
  error_logs.error_type,
  error_logs.severity,
  count(*) AS error_count
FROM
  error_logs
GROUP BY
  (date_trunc('hour' :: text, error_logs.created_at)),
  error_logs.service_name,
  error_logs.error_type,
  error_logs.severity;