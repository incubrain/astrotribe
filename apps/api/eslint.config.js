import baseConfig from '../../eslint.config'

export default {
  ...baseConfig,
  rules: {
    ...baseConfig.rules,
    '@typescript-eslint/consistent-type-imports': 'off',
  },
}
