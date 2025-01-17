import { createError, useRuntimeConfig } from 'nuxt/app'
import { useSupabaseClient } from '#imports'

export default function usePlans() {
  const plans = ref([])
  const { apiURL } = useRuntimeConfig().public
  const supabase = useSupabaseClient()

  async function syncPlans() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.access_token) {
        throw new Error('No authentication session found')
      }

      const { plans: razorpayPlans, count } = await $fetch('/api/plans')

      if (count) {
        const updatedValues = await Promise.all(
          razorpayPlans.map((plan) =>
            $fetch(
              `${apiURL}/api/v1/payments/plans/?${new URLSearchParams({ external_plan_id: plan.id }).toString()}`,
              {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${session.access_token}`,
                },
                body: {
                  external_plan_id: plan.id,
                  name: plan.item.name,
                  description: plan.item.description,
                  interval: plan.interval,
                  interval_type: plan.period,
                  monthly_amount: plan.item.amount / (plan.period === 'monthly' ? 1 : 12),
                  annual_amount: plan.item.amount * (plan.period == 'monthly' ? 12 : 1),
                  currency: plan.item.currency,
                  features: plan.notes,
                  created_at: new Date(plan.created_at * 1000),
                  updated_at: plan.updated_at && new Date(plan.updated_at * 1000),
                },
              },
            ),
          ),
        )
        plans.value = updatedValues.map(({ data }) => data?.[0]?.data)
      } else {
        throw new Error(data.message)
      }
    } catch (error: any) {
      console.error('Error fetching goals:', error)
      throw error
    }
  }

  async function fetchPlans() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.access_token) {
        throw new Error('No authentication session found')
      }

      const { data, meta, success } = await $fetch(`${apiURL}/api/v1/payments/plans`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (success) {
        plans.value = data
        return
      }
      throw createError('Could not fetch plans')
    } catch (error: any) {
      console.error('Error fetching goals:', error)
      throw error
    }
  }

  async function togglePlan(planId: string, isActive: boolean) {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.access_token) {
        throw new Error('No authentication session found')
      }

      const { success } = await $fetch(`${apiURL}/api/v1/payments/plans/${planId}`, {
        method: 'PUT',
        body: {
          is_active: !isActive,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (success) {
        const plan = plans.value.find((plan) => plan.id === planId)

        plan.is_active = !isActive
      }
    } catch (error: any) {
      console.error('Error fetching goals:', error)
      throw error
    }
  }

  return {
    plans,
    fetchPlans,
    syncPlans,
    togglePlan,
  }
}
