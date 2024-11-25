// cli/index.ts
import path from 'path'
import fs from 'fs/promises'
import chalk from 'chalk'
import { Command } from 'commander'
import { CLIFramework } from './framework'
import { repomixFlow } from './flows/repomix'

const createCLI = () => {
  const cli = new CLIFramework({
    beforeStep: async (stepId) => {
      // Log step start
      console.log(chalk.gray(`\nStarting step: ${stepId}`))
    },
    afterStep: async (stepId, answers) => {
      // Log step completion
      console.log(chalk.gray(`Completed step: ${stepId}`))
    },
    onError: async (error, stepId) => {
      // Log error to file
      const logDir = path.join(process.cwd(), 'logs')
      await fs.mkdir(logDir, { recursive: true })
      await fs.appendFile(
        path.join(logDir, 'cli-errors.log'),
        `[${new Date().toISOString()}] Error in step ${stepId}: ${error}\n`,
      )
      return true // retry step
    },
  })

  // Register flows
  cli.registerFlow(repomixFlow)

  // Register global actions
  cli.registerGlobalAction('log', async (answers) => {
    const logDir = path.join(process.cwd(), 'logs')
    await fs.mkdir(logDir, { recursive: true })
    await fs.appendFile(
      path.join(logDir, 'cli-actions.log'),
      `[${new Date().toISOString()}] Action executed: ${JSON.stringify(answers)}\n`,
    )
  })

  return cli
}

const program = new Command()

program.name('cli').description('Multi-purpose CLI tool').version('1.0.0')

program
  .command('run <flow>')
  .description('Run a specific CLI flow')
  .option('-c, --clear-store', 'Clear stored answers before running')
  .action(async (flowId, options) => {
    const cli = createCLI()
    if (options.clearStore) {
      await cli.clearStore(flowId)
    }
    await cli.runFlow(flowId)
  })

program.parse()
