// stores/agentMonitoring.ts
import { useRuntimeConfig } from 'nuxt/app'
import { defineStore } from 'pinia'

// types/agents.ts
export interface AgentOverview {
  name: string
  status: 'idle' | 'running' | 'failed'
  lastRunAt: string
  stats24h: {
    total: number
    success: number
    failed: number
    avgDuration: number
  }
  lastError?: {
    message: string
    timestamp: string
    type?: string
  }
}

export interface AgentRun {
  id: string
  status: 'running' | 'completed' | 'failed'
  startTime: number
  steps: {
    name: string
    status: string
    startTime: number
    endTime?: number
    error?: {
      message: string
      type: string
    }
  }[]
  error?: {
    message: string
    type: string
  }
}

export interface AgentMetrics {
  total: number
  success: number
  failed: number
  avgDuration: number
}

interface State {
  agents: AgentOverview[]
  selectedAgent: string | null
  latestRun: AgentRun | null
  metrics: AgentMetrics | null
  loading: boolean
  error: string | null
}

export const useAgentStore = defineStore('agentMonitoring', () => {
  const { apiURL } = useRuntimeConfig()
  // State
  const state = reactive<State>({
    agents: [],
    selectedAgent: null,
    latestRun: null,
    metrics: null,
    loading: false,
    error: null,
  })

  // Getters
  const getAgentByName = computed(() => {
    return (name: string) => state.agents.find((a) => a.name === name)
  })

  // Actions
  async function fetchAgents() {
    state.loading = true
    state.error = null
    try {
      const data = await $fetch(`${apiURL}/api/v1/agents`)
      state.agents = data as AgentOverview[]
    } catch (error: any) {
      state.error = error.message
    } finally {
      state.loading = false
    }
  }

  async function fetchLatestRun(agentName: string) {
    state.loading = true
    try {
      const data = await $fetch(`${apiURL}/api/v1/agents/${agentName}/latest`)
      state.latestRun = data as AgentRun
    } catch (error: any) {
      state.error = error.message
    } finally {
      state.loading = false
    }
  }

  async function fetchMetrics(agentName: string, hours: number = 24) {
    try {
      const data = await $fetch(`${apiURL}/api/v1/agents/${agentName}/metrics?hours=${hours}`)
      state.metrics = data as AgentMetrics
    } catch (error: any) {
      state.error = error.message
    }
  }

  return {
    state,
    // Getters
    getAgentByName,
    // Actions
    fetchAgents,
    fetchLatestRun,
    fetchMetrics,
  }
})
