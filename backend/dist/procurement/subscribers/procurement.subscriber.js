var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ProcurementSubscriber_1;
var _a;
import { Injectable, Logger } from '@nestjs/common';
import { EventBusService } from '../auth/event-bus.service';
let ProcurementSubscriber = ProcurementSubscriber_1 = class ProcurementSubscriber {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.logger = new Logger(ProcurementSubscriber_1.name);
        this.eventBus.subscribe('PurchaseOrderCreated', this.onPurchaseOrderCreated.bind(this));
        this.eventBus.subscribe('InsuranceClaimProcessed', this.onInsuranceClaimProcessed.bind(this));
    }
    onPurchaseOrderCreated(payload) {
        this.logger.log(`Purchase order created: ${payload.purchaseOrderId} supplier=${payload.supplierId} total=${payload.totalAmount}`);
        // TODO: send PO to supplier via email/webhook, create logistics task
    }
    onInsuranceClaimProcessed(payload) {
        this.logger.log(`Insurance claim processed: ${payload.claimId} status=${payload.status}`);
        // TODO: notify billing and patient portals
    }
};
ProcurementSubscriber = ProcurementSubscriber_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof EventBusService !== "undefined" && EventBusService) === "function" ? _a : Object])
], ProcurementSubscriber);
export { ProcurementSubscriber };
//# sourceMappingURL=procurement.subscriber.js.map