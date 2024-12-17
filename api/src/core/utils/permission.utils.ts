// utils/permission.utils.ejs
export class PermissionUtils {
  static canAccess(userPermissions: string[], requiredPermissions: string[]): boolean {
    return requiredPermissions.every(required =>
      userPermissions.some(userPerm => this.matchPermission(userPerm, required)),
    );
  }

  private static matchPermission(userPerm: string, required: string): boolean {
    const userParts = userPerm.split(':');
    const requiredParts = required.split(':');

    if (userParts[0] === '*') return true;
    if (userParts.length !== requiredParts.length) return false;

    return userParts.every((part, i) => part === '*' || part === requiredParts[i]);
  }
}
