import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  // Enable stylistic rules if you want ESLint to handle formatting
  features: {
    stylistic: {
      semi: false,
      indent: 2,
      quotes: 'single',
    },
  },
}).append({
  rules: {
    'vue/multi-word-component-names': 'off',
    'no-global-assign': ['off', { exceptions: ['Object'] }],
    'no-undefined': 'off',
    'no-console': 'off',
    'no-new': 'off',
    'object-curly-newline': 'off',
    'curly': 'off',
    'no-undef': 'off',
    'space-before-function-paren': 'off',
    'arrow-parens': 'off',
    'vue/html-self-closing': 'off',
  },
})
