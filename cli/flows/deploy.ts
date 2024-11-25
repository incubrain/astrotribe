// Example of another CLI flow:
// cli/flows/deploy.ts
export const deployFlow: CLIFlow = {
  id: 'deploy',
  name: 'Deployment Manager',
  description: 'Deploy applications to different environments',
  initialStep: 'select-app',
  steps: [
    {
      id: 'select-app',
      questions: [
        {
          type: 'list',
          name: 'app',
          message: 'Select application:',
          choices: async () => {
            // Get apps from your system
            return ['app1', 'app2', 'app3']
          },
        },
      ],
      next: () => 'select-env',
    },
    {
      id: 'select-env',
      questions: [
        {
          type: 'list',
          name: 'environment',
          message: 'Select environment:',
          choices: ['dev', 'staging', 'prod'],
        },
        {
          type: 'confirm',
          name: 'confirmDeploy',
          message: (answers) => `Deploy ${answers.app} to ${answers.environment}?`,
          default: false,
          when: (answers) => answers.environment === 'prod',
        },
      ],
      action: async (answers) => {
        if (answers.environment !== 'prod' || answers.confirmDeploy) {
          // Deploy logic here
        }
      },
    },
  ],
}
