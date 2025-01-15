import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { OnModuleInit } from '@nestjs/common'
import { Server } from 'socket.io'
import { PaymentEventsService } from './payments.observable'

@WebSocketGateway({
  path: '/event',
  transports: ['websocket', 'polling'],
  cors: {
    origin: process.env.NUXT_PUBLIC_APP_URL,
  },
})
export class EventsGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server

  constructor(private paymentEventsService: PaymentEventsService) {}

  onModuleInit() {
    this.paymentEventsService.getEvents().subscribe((event) => {
      this.server.emit('paymentEvent', event)
    })
  }
}
