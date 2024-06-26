-- First need to disable trigger, then set the user as admin or super_admin

-- ALTER TABLE user_profiles DISABLE TRIGGER columns_updateable;

-- UPDATE user_profiles
-- SET role = 'super_admin'
-- WHERE id = 'e8976b16-02a9-4595-a8a9-6457548eec12';

-- ALTER TABLE user_profiles ENABLE TRIGGER columns_updateable;

-- THEN IF WE NEED TO UPDATE THE APP_METADATA ATTACHED TO AUTH.USERS

-- DO $$
-- DECLARE
--     user_profile RECORD;
-- BEGIN
--     FOR user_profile IN SELECT * FROM user_profiles
--     LOOP
--         -- Perform an update that will trigger the update_user_app_metadata function
--         UPDATE user_profiles
--         SET updated_at = CURRENT_TIMESTAMP  -- Or any other field that will trigger the function
--         WHERE id = user_profile.id;
--     END LOOP;
-- END
-- $$;
