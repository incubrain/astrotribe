import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

/**
 * Custom theme preset based on Aura with space-themed dark mode
 * Applied globally across all projects with consistent styling
 */
const AstroPreset = definePreset(Aura, {
  // Primitive tokens don't need to be modified as we use the ones from Aura

  // Semantic tokens - define the main design elements
  semantic: {
    // Primary color palette using indigo for a space theme
    primary: {
      50: '{indigo.50}',
      100: '{indigo.100}',
      200: '{indigo.200}',
      300: '{indigo.300}',
      400: '{indigo.400}',
      500: '{indigo.500}',
      600: '{indigo.600}',
      700: '{indigo.700}',
      800: '{indigo.800}',
      900: '{indigo.900}',
      950: '{indigo.950}',
    },

    // Focus ring customization for better visibility
    focusRing: {
      width: '2px',
      style: 'solid',
      color: '{indigo.400}',
      offset: '1px',
    },

    // Dark mode color scheme adjustments
    colorScheme: {
      // Light mode (keeping as a reference but we'll use dark mode)
      light: {
        primary: {
          color: '{indigo.600}',
          inverseColor: '#ffffff',
          hoverColor: '{indigo.700}',
          activeColor: '{indigo.800}',
        },
        highlight: {
          background: '{indigo.600}',
          color: '#ffffff',
        },
      },

      // Dark mode - space themed with dark blues and purples
      dark: {
        // Primary colors in dark mode
        primary: {
          color: '{indigo.400}',
          inverseColor: '#ffffff',
          hoverColor: '{indigo.300}',
          activeColor: '{indigo.200}',
        },

        // Surface colors for backgrounds, panels, cards
        surface: {
          0: '#121212', // Near black for main background
          50: '#1e1e2f', // Very dark blue-purple for panels
          100: '#252542', // Dark blue-purple
          200: '#2a2a4d', // Slightly lighter blue-purple
          300: '#323258', // Medium dark blue-purple
          400: '#3c3c68', // Medium blue-purple
          500: '#4a4a7d', // Blue-purple
          600: '#5c5c94', // Light blue-purple
          700: '#7575ad', // Lighter blue-purple
          800: '#9292c5', // Very light blue-purple
          900: '#b4b4dc', // Lightest blue-purple
          950: '#d0d0ea', // Nearly white with purple tint
        },

        // Highlight for selected items, focus
        highlight: {
          background: '{purple.500}',
          focusBackground: '{purple.400}',
          color: '#ffffff',
          focusColor: '#ffffff',
        },
      },
    },
  },

  // Component specific tokens and styles
  components: {
    // Button customization
    button: {
      colorScheme: {
        dark: {
          root: {
            // Match the token structure from ButtonTokenSections.Root
            borderRadius: '0.375rem',
            transitionDuration: '0.2s',

            // Root.primary
            primary: {
              background: '{primary.color}',
              hoverBackground: '{primary.hoverColor}',
              activeBackground: '{primary.activeColor}',
              color: '{primary.inverseColor}',
              focusRing: {
                color: 'rgba(99, 102, 241, 0.4)',
                shadow: '0 0 0 0.2rem rgba(99, 102, 241, 0.4)',
              },
            },
          },
        },
      },
    },

    // Card component styling
    card: {
      colorScheme: {
        dark: {
          // Note: Card component doesn't have detailed TypeScript definitions in the provided files
          // Using general structure based on other components
          root: {
            // General card properties that should be compatible
            shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
            background: '{surface.100}',
            color: '{surface.900}',
            borderRadius: '0.5rem',
          },
        },
      },
    },

    // Input field styling
    inputtext: {
      colorScheme: {
        dark: {
          root: {
            // Match the token structure from InputTextTokenSections.Root
            background: '{surface.200}',
            color: '{surface.900}',
            borderRadius: '0.375rem',
            borderColor: '{surface.400}',
            paddingX: '0.75rem',
            paddingY: '0.625rem',
            transitionDuration: '0.2s',
            hoverBorderColor: '{primary.color}',
            focusBorderColor: '{primary.color}',
            focusRing: {
              shadow: '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
              color: 'rgba(99, 102, 241, 0.25)',
              width: '0.2rem',
              style: 'solid',
              offset: '0',
            },
          },
        },
      },
    },

    // DataTable styling
    datatable: {
      colorScheme: {
        dark: {
          // Match the token structure from DataTableTokenSections interfaces
          root: {
            transitionDuration: '0.2s',
            borderColor: '{surface.300}',
          },
          header: {
            background: '{surface.200}',
            color: '{surface.950}',
            borderColor: '{surface.300}',
            padding: '0.75rem 1rem',
          },
          headerCell: {
            background: '{surface.200}',
            color: '{surface.950}',
          },
          columnTitle: {
            fontWeight: '600',
          },
          row: {
            background: '{surface.100}',
            hoverBackground: '{surface.200}',
          },
          bodyCell: {
            padding: '0.75rem 1rem',
            borderColor: '{surface.300}',
          },
        },
      },
    },
  },

  // Common tokens and extend features
  extend: {
    // Custom project tokens that can be used across components
    astro: {
      transition: {
        fast: '0.15s',
        normal: '0.3s',
        slow: '0.5s',
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
    },
  },

  // Global CSS that applies to the entire application
  css: ({ dt }) => `
    /* Global CSS adjustments */
    body {
      background-color: ${dt('surface.0')};
      color: ${dt('surface.950')};
      font-family: system-ui, -apple-system, sans-serif;
      transition: background-color ${dt('astro.transition.normal')}, color ${dt('astro.transition.normal')};
    }
    
    /* Custom scrollbar styling */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: ${dt('surface.100')};
    }
    
    ::-webkit-scrollbar-thumb {
      background: ${dt('surface.400')};
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: ${dt('surface.500')};
    }
  `,
})

/**
 * Export the theme configuration to be used in Nuxt configs
 */
export default {
  preset: AstroPreset,
  options: {
    prefix: 'Prime',
    darkModeSelector: '.dark', // We'll add this class to force dark mode
    cssLayer: true, // Enable CSS layering for easier customization
  },
}
