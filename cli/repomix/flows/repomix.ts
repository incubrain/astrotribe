// cli/flows/repomix.ts
import type { CLIFlow } from '../types'
import { RepomixRunner } from './repomix-runner'

interface SelectModeAnswers {
  mode: string
}

interface SelectConfigsAnswers extends SelectModeAnswers {
  selectedConfigs: any[]
  runImmediately: boolean
}

export const repomixFlow: CLIFlow = {
  id: 'repomix',
  name: 'Repomix Runner',
  description: 'Run repomix configurations',
  initialStep: 'select-mode',
  steps: [
    {
      id: 'select-mode',
      title: 'Select Mode',
      questions: [
        {
          type: 'list',
          name: 'mode',
          message: 'Select mode:',
          choices: async () => {
            const runner = new RepomixRunner()
            const modes = await runner.getAvailableModes()
            return modes.map((mode) => ({
              name: `${mode.name} (${mode.configCount} configs)`,
              value: mode.id,
            }))
          },
        },
      ],
      next: () => 'select-configs',
    },
    {
      id: 'select-configs',
      title: 'Select Configs',
      questions: [
        {
          type: 'checkbox',
          name: 'selectedConfigs',
          message: 'Select configs to run:',
          choices: async (answers: any) => {
            const runner = new RepomixRunner()
            const configs = await runner.getConfigs(answers.mode)
            return configs.map((config) => ({
              name: `${config.name} (${config.content.description || 'No description'})`,
              value: config,
              checked: false,
            }))
          },
        },
      ],
      action: async (answers) => {
        if (answers.selectedConfigs?.length) {
          const runner = new RepomixRunner()
          await runner.runConfigs(answers.selectedConfigs)
        }
      },
    },
  ],
}
