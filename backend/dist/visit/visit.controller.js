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
import { Controller, Post, Body, UseGuards, Param, Get } from '@nestjs/common';
import { VisitService } from './visit.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
let VisitController = class VisitController {
    constructor(svc) {
        this.svc = svc;
    }
    async create(dto) {
        return this.svc.create(dto);
    }
    async complete(id) {
        return this.svc.complete(id);
    }
    async getQueue(department) {
        return this.svc.getQueue(department);
    }
    async next(department) {
        return this.svc.nextInQueue(department);
    }
    async history(patientId) {
        return this.svc.historyForPatient(patientId);
    }
};
__decorate([
    Roles('Receptionist', 'Doctor', 'Admin'),
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateVisitDto]),
    __metadata("design:returntype", Promise)
], VisitController.prototype, "create", null);
__decorate([
    Roles('Receptionist', 'Doctor', 'Admin'),
    Post(':id/complete'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VisitController.prototype, "complete", null);
__decorate([
    Roles('Receptionist', 'Doctor', 'Admin'),
    Get('queue/:department'),
    __param(0, Param('department')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VisitController.prototype, "getQueue", null);
__decorate([
    Roles('Receptionist', 'Doctor', 'Admin'),
    Post('queue/:department/next'),
    __param(0, Param('department')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VisitController.prototype, "next", null);
__decorate([
    Roles('Receptionist', 'Doctor', 'Admin'),
    Get('patient/:id/history'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VisitController.prototype, "history", null);
VisitController = __decorate([
    Controller('visits'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [VisitService])
], VisitController);
export { VisitController };
//# sourceMappingURL=visit.controller.js.map