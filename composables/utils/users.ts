const roleIconMapping: Record<number, string> = {
  // mapped to database role id
  7: 'material-symbols:shield-lock', // admin
  6: 'material-symbols:manage-accounts', //
  5: 'mdi:account-school', // Mentor
  4: 'mdi:book-education', // Teacher
  3: 'mdi:telescope', // AstroGuide
  2: 'material-symbols:menu-book-rounded', // Student
  1: 'material-symbols:account-circle' // Basic user
}

export const userRoleIcon = (roleId: number): string => {
  if (Object.prototype.hasOwnProperty.call(roleIconMapping, roleId)) {
    return roleIconMapping[roleId]
  }
  return '' // default
}
