

// src/plugins/extensions/base.ts
import { Plugin, PluginResult } from '../../core/interfaces/Plugin'

export abstract class ExtensionPlugin implements Plugin {
  name: string
  description: string
  version: string

  constructor(name: string, description: string, version: string) {
    this.name = name
    this.description = description
    this.version = version
  }

  abstract initialize(): Promise<void>
  abstract execute(): Promise<PluginResult>
  abstract cleanup(): Promise<void>
}
