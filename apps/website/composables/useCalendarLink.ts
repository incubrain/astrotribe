// composables/useCalendarLink.ts
import { ref } from 'vue'

export interface CalendarEvent {
  name: string
  startDate: Date
  endDate?: Date
  description?: string
  location?: string
}

export interface CalendarLinks {
  google: string
  apple: string
  outlook: string
  ics?: string
}

export function useCalendarLink() {
  /**
   * Format dates for calendar URL in ISO-like format required by calendar services
   * Format: YYYYMMDDTHHMMSSZ (e.g., 20250405T100000Z)
   */
  const formatDateForCalendar = (date: Date): string => {
    return date.toISOString().replace(/-|:|\.\d+/g, '')
  }

  /**
   * Generate calendar links for an event
   * Returns links for Google Calendar, Apple Calendar, and Outlook
   */
  const generateCalendarLinks = (event: CalendarEvent): CalendarLinks => {
    try {
      const eventName = encodeURIComponent(event.name)
      const description = encodeURIComponent(event.description || '')
      const location = encodeURIComponent(event.location || '')

      // If no end date is provided, create one 1 hour after start
      const startDate = event.startDate
      const endDate = event.endDate || new Date(startDate.getTime() + 60 * 60 * 1000)

      // Format dates for calendar URLs
      const start = formatDateForCalendar(startDate)
      const end = formatDateForCalendar(endDate)

      // Google Calendar URL
      const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventName}&dates=${start}/${end}&details=${description}${location ? `&location=${location}` : ''}`

      // Apple Calendar (iCal) data URL
      const iCalData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `SUMMARY:${event.name}`,
        event.description ? `DESCRIPTION:${event.description}` : '',
        event.location ? `LOCATION:${event.location}` : '',
        'END:VEVENT',
        'END:VCALENDAR',
      ]
        .filter(Boolean)
        .join('%0A')

      // Create a Blob (acts like a file in memory)
      const blob = new Blob([iCalData], { type: 'text/calendar' })

      // Create a temporary URL for the Blob
      const url = URL.createObjectURL(blob)

      const appleUrl = url

      // Outlook Calendar URL
      // Format: YYYY-MM-DDTHH:MM:SSZ (e.g., 2025-04-05T10:00:00Z)
      const startISO = startDate.toISOString().replace('.000', '')
      const endISO = endDate.toISOString().replace('.000', '')

      const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${eventName}&startdt=${startISO}&enddt=${endISO}&body=${description}${location ? `&location=${location}` : ''}`

      return {
        google: googleUrl,
        apple: appleUrl,
        outlook: outlookUrl,
      }
    } catch (error) {
      console.error('Error generating calendar links:', error)

      // Return empty links if there's an error
      return {
        google: '',
        apple: '',
        outlook: '',
      }
    }
  }

  /**
   * Generate calendar links for an astronomy event
   * Convenience wrapper for astronomy event format
   */
  const generateAstronomyEventLinks = (
    name: string,
    date: Date,
    description?: string,
    duration: number = 60, // default duration in minutes
  ): CalendarLinks => {
    const endDate = new Date(date.getTime() + duration * 60 * 1000)

    return generateCalendarLinks({
      name,
      startDate: date,
      endDate,
      description,
    })
  }

  /**
   * Open a calendar link in a new tab
   */
  const openCalendarLink = (calendarType: string, links: CalendarLinks): void => {
    if (!import.meta.client) return

    const link = links[calendarType.toLowerCase() as keyof CalendarLinks]

    if (link) {
      window.open(link, '_blank')
    } else {
      console.error(`No link available for calendar type: ${calendarType}`)
    }
  }

  return {
    generateCalendarLinks,
    generateAstronomyEventLinks,
    openCalendarLink,
    formatDateForCalendar,
  }
}
