ALTER TABLE public.referrals RENAME column status to referral_status;

ALTER TABLE public.customer_subscriptions ADD COLUMN temp_column text[];

UPDATE public.customer_subscriptions
SET temp_column = ARRAY(SELECT jsonb_array_elements_text(notes));

ALTER TABLE public.customer_subscriptions DROP COLUMN notes;

ALTER TABLE public.customer_subscriptions RENAME COLUMN temp_column TO notes;

ALTER TABLE public.customer_subscriptions ALTER COLUMN current_start DROP NOT NULL;

ALTER TABLE public.customer_subscriptions ALTER COLUMN current_end DROP NOT NULL;

ALTER TABLE public.customer_subscription_plans ADD COLUMN temp_column text[];

UPDATE public.customer_subscription_plans
SET temp_column = ARRAY(SELECT jsonb_array_elements_text(features));

ALTER TABLE public.customer_subscription_plans DROP COLUMN features;

ALTER TABLE public.customer_subscription_plans RENAME COLUMN temp_column TO features;

ALTER TABLE public.customer_subscription_plans
ADD CONSTRAINT unique_plan_id UNIQUE (external_plan_id);

ALTER TABLE public.customer_subscriptions
ADD CONSTRAINT uq_user_id UNIQUE (user_id);