import Razorpay from 'razorpay'

const { razorpayKey, razorpaySecret } = useRuntimeConfig()

const razorpay = new Razorpay({
  key_id: razorpayKey!,
  key_secret: razorpaySecret,
})

export default razorpay
