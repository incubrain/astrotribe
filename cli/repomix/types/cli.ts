// cli/types.ts
import type QuestionCollection from 'inquirer'

export type CLIAction<T = any> = (answers: T) => Promise<void> | void

export interface CLIStep<T = any> {
  id: string
  title?: string // For progress display
  questions: typeof QuestionCollection
  action?: CLIAction<T>
  next?: (answers: T) => string | null | Promise<string | null>
  skipIf?: (answers: T) => boolean | Promise<boolean>
}

export interface CLIFlow {
  id: string
  name: string
  description: string
  initialStep: string
  steps: CLIStep[]
}

export interface CLIStore {
  save: (key: string, data: any) => Promise<void>
  load: (key: string) => Promise<any>
}

export interface CLIFrameworkOptions {
  beforeStep?: (stepId: string) => Promise<void>
  afterStep?: (stepId: string, answers: any) => Promise<void>
  onError?: (error: Error, stepId: string) => Promise<boolean>
  progressRenderer?: (step: CLIStep, total: number, current: number) => void
  store?: CLIStore
}
