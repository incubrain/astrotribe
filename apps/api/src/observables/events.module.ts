import { Module } from "@nestjs/common";
import { EventsGateway } from "./events.gateway";
import { PaymentEventsService } from "./payments.observable";

@Module({
  providers: [PaymentEventsService, EventsGateway],
  exports: [PaymentEventsService]
})
export class EventsModule {}