// services/permission.service.ts
import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { CustomLogger } from "@core/logger/custom.logger";
import { ConfigService } from "./config.service";
import { DatabaseAction, TokenPayload, PermissionCondition } from "../../types/permissions.types"
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { app_role_enum } from "@prisma/client";

@Injectable()
export class PermissionService implements OnModuleInit {
  private supabase: SupabaseClient;
  private roleHierarchyCache: Map<string, string[]> = new Map();

  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: CustomLogger,
    private readonly config: ConfigService
  ) {
    this.supabase = createClient(
      this.config.get("SUPABASE_URL"),
      this.config.get("SUPABASE_ANON_KEY")
    );
  }

  async onModuleInit() {
    this.logger.setContext("PermissionService");
    await this.loadRoleHierarchy();
    this.logger.log("Permission service initialized with role hierarchy");
  }

  private async loadRoleHierarchy() {
    try {
      const hierarchyData = await this.prisma.role_hierarchy.findMany();

      hierarchyData.forEach(({ parent_role, child_role }) => {
        const parentRoles = this.roleHierarchyCache.get(child_role) || [];
        parentRoles.push(parent_role);
        this.roleHierarchyCache.set(child_role, parentRoles);
      });

      this.logger.debug(
        `Loaded role hierarchy for ${this.roleHierarchyCache.size} roles`
      );
    } catch (error) {
      this.logger.error("Failed to load role hierarchy", error.stack);
      throw error;
    }
  }

  async validateToken(token: string): Promise<TokenPayload> {
    try {
      const {
        data: { user },
        error,
      } = await this.supabase.auth.getUser(token);

      if (error) {
        this.logger.error("Token validation failed", error.message);
        throw error;
      }

      if (!user) {
        this.logger.error("User not found in token");
        throw new Error("User not found");
      }

      return user as unknown as TokenPayload;
    } catch (error) {
      this.logger.error("Token validation failed", error.stack);
      throw error;
    }
  }

  async getPermissions(role: app_role_enum, tableName: string) {
    try {
      const permissions =
        await this.prisma.role_permissions_materialized.findUnique({
          where: { role },
          select: {
            permissions: true,
          },
        });

      if (!permissions) {
        this.logger.warn(`No permissions found for role: ${role}`);
        return null;
      }

      return permissions.permissions[tableName];
    } catch (error) {
      this.logger.error(
        `Failed to get permissions for role ${role}`,
        error.stack
      );
      throw error;
    }
  }

  async validatePermission(
    role: app_role_enum,
    tableName: string,
    action: DatabaseAction,
    userId?: string
  ): Promise<boolean> {
    try {
      // Get permissions from materialized view
      const permissions = await this.getPermissions(role, tableName);

      if (!permissions?.[action]) {
        this.logger.debug(
          `Permission denied for ${role} on ${tableName}.${action}`
        );
        return false;
      }

      // Check conditions if user ID is provided
      if (userId) {
        const conditions = await this.prisma.role_permissions.findFirst({
          where: {
            role,
            table_name: tableName,
          },
          select: {
            conditions: true,
          },
        });

        if (conditions?.conditions?.[action]) {
          const condition = conditions.conditions[
            action
          ] as PermissionCondition;
          const evaluatedCondition = condition.sql.replace(
            "auth.uid()",
            userId
          );

          // Here you would evaluate the SQL condition
          // For demonstration, we'll do a simple check
          if (!evaluatedCondition.includes(userId)) {
            this.logger.debug(
              `Condition check failed for ${role} on ${tableName}.${action}`
            );
            return false;
          }
        }
      }

      this.logger.debug(
        `Permission granted for ${role} on ${tableName}.${action}`
      );
      return true;
    } catch (error) {
      this.logger.error(`Permission validation failed`, error.stack);
      throw error;
    }
  }
}
