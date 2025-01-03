import Razorpay from 'razorpay'

const { razorpayTestKey, razorpayTestSecret } = useRuntimeConfig()

console.log('CONFIG IS HERE', razorpayTestKey)

const razorpay = new Razorpay({
  key_id: razorpayTestKey!,
  key_secret: razorpayTestSecret,
})

export default razorpay
