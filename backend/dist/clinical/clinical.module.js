var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
let ClinicalModule = class ClinicalModule {
};
ClinicalModule = __decorate([
    Module({
        imports: [TypeOrmModule.forFeature([Consultation, Prescription, PrescriptionItem, Drug, DrugCategory, LabRequest])],
        providers: [ClinicalService, EventBusService],
        controllers: [ClinicalController, ClinicalAdminController],
        exports: [ClinicalService],
    })
], ClinicalModule);
export { ClinicalModule };
//# sourceMappingURL=clinical.module.js.map