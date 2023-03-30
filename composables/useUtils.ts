import * as time from './utils/time'
import * as users from './utils/users'

export default function useUtils() {
  return {
    time: {
      format: time.toDateObject,
      lastSeen: time.lastSeen
    },
    users: {
      roleIcon: users.userRoleIcon
    }
  }
}
