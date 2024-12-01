// cli/commands.ts
import type { Command } from 'commander'
import { runCommand } from './run.command'
import { searchCommand } from './repomix'
import { scannerCommand } from './scanner/scanner.command'

export function registerCommands(program: Command) {
  program.addCommand(searchCommand)
  program.addCommand(runCommand)
  program.addCommand(scannerCommand)
  }
