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
import { Controller, Post, Body, UseGuards, Get, Param, Query, Req } from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateClaimDto, ProcessClaimDto } from './dto/create-claim.dto';
let InsuranceController = class InsuranceController {
    constructor(svc) {
        this.svc = svc;
    }
    async createClaim(dto, req) {
        return this.svc.createClaim(dto, req.user.id);
    }
    async processClaim(id, dto, req) {
        return this.svc.processClaim(id, dto, req.user.id);
    }
    async listClaims(status, insurer) {
        return this.svc.listClaims({ status, insurer });
    }
};
__decorate([
    Post('claims'),
    Roles('Admin', 'InsuranceOfficer'),
    __param(0, Body()),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateClaimDto, Object]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "createClaim", null);
__decorate([
    Post('claims/:id/process'),
    Roles('Admin', 'InsuranceOfficer'),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ProcessClaimDto, Object]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "processClaim", null);
__decorate([
    Get('claims'),
    Roles('Admin', 'InsuranceOfficer', 'Accountant'),
    __param(0, Query('status')),
    __param(1, Query('insurer')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "listClaims", null);
InsuranceController = __decorate([
    Controller('insurance'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [InsuranceService])
], InsuranceController);
export { InsuranceController };
//# sourceMappingURL=insurance.controller.js.map