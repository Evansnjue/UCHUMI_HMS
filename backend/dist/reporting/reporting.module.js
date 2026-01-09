var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { ReportTemplate } from './entities/report-template.entity';
import { ReportingService } from './reporting.service';
import { ReportingController } from './reporting.controller';
import { ReportingSubscriber } from './subscribers/reporting.subscriber';
let ReportingModule = class ReportingModule {
};
ReportingModule = __decorate([
    Module({
        imports: [TypeOrmModule.forFeature([Report, ReportTemplate])],
        providers: [ReportingService, ReportingSubscriber],
        controllers: [ReportingController],
        exports: [ReportingService],
    })
], ReportingModule);
export { ReportingModule };
//# sourceMappingURL=reporting.module.js.map