const roleIconMapping: Record<number, string> = {
  // mapped to database role id
  7: 'eos-icons:admin-outlined',
  6: 'ic:baseline-manage-accounts',
  5: 'fa6-solid:user-graduate',
  4: 'i-mdi-book-education-outline',
  3: 'octicon:telescope',
  2: 'ph:student-fill',
  1: 'i-material-symbols-account-circle'
}

export const userRoleIcon = (roleId: number): string => {
  if (Object.prototype.hasOwnProperty.call(roleIconMapping, roleId)) {
    return roleIconMapping[roleId]
  }
  return '' // default
}
