const isLoading = ref(false)
const error = ref(null)
const currentUser = useCurrentUser()
const { profile } = storeToRefs(currentUser)

export const usePayments = () => {
  const createOrder = async (plan: Record<string, any>) => {
    isLoading.value = true
    error.value = null

    const { plan_id, external_plan_id, total_count } = plan

    const oldSubscription = await fetchSubscriptions({
      where: {
        plan_id: { not: plan_id },
        name: plan.name,
        status: { In: ['cancelled', 'completed', 'expired'] },
      },
    })

    const start_at = oldSubscription?.[0]?.current_end

    try {
      const response = await $fetch(`/api/payment/subscriptions/create`, {
        method: 'POST',
        body: {
          plan_id,
          external_plan_id,
          ...(start_at && {
            start_at: new Date(start_at * 1000).toISOString(),
          }),
          user_id: profile.value.id,
          total_count,
        },
      })

      return response
    } catch (error: any) {
      console.error(`Error creating order`, error)
    } finally {
      isLoading.value = false
    }
  }

  const verifyPayment = async (paymentData: any) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch(`/api/payment/verify-payment`, {
        method: 'POST',
        body: paymentData,
      })
      return response
    } catch (error: any) {
      console.error(`Error verifying payment`, error)
    } finally {
      isLoading.value = false
    }
  }

  const fetchPlans = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch(`/api/payment/plans`)

      return response
    } catch (error: any) {
      console.error(`Error verifying payment`, error)
    } finally {
      isLoading.value = false
    }
  }

  const fetchSubscriptions = async (query?: Record<string, any>) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch(`/api/payment/subscriptions`, {
        query: { ...(query ? query : {}), user_id: profile.value.id },
      })

      console.log('Subscriptions RESPONSE', response)

      return response
    } catch (error: any) {
      console.error(`Error verifying payment`, error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    createOrder,
    verifyPayment,
    fetchPlans,
    fetchSubscriptions,
  }
}
