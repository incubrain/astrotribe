import { Module } from '@nestjs/common';
import { RazorpayWebhookService } from './razorpay.service';

@Module({
  providers: [RazorpayWebhookService],
  exports: [RazorpayWebhookService],
})
export class WebhookModule {}