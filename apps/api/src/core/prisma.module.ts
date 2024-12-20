// core/services/prisma.module.ts
import { Global, Module } from '@nestjs/common'
import { PrismaService } from './services/prisma.service'

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
