import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

@Injectable()
export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    dotenv.config();
    this.envConfig = process.env;
  }

  get(key: string): string {
    const value = this.envConfig[key];
    if (!value) {
      throw new Error(`Configuration key "${key}" is not defined`);
    }
    return value;
  }

  getOptional(key: string, defaultValue: string = ''): string {
    return this.envConfig[key] || defaultValue;
  }

  getNumber(key: string): number {
    const value = this.get(key);
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
      throw new Error(`Configuration key "${key}" is not a valid number`);
    }
    return parsed;
  }

  getBoolean(key: string): boolean {
    const value = this.get(key).toLowerCase();
    return value === 'true' || value === '1';
  }
}
