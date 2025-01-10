// src/formatters/json.ts
import { BaseFormatter, FormatterOptions } from './base'

export class JsonFormatter extends BaseFormatter {
  async format(results: PluginResult[], options?: FormatterOptions): Promise<string> {
    // Placeholder: Format results as JSON
    return JSON.stringify(results)
  }
}
