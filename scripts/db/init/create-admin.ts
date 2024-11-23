import type { Pool } from 'pg'
import chalk from 'chalk'

export async function setAdminUser(pool: Pool, usersToUpgrade: string[]) {
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

    console.log(chalk.green('✓ Admin users configured successfully'))
  } catch (error) {
    console.error(chalk.red('Error configuring admin users:'), error)
    throw error
  } finally {
    client.release() // Release the client back to the pool
  }
}
