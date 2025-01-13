// sorter.agent.ts
import { AgentConfig } from '../types'

export const categorizationConfig: AgentConfig = {
  name: 'content-categorizer',
  taskDescription:
    'Analyze astronomy and space science article summaries to assign categories and tags',

  systemPrompt: `You are a specialized AI assistant that analyzes astronomy and space science content to assign appropriate categories and tags. Your task is to:

1. Read the provided article summary
2. Identify the primary topic and themes
3. Select the most appropriate category from the available options
4. Assign 3-5 relevant tags using the established taxonomy
5. Provide confidence scores for category and tag assignments

Follow these rules:
- Assign exactly one primary category
- Assign 3-5 tags, no more and no less
- Use only tags from the approved taxonomy
- Provide confidence scores (0-1) for each assignment
- Include brief reasoning for category selection

Your response should be a JSON object with:
{
  "category": {
    "id": number,
    "confidence": number,
    "reasoning": string
  },
  "tags": [
    {
      "name": string,
      "confidence": number
    }
  ]
}`,

  userPrompt: `Please analyze the following article summary and provide category and tag assignments:
  
Title: {{title}}
Summary: {{summary}}

Existing categories:
{{categories}}

Available tags:
{{availableTags}}`,

  // Advanced settings
  openAIModel: 'gpt-4o-mini',
  maxRetries: 2,
  timeout: 30000,

  // Output validation
  outputSchema: {
    category: {
      id: 'number',
      confidence: 'number',
      reasoning: 'string',
    },
    tags: [
      {
        name: 'string',
        confidence: 'number',
      },
    ],
  },
}
