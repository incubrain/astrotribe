import depcheck from 'depcheck'

export function analyzeDependencies() {
  const options = {
    // Options can be customized as needed
  }

  depcheck(process.cwd(), options, (unused) => {
    console.log('Unused dependencies:')
    console.log(unused.dependencies) // Unused dependencies
    console.log('Unused devDependencies:')
    console.log(unused.devDependencies) // Unused devDependencies
  })
}
