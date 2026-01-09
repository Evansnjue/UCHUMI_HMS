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
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PatientNumberService } from './patient-number.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
let PatientNumberController = class PatientNumberController {
    constructor(svc) {
        this.svc = svc;
    }
    async generate(body) {
        return { number: await this.svc.generate(body.type) };
    }
};
__decorate([
    Roles('Receptionist', 'Admin'),
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientNumberController.prototype, "generate", null);
PatientNumberController = __decorate([
    Controller('patients/numbers'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [PatientNumberService])
], PatientNumberController);
export { PatientNumberController };
//# sourceMappingURL=patient-number.controller.js.map