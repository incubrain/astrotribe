// core/base/base.gateway.ts
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketServer,
  WebSocketGateway,
} from '@nestjs/websockets'
import { Injectable } from '@nestjs/common'
import { Server, Socket } from 'socket.io'
import { CustomLogger } from '@core/logger/custom.logger'

@Injectable()
@WebSocketGateway()
export abstract class BaseGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server
  protected readonly logger = new CustomLogger(BaseGateway.name)
  protected readonly connectedClients = new Map<string, Socket>()

  afterInit(server: Server) {
    this.logger.log('Base Gateway initialized')
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`)
    this.connectedClients.set(client.id, client)
    this.logger.log(`Client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id)
    this.logger.log(`Client disconnected: ${client.id}`)
  }

  // Optionally define common message handlers if needed
  @SubscribeMessage('ping')
  handlePing(client: Socket): string {
    return 'pong'
  }
}
