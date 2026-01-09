var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PharmacyService } from './pharmacy.service';
import { PharmacyController } from './pharmacy.controller';
import { DispensedDrug } from './entities/dispensed-drug.entity';
import { Stock } from './entities/stock.entity';
import { Prescription } from '../clinical/entities/prescription.entity';
import { PrescriptionItem } from '../clinical/entities/prescription-item.entity';
import { DoctorDrugLimit } from '../clinical/entities/doctor-drug-limit.entity';
import { EventBusService } from '../auth/event-bus.service';
import { PharmacyEventsSubscriber } from './pharmacy.events.subscriber';
import { PharmacyStockService } from './pharmacy.stock.service';
import { StockReconciliationService } from './stock-reconciliation.service';
let PharmacyModule = class PharmacyModule {
};
PharmacyModule = __decorate([
    Module({
        imports: [TypeOrmModule.forFeature([DispensedDrug, Stock, Prescription, PrescriptionItem, DoctorDrugLimit])],
        providers: [PharmacyService, EventBusService, PharmacyEventsSubscriber, PharmacyStockService, StockReconciliationService],
        controllers: [PharmacyController],
        exports: [PharmacyService, PharmacyStockService],
    })
], PharmacyModule);
export { PharmacyModule };
//# sourceMappingURL=pharmacy.module.js.map