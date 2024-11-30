// cli/utils/logger.ts

import chalk from 'chalk'

export const logger = {
  info: (message: string) => console.log(chalk.blue(message)),
  warn: (message: string) => console.warn(chalk.yellow(message)),
  error: (message: string) => console.error(chalk.red(message)),
}
