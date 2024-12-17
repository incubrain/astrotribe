import { Module, Global } from '@nestjs/common';
import { ConfigService } from './services/config.service';
import { LoggerModule } from '../core/logger/logger.module';
import { PrismaService } from './services/prisma.service';
import { PaginationService } from './services/pagination.service';

@Global()
@Module({
  providers: [ConfigService, LoggerModule, PrismaService, PaginationService],
  exports: [ConfigService, LoggerModule, PrismaService, PaginationService],
})
export class CoreModule {}
