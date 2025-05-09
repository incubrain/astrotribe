import { ref } from 'vue'
import { useRuntimeConfig } from '#app'

export const usePayments = (provider: 'razorpay' | 'stripe') => {
  const supabase = useSupabaseClient()
  const isLoading = ref(false)
  const error = ref(null)
  const config = useRuntimeConfig()
  console.log(config)
  const currentUser = useCurrentUser()
  const { profile } = storeToRefs(currentUser)

  const initializePayment = async (options: any) => {
    isLoading.value = true
    error.value = null

    try {
      if (provider === 'razorpay') {
        const razorpay = new (window as any).Razorpay({
          key: 'rzp_test_lV0OE0NDIg6Hr6',
          ...options,
        })
        razorpay.open()
      } else if (provider === 'stripe') {
        // Placeholder for Stripe implementation
        console.log('Stripe payment initialization', options)
      }
    } catch (error: any) {
      console.error(`Error initializing payment with ${provider}:`, error)
    } finally {
      isLoading.value = false
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
      const response = await $fetch(`${config.public.apiURL}/v1/payments/subscriptions/create`, {
        method: 'POST',
        body: {
          plan_id,
          external_plan_id,
          start_at: start_at && new Date(start_at).getTime() / 1000,
          user_id: profile.value.id,
          total_count,
          provider,
        },
      })

      return response
    } catch (error: any) {
      console.error(`Error creating order with ${provider}:`, error)
    } finally {
      isLoading.value = false
    }
  }

  const verifyPayment = async (paymentData: any) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch(`/api/payment/${provider}/verify-payment`, {
        method: 'POST',
        body: paymentData,
      })
      return response
    } catch (error: any) {
      console.error(`Error verifying payment with ${provider}:`, error)
    } finally {
      isLoading.value = false
    }
  }

  const fetchPlans = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch(`${config.public.apiURL}/v1/payments/plans`)

      return response
    } catch (error: any) {
      console.error(`Error verifying payment with ${provider}:`, error)
    } finally {
      isLoading.value = false
    }
  }

  const fetchSubscriptions = async (query?: Record<string, any>) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch(`${config.public.apiURL}/v1/payments/subscriptions`, {
        query: { ...(query ? query : {}), user_id: profile.value.id },
      })

      console.log('Subscriptions RESPONSE', response)

      return response
    } catch (error: any) {
      console.error(`Error verifying payment with ${provider}:`, error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    initializePayment,
    createOrder,
    verifyPayment,
    fetchPlans,
    fetchSubscriptions,
  }
}
