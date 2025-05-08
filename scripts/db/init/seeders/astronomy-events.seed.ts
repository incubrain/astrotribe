import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedAstronomyEvents(pool: Pool, count: number = 50) {
  const astronomyEventTypes = [
    'Solar Eclipse',
    'Lunar Eclipse',
    'Meteor Shower',
    'Planet Transit',
    'Comet Appearance',
    'Supermoon',
    'Conjunction',
    'Opposition',
    'Asteroid Approach',
    'Space Launch',
    'Satellite Deployment',
    'ISS Visibility',
    'Astronomical Discovery',
  ]

  const astronomyEvents = Array.from({ length: count }, () => {
    const eventDate = faker.date.future()
    return {
      id: generateUUID(),
      title: faker.helpers.arrayElement(astronomyEventTypes),
      description: faker.lorem.paragraph(),
      date: faker.date.recent().toISOString().split('T')[0],
      time: faker.date.recent().toTimeString().split(' ')[0],
      category: faker.helpers.arrayElement([
        'Eclipse',
        'Meteor',
        'Planet',
        'Moon',
        'Star',
        'Space Mission',
        'Satellite',
        'Research',
      ]),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    }
  })

  await bulkInsert(pool, 'astronomy_events', astronomyEvents)
  return astronomyEvents
}
