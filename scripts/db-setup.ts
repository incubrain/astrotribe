async function setAdminUser() {
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
