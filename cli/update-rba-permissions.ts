// scripts/update-rba-permissions.ts
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import fs from 'fs/promises'
import Pool from 'pg-pool'
import dotenv from 'dotenv'
import chalk from 'chalk'
import inquirer from 'inquirer'
import { generatePermissions } from '../generators/generate-rba-permissions.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
  override: true,
})

async function updateDatabasePermissions(config: any) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  })

  try {
    const client = await pool.connect()
    try {
      console.log(chalk.blue('Updating role permissions in database...'))

      // Convert config to string and escape single quotes for SQL
      const jsonConfig = JSON.stringify(config).replace(/'/g, "''")

      await client.query(`SELECT update_role_permissions('${jsonConfig}'::jsonb)`)
      console.log(chalk.green('✓ Role permissions updated successfully'))

      return true
    } finally {
      client.release()
    }
  } catch (error) {
    console.error(chalk.red('Error updating role permissions:'), error)
    return false
  } finally {
    await pool.end()
  }
}

async function updateRLSPolicies() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  })

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

async function enableRLSOnAllTables(): Promise<boolean> {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  })

  try {
    const client = await pool.connect()
    try {
      await client.query('SELECT enable_rls_on_all_tables()')
      console.log('RLS enabled on all tables successfully')
      return true
    } catch (error) {
      console.error('Error enabling RLS on tables:', error)
      throw error
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

async function confirmAction(message: string): Promise<boolean> {
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: message,
      default: false,
    },
  ])
  return confirm
}

async function main() {
  console.log(chalk.blue('Starting RBA permissions update process...\n'))

  try {
    // Step 1: Generate new permissions file
    console.log(chalk.blue('Step 1: Generating new permissions configuration...'))
    await generatePermissions()

    // Read the generated file
    const configPath = path.join(__dirname, '../generated/role-permissions.json')
    const config = JSON.parse(await fs.readFile(configPath, 'utf-8'))

    console.log(chalk.green('✓ New permissions configuration generated\n'))

    // Step 2: Update database permissions
    console.log(chalk.blue('Step 2: Database permissions update'))
    if (await confirmAction('Would you like to update the database permissions?')) {
      const success = await updateDatabasePermissions(config)
      if (!success) {
        console.log(chalk.red('Database permissions update failed. Stopping process.'))
        process.exit(1)
      }
    } else {
      console.log(chalk.yellow('Skipping database permissions update\n'))
    }

    // Step 3: Enable RLS on all tables
    console.log(chalk.blue('Step 3: Enabling RLS on all tables'))
    if (await confirmAction('Would you like to enable RLS on all tables?')) {
      const success = await enableRLSOnAllTables()
      if (!success) {
        console.log(chalk.red('Error enabling RLS on tables. Stopping process.'))
        process.exit(1)
      }
    } else {
      console.log(chalk.yellow('Skipping RLS enablement on all tables\n'))
    }

    // Step 4: Update RLS policies
    console.log(chalk.blue('\nStep 4: RLS policies update'))
    if (await confirmAction('Would you like to update the RLS policies?')) {
      const success = await updateRLSPolicies()
      if (!success) {
        console.log(chalk.red('RLS policies update failed.'))
        process.exit(1)
      }
    } else {
      console.log(chalk.yellow('Skipping RLS policies update'))
    }

    console.log(chalk.green('\n✓ RBA permissions update process completed successfully!'))
  } catch (error) {
    console.error(chalk.red('\nError during RBA permissions update:'), error)
    process.exit(1)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { main as updateRBAPermissions }
