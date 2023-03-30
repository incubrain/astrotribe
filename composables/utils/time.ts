export function toDateObject(inputDate = '2022-03-01T10:30:00-05:00') {
  // !todo - add support for internationalization
  // !todo - add support for dynamic length
  const length = 'short'
  // convert date to local time
  const date = new Date(inputDate.toLocaleString())

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: length,
    year: 'numeric',
    month: length,
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: length
  }).format(date)

  const dateArray = formattedDate.split(', ')

  return {
    weekday: dateArray[0],
    month: dateArray[1].split(' ')[0],
    day: dateArray[1].split(' ')[1],
    time: dateArray[3].split(' ')[0],
    ampm: dateArray[3].split(' ')[1],
    timezone: dateArray[3].split(' ')[2],
    year: dateArray[2]
  }
}

export function lastSeen(lastSeenTimestamp: string): string {
  const now = new Date()
  const lastSeen = new Date(lastSeenTimestamp)
  const secondsSinceLastSeen = Math.round((now.getTime() - lastSeen.getTime()) / 1000)

  if (secondsSinceLastSeen < 60) {
    return `${secondsSinceLastSeen} second${secondsSinceLastSeen === 1 ? '' : 's'} ago`
  }

  const minutesSinceLastSeen = Math.round(secondsSinceLastSeen / 60)

  if (minutesSinceLastSeen < 60) {
    return `${minutesSinceLastSeen} minute${minutesSinceLastSeen === 1 ? '' : 's'} ago`
  }

  const hoursSinceLastSeen = Math.round(minutesSinceLastSeen / 60)

  if (hoursSinceLastSeen < 24) {
    return `${hoursSinceLastSeen} hour${hoursSinceLastSeen === 1 ? '' : 's'} ago`
  }

  const daysSinceLastSeen = Math.round(hoursSinceLastSeen / 24)
  return `${daysSinceLastSeen} day${daysSinceLastSeen === 1 ? '' : 's'} ago`
}
