var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Attendance } from './entities/attendance.entity';
import { Payroll } from './entities/payroll.entity';
import { HRService } from './hr.service';
import { HRController } from './hr.controller';
import { HRSubscriber } from './subscribers/hr.subscriber';
let HRModule = class HRModule {
};
HRModule = __decorate([
    Module({
        imports: [TypeOrmModule.forFeature([Employee, Attendance, Payroll])],
        providers: [HRService, HRSubscriber],
        controllers: [HRController],
        exports: [HRService],
    })
], HRModule);
export { HRModule };
//# sourceMappingURL=hr.module.js.map