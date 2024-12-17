// core/services/prisma.module.ts
import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./services/prisma.service";
import { ConfigService } from "./services/config.service";

@Global()
@Module({
  providers: [PrismaService, ConfigService],
  exports: [PrismaService],
})
export class PrismaModule {}
