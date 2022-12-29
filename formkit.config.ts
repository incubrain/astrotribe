// formkit.config.ts
import { fr } from '@formkit/i18n'
import { DefaultConfigOptions } from '@formkit/vue'

const config: DefaultConfigOptions = {
    locales: { fr },
    locale: 'fr',
    theme: 'genesis' // will load from CDN and inject into document head
}

export default config
