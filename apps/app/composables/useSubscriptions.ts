interface Subscription {
  id: string
  user_id: string
  plan_id: number
  payment_provider_id: number
  external_subscription_id: string
  status: string
  quantity: number
  current_start?: string
  current_end: string
  ended_at: string
  cancel_at_period_end: boolean
  total_count: number
  paid_count: number
  remaining_count: number
  auth_attempts: number
  created_at: string
  updated_at: string
  type: number
  charge_at: string
  start_at: number
  end_at: string
  customer_notify: boolean
  expire_by: string
  short_url: string
  has_scheduled_changes: boolean
  change_scheduled_at: string
  source: string
  offer_id: string
  pause_initiated_by: string
  cancel_initiated_by: string
  notes: Record<string, any>
}

export const useSubscriptions = (toggleLoader: (message?: string) => void) => {
  const subscriptions = ref<Array<Subscription>>([])
  const activeStates = ['active', 'completed', 'pending', 'charged']
  const error = ref(null)
  const toast = useNotification()

  const getSubscriptions = async (query?: Record<string, any>) => {
    error.value = null

    try {
      const response = await $fetch(`/api/payment/subscriptions`, {
        query: { ...(query ? query : {}) },
      })

      subscriptions.value = response
    } catch (error: any) {
      console.error(`Error verifying payment`, error)
    } finally {
      toggleLoader()
    }
  }

  const createSubscription = async (plan: Record<string, any>): Promise<Subscription | null> => {
    toggleLoader('Creating Subscription')
    error.value = null

    const { plan_id, external_plan_id, total_count } = plan

    try {
      // First, get all active subscriptions for this user
      const activeSubscriptions = subscriptions.value.filter((subscription) =>
        ['active', 'created', 'pending', 'charged'].includes(subscription.status),
      )

      let start_at = null
      let count = total_count
      let customer_notify = 1 // Default to notify customer
      let oldSubscriptionId = null

      // If there are active subscriptions, find the latest end date
      if (activeSubscriptions && activeSubscriptions.length > 0) {
        // Find the subscription with the latest end date
        const latestSubscription = activeSubscriptions.reduce(
          (latest: Subscription, current: Subscription) => {
            const latestEnd = new Date(latest.current_end || latest.end_at)
            const currentEnd = new Date(current.current_end || current.end_at)
            return currentEnd > latestEnd ? current : latest
          },
        )

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

        oldSubscriptionId = latestSubscription.id
      }

      const response = await $fetch(`/api/payment/subscriptions/create`, {
        method: 'POST',
        body: {
          plan_id,
          external_plan_id,
          total_count: count,
          provider: 'razorpay',
          ...(start_at && {
            start_at,
            customer_notify, // Control when customer gets charged
          }),
          ...(oldSubscriptionId && { oldSubscriptionId }),
        },
      })

      return response as Subscription
    } catch (error: any) {
      console.error(`Error creating order`, error)
      throw error
    } finally {
      toggleLoader()
    }
  }

  const updateSubscription = (subscription: Subscription) => {
    const existingIndex =
      subscriptions.value?.findIndex((item) => item.id === subscription.id) ?? -1

    if (existingIndex === -1) {
      // Add new subscription to the beginning of the array
      subscriptions.value = subscriptions.value?.length
        ? [subscription, ...subscriptions.value]
        : [subscription]
    } else {
      // Replace existing subscription
      const oldStatus = subscriptions.value[existingIndex]?.status
      subscriptions.value[existingIndex] = subscription

      if (oldStatus === subscription.status) {
        toggleLoader()
        return false
      }
    }

    // Handle different subscription statuses
    if (['active', 'resumed', 'completed'].includes(subscription.status)) {
      toast.success({
        summary: 'Congratulations',
        message: 'Your subscription is now active',
      })
      toggleLoader()
      return true
    } else if (subscription.status === 'created' && subscription.start_at) {
      const startDate = new Date(subscription.start_at)
      if (startDate > new Date()) {
        toast.info({
          summary: 'Subscription Scheduled',
          message: `Your subscription will activate on ${startDate.toDateString()}`,
        })
      }
      toggleLoader()
      return true
    }
    toggleLoader()
  }

  return {
    subscriptions,
    activeStates,
    getSubscriptions,
    createSubscription,
    updateSubscription,
  }
}

const convertToDate = (dateString: string): number => {
  const isoString = dateString.replace(' ', 'T').replace('+00', 'Z')
  return Math.floor(new Date(isoString).getTime() / 1000)
}

const getMonthDiff = (start: Date, end: Date): number => {
  const years = end.getFullYear() - start.getFullYear()
  const months = end.getMonth() - start.getMonth()
  return years * 12 + months
}
