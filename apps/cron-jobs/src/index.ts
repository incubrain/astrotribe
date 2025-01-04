// src/index.ts
import { Application } from './app'
import { config } from './config'

async function bootstrap() {

  const app = new Application(config)

  // Get test job name from command line arguments if provided
  const testJobArg = process.argv.find((arg) => arg.startsWith('--test-job='))
  const testJobName = testJobArg ? testJobArg.split('=')[1] : undefined

  await app.start(testJobName)

  // Handle shutdown gracefully
  process.on('SIGTERM', async () => {
    await app.stop()
    process.exit(0)
  })

  process.on('SIGINT', async () => {
    await app.stop()
    process.exit(0)
  })
}

bootstrap().catch((error: any) => {
  console.error('Application failed to start:', error)
  process.exit(1)
})
