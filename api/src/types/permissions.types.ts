import { Prisma } from "@prisma/client";

export type DatabaseAction = "select" | "insert" | "update" | "delete";

export interface PermissionCondition {
  sql: string;
}

export interface TokenPayload {
  role: string;
  user_id: string;
  email: string;
  aud: string;
  exp: number;
}
