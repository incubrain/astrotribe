import chalk from 'chalk'
import type { Pool, PoolClient } from 'pg'

interface ViewInfo {
  view_name: string
  is_materialized: boolean
}

async function hasUniqueIndex(client: PoolClient, viewName: string): Promise<boolean> {
  const query = `
      SELECT COUNT(*) > 0 as has_unique_index
      FROM pg_indexes i
      JOIN pg_class c ON c.relname = i.indexname
      WHERE i.tablename = $1
      AND c.relkind = 'i'
      AND i.indexdef LIKE '%UNIQUE%'
      AND i.schemaname = 'public';
    `
  const { rows } = await client.query(query, [viewName])
  return rows[0].has_unique_index
}

async function getDatabaseViews(client: PoolClient): Promise<ViewInfo[]> {
  const query = `
      SELECT viewname AS view_name, FALSE as is_materialized
      FROM pg_views 
      WHERE schemaname = 'public'
      UNION ALL
      SELECT matviewname AS view_name, TRUE as is_materialized
      FROM pg_matviews
      WHERE schemaname = 'public'
      ORDER BY view_name;
    `
  const { rows } = await client.query(query)
  return rows
}

export async function refreshDatabaseViews(
  client: Pool,
  options: {
    concurrent?: boolean
  } = {},
): Promise<boolean> {
  const { concurrent = true } = options

  try {
    const poolClient = await client.connect()

    try {
      console.log(chalk.blue('\n🔄 Refreshing database views...'))

      const views = await getDatabaseViews(poolClient)

      for (const view of views) {
        try {
          if (view.is_materialized) {
            // Check if we can do concurrent refresh
            const canRefreshConcurrently =
              concurrent && (await hasUniqueIndex(poolClient, view.view_name))

            const refreshCmd = `REFRESH MATERIALIZED VIEW ${
              canRefreshConcurrently ? 'CONCURRENTLY' : ''
            } public.${view.view_name}`

            console.log(
              chalk.blue(
                `Refreshing materialized view: ${view.view_name}${
                  concurrent && !canRefreshConcurrently
                    ? ' (non-concurrent due to missing unique index)'
                    : ''
                }`,
              ),
            )

            await poolClient.query(refreshCmd)
          } else {
            // For regular views, we create or replace them
            const refreshCmd = `CREATE OR REPLACE VIEW public.${view.view_name} AS SELECT * FROM public.${view.view_name}`
            console.log(chalk.blue(`Refreshing view: ${view.view_name}`))
            await poolClient.query(refreshCmd)
          }

          console.log(
            chalk.green(
              `✓ Successfully refreshed ${
                view.is_materialized ? 'materialized ' : ''
              }view: ${view.view_name}`,
            ),
          )
        } catch (error: any) {
          console.error(
            chalk.red(
              `Error refreshing ${
                view.is_materialized ? 'materialized ' : ''
              }view ${view.view_name}:`,
            ),
            error,
          )
          // Continue with other views even if one fails
          continue
        }
      }

      console.log(chalk.green('✓ All views refreshed'))
      return true
    } finally {
      poolClient.release()
    }
  } catch (error: any) {
    console.error(chalk.red('Database connection error:'), error)
    return false
  }
}
