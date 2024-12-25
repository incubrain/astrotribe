// config/server.ts
export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', 'http://localhost:1337'),
  app: {
    keys: env.array('APP_KEYS'),
  },
  async bootstrap({ strapi }) {
    console.log('Starting bootstrap process...')
    try {
      const seedData = await import('../scripts/seed').then((mod) => mod.default)
      console.log('Imported seed module successfully')
      await seedData({ strapi })
      console.log('Bootstrap: Seeding completed successfully')
    } catch (error: any) {
      console.error('Bootstrap: Error during seeding:', error)
    }
    console.log('Bootstrap process completed')
  },
})
