import * as time from './utils/time'
import * as users from './utils/users'
// import * as storage from './utils/storage'

export default function useUtils() {
  return {
    time: {
      format: time.toDateObject,
      lastSeen: time.lastSeen
    },
    users: {
      roleIcon: users.userRoleIcon,
      avatar: users.getAvatar
    }
  }
}
