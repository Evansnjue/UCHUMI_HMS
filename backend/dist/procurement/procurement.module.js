var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderItem } from './entities/purchase-order-item.entity';
import { InsuranceClaim } from './entities/insurance-claim.entity';
import { ProcurementService } from './procurement.service';
import { InsuranceService } from './insurance.service';
import { ProcurementController } from './procurement.controller';
import { InsuranceController } from './insurance.controller';
import { ProcurementSubscriber } from './subscribers/procurement.subscriber';
let ProcurementModule = class ProcurementModule {
};
ProcurementModule = __decorate([
    Module({
        imports: [TypeOrmModule.forFeature([Supplier, PurchaseOrder, PurchaseOrderItem, InsuranceClaim])],
        providers: [ProcurementService, InsuranceService, ProcurementSubscriber],
        controllers: [ProcurementController, InsuranceController],
        exports: [ProcurementService, InsuranceService],
    })
], ProcurementModule);
export { ProcurementModule };
//# sourceMappingURL=procurement.module.js.map