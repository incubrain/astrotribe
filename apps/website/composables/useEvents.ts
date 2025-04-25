import { ref, computed } from 'vue'
import { usePersona } from './usePersona'
import { useCalendarLink } from './useCalendarLink'

// Define event interface
export interface AstronomyEvent {
  id: number
  name: string
  date: Date
  description: string
  type: string
  color: string
  icon: string
  bestFor: string
  duration?: number // Optional duration in minutes
  calendarLink?: {
    google: string
    apple: string
    outlook: string
  }
}

export function useEvents() {
  const { activePersona } = usePersona()
  const { generateAstronomyEventLinks, openCalendarLink } = useCalendarLink()

  // Create events with generated calendar links
  const createEvent = (
    id: number,
    name: string,
    date: Date,
    description: string,
    type: string,
    color: string,
    icon: string,
    bestFor: string,
    duration: number = 120, // Default 2 hours duration
  ): AstronomyEvent => {
    return {
      id,
      name,
      date,
      description,
      type,
      color,
      icon,
      bestFor,
      duration,
      calendarLink: generateAstronomyEventLinks(name, date, description, duration),
    }
  }

  const randomFutureDate = (days: number): Date => {
    const now = new Date()
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
    return futureDate
  }

  // Mock data for events - this would be replaced with API calls in the future
  const allEvents = ref<AstronomyEvent[]>([
    // Researcher events
    createEvent(
      1,
      'International Astronomy Conference',
      randomFutureDate(7),
      'Annual gathering of astronomy researchers from around the world discussing the latest discoveries and techniques in the field.',
      'conference',
      'blue',
      'mdi:account-group',
      'researcher',
      1680, // 28 hours (multi-day event)
    ),
    createEvent(
      2,
      'NASA Data Workshop',
      randomFutureDate(20),
      'Learn how to use NASA open data for research and analysis with expert guidance from NASA scientists.',
      'workshop',
      'primary',
      'mdi:database',
      'researcher',
      360, // 6 hours
    ),
    createEvent(
      3,
      'Astronomy Research Symposium',
      randomFutureDate(12),
      'Focused symposium on cutting-edge astronomy research methods and findings with opportunities for collaboration.',
      'symposium',
      'indigo',
      'mdi:telescope',
      'researcher',
      510, // 8.5 hours
    ),

    // Science Communicator events
    createEvent(
      4,
      'Lyrid Meteor Shower',
      randomFutureDate(19),
      'Annual meteor shower active from April 16–25, perfect for public engagement and education.',
      'meteor',
      'red',
      'mdi:meteor',
      'sci-commer',
      180, // 3 hours
    ),
    createEvent(
      5,
      'Science Communication Workshop',
      randomFutureDate(11),
      'Workshop focused on effectively communicating complex astronomy concepts to diverse audiences.',
      'workshop',
      'red',
      'mdi:broadcast',
      'sci-commer',
      240, // 4 hours
    ),
    createEvent(
      6,
      'Planetarium Directors Summit',
      randomFutureDate(4),
      'Annual gathering for planetarium professionals to share best practices in astronomy education.',
      'conference',
      'red',
      'lucide:projector',
      'sci-commer',
      480, // 8 hours
    ),

    // Enthusiast events
    createEvent(
      7,
      'Partial Solar Eclipse',
      randomFutureDate(9),
      'Visible from North America and parts of Europe, this partial solar eclipse will be a spectacular event for sky watchers.',
      'eclipse',
      'amber',
      'mdi:weather-night',
      'enthusiast',
      180, // 3 hours
    ),
    createEvent(
      8,
      'SpaceX Starship Launch',
      randomFutureDate(2),
      'Next orbital test flight from Boca Chica, Texas, representing a major milestone in commercial spaceflight.',
      'launch',
      'amber',
      'mdi:rocket-launch',
      'enthusiast',
      120, // 2 hours
    ),
    createEvent(
      9,
      'Jupiter Opposition',
      randomFutureDate(40),
      'Jupiter at its closest approach to Earth, offering excellent viewing conditions for amateur astronomers.',
      'planetary',
      'amber',
      'mdi:planet',
      'enthusiast',
      120, // 2 hours
    ),
  ])

  // All events sorted by date
  const events = computed(() => {
    return [...allEvents.value].sort((a, b) => a.date.getTime() - b.date.getTime())
  })

  // Get persona-specific events
  const relevantEvents = computed(() => {
    if (!activePersona.value) return []
    const personaName = activePersona.value.name.toLowerCase()
    return allEvents.value.filter((event) => event.bestFor.toLowerCase() === personaName)
  })

  // Get single persona-specific event
  const personaEvent = computed(() => {
    if (!activePersona.value) return null
    const personaName = activePersona.value.name.toLowerCase()
    return allEvents.value.find((event) => event.bestFor.toLowerCase() === personaName) || null
  })

  // Get initial event based on persona
  const getInitialEvent = (): AstronomyEvent => {
    const personaEvents = relevantEvents.value

    if (personaEvents.length === 0) return allEvents.value[0]!

    const now = new Date().getTime()
    const futureEvents = personaEvents.filter((event) => event.date.getTime() > now)

    if (futureEvents.length > 0) {
      return futureEvents[0]!
    }

    return personaEvents[0]!
  }

  // Format date for display - using a consistent format that works on both server and client
  const formatEventDate = (date: Date): string => {
    if (import.meta.client) {
      // Client-side, we can use the full localized formatting
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    }

    // Server-side fallback with manual formatting
    const day = date.getDate()
    const month = date.getMonth() + 1 // getMonth is 0-indexed
    const year = date.getFullYear()
    const hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12 // Convert 0 to 12 for 12 AM
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const dayName = dayNames[date.getDay()]
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    const monthName = monthNames[date.getMonth()]
    return `${dayName} ${day} ${monthName} ${year} at ${displayHours}:${minutes} ${ampm}`
  }

  // Format shorter date (for event cards)
  const formatShortDate = (date: Date): string => {
    if (import.meta.client) {
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    }

    // Server-side fallback
    const day = date.getDate()
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    const monthName = monthNames[date.getMonth()]
    const year = date.getFullYear()
    return `${day} ${monthName} ${year}`
  }

  // Add to calendar functionality
  const addToCalendar = (calendarType: string, event: AstronomyEvent): void => {
    if (!import.meta.client) return

    if (event.calendarLink) {
      openCalendarLink(calendarType, event.calendarLink)
    }
  }

  // Get event by ID
  const getEventById = (eventId: number): AstronomyEvent | null => {
    return allEvents.value.find((event) => event.id === eventId) || null
  }

  return {
    allEvents: allEvents.value,
    events,
    relevantEvents,
    personaEvent,
    formatEventDate,
    formatShortDate,
    addToCalendar,
    getEventById,
    getInitialEvent,
  }
}
