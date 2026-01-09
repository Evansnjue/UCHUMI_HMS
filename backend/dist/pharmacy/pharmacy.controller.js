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
import { Controller, Get, Param, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { FulfillPrescriptionDto } from './dto/fulfill-prescription.dto';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { PharmacyStockService } from './pharmacy.stock.service';
let PharmacyController = class PharmacyController {
    constructor(svc, stockService) {
        this.svc = svc;
        this.stockService = stockService;
    }
    /**
     * GET /pharmacy/prescriptions?status=PENDING
     * Returns pending prescriptions to be fulfilled by pharmacists.
     */
    async listPending(limit = '50', offset = '0') {
        return this.svc.listPendingPrescriptions(Number(limit), Number(offset));
    }
    /**
     * GET /pharmacy/prescriptions/:id
     */
    async get(id) {
        return this.svc.getPrescription(id);
    }
    /**
     * POST /pharmacy/prescriptions/:id/fulfill
     * Body: { items: [{ prescriptionItemId, quantity }] }
     */
    async fulfill(id, dto, req) {
        const pharmacistId = req.user?.id;
        return this.svc.fulfillPrescription(id, dto.items, pharmacistId);
    }
    /** GET /pharmacy/stock */
    async listStock(limit = '100', offset = '0', _loc) {
        return this.stockService.list(Number(limit), Number(offset));
    }
    /** POST /pharmacy/stock/:id/adjust */
    async adjustStock(id, dto, req) {
        const performedBy = req.user?.id;
        return this.stockService.adjustStock(id, dto.delta, dto.reason, performedBy);
    }
};
__decorate([
    Get('prescriptions'),
    Roles('Pharmacist', 'Admin'),
    __param(0, Query('limit')),
    __param(1, Query('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "listPending", null);
__decorate([
    Get('prescriptions/:id'),
    Roles('Pharmacist', 'Admin'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "get", null);
__decorate([
    Post('prescriptions/:id/fulfill'),
    Roles('Pharmacist', 'Admin'),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, FulfillPrescriptionDto, Object]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "fulfill", null);
__decorate([
    Get('stock'),
    Roles('Pharmacist', 'Admin'),
    __param(0, Query('limit')),
    __param(1, Query('offset')),
    __param(2, Query('location')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "listStock", null);
__decorate([
    Post('stock/:id/adjust'),
    Roles('Pharmacist', 'Admin'),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PharmacyController.prototype, "adjustStock", null);
PharmacyController = __decorate([
    Controller('pharmacy'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [PharmacyService, PharmacyStockService])
], PharmacyController);
export { PharmacyController };
//# sourceMappingURL=pharmacy.controller.js.map