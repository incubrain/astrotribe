import { definePreset, palette } from '@primevue/themes'
import Aura from '@primevue/themes/aura'

const primaryColor = palette('#2471b3')

export const DarkPreset = definePreset(Aura, {
  semantic: {
    primary: primaryColor
  }
})
