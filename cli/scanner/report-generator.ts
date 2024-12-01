// /report-generator.ts
import type {
  ScanResult,
  ProjectReport,
  PluginReportConfig,
  PluginSummary,
  WorkspaceReport,
  Recommendation,
} from './types'

export class ReportGenerator {
  private pluginConfigs: Map<string, PluginReportConfig>

  constructor(pluginConfigs: PluginReportConfig[]) {
    this.pluginConfigs = new Map(pluginConfigs.map((config) => [config.name, config]))
  }

  private async generateProjectReport(
    projectName: string,
    projectType: 'nuxt' | 'node',
    results: ScanResult[],
  ): Promise<ProjectReport> {
    const pluginResults: Record<string, PluginSummary> = {}
    let totalScore = 0
    let totalWeight = 0

    for (const result of results) {
      if (!result.success) continue

      const config = this.pluginConfigs.get(result.pluginName)
      if (!config) continue

      const summary = config.summarize(result.data)
      pluginResults[result.pluginName] = summary

      totalScore += summary.score * config.weight
      totalWeight += config.weight
    }

    const overallScore = totalWeight > 0 ? totalScore / totalWeight : 0
    const recommendations = this.generateProjectRecommendations(pluginResults)

    return {
      name: projectName,
      type: projectType,
      overallScore,
      pluginResults,
      recommendations,
    }
  }

  public async generateWorkspaceReport(
    results: Record<string, ScanResult[]>,
  ): Promise<WorkspaceReport> {
    const projects: ProjectReport[] = []
    const projectTypes = { nuxt: 0, node: 0 }
    const criticalIssues = { total: 0, byType: {} as Record<string, number> }

    // Generate individual project reports
    for (const [projectName, projectResults] of Object.entries(results)) {
      const projectType = this.determineProjectType(projectResults)
      const projectReport = await this.generateProjectReport(
        projectName,
        projectType,
        projectResults,
      )

      projects.push(projectReport)
      projectTypes[projectType]++

      // Track critical issues
      this.updateCriticalIssues(projectReport, criticalIssues)
    }

    // Generate workspace-level recommendations
    const recommendations = this.generateWorkspaceRecommendations(projects)

    // Calculate overall health
    const overallHealth = this.calculateOverallHealth(projects)

    return {
      timestamp: new Date().toISOString(),
      totalProjects: projects.length,
      projectTypes,
      overallHealth,
      projects,
      criticalIssues,
      recommendations,
    }
  }

  private determineProjectType(results: ScanResult[]): 'nuxt' | 'node' {
    // Implementation based on your project type detection logic
    return 'node'
  }

  private updateCriticalIssues(
    projectReport: ProjectReport,
    criticalIssues: WorkspaceReport['criticalIssues'],
  ): void {
    Object.entries(projectReport.pluginResults).forEach(([pluginName, summary]) => {
      const criticalCount = summary.issues.filter((issue) => issue.severity === 'critical').length

      if (criticalCount > 0) {
        criticalIssues.byType[pluginName] = (criticalIssues.byType[pluginName] || 0) + criticalCount
        criticalIssues.total += criticalCount
      }
    })
  }

  private generateProjectRecommendations(
    pluginResults: Record<string, PluginSummary>,
  ): Recommendation[] {
    const recommendations: Recommendation[] = []

    for (const [pluginName, summary] of Object.entries(pluginResults)) {
      const config = this.pluginConfigs.get(pluginName)
      if (!config) continue

      // Generate recommendations based on issues and thresholds
      if (summary.score < config.thresholds.critical) {
        recommendations.push({
          type: pluginName,
          message: `Critical: Score below threshold (${summary.score})`,
          priority: 'high',
          context: { score: summary.score, threshold: config.thresholds.critical },
        })
      }

      // Add plugin-specific recommendations based on issues
      summary.issues
        .filter((issue) => issue.severity === 'critical')
        .forEach((issue) => {
          recommendations.push({
            type: pluginName,
            message: issue.message,
            priority: 'high',
          })
        })
    }

    return recommendations
  }

  private generateWorkspaceRecommendations(projects: ProjectReport[]): Recommendation[] {
    const recommendations: Recommendation[] = []

    // Identify workspace-wide patterns and issues
    this.pluginConfigs.forEach((config, pluginName) => {
      const projectsWithIssues = projects.filter(
        (project) => project.pluginResults[pluginName]?.score < config.thresholds.warning,
      )

      if (projectsWithIssues.length > projects.length / 3) {
        recommendations.push({
          type: pluginName,
          message: `Widespread issues detected in ${projectsWithIssues.length} projects`,
          priority: 'high',
          context: {
            affectedProjects: projectsWithIssues.map((p) => p.name),
          },
        })
      }
    })

    return recommendations
  }

  private calculateOverallHealth(projects: ProjectReport[]): WorkspaceReport['overallHealth'] {
    const score = projects.reduce((sum, project) => sum + project.overallScore, 0) / projects.length

    return {
      score: Math.round(score * 100) / 100,
      trend: this.calculateTrend(),
    }
  }

  private calculateTrend(): 'improving' | 'declining' | 'stable' {
    // Implementation would require historical data
    return 'stable'
  }
}
