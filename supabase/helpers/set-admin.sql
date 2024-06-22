-- First need to disable trigger, then set the user as admin or super_admin

-- ALTER TABLE user_profiles DISABLE TRIGGER columns_updateable;

-- UPDATE user_profiles
-- SET role = 'super_admin'
-- WHERE id = 'e8976b16-02a9-4595-a8a9-6457548eec12';

-- ALTER TABLE user_profiles ENABLE TRIGGER columns_updateable;