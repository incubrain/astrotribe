// scripts/db/init/config.ts

interface InitSteps {
  runSeeders: boolean
  setAdminUsers: boolean
  enableRLS: boolean
  updatePermissions: boolean
  updateRLSPolicies: boolean
  generatePermissions: boolean
  refreshViews: boolean
  addVaultSecrets: boolean
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
    addVaultSecrets: true,
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
