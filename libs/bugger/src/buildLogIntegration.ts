import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

/**
 * Build log integration for capturing and processing build output
 */
export class BuildLogIntegration {
  private outputPath: string
  private buildLogPath: string
  private buildCommand: string
  private buildTimestamp: string

  constructor(outputPath: string, buildCommand: string) {
    this.outputPath = outputPath
    this.buildCommand = buildCommand
    this.buildTimestamp = new Date().toISOString()
    this.buildLogPath = path.join(this.outputPath, 'build-log.txt')
  }

  /**
   * Capture build output and save to build-log.txt
   */
  public async captureBuildLog(): Promise<void> {
    try {
      console.log(`Capturing build output from command: ${this.buildCommand}`)

      // Create output directory if it doesn't exist
      if (!fs.existsSync(this.outputPath)) {
        fs.mkdirSync(this.outputPath, { recursive: true })
      }

      // Execute the build command and capture output
      const buildOutput = execSync(this.buildCommand, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'], // Capture stdout and stderr
      })

      // Write build log with metadata
      this.writeBuildLog(buildOutput)

      console.log(`Build log saved to: ${this.buildLogPath}`)
    } catch (error: any) {
      // If the build command fails, still capture the error output
      const errorOutput = error.stdout || error.stderr || error.message || 'Unknown error'
      this.writeBuildLog(errorOutput, true)
      console.error(`Build command failed: ${error.message}`)
    }
  }

  /**
   * Write build log with metadata
   */
  private writeBuildLog(output: string, isError: boolean = false): void {
    const timestamp = new Date().toLocaleString()
    const status = isError ? 'FAILED' : 'SUCCESS'

    const buildLogContent = `# Build Log
Timestamp: ${timestamp}
Command: ${this.buildCommand}
Status: ${status}
Build ID: ${this.buildTimestamp}

## Build Output
\`\`\`
${output}
\`\`\`

## Build Analysis
${this.analyzeBuildOutput(output, isError)}
`

    fs.writeFileSync(this.buildLogPath, buildLogContent)
  }

  /**
   * Analyze build output to extract errors and warnings
   */
  private analyzeBuildOutput(output: string, isError: boolean): string {
    // Extract errors and warnings using regex patterns
    const errorPattern = /error:?\s+(.+)/gi
    const warningPattern = /warning:?\s+(.+)/gi

    const errors: string[] = []
    const warnings: string[] = []

    // Extract errors
    let match
    while ((match = errorPattern.exec(output)) !== null) {
      errors.push(match[1])
    }

    // Extract warnings
    while ((match = warningPattern.exec(output)) !== null) {
      warnings.push(match[1])
    }

    // Generate analysis markdown
    let analysis = '### Summary\n\n'
    analysis += `- **Status**: ${isError ? '❌ Failed' : '✅ Success'}\n`
    analysis += `- **Errors**: ${errors.length}\n`
    analysis += `- **Warnings**: ${warnings.length}\n\n`

    if (errors.length > 0) {
      analysis += '### Errors\n\n'
      errors.forEach((error, index) => {
        analysis += `${index + 1}. ${error}\n`
      })
      analysis += '\n'
    }

    if (warnings.length > 0) {
      analysis += '### Warnings\n\n'
      warnings.forEach((warning, index) => {
        analysis += `${index + 1}. ${warning}\n`
      })
    }

    return analysis
  }

  /**
   * Get the path to the build log
   */
  public getBuildLogPath(): string {
    return this.buildLogPath
  }

  /**
   * Get build timestamp
   */
  public getBuildTimestamp(): string {
    return this.buildTimestamp
  }
}
