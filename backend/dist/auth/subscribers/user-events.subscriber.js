var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var UserEventsSubscriber_1;
import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
let UserEventsSubscriber = UserEventsSubscriber_1 = class UserEventsSubscriber {
    constructor() {
        this.logger = new Logger(UserEventsSubscriber_1.name);
        this.redis = null;
    }
    onModuleInit() {
        const url = process.env.REDIS_URL || null;
        if (!url) {
            this.logger.debug('No REDIS_URL configured — user event subscriber disabled');
            return;
        }
        this.redis = new Redis(url);
        this.redis.subscribe('events:UserLoggedIn', 'events:UserRoleChanged', (err, count) => {
            if (err)
                this.logger.error(err.message);
            else
                this.logger.log(`Subscribed to user events (count=${count})`);
        });
        this.redis.on('message', (channel, message) => {
            try {
                const payload = JSON.parse(message);
                this.handle(channel.replace('events:', ''), payload);
            }
            catch (err) {
                this.logger.error('Failed to parse event', err.message);
            }
        });
    }
    handle(eventName, payload) {
        switch (eventName) {
            case 'UserLoggedIn':
                this.logger.log(`User logged in: ${payload.userId}`);
                // e.g. update audit log, notify monitoring, enqueue session tasks
                break;
            case 'UserRoleChanged':
                this.logger.log(`User roles changed: ${payload.userId} -> ${payload.roles}`);
                // e.g. invalidate user sessions, update caches
                break;
            default:
                this.logger.debug(`Unhandled event ${eventName}`);
        }
    }
};
UserEventsSubscriber = UserEventsSubscriber_1 = __decorate([
    Injectable()
], UserEventsSubscriber);
export { UserEventsSubscriber };
//# sourceMappingURL=user-events.subscriber.js.map