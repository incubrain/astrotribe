// utils/templating.ts
export function applyPlaceholders(
  template: string,
  placeholders?: Record<string, unknown>
): string {
  if (!placeholders) return template;
  return Object.entries(placeholders).reduce((acc, [key, val]) => {
    const re = new RegExp(`{{${key}}}`, 'g');
    return acc.replace(re, String(val));
  }, template);
}

// Tool instruction parsing:
// Suppose the LLM can output a line like "#useTool:toolName:{"some":"input"}"
export function parseToolInstruction(
  output: string
): { toolName: string; toolInput: unknown } | null {
  const match = output.match(/#useTool:(\w+):({.*})/);
  if (!match) return null;
  const toolName = match[1];
  try {
    const toolInput = JSON.parse(match[2]);
    return { toolName, toolInput };
  } catch {
    return null;
  }
}
