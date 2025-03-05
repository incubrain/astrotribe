import { defineEventHandler } from 'h3'
import Razorpay from 'razorpay'

export default defineEventHandler(async (event) => {
  const { razorpayKey, razorpaySecret } = useRuntimeConfig()

  const razorpay = new Razorpay({
    key_id: razorpayKey!,
    key_secret: razorpaySecret,
  })

  try {
    const plans = await razorpay.plans.all()
    return { plans: plans.items, count: plans.count }
  } catch (error) {
    console.error('Error Getting Plans From Razorpay', error)
  }
})
