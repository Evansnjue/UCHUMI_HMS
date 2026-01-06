import { Injectable, Logger } from '@nestjs/common';
import { EventBusService } from '../auth/event-bus.service';

@Injectable()
export class PharmacyEventsSubscriber {
  private readonly logger = new Logger(PharmacyEventsSubscriber.name);

  constructor(private eventBus: EventBusService) {
    this.eventBus.subscribe('StockUpdated', this.handleStockUpdated.bind(this));
    this.eventBus.subscribe('DrugDispensed', this.handleDrugDispensed.bind(this));
  }

  handleStockUpdated(payload: any) {
    this.logger.log(`Stock updated for drug ${payload.drugId} newQty=${payload.newQuantity}`);
    // Additional reconciliation, alerts, or metrics hooks can be added here
  }

  handleDrugDispensed(payload: any) {
    this.logger.log(`Drug dispensed: ${payload.drugId} qty=${payload.quantity} by pharmacist ${payload.pharmacistId}`);
  }
}
