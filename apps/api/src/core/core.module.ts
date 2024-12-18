import { Module, Global } from '@nestjs/common'
import { LoggerModule } from './logger/logger.module'
import { PrismaService } from './services/prisma.service'
import { PaginationService } from './services/pagination.service'

@Global()
@Module({
  providers: [LoggerModule, PrismaService, PaginationService],
  exports: [LoggerModule, PrismaService, PaginationService],
})
export class CoreModule {}
