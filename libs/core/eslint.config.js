import baseConfig from '../../eslint.config'

export default {
  ...baseConfig,
  rules: {
    ...baseConfig.rules,
    '@typescript-eslint/consistent-type-imports': 'off',
  },
  env: {
    node: true,
    es2022: true,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: 'libs/core/tsconfig.json',
      },
      node: {
        extensions: ['.ts', '.js'],
      },
    },
  },
}
