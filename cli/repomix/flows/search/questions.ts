// cli/flows/search/questions.ts

export const searchQuestions = {
  searchTerm: [
    {
      type: 'input',
      name: 'searchTerm',
      message: 'Enter search term:',
      validate: (input: string) => {
        if (!input.trim()) {
          return 'Search term cannot be empty'
        }
        return true
      },
    },
  ],

  configureSearch: [
    {
      type: 'input',
      name: 'excludePatterns',
      message: 'Enter patterns to exclude (comma separated):',
      default: '',
    },
    {
      type: 'confirm',
      name: 'searchComponents',
      message: 'Search in components?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'searchPackages',
      message: 'Search in package files?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'runImmediately',
      message: 'Generate context file immediately?',
      default: true,
    },
  ],

  confirmRun: [
    {
      type: 'confirm',
      name: 'confirmGenerate',
      message: 'Ready to generate context file?',
      default: true,
    },
  ],
}
