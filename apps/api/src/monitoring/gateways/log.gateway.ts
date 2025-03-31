// src/monitoring/gateways/log.gateway.ts

import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets'
import { UseGuards, Injectable } from '@nestjs/common'
import { Socket } from 'socket.io'
import { PermissionGuard } from '@core/guards/permission.guard'
import { CustomLogger } from '@core/logger/custom.logger'
import { BaseGateway } from '@core/base/base.gateway'
import * as crypto from 'crypto'

// Same interface as before
interface LogFilters {
  service?: string
  severity?: string
  startTime?: string
  endTime?: string
}

// @UseGuards(PermissionGuard)
@WebSocketGateway({
  path: '/log-stream',
  transports: ['websocket', 'polling'],
})
export class LogGateway extends BaseGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // We override `connectedClients` in order to store additional data
  private readonly clientMetadata = new Map<
    string,
    {
      filters?: LogFilters
      rooms: Set<string>
    }
  >()

  constructor(logger: CustomLogger) {
    super()
    // (Optional) give this gateway a domain or change the context
    this.logger.setContext('log-gateway')
    this.logger.setDomain('monitoring')

    this.server?.on('connect_error', (err) => {
      this.logger.error('Socket connection error', { error: err })
    })

    this.server?.on('connection_failed', (err) => {
      this.logger.error('Socket connection failed', { error: err })
    })
  }

  /**
   * Override handleConnection to store extended info
   */
  override async handleConnection(client: Socket) {
    // Call BaseGateway's handleConnection if you want to track
    // each raw Socket in `baseConnectedClients`
    super.handleConnection(client)

    try {
      // Add client to our tracking
      this.clientMetadata.set(client.id, {
        rooms: new Set(),
      })

      this.logger.log('Client connected to log stream', {
        clientId: client.id,
        handshake: {
          query: client.handshake.query,
          headers: client.handshake.headers,
        },
      })

      // Send initial connection success
      client.emit('connection_status', {
        status: 'connected',
        clientId: client.id,
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      this.logger.error('Error handling client connection', {
        error,
        clientId: client.id,
      })
      client.disconnect(true)
    }
  }

  /**
   * Override handleDisconnect to clean up your extended map
   */
  override async handleDisconnect(client: Socket) {
    // Also call the base method if you want the base gateway to track this
    super.handleDisconnect(client)

    try {
      // Clean up client tracking
      const clientInfo = this.clientMetadata.get(client.id)
      if (clientInfo) {
        // Leave all rooms
        clientInfo.rooms.forEach((room) => client.leave(room))
        this.clientMetadata.delete(client.id)
      }

      this.logger.log('Client disconnected from log stream', {
        clientId: client.id,
      })
    } catch (error: any) {
      this.logger.error('Error handling client disconnect', {
        error,
        clientId: client.id,
      })
    }
  }

  /**
   * Subscribe message example
   */
  @SubscribeMessage('subscribe')
  async handleSubscribe(@ConnectedSocket() client: Socket, @MessageBody() filters: LogFilters) {
    try {
      // Retrieve or initialize client info
      const clientInfo = this.clientMetadata.get(client.id) || {
        filters: undefined,
        rooms: new Set<string>(),
      }

      // Leave previous rooms
      clientInfo.rooms.forEach((room) => client.leave(room))
      clientInfo.rooms.clear()

      // Compute room name from filters
      const room = this.getFilterRoom(filters)
      await client.join(room)
      clientInfo.rooms.add(room)

      // Update client info
      clientInfo.filters = filters
      this.clientMetadata.set(client.id, clientInfo)

      this.logger.log('Client subscribed to log stream', {
        clientId: client.id,
        filters,
        room,
      })

      return {
        event: 'subscribed',
        data: {
          room,
          filters,
          timestamp: new Date().toISOString(),
        },
      }
    } catch (error: any) {
      this.logger.error('Error handling subscription', {
        error,
        clientId: client.id,
        filters,
      })
      throw error
    }
  }

  /**
   * Helper to map filters to a room name
   */
  private getFilterRoom(filters: LogFilters): string {
    const service = filters?.service || '*'
    const severity = filters?.severity || '*'
    return `logs:${service}:${severity}`
  }

  /**
   * Broadcast logs to relevant rooms
   */
  async broadcastLog(log: any) {
    try {
      console.log('broadcastLog', log)
      const roomPatterns = [
        `logs:${log.service}:${log.severity}`,
        `logs:${log.service}:*`,
        `logs:*:${log.severity}`,
        `logs:*:*`,
      ]

      // Emit to each matching room
      // Emit to each matching room
      roomPatterns.forEach((room) => {
        this.server.to(room).emit('newLog', {
          ...log,
          created_at: new Date().toISOString(),
        })
      })

      this.logger.debug('Broadcast log to rooms', {
        logId: log.id,
        service: log.service,
        severity: log.severity,
        rooms: roomPatterns,
      })
    } catch (error: any) {
      this.logger.error('Error broadcasting log', {
        error,
        log,
      })
      throw error
    }
  }

  /**
   * Helper methods for monitoring/debugging
   */
  getConnectedClients() {
    return Array.from(this.clientMetadata.entries()).map(([id, info]) => ({
      clientId: id,
      filters: info.filters,
      rooms: Array.from(info.rooms),
      connectedAt: info.filters.startTime,
    }))
  }

  getRoomSubscriptions() {
    const rooms = new Map<string, string[]>()
    this.connectedClients.forEach((info, clientId) => {
      info.rooms.forEach((room) => {
        const clients = rooms.get(room) || []
        clients.push(clientId)
        rooms.set(room, clients)
      })
    })
    return Object.fromEntries(rooms)
  }
}
