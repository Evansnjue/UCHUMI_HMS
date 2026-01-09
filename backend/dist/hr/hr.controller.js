var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Post, Body, UseGuards, Get, Param, Query } from '@nestjs/common';
import { HRService } from './hr.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CheckInDto, CheckOutDto } from './dto/checkin.dto';
import { GeneratePayrollDto } from './dto/payroll.dto';
let HRController = class HRController {
    constructor(svc) {
        this.svc = svc;
    }
    async createEmployee(dto) {
        return this.svc.createEmployee(dto);
    }
    async getEmployee(id) {
        return this.svc.getEmployee(id);
    }
    async checkIn(dto) {
        return this.svc.checkIn(dto);
    }
    async checkOut(dto) {
        return this.svc.checkOut(dto);
    }
    async attendanceReport(start, end) {
        return this.svc.unpaidOvertimeReport(start, end);
    }
    async generatePayroll(dto) {
        return this.svc.generatePayroll(dto);
    }
};
__decorate([
    Post('employees'),
    Roles('HR', 'Admin'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateEmployeeDto]),
    __metadata("design:returntype", Promise)
], HRController.prototype, "createEmployee", null);
__decorate([
    Get('employees/:id'),
    Roles('HR', 'Admin'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HRController.prototype, "getEmployee", null);
__decorate([
    Post('attendance/checkin'),
    Roles('HR', 'Admin', 'Receptionist'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CheckInDto]),
    __metadata("design:returntype", Promise)
], HRController.prototype, "checkIn", null);
__decorate([
    Post('attendance/checkout'),
    Roles('HR', 'Admin', 'Receptionist'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CheckOutDto]),
    __metadata("design:returntype", Promise)
], HRController.prototype, "checkOut", null);
__decorate([
    Get('attendance/report'),
    Roles('HR', 'Admin'),
    __param(0, Query('start')),
    __param(1, Query('end')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], HRController.prototype, "attendanceReport", null);
__decorate([
    Post('payroll/generate'),
    Roles('HR', 'Admin'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GeneratePayrollDto]),
    __metadata("design:returntype", Promise)
], HRController.prototype, "generatePayroll", null);
HRController = __decorate([
    Controller('hr'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [HRService])
], HRController);
export { HRController };
//# sourceMappingURL=hr.controller.js.map