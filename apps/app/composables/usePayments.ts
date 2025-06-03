export const usePayments = (toggleLoader: (message?: string) => void) => {
  const toast = useNotification()

  const verifyPayment = async (paymentId: string, subscriptionId: string) => {
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
      toast.error({
        summary: 'Could not activate subscription',
        message: 'Please retry or contact the administrator if the error persists',
      })
    } finally {
      toggleLoader()
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

    verifyPayment(paymentId, subscriptionId)

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
    handlePaymentSuccess,
    handlePaymentError,
  }
}
