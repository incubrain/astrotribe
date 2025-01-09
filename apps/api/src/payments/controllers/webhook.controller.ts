import { Controller, Headers, Post, Body, UnauthorizedException } from '@nestjs/common';
import { PaymentModel } from '@payments/models/payment.model';
import { CustomLogger } from '@core/logger/custom.logger'
import { PaymentService } from '@payments/services/payment.service';
import { SubscriptionService } from '@payments/services/subscription.service';
import crypto from 'crypto';

@Controller('webhook')
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
        case 'payment.authorized':
        case 'payment.failed':
        case 'payment.captured':
          this.handlePaymentCaptured(payload);
          break;
        default:
          console.warn(`Unhandled event type: ${event}`);
      }
    } catch (error: any) {
      this.logger.error('Unauthorized Webhook', error.stack)
      throw new UnauthorizedException('Invalid token')
    }
  }

  private handlePaymentCaptured(payload: any): void {
    const { entity: payment } = payload.payment

    const data = {
      external_payment_id: payment.id,
      user_id: "f712ebc0-46f0-493f-bc97-c8b8cc883bfe",
      subscription_id: 33,
      payment_provider_id: 1,
      external_order_id: payment.order_id,
      amount: payment.amount,
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
      captured: payment.captured,
      bank: payment.bank,
      wallet: payment.wallet,
      vpa: payment.vpa,
      error_source: payment.error_source,
      error_step: payment.error_step,
      error_reason: payment.error_reason,
    }

    this.paymentService.updatePayment(data)
  }

  private handleSubscriptionUpdate(payload: any): void {
    const { entity: subscription } = payload.subscription

    const data = {
      external_subscription_id: subscription.id,
      status: subscription.status,
      quantity: subscription.quantity,
      charge_at: new Date(subscription.charge_at * 1000),
      start_at: new Date(subscription.start_at * 1000),
      end_at: new Date(subscription.end_at * 1000),
      total_count: subscription.total_count,
      paid_count: subscription.paid_count,
      remaining_count: subscription.remaining_count,
      customer_notify: subscription.customer_notify,
      created_at: new Date(subscription.created_at * 1000),
      expire_by: subscription.expire_by
        ? new Date(subscription.expire_by * 1000)
        : null,
      short_url: subscription.short_url,
      has_scheduled_changes: subscription.has_scheduled_changes,
      change_scheduled_at: subscription.change_scheduled_at
        ? new Date(subscription.change_scheduled_at * 1000)
        : null,
      source: subscription.source,
      offer_id: subscription.offer_id,
    }

    this.subscriptionService.updateSubscription(data)
  }
}
