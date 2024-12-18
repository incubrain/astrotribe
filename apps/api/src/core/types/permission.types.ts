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
  action: PermissionAction;
  resource: ResourceType;
  conditions?: Record<string, any>;
}
