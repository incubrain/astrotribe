import * as time from './utils/time'
import * as users from './utils/users'
import * as storage from './utils/storage'
import * as strings from './utils/strings'
import * as objects from './utils/objects'
import * as arrays from './utils/arrays'

export default function useUtils() {
  return {
    time: {
      format: time.toDateObject,
      lastSeen: time.lastSeen
    },
    users: {
      roleIcon: users.userRoleIcon,
      avatar: storage.getAvatar,
      cover: storage.getCover
    },
    venues: {
      featuredImage: storage.getVenueFeatured,
      logo: storage.getVenueLogo
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
