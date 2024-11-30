// cli/commands.ts
import type { Command } from 'commander'
import { runCommand } from './run.command'
import { searchCommand } from './repomix'

export function registerCommands(program: Command) {
  program.addCommand(searchCommand)
  program.addCommand(runCommand)
}
