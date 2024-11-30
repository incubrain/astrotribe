// cli/flows/search/index.ts

import chalk from 'chalk'
import { findFeatureByTerm } from '../../configs/feature-helpers'
import { FEATURE_CONFIGS } from '../../configs/features'
import type { CLIFlow } from '../../types'
import { handleSearch, handleFeatureSelect, handleAllFeatures } from './actions'

export const searchFlow: CLIFlow = {
  id: 'search',
  name: 'Search Repository',
  description: 'Search across the repository and generate context files',
  initialStep: 'init',
  steps: [
    {
      id: 'init',
      title: 'Initialize Search',
      questions: [],
      action: async (context) => {
        if (process.env.DEBUG === 'true') {
          console.log('DEBUG: Init context:', context)
        }

        if (context.isAutomated) {
          if (context.mode === 'all') {
            await handleAllFeatures()
            return null // End flow after handling all features
          }
          if (context.mode === 'feature' && context.featureId) {
            return handleFeatureSelect(context)
          }

          if (context.mode === 'term' && context.searchTerm) {
            const feature = findFeatureByTerm(context.searchTerm)
            if (feature) {
              console.log(chalk.blue(`Found matching feature: ${feature.name}`))
              return handleFeatureSelect({ featureId: feature.id })
            }
            return handleSearch({
              searchTerm: context.searchTerm,
              excludePatterns: '',
              searchComponents: true,
              searchPackages: true,
              runImmediately: true,
            })
          }
        }

        return { nextStep: 'select-mode' }
      },
      next: (answers) => answers.nextStep || null,
    },
    {
      id: 'select-mode',
      title: 'Select Search Mode',
      questions: [
        {
          type: 'list',
          name: 'mode',
          message: 'Choose search mode:',
          choices: [
            { name: 'Search by term', value: 'term' },
            { name: 'Select feature', value: 'feature' },
            { name: 'Run all features', value: 'all' },
          ],
        },
      ],
      next: (answers) => {
        switch (answers.mode) {
          case 'term':
            return 'enter-term'
          case 'feature':
            return 'select-feature'
          case 'all':
            return 'confirm-all'
          default:
            return null
        }
      },
    },
    {
      id: 'enter-term',
      title: 'Enter Search Term',
      questions: [
        {
          type: 'input',
          name: 'searchTerm',
          message: 'Enter search term:',
          validate: (input) => (input.trim() ? true : 'Search term cannot be empty'),
        },
      ],
      action: async (context) => {
        const feature = findFeatureByTerm(context.searchTerm)
        if (feature) {
          console.log(chalk.blue(`Found matching feature: ${feature.name}`))
          return handleFeatureSelect({ featureId: feature.id })
        }
        return handleSearch(context)
      },
      next: (answers) => (answers.configPath ? null : 'configure-search'),
    },
    {
      id: 'select-feature',
      title: 'Select Feature',
      questions: [
        {
          type: 'list',
          name: 'featureId',
          message: 'Select feature:',
          choices: Object.entries(FEATURE_CONFIGS).map(([id, config]) => ({
            name: `${config.name} - ${config.description}`,
            value: id,
          })),
        },
      ],
      action: handleFeatureSelect,
      next: (answers) => (answers.configPath ? null : 'configure-search'),
    },
    {
      id: 'confirm-all',
      title: 'Confirm All Features',
      questions: [
        {
          type: 'confirm',
          name: 'confirm',
          message: `Run search for all ${Object.keys(FEATURE_CONFIGS).length} features?`,
          default: true,
        },
      ],
      action: async (answers) => {
        if (answers.confirm) {
          return handleAllFeatures()
        }
        return null
      },
    },
    {
      id: 'configure-search',
      title: 'Configure Search',
      questions: [
        {
          type: 'confirm',
          name: 'runImmediately',
          message: 'Generate context file immediately?',
          default: true,
        },
      ],
      action: async (context) => {
        if (context.runImmediately && context.configPath) {
          // Execute repomix with the config
          // Implementation details in repomix-runner
        }
      },
    },
  ],
}
