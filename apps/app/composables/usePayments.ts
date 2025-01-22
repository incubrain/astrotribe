import { ref } from 'vue'
import { useRuntimeConfig } from '#app'

export const usePayments = (provider: 'razorpay' | 'stripe') => {
  const supabase = useSupabaseClient()
  const isLoading = ref(false)
  const error = ref(null)
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

  const createOrder = async (plan_id: string, external_plan_id: string) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch(`/api/payment/${provider}/subscriptions/create`, {
        method: 'POST',
        body: { plan_id, external_plan_id, user_id: profile.value.id, total_count: 1, provider },
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
      const response = await $fetch(`/api/payment/${provider}/plans`)

      return response
    } catch (error: any) {
      console.error(`Error verifying payment with ${provider}:`, error)
    } finally {
      isLoading.value = false
    }
  }

  const fetchSubscriptions = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch(`/api/payment/${provider}/subscriptions`, {
        query: { user_id: profile.value.id },
      })

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
