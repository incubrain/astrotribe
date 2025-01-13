// src/core/services/cache.service.ts
import { RedisClient, KeyManager, QueueManager } from '@ib/cache';
import { CustomLogger } from './logger.service';

interface CacheConfig {
  host?: string;
  port?: number;
  password?: string;
  defaultTTL?: number | string;
}

interface RunData {
  id: string;
  startTime: number;
  status: 'running' | 'completed' | 'failed';
  steps: {
    name: string;
    status: string;
    startTime: number;
    endTime?: number;
    error?: any;
  }[];
  error?: {
    message: string;
    stack?: string;
  };
}

export class CacheService {
  private client: RedisClient;
  private keyManager: KeyManager;
  private successTTL: number = 60 * 60 * 24;    // 24 hours
  private failureTTL: number = 60 * 60 * 72;    // 72 hours
  private readonly PREFIXES = {
    JOB: 'job',
    AGENT: 'agent',
    METRICS: 'metrics'
  };

  constructor(
    private readonly logger: CustomLogger,
    config: CacheConfig = {}
  ) {
    this.logger.setDomain('cache');
    
    // Initialize Redis client
    this.client = RedisClient.getInstance({
      host: config.host || process.env.REDIS_HOST,
      port: config.port || parseInt(process.env.REDIS_PORT || '6379'),
      password: config.password || process.env.REDIS_PASSWORD
    });

    // Initialize key manager with default settings
    this.keyManager = new KeyManager(this.client, {
      ttl: config.defaultTTL || '24h'
    });

    // Setup connection monitoring
    this.monitorConnection();
  }

  private monitorConnection(): void {
    this.client.on('error', (error) => {
      this.logger.error('Redis connection error', { error });
    });

    this.client.on('connect', () => {
      this.logger.info('Redis connected');
    });
  }

  // Run caching methods
  async cacheRunStart(type: 'job' | 'agent', name: string, runId: string): Promise<void> {
    const key = this.buildKey(type, name, 'run', runId);
    const data: RunData = {
      id: runId,
      startTime: Date.now(),
      status: 'running',
      steps: []
    };

    await this.keyManager.set(key, data, { ttl: this.successTTL });
    await this.setLatestRun(type, name, runId);
  }

  async cacheRunStep(
    type: 'job' | 'agent',
    name: string,
    runId: string,
    step: {
      name: string;
      status: string;
      error?: any;
    }
  ): Promise<void> {
    const key = this.buildKey(type, name, 'run', runId);
    const data = await this.keyManager.get<RunData>(key);
    
    if (data) {
      data.steps.push({
        ...step,
        startTime: Date.now()
      });
      await this.keyManager.set(key, data);
    }
  }

  async cacheRunComplete(
    type: 'job' | 'agent',
    name: string,
    runId: string,
    success: boolean,
    error?: Error
  ): Promise<void> {
    const key = this.buildKey(type, name, 'run', runId);
    const data = await this.keyManager.get<RunData>(key);
    
    if (data) {
      data.status = success ? 'completed' : 'failed';
      if (error) {
        data.error = {
          message: error.message,
          stack: error.stack
        };
      }

      // Set appropriate TTL based on status
      const ttl = success ? this.successTTL : this.failureTTL;
      await this.keyManager.set(key, data, { ttl });
    }
  }

  // Helper methods
  private async setLatestRun(type: 'job' | 'agent', name: string, runId: string): Promise<void> {
    const key = this.buildKey(type, name, 'latest');
    await this.keyManager.set(key, runId);
  }

  private buildKey(...parts: string[]): string {
    return parts.join(':');
  }

  // Public retrieval methods
  async getLatestRun(type: 'job' | 'agent', name: string): Promise<RunData | null> {
    const latestKey = this.buildKey(type, name, 'latest');
    const runId = await this.keyManager.get<string>(latestKey);
    
    if (runId) {
      const runKey = this.buildKey(type, name, 'run', runId);
      return this.keyManager.get<RunData>(runKey);
    }
    
    return null;
  }

  async getRun(type: 'job' | 'agent', name: string, runId: string): Promise<RunData | null> {
    const key = this.buildKey(type, name, 'run', runId);
    return this.keyManager.get<RunData>(key);
  }

  // Generic cache methods
  async set(key: string, value: any, ttl?: number | string): Promise<void> {
    await this.keyManager.set(key, value, { ttl });
  }

  async get<T>(key: string): Promise<T | null> {
    return this.keyManager.get<T>(key);
  }

  async delete(key: string): Promise<void> {
    await this.keyManager.delete(key);
  }

  // Cleanup methods
  async cleanup(): Promise<void> {
    // Implement periodic cleanup of old cache entries
    const pattern = `${this.PREFIXES.JOB}:*`;
    const keys = await this.client.getClient().keys(pattern);
    
    for (const key of keys) {
      const data = await this.keyManager.get<RunData>(key);
      if (data && data.status !== 'running') {
        const ttl = await this.client.getClient().ttl(key);
        if (ttl <= 0) {
          await this.keyManager.delete(key);
        }
      }
    }
  }
}