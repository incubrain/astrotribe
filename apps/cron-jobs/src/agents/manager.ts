// agentManager.ts
import { Agent } from './agent';
import { AgentInput, AgentOutput } from './types';

export interface PipelineStep {
  agent: Agent;
  condition?: (data: unknown) => boolean; // optional condition to run this step
}

export class AgentManager {
  private pipeline: PipelineStep[] = [];

  addStep(agent: Agent, condition?: (data: unknown) => boolean): void {
    this.pipeline.push({ agent, condition });
  }

  // Run pipeline: each step checks condition, if defined
  async runPipeline(input: AgentInput): Promise<AgentOutput> {
    let currentData = input.data;
    for (const step of this.pipeline) {
      if (!step.condition || step.condition(currentData)) {
        const result = await step.agent.execute({ data: currentData });
        currentData = result.result;
      }
    }
    return { result: currentData };
  }
}
