import { getRazorpayClient } from '../payment-providers/razorpay'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const {
    user_id,
    plan_id,
    external_plan_id,
    total_count,
    provider,
    quantity,
    start_at,
    expire_by,
    customer_notify,
    addons,
    offer_id,
    notes,
  } = await readBody(event)

  const { apiURL } = useRuntimeConfig().public
  const supabase = await serverSupabaseClient(event)

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.access_token) {
      throw new Error('No authentication session found')
    }

    const payment_provider_id = provider === 'razorpay' ? 1 : 2

    const razorpay = getRazorpayClient()

    const subscription = await razorpay.subscriptions.create({
      plan_id: external_plan_id,
      total_count,
      quantity,
      start_at,
      expire_by,
      customer_notify,
      addons,
      offer_id,
      notes: { user_id, ...notes },
    })

    const response = await $fetch(`${apiURL}/v1/payments/subscriptions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: {
        external_subscription_id: subscription.id,
        status: subscription.status,
        ...(subscription.current_start && {
          current_start: new Date(subscription.current_start * 1000).toISOString(),
        }),
        ...(subscription.current_end && {
          current_end: new Date(subscription.current_end * 1000).toISOString(),
        }),
        quantity: subscription.quantity,
        total_count: subscription.total_count,
        paid_count: subscription.paid_count,
        remaining_count: subscription.remaining_count,
        ...(subscription.charge_at && {
          charge_at: new Date(subscription.charge_at * 1000).toISOString(),
        }),
        ...(subscription.start_at && {
          start_at: new Date(subscription.start_at * 1000).toISOString(),
        }),

        ...(subscription.end_at && {
          end_at: new Date(subscription.end_at * 1000).toISOString(),
        }),
        notes: subscription.notes,
        payment_provider_id: `${payment_provider_id}`,
        plan_id: `${plan_id}`,
        user_id,
      },
    })

    if (response?.items) {
      return response.items
    } else {
      return response
    }
  } catch (error: any) {
    console.error('Failed to create subscription', {
      error,
      domain: 'customers',
      action: 'creating',
      status: 'error',
      severity: 'critical',
    })
    return error
  }
})
