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
import { ClinicalService } from './clinical.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { CreateLabRequestDto } from './dto/create-lab-request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
let ClinicalController = class ClinicalController {
    constructor(svc) {
        this.svc = svc;
    }
    async createConsultation(dto, req) {
        return this.svc.createConsultation(dto, req.user);
    }
    async createPrescription(dto, req) {
        return this.svc.createPrescription(dto, req.user);
    }
    async createLabRequest(dto, req) {
        return this.svc.createLabRequest(dto, req.user);
    }
    async consultationsForPatient(id) {
        return this.svc.consultationsForPatient(id);
    }
};
__decorate([
    Roles('Doctor'),
    Post('consultations'),
    __param(0, Body()),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateConsultationDto, Object]),
    __metadata("design:returntype", Promise)
], ClinicalController.prototype, "createConsultation", null);
__decorate([
    Roles('Doctor'),
    Post('prescriptions'),
    __param(0, Body()),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreatePrescriptionDto, Object]),
    __metadata("design:returntype", Promise)
], ClinicalController.prototype, "createPrescription", null);
__decorate([
    Roles('Doctor'),
    Post('lab-requests'),
    __param(0, Body()),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateLabRequestDto, Object]),
    __metadata("design:returntype", Promise)
], ClinicalController.prototype, "createLabRequest", null);
__decorate([
    Roles('Doctor', 'Receptionist', 'Admin'),
    Get('patient/:id/consultations'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClinicalController.prototype, "consultationsForPatient", null);
ClinicalController = __decorate([
    Controller('clinical'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [ClinicalService])
], ClinicalController);
export { ClinicalController };
//# sourceMappingURL=clinical.controller.js.map