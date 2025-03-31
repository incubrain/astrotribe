import type { Plugin } from '../types.js'

/**
 * Plugin that calculates token count for each file
 * This is a passthrough plugin that doesn't modify content
 */
export const tokenCalculatorPlugin: Plugin = {
  name: 'tokenCalculator',
  processFileContent: (filePath, content) => {
    // This plugin doesn't modify the content, just returns it as-is
    return content
  },
}
