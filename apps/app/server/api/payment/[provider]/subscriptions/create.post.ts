import razorpay from '../payment-providers/razorpay'
import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const {
    user_id,
    plan_id,
    total_count,
    quantity,
    start_at,
    expire_by,
    customer_notify,
    addons,
    offer_id,
    notes,
  } = await readBody(event)

  const client = await serverSupabaseServiceRole(event)
  const log = useServerLogger()

  try {
    const { data: plan, error } = await client
    .from('customer_subscription_plans')
    .select('*')
    .eq('external_plan_id', plan_id)

    console.log(plan)

    if (!plan || error) throw new Error('Plan not found', error)

    const subscription = await razorpay.subscriptions.create({
      plan_id,
      total_count,
      quantity,
      start_at,
      expire_by,
      customer_notify,
      addons,
      offer_id,
      notes: { user_id, notes },
    })

    const { error: SQLError } = await client.from('customer_subscriptions').insert({
      user_id,
      plan_id: plan.id,
      payment_provider_id: 1, // Assuming 1 is for Razorpay
      external_subscription_id: subscription.id,
      status: subscription.status,
      current_start:
        subscription.current_start && new Date(subscription.current_start * 1000).toISOString(),
      current_end:
        subscription.current_end && new Date(subscription.current_end * 1000).toISOString(),
      quantity: subscription.quantity,
      total_count: subscription.total_count,
      paid_count: subscription.paid_count,
      remaining_count: subscription.remaining_count,
      charge_at: subscription.charge_at && new Date(subscription.charge_at * 1000).toISOString(),
      start_at: subscription.start_at && new Date(subscription.start_at * 1000).toISOString(),
      end_at: subscription.end_at && new Date(subscription.end_at * 1000).toISOString(),
      notes: subscription.notes,
    })

    if (SQLError) console.log('SQL ERROR', SQLError)

    log.info('Subscription created', { subscription_id: subscription.id })
    return subscription
  } catch (error) {
    log.error('Failed to create subscription', {
      error,
      domain: 'customers',
      action: 'creating',
      status: 'error',
      severity: 'critical',
    })
    return error
  }
})
