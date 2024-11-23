import inquirer from 'inquirer'

async function confirmAction(message: string): Promise<boolean> {
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: message,
      default: false,
    },
  ])
  return confirm
}
