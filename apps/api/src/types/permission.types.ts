// types/permission.types.ejs
export enum PermissionAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  MANAGE = 'MANAGE',
}

export enum ResourceType {
  USER = 'USER',
  CONTENT = 'CONTENT',
  SETTINGS = 'SETTINGS',
  BILLING = 'BILLING',
}

export interface Permission {
  action: PermissionAction
  resource: ResourceType
  conditions?: Record<string, any>
}

export type DatabaseAction = 'select' | 'insert' | 'update' | 'delete'

export interface PermissionCondition {
  sql: string
}

export interface TokenPayload {
  role: string
  user_id: string
  email: string
  aud: string
  exp: number
}

export interface AuthError extends Error {
  status: number
  code: string
}
