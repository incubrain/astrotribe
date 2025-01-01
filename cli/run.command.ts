// cli/commands/run/index.ts

import chalk from 'chalk'
import { Command } from 'commander'
import { createCLI } from './framework'

export const runCommand = new Command('run')
  .argument('<flow>', 'Flow to run')
  .description('Run a specific CLI flow')
  .option('-c, --clear-store', 'Clear stored answers before running')
  .option('-d, --debug', 'Enable debug logging')
  .action(async (flowId, options) => {
    if (flowId === 'search') {
      console.log(chalk.yellow('Please use the "search" command for search functionality'))
      console.log('Example: pnpm run ib search')
      return
    }

    if (options.debug) {
      process.env.DEBUG = 'true'
    }

    const cli = createCLI()
    if (options.clearStore) {
      await cli.clearStore(flowId)
    }
    await cli.runFlow(flowId)
  })
