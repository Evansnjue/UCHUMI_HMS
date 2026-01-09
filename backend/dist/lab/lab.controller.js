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
import { Controller, Post, Body, UseGuards, Req, Get, Param } from '@nestjs/common';
import { LabService } from './lab.service';
import { CreateLabResultDto } from './dto/create-lab-result.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
let LabController = class LabController {
    constructor(svc) {
        this.svc = svc;
    }
    async createResult(dto, req) {
        return this.svc.createResult(dto, req.user);
    }
    async resultsForRequest(id) {
        return this.svc.getResultsForRequest(id);
    }
    async pending() {
        return this.svc.listPendingForDepartment('');
    }
};
__decorate([
    Roles('LabTechnician'),
    Post('results'),
    __param(0, Body()),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateLabResultDto, Object]),
    __metadata("design:returntype", Promise)
], LabController.prototype, "createResult", null);
__decorate([
    Roles('LabTechnician', 'Doctor', 'Admin'),
    Get('request/:id/results'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabController.prototype, "resultsForRequest", null);
__decorate([
    Roles('LabTechnician'),
    Get('pending'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LabController.prototype, "pending", null);
LabController = __decorate([
    Controller('lab'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [LabService])
], LabController);
export { LabController };
//# sourceMappingURL=lab.controller.js.map