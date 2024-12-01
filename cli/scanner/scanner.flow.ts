// cli/flows/scanner.flow.ts
import path from 'path'
import fs from 'fs'
import chalk from 'chalk'
import {
  readProjectConfiguration,
  workspaceRoot,
  getProjects,
  type Tree,
  type ProjectConfiguration,
} from '@nx/devkit'
import type { CLIFlow } from '../types'
import { createNxTree } from './utils/nx-tree'
import { runScan } from './index'
// import { names } from '@nx/devkit'

export interface ScannerContext {
  scanType: 'all' | 'specific'
  project?: string
  enabledPlugins: string[]
  reportFormat: 'json' | 'html'
  reportPath?: string
  results?: any
}

export const scannerFlow: CLIFlow = {
  id: 'scanner',
  name: 'Code Quality Scanner',
  description: 'Analyze code quality across your monorepo',
  initialStep: 'configure',
  steps: [
    {
      id: 'configure',
      title: 'Configure Scan',
      questions: [
        {
          type: 'list',
          name: 'scanType',
          message: 'What would you like to scan?',
          choices: [
            { name: 'All Projects', value: 'all' },
            { name: 'Specific Project', value: 'specific' },
          ],
        },
        {
          type: 'list',
          name: 'project',
          message: 'Select project to scan:',
          choices: async () => {
            const tree = createNxTree()
            const projects = getProjects(tree)
            return Array.from(projects.keys()).map((name) => ({
              name,
              value: name,
            }))
          },
          when: (answers) => answers.scanType === 'specific',
        },
        {
          type: 'checkbox',
          name: 'enabledPlugins',
          message: 'Select plugins to run:',
          choices: [
            { name: 'Bundle Analysis', value: 'bundle-analyzer' },
            { name: 'Code Complexity', value: 'complexity' },
            { name: 'Dependencies', value: 'dependencies' },
            { name: 'Code Duplication', value: 'duplication' },
          ],
          default: ['complexity', 'dependencies', 'duplication'],
        },
        {
          type: 'list',
          name: 'reportFormat',
          message: 'Select report format:',
          choices: [
            { name: 'JSON', value: 'json' },
            { name: 'HTML', value: 'html' },
          ],
        },
      ],
      action: async (context) => {
        const results = await runScan({
          project: context.scanType === 'specific' ? context.project : undefined,
          format: context.reportFormat,
          reportPath: context.reportPath,
        })
        return { results, scanned: true }
      },
      next: () => 'results',
    },
    {
      id: 'results',
      title: 'Scan Results',
      questions: [],
      action: async (context) => {
        if (!context.results) return

        console.log(chalk.bold('\nScan Results:'))
        for (const [project, projectResults] of Object.entries(context.results)) {
          console.log(chalk.cyan(`\n${project}:`))

          for (const result of projectResults) {
            if (!result.success) continue

            const score = result.data?.score
            if (score !== undefined) {
              const color = score > 80 ? chalk.green : score > 60 ? chalk.yellow : chalk.red
              console.log(`  ${result.pluginName}: ${color(score)}`)
            }

            const issues = result.data?.issues || []
            if (issues.length > 0) {
              console.log(chalk.gray('  Issues:'))
              for (const issue of issues) {
                const icon =
                  issue.severity === 'critical' ? '🔴' : issue.severity === 'warning' ? '🟡' : '🔵'
                console.log(`    ${icon} ${issue.message}`)
              }
            }
          }
        }

        return { displayed: true }
      },
      next: () => 'actions',
    },
    {
      id: 'actions',
      title: 'Available Actions',
      questions: [
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do next?',
          choices: [
            { name: 'Generate Detailed Report', value: 'report' },
            { name: 'Scan Another Project', value: 'scan' },
            { name: 'Exit', value: 'exit' },
          ],
        },
        {
          type: 'input',
          name: 'reportPath',
          message: 'Enter report file path:',
          default: 'code-scanner-report',
          when: (answers) => answers.action === 'report',
        },
      ],
      action: async (context) => {
        switch (context.action) {
          case 'report':
            await runScan({
              project: context.project,
              format: context.reportFormat,
              reportPath: context.reportPath,
            })
            console.log(chalk.green(`\nReport generated at: ${context.reportPath}`))
            return { completed: true }
          case 'scan':
            return { reset: true }
          case 'exit':
            return { completed: true }
        }
      },
      next: (context) => {
        if (context.reset) return 'configure'
        if (context.completed) return null
        return 'actions'
      },
    },
  ],
}
