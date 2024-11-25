// cli/framework.ts
import inquirer from 'inquirer'
import chalk from 'chalk'
import ora from 'ora'
import { FileStore } from './store'
import type { CLIFlow, CLIStep, CLIFrameworkOptions, CLIAction } from './types'

export class CLIFramework {
  private flows: Map<string, CLIFlow> = new Map()
  private globalActions: Map<string, CLIAction> = new Map()
  private options: CLIFrameworkOptions
  private spinner = ora()

  constructor(options: CLIFrameworkOptions = {}) {
    this.options = {
      store: new FileStore(),
      progressRenderer: this.defaultProgressRenderer.bind(this),
      ...options,
    }
  }

  private defaultProgressRenderer(step: CLIStep, total: number, current: number) {
    const percent = Math.round((current / total) * 100)
    const title = step.title || step.id
    console.log(chalk.blue(`\n[${percent}%] ${title}`))
  }

  registerFlow(flow: CLIFlow) {
    this.flows.set(flow.id, flow)
  }

  registerGlobalAction(id: string, action: CLIAction) {
    this.globalActions.set(id, action)
  }

  private async executeStep(
    step: CLIStep,
    flowId: string,
    context: any = {},
  ): Promise<string | null> {
    try {
      if (this.options.beforeStep) {
        this.spinner.start('Preparing step...')
        await this.options.beforeStep(step.id)
        this.spinner.stop()
      }

      // Render progress
      if (this.options.progressRenderer) {
        const flow = this.flows.get(flowId)
        if (flow) {
          const total = flow.steps.length
          const current = flow.steps.findIndex((s) => s.id === step.id) + 1
          this.options.progressRenderer(step, total, current)
        }
      }

      // Load saved answers if available
      const savedAnswers = this.options.store
        ? await this.options.store.load(`${flowId}-${step.id}`)
        : null

      // Prepare the current context for questions
      const currentContext = {
        ...context,
        ...savedAnswers,
      }

      console.log('Current context before prompt:', currentContext) // Debug log

      // Prompt questions with context
      const answers = await inquirer.prompt(step.questions, currentContext)

      console.log('Answers after prompt:', answers) // Debug log

      // Save answers
      if (this.options.store) {
        await this.options.store.save(`${flowId}-${step.id}`, answers)
      }

      // Update context with new answers
      Object.assign(context, answers)

      // Execute step action
      if (step.action) {
        this.spinner.start('Processing...')
        await step.action(context)
        this.spinner.succeed('Done')
      }

      // After step middleware
      if (this.options.afterStep) {
        this.spinner.start('Finalizing step...')
        await this.options.afterStep(step.id, context)
        this.spinner.stop()
      }

      console.log('Final context after step:', context) // Debug log

      // Determine next step
      return step.next ? await step.next(context) : null
    } catch (error) {
      console.error(chalk.red(`\nError in flow ${flowId}, step ${step.id}:`), error)
      console.error('Current context:', context) // Debug log

      if (this.options.onError) {
        const shouldRetry = await this.options.onError(error as Error, step.id)
        if (shouldRetry) return step.id
      } else {
        const { retry } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'retry',
            message: 'Would you like to retry this step?',
            default: true,
          },
        ])

        if (retry) return step.id
      }

      return null
    }
  }

  async runFlow(flowId: string, initialContext: any = {}) {
    const flow = this.flows.get(flowId)
    if (!flow) throw new Error(`Flow ${flowId} not found`)

    console.log(chalk.blue(`\nStarting ${flow.name}`))
    console.log(chalk.gray(flow.description))

    let currentStepId = flow.initialStep
    const context = { ...initialContext }

    while (currentStepId) {
      const step = flow.steps.find((s) => s.id === currentStepId)
      if (!step) throw new Error(`Step ${currentStepId} not found in flow ${flowId}`)

      currentStepId = await this.executeStep(step, flowId, context)
    }

    return context
  }

  async clearStore(flowId?: string) {
    if (this.options.store instanceof FileStore) {
      const store = this.options.store as FileStore
      await store.clear(flowId)
    }
  }
}
