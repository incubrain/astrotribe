  // core/services/prisma.service.ejs
  import { OnModuleInit, OnModuleDestroy } from '@nestjs/common'
  import { Injectable } from '@nestjs/common'
  import { ConfigService } from '@nestjs/config'
  import { PrismaClient } from '@prisma/client'

  @Injectable()
  export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(private readonly configService: ConfigService) {
      super({
        datasources: {
          db: {
            url: configService.get<string>('app.database.url'),
          },
        },
      })
    }

    async onModuleInit() {
      await this.$connect()
    }

    async onModuleDestroy() {
      await this.$disconnect()
    }
  }
