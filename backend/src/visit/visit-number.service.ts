import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class VisitNumberService {
  private redis: Redis | null = null;

  constructor() {
    const url = process.env.REDIS_URL || null;
    if (url) this.redis = new Redis(url);
  }

  /**
   * Generate a visit number for a given department and type (OPD/IPD). Uses Redis INCR for atomic counters per-department.
   */
  async generate(departmentCode: string, type: 'OPD' | 'IPD') {
    const key = `counters:visit:${departmentCode}:${type}`;
    if (!this.redis) return `${departmentCode}-${type}-${Date.now()}`;
    const n = await this.redis.incr(key);
    return `${departmentCode}-${type}-${String(n).padStart(5, '0')}`;
  }
}
