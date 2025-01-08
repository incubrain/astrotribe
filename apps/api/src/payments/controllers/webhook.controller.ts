import { Controller, Post, Body } from '@nestjs/common';
import { PaymentModel } from '@payments/models/payment.model';
import { PaymentService } from '@payments/services/payment.service';
import { SubscriptionService } from '@payments/services/subscription.service';

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly paymentService: PaymentService,
  ) {}

  @Post('razorpay')
  handleWebhook(@Body() body: any): void {
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
  }

  private handlePaymentCaptured(payload: any): void {
    const { entity: payment } = payload.payment

    const data: PaymentModel = {
      ...payment,
      payment_providers: 1, 
      external_payment_id: payment.id,
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
