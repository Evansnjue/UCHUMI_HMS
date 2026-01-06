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

@Module({
  imports: [TypeOrmModule.forFeature([Supplier, PurchaseOrder, PurchaseOrderItem, InsuranceClaim])],
  providers: [ProcurementService, InsuranceService, ProcurementSubscriber],
  controllers: [ProcurementController, InsuranceController],
  exports: [ProcurementService, InsuranceService],
})
export class ProcurementModule {}
