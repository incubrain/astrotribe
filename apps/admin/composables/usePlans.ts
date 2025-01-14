import { createError, useRuntimeConfig } from 'nuxt/app'

export default function usePlans() {
  const plans = ref([])
  const { apiURL } = useRuntimeConfig().public

  async function syncPlans() {
    try {
      const plans = await $fetch('/api/plans')

      console.log('Plans response', plans)
      if (plans.count) {
        await Promise.all(
          plans.map((plan) =>
            $fetch(`${apiURL}/api/v1/payments/plans`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
              body: {
                external_plan_id: plan.id,
                name: plan.name,
                description: plan.description,
                interval: plan.interval,
                interval_type: plan.interval_type,
                monthly_amount: plan.monthly_amount,
                annual_amount: plan.annual_amount,
                currency: plan.currency,
                features: plan.features,
                is_active: plan.is_active,
                created_at: plan.created_at,
                updated_at: plan.updated_at,
              },
            }),
          ),
        )
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
      await syncPlans()
      const { data, success } = await $fetch(`${apiURL}/api/v1/plans`)

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
      return await $fetch(`${apiURL}/api/v1/plans/${planId}`, {
        method: 'PUT',
        body: {
          data: {
            is_active: !isActive,
          },
        },
      })
    } catch (error: any) {
      console.error('Error fetching goals:', error)
      throw error
    }
  }

  return {
    plans,
    fetchPlans,
    togglePlan,
  }
}
