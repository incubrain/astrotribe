import { wasRowDataUpdated } from './utils/hasValueChanged'
import * as time from './utils/time'
import * as strings from './utils/strings'
import * as objects from './utils/objects'
import * as arrays from './utils/arrays'

export function useUtils() {
  return {
    wasRowDataUpdated,
    time: {
      format: time.toDateObject,
      lastSeen: time.lastSeen
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
