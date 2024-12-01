import { Command } from 'commander'
import { createCLI } from '../framework'
import { runScan } from './index'

export const scannerCommand = new Command('scan')
  .description('Run code quality analysis')
  .option('-p, --project <name>', 'Scan specific project')
  .option('-f, --format <type>', 'Report format (json or html)', 'json')
  .option('--fix', 'Attempt to fix issues automatically')
  .option('--non-interactive', 'Run in non-interactive mode')
  .action(async (options) => {
    const cli = createCLI()

    if (options.nonInteractive) {
      // Direct execution without prompts
      await runScan({
        project: options.project,
        format: options.format,
        fix: options.fix,
      })
    } else {
      // Interactive flow
      await cli.runFlow('scanner', {
        project: options.project,
        format: options.format,
        fix: options.fix,
      })
    }
  })
