import chalk from 'chalk'
import type { Pool } from 'pg'

function getConditionsFor(
  tableName: string,
  action: 'select' | 'insert' | 'update' | 'delete',
): string {
  // Special case for role_permissions_materialized (required for authorize function)
  if (tableName === 'role_permissions_materialized') {
    if (action === 'select') {
      return 'TRUE' // Allow all authenticated users to read
    }
    return 'FALSE' // No other operations allowed
  }

  // User-specific tables that need auth.uid() check
  const userSpecificTables = [
    'bookmarks',
    'bookmark_folders',
    'comments',
    'feeds',
    'follows',
    'feedbacks',
    'votes',
    'feature_rankings',
    // 'user_profiles', add this back if we change id
    'addresses',
    'contacts',
    'user_metrics',
    'company_employees',
  ]

  if (userSpecificTables.includes(tableName)) {
    return '(auth.uid() = user_id)'
  }

  // For all other tables: read-only public access
  if (action === 'select') {
    return 'TRUE'
  }
  return 'FALSE' // No insert/update/delete by default
}

export async function updateRLSPolicies(pool: Pool): Promise<boolean> {
  try {
    const client = await pool.connect()
    try {
      console.log(chalk.blue('Updating RLS policies...'))

      // First get all public tables
      const tablesResult = await client.query(`
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
      `)

      // Drop existing policies
      for (const { tablename } of tablesResult.rows) {
        const policiesResult = await client.query(`
          SELECT policyname
          FROM pg_policies
          WHERE schemaname = 'public' 
          AND tablename = '${tablename}'
        `)

        for (const { policyname } of policiesResult.rows) {
          await client.query(`
            DROP POLICY IF EXISTS "${policyname}" ON "${tablename}"
          `)
        }
      }

      // Create new policies
      for (const { tablename } of tablesResult.rows) {
        try {
          console.log(chalk.blue(`Processing table: ${tablename}`))

          // Special handling for role_permissions_materialized table
          if (tablename === 'role_permissions_materialized') {
            await client.query(`
              ALTER TABLE public.role_permissions_materialized FORCE ROW LEVEL SECURITY;
              ALTER TABLE public.role_permissions_materialized ENABLE ROW LEVEL SECURITY;
              
              CREATE POLICY "allow_read_permissions"
              ON public.role_permissions_materialized
              FOR SELECT
              TO authenticated
              USING (true);
            `)
            continue
          }

          const selectCondition = getConditionsFor(tablename, 'select')
          const insertCondition = getConditionsFor(tablename, 'insert')
          const updateCondition = getConditionsFor(tablename, 'update')
          const deleteCondition = getConditionsFor(tablename, 'delete')

          // CREATE policies using properly escaped identifiers
          await client.query(`
            CREATE POLICY select_policy ON "${tablename}" 
            FOR SELECT 
            USING (public.authorize('${tablename}.select') AND ${selectCondition})
          `)

          await client.query(`
            CREATE POLICY insert_policy ON "${tablename}" 
            FOR INSERT 
            WITH CHECK (public.authorize('${tablename}.insert') AND ${insertCondition})
          `)

          await client.query(`
            CREATE POLICY update_policy ON "${tablename}" 
            FOR UPDATE 
            USING (public.authorize('${tablename}.update') AND ${updateCondition})
          `)

          await client.query(`
            CREATE POLICY delete_policy ON "${tablename}" 
            FOR DELETE 
            USING (public.authorize('${tablename}.delete') AND ${deleteCondition})
          `)
        } catch (error) {
          console.error(chalk.red(`Error processing table ${tablename}:`), error)
          throw error // Re-throw to stop the process
        }
      }

      console.log(chalk.green('✓ RLS policies updated successfully with conditions'))
      return true
    } finally {
      client.release()
    }
  } catch (error) {
    console.error(chalk.red('Error updating RLS policies:'), error)
    return false
  } finally {
    await pool.end()
  }
}
