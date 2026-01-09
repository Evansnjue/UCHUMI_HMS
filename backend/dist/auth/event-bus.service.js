var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EventBusService_1;
import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
/**
 * Minimal Redis-backed event bus with publish/subscribe semantics.
 * In production you might integrate with a message broker (NATS, Kafka) and include
 * retry, DLQ, idempotency and schema validation. This service is typed for events
 * and provides local in-memory hooks for tests.
 */
let EventBusService = EventBusService_1 = class EventBusService {
    constructor() {
        this.logger = new Logger(EventBusService_1.name);
        this.redis = null;
        this.listeners = new Map();
        const url = process.env.REDIS_URL || null;
        if (url)
            this.redis = new Redis(url);
    }
    subscribe(eventName, handler) {
        const arr = this.listeners.get(eventName) ?? [];
        arr.push(handler);
        this.listeners.set(eventName, arr);
        // return unsubscribe
        return () => {
            const curr = this.listeners.get(eventName) ?? [];
            this.listeners.set(eventName, curr.filter((h) => h !== handler));
        };
    }
    async publish(eventName, payload) {
        this.logger.debug(`Publishing event ${eventName}`);
        if (this.redis) {
            await this.redis.publish(`events:${eventName}`, JSON.stringify(payload));
        }
        else {
            // Fallback to console for dev/test
            this.logger.log(`Event ${eventName} payload: ${JSON.stringify(payload)}`);
        }
        // call local listeners synchronously
        const handlers = this.listeners.get(eventName) ?? [];
        for (const h of handlers) {
            try {
                h(payload);
            }
            catch (err) {
                this.logger.error('Event handler error', err);
            }
        }
    }
};
EventBusService = EventBusService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], EventBusService);
export { EventBusService };
//# sourceMappingURL=event-bus.service.js.map