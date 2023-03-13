import * as time from './helpers/time'

export default function useHelpers() {
    return {
        time: {
            format: time.toDateObject,
            lastSeen: time.lastSeen,
        },
    }
}
