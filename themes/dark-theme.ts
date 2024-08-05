import { definePreset, palette, updatePrimaryPalette } from '@primevue/themes'
import Aura from '@primevue/themes/aura'

const primaryColor = palette('#2471b3')

updatePrimaryPalette(primaryColor)

export const DarkPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: primaryColor[50],
      100: primaryColor[100],
      200: primaryColor[200],
      300: primaryColor[300],
      400: primaryColor[400],
      500: primaryColor[500],
      600: primaryColor[600],
      700: primaryColor[700],
      800: primaryColor[800],
      900: primaryColor[900],
      950: primaryColor[950]
    }
  }
})
