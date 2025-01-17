SELECT
  pg_stat_statements.calls,
  pg_stat_statements.mean_exec_time,
  pg_stat_statements.max_exec_time,
  pg_stat_statements.rows,
  pg_stat_statements.query,
  pg_stat_statements.queryid,
  pg_stat_statements.toplevel
FROM
  pg_stat_statements
WHERE
  (
    (
      regexp_match(
        pg_stat_statements.query,
        'ERROR|FAIL|EXCEPTION' :: text
      ) IS NOT NULL
    )
    OR (
      pg_stat_statements.max_exec_time > (1000) :: double precision
    )
  );