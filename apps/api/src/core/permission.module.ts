// permission.module.ts
import { Global, Module } from "@nestjs/common";
import { PermissionService } from "./services/permission.service";
import { PermissionGuard } from "./guards/permission.guard";

@Global()
@Module({
  providers: [PermissionService, PermissionGuard],
  exports: [PermissionService, PermissionGuard],
})
export class PermissionModule {}
