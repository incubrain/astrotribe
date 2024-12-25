// cli/framework.ts
import inquirer from 'inquirer'
import chalk from 'chalk'
import ora from 'ora'
import { FileStore } from '../store'
import type { CLIFlow, CLIStep, CLIFrameworkOptions, CLIAction } from '../repomix/types'

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
      const isDebug = process.env.DEBUG === 'true'
      const isAutomated = context.isAutomated

      if (isDebug) {
        console.log('\nDEBUG: Current step:', step.id)
        console.log('DEBUG: Context:', context)
      }

      if (this.options.beforeStep) {
        this.spinner.start('Preparing step...')
        await this.options.beforeStep(step.id)
        this.spinner.stop()
      }

      // Render progress
      if (this.options.progressRenderer && !isAutomated) {
        const flow = this.flows.get(flowId)
        if (flow) {
          const total = flow.steps.length
          const current = flow.steps.findIndex((s) => s.id === step.id) + 1
          this.options.progressRenderer(step, total, current)
        }
      }

      let answers = {}
      if (!isAutomated) {
        // Load saved answers if available and not in automated mode
        const savedAnswers = this.options.store
          ? await this.options.store.load(`${flowId}-${step.id}`)
          : null

        // Prepare the current context for questions
        const currentContext = {
          ...context,
          ...savedAnswers,
        }

        if (isDebug) {
          console.log('DEBUG: Current context before prompt:', currentContext)
        }

        // Only prompt if there are questions and not in automated mode
        if (step.questions.length > 0) {
          answers = await inquirer.prompt(step.questions, currentContext)
          if (isDebug) {
            console.log('DEBUG: Answers after prompt:', answers)
          }
        }

        // Save answers if not automated
        if (this.options.store) {
          await this.options.store.save(`${flowId}-${step.id}`, answers)
        }
      }

      // Update context with new answers
      Object.assign(context, answers)

      // Execute step action
      if (step.action) {
        this.spinner.start('Processing...')
        const actionResult = await step.action(context)
        this.spinner.succeed('Done')

        // Merge action result into context if it returned something
        if (actionResult) {
          Object.assign(context, actionResult)
        }
      }

      // After step middleware
      if (this.options.afterStep) {
        this.spinner.start('Finalizing step...')
        await this.options.afterStep(step.id, context)
        this.spinner.stop()
      }

      if (isDebug) {
        console.log('DEBUG: Final context after step:', context)
      }

      // Determine next step
      let nextStep = step.next ? await step.next(context) : null

      if (isDebug) {
        console.log('DEBUG: Next step:', nextStep)
      }

      return nextStep
    } catch (error: any) {
      console.error(chalk.red(`\nError in flow ${flowId}, step ${step.id}:`), error)
      if (process.env.DEBUG === 'true') {
        console.error('DEBUG: Error details:', error)
        console.error('DEBUG: Current context:', context)
      }

      if (context.isAutomated) {
        throw error // In automated mode, propagate errors
      }

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

    if (process.env.DEBUG === 'true') {
      console.log('\nDEBUG: Starting flow:', flowId)
      console.log('DEBUG: Initial context:', initialContext)
    }

    if (!initialContext.isAutomated) {
      console.log(chalk.blue(`\nStarting ${flow.name}`))
      console.log(chalk.gray(flow.description))
    }

    let currentStepId = flow.initialStep
    const context = { ...initialContext }

    while (currentStepId) {
      const step = flow.steps.find((s) => s.id === currentStepId)
      if (!step) throw new Error(`Step ${currentStepId} not found in flow ${flowId}`)

      currentStepId = await this.executeStep(step, flowId, context)

      if (process.env.DEBUG === 'true') {
        console.log('DEBUG: Next step ID:', currentStepId)
      }
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
