// core/storage/throttler.storage.ts
import { Injectable } from "@nestjs/common";
import { ThrottlerStorage } from "@nestjs/throttler";
import { CustomLogger } from "@core/logger/custom.logger";

interface ThrottleRecord {
  totalHits: number;
  timeToExpire: number;
}

@Injectable()
export class CustomThrottlerStorage implements ThrottlerStorage {
  private storage: Map<string, ThrottleRecord> = new Map();
  private readonly logger: CustomLogger;

  constructor() {
    this.logger = new CustomLogger("ThrottlerStorage");
  }

  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    throttlerName: string
  ): Promise<ThrottlerStorage["increment"]["arguments"]> {
    const record = this.storage.get(key) ?? {
      totalHits: 0,
      timeToExpire: Date.now() + ttl,
    };
    record.totalHits++;
    this.storage.set(key, record);

    this.logger.debug(`Increment key: ${key}, hits: ${record.totalHits}`);
    return record;
  }

  async get(key: string): Promise<ThrottleRecord | undefined> {
    this.clearExpired();
    return this.storage.get(key);
  }

  async reset(key: string): Promise<void> {
    this.storage.delete(key);
    this.logger.debug(`Reset key: ${key}`);
  }

  private clearExpired(): void {
    const now = Date.now();
    for (const [key, record] of this.storage.entries()) {
      if (record.timeToExpire <= now) {
        this.storage.delete(key);
        this.logger.debug(`Cleared expired key: ${key}`);
      }
    }
  }
}
