import crypto from 'crypto'
import { Router } from 'express'
import razorpay from '../payment-providers/razorpay'
import * as handle from './razorpay-webhook-handlers'
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
// import { notificationService } from '~/server/utils/notificationManager'

const router = Router()

export default defineEventHandler(async (event) => {
  const log = useServerLogger()
  const currentUser = await serverSupabaseUser(event)
  const client = await serverSupabaseServiceRole(event)
  const config = useRuntimeConfig().public
  const secret = config.razorpayWebhookSecret!

  const { event: webHookEvent, payload: eventPayload } = await readBody(event)
  const payload = { ...eventPayload, user_id: currentUser.id }
  try {
    // const shasum = crypto.createHmac('sha256', secret)
    // shasum.update(JSON.stringify(await readBody(event)))
    // const digest = shasum.digest('hex')

    const isTrue = true
    if (isTrue) {
      log.info('Webhook received', { event: webHookEvent })

      console.log('WEBHOOK EVENT', webHookEvent)

      switch (webHookEvent) {
        case 'subscription.authenticated':
          await handle.SubscriptionAuthenticated(payload, client)
          break
        case 'subscription.activated':
          await handle.SubscriptionActivated(payload, client)
          break
        case 'subscription.charged':
          await handle.SubscriptionCharged(payload, client)
          break
        case 'subscription.completed':
          await handle.SubscriptionCompleted(payload, client)
          break
        case 'subscription.updated':
          await handle.SubscriptionUpdated(payload, client)
          break
        case 'subscription.pending':
          await handle.SubscriptionPending(payload, client)
          break
        case 'subscription.halted':
          await handle.SubscriptionHalted(payload, client)
          break
        case 'subscription.cancelled':
          await handle.SubscriptionCancelled(payload, client)
          break
        case 'subscription.paused':
          await handle.SubscriptionPaused(payload, client)
          break
        case 'subscription.resumed':
          await handle.SubscriptionResumed(payload, client)
          break
        case 'payment.authorized':
          await handle.PaymentAuthorized(payload, client)
          break
        case 'payment.captured':
          await handle.PaymentCaptured(payload, client)
          break
        case 'payment.failed':
          await handle.PaymentFailed(payload, client)
          break
        case 'refund.created':
          await handle.RefundCreated(payload, client)
          break
        case 'refund.processed':
          await handle.RefundProcessed(payload, client)
          break
        case 'refund.failed':
          await handle.RefundFailed(payload, client)
          break
        case 'refund.speed_changed':
          await handle.RefundSpeedChanged(payload, client)
          break
        default:
          log.warn('Unhandled webhook event', { event })
      }

      return { status: 'ok' }
    } else {
      log.warn('Invalid webhook signature')
      return { error: 'Invalid signature' }
    }
  } catch (error) {
    log.error('Webhook processing failed', {
      error,
      domain: 'customers',
      action: 'processing',
    })

    // await notificationService.sendNotification({
    //   message: 'Critical error in webhook processing',
    //   severity: 'high',
    //   context: {
    //     error: error,
    //     event: webHookEvent,
    //     payload_id: payload.id,
    //   },
    // })

    return { error: 'Webhook processing failed' }
  }
})
