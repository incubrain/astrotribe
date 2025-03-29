import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedBusinessDomains(pool: Pool, count: number = 30) {
  // Create a set to track used domain names to ensure uniqueness
  const usedNames = new Set<string>()

  // Generate a unique name
  const generateUniqueName = (): string => {
    let name = ''
    let attempts = 0
    const maxAttempts = 100

    do {
      // Generate different types of names to increase variety
      if (attempts % 3 === 0) {
        name = faker.commerce.department()
      } else if (attempts % 3 === 1) {
        name = faker.commerce.productName()
      } else {
        name = faker.company.buzzNoun() + ' ' + faker.commerce.department()
      }

      // Ensure a reasonable length
      if (name.length > 30) {
        name = name.substring(0, 30)
      }

      attempts++
      if (attempts >= maxAttempts) {
        name = `${faker.company.buzzNoun()}_${Date.now()}_${attempts}`
      }
    } while (usedNames.has(name))

    usedNames.add(name)
    return name
  }

  // Create top-level domains (without parent_id)
  const topLevelDomains = Array.from({ length: Math.ceil(count / 3) }, () => {
    const name = generateUniqueName()
    return {
      id: generateUUID(),
      name,
      slug: faker.helpers.slugify(name).toLowerCase(),
      description: faker.company.catchPhrase(),
      parent_id: null,
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    }
  })

  // Create second-level domains with references to top-level domains
  const secondLevelDomains = Array.from({ length: Math.ceil(count / 3) }, () => {
    const name = generateUniqueName()
    return {
      id: generateUUID(),
      name,
      slug: faker.helpers.slugify(name).toLowerCase(),
      description: faker.company.catchPhrase(),
      parent_id: faker.helpers.arrayElement(topLevelDomains).id,
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    }
  })

  // Create third-level domains with references to second-level domains
  const thirdLevelDomains = Array.from({ length: Math.floor(count / 3) }, () => {
    const name = generateUniqueName()
    return {
      id: generateUUID(),
      name,
      slug: faker.helpers.slugify(name).toLowerCase(),
      description: faker.company.catchPhrase(),
      parent_id: faker.helpers.arrayElement(secondLevelDomains).id,
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    }
  })

  // Combine all domains
  const allDomains = [...topLevelDomains, ...secondLevelDomains, ...thirdLevelDomains]

  await bulkInsert(pool, 'business_domains', allDomains)
  return allDomains
}
