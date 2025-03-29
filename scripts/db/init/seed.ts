import chalk from 'chalk'
import { runSeeders } from './run-seeders'

// Run the seeders
runSeeders()
  .then((success) => {
    if (success) {
      process.exit(0)
    } else {
      process.exit(1)
    }
  })
  .catch((error) => {
    console.error(chalk.red('Error seeding database:'), error)
    process.exit(1)
  })
