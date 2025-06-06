export interface Plan {
  id: number
  name: string
  price: string
  period: string
  description: string
  features: Record<string, any>
  isActive: boolean
  availableFrom: string | null
  razorPayConfig?: {
    isActive: boolean
    buttonLabel: string
    subscription_id?: string
    amount?: number
    subscription_status?: string
  }
  offers?: Array<Record<string, any>>
}

export const usePlans = (subscriptions: Ref<Array<any>>) => {
  const plans = ref<Array<Plan>>([])
  const activeStates = ['active', 'completed', 'pending', 'charged']
  const toast = useNotification()

  const freePlan: Plan = {
    id: 1,
    name: 'Free',
    price: '0',
    period: 'forever',
    description: 'Get started with free features',
    features: {
      values: [
        'Basic project access',
        'Community support',
        '2 team members',
        '1GB storage',
        'Basic analytics',
      ],
    },
    razorPayConfig: {
      isActive: true,
      buttonLabel: 'Current Plan',
    },
    isActive: true,
    availableFrom: null,
  }

  const getPlans = async (query?: Record<string, any>) => {
    try {
      const response = await $fetch(`/api/payment/plans`, {
        query: { ...(query ? query : {}) },
      })

      plans.value = response
    } catch (error: any) {
      console.error(`Error getting plans`, error)
      toast.error({
        summary: 'Could not get plans',
        message: 'Please retry or contact the administrator if the error persists',
      })
      throw error
    }
  }

  const getFormattedPlans = () => {
    return computed<Record<string, any>>(() => {
      const includeFreePlan =
        !subscriptions.value?.length ||
        !subscriptions.value.some((subscription) => activeStates.includes(subscription.status))

      return [...(includeFreePlan ? [freePlan] : [])]
        .concat(
          plans.value.map((item: any) => {
            let isActive = false
            let buttonLabel = `Subscribe to ${item.name} (${item.interval_type})`
            let razorPayConfig = {
              isActive,
              buttonLabel,
              subscription_id: null as string | null,
              subscription_status: null as string | null,
            }

            const subscription = subscriptions.value?.find((sub) => sub.plan_id === item.id)

            if (subscription && subscription.plan_id === item.id) {
              const period =
                item.interval_type.charAt(0).toUpperCase() + item.interval_type.slice(1)

              switch (subscription.status) {
                case 'created':
                  const start_at = new Date(subscription.start_at).getTime()
                  if (start_at > Date.now()) {
                    isActive = true
                    buttonLabel = `Scheduled to start ${new Date(start_at).toDateString()}`
                  }
                  break
                case 'active':
                case 'resumed':
                case 'authenticated':
                case 'completed':
                  isActive = true
                  buttonLabel = `Current Plan (${period})`

                  // Check if there's another subscription scheduled after this one
                  const futureSubscription = subscriptions.value?.find(
                    (sub) =>
                      sub.plan_id !== item.id &&
                      ['created', 'authenticated'].includes(sub.status) &&
                      new Date(sub.start_at) >
                        new Date(subscription.current_end || subscription.end_at),
                  )

                  const futurePlan = plans.value.find(
                    (plan: Plan) => plan.id === futureSubscription?.plan_id,
                  )

                  if (futureSubscription && futurePlan) {
                    buttonLabel += ` - Next: ${futurePlan.name}`
                  }
                  break
                case 'charged':
                  buttonLabel = `Renew Plan (${period})`
                  break
                case 'pending':
                  isActive = true
                  buttonLabel = 'Please Update Payment Method'
                  break
                default:
                  buttonLabel = `Subscribe to ${item.name} (${period})`
              }

              razorPayConfig = {
                subscription_id: subscription.external_subscription_id,
                subscription_status: subscription.status,
                isActive,
                buttonLabel,
              }
            }

            return {
              ...item,
              availableFrom: item.created_at,
              isActive: item.is_active,
              period: item.interval_type,
              price:
                item.interval_type === 'monthly'
                  ? item.monthly_amount / 100
                  : item.annual_amount / 100,
              razorPayConfig,
            }
          }),
        )
        .reduce((acc: Record<string, any>, plan: Plan) => {
          if (!acc[plan.name]) {
            acc[plan.name] = []
          }
          acc[plan.name].push(plan)
          return acc
        }, {})
    })
  }

  const getDiscountedPrice = (plan: Plan) => {
    const offer = plan.offers?.[0]

    if (offer && offer.already_discounted) {
      let oldPrice
      if (offer.discount_type == 'percentage') {
        oldPrice = parseFloat(plan.price) / (1 - offer.discount.d[0] / 100)
      } else {
        oldPrice = parseFloat(plan.price) + offer.discount.d[0]
      }
      return { oldPrice, newPrice: plan.price }
    }
  }

  return {
    plans,
    getPlans,
    getDiscountedPrice,
    getFormattedPlans,
  }
}
