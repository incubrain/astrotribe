import { ref, computed } from 'vue'
import { usePersona } from './usePersona'

export interface Opportunity {
  id: number
  title: string
  company: string
  location: string
  type: string
  description: string
  requirements: string[]
  salary: string
  postedDate: Date
  deadline: Date
  color: string
  icon: string
  bestFor: string
  applyLink?: string
}

export function useOpportunities() {
  const { activePersona } = usePersona()

  // Mock data for opportunities
  const allOpportunities = ref<Opportunity[]>([
    {
      id: 1,
      title: 'Astronomy Educator',
      company: 'Science Center',
      location: 'San Francisco, CA',
      type: 'Full-time',
      description: 'Develop and deliver engaging astronomy programs for diverse audiences.',
      requirements: [
        'Bachelor\'s degree in Astronomy, Physics, or related field',
        'Experience in science education or outreach',
        'Excellent communication skills',
      ],
      salary: '$55,000 - $65,000',
      postedDate: new Date('2025-04-01'),
      deadline: new Date('2025-05-15'),
      color: 'red',
      icon: 'mdi:teach',
      bestFor: 'sci-commer',
      applyLink: 'https://example.com/apply/astronomy-educator',
    },
    {
      id: 2,
      title: 'Space Systems Engineer',
      company: 'AeroTech Industries',
      location: 'Houston, TX',
      type: 'Full-time',
      description: 'Design and develop components for next-generation spacecraft systems.',
      requirements: [
        'Master\'s degree in Aerospace Engineering or related field',
        'Experience with spacecraft systems design',
        'Proficiency in CAD software and simulation tools',
      ],
      salary: '$85,000 - $110,000',
      postedDate: new Date('2025-03-20'),
      deadline: new Date('2025-05-01'),
      color: 'blue',
      icon: 'mdi:rocket',
      bestFor: 'enthusiast',
      applyLink: 'https://example.com/apply/space-systems-engineer',
    },
    {
      id: 3,
      title: 'Astrophysics Researcher',
      company: 'National Observatory',
      location: 'Tucson, AZ',
      type: 'Full-time',
      description: 'Conduct cutting-edge research in astrophysics and analyze observational data.',
      requirements: [
        'Ph.D. in Astrophysics, Astronomy, or related field',
        'Experience with astronomical data analysis',
        'Publication record in peer-reviewed journals',
      ],
      salary: '$75,000 - $95,000',
      postedDate: new Date('2025-03-15'),
      deadline: new Date('2025-04-30'),
      color: 'indigo',
      icon: 'mdi:telescope',
      bestFor: 'researcher',
      applyLink: 'https://example.com/apply/astrophysics-researcher',
    },
  ])

  // Filter opportunities and sort by date
  const opportunities = computed(() => {
    return [...allOpportunities.value].sort(
      (a, b) => b.postedDate.getTime() - a.postedDate.getTime()
    )
  })

  // Get persona-specific opportunity
  const personaOpportunity = computed(() => {
    if (!activePersona.value) return null
    const personaName = activePersona.value.name.toLowerCase()
    return allOpportunities.value.find(
      (opportunity) => opportunity.bestFor.toLowerCase() === personaName
    ) || null
  })

  // Format date for display
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return date.toLocaleDateString(undefined, options)
  }

  // Calculate days remaining until deadline
  const getDaysRemaining = (deadline: Date): number => {
    const now = new Date()
    const diffTime = deadline.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  // Get opportunity by ID
  const getOpportunityById = (opportunityId: number): Opportunity | null => {
    return allOpportunities.value.find((opportunity) => opportunity.id === opportunityId) || null
  }

  // Apply for opportunity
  const applyForOpportunity = (opportunity: Opportunity): void => {
    if (opportunity.applyLink) {
      window.open(opportunity.applyLink, '_blank')
    }
  }

  return {
    allOpportunities: allOpportunities.value,
    opportunities,
    personaOpportunity,
    formatDate,
    getDaysRemaining,
    getOpportunityById,
    applyForOpportunity,
  }
}
