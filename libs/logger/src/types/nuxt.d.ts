// libs/logger/types/nuxt.d.ts
import type { CentralizedLogger } from '../centralizedLogger'
import type { Service } from '../enums-domains'

declare module '#app' {
  interface NuxtApp {
    $logger: CentralizedLogger<Service>
  }
}
