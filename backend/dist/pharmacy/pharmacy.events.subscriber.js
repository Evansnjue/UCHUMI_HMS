var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PharmacyEventsSubscriber_1;
import { Injectable, Logger } from '@nestjs/common';
import { EventBusService } from '../auth/event-bus.service';
let PharmacyEventsSubscriber = PharmacyEventsSubscriber_1 = class PharmacyEventsSubscriber {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.logger = new Logger(PharmacyEventsSubscriber_1.name);
        this.eventBus.subscribe('StockUpdated', this.handleStockUpdated.bind(this));
        this.eventBus.subscribe('DrugDispensed', this.handleDrugDispensed.bind(this));
    }
    handleStockUpdated(payload) {
        this.logger.log(`Stock updated for drug ${payload.drugId} newQty=${payload.newQuantity}`);
        // Additional reconciliation, alerts, or metrics hooks can be added here
    }
    handleDrugDispensed(payload) {
        this.logger.log(`Drug dispensed: ${payload.drugId} qty=${payload.quantity} by pharmacist ${payload.pharmacistId}`);
    }
};
PharmacyEventsSubscriber = PharmacyEventsSubscriber_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [EventBusService])
], PharmacyEventsSubscriber);
export { PharmacyEventsSubscriber };
//# sourceMappingURL=pharmacy.events.subscriber.js.map