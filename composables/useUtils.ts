import * as time from './utils/time'
import * as users from './utils/users'
import * as strings from './utils/strings'
import * as objects from './utils/objects'
import * as arrays from './utils/arrays'
import { dynamicAsset } from './utils/assets'

export default function useUtils() {
  return {
    assets: {
      local: dynamicAsset
    },
    time: {
      format: time.toDateObject,
      lastSeen: time.lastSeen
    },
    users: {
      roleIcon: users.userRoleIcon
    },
    strings: {
      firstUpper: strings.upperCaseFirstLetter,
      slugify: strings.slugify
    },
    arrays: {
      removeDuplicates: arrays.removeDuplicates,
      sortBy: arrays.sortBy
    },
    objects: {
      pluck: objects.pluck
    }
  }
}
