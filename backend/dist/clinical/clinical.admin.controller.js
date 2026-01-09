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
import { Controller, Post, Body, UseGuards, Get, Param, Patch } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ClinicalService } from './clinical.service';
let ClinicalAdminController = class ClinicalAdminController {
    constructor(svc) {
        this.svc = svc;
    }
    async listCategories() {
        return this.svc.listCategories();
    }
    async createCategory(body) {
        return this.svc.createCategory(body.name, body.dailyLimit || 0);
    }
    async updateCategory(id, body) {
        return this.svc.updateCategory(id, body);
    }
    async setDoctorLimit(body) {
        return this.svc.setDoctorLimit(body.doctorId, body.categoryId, body.dailyLimit);
    }
    async getDoctorLimits(doctorId) {
        return this.svc.getDoctorLimits(doctorId);
    }
};
__decorate([
    Get('drug-categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClinicalAdminController.prototype, "listCategories", null);
__decorate([
    Post('drug-categories'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClinicalAdminController.prototype, "createCategory", null);
__decorate([
    Patch('drug-categories/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClinicalAdminController.prototype, "updateCategory", null);
__decorate([
    Post('doctor-limits'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClinicalAdminController.prototype, "setDoctorLimit", null);
__decorate([
    Get('doctor-limits/:doctorId'),
    __param(0, Param('doctorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClinicalAdminController.prototype, "getDoctorLimits", null);
ClinicalAdminController = __decorate([
    Controller('clinical/admin'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('Admin'),
    __metadata("design:paramtypes", [ClinicalService])
], ClinicalAdminController);
export { ClinicalAdminController };
//# sourceMappingURL=clinical.admin.controller.js.map