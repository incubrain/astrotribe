import { generateDevOpsSummaries, type DevOpsSummaries } from './dev-ops'

export interface InfoResult {
  devops: DevOpsSummaries
}

export function generateInfo() {
  const devOpsSummaries = generateDevOpsSummaries()

  return {
    devops: devOpsSummaries
  }
}
