import { Injectable, Logger } from '@nestjs/common';
import { EventBusService } from '../../auth/event-bus.service';

@Injectable()
export class ProcurementSubscriber {
  private readonly logger = new Logger(ProcurementSubscriber.name);

  constructor(private eventBus: EventBusService) {
    this.eventBus.subscribe('PurchaseOrderCreated', this.onPurchaseOrderCreated.bind(this));
    this.eventBus.subscribe('InsuranceClaimProcessed', this.onInsuranceClaimProcessed.bind(this));
  }

  onPurchaseOrderCreated(payload: any) {
    this.logger.log(`Purchase order created: ${payload.purchaseOrderId} supplier=${payload.supplierId} total=${payload.totalAmount}`);
    // TODO: send PO to supplier via email/webhook, create logistics task
  }

  onInsuranceClaimProcessed(payload: any) {
    this.logger.log(`Insurance claim processed: ${payload.claimId} status=${payload.status}`);
    // TODO: notify billing and patient portals
  }
}
