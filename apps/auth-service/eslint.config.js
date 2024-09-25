const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const baseConfig = require('../../eslint.config.js');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.vue'],
    // Override or add rules here
    rules: {},
  },
  ...compat.extends('@nuxt/eslint-config'),
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: { parser: require('@typescript-eslint/parser') },
    },
  },
  { ignores: ['.nuxt/**', '.output/**', 'node_modules'] },
];
