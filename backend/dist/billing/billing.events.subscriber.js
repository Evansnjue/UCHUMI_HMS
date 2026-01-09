var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var BillingEventsSubscriber_1;
import { Injectable, Logger } from '@nestjs/common';
import { EventBusService } from '../auth/event-bus.service';
let BillingEventsSubscriber = BillingEventsSubscriber_1 = class BillingEventsSubscriber {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.logger = new Logger(BillingEventsSubscriber_1.name);
        this.eventBus.subscribe('InvoiceGenerated', this.handleInvoiceGenerated.bind(this));
        this.eventBus.subscribe('PaymentReceived', this.handlePaymentReceived.bind(this));
    }
    handleInvoiceGenerated(payload) {
        this.logger.log(`Invoice generated ${payload.invoiceId} total=${payload.totalAmount}`);
        // hook: notify patient, billing system, RN
    }
    handlePaymentReceived(payload) {
        this.logger.log(`Payment received ${payload.paymentId} invoice=${payload.invoiceId} amount=${payload.amount}`);
        // hook: update external finance system
    }
};
BillingEventsSubscriber = BillingEventsSubscriber_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [EventBusService])
], BillingEventsSubscriber);
export { BillingEventsSubscriber };
//# sourceMappingURL=billing.events.subscriber.js.map