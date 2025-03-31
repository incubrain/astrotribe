// core/services/prisma.service.ejs
import { OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@astronera/db'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly configService: ConfigService) {
    super({
      log: ['query', 'info', 'warn', 'error'],
      datasources: {
        db: {
          url: configService.get<string>('app.database.url'),
        },
      },
    })
  }

  async onModuleInit() {
    try {
      console.log('Prisma connecting...')
      await this.$connect()
      console.log('Prisma connected')
    } catch (error: any) {
      console.error('Prisma connection failed', error)
      throw error
    }
  }

  async onModuleDestroy() {
    await this.$disconnect()
    console.log('Prisma disconnected')
  }
}
