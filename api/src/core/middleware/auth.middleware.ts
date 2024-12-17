// auth.middleware.ejs
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { app_plan_enum, app_role_enum } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../services/prisma.service';
import { ConfigService } from '../services/config.service';

interface MaterializedPermissions {
  [tableName: string]: {
    select: boolean;
    insert: boolean;
    update: boolean;
    delete: boolean;
  };
}

interface UserProfile {
  id: string;
  email: string;
  role: app_role_enum;
  plan: app_plan_enum;
  is_active?: boolean;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Get the token from Supabase Auth
      const token = this.extractToken(req);

      // Get user profile using the token's email
      const user = await this.getUserProfile(token.email);

      // Get materialized permissions for the user's role
      const permissions = await this.getMaterializedPermissions(user.role);

      // Check if user has permission for this operation
      const hasPermission = await this.checkPermission(
        req.method,
        this.getTableNameFromPath(req.path),
        permissions,
      );

      if (!hasPermission) {
        throw new ForbiddenException('Insufficient permissions');
      }

      // Attach user and permissions to request
      (req as any).user = user;
      (req as any).permissions = permissions;

      next();
    } catch (error: any) {
      this.handleError(res, error);
    }
  }

  private async getUserProfile(email: string): Promise<UserProfile> {
    const profile = await this.prisma.user_profiles.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        role: true,
        plan: true,
        last_seen: true,
      },
    });

    if (!profile) {
      throw new UnauthorizedException('User profile not found');
    }

    return profile;
  }

  private async getMaterializedPermissions(role: app_role_enum): Promise<MaterializedPermissions> {
    const materializedPerms = await this.prisma.role_permissions_materialized.findUnique({
      where: { role },
    });

    if (!materializedPerms) {
      throw new ForbiddenException('No permissions found for role');
    }

    return materializedPerms.permissions as MaterializedPermissions;
  }

  private checkPermission(
    method: string,
    tableName: string,
    permissions: MaterializedPermissions,
  ): boolean {
    const tablePermissions = permissions[tableName];
    if (!tablePermissions) return false;

    // Map HTTP methods to permission types
    const methodPermissionMap = {
      GET: 'select',
      POST: 'insert',
      PUT: 'update',
      PATCH: 'update',
      DELETE: 'delete',
    };

    const requiredPermission = methodPermissionMap[method];
    return tablePermissions[requiredPermission] || false;
  }

  private getTableNameFromPath(path: string): string {
    // Extract table name from path (e.g., /api/user_profiles -> user_profiles)
    const parts = path.split('/').filter(Boolean);
    return parts[parts.length - 1];
  }

  private extractToken(req: Request): { email: string } {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    // Here you would actually decode and verify the Supabase JWT
    // This is just a placeholder - you'll need to implement proper JWT verification
    const token = authHeader.replace('Bearer ', '');
    try {
      // You'll need to implement proper Supabase token validation here
      return { email: 'placeholder' }; // Replace with actual token decode
    } catch (error: any) {
      throw new UnauthorizedException('Invalid token', error.message);
    }
  }

  private handleError(res: Response, error: any) {
    const status =
      error instanceof UnauthorizedException
        ? 401
        : error instanceof ForbiddenException
          ? 403
          : 500;

    res.status(status).json({
      success: false,
      error: error.message || 'Authentication error',
      timestamp: new Date().toISOString(),
    });
  }
}
