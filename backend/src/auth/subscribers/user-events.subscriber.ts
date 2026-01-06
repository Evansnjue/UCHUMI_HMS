import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class UserEventsSubscriber implements OnModuleInit {
  private readonly logger = new Logger(UserEventsSubscriber.name);
  private redis: Redis | null = null;

  onModuleInit() {
    const url = process.env.REDIS_URL || null;
    if (!url) {
      this.logger.debug('No REDIS_URL configured — user event subscriber disabled');
      return;
    }
    this.redis = new Redis(url);
    this.redis.subscribe('events:UserLoggedIn', 'events:UserRoleChanged', (err, count) => {
      if (err) this.logger.error(err.message);
      else this.logger.log(`Subscribed to user events (count=${count})`);
    });

    this.redis.on('message', (channel, message) => {
      try {
        const payload = JSON.parse(message);
        this.handle(channel.replace('events:', ''), payload);
      } catch (err) {
        this.logger.error('Failed to parse event', err.message);
      }
    });
  }

  handle(eventName: string, payload: any) {
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
}
