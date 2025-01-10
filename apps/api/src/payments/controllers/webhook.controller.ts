import { Controller, Headers, Post, Body, UnauthorizedException } from '@nestjs/common';
import { CustomLogger } from '@core/logger/custom.logger'
import { Public } from '@core/decorators/public.decorator'
import { PaymentService } from '@payments/services/payment.service';
import { SubscriptionService } from '@payments/services/subscription.service';
import crypto from 'crypto';

@Controller('webhook')
@Public()
export class WebhookController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly paymentService: PaymentService,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setDomain('webhook')
  }

  @Post('razorpay')
  handleWebhook(
    @Body() body: any,
    @Headers('x-razorpay-signature') razorpaySignature: string,
  ): void {
    try {
      const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

      const shasum = crypto.createHmac('sha256', secret);
      shasum.update(JSON.stringify(body));
      const digest = shasum.digest('hex');

      if (digest !== razorpaySignature) {
        return
      }

      const { payload, event } = body;

      switch (event) {
        case 'subscription.authenticated':
        case 'subscription.paused':
        case 'subscription.resumed':
        case 'subscription.activated':
        case 'subscription.pending':
        case 'subscription.halted':
        case 'subscription.charged':
        case 'subscription.cancelled':
        case 'subscription.completed':
        case 'subscription.updated':
          this.handleSubscriptionUpdate(payload);
          break;
        default:
          console.warn(`Unhandled event type: ${event}`);
      }
    } catch (error: any) {
      this.logger.error('Unauthorized Webhook', error.stack)
      throw new UnauthorizedException('Invalid token')
    }
  }

  private handlePaymentUpdate(payment: any): void {
    const data = {
      external_payment_id: payment.id,
      user_id: payment.user_id,
      subscription_id: payment.subscription_id,
      payment_provider_id: payment.payment_provider_id,
      external_order_id: payment.order_id,
      amount: payment.amount / 100, // Razorpay gets the value in paise
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      description: payment.description,
      fee: payment.fee,
      tax: payment.tax,
      error_code: payment.error_code,
      error_description: payment.error_description,
      acquirer_data: payment.acquirer_data,
      notes: payment.notes,
      created_at: new Date(payment.created_at * 1000),
      order_id: payment.order_id,
      invoice_id: payment.invoice_id,
      international: payment.international,
      amount_refunded: payment.amount_refunded,
      amount_transferred: payment.amount_transferred,
      refund_status: payment.refund_status,
      captured: !!payment.captured,
      bank: payment.bank,
      wallet: payment.wallet,
      vpa: payment.vpa,
      error_source: payment.error_source,
      error_step: payment.error_step,
      error_reason: payment.error_reason,
    }

    this.paymentService.updatePayment(data)
  }

  private async handleSubscriptionUpdate(payload: any): Promise<void> {
    const { entity: subscriptionPayload } = payload.subscription
    console.log(payload, 'PAYLOAD')
    console.log(subscriptionPayload, 'SUBSCRIPTION PAYLOAD')
    
    const data = {
      external_subscription_id: subscriptionPayload.id,
      status: subscriptionPayload.status,
      quantity: subscriptionPayload.quantity,
      charge_at: new Date(subscriptionPayload.charge_at * 1000),
      start_at: new Date(subscriptionPayload.start_at * 1000),
      end_at: new Date(subscriptionPayload.end_at * 1000),
      total_count: subscriptionPayload.total_count,
      paid_count: subscriptionPayload.paid_count,
      remaining_count: subscriptionPayload.remaining_count,
      customer_notify: subscriptionPayload.customer_notify,
      created_at: new Date(subscriptionPayload.created_at * 1000),
      expire_by: subscriptionPayload.expire_by
        ? new Date(subscriptionPayload.expire_by * 1000)
        : null,
      short_url: subscriptionPayload.short_url,
      has_scheduled_changes: subscriptionPayload.has_scheduled_changes,
      change_scheduled_at: subscriptionPayload.change_scheduled_at
        ? new Date(subscriptionPayload.change_scheduled_at * 1000)
        : null,
      source: subscriptionPayload.source,
      offer_id: subscriptionPayload.offer_id,
    }

    this.subscriptionService.updateSubscription(data)

    if(payload.payment) {
      const { entity: payment } = payload.payment
      
      const subscription = await this.subscriptionService.findOne({
        where: {
          external_subscription_id: subscriptionPayload.id
        }})
      
      payment.user_id = subscription.user_id
      payment.payment_provider_id = subscription.payment_provider_id
      payment.subscription_id = subscription.id
        
      this.handlePaymentUpdate(payment);
    }
  }
}
