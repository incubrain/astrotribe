SELECT
  error_frequency.service_name,
  error_frequency.error_type,
  error_frequency.severity,
  error_frequency.time_bucket,
  error_frequency.error_count
FROM
  error_frequency;