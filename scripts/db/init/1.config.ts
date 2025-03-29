// scripts/db/init/config.ts

interface InitSteps {
  runSeeders: boolean
  setAdminUsers: boolean
  enableRLS: boolean
  updatePermissions: boolean
  updateRLSPolicies: boolean
  generatePermissions: boolean
  refreshViews: boolean
}

export interface DatabaseConfig {
  // Control which initialization steps to run
  steps: InitSteps

  // Admin users to set up
  admins: string[]

  // Seeding configuration
  seeding: {
    batchSize: number
    counts: {
      contents: number
      companies: number
      news: number
      research: number
      socialMedia: number
      categories: number
      newsletters: number
    }
  }

  // Reference data for seeding
  referenceData: {
    countries: Array<{
      id: number
      name: string
      code: string
      code_3: string
    }>
    cities: Array<{
      id: number
      name: string
      country_id: number
      state: string | null
    }>
    categories: string[]
  }
}

export const databaseConfig: DatabaseConfig = {
  steps: {
    runSeeders: true,
    setAdminUsers: false,
    enableRLS: false,
    updatePermissions: false,
    updateRLSPolicies: false,
    generatePermissions: false,
    refreshViews: false,
  },

  admins: ['e8976b16-02a9-4595-a8a9-6457548eec12', 'e1bf12c6-aad4-4905-bda2-127c027504a3'],

  seeding: {
    batchSize: 100,
    counts: {
      contents: 1000,
      companies: 400,
      news: 400,
      research: 200,
      socialMedia: 100,
      categories: 20,
      newsletters: 15,
    },
  },

  referenceData: {
    countries: [
      { id: 1, name: 'United States', code: 'US', code_3: 'USA' },
      { id: 2, name: 'United Kingdom', code: 'GB', code_3: 'GBR' },
      { id: 3, name: 'Canada', code: 'CA', code_3: 'CAN' },
      { id: 4, name: 'Australia', code: 'AU', code_3: 'AUS' },
      { id: 5, name: 'Germany', code: 'DE', code_3: 'DEU' },
    ],
    cities: [
      { id: 1, name: 'New York', country_id: 1, state: 'NY' },
      { id: 2, name: 'London', country_id: 2, state: null },
      { id: 3, name: 'Toronto', country_id: 3, state: 'ON' },
      { id: 4, name: 'Sydney', country_id: 4, state: 'NSW' },
      { id: 5, name: 'Berlin', country_id: 5, state: null },
    ],
    categories: [
      'Technology',
      'Healthcare',
      'Finance',
      'Manufacturing',
      'Energy',
      'Transportation',
      'Retail',
      'Education',
      'Entertainment',
      'Real Estate',
    ],
  },
}
