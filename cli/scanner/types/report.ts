export interface PluginReportConfig {
  name: string
  weight: number
  thresholds: {
    critical: number
    warning: number
  }
  scoring: (data: unknown) => number
  summarize: (data: unknown) => PluginSummary
}

export interface PluginSummary {
  score: number
  issues: Array<{
    type: string
    severity: 'critical' | 'warning' | 'info'
    message: string
  }>
  metrics: Record<string, number | string>
}

export interface ProjectReport {
  name: string
  type: 'nuxt' | 'node'
  overallScore: number
  pluginResults: Record<string, PluginSummary>
  recommendations: Recommendation[]
}

export interface Recommendation {
  type: string
  message: string
  priority: 'high' | 'medium' | 'low'
  context?: Record<string, unknown>
}

export interface WorkspaceReport {
  timestamp: string
  totalProjects: number
  projectTypes: {
    nuxt: number
    node: number
  }
  overallHealth: {
    score: number
    trend?: 'improving' | 'declining' | 'stable'
  }
  projects: ProjectReport[]
  criticalIssues: {
    total: number
    byType: Record<string, number>
  }
  recommendations: Recommendation[]
}
