// cli/index.ts
import { Command } from 'commander'
import { registerCommands } from './commands'

const program = new Command()

program.name('cli').description('Repository management CLI tool').version('1.0.0')

registerCommands(program)

program.parse()
