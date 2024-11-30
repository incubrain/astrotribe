// cli/commands/search/index.ts

import path from 'path'
import fs from 'fs/promises'
import chalk from 'chalk'
import { Command } from 'commander'
import { createCLI } from '../framework'

export const searchCommand = new Command('search')
  .description('Search repository and generate context')
  .argument('[term]', 'Search term (optional)')
  .option('-c, --clear-store', 'Clear stored answers before running')
  .option('-d, --debug', 'Enable debug logging')
  .option('-a, --all', 'Run all feature searches')
  .option('-f, --feature <name>', 'Run specific feature search')
  .action(async (term, options) => {
    if (options.debug) {
      process.env.DEBUG = 'true'
    }

    const cli = createCLI()
    if (options.clearStore) {
      await cli.clearStore('search')
    }

    let initialContext = {}

    if (options.all) {
      initialContext = { mode: 'all', isAutomated: true }
    } else if (options.feature) {
      initialContext = {
        mode: 'feature',
        featureId: options.feature,
        isAutomated: true,
      }
    } else if (term) {
      initialContext = {
        mode: 'term',
        searchTerm: term,
        isAutomated: true,
      }
    }

    await cli.runFlow('search', initialContext)
  })
