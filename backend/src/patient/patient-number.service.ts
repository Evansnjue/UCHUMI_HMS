import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

/**
 * Provides atomic, sequential patient number generation using Redis INCR.
 * Fallbacks (not implemented here) could use DB sequences when Redis is not available.
 */
@Injectable()
export class PatientNumberService {
  private redis: Redis | null = null;

  constructor() {
    const url = process.env.REDIS_URL || null;
    if (url) this.redis = new Redis(url);
  }

  /**
   * Generate a new number for a given type ('OPD' or 'IPD') and return a formatted string, e.g. 'OPD-000001'.
   */
  async generate(type: 'OPD' | 'IPD') {
    const key = `counters:patient:${type}`;
    if (!this.redis) {
      // Local fallback: use timestamp-based unique string
      const fallback = `${type}-${Date.now()}`;
      return fallback;
    }
    const n = await this.redis.incr(key);
    const formatted = `${type}-${String(n).padStart(6, '0')}`;
    return formatted;
  }
}
