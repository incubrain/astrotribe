import { ThemeDefinition } from 'vuetify'
import colors from 'tailwindcss/colors'

export const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    primary: '#7472A4',
    'primary-darken-1': '#3700B3',
    secondary: '#03DAC6',
    'secondary-darken-1': '#018786',
    error: colors.red[500],
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00'
  }
}
