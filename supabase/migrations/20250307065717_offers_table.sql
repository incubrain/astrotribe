-- Create enum type for discount_type
CREATE TYPE discount_type AS ENUM ('percentage', 'flat');

-- Create enum type for discount_type
CREATE TYPE discount_period AS ENUM ('yearly', 'monthly', 'once');

-- Create the customer_subscription_offers table
CREATE TABLE customer_subscription_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    plan_id INT NOT NULL,
    is_active BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    discount NUMERIC,
    discount_type discount_type,
    discount_period discount_period,
    already_discounted BOOLEAN,
    expiry_date TIMESTAMPTZ,
    CONSTRAINT "fk_offers_plan_id" FOREIGN KEY ("plan_id") REFERENCES "public"."customer_subscription_plans" ("id")
);

-- Create an index on plan_id for better performance on joins
CREATE INDEX idx_customer_subscription_offers_plan_id ON customer_subscription_offers (plan_id);

ALTER TABLE "public"."customer_subscription_offers" OWNER TO "postgres";

grant delete on table "public"."customer_subscription_offers" to "authenticated";

grant insert on table "public"."customer_subscription_offers" to "authenticated";

grant references on table "public"."customer_subscription_offers" to "authenticated";

grant select on table "public"."customer_subscription_offers" to "authenticated";

grant truncate on table "public"."customer_subscription_offers" to "authenticated";

grant update on table "public"."customer_subscription_offers" to "authenticated";

grant update on table "public"."customer_subscription_offers" to "authenticator";

grant delete on table "public"."customer_subscription_offers" to "service_role";

grant insert on table "public"."customer_subscription_offers" to "service_role";

grant references on table "public"."customer_subscription_offers" to "service_role";

grant select on table "public"."customer_subscription_offers" to "service_role";

grant truncate on table "public"."customer_subscription_offers" to "service_role";

grant update on table "public"."customer_subscription_offers" to "service_role";

grant delete on table "public"."customer_subscription_offers" to "supabase_auth_admin";

grant insert on table "public"."customer_subscription_offers" to "supabase_auth_admin";

grant references on table "public"."customer_subscription_offers" to "supabase_auth_admin";

grant select on table "public"."customer_subscription_offers" to "supabase_auth_admin";

grant truncate on table "public"."customer_subscription_offers" to "supabase_auth_admin";

grant update on table "public"."customer_subscription_offers" to "supabase_auth_admin";