// src/db-testing/constants.ts

export const DEFAULT_TEST_IDS = {
  contents: {
    news: 'test-news-content-id',
    research: 'test-research-content-id',
    article: 'test-article-content-id',
  },
  categories: [1, 2, 3],
  tags: [1, 2, 3],
} as const

export const TEST_USERS = {
  ADMIN: {
    id: 'e8976b16-02a9-4595-a8a9-6457548eec12',
    email: 'admin@example.com',
    given_name: 'Admin',
    surname: 'User',
    username: 'admin',
    role: 'admin',
    plan: 'enterprise',
  },
  NORMAL_USER: {
    id: '72b03fa1-4430-4c07-bb89-991285918f22',
    email: 'user@example.com',
    given_name: 'Normal',
    surname: 'User',
    username: 'user',
    role: 'user',
    plan: 'free',
  },
  MODERATOR: {
    id: 'a1b2c3d4-e5f6-4321-8765-9876543210ab',
    email: 'mod@example.com',
    given_name: 'Moderator',
    surname: 'User',
    username: 'moderator',
    role: 'moderator',
    plan: 'premium',
  },
} as const

export const REFERENCE_DATA = {
  categories: [{ name: 'Technology' }, { name: 'Science' }, { name: 'Business' }],
  countries: [
    { id: 1, name: 'United States', code: 'US', code_3: 'USA' },
    { id: 2, name: 'United Kingdom', code: 'GB', code_3: 'GBR' },
  ],
  cities: [
    { id: 1, name: 'New York', country_id: 1 },
    { id: 2, name: 'London', country_id: 2 },
  ],
  tags: [{ name: 'AI' }, { name: 'Machine Learning' }, { name: 'Data Science' }],
} as const
