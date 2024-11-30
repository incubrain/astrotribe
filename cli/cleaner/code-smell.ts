import { ESLint } from 'eslint'

export async function analyzeCyclomaticComplexity() {
  const eslint = new ESLint({
    baseConfig: {
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      rules: {
        complexity: ['error', { max: 1000 }], // Set a high max to catch all complexities
      },
    },
    useEslintrc: false,
  })

  const results = await eslint.lintFiles(['src/**/*.ts'])

  results.forEach((result) => {
    result.messages.forEach((message) => {
      if (message.ruleId === 'complexity') {
        console.log(`File: ${result.filePath}`)
        console.log(`Line ${message.line}: ${message.message}`)
      }
    })
  })
}

analyzeCyclomaticComplexity()
