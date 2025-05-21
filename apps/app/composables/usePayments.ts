export const usePayments = () => {
  const isLoading = ref(false)
  const error = ref(null)
  const currentUser = useCurrentUser()
  const { profile } = storeToRefs(currentUser)

  const verifyPayment = async (paymentId: string, subscriptionId: string) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch(`/api/payment/subscriptions/verify`, {
        method: 'POST',
        body: {
          paymentId,
          subscriptionId,
        },
      })

      return response
    } catch (error) {
      console.error('Could not verify payment', error)
      return { error }
    }
  }

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
          provider: 'razorpay',
        },
      })
      return response
    } catch (error: any) {
      console.error(`Error creating order`, error)
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
