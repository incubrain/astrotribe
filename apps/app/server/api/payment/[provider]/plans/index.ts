// import { DB } from '@gen'
import { Router } from 'express'
import razorpay from '../payment-providers/razorpay'

const router = Router()

// Fetch all plans
export default defineEventHandler(async (event) => {
  const log = useServerLogger()
  try {
    const plans = await razorpay.plans.all()

    const response = await Promise.all(
      plans.items.map((plan) =>
        DB.CustomerSubscriptionPlans.query()
          .insert({
            external_plan_id: plan.id,
            name: plan.item.name,
            description: plan.item.description,
            interval: plan.interval,
            interval_type: plan.period,
            monthly_amount: plan.item.amount,
            annual_amount: plan.item.amount,
            currency: plan.item.currency,
            features: DB.CustomerSubscriptionPlans.knex().raw('ARRAY[?]::text[]', [plan.notes]),
            is_active: plan.item.active,
            created_at: new Date(plan.item.created_at * 1000).toISOString(),
            updated_at: new Date(plan.item.updated_at * 1000).toISOString(),
          })
          .onConflict('external_plan_id')
          .merge('*'),
      ),
    )

    return response
  } catch (error) {
    log.error('Failed to fetch plans', {
      error,
      domain: 'customers',
      action: 'fetching',
      status: 'error',
      severity: 'medium',
    })
    return error
  }
})
