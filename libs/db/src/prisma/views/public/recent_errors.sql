SELECT
  error_logs.id,
  error_logs.created_at,
  error_logs.service_name,
  error_logs.error_type,
  error_logs.severity,
  error_logs.message,
  error_logs.metadata
FROM
  error_logs
WHERE
  (
    error_logs.created_at > (NOW() - '24:00:00' :: INTERVAL)
  )
ORDER BY
  error_logs.created_at DESC;