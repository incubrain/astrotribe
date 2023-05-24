import { ThemeDefinition } from 'vuetify'
import colors from 'tailwindcss/colors'

export const darkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    primary: '#2472B4',
    'primary-darken-1': '#3700B3',
    secondary: '#03DAC6',
    'secondary-darken-1': '#018786',
    error: colors.red[500],
    info: '#2196F3',
    success: '#FB8C00',
    warning: '#FB8C00'
  }
}
