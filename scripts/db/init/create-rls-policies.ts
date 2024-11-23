import chalk from 'chalk'
import type { Pool } from 'pg'

export async function updateRLSPolicies(pool: Pool): Promise<boolean> {
  try {
    const client = await pool.connect()
    try {
      console.log(chalk.blue('Updating RLS policies...'))

      // Clean up existing policies
      await client.query(`
          DO $$ 
          DECLARE 
            t record;
            pol record;
          BEGIN 
            FOR t IN 
              SELECT tablename 
              FROM pg_tables 
              WHERE schemaname = 'public'
            LOOP
              -- Loop through all policies on each table
              FOR pol IN
                SELECT policyname
                FROM pg_policies
                WHERE schemaname = 'public' 
                AND tablename = t.tablename
              LOOP
                EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, t.tablename);
              END LOOP;
            END LOOP;
          END $$;
        `)

      // Create new policies
      await client.query(`
          DO $$ 
          DECLARE 
            t record;
          BEGIN 
            FOR t IN 
              SELECT tablename 
              FROM pg_tables 
              WHERE schemaname = 'public'
            LOOP
              EXECUTE format('CREATE POLICY select_policy ON %I FOR SELECT USING (authorize(%L))', t.tablename, t.tablename || '.select');
              EXECUTE format('CREATE POLICY insert_policy ON %I FOR INSERT WITH CHECK (authorize(%L))', t.tablename, t.tablename || '.insert');
              EXECUTE format('CREATE POLICY update_policy ON %I FOR UPDATE USING (authorize(%L))', t.tablename, t.tablename || '.update');
              EXECUTE format('CREATE POLICY delete_policy ON %I FOR DELETE USING (authorize(%L))', t.tablename, t.tablename || '.delete');
            END LOOP;
          END $$;
        `)

      console.log(chalk.green('✓ RLS policies updated successfully'))
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
