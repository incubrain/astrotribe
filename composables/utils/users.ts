const roleIconMapping: Record<number, string> = {
  // mapped to database role id
  7: 'i-material-symbols-shield-lock', // admin
  6: 'i-material-symbols-manage-accounts', //
  5: 'i-mdi-account-school', // Mentor
  4: 'i-mdi-book-education', // Teacher
  3: 'i-mdi-telescope', // AstroGuide
  2: 'i-material-symbols-menu-book-rounded', // Student
  1: 'i-material-symbols-account-circle' // Basic user
}

export const userRoleIcon = (roleId: number): string => {
  if (Object.prototype.hasOwnProperty.call(roleIconMapping, roleId)) {
    return roleIconMapping[roleId]
  }
  return '' // default
}
