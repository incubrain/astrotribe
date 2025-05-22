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

    try {
      // First, get all active subscriptions for this user
      const activeSubscriptions = await fetchSubscriptions({
        where: {
          status: { In: ['active', 'created', 'pending', 'charged'] },
        },
      })

      let start_at = null
      let count = total_count
      let customer_notify = 1 // Default to notify customer

      // If there are active subscriptions, find the latest end date
      if (activeSubscriptions && activeSubscriptions.length > 0) {
        // Find the subscription with the latest end date
        const latestSubscription = activeSubscriptions.reduce((latest, current) => {
          const latestEnd = new Date(latest.current_end || latest.end_at)
          const currentEnd = new Date(current.current_end || current.end_at)
          return currentEnd > latestEnd ? current : latest
        })

        if (latestSubscription.current_end || latestSubscription.end_at) {
          const endDate = latestSubscription.current_end || latestSubscription.end_at
          start_at = convertToDate(endDate)
          customer_notify = 0 // Don't charge immediately since it starts later
          const now = new Date()
          const futureStart = new Date(endDate)
          const monthsFromNow = getMonthDiff(now, futureStart)

          // Reduce the count to still end after 30 years FROM NOW
          count =
            plan.interval == 'monthly'
              ? Math.max(0, 360 - monthsFromNow)
              : Math.max(0, 30 - Math.ceil(monthsFromNow / 12))
        }
      }

      const response = await $fetch(`/api/payment/subscriptions/create`, {
        method: 'POST',
        body: {
          plan_id,
          external_plan_id,
          user_id: profile.value.id,
          total_count: count,
          provider: 'razorpay',
          ...(start_at && {
            start_at,
            customer_notify, // Control when customer gets charged
          }),
        },
      })

      return response
    } catch (error: any) {
      console.error(`Error creating order`, error)
      throw error
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

  const convertToDate = (dateString: string) => {
    const isoString = dateString.replace(' ', 'T').replace('+00', 'Z')
    return Math.floor(new Date(isoString).getTime() / 1000)
  }

  const getMonthDiff = (start: Date, end: Date) => {
    const years = end.getFullYear() - start.getFullYear()
    const months = end.getMonth() - start.getMonth()
    return years * 12 + months
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
