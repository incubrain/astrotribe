ALTER TABLE public.referrals RENAME column status to referral_status;

ALTER TABLE public.customer_subscriptions ALTER COLUMN current_start DROP NOT NULL;

ALTER TABLE public.customer_subscriptions ALTER COLUMN current_end DROP NOT NULL;

ALTER TABLE public.customer_subscription_plans
ADD CONSTRAINT unique_plan_id UNIQUE (external_plan_id);

ALTER TABLE public.customer_subscriptions

ADD CONSTRAINT uq_user_id UNIQUE (user_id);

ALTER TABLE public.customer_subscriptions
ADD CONSTRAINT uq_subscription_id UNIQUE (external_subscription_id);

ALTER TABLE public.customer_payments
ADD CONSTRAINT uq_payment_id UNIQUE (external_payment_id);
