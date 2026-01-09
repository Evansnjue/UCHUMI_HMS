var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visit } from './entities/visit.entity';
import { QueueEntry } from './entities/queue.entity';
import { VisitStatus } from './entities/visit-status.entity';
import { VisitService } from './visit.service';
import { VisitController } from './visit.controller';
import { VisitNumberService } from './visit-number.service';
import { EventBusService } from '../auth/event-bus.service';
import { Patient } from '../patient/entities/patient.entity';
import { Department } from '../patient/entities/department.entity';
let VisitModule = class VisitModule {
};
VisitModule = __decorate([
    Module({
        imports: [TypeOrmModule.forFeature([Visit, QueueEntry, VisitStatus, Patient, Department])],
        providers: [VisitService, VisitNumberService, EventBusService],
        controllers: [VisitController],
        exports: [VisitService],
    })
], VisitModule);
export { VisitModule };
//# sourceMappingURL=visit.module.js.map