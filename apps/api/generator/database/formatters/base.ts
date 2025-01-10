// src/formatters/base.ts
export interface FormatterOptions {
  pretty?: boolean
  includeMetadata?: boolean
}

export abstract class BaseFormatter {
  abstract format(results: PluginResult[], options?: FormatterOptions): Promise<string>
}
