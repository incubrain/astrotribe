import Razorpay from 'razorpay'

let razorpay: Razorpay | null = null

export function getRazorpayClient() {
  const { razorpayKey, razorpaySecret } = useRuntimeConfig()

  if (!razorpayKey || !razorpaySecret) {
    throw Error(
      'razorpayKey or razorpaySecret missing: ' + JSON.stringify({ razorpayKey, razorpaySecret }),
    )
  }

  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: razorpayKey!,
      key_secret: razorpaySecret,
    })
  }

  return razorpay
}
