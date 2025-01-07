import Razorpay from 'razorpay'

const { razorpayTestKey, razorpayTestSecret } = useRuntimeConfig()

const razorpay = new Razorpay({
  key_id: razorpayTestKey!,
  key_secret: razorpayTestSecret,
})

export default razorpay
