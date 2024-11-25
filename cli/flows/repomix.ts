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
  name: 'Repomix Config Runner',
  description: 'Select and run repomix configurations',
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
      next: (answers: SelectModeAnswers) => {
        console.log('Selected mode:', answers.mode) // Debug log
        return answers.mode ? 'select-configs' : null
      },
    },
    {
      id: 'select-configs',
      title: 'Select Configs',
      questions: [
        {
          type: 'checkbox',
          name: 'selectedConfigs',
          message: 'Select configs to run:',
          choices: async (answers: SelectModeAnswers) => {
            console.log('Current answers:', answers) // Debug log
            if (!answers.mode) {
              throw new Error('No mode selected')
            }

            const runner = new RepomixRunner()
            const configs = await runner.getConfigs(answers.mode)
            return configs.map((config) => ({
              name: `${config.name} (${config.content.description || 'No description'})`,
              value: config,
              checked: false,
            }))
          },
        },
        {
          type: 'confirm',
          name: 'runImmediately',
          message: 'Run selected configs now?',
          default: true,
          when: (answers: SelectConfigsAnswers) => answers.selectedConfigs?.length > 0,
        },
      ],
      action: async (answers: SelectConfigsAnswers) => {
        if (answers.runImmediately && answers.selectedConfigs?.length) {
          const runner = new RepomixRunner()
          await runner.runConfigs(answers.selectedConfigs)
        }
      },
    },
  ],
}
