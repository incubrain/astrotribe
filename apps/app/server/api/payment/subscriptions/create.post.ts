import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const {
    plan_id,
    external_plan_id,
    total_count,
    provider,
    quantity,
    start_at,
    expire_by,
    customer_notify = 1, // Default to immediate notification/charging
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

    const response = await $fetch(`${apiURL}/v1/payments/subscriptions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: {
        external_plan_id,
        plan_id,
        total_count,
        quantity,
        start_at,
        expire_by,
        customer_notify, // This controls when Razorpay charges the customer
        addons,
        offer_id,
        notes,
        payment_provider_id,
      },
    })

    return response
  } catch (error: any) {
    console.error('Failed to create subscription', {
      error,
      domain: 'customers',
      action: 'creating',
      status: 'error',
      severity: 'critical',
    })
    throw error
  }
})
