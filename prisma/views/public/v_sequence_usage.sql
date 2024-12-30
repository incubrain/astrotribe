SELECT
  table_sequence_usage.sequence_name,
  table_sequence_usage.current_value,
  table_sequence_usage.max_value,
  table_sequence_usage.capture_time,
  table_sequence_usage.id
FROM
  table_sequence_usage;