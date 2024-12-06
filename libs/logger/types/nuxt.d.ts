// libs/logger/types/nuxt.d.ts
import type { CentralizedLogger, Service } from '../src/types'

declare module '#app' {
  interface NuxtApp {
    $logger: CentralizedLogger<Service>
  }
}
