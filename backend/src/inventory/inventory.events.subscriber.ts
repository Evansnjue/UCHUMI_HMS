import { Injectable, Logger } from '@nestjs/common';
import { EventBusService } from '../auth/event-bus.service';

@Injectable()
export class InventoryEventsSubscriber {
  private readonly logger = new Logger(InventoryEventsSubscriber.name);

  constructor(private eventBus: EventBusService) {
    this.eventBus.subscribe('StockUpdated', this.handleStockUpdated.bind(this));
    this.eventBus.subscribe('StockLowAlert', this.handleStockLow.bind(this));
  }

  handleStockUpdated(payload: any) {
    this.logger.log(`Stock updated for item ${payload.itemId} newQty=${payload.newQuantity}`);
  }

  handleStockLow(payload: any) {
    this.logger.warn(`Low stock alert for item ${payload.itemId} qty=${payload.quantity} threshold=${payload.threshold}`);
    // TODO: integrate with notification service (email/SMS/webhook)
  }
}
