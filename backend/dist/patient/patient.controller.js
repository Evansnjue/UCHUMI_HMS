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
import { Controller, Post, Body, Get, Query, Param, Patch, UseGuards } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { SearchPatientDto } from './dto/search-patient.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
/**
 * Patient endpoints are protected. Only Receptionist, Doctor or Admin can create, update or search patients.
 */
let PatientController = class PatientController {
    constructor(svc) {
        this.svc = svc;
    }
    async create(dto) {
        return this.svc.create(dto);
    }
    async search(q) {
        return this.svc.search(q.query, q.department);
    }
    async get(id) {
        return this.svc.findById(id);
    }
    async update(id, dto) {
        return this.svc.update(id, dto);
    }
};
__decorate([
    Roles('Receptionist', 'Doctor', 'Admin'),
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreatePatientDto]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "create", null);
__decorate([
    Roles('Receptionist', 'Doctor', 'Admin'),
    Get(),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SearchPatientDto]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "search", null);
__decorate([
    Roles('Receptionist', 'Doctor', 'Admin'),
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "get", null);
__decorate([
    Roles('Receptionist', 'Doctor', 'Admin'),
    Patch(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdatePatientDto]),
    __metadata("design:returntype", Promise)
], PatientController.prototype, "update", null);
PatientController = __decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('patients'),
    __metadata("design:paramtypes", [PatientService])
], PatientController);
export { PatientController };
//# sourceMappingURL=patient.controller.js.map