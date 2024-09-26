import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'
import Pool from 'pg-pool'

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') })
const isProduction = process.env.NODE_ENV === 'production'

interface DbOptions {
  usersToUpgrade: string[]
}

// Initialize pg Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
})

console.log('envs', process.env.DATABASE_URL)

export async function dbSetup(options: DbOptions) {
  await runPostSeedSQL(options.usersToUpgrade)

  await enableRLSOnAllTables()

  // Read permissions JSON
  const permissionsJson = JSON.parse(fs.readFileSync('./scripts/role-permissions.json', 'utf-8'))

  const jsonConfig = JSON.stringify(permissionsJson).replace(/'/g, '\'\'')

  console.log('permissionsJson:', jsonConfig)

  // Update role permissions
  try {
    const client = await pool.connect()
    try {
      const result = await client.query(`SELECT update_role_permissions('${jsonConfig}'::jsonb)`)
      console.log('Role permissions updated successfully. Result:', result.rows[0])

      // Update policies
      await updatePolicies(client)
    } finally {
      client.release()
    }
  } catch (error: any) {
    console.error('Error updating role permissions:', error)
    throw error
  }
  console.log('Role permissions updated successfully.')
}

async function enableRLSOnAllTables(): Promise<void> {
  const client = await pool.connect()
  try {
    await client.query('SELECT enable_rls_on_all_tables()')
    console.log('RLS enabled on all tables successfully')
  } catch (error) {
    console.error('Error enabling RLS on tables:', error)
    throw error
  } finally {
    client.release()
  }
}

async function runPostSeedSQL(usersToUpgrade: string[]) {
  const client = await pool.connect()
  try {
    // Disable the trigger
    await client.query('ALTER TABLE user_profiles DISABLE TRIGGER columns_updateable')

    // Update the user roles
    const placeholders = usersToUpgrade.map((_, i) => `$${i + 1}`).join(',')
    await client.query(
      `UPDATE user_profiles SET role = 'super_admin' WHERE id IN (${placeholders})`,
      usersToUpgrade,
    )

    // Enable the trigger
    await client.query('ALTER TABLE user_profiles ENABLE TRIGGER columns_updateable')

    // Update app_metadata
    await client.query(`
      DO $$
      DECLARE
          user_profile RECORD;
      BEGIN
          FOR user_profile IN SELECT * FROM user_profiles
          LOOP
              UPDATE user_profiles
              SET updated_at = CURRENT_TIMESTAMP
              WHERE id = user_profile.id;
          END LOOP;
      END
      $$;
    `)

    console.log('Post-seed SQL operations completed successfully.')
  } catch (error) {
    console.error('Error running post-seed SQL operations:', error)
    throw error
  } finally {
    client.release()
  }
}

async function updatePolicies(client: any) {
  try {
    const result = await client.query(`
      DO $$ 
      DECLARE 
        t record;
      BEGIN 
        FOR t IN 
          SELECT tablename 
          FROM pg_tables 
          WHERE schemaname = 'public'
        LOOP
          EXECUTE format('DROP POLICY IF EXISTS select_policy ON %I', t.tablename);
          EXECUTE format('DROP POLICY IF EXISTS insert_policy ON %I', t.tablename);
          EXECUTE format('DROP POLICY IF EXISTS update_policy ON %I', t.tablename);
          EXECUTE format('DROP POLICY IF EXISTS delete_policy ON %I', t.tablename);
          
          EXECUTE format('CREATE POLICY select_policy ON %I FOR SELECT USING (authorize(%L))', t.tablename, t.tablename || '.select');
          EXECUTE format('CREATE POLICY insert_policy ON %I FOR INSERT WITH CHECK (authorize(%L))', t.tablename, t.tablename || '.insert');
          EXECUTE format('CREATE POLICY update_policy ON %I FOR UPDATE USING (authorize(%L))', t.tablename, t.tablename || '.update');
          EXECUTE format('CREATE POLICY delete_policy ON %I FOR DELETE USING (authorize(%L))', t.tablename, t.tablename || '.delete');
        END LOOP;
      END $$;
    `)
    console.log('Policies updated successfully.')
  } catch (error) {
    console.error('Error updating policies:', error)
    throw error
  }
}

const dbOptions: DbOptions = {
  usersToUpgrade: ['e8976b16-02a9-4595-a8a9-6457548eec12'],
}

await dbSetup(dbOptions)
