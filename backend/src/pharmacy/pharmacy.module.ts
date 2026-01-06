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
@Module({
  imports: [TypeOrmModule.forFeature([DispensedDrug, Stock, Prescription, PrescriptionItem, DoctorDrugLimit])],
  providers: [PharmacyService, EventBusService, PharmacyEventsSubscriber, PharmacyStockService, StockReconciliationService],
  controllers: [PharmacyController],
  exports: [PharmacyService, PharmacyStockService],
})
export class PharmacyModule {}
