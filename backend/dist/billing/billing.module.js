var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { Invoice } from './entities/invoice.entity';
import { BillingItem } from './entities/billing-item.entity';
import { Payment } from './entities/payment.entity';
import { EventBusService } from '../auth/event-bus.service';
import { BillingEventsSubscriber } from './billing.events.subscriber';
let BillingModule = class BillingModule {
};
BillingModule = __decorate([
    Module({
        imports: [TypeOrmModule.forFeature([Invoice, BillingItem, Payment])],
        providers: [BillingService, EventBusService, BillingEventsSubscriber],
        controllers: [BillingController],
        exports: [BillingService],
    })
], BillingModule);
export { BillingModule };
//# sourceMappingURL=billing.module.js.map