import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consultation } from './entities/consultation.entity';
import { Prescription } from './entities/prescription.entity';
import { PrescriptionItem } from './entities/prescription-item.entity';
import { Drug } from './entities/drug.entity';
import { DrugCategory } from './entities/drug-category.entity';
import { LabRequest } from './entities/lab-request.entity';
import { ClinicalService } from './clinical.service';
import { ClinicalController } from './clinical.controller';
import { EventBusService } from '../auth/event-bus.service';
import { ClinicalAdminController } from './clinical.admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Consultation, Prescription, PrescriptionItem, Drug, DrugCategory, LabRequest])],
  providers: [ClinicalService, EventBusService],
  controllers: [ClinicalController, ClinicalAdminController],
  exports: [ClinicalService],
})
export class ClinicalModule {}
