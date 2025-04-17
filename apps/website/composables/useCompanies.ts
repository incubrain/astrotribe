import { ref, computed } from 'vue'
import { usePersona } from './usePersona'

export interface Company {
  id: number
  name: string
  logo: string
  description: string
  industry: string
  location: string
  founded: number
  size: string
  website: string
  color: string
  icon: string
  bestFor: string
  highlights: string[]
}

export function useCompanies() {
  const { activePersona } = usePersona()

  // Mock data for companies
  const allCompanies = ref<Company[]>([
    {
      id: 1,
      name: 'SpaceX',
      logo: '/images/companies/spacex.png',
      description: 'American aerospace manufacturer and space transportation services company.',
      industry: 'Aerospace',
      location: 'Hawthorne, California',
      founded: 2002,
      size: '10,000+ employees',
      website: 'https://www.spacex.com',
      color: 'blue',
      icon: 'mdi:rocket-launch',
      bestFor: 'enthusiast',
      highlights: [
        'Developing Starship spacecraft for Mars missions',
        'Reusable rocket technology',
        'Starlink satellite internet constellation',
        'Commercial crew missions to ISS',
      ],
    },
    {
      id: 2,
      name: 'NASA',
      logo: '/images/companies/nasa.png',
      description: 'The National Aeronautics and Space Administration is America\'s civil space program and the global leader in space exploration.',
      industry: 'Government Agency',
      location: 'Washington, D.C.',
      founded: 1958,
      size: '17,000+ employees',
      website: 'https://www.nasa.gov',
      color: 'indigo',
      icon: 'mdi:telescope',
      bestFor: 'researcher',
      highlights: [
        'Artemis program to return humans to the Moon',
        'Mars Exploration Program',
        'James Webb Space Telescope',
        'Earth Science missions',
      ],
    },
    {
      id: 3,
      name: 'Astronomical Society',
      logo: '/images/companies/astronomical-society.png',
      description: 'Professional organization of astronomers and other scientists dedicated to the advancement of astronomy and geophysics.',
      industry: 'Non-profit',
      location: 'London, UK',
      founded: 1820,
      size: '1,000+ members',
      website: 'https://www.astronomicalsociety.org',
      color: 'red',
      icon: 'mdi:star',
      bestFor: 'sci-commer',
      highlights: [
        'Public outreach and education programs',
        'Monthly astronomy magazine publication',
        'Annual astronomy conferences',
        'Grants for astronomy research and education',
      ],
    },
  ])

  // Filter companies alphabetically
  const companies = computed(() => {
    return [...allCompanies.value].sort((a, b) => a.name.localeCompare(b.name))
  })

  // Get persona-specific company
  const personaCompany = computed(() => {
    if (!activePersona.value) return null
    const personaName = activePersona.value.name.toLowerCase()
    return allCompanies.value.find(
      (company) => company.bestFor.toLowerCase() === personaName
    ) || null
  })

  // Get company by ID
  const getCompanyById = (companyId: number): Company | null => {
    return allCompanies.value.find((company) => company.id === companyId) || null
  }

  // Visit company website
  const visitWebsite = (company: Company): void => {
    if (company.website) {
      window.open(company.website, '_blank')
    }
  }

  return {
    allCompanies: allCompanies.value,
    companies,
    personaCompany,
    getCompanyById,
    visitWebsite,
  }
}
