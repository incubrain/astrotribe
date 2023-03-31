const roleIconMapping: Record<number, string> = {
  // mapped to database role id
  7: 'eos-icons:admin-outlined',
  6: 'eos-icons:admin-outlined',
  5: 'fa6-solid:user-graduate',
  4: 'octicon:telescope',
  3: 'octicon:telescope',
  1: ''
}

export const userRoleIcon = (roleId: number): string => {
  if (Object.prototype.hasOwnProperty.call(roleIconMapping, roleId)) {
    return roleIconMapping[roleId]
  }
  return '' // default
}
