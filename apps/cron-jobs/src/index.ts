// src/index.ts
import { Application } from './app'
import { config } from './config'

async function bootstrap() {
  const app = new Application(config)

  await app.start()

  // Handle shutdown gracefully
  process.on('SIGTERM', async () => {
    await app.stop()
    process.exit(0)
  })
}

bootstrap().catch((error: any) => {
  console.error('Application failed to start:', error)
  process.exit(1)
})
