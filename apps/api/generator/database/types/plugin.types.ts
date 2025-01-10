export interface IntrospectionResult {
  name: string
  type: string
  metadata: Record<string, unknown>
}

export interface PluginResult {
  pluginName: string
  results: IntrospectionResult[]
}

export interface Plugin {
  name: string
  description: string
  version: string
  initialize(): Promise<void>
  execute(): Promise<PluginResult>
  cleanup(): Promise<void>
}
