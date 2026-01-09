import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

/**
 * Minimal Redis-backed event bus with publish/subscribe semantics.
 * In production you might integrate with a message broker (NATS, Kafka) and include
 * retry, DLQ, idempotency and schema validation. This service is typed for events
 * and provides local in-memory hooks for tests.
 */
@Injectable()
export class EventBusService {
  private readonly logger = new Logger(EventBusService.name);
  private redis: Redis | null = null;

  constructor() {
    const url = process.env.REDIS_URL || null;
    if (url) this.redis = new Redis(url);
  }

  private listeners: Map<string, Array<(payload: any) => void>> = new Map();

  subscribe(eventName: string, handler: (payload: any) => void) {
    const arr = this.listeners.get(eventName) ?? [];
    arr.push(handler);
    this.listeners.set(eventName, arr);
    // return unsubscribe
    return () => {
      const curr = this.listeners.get(eventName) ?? [];
      this.listeners.set(eventName, curr.filter((h) => h !== handler));
    };
  }

  async publish(eventName: string, payload: any) {
    this.logger.debug(`Publishing event ${eventName}`);
    if (this.redis) {
      await this.redis.publish(`events:${eventName}`, JSON.stringify(payload));
    } else {
      // Fallback to console for dev/test
      this.logger.log(`Event ${eventName} payload: ${JSON.stringify(payload)}`);
    }

    // call local listeners synchronously
    const handlers = this.listeners.get(eventName) ?? [];
    for (const h of handlers) {
      try {
        h(payload);
      } catch (err) {
        this.logger.error('Event handler error', err as any);
      }
    }
  }
}
