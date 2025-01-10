SELECT
  error_metrics.time_bucket,
  error_metrics.service_name,
  error_metrics.error_type,
  error_metrics.severity,
  error_metrics.error_count
FROM
  error_metrics;