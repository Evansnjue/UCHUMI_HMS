import { Injectable, Logger } from '@nestjs/common';
import { EventBusService } from '../auth/event-bus.service';

@Injectable()
export class BillingEventsSubscriber {
  private readonly logger = new Logger(BillingEventsSubscriber.name);

  constructor(private eventBus: EventBusService) {
    this.eventBus.subscribe('InvoiceGenerated', this.handleInvoiceGenerated.bind(this));
    this.eventBus.subscribe('PaymentReceived', this.handlePaymentReceived.bind(this));
  }

  handleInvoiceGenerated(payload: any) {
    this.logger.log(`Invoice generated ${payload.invoiceId} total=${payload.totalAmount}`);
    // hook: notify patient, billing system, RN
  }

  handlePaymentReceived(payload: any) {
    this.logger.log(`Payment received ${payload.paymentId} invoice=${payload.invoiceId} amount=${payload.amount}`);
    // hook: update external finance system
  }
}
