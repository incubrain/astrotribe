import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import { FlatCompat } from '@eslint/eslintrc'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname
})

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021
      },
      parserOptions: {
        ecmaVersion: 'latest',
        extraFileExtensions: ['.vue'],
        parser: tsParser,
        project: ['./tsconfig.json']
      }
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'no-global-assign': ['off', { exceptions: ['Object'] }],
      'no-undefined': 'off',
      'no-console': 'off',
      'no-new': 'off',
      'object-curly-newline': 'off',
      curly: 'off',
      'no-undef': 'off',
      'space-before-function-paren': 'off',
      'arrow-parens': 'off',
      'vue/html-self-closing': 'off'
    },
    ignores: ['node_modules/**', 'dist/**']
  }
]
