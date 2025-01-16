CREATE OR REPLACE FUNCTION update_user_plan()
RETURNS TRIGGER
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the 'status' field was updated and is either 'active' or 'completed'
  IF NEW.status <> OLD.status AND (NEW.status = 'active' OR NEW.status = 'completed') THEN
    -- Update the 'plan' field in the 'user_profiles' table based on the 'plan_id' from 'customer_subscriptions'
    UPDATE user_profiles
    SET plan = LOWER((SELECT name FROM customer_subscription_plans WHERE id = NEW.plan_id))::app_plan_enum
    WHERE id = NEW.user_id;
  END IF;

  -- Return the new record (required for the trigger)
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER customer_subscription_status_update
AFTER UPDATE ON customer_subscriptions
FOR EACH ROW
WHEN (NEW.status IS DISTINCT FROM OLD.status)  -- Only trigger when 'status' changes
EXECUTE FUNCTION update_user_plan();

-- Create function to check if we're running in the trigger context
CREATE OR REPLACE FUNCTION is_subscription_trigger()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM pg_trigger
        JOIN pg_proc ON pg_trigger.tgfoid = pg_proc.oid
        WHERE tgname = 'customer_subscription_status_update'
        AND proname = 'update_user_plan'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION users_columns_updateable()
RETURNS TRIGGER AS $$
DECLARE
    current_user_role public.app_role_enum;
BEGIN
    -- Example of fetching current user's role from JWT; adjust based on your setup
    current_user_role := (auth.jwt() ->> 'user_role')::public.app_role_enum;

    RAISE LOG 'users_columns_updateable: user with role % attempted to change role or plan', current_user_role;

    -- Allow updates if they're coming from our subscription trigger
    IF TG_OP = 'UPDATE' AND is_subscription_trigger() THEN
        RETURN NEW;
    END IF;

    -- Allow admins, super_admins, or service_role to change roles and plans
    IF current_user_role IN ('admin', 'super_admin') OR (auth.jwt() ->> 'role') = 'service_role' THEN
        RETURN NEW;
    END IF;

    -- Prevent non-admin users from changing roles and plans
    IF NEW.role IS DISTINCT FROM OLD.role THEN
        RAISE EXCEPTION 'Changing "role" is not allowed.';
    END IF;
    IF NEW.plan IS DISTINCT FROM OLD.plan THEN
        RAISE EXCEPTION 'Changing "plan" is not allowed.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;