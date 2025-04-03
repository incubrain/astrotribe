import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'
import resolveConfig from 'tailwindcss/resolveConfig'
import type { Config } from 'tailwindcss'
import tailwindConfig from './tailwind.config.base'

// Fully resolve the Tailwind config
const { theme } = resolveConfig(tailwindConfig as Config)

/**
 * AstronEra theme preset based on Aura with space-themed dark mode
 * Applied globally across all projects with consistent styling
 */
const AstroPreset = definePreset(Aura, {
  // Primitive tokens - using Tailwind colors from config
  primitive: {
    slate: theme.colors.slate,
    gray: theme.colors.gray,
    zinc: theme.colors.zinc,
    neutral: theme.colors.neutral,
    stone: theme.colors.stone,
    red: theme.colors.red,
    orange: theme.colors.orange,
    amber: theme.colors.amber,
    yellow: theme.colors.yellow,
    lime: theme.colors.lime,
    green: theme.colors.green,
    emerald: theme.colors.emerald,
    teal: theme.colors.teal,
    cyan: theme.colors.cyan,
    sky: theme.colors.sky,
    blue: theme.colors.blue,
    indigo: theme.colors.indigo,
    violet: theme.colors.violet,
    purple: theme.colors.purple,
    fuchsia: theme.colors.fuchsia,
    pink: theme.colors.pink,
    rose: theme.colors.rose,
  },

  // Semantic tokens - define the main design elements using our space theme
  semantic: {
    // Primary color palette using our logo blue

    // Focus ring customization for better visibility
    focusRing: {
      width: '2px',
      style: 'solid',
      color: '{primary.color}',
      offset: '1px',
    },

    // Dark mode color scheme adjustments for space theme
    colorScheme: {
      // Dark mode - space themed with dark blues and purples
      dark: {
        // Primary colors in dark mode
        primary: {
          50: '#e6f1fa',
          100: '#cce3f5',
          200: '#99c7eb',
          300: '#66aae0',
          400: '#338ed6',
          500: '#2c78b5', // Logo blue
          600: '#085eaa',
          700: '#053966',
          800: '#022e55',
          900: '#01223f',
          950: '#001932',
        },

        // Surface colors for backgrounds, panels, cards
        surface: {
          0: '#09090b', // Cosmic Black for main background
          50: '#e2e2e2', // Celestial Light for text
          100: '#18181b', // Nebula Dark for card backgrounds
          200: '#1e1e2f', // Very dark blue-purple for panels
          300: '#252542', // Dark blue-purple for inputs
          400: '#52525b', // Cosmic Dust for secondary text
          500: '#71717a', // Muted text
          600: '#a1a1aa', // High contrast text
          700: '#27272a', // Star Field for borders
          800: '#4338ca', // Astral Highlight for focus
          900: '#3730a3', // Deeper highlight
          950: '#d0d0ea', // Nearly white with purple tint
        },

        // Highlight for selected items, focus
        highlight: {
          background: '{primary.600}',
          focusBackground: '{primary.500}',
          color: '#ffffff',
          focusColor: '#ffffff',
        },
      },
    },
  },

  // Component specific tokens and styles
  components: {
    // Input field styling
    inputtext: {
      colorScheme: {
        dark: {
          root: {
            background: '{surface.200}',
            color: '{surface.50}',
            borderRadius: '0.375rem',
            borderColor: '{surface.700}',
            paddingX: '0.75rem',
            paddingY: '0.625rem',
            transitionDuration: '0.2s',
            hoverBorderColor: '{primary.color}',
            focusBorderColor: '{primary.color}',
            focusRing: {
              shadow: '0 0 0 0.2rem rgba(44, 120, 181, 0.25)',
              color: 'rgba(44, 120, 181, 0.25)',
              width: '0.2rem',
              style: 'solid',
              offset: '0',
            },
          },
        },
      },
    },

    // Popover styling for dropdowns and tooltips
    popover: {
      colorScheme: {
        dark: {
          root: {
            background: '{surface.100}',
            color: '{surface.900}',
            borderColor: '{surface.300}',
            borderRadius: '0.5rem',
            shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.4)',
          },
          content: {
            padding: '0.75rem',
          },
        },
      },
    },

    accordion: {
      colorScheme: {
        dark: {
          root: {
            transitionDuration: '0.3s',
          },
          panel: {
            borderWidth: '0 0 1px 0',
            borderColor: '{surface.700}',
          },
          header: {
            color: '{surface.600}',
            hoverColor: '{surface.50}',
            activeColor: '{primary.400}',
            padding: '1.125rem',
            fontWeight: '600',
            borderRadius: '0.375rem',
            borderWidth: '1px',
            borderColor: '{surface.700}',
            background: '{surface.100}',
            hoverBackground: '{surface.200}',
            activeBackground: '{surface.200}',
            activeHoverBackground: '{surface.300}',
            focusRing: {
              width: '2px',
              style: 'solid',
              color: '{primary.600}',
              offset: '2px',
              shadow: '0 0 0 2px rgba(44, 120, 181, 0.4)',
            },
            toggleIcon: {
              color: '{surface.500}',
              hoverColor: '{primary.400}',
              activeColor: '{primary.400}',
              activeHoverColor: '{primary.300}',
            },
            first: {
              topBorderRadius: '0.375rem',
              borderWidth: '1px',
            },
            last: {
              bottomBorderRadius: '0.375rem',
              activeBottomBorderRadius: '0',
            },
          },
          content: {
            borderWidth: '0 1px 1px 1px',
            borderColor: '{surface.700}',
            background: '{surface.100}',
            color: '{surface.50}',
            padding: '1.25rem',
          },
        },
      },
    },

    // TabView styling
    tabview: {
      colorScheme: {
        dark: {
          root: {
            transitionDuration: '0.2s',
          },
          tabList: {
            background: 'transparent',
            borderColor: '{surface.300}',
          },
          tab: {
            borderColor: 'transparent',
            activeBorderColor: '{primary.400}',
            color: '{surface.500}',
            hoverColor: '{primary.300}',
            activeColor: '{primary.400}',
          },
          tabPanel: {
            background: 'transparent',
            color: '{surface.900}',
          },
          navButton: {
            background: '{surface.200}',
            color: '{surface.600}',
            hoverColor: '{primary.400}',
            shadow: 'none',
          },
        },
      },
    },

    // Button styling improvements
    button: {
      colorScheme: {
        dark: {
          root: {
            borderRadius: '0.375rem',
            transitionDuration: '0.2s',

            // Primary button styling (used when severity="primary" or no severity specified)
            primary: {
              background: '{primary.600}',
              hoverBackground: '{primary.500}',
              activeBackground: '{primary.700}',
              borderColor: '{primary.600}',
              hoverBorderColor: '{primary.500}',
              activeBorderColor: '{primary.700}',
              color: '#ffffff',
              hoverColor: '#ffffff',
              activeColor: '#ffffff',
              focusRing: {
                color: 'rgba(44, 120, 181, 0.4)',
                shadow: '0 0 0 0.2rem rgba(44, 120, 181, 0.4)',
              },
            },

            // Secondary button styling
            secondary: {
              background: '{surface.200}',
              hoverBackground: '{surface.300}',
              activeBackground: '{surface.400}',
              borderColor: '{surface.300}',
              hoverBorderColor: '{surface.400}',
              activeBorderColor: '{surface.500}',
              color: '{surface.900}',
              hoverColor: '{surface.900}',
              activeColor: '{surface.900}',
            },
          },

          // Add explicit outlined variant to ensure consistency
          outlined: {
            primary: {
              background: 'transparent',
              hoverBackground: 'rgba(44, 120, 181, 0.1)',
              activeBackground: 'rgba(44, 120, 181, 0.2)',
              borderColor: '{primary.600}',
              hoverBorderColor: '{primary.500}',
              activeBorderColor: '{primary.700}',
              color: '{primary.500}',
              hoverColor: '{primary.500}',
              activeColor: '{primary.600}',
            },
            secondary: {
              background: 'transparent',
              hoverBackground: '{surface.200}',
              activeBackground: '{surface.300}',
              borderColor: '{surface.300}',
              hoverBorderColor: '{surface.400}',
              activeBorderColor: '{surface.500}',
              color: '{surface.400}',
              hoverColor: '{surface.300}',
              activeColor: '{surface.200}',
            },
          },

          // Text variant
          text: {
            primary: {
              background: 'transparent',
              hoverBackground: 'rgba(44, 120, 181, 0.1)',
              activeBackground: 'rgba(44, 120, 181, 0.2)',
              color: '{primary.500}',
              hoverColor: '{primary.500}',
              activeColor: '{primary.600}',
            },
            secondary: {
              background: 'transparent',
              hoverBackground: '{surface.200}',
              activeBackground: '{surface.300}',
              color: '{surface.400}',
              hoverColor: '{surface.300}',
              activeColor: '{surface.200}',
            },
          },
        },
      },
    },

    // Card styling with glass effect
    card: {
      colorScheme: {
        dark: {
          root: {
            shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
            background: '{surface.100}',
            color: '{surface.900}',
            borderRadius: '0.5rem',
          },
          body: {
            padding: '1.25rem',
            gap: '0.5rem',
          },
          title: {
            fontSize: '1.25rem',
            fontWeight: '600',
          },
          subtitle: {
            color: '{surface.700}',
          },
        },
      },
    },

    // DataTable styling
    datatable: {
      colorScheme: {
        dark: {
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

    // Message/Alert styling
    message: {
      colorScheme: {
        dark: {
          root: {
            borderRadius: '0.375rem',
            transitionDuration: '0.2s',
          },
          content: {
            padding: '0.75rem 1rem',
            gap: '0.5rem',
          },
          icon: {
            size: '1.25rem',
          },
          text: {
            fontSize: '0.875rem',
            fontWeight: '500',
          },
          // Success styling
          success: {
            background: '#059669', // emerald-600
            borderColor: '#047857', // emerald-700
            color: '#ffffff',
            shadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          },
          // Error styling
          error: {
            background: '#dc2626', // red-600
            borderColor: '#b91c1c', // red-700
            color: '#ffffff',
            shadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          },
          // Info styling
          info: {
            background: '#2563eb', // blue-600
            borderColor: '#1d4ed8', // blue-700
            color: '#ffffff',
            shadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          },
          // Warning styling
          warn: {
            background: '#d97706', // amber-600
            borderColor: '#b45309', // amber-700
            color: '#ffffff',
            shadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },

    // Toast notifications
    toast: {
      colorScheme: {
        dark: {
          root: {
            borderRadius: '0.375rem',
            transitionDuration: '0.3s',
          },
          content: {
            padding: '1rem',
            gap: '0.5rem',
          },
          icon: {
            size: '1.5rem',
          },
          summary: {
            fontSize: '1rem',
            fontWeight: '600',
          },
          detail: {
            fontSize: '0.875rem',
            fontWeight: '400',
          },
          // Styling for each severity
          info: {
            background: 'rgba(37, 99, 235, 0.9)', // blue-600 with transparency
            borderColor: '#1d4ed8', // blue-700
            color: '#ffffff',
            shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
          },
          success: {
            background: 'rgba(5, 150, 105, 0.9)', // emerald-600 with transparency
            borderColor: '#047857', // emerald-700
            color: '#ffffff',
            shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
          },
          warn: {
            background: 'rgba(217, 119, 6, 0.9)', // amber-600 with transparency
            borderColor: '#b45309', // amber-700
            color: '#ffffff',
            shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
          },
          error: {
            background: 'rgba(220, 38, 38, 0.9)', // red-600 with transparency
            borderColor: '#b91c1c', // red-700
            color: '#ffffff',
            shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },

    // Checkbox styling
    checkbox: {
      colorScheme: {
        dark: {
          root: {
            borderRadius: '0.25rem',
            width: '1.25rem',
            height: '1.25rem',
            background: '{surface.200}',
            checkedBackground: '{primary.600}',
            checkedHoverBackground: '{primary.500}',
            borderColor: '{surface.700}',
            hoverBorderColor: '{primary.400}',
            checkedBorderColor: '{primary.600}',
            checkedHoverBorderColor: '{primary.500}',
            focusRing: {
              width: '2px',
              style: 'solid',
              color: 'rgba(44, 120, 181, 0.4)',
              offset: '2px',
              shadow: '0 0 0 2px rgba(44, 120, 181, 0.4)',
            },
            transitionDuration: '0.2s',
          },
          icon: {
            size: '0.75rem',
            color: '{surface.900}',
            checkedColor: '#ffffff',
          },
        },
      },
    },

    // RadioButton styling
    radiobutton: {
      colorScheme: {
        dark: {
          root: {
            width: '1.25rem',
            height: '1.25rem',
            background: '{surface.200}',
            checkedBackground: '{primary.600}',
            checkedHoverBackground: '{primary.500}',
            borderColor: '{surface.700}',
            hoverBorderColor: '{primary.400}',
            checkedBorderColor: '{primary.600}',
            checkedHoverBorderColor: '{primary.500}',
            focusRing: {
              width: '2px',
              style: 'solid',
              color: 'rgba(44, 120, 181, 0.4)',
              offset: '2px',
              shadow: '0 0 0 2px rgba(44, 120, 181, 0.4)',
            },
            transitionDuration: '0.2s',
          },
          icon: {
            size: '0.5rem',
            checkedColor: '#ffffff',
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
      color: ${dt('surface.50')};
      font-family: system-ui, -apple-system, sans-serif;
      transition: background-color ${dt('astro.transition.normal')}, color ${dt('astro.transition.normal')};
    }
    
    /* Glass effect for cards - add .glass class to elements */
    .glass {
      background-color: rgba(24, 24, 27, 0.1);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(39, 39, 42, 0.3);
      box-shadow: 0 4px 20px -2px rgba(44, 120, 181, 0.15);
    }
    
    /* Glow effect for primary elements - add .glow class */
    .glow {
      box-shadow: 0 0 15px rgba(44, 120, 181, 0.3);
      transition: box-shadow 0.3s ease;
    }
    
    .glow:hover {
      box-shadow: 0 0 25px rgba(44, 120, 181, 0.5);
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
    
    /* Typography adjustments */
    h1, h2, h3, h4, h5, h6 {
      color: ${dt('surface.50')};
      font-weight: 600;
      line-height: 1.2;
      margin-bottom: 1rem;
    }
    
    a {
      color: ${dt('primary.400')};
      text-decoration: none;
      transition: color ${dt('astro.transition.fast')};
    }
    
    a:hover {
      color: ${dt('primary.300')};
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
    darkModeSelector: '.dark', // Force dark mode
    cssLayer: {
      name: 'primevue',
      order: 'tailwind-base, primevue, tailwind-utilities',
    },
  },
}
