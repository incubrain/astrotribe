import { notificationService } from '~/server/utils/notificationManager'

export async function SubscriptionAuthenticated(payload: any, client: any) {
  const log = useServerLogger()

  try {
    const { subscription } = payload
    const { error } = await client.from('customer_subscriptions').update({
      external_subscription_id: subscription.id,
      status: subscription.status,
      plan_id: subscription.plan_id,
      quantity: subscription.quantity,
      notes: subscription.notes,
      charge_at: new Date(subscription.charge_at * 1000),
      start_at: new Date(subscription.start_at * 1000),
      end_at: new Date(subscription.end_at * 1000),
      total_count: subscription.total_count,
      paid_count: subscription.paid_count,
      remaining_count: subscription.remaining_count,
      customer_notify: subscription.customer_notify,
      created_at: new Date(subscription.created_at * 1000),
      expire_by: subscription.expire_by ? new Date(subscription.expire_by * 1000) : null,
      short_url: subscription.short_url,
      has_scheduled_changes: subscription.has_scheduled_changes,
      change_scheduled_at: subscription.change_scheduled_at
        ? new Date(subscription.change_scheduled_at * 1000)
        : null,
      source: subscription.source,
      offer_id: subscription.offer_id,
    }).eq('external_subscription_id', subscription.id)

    if (error) console.log('WEBHOOK ERROR', error)
    log.info('Subscription authenticated', {
      subscription_id: subscription.id,
    })
  } catch (error) {
    log.error('Failed to handle subscription authenticated', {
      error,
      subscription_id: payload.subscription.id,
    })

    await notificationService.sendNotification({
      message: 'Failed to handle authenticated subscription',
      severity: 'high',
      context: {
        subscription_id: payload.subscription.id,
        error: error.message,
      },
    })
  }
}

export async function SubscriptionActivated(payload: any, client: any) {
  const log = useServerLogger()

  try {
    const { subscription } = payload
    const { error } = await client.from('customer_subscriptions')
      .update({
        status: subscription.status,
        current_start: new Date(subscription.current_start * 1000),
        current_end: new Date(subscription.current_end * 1000),
        charge_at: new Date(subscription.charge_at * 1000),
      })
      .eq('external_subscription_id', subscription.id)
    if (error) console.log('WEBHOOK ERROR', error)
log.info('Subscription activated', { subscription_id: subscription.id })
  } catch (error) {
    log.error('Failed to handle subscription activated', {
      error,
      subscription_id: payload.subscription.id,
    })
    await notificationService.sendNotification({
      message: 'Failed to handle activated subscription',
      severity: 'high',
      context: {
        subscription_id: payload.subscription.id,
        error: error.message,
      },
    })
  }
}

export async function SubscriptionCharged(payload: any, client: any) {
  const log = useServerLogger()

  try {
    const { subscription, payment, user_id } = payload
    const { error } = await client.from('customer_subscriptions')
      .update({
        status: subscription.status,
        current_start: new Date(subscription.current_start * 1000),
        current_end: new Date(subscription.current_end * 1000),
        charge_at: new Date(subscription.charge_at * 1000),
        paid_count: subscription.paid_count,
        remaining_count: subscription.remaining_count,
      })
      .eq('external_subscription_id', subscription.id)

    const { error: paymentError } = await client.from('customer_payments').insert({
      user_id,
      subscription_id: subscription.id,
      payment_id: payment.id,
      amount: payment.amount,
      status: payment.status,
      created_at: new Date(payment.created_at * 1000),
    })

    if (error || paymentError) console.log('WEBHOOK ERROR', error || paymentError)
log.info('Subscription charged', {
      subscription_id: subscription.id,
      payment_id: payment.id,
    })
  } catch (error: any) {
    log.error('Failed to handle subscription charged', {
      error,
      subscription_id: payload.subscription.id,
    })
    await notificationService.sendNotification({
      message: 'Failed to handle charged subscription',
      severity: 'high',
      context: {
        subscription_id: payload.subscription.id,
        error: error.message,
      },
    })
  }
}

export async function SubscriptionCompleted(payload: any, client: any) {
  const log = useServerLogger()

  try {
    const { subscription } = payload
    const { error } = await client.from('customer_subscriptions')
      .update({
        status: subscription.status,
        ended_at: new Date(subscription.ended_at * 1000),
        charge_at: null,
      })
      .eq('external_subscription_id', subscription.id)
    if (error) console.log('WEBHOOK ERROR', error)
log.info('Subscription completed', { subscription_id: subscription.id })
  } catch (error) {
    log.error('Failed to handle subscription completed', {
      error,
      subscription_id: payload.subscription.id,
    })
    await notificationService.sendNotification({
      message: 'Failed to handle completed subscription',
      severity: 'medium',
      context: {
        subscription_id: payload.subscription.id,
        error: error.message,
      },
    })
  }
}

export async function SubscriptionUpdated(payload: any, client: any) {
  const log = useServerLogger()

  try {
    const { subscription } = payload
    const { error } = await client.from('customer_subscriptions')
      .update({
        plan_id: subscription.plan_id,
        quantity: subscription.quantity,
        total_count: subscription.total_count,
        paid_count: subscription.paid_count,
        remaining_count: subscription.remaining_count,
        charge_at: new Date(subscription.charge_at * 1000),
        start_at: new Date(subscription.start_at * 1000),
        end_at: new Date(subscription.end_at * 1000),
        notes: subscription.notes,
      })
      .eq('external_subscription_id', subscription.id)
    if (error) console.log('WEBHOOK ERROR', error)
log.info('Subscription updated', { subscription_id: subscription.id })
  } catch (error) {
    log.error('Failed to handle subscription updated', {
      error,
      subscription_id: payload.subscription.id,
    })
    await notificationService.sendNotification({
      message: 'Failed to handle updated subscription',
      severity: 'medium',
      context: {
        subscription_id: payload.subscription.id,
        error: error.message,
      },
    })
  }
}

export async function SubscriptionPending(payload: any, client: any) {
  const log = useServerLogger()

  try {
    const { subscription } = payload
    const { error } = await client.from('customer_subscriptions')
      .update({
        status: subscription.status,
        charge_at: new Date(subscription.charge_at * 1000),
      })
      .eq('external_subscription_id', subscription.id)
    if (error) console.log('WEBHOOK ERROR', error)
log.info('Subscription pending', { subscription_id: subscription.id })
  } catch (error) {
    log.error('Failed to handle subscription pending', {
      error,
      subscription_id: payload.subscription.id,
    })
    await notificationService.sendNotification({
      message: 'Failed to handle pending subscription',
      severity: 'medium',
      context: {
        subscription_id: payload.subscription.id,
        error: error.message,
      },
    })
  }
}

export async function SubscriptionHalted(payload: any, client: any) {
  const log = useServerLogger()

  try {
    const { subscription } = payload
    const { error } = await client.from('customer_subscriptions')
      .update({
        status: subscription.status,
        charge_at: new Date(subscription.charge_at * 1000),
      })
      .eq('external_subscription_id', subscription.id)
    if (error) console.log('WEBHOOK ERROR', error)
log.info('Subscription halted', { subscription_id: subscription.id })
  } catch (error) {
    log.error('Failed to handle subscription halted', {
      error,
      subscription_id: payload.subscription.id,
    })
    await notificationService.sendNotification({
      message: 'Failed to handle halted subscription',
      severity: 'high',
      context: {
        subscription_id: payload.subscription.id,
        error: error.message,
      },
    })
  }
}

export async function SubscriptionCancelled(payload: any, client: any) {
  const log = useServerLogger()

  try {
    const { subscription } = payload
    const { error } = await client.from('customer_subscriptions')
      .update({
        status: subscription.status,
        ended_at: new Date(subscription.ended_at * 1000),
        charge_at: null,
      })
      .eq('external_subscription_id', subscription.id)
    if (error) console.log('WEBHOOK ERROR', error)
log.info('Subscription cancelled', { subscription_id: subscription.id })
  } catch (error) {
    log.error('Failed to handle subscription cancelled', {
      error,
      subscription_id: payload.subscription.id,
    })
    await notificationService.sendNotification({
      message: 'Failed to handle cancelled subscription',
      severity: 'medium',
      context: {
        subscription_id: payload.subscription.id,
        error: error.message,
      },
    })
  }
}

export async function SubscriptionPaused(payload: any, client: any) {
  const log = useServerLogger()

  try {
    const { subscription } = payload
    const { error } = await client.from('customer_subscriptions')
      .update({
        status: subscription.status,
        pause_initiated_by: subscription.pause_initiated_by,
      })
      .eq('external_subscription_id', subscription.id)
    if (error) console.log('WEBHOOK ERROR', error)
log.info('Subscription paused', { subscription_id: subscription.id })
  } catch (error) {
    log.error('Failed to handle subscription paused', {
      error,
      subscription_id: payload.subscription.id,
    })
    await notificationService.sendNotification({
      message: 'Failed to handle paused subscription',
      severity: 'medium',
      context: {
        subscription_id: payload.subscription.id,
        error: error.message,
      },
    })
  }
}

export async function SubscriptionResumed(payload: any, client: any) {
  const log = useServerLogger()

  try {
    const { subscription } = payload
    const { error } = await client.from('customer_subscriptions')
      .update({
        status: subscription.status,
        pause_initiated_by: null,
      })
      .eq('external_subscription_id', subscription.id)
    if (error) console.log('WEBHOOK ERROR', error)
log.info('Subscription resumed', { subscription_id: subscription.id })
  } catch (error) {
    log.error('Failed to handle subscription resumed', {
      error,
      subscription_id: payload.subscription.id,
    })
    await notificationService.sendNotification({
      message: 'Failed to handle resumed subscription',
      severity: 'medium',
      context: {
        subscription_id: payload.subscription.id,
        error: error.message,
      },
    })
  }
}

export async function PaymentAuthorized(payload: any, client: any) {
  const log = useServerLogger()

  try {
    const { payment, user_id } = payload
    const { error } = await client.from('customer_payments').insert({
      user_id,
      external_payment_id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      order_id: payment.order_id,
      invoice_id: payment.invoice_id,
      international: payment.international,
      method: payment.method,
      amount_refunded: payment.amount_refunded,
      refund_status: payment.refund_status,
      captured: payment.captured,
      description: payment.description,
      card_id: payment.card_id,
      bank: payment.bank,
      wallet: payment.wallet,
      vpa: payment.vpa,
      email: payment.email,
      contact: payment.contact,
      notes: payment.notes,
      fee: payment.fee,
      tax: payment.tax,
      error_code: payment.error_code,
      error_description: payment.error_description,
      error_source: payment.error_source,
      error_step: payment.error_step,
      error_reason: payment.error_reason,
      acquirer_data: payment.acquirer_data,
      created_at: new Date(payment.created_at * 1000),
    })
    if (error) console.log('WEBHOOK ERROR', error)
    log.info('Payment authorized', { payment_id: payment.id })
  } catch (error) {
    log.error('Failed to handle payment authorized', {
      error,
      payment_id: payload.payment.id,
    })
    await notificationService.sendNotification({
      message: 'Failed to handle authorized payment',
      severity: 'high',
      context: { payment_id: payload.payment.id, error: error.message },
    })
  }
}

export async function PaymentCaptured(payload: any, client: any) {
  const log = useServerLogger()

  try {
    const { payment } = payload
    const { error } = await client.from('customer_payments')
      .update({
        status: payment.status,
        amount_refunded: payment.amount_refunded,
        refund_status: payment.refund_status,
        captured: payment.captured,
        fee: payment.fee,
        tax: payment.tax,
        error_code: payment.error_code,
        error_description: payment.error_description,
        error_source: payment.error_source,
        error_step: payment.error_step,
        error_reason: payment.error_reason,
        acquirer_data: payment.acquirer_data,
      })
      .eq('external_payment_id', payment.id)
    if (error) console.log('WEBHOOK ERROR', error)
log.info('Payment captured', { payment_id: payment.id })
  } catch (error) {
    log.error('Failed to handle payment captured', {
      error,
      payment_id: payload.payment.id,
    })
    await notificationService.sendNotification({
      message: 'Failed to handle captured payment',
      severity: 'high',
      context: { payment_id: payload.payment.id, error: error.message },
    })
  }
}

export async function PaymentFailed(payload: any, client: any) {
  const log = useServerLogger()

  try {
    const { payment } = payload
    const { error } = await client.from('customer_payments')
      .update({
        status: payment.status,
        error_code: payment.error_code,
        error_description: payment.error_description,
        error_source: payment.error_source,
        error_step: payment.error_step,
        error_reason: payment.error_reason,
      })
      .eq('external_payment_id', payment.id)
    if (error) console.log('WEBHOOK ERROR', error)
log.info('Payment failed', { payment_id: payment.id })
  } catch (error) {
    log.error('Failed to handle payment failure', {
      error,
      payment_id: payload.payment.id,
    })
    await notificationService.sendNotification({
      message: 'Failed to handle payment failure',
      severity: 'high',
      context: { payment_id: payload.payment.id, error: error.message },
    })
  }
}

export async function RefundCreated(payload: any, client: any) {
  const log = useServerLogger()

  try {
    const { refund } = payload
    const { error } = await client.from('customer_refunds').insert({
      external_refund_id: refund.id,
      payment_id: refund.payment_id,
      amount: refund.amount,
      notes: refund.notes,
      receipt: refund.receipt,
      acquirer_data: refund.acquirer_data,
      created_at: new Date(refund.created_at * 1000),
      batch_id: refund.batch_id,
      status: refund.status,
      speed_processed: refund.speed_processed,
      speed_requested: refund.speed_requested,
    })
    if (error) console.log('WEBHOOK ERROR', error)
    log.info('Refund created', { refund_id: refund.id })
  } catch (error) {
    log.error('Failed to handle refund created', {
      error,
      refund_id: payload.refund.id,
    })
    await notificationService.sendNotification({
      message: 'Failed to handle created refund',
      severity: 'high',
      context: { refund_id: payload.refund.id, error: error.message },
    })
  }
}

export async function RefundProcessed(payload: any, client: any) {
  const log = useServerLogger()

  try {
    const { refund } = payload
    const { error } = await client.from('customer_refunds')
      .update({
        status: refund.status,
        speed_processed: refund.speed_processed,
        batch_id: refund.batch_id,
        acquirer_data: refund.acquirer_data,
      })
      .eq('external_refund_id', refund.id)
    if (error) console.log('WEBHOOK ERROR', error)
    log.info('Refund processed', { refund_id: refund.id })

    // Update the corresponding payment
    const { error: paymentError } = await client.from('customer_payments')
      .update({
        amount_refunded: DB.raw('amount_refunded + ?', [refund.amount]),
        refund_status: 'partial', // or 'full' if the entire amount is refunded
      })
      .eq('external_payment_id', refund.payment_id)
  } catch (error) {
    log.error('Failed to handle refund processed', {
      error,
      refund_id: payload.refund.id,
    })
    await notificationService.sendNotification({
      message: 'Failed to handle processed refund',
      severity: 'high',
      context: { refund_id: payload.refund.id, error: error.message },
    })
  }
}

export async function RefundFailed(payload: any, client: any) {
  const log = useServerLogger()

  try {
    const { refund } = payload
    const { error } = await client.from('customer_refunds')
      .update({
        status: refund.status,
      })
      .eq('external_refund_id', refund.id)
    if (error) console.log('WEBHOOK ERROR', error)
    log.info('Refund failed', { refund_id: refund.id })

    // You might want to notify the customer or take other actions when a refund fails
    await notificationService.sendNotification({
      message: 'Refund failed',
      severity: 'high',
      context: { refund_id: refund.id, payment_id: refund.payment_id },
    })
  } catch (error) {
    log.error('Failed to handle refund failure', {
      error,
      refund_id: payload.refund.id,
    })
    await notificationService.sendNotification({
      message: 'Failed to handle failed refund',
      severity: 'high',
      context: { refund_id: payload.refund.id, error: error.message },
    })
  }
}

export async function RefundSpeedChanged(payload: any, client: any) {
  const log = useServerLogger()

  try {
    const { refund } = payload
    const { error } = await client.from('customer_refunds')
      .update({
        speed_processed: refund.speed_processed,
        speed_requested: refund.speed_requested,
      })
      .eq('external_refund_id', refund.id)
    if (error) console.log('WEBHOOK ERROR', error)
log.info('Refund speed changed', {
      refund_id: refund.id,
      speed_processed: refund.speed_processed,
      speed_requested: refund.speed_requested,
    })
  } catch (error) {
    log.error('Failed to handle refund speed change', {
      error,
      refund_id: payload.refund.id,
    })
    await notificationService.sendNotification({
      message: 'Failed to handle refund speed change',
      severity: 'medium',
      context: { refund_id: payload.refund.id, error: error.message },
    })
  }
}
