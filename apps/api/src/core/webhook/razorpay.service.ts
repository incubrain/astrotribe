import { Injectable } from '@nestjs/common';

@Injectable()
export class RazorpayWebhookService {
  handleEvent(payload: any): void {
    switch (payload.event) {
      case 'subscription.activated':
        this.handleSubscriptionActivated(payload);
        break;
      case 'subscription.charged':
        this.handleSubscriptionCharged(payload);
        break;
      case 'payment.captured':
        this.handlePaymentCaptured(payload);
        break;
      default:
        console.warn(`Unhandled event type: ${payload.event}`);
    }
  }

  private handleSubscriptionCharged(payload: any): void {
    // Logic for subscription charged
  }

  private handlePaymentCaptured(payload: any): void {
    // Logic for payment captured
  }

  private handleSubscriptionActivated(payload: any): void {

  }
}
