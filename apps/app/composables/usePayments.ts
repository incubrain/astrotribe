export const usePayments = (toggleLoader: (message?: string) => void) => {
  const isLoading = ref(false)
  const error = ref(null)
  const toast = useNotification()
  const confirmingSubscription = ref(false)
  const confirmingPayment = ref(false)

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

  const handlePaymentSuccess = (response: any) => {
    // Handle successful payment
    toggleLoader('Confirming Subscription')

    if (!response || !response.razorpay_payment_id || !response.razorpay_subscription_id) {
      console.error('Something went wrong: ', response)
      toast.error({
        summary: 'Could not create subscription',
        message: 'Please contact the administrator',
      })
      toggleLoader()
      return
    }

    const { razorpay_payment_id: paymentId, razorpay_subscription_id: subscriptionId } = response
    verifyPayment(paymentId, subscriptionId).then(({ error }) => {
      if (error) {
        toggleLoader()
        toast.error({
          summary: 'Could not create subscription',
          message: 'Please contact the administrator',
        })
      }
    })

    toast.success({
      summary: 'Payment Successful',
      message: 'Your subscription is being activated',
    })
  }

  const handlePaymentError = (error: any) => {
    // Handle payment error
    console.error('Payment failed:', error)

    toast.error({
      summary: 'Payment Failure',
      message: 'Please try again or a different payment method',
    })
    toggleLoader()
  }

  return {
    confirmingSubscription,
    confirmingPayment,
    isLoading,
    error,
    handlePaymentSuccess,
    handlePaymentError,
  }
}
