import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { OnModuleInit } from '@nestjs/common'
import { Server, Socket } from 'socket.io'
import { PaymentEventsService } from './payments.observable'

@WebSocketGateway({
  namespace: '/event',
  transports: ['websocket', 'polling'],
  cors: {
    origin: process.env.NUXT_PUBLIC_APP_URL,
  },
})
export class EventsGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server

  constructor(private paymentEventsService: PaymentEventsService) {}

  handleConnection(client: Socket) {
    console.log('Client connected:', client.data)
  }

  onModuleInit() {
    console.log('EventsGateway initialized')

    this.paymentEventsService.getEvents().subscribe({
      next: (event) => {
        this.server.emit('paymentEvent', event)
      },
      error: (error) => {
        console.error('Payment event error:', error)
      },
    })
  }
}
