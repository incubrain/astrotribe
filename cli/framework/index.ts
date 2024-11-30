// cli/framework.ts

import path from 'path'
import fs from 'fs/promises'
import chalk from 'chalk'
import { repomixFlow } from '../repomix/flows/repomix'
import { searchFlow } from '../repomix/flows/search'
import { CLIFramework } from './framework'

export const createCLI = () => {
  const cli = new CLIFramework({
    beforeStep: async (stepId) => {
      console.log(chalk.gray(`\nStarting step: ${stepId}`))
    },
    afterStep: async (stepId, answers) => {
      console.log(chalk.gray(`Completed step: ${stepId}`))
    },
    onError: async (error, stepId) => {
      const logDir = path.join(process.cwd(), 'logs')
      await fs.mkdir(logDir, { recursive: true })
      await fs.appendFile(
        path.join(logDir, 'cli-errors.log'),
        `[${new Date().toISOString()}] Error in step ${stepId}: ${error}\n`,
      )
      return true
    },
  })

  cli.registerFlow(repomixFlow)
  cli.registerFlow(searchFlow)

  return cli
}
