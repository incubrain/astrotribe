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
  files: ['**/*.{js,ts,vue}'],
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-global-assign': ['off', { exceptions: ['Object'] }],
    'no-undefined': 'off',
    'no-console': 'off',
    'quotes': ['error', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
    '@stylistic/quotes': ['error', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
    'no-new': 'off',
    'object-curly-newline': 'off',
    'arrow-parens': ['error', 'always'],
    '@stylistic/arrow-parens': ['error', 'always'],
    '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'curly': 'off',
    'no-undef': 'off',
    'space-before-function-paren': 'off',
    'vue/html-self-closing': 'off',

  },
  ignores: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/.nuxt/**',
    '**/public/**',
    './theme/**',
    '**/theme/**',
    '**/.output/**',
  ],
})