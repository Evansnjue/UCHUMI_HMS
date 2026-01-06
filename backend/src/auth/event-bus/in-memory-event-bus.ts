import { Injectable } from '@nestjs/common';

@Injectable()
export class InMemoryEventBus {
  public events: { name: string; payload: any }[] = [];

  async publish(name: string, payload: any) {
    this.events.push({ name, payload });
  }
}
