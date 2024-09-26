import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import eslintConfigPrettier from 'eslint-config-prettier'

export default createConfigForNuxt({
  features: {
    stylistic: {
      semi: false,
      indent: 2,
      quotes: 'single',
    },
  },
})
  .append({
    files: ['**/*.{js,ts,vue}'],
    rules: {
      'vue/multi-word-component-names': 'off',
      'no-global-assign': ['off', { exceptions: ['Object'] }],
      'no-undefined': 'off',
      'no-console': 'off',
      'no-new': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'quote-props': ['error', 'consistent-as-needed'],
      'quotes': ['error', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
      'arrow-parens': ['error', 'always'],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'object-curly-newline': 'off',
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
  .append(eslintConfigPrettier)
