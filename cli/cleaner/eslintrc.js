module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'complexity'],
  rules: {
    complexity: ['error', { max: 10 }],
  },
}
