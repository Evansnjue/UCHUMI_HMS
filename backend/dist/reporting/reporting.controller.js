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
import { ReportingService } from './reporting.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateTemplateDto } from './dto/create-template.dto';
import { GenerateReportDto } from './dto/generate-report.dto';
let ReportingController = class ReportingController {
    constructor(svc) {
        this.svc = svc;
    }
    async createTemplate(dto, req) {
        return this.svc.createTemplate(dto, req.user.id);
    }
    async listTemplates(department) {
        return this.svc.listTemplates(department);
    }
    async generateReport(dto, req) {
        return this.svc.generateReport(dto, req.user.id);
    }
    async getReport(id, req) {
        const roles = req.user?.roles?.map((r) => r.name || r) || [];
        return this.svc.fetchReport(id, roles);
    }
    async listReports(department, start, end) {
        return this.svc.listReports({ department, start, end });
    }
};
__decorate([
    Post('templates'),
    Roles('Admin', 'HR'),
    __param(0, Body()),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateTemplateDto, Object]),
    __metadata("design:returntype", Promise)
], ReportingController.prototype, "createTemplate", null);
__decorate([
    Get('templates'),
    Roles('Admin', 'HR'),
    __param(0, Query('department')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportingController.prototype, "listTemplates", null);
__decorate([
    Post('generate'),
    Roles('Admin', 'HR'),
    __param(0, Body()),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GenerateReportDto, Object]),
    __metadata("design:returntype", Promise)
], ReportingController.prototype, "generateReport", null);
__decorate([
    Get(':id'),
    Roles('Admin', 'HR', 'Doctor', 'Receptionist', 'Pharmacist'),
    __param(0, Param('id')),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReportingController.prototype, "getReport", null);
__decorate([
    Get(),
    Roles('Admin', 'HR'),
    __param(0, Query('department')),
    __param(1, Query('start')),
    __param(2, Query('end')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ReportingController.prototype, "listReports", null);
ReportingController = __decorate([
    Controller('reporting'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [ReportingService])
], ReportingController);
export { ReportingController };
//# sourceMappingURL=reporting.controller.js.map