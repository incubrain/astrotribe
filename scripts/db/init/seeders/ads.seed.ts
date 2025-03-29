import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedAds(pool: Pool, companyIds: string[], packageIds: string[]) {
  if (companyIds.length === 0 || packageIds.length === 0) {
    console.warn('No companies or packages available for creating ads')
    return []
  }

  console.log(`Generating ads for ${companyIds.length} companies with ${packageIds.length} packages`)

  try {
    const ads = companyIds.flatMap((companyId) =>
      Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => {
        const startDate = new Date(faker.date.past())
        const endDate = new Date(faker.date.future())
        
        return {
          id: generateUUID(),
          company_id: companyId,
          package_id: faker.helpers.arrayElement(packageIds),
          start_date: startDate,
          end_date: endDate,
          active: faker.datatype.boolean(),
          created_at: new Date(faker.date.past()),
          updated_at: new Date(faker.date.recent()),
        }
      }),
    )

    console.log(`Generated ${ads.length} ads`)
    
    // Log a sample ad for debugging
    if (ads.length > 0) {
      console.log('Sample ad:', JSON.stringify(ads[0], null, 2))
    }

    await bulkInsert(pool, 'ads', ads)
    return ads
  } catch (error) {
    console.error('Error in seedAds:', error)
    throw error
  }
}
